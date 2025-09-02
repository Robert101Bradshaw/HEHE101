"use client";

import { useState } from "react";
import SidebarSwitcher from "@/components/SidebarSwitcher";
import HehePanel from "@/components/HehePanel";
import AnthropicChat from "@/components/AnthropicChat";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"chat" | "simple">("chat");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Home Button - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <button className="rounded-lg bg-gray-100 border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm">
          🏠 Home
        </button>
      </div>

      {/* Centered Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <h1 className="mb-8 text-8xl font-black tracking-tighter text-red-600 sm:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none">
            EUREKA
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-red-500 sm:text-2xl font-medium">
            AI Creative Studio
          </p>
          <p className="mx-auto mb-12 max-w-xl text-lg text-gray-600">
            Create stunning AI content, end‑to‑end, in one canvas. Professional-grade tools with cinematic precision.
          </p>
        </div>
      </section>

      {/* Interface Tabs */}
      <section className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🤖 AI Chat Interface
          </button>
          <button
            onClick={() => setActiveTab("simple")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "simple"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ✨ Simple Input
          </button>
        </div>
      </section>

      {/* Dynamic Interface Based on Tab */}
      {activeTab === "chat" ? (
        /* Anthropic AI Chat Interface */
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <AnthropicChat />
        </section>
      ) : (
        /* Simple Input Interface */
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Creative Interface
            </h2>
            <p className="text-gray-600">
              Describe your vision and create here
            </p>
          </div>
          
          {/* Simple Input Box */}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Imagine...
              </label>
              <textarea 
                id="prompt"
                className="w-full h-24 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none text-base"
                placeholder="Describe your creative vision here..." 
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-start gap-3">
              <button className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-medium transition-colors duration-200">
                Generate
              </button>
              <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                1:1
              </button>
              <button className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                ↻
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </main>
  );
}
