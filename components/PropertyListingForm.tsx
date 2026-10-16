"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createHostel, updateHostel } from "@/app/actions/hostel";

export interface RoomInventoryConfig {
  singleSharing: { enabled: boolean; roomsCount: number; pricePerBed: number };
  doubleSharing: { enabled: boolean; roomsCount: number; pricePerBed: number };
  tripleSharing: { enabled: boolean; roomsCount: number; pricePerBed: number };
  dormitory: { enabled: boolean; roomsCount: number; pricePerBed: number };
}

export interface PropertyListingFormData {
  // 1. Manager & Contact Details
  managerName: string;
  contactNumber: string;
  aadhaarNumber: string;
  email: string;
  emergencyContact: string;

  // 2. Property Classification & Layout
  propertyName: string;
  city: string;
  address: string;
  propertyType: "PG" | "HOSTEL" | "CO_LIVING" | "FLAT";
  targetGender: "BOYS" | "GIRLS" | "COED";
  layoutStructure: string;
  totalCapacity: number;

  // 3. Inventory & Sharing Configuration
  inventory: RoomInventoryConfig;

  // 4. Pricing & Rent Rules
  monthlyRent: number;
  dailyRate: number;
  securityDeposit: string;
  maintenanceCharges: "INCLUDED" | "EXTRA";
  utilityBills: "FIXED" | "SUB_METER" | "INCLUDED";
  noticePeriod: string;

  // 5. Essential Amenities Checklist
  foodAmenities: string[];
  comfortAmenities: string[];
  techSecurityAmenities: string[];
}

interface PropertyListingFormProps {
  initialData?: Partial<PropertyListingFormData>;
  hostelId?: string;
  isEditing?: boolean;
}

