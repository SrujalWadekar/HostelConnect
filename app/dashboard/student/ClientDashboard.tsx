"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import RequestBedButton from "@/components/RequestBedButton";

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
  stayType: string;
  hostel: { name: string; type: string; address: string; city: string; monthlyPrice: number; dailyPrice: number; };
}

export default function ClientDashboard({ 
  myBookings, 
  availableProperties 
}: { 
  myBookings: StudentBooking[]; 
  availableProperties: Property[]; 
}) {
  const { data: session } = useSession();

  const [city, setCity] = useState("");
  const [stayType, setStayType] = useState<"DAILY" | "MONTHLY">("DAILY");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");

  const filteredHostels = availableProperties.filter((h) => {
    const matchesCity = city ? h.city.toLowerCase().includes(city.toLowerCase()) : true;
    const matchesGender = selectedGender === "ALL" || h.gender === selectedGender || h.gender === "ANY";
    return matchesCity && matchesGender;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* 1. PREMIUM MIDNIGHT BANNER */}
      <div className="relative bg-[#020617] text-white p-8 md:p-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-cyan-900/20">
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
                Welcome, {session?.user?.name?.split(" ")[0] || "Student"} <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-sm font-medium text-cyan-100/60 mt-1">
                Find your perfect stay. Explore verified Hostels & PGs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 text-center min-w-[140px] shadow-xl">
              <p className="text-[10px] font-black text-cyan-300/70 uppercase tracking-widest">Active Apps</p>
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

      {/* 2. FLOATING SMART FILTERS */}
      <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-3 relative z-20 -mt-4 mx-4 md:mx-10">
        <div className="flex-1 w-full relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search by city or area (e.g. Pune)..."
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-semibold"
          />
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-100"></div>

        <div className="w-full md:w-64 relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value as "DAILY" | "MONTHLY")}
            className="w-full bg-slate-50/50 hover:bg-slate-50 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="DAILY">Daily (Short-term)</option>
            <option value="MONTHLY">Monthly (Long-term)</option>
          </select>
          <div className="absolute right-4 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* 3. MY APPLICATIONS TRACKER */}
      {myBookings.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Live Application Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBookings.map((booking: StudentBooking) => (
              <div key={booking.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {booking.hostel.type}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                      booking.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
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
      )}

      {/* 4. ACCOMMODATIONS GRID */}
      <section className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 px-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Available Accommodations <span className="text-slate-400 text-lg">({filteredHostels.length})</span>
          </h2>
          
          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {["ALL", "MALE", "FEMALE"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`rounded-lg px-4 py-2 text-[11px] uppercase tracking-widest font-black transition-all ${
                  selectedGender === g
                    ? "bg-[#020617] text-white shadow-md"
                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {g === "ALL" ? "ANY" : g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((h) => (
            <div
              key={h.id}
              className="flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-cyan-900/5 hover:-translate-y-1 hover:border-cyan-300 group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="rounded-lg bg-cyan-50 border border-cyan-100 px-2.5 py-1 text-[10px] uppercase tracking-widest font-black text-cyan-700">
                    {h.gender === "ANY" ? "CO-ED" : h.gender}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {h.availableBeds} Left
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors line-clamp-1">{h.name}</h3>
                
                <p className="mt-2 text-xs font-medium text-slate-500 flex items-start gap-1.5 line-clamp-2 min-h-[32px]">
                  <svg className="w-4 h-4 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {h.address}, {h.city}
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Rate</span>
                    <span className="font-black text-slate-900 text-base">₹{h.dailyPrice.toLocaleString()}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/day</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rate</span>
                    <span className="font-black text-cyan-600 text-lg">₹{h.monthlyPrice.toLocaleString()}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/mo</span></span>
                  </div>
                </div>
              </div>

              {/* BUTTONS: Request & WhatsApp */}
              <div className="flex items-end gap-3 w-full mt-4">
                <div className="flex-1">
                  <RequestBedButton hostelId={h.id} stayType={stayType} />
                </div>
                
                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I found ${h.name} on HostelConnect. I am interested in the ${stayType.toLowerCase()} plan. Is a bed available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-[2px] flex-[0.75] flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-[#25D366]/30 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}