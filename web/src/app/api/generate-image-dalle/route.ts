import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Use DALL-E 3 for image generation
    const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://eureka-ai-creative-studio.vercel.app",
                       "X-Title": "EUREKA AI Creative Studio",
      },
      body: JSON.stringify({
        model: "openai/dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter DALL-E API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DALL-E API response:", JSON.stringify(data, null, 2));
    
    // Extract the generated image URL
    const imageUrl = data.data?.[0]?.url;
    
    if (!imageUrl) {
      return NextResponse.json(
        { 
          error: "No image generated in response",
          response: data 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
      prompt,
      success: true,
    });

  } catch (error) {
    console.error("DALL-E image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
