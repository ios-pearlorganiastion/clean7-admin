"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ChevronDown,
  ContactRound,
  LayoutDashboard,
  LayoutGrid,
  Receipt,
  Settings,
  SlidersHorizontal,
  Truck,
  UserCog,
  Users,
  Wallet,
  BookOpen,
  Briefcase,
  Mail,
  Tag,
  Bike,
  GitFork,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  directorOnly?: boolean;
};

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/orders", label: "Orders", icon: Receipt },
      { href: "/delivery-trips", label: "Delivery trips", icon: Truck },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        href: "/branches",
        label: "Branches",
        icon: Building2,
        directorOnly: true,
      },
      {
        href: "/catalogue",
        label: "Services & Pricing",
        icon: LayoutGrid,
        directorOnly: true,
      },
      {
        href: "/branch-services",
        label: "Branch-wise Services",
        icon: GitFork,
        directorOnly: true,
      },
      {
        href: "/coupons",
        label: "Coupons",
        icon: Tag,
        directorOnly: true,
      },
      {
        href: "/schedule-overrides",
        label: "Schedule overrides",
        icon: SlidersHorizontal,
        directorOnly: true,
      },
      { href: "/blogs", label: "Blogs", icon: BookOpen, directorOnly: true },
    ],
  },
  {
    title: "People & customers",
    items: [
      { href: "/operators", label: "Operators", icon: Users },
      { href: "/riders", label: "Riders", icon: Bike },
      { href: "/careers", label: "Careers", icon: Briefcase, directorOnly: true },
      {
        href: "/branch-admins",
        label: "Branch Admins",
        icon: UserCog,
        directorOnly: true,
      },
      { href: "/users", label: "Users", icon: ContactRound },
      { href: "/newsletters", label: "Newsletters", icon: Mail, directorOnly: true },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        href: "/payments",
        label: "Payments",
        icon: Wallet,
        directorOnly: true,
      },
    ],   
  },
  {
    title: "Account",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminNav({
  collapsed = false,
  onNavigate,
  role,    
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  role: UserRole;
}) { 
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((g) => [g.title, true])),
  );

  return (  
    <nav className="space-y-4">     
      {navGroups.map((group) => {
        const sectionOpen = collapsed ? true : openGroups[group.title];
        const visibleItems = group.items.filter(
          (item) => !item.directorOnly || role === "DIRECTOR",
        );
   
        if (visibleItems.length === 0) {
          return null;  
        }
      
        const itemLinks = visibleItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={`${group.title}-${item.label}`}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onNavigate}
              className={`group flex items-center rounded-2xl text-[14px] leading-snug transition-all ${
                collapsed
                  ? "justify-center w-11 h-11 mx-auto"
                  : "gap-2.5 px-3 py-2.5 mx-2"
              } ${
                active
                  ? /* Active: Light mode me Cream Pill + Dark Amber Text | Dark mode me Dark Amber Pill + Bright Gold Text */
                    "border-2 border-amber-400/90 bg-gradient-to-r from-[#fefbf3] via-[#fbf5e5] to-[#f9eed5] shadow-sm shadow-amber-200/40 dark:border-amber-400/80 dark:bg-none dark:bg-[#251c13] dark:shadow-[0_0_15px_-3px_rgba(251,191,36,0.2)]"
                  : /* Inactive: Light mode me Dark Slate (#334155) | Dark mode me Bright Slate (#cbd5e1) */
                    "border-transparent text-slate-700 hover:border-amber-300/60 hover:bg-amber-50 hover:text-amber-950 dark:text-slate-300 dark:hover:bg-amber-500/10 dark:hover:text-amber-200"
              }`}
            >
              {/* Icon Container */}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  active
                    ? "border-amber-300/90 bg-white text-amber-700 shadow-xs dark:border-amber-400/50 dark:bg-amber-950/80 dark:text-amber-300"
                    : "border-amber-200/50 bg-amber-50/80 text-amber-700 group-hover:border-amber-300/60 group-hover:bg-white group-hover:text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400 dark:group-hover:border-amber-400/50 dark:group-hover:bg-amber-900/50 dark:group-hover:text-amber-200"
                }`}
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0"
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden
                />
              </span>

              {/* Text Label: Dono modes ke liye accurate contrast */}
              {!collapsed ? (
                <span
                  className={`truncate ${
                    active
                      ? "font-bold text-amber-950 dark:text-amber-100"
                      : "font-medium text-slate-700 group-hover:text-amber-950 dark:text-slate-200 dark:group-hover:text-amber-200"
                  }`}
                >
                  {item.label}
                </span>
              ) : null}
            </Link>
          );
        });

        return (
          <div key={group.title} className="space-y-1">
            {!collapsed ? (
              <button
                type="button"
                aria-expanded={sectionOpen}
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.title]: !prev[group.title],
                  }))
                }
                className="group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left transition-colors hover:bg-amber-100/60 dark:hover:bg-amber-500/15"
              >
                {/* Section Titles (OPERATIONS, ORGANIZATION, etc.) */}
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-800 group-hover:text-amber-950 dark:text-amber-400 dark:group-hover:text-amber-300">
                  {group.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-amber-700/90 transition-transform duration-300 ease-out group-hover:text-amber-950 dark:text-amber-400/90 dark:group-hover:text-amber-300 motion-reduce:transition-none ${
                    sectionOpen ? "rotate-0" : "-rotate-90"
                  }`}
                  strokeWidth={2.4}
                  aria-hidden
                />
              </button>
            ) : null}

            {!collapsed ? (
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0 ${
                  sectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                inert={sectionOpen ? undefined : true}
              >
                <div className="min-h-0">
                  <div className="space-y-1">{itemLinks}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">{itemLinks}</div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function isActivePath(pathname: string, href: string) {
  if (pathname === href) return true;

  if (href === "/dashboard") {
    return (
      pathname === "/" ||
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/")
    );
  }

  if (href === "/branches") {
    return (
      pathname.startsWith("/branches/") &&
      !pathname.startsWith("/branches/create")
    );
  }

  if (href === "/branch-admins") {
    return (
      pathname === "/branch-admins" || pathname.startsWith("/branch-admins/")
    );
  }

  if (href === "/catalogue") {
    return pathname === "/catalogue" || pathname.startsWith("/catalogue/");
  }

  if (href === "/branch-services") {
    return (
      pathname === "/branch-services" ||
      pathname.startsWith("/branch-services/") ||
      pathname === "/geo-overrides" ||
      pathname.startsWith("/geo-overrides/")
    );
  }

  if (href === "/blogs") {
    return pathname === "/blogs" || pathname.startsWith("/blogs/");
  }

  if (href === "/users" || href === "/customers") {
    return (
      pathname === "/users" ||
      pathname.startsWith("/users/") ||
      pathname === "/customers" ||
      pathname.startsWith("/customers/")
    );
  }

  if (href === "/payments") {
    return pathname === "/payments" || pathname.startsWith("/payments/");
  }

  if (href === "/settings") {
    return pathname === "/settings" || pathname.startsWith("/settings/");
  }

  if (href === "/careers") {
    return pathname === "/careers" || pathname.startsWith("/careers/");
  }

  if (href === "/newsletters") {
    return pathname === "/newsletters" || pathname.startsWith("/newsletters/");
  }

  return pathname.startsWith(`${href}/`);
}