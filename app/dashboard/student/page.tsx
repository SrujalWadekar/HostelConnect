"use client";

import { useState } from "react";

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
  const [city, setCity] = useState("");
  const [stayType, setStayType] = useState<"DAILY" | "MONTHLY">("DAILY");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");

  const filteredHostels = MOCK_HOSTELS.filter((h) => {
    const matchesCity = city ? h.city.toLowerCase().includes(city.toLowerCase()) : true;
    const matchesGender = selectedGender === "ALL" || h.gender === selectedGender || h.gender === "ANY";
    return matchesCity && matchesGender;
  });

  const handleRequestBooking = (hostelName: string) => {
    alert(`Success! Booking request submitted for "${hostelName}". The manager will review and confirm.`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Search and request short-term or long-term verified stays.</p>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Search & Filters</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-600">City / Area</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune, Mumbai"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Stay Type</label>
            <select
              value={stayType}
              onChange={(e) => setStayType(e.target.value as "DAILY" | "MONTHLY")}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-blue-600"
            >
              <option value="DAILY">Daily (Short-term)</option>
              <option value="MONTHLY">Monthly (Long-term)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Available Hostels ({filteredHostels.length})</h2>
          <div className="flex gap-2">
            {["ALL", "MALE", "FEMALE"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  selectedGender === g
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((h) => (
            <div key={h.id} className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-slate-900">{h.name}</h3>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{h.gender}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{h.address}, {h.city}</p>

                <div className="mt-4 border-t pt-3 space-y-1 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Rate:</span>
                    <span className="font-semibold">₹{h.dailyPrice}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rate:</span>
                    <span className="font-semibold">₹{h.monthlyPrice}/mo</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium pt-1">
                    <span>Available Beds:</span>
                    <span>{h.availableBeds} beds</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRequestBooking(h.name)}
                className="mt-5 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
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