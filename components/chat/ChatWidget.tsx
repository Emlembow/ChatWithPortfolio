"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { X, MessageSquare, Send, SplitIcon as LayoutSplit, ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

// System message to show initially
const SYSTEM_MESSAGE: Message = {
  id: "system-1",
  role: "system",
  content: "Tired of reading resumes? Just ask me about Alex Jordan",
}

export default function ChatWidget() {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [dimensions, setDimensions] = useState({
    maxHeight: "500px",
    messageContainerHeight: "360px",
  })
  const [isMobileView, setIsMobileView] = useState(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  // New state for badge and bubble
  const [unreadCount, setUnreadCount] = useState(1)
  const [showBubble, setShowBubble] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatPanelRef = useRef<HTMLDivElement>(null)

  // Get split view state from global window object
  const isSplitView = typeof window !== "undefined" && window.splitViewState?.isSplitView
  const toggleSplitView = typeof window !== "undefined" ? window.splitViewState?.toggleSplitView : undefined

  // Detect mobile viewport
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkViewportSize = () => {
      setIsMobileView(window.innerWidth < 640) // Common breakpoint for mobile
    }

    checkViewportSize()
    window.addEventListener("resize", checkViewportSize)
    return () => window.removeEventListener("resize", checkViewportSize)
  }, [])

  // Detect keyboard open on mobile
  useEffect(() => {
    if (typeof window === "undefined" || !isMobileView) return

    const detectKeyboard = () => {
      // A significant height reduction might indicate keyboard is open
      const viewportHeight = window.innerHeight
      const windowHeight = window.outerHeight
      setIsKeyboardOpen(viewportHeight < windowHeight * 0.75)
    }

    window.addEventListener("resize", detectKeyboard)
    return () => window.removeEventListener("resize", detectKeyboard)
  }, [isMobileView])

  // Calculate dimensions based on viewport
  useEffect(() => {
    if (typeof window === "undefined") return

    const updateDimensions = () => {
      // If in mobile view, use full height
      if (isMobileView) {
        const viewportHeight = window.innerHeight
        const messageContainerHeight = viewportHeight - (isKeyboardOpen ? 120 : 140) // Adjust for keyboard

        setDimensions({
          maxHeight: "100%",
          messageContainerHeight: `${messageContainerHeight}px`,
        })
        return
      }

      // If in split view, use full height
      if (isSplitView) {
        setDimensions({
          maxHeight: "100%",
          messageContainerHeight: "calc(100vh - 140px)", // Subtract header and input heights
        })
        return
      }

      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const isMobile = viewportWidth < 640 // sm breakpoint in Tailwind

      // Calculate bottom margin based on device
      const bottomMargin = isMobile ? 80 : 20

      // Calculate max height (capped at 500px for desktop, 70% of viewport for mobile)
      const maxHeightValue = isMobile
        ? Math.min(500, Math.floor(viewportHeight * 0.7))
        : Math.min(500, viewportHeight - bottomMargin)

      // Header (60px) + Input area (80px) + Margins
      const nonMessageHeight = 140
      const messageContainerHeightValue = maxHeightValue - nonMessageHeight

      setDimensions({
        maxHeight: `${maxHeightValue}px`,
        messageContainerHeight: `${messageContainerHeightValue}px`,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [isSplitView, isMobileView, isKeyboardOpen])

  // Load messages from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const storedMessages = sessionStorage.getItem("chatMessages")

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      } else {
        // If no stored messages, initialize with system message
        setMessages([SYSTEM_MESSAGE])
      }
    } catch (e) {
      console.error("Failed to load chat state:", e)
      // Reset storage if corrupted
      sessionStorage.removeItem("chatMessages")
      // Initialize with system message
      setMessages([SYSTEM_MESSAGE])
    }
  }, [])

  // Save chat state to sessionStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined") return

    if (messages.length > 0) {
      sessionStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingText])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the animation completes first
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])


  // Show bubble after delay
  useEffect(() => {
    // Only schedule if user hasn't clicked yet
    if (unreadCount > 0) {
      const timer = window.setTimeout(() => {
        setShowBubble(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  // Toggle chat open/closed
  const toggleChat = useCallback(() => {
    setIsOpen(!isOpen)
    setError(null)
    setUnreadCount(0) // Clear badge
    setShowBubble(false) // Hide bubble

    // When opening on mobile, prevent body scrolling
    if (isMobileView && !isOpen) {
      document.body.style.overflow = "hidden"
    } else if (isMobileView) {
      document.body.style.overflow = ""
    }
  }, [isOpen, isMobileView])


  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setError(null)
    setIsLoading(true)
    // Show typing indicator immediately
    setIsTyping(true)
    setTypingText("")


    let apiResponseTimeout: NodeJS.Timeout | undefined

    try {
      console.log("Sending message to API:", {
        message: userMessage.content,
      })

      // Use the correct API endpoint path
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
        }),
      })

      console.log("API response status:", response.status)

      // Set a timeout to show a fallback typing indicator if the API is slow
      apiResponseTimeout = setTimeout(() => {
        if (isTyping && !typingText) {
          setTypingText("I'm thinking about your question...")
        }
      }, 1000)

      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      // Handle the new simple JSON response format
      const data = await response.json()
      
      if (data.success && data.response) {
        setIsTyping(false)
        
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
        }
        setMessages((prev) => [...prev, assistantMessage])
        setTypingText("")
        setRetryCount(0)
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError(err instanceof Error ? err.message : "Failed to send message")
      setIsTyping(false)
    } finally {
      setIsLoading(false)
      if (apiResponseTimeout) {
        clearTimeout(apiResponseTimeout)
      }
    }
  }

  // Ensure proper Markdown formatting, especially for dash-style bullet points
  const ensureProperMarkdown = (text: string): string => {
    if (!text) return ""

    // Normalize line endings
    let processed = text.replace(/\r\n/g, "\n")

    // Fix dash-style bullet points that don't have proper line breaks before them
    // This looks for patterns where a dash bullet point doesn't have a preceding blank line
    processed = processed.replace(/([^\n])\n(- )/g, "$1\n\n$2")

    // Fix numbered lists that don't have proper line breaks
    processed = processed.replace(/([^\n])\n(\d+\. )/g, "$1\n\n$2")

    // Ensure headings have proper line breaks before them
    processed = processed.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2")

    // Remove excessive line breaks (more than 2 consecutive)
    processed = processed.replace(/\n{3,}/g, "\n\n")

    // Ensure proper spacing for list items
    processed = processed.replace(/(- .+)\n(?![\n-])/g, "$1\n\n")

    return processed
  }

  // Handle key press in input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Add visual feedback when clicking the send button
  const handleSendButtonClick = () => {
    if (!input.trim() || isLoading) return

    // Add visual feedback
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      button.classList.add("bg-blue-800")
      setTimeout(() => {
        button.classList.remove("bg-blue-800")
      }, 150)
    }

    handleSendMessage()
  }

  // Reset the chat
  const resetChat = () => {
    setMessages([SYSTEM_MESSAGE]) // Reset with system message
    setError(null)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("chatMessages")
    }
  }

  // Render message with proper Markdown formatting
  const renderMessage = (content: string) => {
    // Pre-process content to ensure proper list formatting
    let processedContent = content

    // Ensure bullet points have proper spacing
    processedContent = processedContent.replace(/^(- .+)$/gm, (match) => {
      return match
    })

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-3" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-md font-bold mb-2 mt-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 mt-3" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !className || !className.includes('language-')
            return !isInline ? (
              <pre className="bg-slate-700 p-2 rounded my-2 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          },
          pre: ({ node, ...props }) => <pre className="bg-slate-700 p-2 rounded my-2 overflow-x-auto" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-slate-600 pl-4 italic my-2" {...props} />
          ),
          strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-4 border-slate-600" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-slate-700" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="bg-slate-800" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-slate-700" {...props} />,
          th: ({ node, ...props }) => <th className="px-2 py-1 text-left font-medium" {...props} />,
          td: ({ node, ...props }) => <td className="px-2 py-1" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    )
  }

  // Don't render the chat bubble in split view mode
  if (isSplitView) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-blue-600">
          <h3 className="font-semibold text-white">Alex Jordan's AI Assistant</h3>
          <div className="flex gap-2">
            {toggleSplitView && (
              <button
                onClick={toggleSplitView}
                className="p-1 text-white hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-white"
                aria-label="Full View"
                title="Full View"
              >
                <LayoutSplit size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-grow flex flex-col">

          {/* Messages */}
          <div className="p-4 overflow-y-auto flex-grow">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">
                <p>Hi, I'm Alex Jordan's AI assistant. How can I help you today?</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : message.role === "system"
                          ? "bg-green-600 text-white"
                          : "bg-slate-800 text-white border border-slate-700"
                    }`}
                  >
                    {message.role === "user" ? message.content : renderMessage(message.content)}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-4 text-left">
                <div className="inline-block p-3 rounded-lg bg-slate-800 text-white border border-slate-700">
                  {typingText ? (
                    renderMessage(typingText)
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 text-center">
                <div className="inline-block p-3 rounded-lg bg-red-600 text-white text-sm">{error}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 bg-slate-800 text-white rounded-l-lg focus:outline-none border border-slate-700 border-r-0"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                onClick={handleSendButtonClick}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat bubble - hide when in mobile view and chat is open */}
      {!(isMobileView && isOpen) && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* Chat bubble that appears after delay */}
          <div
            className="absolute -top-20 right-0 bg-white text-slate-800 rounded-lg shadow-lg p-3 mb-2 w-64 text-sm animate-chat-bubble cursor-pointer hover:bg-gray-50"
            onClick={toggleChat}
            style={{
              transformOrigin: "bottom right",
            }}
            role="status"
            aria-live="polite"
          >
            Tired of reading resumes? Just ask me about Alex Jordan
            <div className="absolute bottom-0 right-4 w-4 h-4 bg-white transform rotate-45 translate-y-2"></div>
          </div>

          {/* Chat button with badge */}
          <button
            onClick={toggleChat}
            className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative"
            aria-label={isOpen ? "Close chat" : "Open chat"}
            aria-expanded={isOpen}
            aria-controls="chat-panel"
          >
            <MessageSquare size={24} aria-hidden="true" />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                aria-label="1 unread message"
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat panel */}
      <div
        id="chat-panel"
        ref={chatPanelRef}
        className={`fixed ${
          isMobileView ? "inset-0" : "right-4 bottom-20"
        } bg-slate-900 text-white shadow-xl z-50 border-2 border-blue-600 ${
          isOpen ? "" : "opacity-0 pointer-events-none"
        } overflow-hidden ${isMobileView ? "rounded-none" : "rounded-lg"} ${
          isMobileView ? "transition-transform duration-300 ease-out" : "transition-all duration-300 ease-in-out"
        }`}
        style={{
          width: isMobileView ? "100%" : "24rem",
          maxHeight: isMobileView ? "100%" : dimensions.maxHeight,
          height: isOpen ? (isMobileView ? "100%" : "auto") : "0",
          transform: isMobileView && !isOpen ? "translateY(100%)" : "translateY(0)",
        }}
        role="dialog"
        aria-labelledby="chat-heading"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-blue-600">
          <h3 id="chat-heading" className="font-semibold text-white">
            Alex Jordan's AI Assistant
          </h3>
          <div className="flex gap-2">
            {toggleSplitView && !isMobileView && (
              <button
                onClick={toggleSplitView}
                className="p-1 text-white hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-white"
                aria-label="Split View"
                title="Split View"
              >
                <LayoutSplit size={18} aria-hidden="true" />
              </button>
            )}
            <button
              onClick={toggleChat}
              className={`p-1 text-white hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-white ${
                isMobileView ? "p-2" : "p-1"
              }`}
              aria-label="Close chat"
              title="Close chat"
            >
              {isMobileView ? <ArrowLeft size={24} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div>

          {/* Messages */}
          <div
            className={`p-4 overflow-y-auto ${isMobileView ? "pb-6" : ""}`}
            style={{ height: dimensions.messageContainerHeight }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">
                <p>Hi, I'm Alex Jordan's AI assistant. How can I help you today?</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : message.role === "system"
                          ? "bg-green-600 text-white"
                          : "bg-slate-800 text-white border border-slate-700"
                    }`}
                  >
                    {message.role === "user" ? message.content : renderMessage(message.content)}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="mb-4 text-left">
                <div className="inline-block p-3 rounded-lg bg-slate-800 text-white border border-slate-700">
                  {typingText ? (
                    renderMessage(typingText)
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 text-center">
                <div className="inline-block p-3 rounded-lg bg-red-600 text-white text-sm">{error}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t border-slate-700 ${isMobileView ? "sticky bottom-0 bg-slate-900" : ""}`}>
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={`flex-1 p-2 bg-slate-800 text-white rounded-l-lg focus:outline-none border border-slate-700 border-r-0 ${
                  isMobileView ? "text-base h-12" : ""
                }`}
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                onClick={handleSendButtonClick}
                disabled={!input.trim() || isLoading}
                className={`bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isMobileView ? "px-4 h-12" : "p-2"
                }`}
                aria-label="Send message"
              >
                <Send size={isMobileView ? 24 : 20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
