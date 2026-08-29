"use client";

import { useState } from "react";
import { updateHostelDetails } from "@/app/actions/hostel";
import { PropertyType, GenderAllowed } from "@prisma/client";

interface EditHostelModalProps {
  hostel: {
    id: string;
    name: string;
    type: PropertyType;
    gender: GenderAllowed;
    city: string;
    address: string;
    dailyPrice: number;
    monthlyPrice: number;
    availableBeds: number;
  };
}

export default function EditHostelModal({ hostel }: EditHostelModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: hostel.name,
    type: hostel.type,
    gender: hostel.gender,
    city: hostel.city,
    address: hostel.address,
    dailyPrice: hostel.dailyPrice.toString(),
    monthlyPrice: hostel.monthlyPrice.toString(),
    availableBeds: hostel.availableBeds.toString(),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateHostelDetails(hostel.id, {
        name: form.name,
        type: form.type,
        gender: form.gender,
        city: form.city,
        address: form.address,
        dailyPrice: Number(form.dailyPrice),
        monthlyPrice: Number(form.monthlyPrice),
        availableBeds: Number(form.availableBeds),
      });
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
      >
        <span>✏️</span>
        <span>Edit Property Details</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-100 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Property Details</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Update pricing, location, or available beds</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="HOSTEL">HOSTEL</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as GenderAllowed })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="ANY">Co-ed (Any)</option>
                    <option value="MALE">Boys Only</option>
                    <option value="FEMALE">Girls Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    City / Area
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Available Beds
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.availableBeds}
                    onChange={(e) => setForm({ ...form, availableBeds: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.monthlyPrice}
                    onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Daily Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.dailyPrice}
                    onChange={(e) => setForm({ ...form, dailyPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50"
                >
                  {loading ? "Saving Changes..." : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}