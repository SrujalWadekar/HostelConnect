"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"STUDENT" | "MANAGER">("STUDENT");

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/");
  };

  // For demo: simulate login from dashboard buttons
  const handleLoginAsStudent = () => {
    setIsLoggedIn(true);
    setUserType("STUDENT");
    router.push("/dashboard/student");
  };

  const handleLoginAsManager = () => {
    setIsLoggedIn(true);
    setUserType("MANAGER");
    router.push("/dashboard/manager");
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          HostelConnect
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Signup
              </Link>
            </>
          )}

          {isLoggedIn && userType === "STUDENT" && (
            <>
              <Link
                href="/dashboard/student"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}

          {isLoggedIn && userType === "MANAGER" && (
            <>
              <Link
                href="/dashboard/manager"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-700 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}