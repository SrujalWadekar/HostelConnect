"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [userType, setUserType] = useState<"STUDENT" | "MANAGER">("STUDENT");

  const handleGoogleSignIn = () => {
    const callbackUrl =
      userType === "MANAGER" ? "/dashboard/manager" : "/dashboard/student";

    signIn("google", { callbackUrl });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyan-50 px-4 py-10 sm:px-6">
      <div className="login-orb-1 pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="login-orb-2 pointer-events-none absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">
        <div className="login-form-panel flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <Link href="/" className="login-logo group inline-flex items-center gap-3">
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
              Continue your journey and discover the perfect accommodation for your student life.
            </p>
          </div>

          <div className="login-form mt-8">
            <label className="mb-3 block text-sm font-bold text-slate-700">
              I am logging in as
            </label>
            <div className="grid grid-cols-2 gap-3">
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
                  <div className="text-2xl transition-transform duration-300 group-hover:scale-110">🎓</div>
                  {userType === "STUDENT" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">✓</div>
                  )}
                </div>
                <p className="mt-3 font-bold text-slate-900">Student</p>
                <p className="mt-1 text-xs text-slate-500">Find accommodation</p>
              </button>

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
                  <div className="text-2xl transition-transform duration-300 group-hover:scale-110">🏠</div>
                  {userType === "MANAGER" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">✓</div>
                  )}
                </div>
                <p className="mt-3 font-bold text-slate-900">Manager</p>
                <p className="mt-1 text-xs text-slate-500">Manage properties</p>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="login-button mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <p className="login-signup mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-cyan-600 transition hover:text-cyan-800 hover:underline">
              Create an account →
            </Link>
          </p>
        </div>

        <div className="login-right-panel relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <div className="login-badge inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
              ✨ Student accommodation made simple
            </div>
            <h2 className="login-title mt-10 text-4xl font-black leading-tight">
              Your perfect
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">student stay</span>
              is waiting.
            </h2>
            <p className="login-description mt-5 max-w-md leading-7 text-slate-300">
              Discover verified hostels and PGs near your college without brokers, hidden fees, or unnecessary hassle.
            </p>
          </div>
          <div className="relative mt-12 space-y-4">
            <div className="login-feature flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">🛡️</div>
              <div>
                <p className="font-bold">Verified Properties</p>
                <p className="text-sm text-slate-400">Safe and trusted accommodation</p>
              </div>
            </div>
            <div className="login-feature-delay flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">💰</div>
              <div>
                <p className="font-bold">No Broker Fees</p>
                <p className="text-sm text-slate-400">Connect directly with managers</p>
              </div>
            </div>
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