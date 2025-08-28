"use client";

import React from "react";
import SidebarSplit from "@/components/SidebarSplit";

type Sidebar = "morphic" | "openrouter" | "github";

export default function SidebarSwitcher({ mainUrl }: { mainUrl: string }) {
  const [tab, setTab] = React.useState<Sidebar>("morphic");
  const morphicUrl = "https://studio.morphic.com/editor/0198e790-9147-728d-a61c-51ebbfe0d13e/copilot";
  const openrouterUrl = "https://openrouter.ai/?ref=openrouter.com";
  const githubUrl = "https://github.com/Robert101Bradshaw/HEHE101";

  const { sidebarUrl, sidebarLabel } =
    tab === "morphic"
      ? { sidebarUrl: morphicUrl, sidebarLabel: "Morphic Copilot" }
      : tab === "openrouter"
      ? { sidebarUrl: openrouterUrl, sidebarLabel: "OpenRouter" }
      : { sidebarUrl: githubUrl, sidebarLabel: "GitHub: HEHE101" };

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-md border border-white/10 bg-white/5 p-1">
        <button className={`px-3 py-1.5 text-sm rounded ${tab === "morphic" ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"}`} onClick={() => setTab("morphic")}>Morphic</button>
        <button className={`px-3 py-1.5 text-sm rounded ${tab === "openrouter" ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"}`} onClick={() => setTab("openrouter")}>OpenRouter</button>
        <button className={`px-3 py-1.5 text-sm rounded ${tab === "github" ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"}`} onClick={() => setTab("github")}>GitHub</button>
      </div>

      <SidebarSplit
        mainUrl={mainUrl}
        mainLabel="HEHE (local)"
        sidebarUrl={sidebarUrl}
        sidebarLabel={sidebarLabel}
        side="right"
      />
    </div>
  );
}
