import { type NextRequest, NextResponse } from "next/server"
import { Anthropic } from "@anthropic-ai/sdk"

// Initialize Anthropic client with better error handling
const anthropicApiKey = process.env.ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!anthropicApiKey) {
      console.error("Missing ANTHROPIC_API_KEY environment variable")
      return NextResponse.json({ error: "API configuration error", details: "Missing API key" }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log("Calling Claude API with prompt length:", prompt.length)

    // Call Claude API with better error handling
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      system: `You are a specialized AI assistant that helps match patients with therapists.
Your task is to analyze patient needs, preferences, and therapist characteristics to determine compatibility.
Always respond in valid JSON format as specified in the user's prompt.
Base your analysis on psychological best practices and evidence-based approaches to therapeutic relationships.
Consider factors such as therapeutic approach, specialization areas, personal compatibility, and demographic preferences.
Do not invent information not provided in the input data.`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    // Parse Claude's response to ensure it's valid JSON
    try {
      const responseContent = response.content[0].text
      console.log("Claude response received, length:", responseContent.length)

      // Extract JSON from response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/)

      if (!jsonMatch) {
        console.error("Could not extract JSON from Claude response")
        return NextResponse.json(
          {
            error: "Invalid response format",
            details: "Could not extract JSON from Claude response",
            rawResponse: responseContent.substring(0, 200) + "...", // Log part of the response for debugging
          },
          { status: 500 },
        )
      }

      const jsonResponse = JSON.parse(jsonMatch[0])
      return NextResponse.json({ matches: jsonResponse.matches || jsonResponse }, { status: 200 })
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse Claude response",
          details: parseError instanceof Error ? parseError.message : String(parseError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error calling Claude API:", error)
    return NextResponse.json(
      {
        error: "Failed to call Claude API",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
