import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to query generation stats for cost tracking
async function getGenerationStats(generationId: string): Promise<any> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch(`https://openrouter.ai/api/v1/generation?id=${generationId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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

// Function to analyze image using Gemini Flash through OpenRouter
async function analyzeImageWithGemini(imageBase64: string, userMessage: string): Promise<string> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "EUREKA AI Creative Studio",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and provide creative insights. User request: ${userMessage}. 

Please provide a comprehensive analysis covering:

**Visual Analysis:**
- Composition and layout structure
- Color palette and color usage patterns
- Lighting and shadow effects
- Depth and perspective

**Artistic Elements:**
- Style and artistic techniques used
- Visual elements and subject matter
- Mood and emotional impact
- Cultural or artistic references

**Technical Assessment:**
- Image quality and resolution
- Technical execution details
- Professional vs. amateur characteristics

**Creative Insights:**
- What makes this image effective
- Areas for potential improvement
- Creative suggestions for iteration
- Style transfer possibilities

Please be specific and provide actionable creative feedback.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high" // Request high detail analysis
                }
              }
            ]
          }
        ],
        max_tokens: 1500, // Increased for more detailed analysis
        temperature: 0.7, // Balanced creativity and accuracy
        top_p: 0.9, // High quality responses
        stream: false // Disable streaming for this analysis
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw new Error("Failed to analyze image with Gemini");
    }

    const data = await response.json();
    
    // Check for OpenRouter error response
    if (data.choices && data.choices[0]?.error) {
      const error = data.choices[0].error;
      console.error("OpenRouter API error:", error);
      throw new Error(`OpenRouter API error: ${error.message} (Code: ${error.code})`);
    }

    // Check finish reason
    const choice = data.choices[0];
    if (choice?.finish_reason === "length") {
      console.warn("Image analysis was truncated due to length limits");
    } else if (choice?.finish_reason === "content_filter") {
      console.warn("Image analysis was filtered due to content policies");
    }

    // Log usage for cost tracking
    if (data.usage) {
      console.log("OpenRouter usage:", {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens,
        model: data.model
      });
    }

    // Query detailed generation stats for cost tracking
    if (data.id) {
      setTimeout(async () => {
        const stats = await getGenerationStats(data.id);
        if (stats) {
          console.log("Detailed generation stats:", stats);
        }
      }, 1000); // Wait a bit for stats to be available
    }

    return choice?.message?.content || "Image analysis completed but no detailed response received.";
  } catch (error) {
    console.error("Gemini image analysis error:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, referenceImage } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    if (referenceImage && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured for image analysis" },
        { status: 500 }
      );
    }

    let content = null;
    let imageUrl = null;

    // If there's a reference image, analyze it with Gemini first
    if (referenceImage) {
      try {
        // The referenceImage should already be base64 from the client
        let imageBase64 = referenceImage;
        
        // If it's not already base64, we need to handle it differently
        if (typeof referenceImage === 'object' && referenceImage.type) {
          // This is a File object from the client - we need to get the base64 data
          // The client should send the base64 data instead of the File object
          throw new Error("Please send the image as base64 data from the client");
        }
        
        const imageAnalysis = await analyzeImageWithGemini(imageBase64, message);
        
        // Now use Anthropic to provide a creative response based on the analysis
        const systemPrompt = `You are an intelligent AI creative assistant for EUREKA AI Creative Studio. 

IMPORTANT: The user has uploaded a reference image that has been analyzed by Gemini AI. Here's the analysis:

${imageAnalysis}

Based on this analysis, provide creative insights, suggestions, and help the user with their creative project. Be specific about what you see in the image and how it relates to their request.`;

        const anthropicResponse = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2048,
          messages: [
            {
              role: "user" as const,
              content: systemPrompt + "\n\nUser message: " + message
            }
          ],
        });

        content = anthropicResponse.content[0];
      } catch (error) {
        console.error("Image analysis error:", error);
        // Fallback to text-only response
        const fallbackResponse = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user" as const,
              content: `I'm sorry, I encountered an error while analyzing your reference image: ${error.message}. Please try again or ask me a question without the image. User message: ${message}`
            }
          ],
        });
        content = fallbackResponse.content[0];
      }
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
        model: "claude-3-5-sonnet-20241022",
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
          const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/generate-image-dalle`, {
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
              model: "claude-3-5-sonnet-20241022",
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
