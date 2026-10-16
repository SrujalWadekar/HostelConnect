"use client";

import { useState, useTransition } from "react";
import { saveStudentPhone } from "@/app/actions/hostel";

export default function StudentPhoneForm({ currentPhone }: { currentPhone: string }) {
  const [phone, setPhone] = useState(currentPhone);
  const [editing, setEditing] = useState(!currentPhone);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const displayPhone = currentPhone ? `+91 ${currentPhone.slice(0, 5)} ${currentPhone.slice(5)}` : null;

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    // Only digits, max 10
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    setError(null);
    setSuccess(false);
  }

  function handleSave() {
    setError(null);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number starting with 6–9.");
      return;
    }
    startTransition(async () => {
      try {
        await saveStudentPhone(phone);
        setSuccess(true);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
      }
    });
  }

  if (!editing && currentPhone) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-cyan-50 border border-cyan-200 rounded-2xl">
        <div className="flex items-center gap-3">
          {/* Phone icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
            <svg className="h-5 w-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">Mobile Number</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">{displayPhone}</p>
          </div>
          {success && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              ✓ Saved
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => { setEditing(true); setSuccess(false); }}
          className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 underline underline-offset-2 transition"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {/* +91 prefix badge */}
        <div className="flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl select-none shrink-0">
          🇮🇳 +91
        </div>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handleInput}
          maxLength={10}
          placeholder="98765 43210"
          className={`flex-1 px-4 py-3 text-sm font-semibold border rounded-xl bg-slate-50 focus:bg-white focus:border-cyan-500 transition-all outline-none tracking-widest ${
            error ? "border-rose-400 bg-rose-50" : "border-slate-200"
          }`}
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <span>⚠</span> {error}
        </p>
      )}

      <p className="text-[10px] text-slate-400">
        Must be a valid Indian mobile number (starts with 6, 7, 8, or 9 — 10 digits total).
      </p>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || phone.length !== 10}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition active:scale-[0.98]"
        >
          {isPending ? "Saving..." : "Save Number"}
        </button>
        {currentPhone && (
          <button
            type="button"
            onClick={() => { setEditing(false); setPhone(currentPhone); setError(null); }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

