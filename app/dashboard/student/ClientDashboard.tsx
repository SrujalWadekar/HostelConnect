"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import RequestBedButton from "@/components/RequestBedButton";
import { motion } from "framer-motion";
import ReviewsModal from "@/components/ReviewsModal";
import ChatModal, { ChatModalProps } from "@/components/ChatModal";
import PropertyDetailsModal, { PropertyDetailsData } from "@/components/PropertyDetailsModal";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerName: string;
}

interface Property {
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
  isAadhaarVerified?: boolean;
  aadhaarNumber?: string | null;
  avgRating: number | null;
  reviewCount: number;
  canReview: boolean;
  reviews: ReviewItem[];
}

interface StudentBooking {
  id: string;
  status: string;
  stayType?: string;
  hostel: {
    id?: string;
    name: string;
    type: string;
    address: string;
    city: string;
    monthlyPrice: number;
    dailyPrice: number;
    ownerPhone?: string | null;
  };
}

export default function ClientDashboard({
  myBookings = [],
  availableProperties = [],
}: {
  myBookings: StudentBooking[];
  availableProperties: Property[];
}) {
  const { data: session } = useSession();

  const [city, setCity] = useState("");
  const [stayType, setStayType] = useState<"DAILY" | "MONTHLY">("MONTHLY");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hideFull, setHideFull] = useState(false);
  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>({});
  const [reviewModalHostel, setReviewModalHostel] = useState<Property | null>(null);
  const [selectedPropertyModal, setSelectedPropertyModal] = useState<Property | null>(null);
  const [activeChat, setActiveChat] = useState<Omit<ChatModalProps, "onClose"> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hc_seen_booking_statuses");
    if (stored) {
      try {
        setSeenStatuses(JSON.parse(stored));
      } catch {
        setSeenStatuses({});
      }
    }
  }, []);

  function isNewStatus(bookingId: string, status: string) {
    return seenStatuses[bookingId] !== status;
  }

  function markAllSeen() {
    const updated: Record<string, string> = {};
    myBookings.forEach((b) => {
      updated[b.id] = b.status;
    });
    setSeenStatuses(updated);
    localStorage.setItem("hc_seen_booking_statuses", JSON.stringify(updated));
  }

  const filteredHostels = useMemo(() => {
    return availableProperties.filter((h) => {
      const matchesCity = city.trim()
        ? h.city.toLowerCase().includes(city.toLowerCase()) ||
          h.name.toLowerCase().includes(city.toLowerCase()) ||
          h.address.toLowerCase().includes(city.toLowerCase())
        : true;

      const matchesType =
        selectedType === "ALL" || h.type.toUpperCase() === selectedType.toUpperCase();

      const matchesGender =
        selectedGender === "ALL" ||
        h.gender.toUpperCase() === selectedGender.toUpperCase() ||
        h.gender === "ANY";

      const relevantPrice = stayType === "DAILY" ? h.dailyPrice : h.monthlyPrice;
      const matchesPrice = maxPrice === "" || relevantPrice <= maxPrice;
      const matchesAvailability = !hideFull || h.availableBeds > 0;

      return matchesCity && matchesType && matchesGender && matchesPrice && matchesAvailability;
    });
  }, [availableProperties, city, selectedType, selectedGender, stayType, maxPrice, hideFull]);

  const uniqueListingsCount = availableProperties.length;
  const uniqueTypesCount = useMemo(
    () => new Set(availableProperties.map((p) => p.type)).size,
    [availableProperties]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* 1. HERO HEADER BANNER */}
      <div className="dash-fade-up relative bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-7 sm:p-9 rounded-[2rem] overflow-hidden shadow-xl shadow-cyan-950/15 border border-cyan-400/20">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar — Role-branded student avatar (no Google image) */}
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-bold text-white shadow-md shadow-cyan-500/20">
                {session?.user?.name?.charAt(0).toUpperCase() || "🎓"}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white ring-2 ring-slate-950 shadow-sm">
                ✓
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 border border-cyan-400/25 px-3 py-0.5 text-xs font-semibold text-cyan-200 mb-2 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Student Accommodation Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {session?.user?.name?.split(" ")[0] || "Student"}
                </span>{" "}
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg font-normal leading-relaxed">
                Discover verified hostels and PGs with live bed availability and direct landlord contact.
              </p>
            </div>
          </div>

          {/* Stat Pods */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:px-5 sm:py-3.5 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider">My Requests</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-0.5">{myBookings.length}</p>
              <span className="text-[10px] text-slate-300 font-normal">In Pipeline</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-cyan-400/25 rounded-2xl p-4 sm:px-5 sm:py-3.5 text-center shadow-sm">
              <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Unique Listings</p>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-300 mt-0.5">{uniqueListingsCount}</p>
              <span className="text-[10px] text-emerald-300/80 font-normal">
                {uniqueTypesCount > 1 ? "Hostels & PGs" : "Verified Stays"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 flex flex-col md:flex-row items-center gap-3 relative z-20 -mt-5 mx-2 sm:mx-6"
      >
        {/* Search Input */}
        <div className="flex-1 w-full relative flex items-center">
          <div className="absolute left-3.5 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city, area, or property name..."
            className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400"
          />
        </div>

        <div className="hidden md:block w-px h-7 bg-slate-200"></div>

        {/* Property Type */}
        <div className="w-full md:w-44">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none transition cursor-pointer"
          >
            <option value="ALL">🏢 All Properties</option>
            <option value="HOSTEL">🛏️ Hostel Only</option>
            <option value="PG">🏠 PG Only</option>
          </select>
        </div>

        {/* Pricing Plan */}
        <div className="w-full md:w-48">
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value as "DAILY" | "MONTHLY")}
            className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none transition cursor-pointer"
          >
            <option value="MONTHLY">📅 Monthly Rent</option>
            <option value="DAILY">☀️ Daily Stay</option>
          </select>
        </div>

        {/* Max Budget */}
        <div className="w-full md:w-40">
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder={stayType === "DAILY" ? "Max ₹/day" : "Max ₹/month"}
            className="w-full bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400"
          />
        </div>

        {/* Vacant Only Checkbox */}
        <label className="w-full md:w-auto flex items-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-xl py-2.5 px-3 border border-slate-200 cursor-pointer select-none transition">
          <input
            type="checkbox"
            checked={hideFull}
            onChange={(e) => setHideFull(e.target.checked)}
            className="w-3.5 h-3.5 accent-cyan-600 rounded cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Vacant Only</span>
        </label>
      </motion.div>

      {/* 3. MY BOOKING REQUESTS */}
      {myBookings.length > 0 && (
        <section className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">My Booking Requests</h2>
              <span className="rounded-full bg-cyan-100 text-cyan-800 px-2 py-0.5 text-xs font-bold">
                {myBookings.length}
              </span>
            </div>
            {myBookings.some((b) => isNewStatus(b.id, b.status)) && (
              <button
                onClick={markAllSeen}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition underline underline-offset-2 cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBookings.map((booking: StudentBooking) => {
              const isApproved = booking.status === "CONFIRMED" || booking.status === "APPROVED";
              const isRejected = booking.status === "REJECTED";

              return (
                <div
                  key={booking.id}
                  className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group relative ${
                    isNewStatus(booking.id, booking.status)
                      ? "border-cyan-400 ring-2 ring-cyan-100"
                      : "border-slate-200 hover:border-cyan-200"
                  }`}
                >
                  {isNewStatus(booking.id, booking.status) && (
                    <span className="absolute top-0 right-0 bg-cyan-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg">
                      New Update
                    </span>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                        {booking.hostel.type}
                      </span>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isRejected
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? "bg-emerald-500" : isRejected ? "bg-rose-500" : "bg-amber-500"}`} />
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
                      {booking.hostel.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-normal">
                      <span>📍</span>
                      <span className="truncate">{booking.hostel.address}, {booking.hostel.city}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400">Monthly Rent</span>
                    <span className="font-bold text-slate-900">₹{booking.hostel.monthlyPrice.toLocaleString()}/mo</span>
                  </div>

                  {/* Manager contact & chat mode */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Manager Contact</span>
                      {booking.hostel.ownerPhone ? (
                        <a
                          href={`tel:+91${booking.hostel.ownerPhone.replace(/\D/g, "").slice(-10)}`}
                          className="font-mono font-bold text-cyan-700 hover:underline flex items-center gap-1 text-xs"
                          title={`Call manager +91 ${booking.hostel.ownerPhone}`}
                        >
                          <span>📞</span>
                          <span>+91 {booking.hostel.ownerPhone.replace(/\D/g, "").slice(-10)}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Contact on request</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveChat({
                          chatId: `booking_${booking.id}`,
                          title: booking.hostel.name,
                          subtitle: `Booking Inquiry • Bed Request #${booking.id.slice(-6).toUpperCase()}`,
                          recipientName: `Manager of ${booking.hostel.name}`,
                          recipientPhone: booking.hostel.ownerPhone,
                          senderRole: "STUDENT",
                          propertyTitle: booking.hostel.name,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-2xs hover:shadow transition cursor-pointer"
                    >
                      <span>💬</span>
                      <span>Chat Mode</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. ACCOMMODATIONS LIST */}
      <section className="space-y-5 pt-2">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Available Accommodations
              </h2>
              <span className="rounded-full bg-cyan-100 text-cyan-800 font-bold px-2.5 py-0.5 text-xs">
                {filteredHostels.length} Stays
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Verified hostels and PGs with live bed inventory
            </p>
          </div>

          {/* Gender Filter Buttons */}
          <div className="inline-flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm self-start sm:self-auto">
            {[
              { label: "All Stays", value: "ALL", color: "bg-slate-900 text-white" },
              { label: "👦 Boys Only", value: "MALE", color: "bg-sky-500 text-white shadow-sm" },
              { label: "👧 Girls Only", value: "FEMALE", color: "bg-pink-500 text-white shadow-sm" },
            ].map((g) => (
              <button
                key={g.value}
                onClick={() => setSelectedGender(g.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  selectedGender === g.value
                    ? g.color
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {filteredHostels.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-4xl block mb-1">🔍</span>
            <h3 className="text-lg font-bold text-slate-900">No properties match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              Try adjusting your search query, price limit, or property category.
            </p>
            <button
              onClick={() => {
                setCity("");
                setSelectedType("ALL");
                setSelectedGender("ALL");
                setMaxPrice("");
                setHideFull(false);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHostels.map((h) => {
              const isLowBeds = h.availableBeds > 0 && h.availableBeds <= 2;
              const isFull = h.availableBeds === 0;

              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedPropertyModal(h)}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-cyan-400 hover:ring-2 hover:ring-cyan-400/20 transition-all duration-300 cursor-pointer"
                  title="Click to view full property details, sharing options & amenities"
                >
                  <div>
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-md bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-800">
                          {h.type}
                        </span>
                        <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {h.gender === "ANY" ? "Co-ed" : h.gender === "MALE" ? "Boys" : "Girls"}
                        </span>
                        {h.isAadhaarVerified || (h.aadhaarNumber && h.aadhaarNumber.trim().length >= 12) ? (
                          <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 flex items-center gap-1" title="Aadhaar Verified Host">
                            <span>🛡️</span>
                            <span>Aadhaar Verified</span>
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 flex items-center gap-1" title="Aadhaar not submitted">
                            <span>⚠️</span>
                            <span>Unverified Host</span>
                          </span>
                        )}
                      </div>

                      {/* Availability Tag */}
                      {isFull ? (
                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          Full
                        </span>
                      ) : isLowBeds ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <span>🔥</span>
                          <span>{h.availableBeds} Left</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{h.availableBeds} Beds</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Reviews */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors line-clamp-1">
                        {h.name}
                      </h3>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewModalHostel(h);
                        }}
                        className="shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                        title="View student reviews"
                      >
                        {h.avgRating !== null ? (
                          <>
                            <span className="text-amber-500">★</span>
                            <span className="font-bold">{h.avgRating.toFixed(1)}</span>
                            <span className="text-slate-400 text-[10px]">({h.reviewCount})</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-500">Reviews</span>
                        )}
                      </button>
                    </div>

                    {/* Location */}
                    <p className="mt-1.5 text-xs text-slate-500 flex items-start gap-1 line-clamp-2 min-h-[30px] font-normal">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{h.address}, {h.city}</span>
                    </p>

                    {/* Price Box */}
                    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-medium text-slate-400">Monthly Rent</span>
                        <div>
                          <span className="text-lg font-bold text-cyan-700">
                            ₹{h.monthlyPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">/mo</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200/60">
                        <span className="text-[11px] font-medium text-slate-400">Daily Rate</span>
                        <span className="text-xs font-semibold text-slate-700">
                          ₹{h.dailyPrice.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/day</span>
                        </span>
                      </div>
                    </div>

                    {/* Manager Phone & Chat Button */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 min-w-0">
                        <span>📞</span>
                        {h.ownerPhone ? (
                          <a
                            href={`tel:+91${h.ownerPhone.replace(/\D/g, "").slice(-10)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-xs font-bold text-slate-700 hover:text-cyan-700 hover:underline truncate"
                            title={`Call manager: +91 ${h.ownerPhone}`}
                          >
                            +91 {h.ownerPhone.replace(/\D/g, "").slice(-10)}
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">Verified Owner</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveChat({
                            chatId: `prop_${h.id}`,
                            title: h.name,
                            subtitle: `Direct Manager Inquiry • ${h.city}`,
                            recipientName: h.ownerName || `Manager of ${h.name}`,
                            recipientPhone: h.ownerPhone,
                            senderRole: "STUDENT",
                            propertyTitle: h.name,
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg transition cursor-pointer shrink-0"
                        title="Chat with property manager"
                      >
                        <span>💬</span>
                        <span>Chat</span>
                      </button>
                    </div>

                    {/* Interactive "Click for details" bar */}
                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-cyan-700 bg-cyan-50/80 group-hover:bg-cyan-100/90 group-hover:text-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-200/70 transition">
                      <span className="flex items-center gap-1.5">
                        <span>📋</span>
                        <span>Click box for all details & amenities</span>
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Bed Request CTA */}
                  <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <RequestBedButton hostelId={h.id} stayType={stayType} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Property Details Modal */}
      {selectedPropertyModal && (
        <PropertyDetailsModal
          property={{
            id: selectedPropertyModal.id,
            name: selectedPropertyModal.name,
            ownerName: selectedPropertyModal.ownerName,
            ownerPhone: selectedPropertyModal.ownerPhone,
            type: selectedPropertyModal.type,
            city: selectedPropertyModal.city,
            address: selectedPropertyModal.address,
            dailyPrice: selectedPropertyModal.dailyPrice,
            monthlyPrice: selectedPropertyModal.monthlyPrice,
            availableBeds: selectedPropertyModal.availableBeds,
            gender: selectedPropertyModal.gender,
            isAadhaarVerified: Boolean(
              selectedPropertyModal.isAadhaarVerified ||
              (selectedPropertyModal.aadhaarNumber && selectedPropertyModal.aadhaarNumber.trim().length >= 12)
            ),
            avgRating: selectedPropertyModal.avgRating,
            reviewCount: selectedPropertyModal.reviewCount,
            canReview: selectedPropertyModal.canReview,
            reviews: selectedPropertyModal.reviews || [],
          }}
          onClose={() => setSelectedPropertyModal(null)}
          onStartChat={(p) => {
            setSelectedPropertyModal(null);
            setActiveChat({
              chatId: `prop_${p.id}`,
              title: p.name,
              subtitle: `Direct Manager Inquiry • ${p.city}`,
              recipientName: p.ownerName || `Manager of ${p.name}`,
              recipientPhone: p.ownerPhone,
              senderRole: "STUDENT",
              propertyTitle: p.name,
            });
          }}
          onOpenReviews={(p) => {
            setReviewModalHostel(p as any);
          }}
        />
      )}

      {/* Reviews Modal */}
      {reviewModalHostel && (
        <ReviewsModal
          hostelId={reviewModalHostel.id}
          hostelName={reviewModalHostel.name}
          reviews={reviewModalHostel.reviews}
          canReview={reviewModalHostel.canReview}
          onClose={() => setReviewModalHostel(null)}
        />
      )}

      {/* Direct Interactive Chat Modal */}
      {activeChat && (
        <ChatModal
          {...activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}