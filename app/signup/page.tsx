"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"STUDENT" | "MANAGER">("STUDENT");

    const handleGoogleSignUp = () => {
    document.cookie = `role_intent=${role}; path=/; max-age=300`;
    const callbackUrl =
      role === "MANAGER" ? "/dashboard/manager" : "/dashboard/student";
    signIn("google", { callbackUrl });
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyan-50 px-4 py-12">
      {/* ANIMATED BACKGROUND */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      />

      {/* MAIN CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2"
      >
        {/* LEFT SIDE */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center p-8 sm:p-12"
        >
          {/* LOGO */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold text-slate-950"
            >
              <motion.span
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20"
              >
                🏠
              </motion.span>

              Hostel<span className="text-cyan-600">Connect</span>
            </Link>
          </motion.div>

          {/* HEADING */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              ✨ Join the community
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-slate-500">
              Find your perfect student accommodation in just a few clicks.
            </p>
          </motion.div>

          {/* ROLE SELECTOR */}
          <motion.div variants={itemVariants} className="mt-8">
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              I am joining as
            </label>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setRole("STUDENT")}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  role === "STUDENT"
                    ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                    : "border-slate-200 bg-white hover:border-cyan-300"
                }`}
              >
                <motion.div
                  animate={role === "STUDENT" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl"
                >
                  🎓
                </motion.div>

                <p className="mt-2 font-bold text-slate-900">Student</p>
                <p className="text-xs text-slate-500">Find accommodation</p>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setRole("MANAGER")}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  role === "MANAGER"
                    ? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
                    : "border-slate-200 bg-white hover:border-cyan-300"
                }`}
              >
                <motion.div
                  animate={role === "MANAGER" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl"
                >
                  🏠
                </motion.div>

                <p className="mt-2 font-bold text-slate-900">Manager</p>
                <p className="text-xs text-slate-500">List your property</p>
              </motion.button>
            </div>
          </motion.div>

          {/* GOOGLE SIGN UP BUTTON */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={handleGoogleSignUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-cyan-400 hover:bg-slate-50 hover:shadow-md"
          >
            Sign up with Google
          </motion.button>

          {/* LOGIN */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-sm text-slate-600"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-cyan-600 hover:text-cyan-800 hover:underline"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: "easeOut",
          }}
          className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-12 text-white lg:flex lg:flex-col lg:justify-between"
        >
          {/* GLOWS */}
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          />

          {/* CONTENT */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur"
            >
              🚀 Start your journey today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mt-8 text-3xl sm:text-4xl font-bold leading-tight tracking-tight"
            >
              A better way to
              <span className="block text-cyan-400">find your stay.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-5 leading-7 text-slate-300"
            >
              HostelConnect helps students discover affordable and verified
              hostels and PGs while allowing property managers to reach the
              right students.
            </motion.p>
          </div>

          {/* BENEFITS */}
          <div className="relative space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                🛡️
              </div>

              <div>
                <p className="font-bold">Verified Properties</p>
                <p className="text-sm text-slate-400">
                  Safe and reliable accommodation
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                🤝
              </div>

              <div>
                <p className="font-bold">Direct Connection</p>
                <p className="text-sm text-slate-400">
                  No unnecessary broker fees
                </p>
              </div>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="grid grid-cols-3 gap-3 pt-4"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur"
              >
                <p className="font-bold text-cyan-300">500+</p>
                <p className="text-xs text-slate-400">Properties</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur"
              >
                <p className="font-bold text-cyan-300">10K+</p>
                <p className="text-xs text-slate-400">Students</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur"
              >
                <p className="font-bold text-cyan-300">4.8★</p>
                <p className="text-xs text-slate-400">Rating</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}