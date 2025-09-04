"use client";

import { useState, useRef, useEffect } from "react";
import ImageDropZone from "./ImageDropZone";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
  referenceImage?: string;
}

export default function AnthropicChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI creative assistant. I can help you generate images, create content, and more. You can also upload reference images to iterate off of. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration issue by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (file: File) => {
    setReferenceImage(file);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Convert reference image to base64 if it exists
    let imageBase64 = null;
    if (referenceImage) {
      try {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(referenceImage);
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              // Remove the data:image/...;base64, prefix
              const base64 = reader.result.split(',')[1];
              resolve(base64);
            } else {
              reject(new Error('Failed to convert file to base64'));
            }
          };
          reader.onerror = error => reject(error);
        });
      } catch (error) {
        console.error("Error converting image to base64:", error);
        // Continue without the image
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      referenceImage: referenceImage ? URL.createObjectURL(referenceImage) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/anthropic-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages,
          referenceImage: imageBase64, // Send base64 instead of File object
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.content,
          timestamp: new Date(),
          imageUrl: result.imageUrl,
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Clear reference image after successful generation
        if (result.imageUrl) {
          setReferenceImage(null);
        }
      } else {
        const errorData = await response.json();
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorData.error}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            EUREKA AI Assistant
          </h2>
          <p className="text-gray-600">
            Powered by Anthropic Claude - Your intelligent creative partner
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          EUREKA AI Assistant
        </h2>
        <p className="text-gray-600">
          Powered by Anthropic Claude - Your intelligent creative partner
        </p>
      </div>

      {/* Reference Image Drop Zone */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">
          📸 Upload Reference Image (Optional)
        </h3>
        <ImageDropZone onImageUpload={handleImageUpload} />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              
              {/* Show reference image if user uploaded one */}
              {message.referenceImage && (
                <div className="mt-3">
                  <p className="text-xs opacity-70 mb-2">Reference image:</p>
                  <img
                    src={message.referenceImage}
                    alt="Reference image"
                    className="w-full h-auto rounded-lg border border-gray-200 max-h-32 object-cover"
                  />
                </div>
              )}
              
              {/* Show generated image */}
              {message.imageUrl && (
                <div className="mt-3">
                  <p className="text-xs opacity-70 mb-2">Generated image:</p>
                  <img
                    src={message.imageUrl}
                    alt="Generated content"
                    className="w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <p className="text-xs mt-2 opacity-70">
                {mounted ? message.timestamp.toLocaleTimeString() : ""}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe what you want to create, ask questions, or give me commands..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {referenceImage && (
              <span className="text-green-600">
                ✓ Reference image ready: {referenceImage.name}
              </span>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 text-sm font-semibold transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
