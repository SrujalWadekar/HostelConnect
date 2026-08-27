"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#020617]/80 border-b border-cyan-900/30 shadow-2xl shadow-cyan-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Interactive Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 group-hover:scale-105 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="font-black text-xl tracking-tight text-white group-hover:text-cyan-50 transition-colors">
              Hostel<span className="text-cyan-400">Connect</span>
            </div>
          </Link>

          {/* Center: Live Workspace Indicator */}
          {session && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/20 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-cyan-200">
                Manager Workspace
              </span>
            </div>
          )}

          {/* Right: Hover Profile Dropdown */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
            ) : session ? (
              <div className="relative group py-2">
                {/* Profile Trigger Button */}
                <div className="flex items-center gap-3 bg-white/[0.04] p-1.5 pl-3.5 pr-2 rounded-2xl border border-cyan-500/15 group-hover:border-cyan-500/40 group-hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-white tracking-wide">
                      {session.user?.name || "Manager"}
                    </span>
                    <span className="text-[10px] text-cyan-200/50 font-medium tracking-wider">
                      {session.user?.email}
                    </span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-900/40 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || "M"}
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-300 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu (Opens on Hover) */}
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#020617] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/80 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform group-hover:translate-y-0 translate-y-2">
                  
                  {/* Dropdown Header */}
                  <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/20 mb-2">
                    <p className="text-xs font-bold text-white truncate">{session.user?.name}</p>
                    <p className="text-[11px] text-cyan-300/60 truncate font-mono">{session.user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    {/* Performance & Loss Analytics */}
                    <Link
                      href="/dashboard/manager/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-cyan-500/15 hover:border-cyan-500/30 border border-transparent transition-all group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="leading-tight">Performance & Yield</p>
                        <p className="text-[10px] text-slate-400 font-normal">Track revenue, savings & vacancy loss</p>
                      </div>
                    </Link>

                    {/* Hostel Management */}
                    <Link
                      href="/dashboard/manager"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-cyan-500/15 hover:border-cyan-500/30 border border-transparent transition-all group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover/item:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="leading-tight">Hostel Operations</p>
                        <p className="text-[10px] text-slate-400 font-normal">Manage listings and applications</p>
                      </div>
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="mt-2 pt-2 border-t border-cyan-950/60">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}