import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to query generation stats for cost tracking
async function getGenerationStats(generationId: string): Promise<unknown> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch(`https://openrouter.ai/api/v1/generation?id=${generationId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://eureka-ai-creative-studio.vercel.app",
        "X-Title": "EUREKA AI Creative Studio",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch generation stats");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching generation stats:", error);
    return null;
  }
}

// Image analysis temporarily disabled due to model compatibility issues
// Will be re-enabled once correct Gemini model is identified

export async function POST(request: NextRequest) {
  try {
    const { message, referenceImage } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    if (referenceImage && !process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY not configured for image analysis");
      return NextResponse.json(
        { error: "Image analysis service temporarily unavailable. Please try without uploading an image." },
        { status: 503 }
      );
    }

    let content = null;
    let imageUrl = null;

    // If there's a reference image, provide a helpful response
    if (referenceImage) {
      // For now, provide a simple response about the uploaded image
      const systemPrompt = `You are an intelligent AI creative assistant for EUREKA AI Creative Studio. 

The user has uploaded a reference image and is asking: "${message}"

Please provide creative insights and suggestions based on their request. Let them know that you can see they've uploaded an image and you're ready to help with their creative project.`;

      const anthropicResponse = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2048,
        messages: [
          {
            role: "user" as const,
            content: systemPrompt
          }
        ],
      });

      content = anthropicResponse.content[0];
    } else {
      // No reference image - use Anthropic for regular chat
      const systemPrompt = `You are an intelligent AI creative assistant for EUREKA AI Creative Studio. You can:

1. Generate images using DALL-E 3 when users request them
2. Analyze creative content and provide insights
3. Help users with creative projects and ideas
4. Engage in natural conversation about art, design, and creativity

When users want to generate images, provide detailed, creative prompts and then call the image generation API.
When analyzing content, provide valuable insights and creative feedback.
Always be helpful, creative, and professional.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2048,
        messages: [
          {
            role: "user" as const,
            content: systemPrompt + "\n\nUser message: " + message
          }
        ],
      });

      content = response.content[0];

      // Check if the user wants to generate an image
      if (content.type === "text" && 
          (message.toLowerCase().includes("generate") || 
           message.toLowerCase().includes("create") || 
           message.toLowerCase().includes("image") ||
           message.toLowerCase().includes("picture") ||
           message.toLowerCase().includes("make") ||
           message.toLowerCase().includes("design"))) {
        
        try {
          let prompt = message;
          if (!message.includes("image") && !message.includes("picture")) {
            prompt = `Create an image based on: ${message}`;
          }

          // Call the image generation API
          const imageResponse = await fetch(`${request.nextUrl.origin}/api/generate-image-dalle`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: prompt,
            }),
          });

          if (imageResponse.ok) {
            const imageResult = await imageResponse.json();
            imageUrl = imageResult.imageUrl;
            
            // Get final response from Anthropic about the generated image
            const finalResponse = await anthropic.messages.create({
              model: "claude-3-5-sonnet-20240620",
              max_tokens: 1024,
              messages: [
                {
                  role: "user" as const,
                  content: `I've generated an image based on your request: "${prompt}". Please provide a creative description of what was generated and any suggestions for improvements.`
                }
              ],
            });

            content = finalResponse.content[0];
          }
        } catch (error) {
          console.error("Image generation error:", error);
        }
      }
    }

    // Extract text content
    let textContent = "";
    if (content && content.type === "text") {
      textContent = content.text;
    }

    return NextResponse.json({
      content: textContent,
      imageUrl,
      success: true,
    });

  } catch (error) {
    console.error("API error:", error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = "An unexpected error occurred. Please try again.";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Service configuration issue. Please try again later.";
        statusCode = 503;
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
        statusCode = 503;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
