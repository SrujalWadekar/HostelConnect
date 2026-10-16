"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export interface PublicHostel {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  gender: string;
  ownerPhone?: string | null;
  aadhaarNumber?: string | null;
  isReal?: boolean;
}

const fallbackProperties: PublicHostel[] = [
  {
    id: "fb-1",
    name: "Urban Nest Residency",
    type: "PG",
    city: "Pune",
    address: "Near Bharti Vidyapeeth, Katraj",
    dailyPrice: 450,
    monthlyPrice: 7500,
    availableBeds: 6,
    gender: "MALE",
    aadhaarNumber: "123456789012",
    isReal: false,
  },
  {
    id: "fb-2",
    name: "Campus Comfort Stay",
    type: "HOSTEL",
    city: "Pune",
    address: "Off Pune-Satara Road, Dhankawadi",
    dailyPrice: 500,
    monthlyPrice: 8500,
    availableBeds: 12,
    gender: "FEMALE",
    aadhaarNumber: "987654321098",
    isReal: false,
  },
  {
    id: "fb-3",
    name: "Student Haven Deluxe",
    type: "PG",
    city: "Pune",
    address: "Ideal Colony, Kothrud",
    dailyPrice: 400,
    monthlyPrice: 6800,
    availableBeds: 4,
    gender: "ANY",
    aadhaarNumber: "456789123456",
    isReal: false,
  },
  {
    id: "fb-4",
    name: "Greenwood Scholar PG",
    type: "PG",
    city: "Bengaluru",
    address: "Near Christ University, Hosur Road",
    dailyPrice: 600,
    monthlyPrice: 9500,
    availableBeds: 8,
    gender: "ANY",
    aadhaarNumber: "789123456789",
    isReal: false,
  },
  {
    id: "fb-5",
    name: "Metro Royal Boys Hostel",
    type: "HOSTEL",
    city: "Mumbai",
    address: "Andheri West, Near Metro Station",
    dailyPrice: 550,
    monthlyPrice: 9000,
    availableBeds: 15,
    gender: "MALE",
    aadhaarNumber: "321654987123",
    isReal: false,
  },
];

