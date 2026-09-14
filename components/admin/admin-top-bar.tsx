"use client";

import { HelpCircle, Menu, Sparkles } from "lucide-react";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { BreadcrumbBar } from "@/components/ui/breadcrumb-bar";
import { ThemeToggle } from "@/components/admin/theme-toggle";

type AdminTopBarProps = {
  items: BreadcrumbItem[];
  onOpenNav?: () => void;
};

export function AdminTopBar({ items, onOpenNav }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b-2 border-amber-300/80 bg-gradient-to-r from-[#fefbf3] via-[#fbf5e5] to-[#f9eed5] shadow-md shadow-amber-200/40 backdrop-blur-md dark:border-amber-400/20 dark:bg-none dark:bg-[#12100d] dark:shadow-none">
      <div className="flex min-h-[var(--admin-header-height)] items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-3.5">
        
        {/* Left: Mobile Nav Button & Breadcrumbs */}
        <div className="flex min-w-0 items-center gap-3">
          {onOpenNav ? (
            <button
              type="button"    
              aria-label="Open navigation"
              onClick={onOpenNav}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-amber-300/90 bg-white text-amber-700 shadow-sm transition-all hover:bg-amber-500 hover:text-white active:scale-95 lg:hidden dark:border-amber-400/40 dark:bg-[#1e1914] dark:text-amber-300"
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden />
            </button>
          ) : null}

          {/* Breadcrumb wrapper - Solid Dark background in night mode */}
          <div className="flex items-center rounded-xl border-2 border-amber-300/80 bg-white px-3.5 py-1.5 shadow-xs transition-colors dark:border-amber-400/40 dark:bg-[#1e1914]">
            <BreadcrumbBar 
              items={items} 
              className="min-w-0 font-semibold 
                /* Light Mode: Dark Brown text on White */
                text-amber-950 [&_*]:text-amber-950 [&_a]:text-amber-800 [&_a:hover]:text-amber-600 [&_svg]:text-amber-500/70
                
                /* Dark Mode: Crisp Golden Amber text on Dark Pill */
                dark:text-amber-200 dark:[&_*]:text-amber-200 dark:[&_a]:text-amber-300 dark:[&_a:hover]:text-amber-100 dark:[&_svg]:text-amber-400/80" 
            />
          </div>
        </div>

        {/* Right: Status Pill, Theme Toggle, and Help */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Admin Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-gradient-to-r from-[#ecd58e] via-[#cfa84a] to-[#b3892c] px-3 py-1 text-xs font-bold text-white shadow-sm shadow-amber-500/25">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Admin</span>
          </div>

          {/* Theme Toggle Wrapper */}
          <div className="flex items-center rounded-xl border-2 border-amber-300/80 bg-white p-1 text-amber-700 shadow-sm dark:border-amber-400/40 dark:bg-[#1e1914] dark:text-amber-300">
            <ThemeToggle />
          </div>

          {/* Help Button */}
          <button
            type="button"
            aria-label="Help"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-amber-300/90 bg-white text-amber-700 shadow-sm transition-all hover:border-amber-500 hover:bg-amber-500 hover:text-white active:scale-95 dark:border-amber-400/40 dark:bg-[#1e1914] dark:text-amber-300 dark:hover:bg-amber-500 dark:hover:text-white"
            title="Help & Support"
          >
            <HelpCircle className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}