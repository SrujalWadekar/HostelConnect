"use client";

import { useState, useTransition } from "react";
import { deleteHostel } from "@/app/actions/hostel";

export default function DeleteHostelButton({ hostelId, hostelName }: { hostelId: string; hostelName: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteHostel(hostelId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete listing.");
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-rose-600">Delete {hostelName}?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1.5"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-full transition"
      >
        Delete
      </button>
      {error && <span className="text-[10px] text-rose-500 font-medium">{error}</span>}
    </div>
  );
}