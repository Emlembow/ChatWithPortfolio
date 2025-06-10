"use client"

import React from "react"
import { useState, useEffect, useRef, type ReactNode } from "react"
import { GripVertical } from "lucide-react"

interface SplitLayoutProps {
  chat: ReactNode
  main: ReactNode
}

export default function SplitLayout({ chat, main }: SplitLayoutProps) {
  const [isSplitView, setIsSplitView] = useState(false)
  const [chatWidth, setChatWidth] = useState("350px")
  const [isDragging, setIsDragging] = useState(false)
  const [isHandleHovered, setIsHandleHovered] = useState(false)
  const [mainWidthPx, setMainWidthPx] = useState(0)
  const [isNarrow, setIsNarrow] = useState(false)
  const MIN_CHAT = 350 // Minimum chat panel width
  const containerRef = useRef<HTMLDivElement>(null)
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const initialX = useRef<number>(0)
  const initialWidth = useRef<number>(0)

  // Toggle split view mode
  const toggleSplitView = () => {
    setIsSplitView(!isSplitView)
  }

  // Start dragging the divider
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    initialX.current = e.clientX
    initialWidth.current = Number.parseInt(chatWidth.replace("px", ""), 10)

    // Add dragging class to body for cursor consistency
    if (typeof document !== "undefined") {
      document.body.classList.add("dragging-divider")
    }
  }

  // Update main pane width measurement
  const updateMainPaneWidth = () => {
    if (mainPaneRef.current) {
      const width = mainPaneRef.current.clientWidth
      setMainWidthPx(width)
      setIsNarrow(width < 640)
    }
  }

  // Measure main pane width on mount and window resize
  useEffect(() => {
    updateMainPaneWidth()

    const handleResize = () => {
      updateMainPaneWidth()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }

    return undefined
  }, [isSplitView])

  // Handle mouse movement during drag
  useEffect(() => {
    if (typeof window === "undefined") return undefined

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - initialX.current

      // Recompute container width so we never collapse the main pane below 640px
      const containerW = containerRef.current?.clientWidth ?? window.innerWidth
      const MAX_CHAT = containerW - 640
      const raw = initialWidth.current + deltaX
      const newWidth = Math.max(MIN_CHAT, Math.min(MAX_CHAT, raw))

      setChatWidth(`${newWidth}px`)

      // Update main pane width after a short delay to ensure the DOM has updated
      setTimeout(updateMainPaneWidth, 10)
    }

    const onMouseUp = () => {
      setIsDragging(false)
      // Final measurement after drag ends
      updateMainPaneWidth()

      // Remove dragging class from body
      document.body.classList.remove("dragging-divider")
    }

    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.classList.remove("dragging-divider")
    }
  }, [isDragging])

  // Expose split view state and toggle function to the chat component
  useEffect(() => {
    // Make the split view state and toggle function available globally
    if (typeof window !== "undefined") {
      window.splitViewState = {
        isSplitView,
        toggleSplitView,
        isNarrow,
      }

      return () => {
        delete window.splitViewState
      }
    }

    return undefined
  }, [isSplitView, isNarrow])

  // Clone the main content and inject the isContainerNarrow prop
  const enhancedMain = React.isValidElement(main) ? React.cloneElement(main, { isContainerNarrow: isNarrow } as any) : main

  if (!isSplitView) {
    // Normal mode: render main content with chat overlay
    return (
      <>
        {enhancedMain}
        {chat}
      </>
    )
  }

  // Split view mode
  return (
    <div
      // ALWAYS row: never stack chat on top
      className="split-container flex flex-row h-screen overflow-hidden"
      ref={containerRef}
    >
      {/* Chat panel */}
      <div
        className="flex-shrink-0 overflow-hidden flex flex-col bg-slate-900 min-w-[350px]"
        // always use the px value we're dragging, never 100%
        style={{ width: chatWidth }}
      >
        {chat}
      </div>

      {/* Always show the draggable divider */}
      <div
        className={`divider relative flex items-center justify-center w-2 bg-blue-600 cursor-col-resize hover:bg-blue-400 active:bg-blue-400 transition-colors select-none ${
          isDragging ? "bg-blue-400" : ""
        }`}
        onMouseDown={startDrag}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Number.parseInt(chatWidth.replace("px", ""), 10)}
        aria-valuemin={MIN_CHAT}
        aria-valuemax={containerRef.current?.clientWidth ? containerRef.current.clientWidth - 640 : 800}
        aria-label="Resize chat panel"
      >
        {/* Visible handle - smaller and more subtle */}
        <div
          className={`absolute flex items-center justify-center h-16 w-4 -ml-1 rounded-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-500 shadow-sm transition-all ${
            isDragging || isHandleHovered ? "divider-handle-active" : ""
          }`}
          onMouseEnter={() => setIsHandleHovered(true)}
          onMouseLeave={() => setIsHandleHovered(false)}
          onMouseDown={startDrag}
          aria-hidden="true"
        >
          <GripVertical className="text-white h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* Main content - now with ref to measure width */}
      <div ref={mainPaneRef} className="flex-grow overflow-auto">
        {enhancedMain}
      </div>
    </div>
  )
}

// Add type definition for the global window object
declare global {
  interface Window {
    splitViewState?: {
      isSplitView: boolean
      toggleSplitView: () => void
      isNarrow: boolean
    }
  }
}
