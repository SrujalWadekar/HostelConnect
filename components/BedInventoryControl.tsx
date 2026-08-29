"use client";

import { useState } from "react";
import { updateHostelBeds } from "@/app/actions/hostel";

interface BedInventoryControlProps {
  hostelId: string;
  initialBeds: number;
}

export default function BedInventoryControl({
  hostelId,
  initialBeds,
}: BedInventoryControlProps) {
  const [beds, setBeds] = useState<number>(initialBeds);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleBedChange(delta: number) {
    const nextBeds = Math.max(0, beds + delta);
    setBeds(nextBeds); // Optimistic UI update
    setLoading(true);

    try {
      await updateHostelBeds(hostelId, nextBeds);
    } catch (error) {
      console.error("Failed to update beds:", error);
      setBeds(beds); // Revert on failure
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2 mt-4">
      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pl-1">
        Manage Beds
      </span>

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={() => handleBedChange(-1)}
          disabled={loading || beds <= 0}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          title="Remove 1 bed"
        >
          −
        </button>

        {/* Current Bed Count */}
        <span className="w-8 text-center text-sm font-black text-slate-900">
          {beds}
        </span>

        {/* Increment Button */}
        <button
          type="button"
          onClick={() => handleBedChange(1)}
          disabled={loading}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-cyan-600 text-white font-black text-sm hover:bg-cyan-700 transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Add 1 bed"
        >
          +
        </button>
      </div>
    </div>
  );
}