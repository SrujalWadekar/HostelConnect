"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import RequestBedButton from "@/components/RequestBedButton";
import { motion } from "framer-motion";

interface Property {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  gender: string;
}

interface StudentBooking {
  id: string;
  status: string;
  stayType?: string;
  hostel: {
    name: string;
    type: string;
    address: string;
    city: string;
    monthlyPrice: number;
    dailyPrice: number;
  };
}

export default function ClientDashboard({
  myBookings = [],
  availableProperties = []
}: {
  myBookings: StudentBooking[];
  availableProperties: Property[];
}) {
  const { data: session } = useSession();

  const [city, setCity] = useState("");
  const [stayType, setStayType] = useState<"DAILY" | "MONTHLY">("MONTHLY");
  const [selectedType, setSelectedType] = useState<string>("ALL"); // ALL, HOSTEL, PG
  const [selectedGender, setSelectedGender] = useState<string>("ALL"); // ALL, MALE, FEMALE
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hideFull, setHideFull] = useState(false);
  // Filtered properties based on user selection
  const filteredHostels = availableProperties.filter((h) => {
    const matchesCity = city.trim()
      ? h.city.toLowerCase().includes(city.toLowerCase()) ||
      h.name.toLowerCase().includes(city.toLowerCase()) ||
      h.address.toLowerCase().includes(city.toLowerCase())
      : true;

    const matchesType = selectedType === "ALL" || h.type.toUpperCase() === selectedType.toUpperCase();

    const matchesGender =
      selectedGender === "ALL" ||
      h.gender.toUpperCase() === selectedGender.toUpperCase() ||
      h.gender === "ANY";

    const relevantPrice = stayType === "DAILY" ? h.dailyPrice : h.monthlyPrice;
    const matchesPrice = maxPrice === "" || relevantPrice <= maxPrice;

    const matchesAvailability = !hideFull || h.availableBeds > 0;

    return matchesCity && matchesType && matchesGender && matchesPrice && matchesAvailability;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">

      {/* 1. MIDNIGHT HEADER BANNER */}
      <div className="dash-fade-up relative bg-[#020617] text-white p-8 md:p-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-cyan-900/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Student"}
                className="h-20 w-20 rounded-2xl border-2 border-cyan-400/50 object-cover shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-black text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                {session?.user?.name?.charAt(0) || "🎓"}
              </div>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">
                Student Hub
              </div>
              <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
                Welcome, {session?.user?.name?.split(" ")[0] || "Student"} <span className="inline-block">👋</span>
              </h1>
              <p className="text-sm font-medium text-cyan-100/60 mt-1">
                Find your perfect stay. Explore verified Hostels & PGs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 text-center min-w-[140px] shadow-xl">
              <p className="text-[10px] font-black text-cyan-300/70 uppercase tracking-widest">Active Requests</p>
              <p className="text-3xl font-black text-white mt-1">{myBookings.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 text-center min-w-[140px] shadow-xl">
              <p className="text-[10px] font-black text-cyan-300/70 uppercase tracking-widest">Available Beds</p>
              <p className="text-3xl font-black text-cyan-400 mt-1">
                {availableProperties.reduce((acc, curr) => acc + curr.availableBeds, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SMART SEARCH & FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-3 relative z-20 -mt-4 mx-4 md:mx-10"
      >
        {/* Search */}
        <div className="flex-1 w-full relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city, property name, or area..."
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100"></div>

        {/* Property Type Filter */}
        <div className="w-full md:w-48 relative flex items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 outline-none transition-all cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="HOSTEL">Hostel Only</option>
            <option value="PG">PG Only</option>
          </select>
        </div>

        {/* Pricing Plan Selector */}
        <div className="w-full md:w-56 relative flex items-center">
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value as "DAILY" | "MONTHLY")}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 outline-none transition-all cursor-pointer"
          >
            <option value="MONTHLY">Monthly Plan (Rent)</option>
            <option value="DAILY">Daily Plan (Short-term)</option>
          </select>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100"></div>

        {/* Max Price Filter */}
        <div className="w-full md:w-48 relative flex items-center">
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder={stayType === "DAILY" ? "Max ₹/day" : "Max ₹/month"}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Hide Full Toggle */}
        <label className="w-full md:w-auto flex items-center gap-2 bg-slate-50/50 hover:bg-slate-50 rounded-2xl py-3.5 px-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideFull}
            onChange={(e) => setHideFull(e.target.checked)}
            className="w-4 h-4 accent-cyan-600"
          />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Hide Full</span>
        </label>
      </motion.div>

      {/* 3. MY APPLICATIONS TRACKER */}
      {
        myBookings.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">My Booking Requests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.map((booking: StudentBooking) => (
                <div key={booking.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {booking.hostel.type}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${booking.status === "CONFIRMED" || booking.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        booking.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                          "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors">{booking.hostel.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{booking.hostel.address}, {booking.hostel.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* 4. ACCOMMODATIONS GRID */}
      <section className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 px-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Available Accommodations <span className="text-slate-400 text-lg">({filteredHostels.length})</span>
          </h2>

          {/* Gender Filter Buttons */}
          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[
              { label: "All", value: "ALL" },
              { label: "Boys", value: "MALE" },
              { label: "Girls", value: "FEMALE" },
            ].map((g) => (
              <button
                key={g.value}
                onClick={() => setSelectedGender(g.value)}
                className={`rounded-lg px-4 py-2 text-[11px] uppercase tracking-widest font-black transition-all ${selectedGender === g.value
                  ? "bg-[#020617] text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {filteredHostels.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2rem] border border-slate-100 space-y-3">
            <span className="text-5xl block mb-2">🏢</span>
            <h3 className="text-lg font-bold text-slate-900">No properties match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHostels.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-cyan-900/5 hover:border-cyan-300 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="rounded-lg bg-cyan-50 border border-cyan-100 px-2.5 py-1 text-[10px] uppercase tracking-widest font-black text-cyan-700">
                      {h.type} • {h.gender === "ANY" ? "CO-ED" : h.gender}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {h.availableBeds} Left
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors line-clamp-1">{h.name}</h3>

                  <p className="mt-2 text-xs font-medium text-slate-500 flex items-start gap-1.5 line-clamp-2 min-h-[32px]">
                    <svg className="w-4 h-4 shrink-0 text-slate-300 fill-none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {h.address}, {h.city}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rate</span>
                      <span className="font-black text-cyan-600 text-lg">₹{h.monthlyPrice.toLocaleString()}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/mo</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Rate</span>
                      <span className="font-black text-slate-900 text-base">₹{h.dailyPrice.toLocaleString()}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/day</span></span>
                    </div>
                  </div>
                </div>

                {/* BUTTON: Request Bed */}
                <div className="mt-4">
                  <RequestBedButton hostelId={h.id} stayType={stayType} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div >
  );
}