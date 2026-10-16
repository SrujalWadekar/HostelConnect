"use client";

import { useState } from "react";
import { createBookingRequest } from "@/app/actions/booking";

export default function RequestBedButton({
  hostelId,
  stayType = "MONTHLY",
  className = "",
}: {
  hostelId: string;
  stayType?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleBooking() {
    setLoading(true);
    setError(null);
    try {
      await createBookingRequest(hostelId, stayType);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to send request.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={`w-full h-11 px-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 font-bold text-xs uppercase tracking-wider text-center rounded-xl border border-emerald-300/60 shadow-sm flex items-center justify-center gap-2 ${className}`}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">✓</span>
        <span>Booking Request Sent!</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <button
        type="button"
        onClick={handleBooking}
        disabled={loading}
        className="w-full h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-cyan-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Sending Request...</span>
          </>
        ) : (
          <>
            <span>Request Bed</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
      {error && <span className="text-[11px] font-bold text-rose-500 text-center bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-xl">{error}</span>}
    </div>
  );
}