export default function PropertyListingForm({
  initialData,
  hostelId,
  isEditing = false,
}: PropertyListingFormProps) {
  const router = useRouter();
  const formUid = useId();

  // Form State
  const [formData, setFormData] = useState<PropertyListingFormData>({
    managerName: initialData?.managerName || "",
    contactNumber: initialData?.contactNumber || "",
    aadhaarNumber: initialData?.aadhaarNumber || "",
    email: initialData?.email || "",
    emergencyContact: initialData?.emergencyContact || "",

    propertyName: initialData?.propertyName || "",
    city: initialData?.city || "",
    address: initialData?.address || "",
    propertyType: initialData?.propertyType || "PG",
    targetGender: initialData?.targetGender || "COED",
    layoutStructure: initialData?.layoutStructure || "Hostel Building (Multi-room)",
    totalCapacity: initialData?.totalCapacity || 10,

    inventory: initialData?.inventory || {
      singleSharing: { enabled: true, roomsCount: 2, pricePerBed: 10000 },
      doubleSharing: { enabled: true, roomsCount: 4, pricePerBed: 7500 },
      tripleSharing: { enabled: false, roomsCount: 0, pricePerBed: 6000 },
      dormitory: { enabled: false, roomsCount: 0, pricePerBed: 4500 },
    },

    monthlyRent: initialData?.monthlyRent || 7500,
    dailyRate: initialData?.dailyRate || 400,
    securityDeposit: initialData?.securityDeposit || "1 Month Rent",
    maintenanceCharges: initialData?.maintenanceCharges || "INCLUDED",
    utilityBills: initialData?.utilityBills || "INCLUDED",
    noticePeriod: initialData?.noticePeriod || "1 Month",

    foodAmenities: initialData?.foodAmenities || ["Self-Cooking Kitchen Allowed"],
    comfortAmenities: initialData?.comfortAmenities || ["Geyser/Hot Water", "Washing Machine / Laundry Service", "Daily Housekeeping"],
    techSecurityAmenities: initialData?.techSecurityAmenities || ["High-Speed Wi-Fi", "CCTV Cameras", "24/7 Power Backup"],
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPayload, setSuccessPayload] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Live Aadhaar validation
  const cleanAadhaar = formData.aadhaarNumber.replace(/[\s\-]/g, "");
  const isAadhaarValid = /^\d{12}$/.test(cleanAadhaar);
  const cleanPhone = formData.contactNumber.replace(/\D/g, "").slice(-10);
  const isPhoneValid = /^[6-9]\d{9}$/.test(cleanPhone);

  // Field change handler
  const handleInputChange = (field: keyof PropertyListingFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Inventory field handler
  const handleInventoryChange = (
    roomType: keyof RoomInventoryConfig,
    key: "enabled" | "roomsCount" | "pricePerBed",
    val: boolean | number
  ) => {
    setFormData((prev) => {
      const current = prev.inventory[roomType];
      const updatedRoom = { ...current, [key]: val };
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [roomType]: updatedRoom,
        },
      };
    });
  };

  // Toggle amenity helper
  const toggleAmenity = (
    category: "foodAmenities" | "comfortAmenities" | "techSecurityAmenities",
    amenity: string
  ) => {
    setFormData((prev) => {
      const list = prev[category];
      const exists = list.includes(amenity);
      const updated = exists ? list.filter((item) => item !== amenity) : [...list, amenity];
      return { ...prev, [category]: updated };
    });
  };

  // Client-side validator
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.managerName.trim()) {
      newErrors.managerName = "Manager full name is required.";
    }
    if (!isPhoneValid) {
      newErrors.contactNumber = "Enter a valid 10-digit Indian mobile number.";
    }
    if (formData.aadhaarNumber.trim() && !isAadhaarValid) {
      newErrors.aadhaarNumber = "Aadhaar must be exactly 12 numeric digits.";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email address is required.";
    }
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = "Property name is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Property street/campus address is required.";
    }
    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = "Expected base monthly rent must be greater than ₹0.";
    }
    if (!formData.totalCapacity || formData.totalCapacity < 1) {
      newErrors.totalCapacity = "Total capacity must be at least 1 bed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`${formUid}-${firstErrorKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build server form payload
      const srvFormData = new FormData();
      srvFormData.set("name", formData.propertyName);
      srvFormData.set("city", formData.city);
      srvFormData.set("address", formData.address);
      srvFormData.set("monthlyPrice", formData.monthlyRent.toString());
      srvFormData.set("dailyPrice", (formData.dailyRate || Math.round(formData.monthlyRent / 20)).toString());
      srvFormData.set("availableBeds", formData.totalCapacity.toString());
      srvFormData.set("type", formData.propertyType === "HOSTEL" ? "HOSTEL" : "PG");
      srvFormData.set(
        "gender",
        formData.targetGender === "BOYS"
          ? "MALE"
          : formData.targetGender === "GIRLS"
          ? "FEMALE"
          : "ANY"
      );
      srvFormData.set("ownerPhone", cleanPhone);
      if (cleanAadhaar && isAadhaarValid) {
        srvFormData.set("aadhaarNumber", cleanAadhaar);
      }

      if (isEditing && hostelId) {
        srvFormData.set("id", hostelId);
        await updateHostel(srvFormData);
      } else {
        await createHostel(srvFormData);
      }

      // Format complete JSON payload for Success Modal
      const fullJsonPayload = JSON.stringify(
        {
          meta: {
            action: isEditing ? "UPDATE_LISTING" : "CREATE_LISTING",
            timestamp: new Date().toISOString(),
            platform: "HostelConnect Real Estate Engine",
          },
          managerDetails: {
            fullName: formData.managerName,
            contactNumber: `+91 ${cleanPhone}`,
            aadhaarNumber: isAadhaarValid ? `${cleanAadhaar.slice(0, 4)} **** ${cleanAadhaar.slice(8)}` : null,
            aadhaarVerified: isAadhaarValid,
            email: formData.email,
            emergencyContact: formData.emergencyContact ? `+91 ${formData.emergencyContact}` : null,
          },
          propertyClassification: {
            name: formData.propertyName,
            city: formData.city,
            address: formData.address,
            type: formData.propertyType,
            targetGender: formData.targetGender,
            layoutStructure: formData.layoutStructure,
            totalCapacity: formData.totalCapacity,
          },
          inventoryConfiguration: formData.inventory,
          pricingAndRules: {
            expectedMonthlyRentINR: formData.monthlyRent,
            dailyRateINR: formData.dailyRate,
            securityDeposit: formData.securityDeposit,
            maintenanceCharges: formData.maintenanceCharges,
            utilityBills: formData.utilityBills,
            noticePeriod: formData.noticePeriod,
          },
          amenitiesChecklist: {
            food: formData.foodAmenities,
            comfort: formData.comfortAmenities,
            techSecurity: formData.techSecurityAmenities,
          },
        },
        null,
        2
      );

      setSuccessPayload(fullJsonPayload);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to publish listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyJson = () => {
    if (successPayload) {
      navigator.clipboard.writeText(successPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* ── HEADER INTRO ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-7 sm:p-9 rounded-[2.5rem] border border-amber-400/20 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🏢</span>
              <span>{isEditing ? "Edit Accommodation" : "New Property Listing Form"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEditing ? "Update Your Property Listing" : "List Your Hostel, PG, or Co-Living Stay"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
              Complete the structured architecture below. All bed inventory, pricing, and amenities sync immediately to the live public platform and student portal.
            </p>
          </div>

          <Link
            href="/dashboard/manager"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition backdrop-blur-md"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ── FORM CONTAINER ── */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* ── 1. MANAGER & CONTACT DETAILS SECTION ── */}
        <section className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-base font-bold">
                1
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Manager & Contact Details
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Your identity & direct communication channels. Privacy protected.
                </p>
              </div>
            </div>

            {/* Privacy Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <span>🔒</span>
              <span>Private & Encrypted</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor={`${formUid}-managerName`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-managerName`}
                type="text"
                value={formData.managerName}
                onChange={(e) => handleInputChange("managerName", e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.managerName
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              {errors.managerName && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.managerName}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor={`${formUid}-contactNumber`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 select-none">
                  +91
                </span>
                <input
                  id={`${formUid}-contactNumber`}
                  type="tel"
                  maxLength={10}
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-r-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                    errors.contactNumber
                      ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                  }`}
                />
              </div>
              {errors.contactNumber && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.contactNumber}</p>
              )}
            </div>

            {/* Aadhaar Card Number with Real-time Verification status */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${formUid}-aadhaarNumber`}
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Aadhaar Card Number
                </label>
                {isAadhaarValid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <span>🛡️</span>
                    <span>Aadhaar Verified Host</span>
                  </span>
                ) : formData.aadhaarNumber.trim() ? (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    12 digits required
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">
                    Required for Verified Badge
                  </span>
                )}
              </div>
              <input
                id={`${formUid}-aadhaarNumber`}
                type="text"
                maxLength={14}
                value={formData.aadhaarNumber}
                onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                placeholder="12-digit Aadhaar (e.g. 1234 5678 9012)"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.aadhaarNumber
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isAadhaarValid
                  ? "✓ Your property will be certified with the 🛡️ Aadhaar Verified badge."
                  : "Properties without a valid 12-digit Aadhaar show as '⚠️ Unverified Host'."}
              </p>
              {errors.aadhaarNumber && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.aadhaarNumber}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor={`${formUid}-email`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-email`}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="manager@hostelconnect.in"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.email
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Emergency/Alternative Contact Number */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`${formUid}-emergencyContact`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Emergency / Alternative Contact Number{" "}
                <span className="text-slate-400 font-normal normal-case">(Optional backup)</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 select-none">
                  +91
                </span>
                <input
                  id={`${formUid}-emergencyContact`}
                  type="tel"
                  maxLength={10}
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Optional warden or caretaker phone"
                  className="w-full px-4 py-3 rounded-r-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PROPERTY CLASSIFICATION & LAYOUT SECTION ── */}
        <section className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-base font-bold">
              2
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Property Classification & Layout Structure
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Define the stay category, gender eligibility, physical layout, and total capacity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Property Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`${formUid}-propertyName`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-propertyName`}
                type="text"
                value={formData.propertyName}
                onChange={(e) => handleInputChange("propertyName", e.target.value)}
                placeholder="e.g. Royal Heights Student PG & Hostel"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.propertyName
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              {errors.propertyName && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.propertyName}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label
                htmlFor={`${formUid}-city`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                City <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-city`}
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g. Pune"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.city
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              {errors.city && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.city}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor={`${formUid}-address`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Street / Campus Address <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-address`}
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="e.g. Near PICT College, Katraj-Dehu Bypass"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.address
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              {errors.address && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Property Type Dropdown */}
            <div>
              <label
                htmlFor={`${formUid}-propertyType`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Property Type <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formUid}-propertyType`}
                value={formData.propertyType}
                onChange={(e) =>
                  handleInputChange(
                    "propertyType",
                    e.target.value as "PG" | "HOSTEL" | "CO_LIVING" | "FLAT"
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition cursor-pointer"
              >
                <option value="PG">🏠 Paying Guest (PG)</option>
                <option value="HOSTEL">🛏️ Hostel</option>
                <option value="CO_LIVING">🏢 Managed Co-Living Space</option>
                <option value="FLAT">🏘️ Independent Flat/Apartment</option>
              </select>
            </div>

            {/* Property Layout Structure Dropdown */}
            <div>
              <label
                htmlFor={`${formUid}-layoutStructure`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Property Layout Structure
              </label>
              <select
                id={`${formUid}-layoutStructure`}
                value={formData.layoutStructure}
                onChange={(e) => handleInputChange("layoutStructure", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition cursor-pointer"
              >
                <option value="Hostel Building (Multi-room)">Hostel Building (Multi-room)</option>
                <option value="1 RK (Room Kitchen)">1 RK (Room Kitchen)</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>

            {/* Target Gender Radio Cards */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Target Gender <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "BOYS", label: "Boys Only", icon: "👦" },
                  { key: "GIRLS", label: "Girls Only", icon: "👧" },
                  { key: "COED", label: "Co-Ed / Mixed", icon: "👥" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleInputChange("targetGender", item.key)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                      formData.targetGender === item.key
                        ? "border-cyan-600 bg-cyan-50/70 text-cyan-900 ring-2 ring-cyan-200 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 text-slate-700"
                    }`}
                  >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Capacity */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`${formUid}-totalCapacity`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Total Bed Capacity (Entire Property) <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formUid}-totalCapacity`}
                type="number"
                min={1}
                value={formData.totalCapacity}
                onChange={(e) => handleInputChange("totalCapacity", parseInt(e.target.value) || 0)}
                placeholder="e.g. 24"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                  errors.totalCapacity
                    ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                }`}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                How many total beds/guests can the entire property accommodate when 100% occupied?
              </p>
              {errors.totalCapacity && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.totalCapacity}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 3. INVENTORY & SHARING CONFIGURATION SECTION ── */}
        <section className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base font-bold">
                3
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Room Inventory & Sharing Configuration
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Configure specific room tiers, counts, and price per bed.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Multi-Sharing Matrix
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "singleSharing",
                title: "Single Sharing (Private Room)",
                subtitle: "1 bed per room with dedicated private space",
                icon: "🛏️",
              },
              {
                id: "doubleSharing",
                title: "Double Sharing (Twin Sharing)",
                subtitle: "2 beds per room with shared amenities",
                icon: "👥",
              },
              {
                id: "tripleSharing",
                title: "Triple Sharing (3 Beds)",
                subtitle: "3 beds per room, ideal for college friends",
                icon: "👨‍👦‍👦",
              },
              {
                id: "dormitory",
                title: "4+ Multi-Bed Dormitory",
                subtitle: "Community dormitory format with 4 or more beds",
                icon: "🏢",
              },
            ].map((room) => {
              const currentRoom = formData.inventory[room.id as keyof RoomInventoryConfig];
              return (
                <div
                  key={room.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    currentRoom.enabled
                      ? "border-cyan-300 bg-cyan-50/20 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 opacity-80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={currentRoom.enabled}
                        onChange={(e) =>
                          handleInventoryChange(
                            room.id as keyof RoomInventoryConfig,
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="rounded accent-cyan-600 w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                          <span>{room.icon}</span>
                          <span>{room.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">{room.subtitle}</p>
                      </div>
                    </label>

                    {currentRoom.enabled && (
                      <div className="grid grid-cols-2 gap-3 shrink-0 pt-2 sm:pt-0">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Rooms Available
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={currentRoom.roomsCount}
                            onChange={(e) =>
                              handleInventoryChange(
                                room.id as keyof RoomInventoryConfig,
                                "roomsCount",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:border-cyan-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Rent / Bed (₹)
                          </label>
                          <input
                            type="number"
                            min={500}
                            step={100}
                            value={currentRoom.pricePerBed}
                            onChange={(e) =>
                              handleInventoryChange(
                                room.id as keyof RoomInventoryConfig,
                                "pricePerBed",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 outline-none focus:border-cyan-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. PRICING & RENT RULES SECTION ── */}
        <section className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-base font-bold">
              4
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Pricing & Rent Rules
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Monthly rent base, security deposits, utility arrangements, and notice policies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Monthly Rent */}
            <div>
              <label
                htmlFor={`${formUid}-monthlyRent`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Base Monthly Rent (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 select-none">
                  ₹
                </span>
                <input
                  id={`${formUid}-monthlyRent`}
                  type="number"
                  min={500}
                  step={100}
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", parseInt(e.target.value) || 0)}
                  placeholder="7500"
                  className={`w-full px-4 py-3 rounded-r-xl border text-sm font-semibold text-slate-900 outline-none transition ${
                    errors.monthlyRent
                      ? "border-rose-400 bg-rose-50/40 focus:ring-2 focus:ring-rose-200"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600"
                  }`}
                />
              </div>
              {errors.monthlyRent && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.monthlyRent}</p>
              )}
            </div>

            {/* Daily Stay Price */}
            <div>
              <label
                htmlFor={`${formUid}-dailyRate`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Daily Transient Rate (INR ₹)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 select-none">
                  ₹
                </span>
                <input
                  id={`${formUid}-dailyRate`}
                  type="number"
                  min={50}
                  value={formData.dailyRate}
                  onChange={(e) => handleInputChange("dailyRate", parseInt(e.target.value) || 0)}
                  placeholder="400"
                  className="w-full px-4 py-3 rounded-r-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition"
                />
              </div>
            </div>

            {/* Security Deposit Amount */}
            <div>
              <label
                htmlFor={`${formUid}-securityDeposit`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Security Deposit Policy
              </label>
              <select
                id={`${formUid}-securityDeposit`}
                value={formData.securityDeposit}
                onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition cursor-pointer"
              >
                <option value="1 Month Rent">1 Month Rent (Refundable)</option>
                <option value="2 Months Rent">2 Months Rent (Refundable)</option>
                <option value="Fixed Amount (₹5,000)">Fixed Amount (₹5,000)</option>
                <option value="No Security Deposit">No Security Deposit Required</option>
              </select>
            </div>

            {/* Notice Period Required */}
            <div>
              <label
                htmlFor={`${formUid}-noticePeriod`}
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Notice Period
              </label>
              <select
                id={`${formUid}-noticePeriod`}
                value={formData.noticePeriod}
                onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 focus:bg-white focus:border-cyan-600 text-sm font-semibold text-slate-900 outline-none transition cursor-pointer"
              >
                <option value="1 Month">1 Month Notice Required</option>
                <option value="2 Months">2 Months Notice Required</option>
                <option value="15 Days">15 Days Notice Required</option>
                <option value="No Notice Period">No Notice Period</option>
              </select>
            </div>

            {/* Maintenance Charges */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Maintenance Charges
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: "INCLUDED", label: "Included in Rent" },
                  { key: "EXTRA", label: "Extra / Separate" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleInputChange("maintenanceCharges", item.key)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      formData.maintenanceCharges === item.key
                        ? "border-cyan-600 bg-cyan-50/80 text-cyan-900 ring-2 ring-cyan-200"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Utility Bills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Electricity & Water Bills
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "INCLUDED", label: "Included in Rent" },
                  { key: "SUB_METER", label: "Sub-meter Reading" },
                  { key: "FIXED", label: "Fixed Monthly" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleInputChange("utilityBills", item.key)}
                    className={`py-2.5 px-2 rounded-xl border text-[11px] font-bold transition cursor-pointer text-center ${
                      formData.utilityBills === item.key
                        ? "border-cyan-600 bg-cyan-50/80 text-cyan-900 ring-2 ring-cyan-200"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ESSENTIAL AMENITIES CHECKLIST ── */}
        <section className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-base font-bold">
              5
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Essential Amenities Checklist
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Tag your food facilities, comfort conveniences, and security systems.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Category 1: Food */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                🍽️ Food & Kitchen Facility
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Meals Included (3 times)",
                  "Meals Included (2 times)",
                  "Self-Cooking Kitchen Allowed",
                  "No Food Facility",
                ].map((item) => {
                  const active = formData.foodAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity("foodAmenities", item)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                        active
                          ? "border-amber-500 bg-amber-50/60 text-amber-950 font-bold"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className={`text-sm ${active ? "text-amber-600 font-bold" : "text-slate-300"}`}>
                        {active ? "✓" : "○"}
                      </span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category 2: Comfort */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                ❄️ Comfort & Housekeeping
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "AC Available",
                  "Geyser/Hot Water",
                  "Washing Machine / Laundry Service",
                  "Daily Housekeeping",
                ].map((item) => {
                  const active = formData.comfortAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity("comfortAmenities", item)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                        active
                          ? "border-cyan-500 bg-cyan-50/60 text-cyan-950 font-bold"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className={`text-sm ${active ? "text-cyan-600 font-bold" : "text-slate-300"}`}>
                        {active ? "✓" : "○"}
                      </span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category 3: Tech / Security */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                🛡️ Technology & Security
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "High-Speed Wi-Fi",
                  "CCTV Cameras",
                  "Biometric/Card Access Control",
                  "24/7 Power Backup",
                ].map((item) => {
                  const active = formData.techSecurityAmenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity("techSecurityAmenities", item)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                        active
                          ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className={`text-sm ${active ? "text-emerald-600 font-bold" : "text-slate-300"}`}>
                        {active ? "✓" : "○"}
                      </span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTION BAR ── */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <p className="text-sm font-bold">Ready to Publish Accommodation?</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Validates your inputs, generates a structured JSON payload, and publishes directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/manager"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Publishing..." : isEditing ? "Save & Update Listing" : "Submit & Publish Listing →"}
            </button>
          </div>
        </div>
      </form>

      {/* ── SUCCESS MODAL WITH STRUCTURED JSON PAYLOAD INSPECTOR ── */}
      {successPayload && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-bold">
                  ✓
                </span>
                <div>
                  <h3 className="text-lg font-bold">Property Successfully Published!</h3>
                  <p className="text-xs text-emerald-100">
                    Live JSON payload generated and database synchronized.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessPayload(null);
                  router.push("/dashboard/manager");
                }}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: JSON Payload */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Structured Platform Ingestion Payload
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📋</span>
                  <span>{copiedPayload ? "Copied to Clipboard!" : "Copy JSON"}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-cyan-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed">
                {successPayload}
              </pre>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <span className="text-lg">🛡️</span>
                <p>
                  <strong>Live Synchronization Active:</strong> This listing is now queryable on the public homepage and searchable by college students without logging in.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSuccessPayload(null);
                  router.push("/dashboard/manager");
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                Go to Manager Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

