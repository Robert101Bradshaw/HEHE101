"use client";

import { useState } from "react";

export default function HehePanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<any>(null);

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
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <form onSubmit={run} className="flex flex-col gap-2">
        <input className="rounded-md border border-white/10 bg-[#0b0e14] px-3 py-2 text-sm text-zinc-100" placeholder="Describe your scene…" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button disabled={loading || !prompt} className="rounded-md bg-gradient-to-br from-violet-500 to-sky-400 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">{loading ? "Generating…" : "Generate"}</button>
      </form>
      {mediaUrl && mediaUrl.endsWith(".mp4") && (<video src={mediaUrl} controls className="mt-4 w-full rounded-lg border border-white/10" />)}
      {mediaUrl && !mediaUrl.endsWith(".mp4") && (<img src={mediaUrl} alt="HEHE output" className="mt-4 w-full rounded-lg border border-white/10" />)}
      {out && (<pre className="mt-4 max-h-72 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 text-xs">{JSON.stringify(out, null, 2)}</pre>)}
    </div>
  );
}
