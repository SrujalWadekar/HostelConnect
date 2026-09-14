"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { switchAccountRole } from "@/app/actions/hostel";

export default function AccountTypeSwitcher({ currentRole }: { currentRole: "STUDENT" | "MANAGER" }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const targetRole = currentRole === "MANAGER" ? "Student" : "Manager";

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await switchAccountRole();
        // Force a full re-authentication so the session reflects the new role cleanly
        await signOut({ callbackUrl: "/login" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to switch account type.");
        setConfirming(false);
      }
    });
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Type</p>
      <p className="mt-2 text-lg font-black text-slate-900">
        Currently a {currentRole === "MANAGER" ? "Manager" : "Student"} account
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 text-sm font-bold text-cyan-600 hover:text-cyan-800 transition"
        >
          Switch to {targetRole} account →
        </button>
      ) : (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
          <p className="text-xs font-semibold text-amber-800">
            You'll be switched to a {targetRole} account and signed out. Sign back in to continue as a {targetRole}.
          </p>
          {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="px-4 py-2 bg-[#020617] hover:bg-cyan-950 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              {isPending ? "Switching..." : `Confirm switch to ${targetRole}`}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}