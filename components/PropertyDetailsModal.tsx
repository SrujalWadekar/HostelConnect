"use client";

import { useEffect, useState } from "react";
import RequestBedButton from "@/components/RequestBedButton";

export interface PropertyDetailsData {
  id: string;
  name: string;
  ownerName?: string | null;
  ownerPhone?: string | null;
  type: string;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  gender: string;
  isAadhaarVerified: boolean;
  avgRating: number | null;
  reviewCount: number;
  canReview: boolean;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewerName: string;
  }>;
}

interface PropertyDetailsModalProps {
  property: PropertyDetailsData;
  onClose: () => void;
  onStartChat: (property: PropertyDetailsData) => void;
  onOpenReviews: (property: PropertyDetailsData) => void;
}

export default function PropertyDetailsModal({
  property,
  onClose,
  onStartChat,
  onOpenReviews,
}: PropertyDetailsModalProps) {
  const [stayPlan, setStayPlan] = useState<"MONTHLY" | "DAILY">("MONTHLY");

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const cleanPhone = property.ownerPhone?.replace(/\D/g, "").slice(-10);
  const isFull = property.availableBeds <= 0;
  const isLowBeds = property.availableBeds > 0 && property.availableBeds <= 2;

  const formatINR = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 text-slate-900 flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. MODAL TOP BAR & BADGES ── */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md">
              {property.type}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              {property.gender === "ANY"
                ? "Co-Ed / Mixed"
                : property.gender === "MALE"
                ? "Boys Only"
                : "Girls Only"}
            </span>

            {/* Verification Status (NO Aadhaar Number Exposed - Strict Privacy) */}
            {property.isAadhaarVerified ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shadow-2xs">
                <span>🛡️</span>
                <span>Aadhaar Verified Host</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                <span>⚠️</span>
                <span>Verification in Progress</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition shrink-0 cursor-pointer"
            title="Close details (Esc)"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── 2. HERO SHOWCASE ── */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 id="property-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {property.name}
              </h1>

              <p className="text-sm text-slate-600 flex items-start gap-1.5">
                <svg className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {property.address}, <strong className="text-slate-900">{property.city}</strong>
                </span>
              </p>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${property.name}, ${property.address}, ${property.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
                >
                  <span>📍 View on Google Maps</span>
                  <span>↗</span>
                </a>

                {property.reviewCount > 0 && (
                  <button
                    onClick={() => onOpenReviews(property)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    <span>★ {property.avgRating ? property.avgRating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-400">({property.reviewCount} student reviews)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bed Vacancy Status Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shrink-0 min-w-[200px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Availability
              </span>
              <div className="mt-1 flex items-center justify-center gap-2">
                {isFull ? (
                  <span className="text-2xl font-black text-rose-600">0 Beds Left</span>
                ) : (
                  <>
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {property.availableBeds} <span className="text-sm font-semibold text-slate-500">Beds</span>
                    </span>
                  </>
                )}
              </div>
              <span className={`text-[11px] font-semibold mt-1 block ${isFull ? "text-rose-600" : isLowBeds ? "text-amber-700" : "text-emerald-700"}`}>
                {isFull ? "Currently Fully Occupied" : isLowBeds ? "🔥 High Demand • Few beds remaining" : "● Ready for Immediate Move-in"}
              </span>
            </div>
          </div>

          {/* ── 3. PRICING & RENT RULES MATRIX ── */}
          <div className="bg-gradient-to-br from-cyan-50/70 via-slate-50 to-blue-50/60 rounded-2xl border border-cyan-100 p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-2">
              <span>💳</span>
              <span>Transparent Pricing & Rent Rules</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Monthly Rent</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-700 mt-0.5 block">
                  {formatINR(property.monthlyPrice)}
                </span>
                <span className="text-[11px] text-slate-500">per student / bed</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Daily Rate</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
                  {property.dailyPrice > 0 ? formatINR(property.dailyPrice) : formatINR(Math.round(property.monthlyPrice / 20))}
                </span>
                <span className="text-[11px] text-slate-500">transient / day</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Security Deposit</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 mt-1 block">
                  1 Month Rent
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Refundable</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Notice Period</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 mt-1 block">
                  1 Month
                </span>
                <span className="text-[11px] text-slate-500">Before vacating</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-medium text-slate-600 border-t border-cyan-200/60">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>Maintenance Charges: <strong>Included in Rent</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>Electricity & Water: <strong>Included (or sub-meter reading)</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>0% Brokerage & Direct Landlord Lease</span>
              </span>
            </div>
          </div>

          {/* ── 4. SHARING MATRIX CONFIGURATION ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>🛏️</span>
              <span>Available Room Sharing Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-300 transition shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Single Sharing</span>
                  <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">Private</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Private room with study desk & wardrobe</p>
                <p className="text-base font-bold text-slate-900 pt-1">
                  {formatINR(property.monthlyPrice + 2500)}<span className="text-xs font-normal text-slate-400">/mo</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-cyan-500 bg-cyan-50/40 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-950">Double Sharing</span>
                  <span className="text-[10px] font-bold text-white bg-cyan-600 px-2 py-0.5 rounded">Popular</span>
                </div>
                <p className="text-[11px] text-cyan-900 font-normal">Twin sharing with individual beds & cupboards</p>
                <p className="text-base font-black text-cyan-900 pt-1">
                  {formatINR(property.monthlyPrice)}<span className="text-xs font-normal text-cyan-700">/mo</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-300 transition shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Triple Sharing</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Budget</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Spacious 3-bed room with shared bathroom</p>
                <p className="text-base font-bold text-slate-900 pt-1">
                  {formatINR(Math.max(property.monthlyPrice - 1500, 4500))}<span className="text-xs font-normal text-slate-400">/mo</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-300 transition shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">4+ Dormitory</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Economical</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Multi-bed dormitory with individual lockers</p>
                <p className="text-base font-bold text-slate-900 pt-1">
                  {formatINR(Math.max(property.monthlyPrice - 2500, 3800))}<span className="text-xs font-normal text-slate-400">/mo</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── 5. ESSENTIAL AMENITIES CHECKLIST ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>✨</span>
              <span>Essential Property Amenities</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Category 1: Food */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="p-1 rounded-md bg-amber-50 text-amber-700">🍽️</span>
                  <span>Food & Dining</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 font-normal">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>3 Nutritious Daily Meals (Breakfast, Lunch, Dinner)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Self-Cooking Kitchen Allowed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>24/7 RO Purified Drinking Water</span>
                  </li>
                </ul>
              </div>

              {/* Category 2: Comfort */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="p-1 rounded-md bg-cyan-50 text-cyan-700">🛋️</span>
                  <span>Comfort & Living</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 font-normal">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Geyser / 24-hr Hot Water Supply</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Daily Housekeeping & Sanitization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Washing Machine / Laundry Area</span>
                  </li>
                </ul>
              </div>

              {/* Category 3: Security & Tech */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="p-1 rounded-md bg-indigo-50 text-indigo-700">🛡️</span>
                  <span>Tech & Security</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 font-normal">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>High-Speed Wi-Fi (100+ Mbps)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>24/7 CCTV Cameras & Warden Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>24/7 Power Backup (Lights & Wi-Fi)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── 6. HOST CONTACT & PRIVACY NOTICE ── */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Property Host: {property.ownerName || "Registered Manager"}
                </span>
                {property.isAadhaarVerified && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Contact host directly for move-in schedule, gate rules, or room tour.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
              {cleanPhone && (
                <>
                  <a
                    href={`tel:+91${cleanPhone}`}
                    className="h-9 px-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    title={`Call host: +91 ${cleanPhone}`}
                  >
                    <span>📞</span>
                    <span>+91 {cleanPhone}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                      `Hello, I saw your listing for ${property.name} on HostelConnect and would like to inquire about bed availability.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    title="Inquire on WhatsApp"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                </>
              )}
              <button
                type="button"
                onClick={() => onStartChat(property)}
                className="h-9 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Send direct message to host in portal"
              >
                <span>💬</span>
                <span>Chat with Host</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 7. STICKY MODAL FOOTER ACTIONS ── */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stay Plan:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setStayPlan("MONTHLY")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  stayPlan === "MONTHLY"
                    ? "bg-white text-cyan-800 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly ({formatINR(property.monthlyPrice)})
              </button>
              <button
                type="button"
                onClick={() => setStayPlan("DAILY")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  stayPlan === "DAILY"
                    ? "bg-white text-cyan-800 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Daily ({property.dailyPrice > 0 ? formatINR(property.dailyPrice) : formatINR(Math.round(property.monthlyPrice / 20))})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Direct Chat Button */}
            <button
              type="button"
              onClick={() => onStartChat(property)}
              className="h-11 px-5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/90 text-cyan-800 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto shrink-0"
              title="Open direct message chat with host"
            >
              <span className="text-sm">💬</span>
              <span>Chat with Host</span>
            </button>

            {/* Request Bed Action */}
            <div className="w-full sm:w-auto sm:min-w-[170px] shrink-0">
              <RequestBedButton hostelId={property.id} stayType={stayPlan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

