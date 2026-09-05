"use client";

import { createHostel } from "@/app/actions/hostel";
import { useState, useRef } from "react";

export default function AddHostelForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [step, setStep] = useState<number>(1);
  const [dailyVal, setDailyVal] = useState<number>(0);
  const [bedsVal, setBedsVal] = useState<number>(1);
  const [validationModal, setValidationModal] = useState<string[] | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Final safety net: validate step 3 too, in case someone reaches submit with gaps
    const missing = getMissingFields(3);
    if (missing.length > 0) {
      setValidationModal(missing);
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createHostel(formData);
      setStatusMessage({ type: "success", text: "Property successfully published!" });
      form.reset();
      setStep(1);
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

  // Returns a list of human-readable field names that are empty/invalid for a given step
  function getMissingFields(targetStep: number): string[] {
    if (!formRef.current) return [];
    const data = new FormData(formRef.current);
    const missing: string[] = [];

    if (targetStep === 1) {
      if (!data.get("name")?.toString().trim()) missing.push("Property Name");
    }

    if (targetStep === 2) {
      if (!data.get("city")?.toString().trim()) missing.push("City");
      if (!data.get("address")?.toString().trim()) missing.push("Campus / Street Address");
    }

    if (targetStep === 3) {
      const daily = Number(data.get("dailyPrice"));
      const monthly = Number(data.get("monthlyPrice"));
      const beds = Number(data.get("availableBeds"));

      if (!data.get("dailyPrice") || isNaN(daily) || daily < 0) missing.push("Daily Price");
      if (!data.get("monthlyPrice") || isNaN(monthly) || monthly < 0) missing.push("Monthly Price");
      if (!data.get("availableBeds") || isNaN(beds) || beds < 1) missing.push("Total Beds");
    }

    return missing;
  }

  const nextStep = () => {
    const missing = getMissingFields(step);
    if (missing.length > 0) {
      setValidationModal(missing);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 md:p-8 rounded-[2rem] border border-cyan-900/10 shadow-xl shadow-cyan-950/5 relative overflow-hidden"
      >
        {/* Header & Progress indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">List Property</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Step {step} of 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? "w-6 bg-cyan-500" : "w-2 bg-slate-200"}`}></div>
            ))}
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 text-sm font-bold rounded-xl border flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span>{statusMessage.type === "success" ? "✓" : "⚠"}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* STEP 1: Basic Details */}
        <div className={step === 1 ? "space-y-4 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Property Name</label>
            <input
              name="name"
              required={step === 1}
              className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 transition-all outline-none"
              placeholder="e.g. Royal Heights Living"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
              <select
                name="type"
                className="w-full px-3 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 transition-all outline-none cursor-pointer"
              >
                <option value="HOSTEL">Hostel</option>
                <option value="PG">PG (Paying Guest)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Gender</label>
              <select
                name="gender"
                className="w-full px-3 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 transition-all outline-none cursor-pointer"
              >
                <option value="ANY">Co-ed / Any</option>
                <option value="MALE">Male Only</option>
                <option value="FEMALE">Female Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2: Location */}
        <div className={step === 2 ? "space-y-4 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">City</label>
            <input
              name="city"
              required={step === 2}
              className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 transition-all outline-none"
              placeholder="e.g. Pune"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Campus / Street Address</label>
            <textarea
              name="address"
              required={step === 2}
              rows={3}
              className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 transition-all outline-none resize-none"
              placeholder="e.g. Near PICT Campus, Dhankawadi"
            />
          </div>
        </div>

        {/* STEP 3: Pricing & Capacity */}
        <div className={step === 3 ? "space-y-4 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Daily (₹)</label>
              <input
                name="dailyPrice"
                type="number"
                required={step === 3}
                min="0"
                onChange={(e) => setDailyVal(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Monthly (₹)</label>
              <input
                name="monthlyPrice"
                type="number"
                required={step === 3}
                min="0"
                className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
                placeholder="8000"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Beds</label>
            <input
              name="availableBeds"
              type="number"
              required={step === 3}
              min="1"
              onChange={(e) => setBedsVal(Number(e.target.value) || 1)}
              className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-cyan-500 outline-none"
              placeholder="10"
            />
          </div>

          {dailyVal > 0 && (
            <div className="p-4 mt-2 bg-[#ecfeff] border border-cyan-200/60 rounded-xl flex items-center justify-between text-sm text-cyan-900 font-bold">
              <span>Est. Max Daily Yield:</span>
              <span>₹{(dailyVal * bedsVal).toLocaleString()} / day</span>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-all active:scale-[0.98]"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-3.5 bg-[#020617] hover:bg-cyan-950 text-white font-black text-sm rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Accommodation"}
            </button>
          )}
        </div>
      </form>

      {/* VALIDATION POPUP MODAL */}
      {validationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setValidationModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[1.75rem] p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-slate-900">Missing details</h3>
            <p className="text-sm text-slate-500 mt-1">
              Please fill in the following before continuing:
            </p>
            <ul className="mt-4 space-y-2">
              {validationModal.map((field) => (
                <li key={field} className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl">
                  <span className="text-rose-500">•</span>
                  {field}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setValidationModal(null)}
              className="mt-6 w-full py-3 bg-[#020617] hover:bg-cyan-950 text-white font-black text-sm rounded-xl transition-all active:scale-[0.98]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}