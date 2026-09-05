"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const properties = [
  {
    name: "Urban Nest Residency",
    location: "Katraj, Pune",
    price: "₹7,500",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    tag: "Verified",
  },
  {
    name: "Campus Comfort PG",
    location: "Dhankawadi, Pune",
    price: "₹8,500",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    tag: "Popular",
  },
  {
    name: "Student Haven",
    location: "Kothrud, Pune",
    price: "₹6,800",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=80",
    tag: "Top Rated",
  },
];

const steps = [
  {
    icon: "🔍",
    title: "Search & Compare",
    desc: "Browse verified hostels and PGs near your college, filter by budget, type, and preference.",
  },
  {
    icon: "💬",
    title: "Connect Directly",
    desc: "Message property managers directly — no brokers, no middlemen, no hidden commissions.",
  },
  {
    icon: "🔑",
    title: "Move In",
    desc: "Confirm your booking and move into your new home, stress-free and hassle-free.",
  },
];

const testimonials = [
  {
    name: "Aditi Sharma",
    role: "Engineering Student, Pune",
    quote:
      "Found a great PG near campus within a day. No broker fees, no drama — just straightforward booking.",
    avatar: "👩‍🎓",
  },
  {
    name: "Rohan Patil",
    role: "Hostel Manager",
    quote:
      "Listing my property took minutes and I started getting genuine student inquiries almost immediately.",
    avatar: "🧑‍💼",
  },
  {
    name: "Sneha Kulkarni",
    role: "MBA Student, Pune",
    quote:
      "The verified badge actually means something here. Every place I shortlisted matched its listing.",
    avatar: "👩‍🎓",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-cyan-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 25, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur"
              >
                ✨ Trusted student accommodation platform
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Find Your Perfect
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Student Stay.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-lg leading-8 text-slate-300 mx-auto lg:mx-0"
              >
                Discover verified hostels and PG accommodations near your college.
                No brokers, no hidden charges — just simple and reliable booking.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              >
                <Link
                  href="/dashboard/student"
                  className="group rounded-xl bg-cyan-400 px-7 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:bg-cyan-300"
                >
                  Explore Hostels{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>

                <Link
                  href="/dashboard/manager"
                  className="rounded-xl border border-cyan-400/30 bg-white/5 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-cyan-400/10"
                >
                  List Your Property
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex justify-center gap-8 text-white lg:justify-start"
              >
                <div>
                  <p className="text-2xl font-bold text-cyan-300">500+</p>
                  <p className="text-sm text-slate-400">Properties</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-cyan-300">10K+</p>
                  <p className="text-sm text-slate-400">Students</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-cyan-300">4.8★</p>
                  <p className="text-sm text-slate-400">Average Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-3 shadow-2xl shadow-cyan-950/50 backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern student accommodation"
                  className="h-[420px] w-full rounded-2xl object-cover"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -bottom-6 -left-4 rounded-2xl border border-cyan-100 bg-white p-4 shadow-xl sm:-left-8"
              >
                <p className="text-sm text-slate-500">Verified Properties</p>
                <p className="text-xl font-bold text-slate-900">✓ 100% Checked</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="absolute -right-3 top-8 rounded-2xl border border-cyan-100 bg-white p-4 shadow-xl"
              >
                <p className="text-sm text-slate-500">Starting from</p>
                <p className="text-xl font-bold text-cyan-600">₹6,500/mo</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto -mt-8 max-w-6xl px-6"
      >
        <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-2xl shadow-slate-900/10">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                📍 Location
              </label>
              <input
                placeholder="Enter city or area"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                🏠 Stay Type
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
                <option>Any type</option>
                <option>Hostel</option>
                <option>PG</option>
                <option>Apartment</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                💰 Budget
              </label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
                <option>Any budget</option>
                <option>Under ₹7,000</option>
                <option>₹7,000 - ₹10,000</option>
                <option>Above ₹10,000</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                href="/dashboard/student"
                className="w-full rounded-xl bg-slate-950 px-6 py-3 text-center font-bold text-cyan-300 transition hover:bg-cyan-500 hover:text-slate-950"
              >
                Search Properties 🔍
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-bold tracking-wider text-cyan-600">WHY HOSTELCONNECT?</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Everything you need for a stress-free stay
          </h2>

          <p className="mt-4 text-slate-600">
            Finding student accommodation should be simple, safe and affordable.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm transition hover:border-cyan-300 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl">
              🛡️
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">Verified Properties</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Every property is checked to help students find safer and more
              reliable accommodation.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm transition hover:border-cyan-300 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl">
              💰
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">No Broker Fees</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Connect directly with property managers and avoid unnecessary
              commissions and broker charges.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm transition hover:border-cyan-300 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              ⚡
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">Easy Booking</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Search, compare and connect with managers quickly using one
              simple platform.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-bold tracking-wider text-cyan-400">GETTING STARTED</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              How HostelConnect works
            </h2>
            <p className="mt-4 text-slate-400">
              Three simple steps between you and your next home.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-14 grid gap-8 md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-cyan-400/30"
              >
                <div className="absolute -top-4 -left-2 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                  {i + 1}
                </div>
                <div className="text-3xl">{step.icon}</div>
                <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <p className="font-bold tracking-wider text-cyan-600">EXPLORE</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Featured Properties</h2>
              <p className="mt-3 text-slate-600">Popular stays chosen by students.</p>
            </div>

            <Link
              href="/dashboard/student"
              className="font-semibold text-cyan-600 transition hover:text-cyan-800"
            >
              View all properties →
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {properties.map((property) => (
              <motion.div
                key={property.name}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-cyan-300 shadow-lg">
                    ✓ {property.tag}
                  </span>

                  <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow transition hover:scale-110">
                    ♡
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900">{property.name}</h3>
                    <span className="whitespace-nowrap text-sm font-semibold text-amber-500">
                      ⭐ {property.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">📍 {property.location}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                      <span className="text-xl font-bold text-slate-950">{property.price}</span>
                      <span className="text-sm text-slate-500"> / month</span>
                    </div>

                    <Link
                      href="/dashboard/student"
                      className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-slate-950"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-bold tracking-wider text-cyan-600">TESTIMONIALS</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Loved by students & managers alike
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm transition hover:border-cyan-300 hover:shadow-xl"
            >
              <p className="text-lg leading-relaxed text-slate-700">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-xl">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-8 py-16 text-center shadow-2xl">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to find your next home?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Join students who are finding affordable and verified accommodation
              without the hassle.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-105 hover:bg-cyan-300"
            >
              Get Started for Free →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-white">
              Hostel<span className="text-cyan-400">Connect</span>
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Find your perfect student accommodation.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 HostelConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}