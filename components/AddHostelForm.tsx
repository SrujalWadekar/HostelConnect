"use client";

import { createHostel } from "@/app/actions/hostel";
import { useState } from "react";

export default function AddHostelForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dailyVal, setDailyVal] = useState<number>(0);
  const [bedsVal, setBedsVal] = useState<number>(1);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createHostel(formData);
      setStatusMessage({ type: "success", text: "Property successfully published to live search!" });
      form.reset();
      setDailyVal(0);
      setBedsVal(1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatusMessage({ type: "error", text: err.message });
      } else {
        setStatusMessage({ type: "error", text: "Failed to publish listing." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 md:p-7 rounded-[2rem] border border-cyan-900/10 shadow-xl shadow-cyan-950/5 relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">List Property</h2>
          <p className="text-xs text-slate-500 mt-0.5">Publish a verified hostel to students</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 text-xs font-bold rounded-xl border flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <span>{statusMessage.type === "success" ? "✓" : "⚠"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Hostel Name */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Hostel Name
        </label>
        <input
          name="name"
          required
          className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
          placeholder="e.g. Royal Heights Hostel"
        />
      </div>

      {/* City & Gender Preference */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            City
          </label>
          <input
            name="city"
            required
            className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
            placeholder="e.g. Pune"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Gender
          </label>
          <select
            name="gender"
            className="w-full px-3 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none cursor-pointer"
          >
            <option value="ANY">Co-ed / Any</option>
            <option value="MALE">Male Only</option>
            <option value="FEMALE">Female Only</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Campus / Street Address
        </label>
        <textarea
          name="address"
          required
          rows={2}
          className="w-full px-3.5 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none resize-none"
          placeholder="e.g. Near PICT Campus, Dhankawadi"
        />
      </div>

      {/* Capacity & Pricing Matrix */}
      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Daily (₹)
          </label>
          <input
            name="dailyPrice"
            type="number"
            required
            min="0"
            onChange={(e) => setDailyVal(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Monthly (₹)
          </label>
          <input
            name="monthlyPrice"
            type="number"
            required
            min="0"
            className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
            placeholder="8000"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Total Beds
          </label>
          <input
            name="availableBeds"
            type="number"
            required
            min="1"
            onChange={(e) => setBedsVal(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
            placeholder="10"
          />
        </div>
      </div>

      {/* Live Estimator Strip */}
      {dailyVal > 0 && (
        <div className="p-3 bg-[#ecfeff] border border-cyan-200/60 rounded-xl flex items-center justify-between text-xs text-cyan-900 font-bold">
          <span>Est. Max Daily Yield:</span>
          <span>₹{(dailyVal * bedsVal).toLocaleString()} / day</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#020617] hover:bg-cyan-950 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 hover:shadow-cyan-900/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Publishing Property..." : "Publish Hostel Listing"}
      </button>
    </form>
  );
}