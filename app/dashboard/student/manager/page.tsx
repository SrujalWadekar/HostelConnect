"use client";

import { useState } from "react";

export default function ManagerDashboard() {
  const [hostels, setHostels] = useState([
    { id: 1, name: "Shivaji Boys Hostel", city: "Pune", address: "Shivaji Nagar", totalBeds: 12 },
  ]);

  const [hostelName, setHostelName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bedsCount, setBedsCount] = useState("4");

  const [bookings, setBookings] = useState([
    { id: 101, studentName: "Rahul Sharma", hostel: "Shivaji Boys Hostel", dates: "12 Oct - 15 Oct", stay: "DAILY", status: "PENDING" },
    { id: 102, studentName: "Amit Verma", hostel: "Shivaji Boys Hostel", dates: "01 Nov - 30 Nov", stay: "MONTHLY", status: "ACCEPTED" },
  ]);

  const handleAddHostel = (e: React.FormEvent) => {
    e.preventDefault();
    const newHostel = {
      id: Date.now(),
      name: hostelName,
      city,
      address,
      totalBeds: Number(bedsCount) || 1,
    };
    setHostels([...hostels, newHostel]);
    setHostelName("");
    setCity("");
    setAddress("");
    alert("Hostel registered successfully!");
  };

  const handleAction = (id: number, newStatus: string) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Manage hostel properties, rooms, beds, and student check-ins.</p>
      </div>

      {/* Add Hostel Form */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Add New Hostel / PG</h2>
        <form onSubmit={handleAddHostel} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Hostel Name</label>
            <input
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Full Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Available Beds</label>
            <input
              type="number"
              value={bedsCount}
              onChange={(e) => setBedsCount(e.target.value)}
              required
              min="1"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Register Property
            </button>
          </div>
        </form>
      </section>

      {/* Booking Requests */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Student Booking Requests</h2>
        <div className="divide-y">
          {bookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <p className="font-semibold text-slate-900">{b.studentName}</p>
                <p className="text-xs text-slate-500">{b.hostel} • {b.dates} • <span className="font-medium text-blue-600">{b.stay}</span></p>
                <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                  b.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                  b.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                  b.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-800"
                }`}>
                  {b.status}
                </span>
              </div>

              {b.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(b.id, "ACCEPTED")}
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(b.id, "REJECTED")}
                    className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {b.status === "ACCEPTED" && (
                <button
                  onClick={() => handleAction(b.id, "CHECKED_IN")}
                  className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  Mark Check-In
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}