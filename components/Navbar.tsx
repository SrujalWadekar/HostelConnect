"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const MANAGER_THEME = {
  roleTitle: "Property Manager",
  roleTag: "Manager Mode",
  statusText: "Verified Host",
  badgeBg: "bg-amber-400/10 border-amber-400/25 text-amber-300",
  icon: "🏢",
  gradient: "from-amber-400 via-orange-500 to-rose-500",
  ring: "ring-amber-500/40",
  accentText: "text-amber-400",
  accentBg: "bg-amber-500/10",
  accentBorder: "border-amber-500/20",
  hoverBorder: "hover:border-amber-500/50",
  hoverBg: "hover:bg-amber-500/10",
  glow: "shadow-[0_20px_50px_rgba(245,158,11,0.2)]",
  lineGradient: "from-amber-400 via-orange-500 to-rose-500",
  navItems: [
    {
      title: "Dashboard",
      desc: "Overview & bed inventory control",
      href: "/dashboard/manager",
      tag: "Overview",
      tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      icon: (
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "List Property",
      desc: "Comprehensive form widget with sharing matrix",
      href: "/dashboard/manager/listings/new",
      tag: "New Form",
      tagColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      icon: (
        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: "Message Center",
      desc: "Direct student inquiries & real-time chat suite",
      href: "/dashboard/manager/messages",
      tag: "Live Chats",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Profile & Yield",
      desc: "Financial analytics, Aadhaar & asset settings",
      href: "/dashboard/manager/profile",
      tag: "Analytics",
      tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      icon: (
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ],
};

const STUDENT_THEME = {
  roleTitle: "Student Resident",
  roleTag: "Student Mode",
  statusText: "Active Searcher",
  badgeBg: "bg-cyan-400/10 border-cyan-400/25 text-cyan-300",
  icon: "🎓",
  gradient: "from-cyan-400 via-blue-500 to-indigo-600",
  ring: "ring-cyan-500/40",
  accentText: "text-cyan-400",
  accentBg: "bg-cyan-500/10",
  accentBorder: "border-cyan-500/20",
  hoverBorder: "hover:border-cyan-500/50",
  hoverBg: "hover:bg-cyan-500/10",
  glow: "shadow-[0_20px_50px_rgba(6,182,212,0.2)]",
  lineGradient: "from-cyan-400 via-blue-500 to-indigo-600",
  navItems: [
    {
      title: "Dashboard",
      desc: "Explore all listed properties & vacancies",
      href: "/dashboard/student",
      tag: "Listed Stays",
      tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      icon: (
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "Message Center",
      desc: "Chat directly with hostel & PG managers",
      href: "/dashboard/student/messages",
      tag: "Host Chats",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Profile",
      desc: "Personal details, +91 phone & settings",
      href: "/dashboard/student/profile",
      tag: "My Details",
      tagColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      icon: (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ],
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user as
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
      }
    | undefined;

  const isManager = user?.role?.toUpperCase() === "MANAGER";
  const theme = isManager ? MANAGER_THEME : STUDENT_THEME;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-900/30 bg-[#020617]/90 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3">
          {/* Logo — always goes to the main/home page */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 group-hover:scale-105">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>

            <div className="text-lg sm:text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-50">
              Hostel<span className="text-cyan-400">Connect</span>
            </div>
          </Link>

          {/* In-page / quick navigation links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#search-section"
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Search Stays
            </Link>
            <Link
              href="/#live-results"
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition"
            >
              Live Listings
            </Link>
            <Link
              href="/dashboard/manager"
              className="text-xs font-semibold text-amber-300/90 hover:text-amber-300 transition"
            >
              🏢 Manager Portal
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
            ) : session ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href={isManager ? "/dashboard/manager/messages" : "/dashboard/student/messages"}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 transition"
                  title="Open Message Center"
                >
                  <span>💬</span>
                  <span className="hidden sm:inline">Messages</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  {/* Profile Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex cursor-pointer items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pl-2 sm:pl-3.5 pr-2 transition-all hover:bg-white/[0.08] ${
                      dropdownOpen ? "border-cyan-400/50 bg-white/[0.08] ring-2 ring-cyan-500/20" : theme.hoverBorder
                    }`}
                  >
                  <div className="hidden flex-col items-end sm:flex">
                    <span className="text-sm font-semibold tracking-wide text-white">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>

                    <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accentText}`}>
                      {isManager ? "Manager" : "Student"}
                    </span>
                  </div>

                  {/* Role-styled avatar badge — consistent brand avatar */}
                  <div className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br ${theme.gradient} p-[2px] shadow-lg ${theme.glow}`}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#020617] text-sm font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#020617] text-[9px] ring-2 ring-[#020617]">
                      {theme.icon}
                    </span>
                  </div>

                  <svg
                    className={`ml-0.5 h-4 w-4 ${theme.accentText} transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className={`absolute right-0 top-full z-50 mt-3 w-[calc(100vw-2rem)] sm:w-84 max-w-sm rounded-2xl border border-white/10 bg-[#030712] ${theme.glow} shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden backdrop-blur-2xl`}>
                    {/* Top vibrant gradient accent line */}
                    <div className={`h-1 w-full bg-gradient-to-r ${theme.lineGradient}`} />

                    {/* Profile identity header */}
                    <div className="p-4 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        {/* Avatar ring */}
                        <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${theme.gradient} p-[2px] shadow-md shrink-0`}>
                          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#030712] text-lg font-bold text-white">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#030712] text-[10px] ring-1 ring-white/20">
                            {theme.icon}
                          </span>
                        </div>

                        {/* Name and email */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">
                            {user?.name || "User"}
                          </p>
                          <p className="truncate text-[11px] font-mono text-slate-400">
                            {user?.email || "user@hostelconnect.in"}
                          </p>
                        </div>
                      </div>

                      {/* Live status badge */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider ${theme.badgeBg}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {theme.roleTag}
                        </span>

                        <span className="text-[10px] font-medium text-slate-400">
                          {theme.statusText}
                        </span>
                      </div>
                    </div>

                    {/* Navigation list */}
                    <div className="p-2 space-y-1">
                      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Quick Shortcuts
                      </p>

                      {theme.navItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`group flex items-center justify-between rounded-xl p-2.5 transition-all text-slate-200 hover:text-white ${theme.hoverBg}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 group-hover:scale-105 transition-transform">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold leading-snug group-hover:text-white transition-colors">
                                {item.title}
                              </p>
                              <p className="truncate text-[11px] font-normal text-slate-400">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            <span className={`hidden sm:inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${item.tagColor}`}>
                              {item.tag}
                            </span>
                            <span className="text-slate-500 transition-transform group-hover:translate-x-0.5 text-xs font-bold">
                              →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-white/[0.08] p-2">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <span>Sign Out</span>
                        </div>
                        <span className="text-[10px] text-rose-400/60 font-mono">End Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="rounded-xl border border-cyan-500/30 bg-white/[0.04] px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-cyan-100 shadow-lg shadow-cyan-900/10 transition-all hover:bg-white/[0.08] hover:border-cyan-500/50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-cyan-600 px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition-all hover:bg-cyan-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}