"use client";

import { useState } from "react";
import Image from "next/image";

interface HeheOutput {
  videoUrl?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export default function HehePanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<HeheOutput | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOut(null);
    const res = await fetch("/api/hehe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
    const json = await res.json();
    setOut(json);
    setLoading(false);
  }

  const mediaUrl = out?.videoUrl || out?.imageUrl;

  return (
    <div className="space-y-4">
      <form onSubmit={run} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-2 text-center">
            [REDACTED] your [REDACTED]
          </label>
          <input 
            id="prompt"
            className="w-full rounded-lg border border-border bg-surface-secondary px-4 py-3 text-foreground placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors text-center" 
            placeholder="[REDACTED] a [REDACTED] scene..." 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
          />
        </div>
        <button 
          disabled={loading || !prompt} 
          className="w-full rounded-lg bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-accent-secondary hover:to-accent transition-all duration-200 shadow-lg"
        >
          {loading ? "[REDACTED]…" : "[REDACTED]"}
        </button>
      </form>
      
      {mediaUrl && mediaUrl.endsWith(".mp4") && (
        <div className="mt-6">
          <video src={mediaUrl} controls className="w-full rounded-lg border border-border bg-surface-secondary" />
        </div>
      )}
      
      {mediaUrl && !mediaUrl.endsWith(".mp4") && (
        <div className="mt-6">
          <div className="rounded-lg border border-border bg-surface-secondary overflow-hidden">
            <Image 
              src={mediaUrl} 
              alt="[REDACTED] output" 
              width={800}
              height={600}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      )}
      
      {out && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-2 text-center">[REDACTED] Response:</h3>
          <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-surface-secondary p-4 text-xs text-muted font-mono">
            {JSON.stringify(out, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
