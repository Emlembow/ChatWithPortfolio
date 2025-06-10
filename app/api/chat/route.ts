import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { buildSystemPrompt } from "@/lib/system-prompt-bundled"
import OpenAI from "openai"
import { validateEnv, env } from "@/lib/env"

// Use nodejs runtime to support fs module
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let message, messages
    try {
      const body = await request.json()
      message = body.message
      messages = body.messages || []

      // Validate message
      if (!message || typeof message !== "string") {
        return new NextResponse(JSON.stringify({ error: "Message is required and must be a string" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    } catch (e) {
      return new NextResponse(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get system prompt with enhanced error handling
    let systemPrompt: string
    try {
      console.log('Attempting to build system prompt...')
      systemPrompt = await buildSystemPrompt()
      console.log('System prompt built successfully')
    } catch (error) {
      console.error('Failed to build system prompt:', error)
      return new NextResponse(
        JSON.stringify({
          error: "Service temporarily unavailable",
          details: `Failed to build system prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
          debug: process.env.NODE_ENV === 'development' ? {
            stack: error instanceof Error ? error.stack : 'No stack trace available'
          } : undefined
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Validate environment variables
    try {
      validateEnv()
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          error: "Configuration error",
          details: error instanceof Error ? error.message : "Invalid configuration",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    })

    // Build conversation messages for chat completions API
    const conversationMessages = [
      {
        role: "system" as const,
        content: systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user" as const,
        content: message
      }
    ]

    // Make request to OpenAI chat completions API
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
    })

    // Extract the response text
    const responseText = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."

    // Create a simple JSON response instead of streaming
    return new NextResponse(
      JSON.stringify({
        response: responseText,
        success: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error("Error processing chat request:", error)
    
    // Determine if this is a system prompt error or other error
    const isSystemPromptError = error instanceof Error && error.message.includes('system prompt')
    const statusCode = isSystemPromptError ? 503 : 500
    
    return new NextResponse(
      JSON.stringify({
        error: isSystemPromptError ? "Service temporarily unavailable" : "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        errorType: isSystemPromptError ? "system_prompt_error" : "general_error",
        debug: process.env.NODE_ENV === 'development' ? {
          stack: error instanceof Error ? error.stack : 'No stack trace available',
          timestamp: new Date().toISOString()
        } : undefined
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

