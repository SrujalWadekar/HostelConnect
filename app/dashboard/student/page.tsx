"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MOCK_HOSTELS = [
  {
    id: 1,
    name: "Green Valley Hostel",
    city: "Pune",
    address: "Near MIT Campus, Kothrud",
    dailyPrice: 250,
    monthlyPrice: 4000,
    availableBeds: 5,
    gender: "MALE",
  },
  {
    id: 2,
    name: "City Stay PG",
    city: "Mumbai",
    address: "Andheri East, Near Metro",
    dailyPrice: 350,
    monthlyPrice: 5500,
    availableBeds: 3,
    gender: "FEMALE",
  },
  {
    id: 3,
    name: "Campus Nest Accommodations",
    city: "Pune",
    address: "Viman Nagar, Symbiosis Lane",
    dailyPrice: 200,
    monthlyPrice: 3500,
    availableBeds: 8,
    gender: "ANY",
  },
];

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [city, setCity] = useState("");
  const [stayType, setStayType] = useState<"DAILY" | "MONTHLY">("DAILY");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const filteredHostels = MOCK_HOSTELS.filter((h) => {
    const matchesCity = city ? h.city.toLowerCase().includes(city.toLowerCase()) : true;
    const matchesGender =
      selectedGender === "ALL" || h.gender === selectedGender || h.gender === "ANY";
    return matchesCity && matchesGender;
  });

  const handleRequestBooking = (hostelName: string) => {
    const userName = session?.user?.name || "Student";
    alert(`Success! Booking request submitted for "${hostelName}" by ${userName}. The manager will review and confirm.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* USER PROFILE BANNER */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "Student Avatar"}
              className="h-16 w-16 rounded-2xl border-2 border-cyan-400 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl font-black text-cyan-600 ring-1 ring-cyan-200">
              {session?.user?.name?.charAt(0) || "🎓"}
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
              <span>🎓</span> Student Account
            </div>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Welcome, {session?.user?.name || "Student"}!
            </h1>
            <p className="text-sm text-slate-500">{session?.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t pt-4 sm:border-t-0 sm:pt-0">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Requests</p>
            <p className="text-lg font-black text-slate-900">0</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase">Saved</p>
            <p className="text-lg font-black text-cyan-600">3</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Search & Filters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">City / Area</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune, Mumbai"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Stay Type</label>
            <select
              value={stayType}
              onChange={(e) => setStayType(e.target.value as "DAILY" | "MONTHLY")}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            >
              <option value="DAILY">Daily (Short-term)</option>
              <option value="MONTHLY">Monthly (Long-term)</option>
            </select>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Available Hostels ({filteredHostels.length})
          </h2>
          <div className="flex gap-2">
            {["ALL", "MALE", "FEMALE"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${selectedGender === g
                  ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((h) => (
            <div
              key={h.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-cyan-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{h.name}</h3>
                  <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-xs font-bold text-cyan-700 ring-1 ring-cyan-200/50">
                    {h.gender}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {h.address}, {h.city}
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Rate:</span>
                    <span className="font-bold text-slate-900">₹{h.dailyPrice}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rate:</span>
                    <span className="font-bold text-slate-900">₹{h.monthlyPrice}/mo</span>
                  </div>
                  <div className="flex justify-between pt-1 font-semibold text-emerald-600">
                    <span>Available Beds:</span>
                    <span>{h.availableBeds} beds</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRequestBooking(h.name)}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-cyan-500/25 hover:opacity-95 active:scale-[0.99]"
              >
                Request Bed
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}