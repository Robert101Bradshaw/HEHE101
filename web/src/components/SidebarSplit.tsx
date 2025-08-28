"use client";

import React from "react";

type SplitViewProps = {
  mainUrl: string;
  sidebarUrl: string;
  mainLabel?: string;
  sidebarLabel?: string;
  side?: "right" | "left";
  minSidebarPx?: number;
  defaultSidebarPx?: number;
};

export default function SidebarSplit({
  mainUrl,
  sidebarUrl,
  mainLabel = "HEHE",
  sidebarLabel = "Sidebar",
  side = "right",
  minSidebarPx = 260,
  defaultSidebarPx = 380,
}: SplitViewProps) {
  const layoutRef = React.useRef<HTMLDivElement | null>(null);
  const [sidebarPx, setSidebarPx] = React.useState<number>(defaultSidebarPx);
  const [mainFallback, setMainFallback] = React.useState(false);
  const [sidebarFallback, setSidebarFallback] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setMainFallback(true), 2500);
    const t2 = setTimeout(() => setSidebarFallback(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = layoutRef.current?.getBoundingClientRect();
    if (!rect) return;
    const onMove = (ev: MouseEvent) => {
      const relX = ev.clientX - rect.left;
      let next = side === "right" ? rect.width - relX : relX;
      next = Math.max(minSidebarPx, Math.min(rect.width * 0.66, next));
      setSidebarPx(next);
      document.body.style.userSelect = "none";
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const gridTemplate =
    side === "right"
      ? `minmax(0,1fr) 10px ${sidebarPx}px`
      : `${sidebarPx}px 10px minmax(0,1fr)`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-4 w-4 rounded-sm bg-gradient-to-br from-violet-500 to-sky-400" />
          <span className="font-medium">Editor + Sidebar</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10" onClick={() => window.open(mainUrl, "_blank", "noopener,noreferrer")}>Open {mainLabel}</button>
          <button className="rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10" onClick={() => window.open(sidebarUrl, "_blank", "noopener,noreferrer")}>Open {sidebarLabel}</button>
        </div>
      </div>
      <div ref={layoutRef} className="grid h-[70vh]" style={{ gridTemplateColumns: gridTemplate }}>
        {side === "left" && <Pane url={sidebarUrl} label={sidebarLabel} fallback={sidebarFallback} />}
        <div role="separator" aria-orientation="vertical" className="cursor-col-resize bg-white/10" onMouseDown={onMouseDown} />
        {side === "right" ? (
          <>
            <MainPane url={mainUrl} label={mainLabel} fallback={mainFallback} />
            <Pane url={sidebarUrl} label={sidebarLabel} fallback={sidebarFallback} />
          </>
        ) : (
          <MainPane url={mainUrl} label={mainLabel} fallback={mainFallback} />
        )}
      </div>
    </div>
  );
}

function MainPane({ url, label, fallback }: { url: string; label: string; fallback: boolean }) {
  return (
    <div className="relative order-1">
      <iframe title={label} src={url} className="h-full w-full" referrerPolicy="no-referrer" />
      {fallback && <Fallback url={url} label={label} />}
    </div>
  );
}

function Pane({ url, label, fallback }: { url: string; label: string; fallback: boolean }) {
  return (
    <div className="relative order-3">
      <iframe title={label} src={url} className="h-full w-full" referrerPolicy="no-referrer" />
      {fallback && <Fallback url={url} label={label} />}
    </div>
  );
}

function Fallback({ url, label }: { url: string; label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0b0e14] text-zinc-300">
      <div className="pointer-events-auto flex flex-col items-center gap-2 text-center">
        <div className="text-sm">Embedding may be blocked or require auth.</div>
        <a className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10" href={url} target="_blank" rel="noopener noreferrer">Open {label}</a>
      </div>
    </div>
  );
}
