"use client";

import { createHostel } from "@/app/actions/hostel";
import { useState } from "react";

export default function AddHostelForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createHostel(formData);
      setMessage("Hostel listing created successfully!");
      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Failed to create hostel listing.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-cyan-900/10 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-900">List New Hostel</h2>
        <p className="text-xs text-slate-500 mt-0.5">Fill in the property details to publish live.</p>
      </div>

      {message && (
        <div className="p-3 text-xs font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-lg">
          {message}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase">Hostel Name</label>
        <input
          name="name"
          required
          className="w-full mt-1 p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-cyan-600"
          placeholder="e.g. Royal Heights Hostel"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
          <input
            name="city"
            required
            className="w-full mt-1 p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-cyan-600"
            placeholder="e.g. Pune"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase">Gender Preference</label>
          <select
            name="gender"
            className="w-full mt-1 p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-cyan-600"
          >
            <option value="ANY">Co-ed / Any</option>
            <option value="MALE">Male Only</option>
            <option value="FEMALE">Female Only</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase">Full Address</label>
        <textarea
          name="address"
          required
          rows={2}
          className="w-full mt-1 p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-cyan-600 resize-none"
          placeholder="e.g. Plot 45, Near PICT Campus, Dhankawadi"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase">Daily (₹)</label>
          <input
            name="dailyPrice"
            type="number"
            required
            min="0"
            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase">Monthly (₹)</label>
          <input
            name="monthlyPrice"
            type="number"
            required
            min="0"
            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white"
            placeholder="8000"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase">Beds</label>
          <input
            name="availableBeds"
            type="number"
            required
            min="1"
            className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white"
            placeholder="8"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl transition shadow-sm disabled:opacity-50"
      >
        {loading ? "Publishing listing..." : "Publish Listing"}
      </button>
    </form>
  );
}