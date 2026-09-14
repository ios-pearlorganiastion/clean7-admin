"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DirectorRouteGate } from "@/components/admin/director-route-gate";
import { AdminNav } from "@/components/admin/nav";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { LogoutButton } from "@/components/admin/logout-button";
import { breadcrumbsForPath } from "@/lib/breadcrumbs";
import type { AuthUser } from "@/lib/types";
import pkg from "../../package.json";

function userInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser;
}) {
  const pathname = usePathname();
  const breadcrumbItems = useMemo(
    () => breadcrumbsForPath(pathname),
    [pathname],
  );
  const displayName = user.name || user.email;
  const panelLabel =
    user.role === "DIRECTOR" ? "Director's Panel" : "Branch Admin's Panel";
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("admin-sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-[100svh] overflow-hidden bg-[var(--app-canvas)]">
      {/* Desktop Sidebar with Light Golden accents */}
      <aside
        className={`hidden shrink-0 flex-col z-20 border-r border-[var(--border-soft)] bg-surface transition-[width] duration-300 ease-out lg:flex ${
          collapsed ? "w-[84px]" : "w-[312px]"
        }`}
      >
        <DesktopSidebar
          collapsed={collapsed}
          displayName={displayName}
          userInitials={userInitials(displayName)}
          role={user.role}
          panelLabel={panelLabel}   
          version={pkg.version}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </aside>

      {/* Mobile Backdrop Overlay with warm blur */}
      <div
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(316px,92vw)] flex-col overflow-hidden border-r border-[var(--border-soft)] bg-surface shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileSidebar
          displayName={displayName}
          userInitials={userInitials(displayName)}
          role={user.role}
          panelLabel={panelLabel}
          version={pkg.version}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main Workspace Area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--workspace-bg)]">
        <AdminTopBar
          items={breadcrumbItems}
          onOpenNav={() => setMobileOpen(true)}
        />
        <main className="admin-content-scroll flex-1 overflow-y-auto p-3 md:p-4">
          <div className="admin-workspace-type min-h-full rounded-[32px] border border-[var(--border-soft)] bg-surface px-4 py-4 shadow-sm md:px-5 md:py-5">
            <DirectorRouteGate user={user}>{children}</DirectorRouteGate>
          </div>
        </main>
      </div>
    </div>
  );
}

function DesktopSidebar({
  collapsed,
  displayName,
  userInitials,
  role,
  panelLabel,
  version,
  onToggle,
}: {
  collapsed: boolean;
  displayName: string;
  userInitials: string;
  role: AuthUser["role"];
  panelLabel: string;
  version: string;
  onToggle: () => void;
}) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Top Header Logo */}
        <div className="flex min-h-[var(--admin-header-height)] shrink-0 items-center border-b border-[var(--border-soft)] px-3 py-3 md:py-3.5">
          {collapsed ? (
            <div className="flex w-full justify-center">
              <button
                type="button"
                aria-label="Expand sidebar"
                onClick={onToggle}
                className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-amber-400/10 hover:border-amber-400/30"
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Clean7 Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <ChevronRight
                    className="h-5 w-5 text-amber-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                {/* Light Gold Logo Box */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/15 via-amber-300/10 to-amber-500/5 border border-amber-400/30 p-1 shadow-sm">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Clean7 Logo"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-display text-[16px] font-bold leading-tight tracking-[-0.02em] text-foreground">
                      Clean7
                    </p>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  </div>
                  <p className="truncate text-[12px] leading-tight text-amber-600 dark:text-amber-400 font-medium">
                    {panelLabel} · <span className="text-text-muted">v{version}</span>
                  </p>
                </div>
              </div>

              {/* Light Golden Hover Collapse Button */}
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={onToggle}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-surface text-text-secondary transition hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          )}
        </div>

        {/* Navigation area */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 thin-scrollbar">
          <AdminNav collapsed={collapsed} role={role} />
        </div>
      </div>

      {/* User Profile Footer in Light Golden Theme */}
      <div
        className={`border-t border-[var(--border-soft)] bg-surface-muted/60 p-3.5 ${
          collapsed ? "px-2 py-4" : ""
        } relative`}
      >
        <div
          className={`flex items-center ${collapsed ? "flex-col justify-center gap-3" : "gap-3"}`}
        >
          {/* Light Golden Metallic Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ecd58e] via-[#cfa84a] to-[#b3892c] text-[13px] font-black text-white shadow-[0_2px_10px_rgba(207,168,74,0.3)] ring-2 ring-amber-300/40">
            {userInitials}
          </div>

          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-[12px] font-semibold text-amber-600 dark:text-amber-400">
                  {panelLabel}
                </p>
              </div>
              <LogoutButton compact={false} />
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              <LogoutButton compact align="left" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MobileSidebar({
  displayName,
  userInitials,
  role,
  panelLabel,
  version,
  onClose,
}: {
  displayName: string;
  userInitials: string;
  role: AuthUser["role"];
  panelLabel: string;
  version: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex min-h-[var(--admin-header-height)] shrink-0 items-center border-b border-[var(--border-soft)] px-4 py-3 md:py-3.5">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              {/* Light Gold Logo Box */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/15 via-amber-300/10 to-amber-500/5 border border-amber-400/30 p-1 shadow-sm">
                <Image
                  src="/images/logo/logo.png"
                  alt="Clean7 Logo"
                  width={32}
                  height={32}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-display text-[16px] font-bold leading-tight tracking-[-0.02em] text-foreground">
                    Clean7
                  </p>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                </div>
                <p className="truncate text-[12px] leading-tight text-amber-600 dark:text-amber-400 font-medium">
                  {panelLabel} · <span className="text-text-muted">v{version}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-surface text-text-secondary transition hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        {/* Mobile Nav area */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 thin-scrollbar">
          <AdminNav onNavigate={onClose} role={role} />
        </div>
      </div>

      {/* Mobile Footer in Light Golden */}
      <div className="border-t border-[var(--border-soft)] bg-surface-muted/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ecd58e] via-[#cfa84a] to-[#b3892c] text-[13px] font-black text-white shadow-[0_2px_10px_rgba(207,168,74,0.3)] ring-2 ring-amber-300/40">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-[12px] font-semibold text-amber-600 dark:text-amber-400">
              {panelLabel}
            </p>
          </div>
          <LogoutButton compact={false} />
        </div>
      </div>
    </>
  );
}