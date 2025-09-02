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

    // Note: Gemini Flash might be for image analysis, not generation
    // For image generation, consider using models like:
    // - "openai/dall-e-3"
    // - "anthropic/claude-3-5-sonnet"
    // - "midjourney/diffusion"
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "UPHORIC AI Creative Studio",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Generate a creative image based on this description: ${prompt}. Please create a high-quality, artistic image that perfectly captures the essence of this prompt.`
              }
            ]
          }
        ],
        max_tokens: 2048,
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Full API response for debugging:", JSON.stringify(data, null, 2));
    
    // For Gemini Flash image generation, the response should contain the generated image
    // The exact format may vary, so we'll need to handle different response structures
    let imageUrl = null;
    
    // Try to extract image from different possible response formats
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // If content is an array, look for image objects
      if (Array.isArray(content)) {
        const imageObj = content.find(item => item.type === "image_url");
        if (imageObj?.image_url?.url) {
          imageUrl = imageObj.image_url.url;
        }
      }
      // If content is a string, it might contain a base64 image or URL
      else if (typeof content === "string") {
        // Look for URLs or base64 data in the text
        const urlMatch = content.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }
    }
    
    if (!imageUrl) {
      return NextResponse.json(
        { 
          error: "No image generated in response. This model might be for image analysis, not generation.",
          suggestion: "Try using 'openai/dall-e-3' or 'anthropic/claude-3-5-sonnet' for image generation",
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
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
