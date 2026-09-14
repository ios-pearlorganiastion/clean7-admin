"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "admin-color-scheme";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored === "dark" ? true : stored === "light" ? false : prefersDark;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-surface-muted/80 p-1 shadow-sm backdrop-blur-sm"
      role="group"
      aria-label="Color theme"
    >
      {/* Light Theme Button */}
      <button
        type="button"
        aria-pressed={!dark}
        aria-label="Light theme"
        onClick={() => setDark(false)}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
          !dark
            ? "bg-gradient-to-br from-[#ecd58e] via-[#cfa84a] to-[#b3892c] text-white shadow-[0_2px_8px_rgba(207,168,74,0.35)] ring-1 ring-amber-300/40"
            : "text-text-muted hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-400"
        }`}
      >
        <Sun className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </button>

      {/* Dark Theme Button */}
      <button
        type="button"
        aria-pressed={dark}
        aria-label="Dark theme"
        onClick={() => setDark(true)}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
          dark
            ? "bg-gradient-to-br from-[#ecd58e] via-[#cfa84a] to-[#b3892c] text-white shadow-[0_2px_8px_rgba(207,168,74,0.35)] ring-1 ring-amber-300/40"
            : "text-text-muted hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-400"
        }`}
      >
        <Moon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}