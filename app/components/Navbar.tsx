"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"STUDENT" | "MANAGER">("STUDENT");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="w-full border-b border-cyan-500/20 bg-slate-950/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6">

        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
            🏠
          </div>

          <div>
            <p className="text-xl font-extrabold tracking-tight text-white">
              Hostel<span className="text-cyan-400">Connect</span>
            </p>

            <p className="hidden text-[10px] font-medium tracking-widest text-slate-400 sm:block">
              FIND YOUR PERFECT STAY
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-2 md:flex">
          {!isLoggedIn && (
            <>
              <Link
                href="/"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                Home
              </Link>

              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="ml-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-500/40"
              >
                Get Started →
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                href={
                  userType === "STUDENT"
                    ? "/dashboard/student"
                    : "/dashboard/manager"
                }
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                Dashboard
              </Link>

              <div className="mx-3 h-7 w-px bg-slate-700" />

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-sm ring-1 ring-cyan-400/30">
                  {userType === "STUDENT" ? "🎓" : "🏠"}
                </div>

                <div className="mr-2 hidden lg:block">
                  <p className="text-xs font-bold text-white">
                    {userType === "STUDENT" ? "Student" : "Manager"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    HostelConnect
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl text-cyan-400 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 shadow-2xl md:hidden">
          <div className="flex flex-col gap-2">
            {!isLoggedIn && (
              <>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  🏠 Home
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  🔐 Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Create Account →
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link
                  href={
                    userType === "STUDENT"
                      ? "/dashboard/student"
                      : "/dashboard/manager"
                  }
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-400"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}