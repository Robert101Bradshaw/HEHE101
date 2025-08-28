"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";
  const isDark = active === "dark";
  return (
    <button aria-label="Toggle theme" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 hover:bg-white/10" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? "Light" : "Dark"} mode
    </button>
  );
}
