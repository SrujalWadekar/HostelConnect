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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === "MANAGER") {
      router.push("/dashboard/manager");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyan-50 px-4 py-12">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

        {/* LEFT SIDE - LOGIN FORM */}
        <div className="p-8 sm:p-12">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-bold text-slate-950"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              🏠
            </span>
            Hostel<span className="text-cyan-600">Connect</span>
          </Link>

          <div className="mt-10">
            <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              Welcome back 👋
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
              Sign in to your account
            </h1>

            <p className="mt-3 text-slate-500">
              Continue your journey and find the perfect place to stay.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">

            {/* USER TYPE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                I am a
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("STUDENT")}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    userType === "STUDENT"
                      ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                      : "border-slate-200 bg-white hover:border-cyan-300"
                  }`}
                >
                  <div className="text-xl">🎓</div>
                  <p className="mt-2 font-bold text-slate-900">
                    Student
                  </p>
                  <p className="text-xs text-slate-500">
                    Find accommodation
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("MANAGER")}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    userType === "MANAGER"
                      ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                      : "border-slate-200 bg-white hover:border-cyan-300"
                  }`}
                >
                  <div className="text-xl">🏠</div>
                  <p className="mt-2 font-bold text-slate-900">
                    Manager
                  </p>
                  <p className="text-xs text-slate-500">
                    Manage properties
                  </p>
                </button>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  ✉️
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-cyan-600 hover:text-cyan-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* REMEMBER / FORGOT */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-cyan-500"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-800"
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              Sign In →
            </button>
          </form>

          {/* SIGNUP */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-cyan-600 hover:text-cyan-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative glow */}
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
              ✨ Student accommodation made simple
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight">
              Your perfect
              <span className="block text-cyan-400">
                student stay
              </span>
              is waiting.
            </h2>

            <p className="mt-5 leading-7 text-slate-300">
              Discover verified hostels and PGs near your college without
              brokers, hidden fees, or unnecessary hassle.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
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

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur">
                <p className="font-bold text-cyan-300">500+</p>
                <p className="text-xs text-slate-400">Properties</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur">
                <p className="font-bold text-cyan-300">10K+</p>
                <p className="text-xs text-slate-400">Students</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur">
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