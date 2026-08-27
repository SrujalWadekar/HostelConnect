"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/app/actions/booking";
import { BookingStatus } from "@prisma/client";

interface BookingActionButtonsProps {
  bookingId: string;
}

export default function BookingActionButtons({ bookingId }: BookingActionButtonsProps) {
  const [activeAction, setActiveAction] = useState<"CONFIRMED" | "REJECTED" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleStatus(status: "CONFIRMED" | "REJECTED") {
    setActiveAction(status);
    setErrorMsg(null);

    try {
      await updateBookingStatus(bookingId, status as BookingStatus);
    } catch (error: unknown) {
      console.error("Failed to update booking status:", error);
      setErrorMsg("Failed to update. Please try again.");
      setActiveAction(null);
    }
  }

  const isLoading = activeAction !== null;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {/* Accept Button */}
        <button
          onClick={() => handleStatus("CONFIRMED")}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {activeAction === "CONFIRMED" ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Accepting...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Accept</span>
            </>
          )}
        </button>

        {/* Reject Button */}
        <button
          onClick={() => handleStatus("REJECTED")}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {activeAction === "REJECTED" ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-rose-700" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Rejecting...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <span className="text-[11px] font-medium text-rose-600">
          {errorMsg}
        </span>
      )}
    </div>
  );
}