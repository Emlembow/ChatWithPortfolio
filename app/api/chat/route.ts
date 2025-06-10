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

    // Get system prompt
    const systemPrompt = await buildSystemPrompt()

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
    return new NextResponse(
      JSON.stringify({
        error: "Service temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