const propertyImages = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function HomeClient({
  initialHostels = [],
}: {
  initialHostels: PublicHostel[];
}) {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState<"HOSTEL" | "PG">("HOSTEL");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");
  const [budgetFilter, setBudgetFilter] = useState<string>("ALL");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Merge real manager-listed properties first, then supplement with curated fallbacks
  const allProperties: PublicHostel[] = useMemo(() => {
    const realIds = new Set(initialHostels.map((h) => h.id));
    const nonDuplicatedFallbacks = fallbackProperties.filter((fb) => !realIds.has(fb.id));
    return [...initialHostels, ...nonDuplicatedFallbacks];
  }, [initialHostels]);

  // Real-time search & filter without credentials
  const filteredProperties = useMemo(() => {
    return allProperties.filter((prop) => {
      // 1. Location search (city, area, property name)
      if (searchLocation.trim()) {
        const query = searchLocation.toLowerCase();
        const matchesName = prop.name.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        const matchesAddress = prop.address.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesAddress) return false;
      }

      // 2. Stay Type (strictly HOSTEL or PG)
      if (prop.type.toUpperCase() !== selectedType) return false;

      // 3. Gender (ALL / MALE / FEMALE / ANY)
      if (selectedGender !== "ALL") {
        if (prop.gender !== "ANY" && prop.gender.toUpperCase() !== selectedGender.toUpperCase()) {
          return false;
        }
      }

      // 4. Budget
      if (budgetFilter === "UNDER_7K") {
        if (prop.monthlyPrice >= 7000) return false;
      } else if (budgetFilter === "7K_10K") {
        if (prop.monthlyPrice < 7000 || prop.monthlyPrice > 10000) return false;
      } else if (budgetFilter === "ABOVE_10K") {
        if (prop.monthlyPrice <= 10000) return false;
      }

      // 5. Vacancy
      if (onlyAvailable && prop.availableBeds <= 0) {
        return false;
      }

      return true;
    });
  }, [allProperties, searchLocation, selectedType, selectedGender, budgetFilter, onlyAvailable]);

  const liveListingsCount = allProperties.filter((p) => p.isReal).length;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* ── 1. VIBRANT HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#071328] to-[#042f2e] text-white pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20">
        {/* Dynamic Glowing Ambient Blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/25 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-emerald-500/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Hero Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Vibrant Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-cyan-200 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
                <span>Verified Student Accommodation Network • 0% Brokerage</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]"
              >
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400 bg-clip-text text-transparent">
                  Student Stay & PG.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                Search verified hostels and PGs listed directly by property managers. Compare live monthly prices, check available beds, and connect directly with verified hosts <strong className="text-cyan-300 font-semibold">with complete privacy</strong>.
              </motion.p>

              {/* Dual Action CTAs */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <a
                  href="#search-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-400/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Search Properties Below</span>
                  <span>↓</span>
                </a>

                <Link
                  href="/dashboard/manager"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>🏢 List Your Property</span>
                </Link>
              </motion.div>

              {/* Vibrant Stats Bar */}
              <motion.div
                variants={fadeUp}
                className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left max-w-lg mx-auto lg:mx-0"
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-cyan-300">
                    {allProperties.length}+
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
                    {liveListingsCount > 0 ? "Live Listings" : "Verified Stays"}
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-300">
                    100%
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
                    Direct Contact
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-2xl sm:text-3xl font-bold text-amber-300">
                    4.9★
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
                    Student Rating
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl p-3 bg-gradient-to-br from-cyan-400/20 via-white/10 to-blue-500/20 border border-white/15 backdrop-blur-xl shadow-2xl shadow-cyan-950/60">
                <div className="relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=85"
                    alt="Hostel Connect Premium Room"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Top floating pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-bold">
                    <span>⚡ Direct Manager Connect</span>
                  </div>

                  {/* Bottom Room Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30">
                        Top Rated Stay
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        PICT Campus Boys Hostel
                      </h3>
                      <p className="text-xs text-slate-300">Katraj, Pune • 29 Vacant Beds</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Starting</p>
                      <p className="text-xl font-bold text-cyan-300">₹8,000<span className="text-xs text-slate-300 font-normal">/mo</span></p>
                    </div>
                  </div>
                </div>

                {/* Floating Overlays */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border border-slate-200 hidden sm:flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Aadhaar Verified Hosts</p>
                    <p className="text-sm font-bold text-slate-900">100% Genuine Listings</p>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl px-3.5 py-2 shadow-lg border border-white/20 text-xs font-bold flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>Instant Booking Access</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. THE SEARCH PROPERTY BOX & LIVE EXPLORER (NO LOGIN REQUIRED) ── */}
      <section id="search-section" className="relative z-30 mx-auto max-w-6xl px-4 sm:px-6 -mt-10 sm:-mt-12">
        <div className="bg-white rounded-3xl border border-cyan-200/80 shadow-2xl shadow-slate-900/10 p-5 sm:p-7 backdrop-blur-xl">
          {/* Section Header with live count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Search & Explore Live Listings
                </h2>
                <span className="text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                  Public Explorer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Filter and view properties listed by managers in real-time. Direct contact unlocked on login.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="text-cyan-700 font-bold">{filteredProperties.length}</span>
              <span>Available Right Now</span>
            </div>
          </div>

          {/* Form Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* 1. Location Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                📍 City, Area, or Property
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Pune, Katraj, PICT..."
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 rounded-xl py-3 pl-9 pr-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400"
                />
                <span className="absolute left-3 text-slate-400">🔍</span>
                {searchLocation && (
                  <button
                    type="button"
                    onClick={() => setSearchLocation("")}
                    className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 2. Stay Type (Hostel & PG only - All Properties removed) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                🏠 Stay Category
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "HOSTEL" | "PG")}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl py-3 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition cursor-pointer"
              >
                <option value="HOSTEL">🛏️ Hostel</option>
                <option value="PG">🏠 PG</option>
              </select>
            </div>

            {/* 3. Budget */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                💰 Monthly Budget
              </label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl py-3 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition cursor-pointer"
              >
                <option value="ALL">All Price Ranges</option>
                <option value="UNDER_7K">Under ₹7,000 / mo</option>
                <option value="7K_10K">₹7,000 – ₹10,000 / mo</option>
                <option value="ABOVE_10K">Above ₹10,000 / mo</option>
              </select>
            </div>

            {/* 4. Action Filter Button */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("live-results");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View {filteredProperties.length} Stays</span>
                <span>↓</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Pills Row */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pills (Strictly Hostel & PG only) */}
              <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedType("HOSTEL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedType === "HOSTEL"
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🛏️ Hostels
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("PG")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedType === "PG"
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏠 PGs
                </button>
              </div>

              <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

              {[
                { label: "All Genders", value: "ALL" },
                { label: "👦 Boys", value: "MALE" },
                { label: "👧 Girls", value: "FEMALE" },
                { label: "👥 Co-ed", value: "ANY" },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setSelectedGender(g.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedGender === g.value
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {g.label}
                </button>
              ))}

              <label className="ml-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded accent-cyan-600 w-3.5 h-3.5"
                />
                <span>Vacant Beds Only</span>
              </label>
            </div>

            {(searchLocation || selectedGender !== "ALL" || budgetFilter !== "ALL" || onlyAvailable) && (
              <button
                type="button"
                onClick={() => {
                  setSearchLocation("");
                  setSelectedType("HOSTEL");
                  setSelectedGender("ALL");
                  setBudgetFilter("ALL");
                  setOnlyAvailable(false);
                }}
                className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 underline underline-offset-2 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. LIVE MATCHING PROPERTIES GRID ── */}
      <section id="live-results" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-1.5">
              <span>⚡ Live Landlord Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {searchLocation
                ? `Properties matching "${searchLocation}"`
                : "Active Accommodations & Vacancies"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Verified properties with direct contact and chat unlocked inside the student portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredProperties.length}</strong> stays
            </span>
            <Link
              href="/dashboard/student"
              className="text-xs font-bold text-cyan-700 hover:text-cyan-900 underline underline-offset-2 transition"
            >
              Sign In for Bed Booking →
            </Link>
          </div>
        </div>

        {/* Results Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 text-center shadow-sm space-y-4 max-w-lg mx-auto">
            <span className="text-5xl block">🔍</span>
            <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              We couldn't find any accommodations matching your current filter criteria. Try searching a broader area or reset your budget filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchLocation("");
                setSelectedType("HOSTEL");
                setSelectedGender("ALL");
                setBudgetFilter("ALL");
                setOnlyAvailable(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProperties.map((prop, idx) => {
              const photo = propertyImages[idx % propertyImages.length];
              const isAadhaarVerified = Boolean(prop.aadhaarNumber && prop.aadhaarNumber.trim().length >= 12);

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col justify-between bg-white rounded-3xl border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div>
                    {/* Image Header with Overlays */}
                    <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                      <img
                        src={photo}
                        alt={prop.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-md border border-white/20">
                          {prop.type}
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                          {prop.gender === "ANY" ? "Co-ed" : prop.gender === "MALE" ? "Boys" : "Girls"}
                        </span>

                        {prop.isReal && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                            ⚡ Manager Listed
                          </span>
                        )}
                      </div>

                      {/* Aadhaar Verified Badge: strictly verified if Aadhaar provided, otherwise Unverified */}
                      {isAadhaarVerified ? (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
                          <span>🛡️</span>
                          <span>Aadhaar Verified</span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-slate-300 text-[10px] font-medium shadow-sm backdrop-blur-md border border-white/10">
                          <span>⚠️</span>
                          <span>Unverified Host</span>
                        </div>
                      )}

                      {/* Vacancy Indicator Overlay (Clean static dot, no blinking) */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-semibold">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>{prop.availableBeds} Vacant Beds</span>
                        </div>

                        <span className="text-[11px] font-medium text-slate-200 drop-shadow">
                          📍 {prop.city}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-1">
                          {prop.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1 line-clamp-2 min-h-[32px] font-normal">
                          <span>📍</span>
                          <span>{prop.address}, {prop.city}</span>
                        </p>
                      </div>

                      {/* Pricing Bar */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Rent</p>
                          <p className="text-xl font-bold text-cyan-800 mt-0.5">
                            ₹{prop.monthlyPrice.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                          </p>
                        </div>

                        <div className="text-right border-l border-slate-200/80 pl-3">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Stay</p>
                          <p className="text-sm font-bold text-slate-700 mt-0.5">
                            ₹{prop.dailyPrice.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/day</span>
                          </p>
                        </div>
                      </div>

                      {/* Privacy-First Direct Contact CTA (No raw phone numbers or WhatsApp on public page) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                          <span className="text-slate-400">🔒</span>
                          <span className="text-[11px] font-medium text-slate-600 truncate">
                            Direct Contact & Chat unlocked on login
                          </span>
                        </div>

                        <Link
                          href="/login"
                          className="shrink-0 inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-xs hover:-translate-y-0.5 cursor-pointer"
                        >
                          <span>View Stay & Connect →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 4. WHY HOSTELCONNECT (FEATURES) ── */}
      <section className="bg-slate-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              The Smarter Way To Stay
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Why Students & Managers Choose HostelConnect
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base font-normal">
              Built specifically for college students and hostel operators to remove brokers, hidden charges, and messy paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🛡️",
                title: "Aadhaar & Phone Verified",
                desc: "Every manager submits a verified Aadhaar and Indian mobile number before listing, giving you peace of mind.",
                color: "from-cyan-500/20 to-blue-500/10 border-cyan-400/25",
              },
              {
                icon: "🚫",
                title: "Zero Broker Fees",
                desc: "No middlemen or brokers taking commissions. You speak directly with the property manager and save thousands.",
                color: "from-emerald-500/20 to-teal-500/10 border-emerald-400/25",
              },
              {
                icon: "💬",
                title: "Direct Chat Mode",
                desc: "Instant built-in chat allows verified students and managers to discuss meal plans, visits, and gate timings with privacy.",
                color: "from-amber-500/20 to-orange-500/10 border-amber-400/25",
              },
              {
                icon: "🛏️",
                title: "Live Bed Inventory",
                desc: "Managers update occupied and vacant beds in real-time so you never waste a visit on a property that is already full.",
                color: "from-violet-500/20 to-purple-500/10 border-violet-400/25",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl bg-gradient-to-br ${feat.color} border backdrop-blur-md hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              How HostelConnect Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Search & Compare",
                desc: "Explore verified listings on this page without logging in. Filter by college area, monthly rent budget, and gender preference.",
              },
              {
                step: "02",
                icon: "💬",
                title: "Direct Host Inquiries",
                desc: "Sign in with your student account to securely access landlord contact details and launch inquiries inside your portal.",
              },
              {
                step: "03",
                icon: "🛏️",
                title: "Reserve Your Bed",
                desc: "Sign in with your student account to request a room bed, chat inside the portal, and move in stress-free.",
              },
            ].map((st, i) => (
              <div key={i} className="relative p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-4xl sm:text-5xl font-black text-slate-200 block mb-2">{st.step}</span>
                <span className="text-3xl block mb-3">{st.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CALL TO ACTION ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl shadow-cyan-950/20 border border-cyan-400/20">
          <div className="pointer-events-none absolute -right-12 -top-12 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
              Join Thousands of Students
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to find your perfect hostel or list your property?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Get started with free access to verified student accommodations, live vacancy counts, and direct manager communication.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
              >
                Sign Up as Student →
              </Link>

              <Link
                href="/dashboard/manager"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all hover:-translate-y-0.5"
              >
                List Property as Manager
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              H
            </div>
            <span className="font-bold text-slate-900 text-sm">HostelConnect</span>
            <span className="text-slate-400">© 2026</span>
          </div>

          <p className="text-slate-400 text-xs">
            Student Accommodation Management & Direct Landlord Booking Platform.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/login" className="hover:text-cyan-700 transition">Student Login</Link>
            <Link href="/dashboard/manager" className="hover:text-cyan-700 transition">Manager Portal</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

