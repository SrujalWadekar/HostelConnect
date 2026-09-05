"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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

  const isManager =
    user?.role?.toUpperCase() === "MANAGER" || pathname.startsWith("/dashboard/manager");

  const profilePath = isManager
    ? "/dashboard/manager/profile"
    : "/dashboard/student/profile";

  const dashboardPath = isManager
    ? "/dashboard/manager"
    : "/dashboard/student";

  // Close dropdown when clicking outside
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

            <div className="text-lg sm:text-xl font-black tracking-tight text-white transition-colors group-hover:text-cyan-50">
              Hostel<span className="text-cyan-400">Connect</span>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-2 sm:gap-3 rounded-2xl border border-cyan-500/15 bg-white/[0.04] p-1.5 pl-2 sm:pl-3.5 pr-2 transition-all hover:border-cyan-500/40 hover:bg-white/[0.08]"
                >
                  <div className="hidden flex-col items-end sm:flex">
                    <span className="text-sm font-bold tracking-wide text-white">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      {isManager ? "Manager" : "Student"}
                    </span>
                  </div>

                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-900/40"
                    />
                  ) : (
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-900/40">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#020617] text-sm font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    </div>
                  )}

                  <svg
                    className={`ml-0.5 h-4 w-4 text-cyan-400 transition-transform duration-200 ${
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
                  <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-64 rounded-2xl border border-cyan-500/30 bg-[#020617] p-3 shadow-2xl shadow-cyan-950/80 animate-in fade-in zoom-in-95">
                    <div className="mb-2 rounded-xl border border-cyan-500/20 bg-cyan-950/40 p-3">
                      <p className="truncate text-xs font-bold text-white">
                        {user?.name}
                      </p>

                      <p className="mt-0.5 truncate font-mono text-[11px] text-cyan-300/60">
                        {user?.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={dashboardPath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 transition-all hover:bg-cyan-500/15 hover:text-white"
                      >
                        <span className="text-base">🎛️</span>
                        <div>
                          <p className="leading-tight">Dashboard</p>
                          <p className="text-[10px] font-normal text-slate-400">
                            Main workspace
                          </p>
                        </div>
                      </Link>

                      <Link
                        href={profilePath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 transition-all hover:bg-cyan-500/15 hover:text-white"
                      >
                        <span className="text-base">👤</span>
                        <div>
                          <p className="leading-tight">My Profile</p>
                          <p className="text-[10px] font-normal text-slate-400">
                            {isManager ? "Portfolio & Earnings" : "Stays & Requests"}
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="mt-2 border-t border-cyan-950/60 pt-2">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <span className="text-base">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
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