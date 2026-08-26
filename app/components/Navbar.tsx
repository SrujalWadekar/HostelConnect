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
    <nav className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6">
        
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg shadow-md shadow-blue-500/20 transition group-hover:scale-105">
            🏠
          </div>

          <div>
            <p className="text-xl font-extrabold tracking-tight text-slate-900">
              Hostel<span className="text-blue-600">Connect</span>
            </p>
            <p className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              FIND YOUR PERFECT STAY
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-1 md:flex">
          {!isLoggedIn && (
            <>
              <Link
                href="/"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                Home
              </Link>

              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="ml-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40"
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
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                Dashboard
              </Link>

              <div className="mx-3 h-7 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm">
                  {userType === "STUDENT" ? "🎓" : "🏠"}
                </div>

                <div className="mr-2 hidden lg:block">
                  <p className="text-xs font-bold text-slate-700">
                    {userType === "STUDENT" ? "Student" : "Manager"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    HostelConnect
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {!isLoggedIn && (
              <>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  🏠 Home
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  🔐 Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-bold text-white"
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
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
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