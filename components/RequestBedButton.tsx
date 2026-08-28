"use client";

import { useState } from "react";
import { createBookingRequest } from "@/app/actions/booking";

export default function RequestBedButton({ hostelId, stayType }: { hostelId: string, stayType: string }) {
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
      <div className="mt-6 w-full py-2.5 bg-emerald-50 text-emerald-700 font-bold text-sm text-center rounded-xl border border-emerald-200 shadow-sm">
        ✓ Request Sent!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-cyan-500/25 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? "Sending..." : "Request Bed"}
      </button>
      {error && <span className="text-[10px] font-bold text-rose-500 text-center">{error}</span>}
    </div>
  );
}