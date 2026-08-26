"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"STUDENT" | "MANAGER">("STUDENT");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userType === "MANAGER") {
      router.push("/dashboard/manager");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyan-50 px-4 py-10 sm:px-6">
      {/* BACKGROUND DECORATIONS */}
      <div className="login-orb-1 pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="login-orb-2 pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="login-form-panel p-7 sm:p-10 lg:p-12">

          {/* LOGO */}
          <Link
            href="/"
            className="login-logo group inline-flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg shadow-lg shadow-cyan-500/25 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
              🏠
            </div>

            <div>
              <p className="text-xl font-black tracking-tight text-slate-950">
                Hostel<span className="text-cyan-600">Connect</span>
              </p>

              <p className="text-[10px] font-semibold tracking-widest text-slate-400">
                FIND YOUR PERFECT STAY
              </p>
            </div>
          </Link>

          {/* HEADING */}
          <div className="login-heading mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
              <span className="animate-wave">👋</span>
              Welcome back
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Sign in to your
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                account.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Continue your journey and discover the perfect accommodation
              for your student life.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="login-form mt-8 space-y-5"
          >

            {/* USER TYPE */}
            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">
                I am logging in as
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* STUDENT */}
                <button
                  type="button"
                  onClick={() => setUserType("STUDENT")}
                  className={`group rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    userType === "STUDENT"
                      ? "border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-100"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl transition-transform duration-300 group-hover:scale-110">
                      🎓
                    </div>

                    {userType === "STUDENT" && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  <p className="mt-3 font-bold text-slate-900">
                    Student
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Find accommodation
                  </p>
                </button>

                {/* MANAGER */}
                <button
                  type="button"
                  onClick={() => setUserType("MANAGER")}
                  className={`group rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    userType === "MANAGER"
                      ? "border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-100"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl transition-transform duration-300 group-hover:scale-110">
                      🏠
                    </div>

                    {userType === "MANAGER" && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">
                        ✓
                      </div>
                    )}
                  </div>

                  <p className="mt-3 font-bold text-slate-900">
                    Manager
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage properties
                  </p>
                </button>
              </div>
            </div>

            {/* EMAIL */}
            <div className="login-field">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
                  ✉️
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-cyan-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-field-delay">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-16 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-cyan-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600 transition hover:text-cyan-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* REMEMBER / FORGOT */}
            <div className="login-field-delay-2 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-cyan-500"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-bold text-cyan-600 transition hover:text-cyan-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign In
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>

              <span className="absolute inset-0 translate-x-[-100%] bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>

          {/* SIGNUP */}
          <p className="login-signup mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-cyan-600 transition hover:text-cyan-800 hover:underline"
            >
              Create an account →
            </Link>
          </p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="login-right-panel relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* GLOW */}
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          {/* TOP */}
          <div className="relative">
            <div className="login-badge inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
              ✨ Student accommodation made simple
            </div>

            <h2 className="login-title mt-10 text-4xl font-black leading-tight">
              Your perfect
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                student stay
              </span>
              is waiting.
            </h2>

            <p className="login-description mt-5 max-w-md leading-7 text-slate-300">
              Discover verified hostels and PGs near your college without
              brokers, hidden fees, or unnecessary hassle.
            </p>
          </div>

          {/* FEATURES */}
          <div className="relative mt-12 space-y-4">

            <div className="login-feature flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                🛡️
              </div>

              <div>
                <p className="font-bold">Verified Properties</p>
                <p className="text-sm text-slate-400">
                  Safe and trusted accommodation
                </p>
              </div>
            </div>

            <div className="login-feature-delay flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                💰
              </div>

              <div>
                <p className="font-bold">No Broker Fees</p>
                <p className="text-sm text-slate-400">
                  Connect directly with managers
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="login-stats grid grid-cols-3 gap-3 pt-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <p className="font-bold text-cyan-300">500+</p>
                <p className="text-xs text-slate-400">Properties</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <p className="font-bold text-cyan-300">10K+</p>
                <p className="text-xs text-slate-400">Students</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                <p className="font-bold text-cyan-300">4.8★</p>
                <p className="text-xs text-slate-400">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}