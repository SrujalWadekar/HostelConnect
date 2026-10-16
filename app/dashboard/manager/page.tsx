import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddHostelForm from "@/components/AddHostelForm";
import BookingActionButtons from "@/components/BookingActionButtons";
import DeleteHostelButton from "@/components/DeleteHostelButton";
import ManagerInboxChatButton from "@/components/ManagerInboxChatButton";

interface StudentProfile {
  name: string | null;
  email: string | null;
  phoneNumber?: string | null;
}

interface BookingItem {
  id: string;
  status: string;
  createdAt: Date;
  user: StudentProfile | null;
}

interface HostelItem {
  id: string;
  name: string;
  type: "HOSTEL" | "PG";
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  gender: "ANY" | "MALE" | "FEMALE";
  ownerPhone?: string | null;
  aadhaarNumber?: string | null;
  bookingRequests: BookingItem[];
}

interface EnrichedBooking {
  id: string;
  status: string;
  createdAt: Date;
  student: StudentProfile | null;
  hostelName: string;
  hostelPrice: number;
}

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      ownerPhone: true,
      hostels: {
        select: {
          id: true,
          name: true,
          type: true,
          city: true,
          address: true,
          dailyPrice: true,
          monthlyPrice: true,
          availableBeds: true,
          gender: true,
          ownerPhone: true,
          aadhaarNumber: true,
          bookingRequests: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  const hostels: HostelItem[] = (user?.hostels || []) as unknown as HostelItem[];

  const allBookings: EnrichedBooking[] = hostels.flatMap((h: HostelItem) =>
    (h.bookingRequests || []).map((b: BookingItem): EnrichedBooking => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      student: b.user,
      hostelName: h.name,
      hostelPrice: h.monthlyPrice,
    }))
  );

  const pendingBookings = allBookings.filter((b: EnrichedBooking) => b.status === "PENDING");
  const confirmedBookings = allBookings.filter(
    (b: EnrichedBooking) => b.status === "CONFIRMED" || b.status === "APPROVED"
  );

  // Global Portfolio Analytics
  const activeResidents = confirmedBookings.length;
  const totalCapacity = hostels.reduce((acc: number, h: HostelItem) => {
    const occupiedInHostel = (h.bookingRequests || []).filter(
      (b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED"
    ).length;
    return acc + h.availableBeds + occupiedInHostel;
  }, 0);

  const globalOccupancyRate =
    totalCapacity > 0 ? Math.round((activeResidents / totalCapacity) * 100) : 0;

  const estimatedRevenue = hostels.reduce(
    (acc: number, h: HostelItem) =>
      acc +
      h.monthlyPrice *
        (h.bookingRequests || []).filter(
          (b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED"
        ).length,
    0
  );

  const lockedRevenue = pendingBookings.reduce(
    (acc: number, b: EnrichedBooking) => acc + b.hostelPrice,
    0
  );

  return (
    <div className="min-h-screen bg-cyan-50/50 text-[#020617] p-4 sm:p-6 md:p-8 space-y-8 pb-24">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="dash-fade-up relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-7 sm:p-9 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-950/15 border border-amber-400/20">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl text-white shadow-md shadow-orange-500/20">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-amber-200 bg-amber-400/15 border border-amber-400/25 px-3 py-0.5 rounded-full">
                  Property Manager Hub
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Hello,{" "}
                <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  {session.user.name?.split(" ")[0] || "Manager"}
                </span>{" "}
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed mt-1">
                Oversee your properties, track monthly yields, review student inquiries, and manage bed inventory.
              </p>
            </div>
          </div>

          {/* Revenue Pod */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-6 py-4 rounded-2xl shadow-sm text-center md:text-right">
            <p className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider">Active Monthly Yield</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-0.5">{formatINR(estimatedRevenue)}</p>
            <span className="text-[10px] text-emerald-400 font-medium">● Confirmed Revenue</span>
          </div>
        </div>
      </div>

      {/* 2. ACTION REQUIRED ALERT */}
      {pendingBookings.length > 0 && (
        <div className="dash-fade-up dash-delay-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-md shadow-orange-500/15">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-orange-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  Action Required
                </span>
                <span className="text-xs font-semibold text-white/90">● High Demand</span>
              </div>
              <h3 className="font-bold text-lg text-white mt-1">
                You have {pendingBookings.length} pending student request{pendingBookings.length > 1 ? "s" : ""}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 font-normal mt-0.5">
                Review and approve to unlock an additional{" "}
                <span className="font-bold underline decoration-white/70">
                  {formatINR(lockedRevenue)}
                </span>{" "}
                in prospective monthly revenue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 4-KPI OVERVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1 */}
        <div className="dash-fade-up dash-delay-1 bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Live Units
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Listings</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{hostels.length}</p>
        </div>

        {/* KPI 2 */}
        <div className="dash-fade-up dash-delay-2 bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Placed
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Residents</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {activeResidents}{" "}
            <span className="text-xs font-normal text-slate-400">/ {totalCapacity} beds</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="dash-fade-up dash-delay-3 bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            {pendingBookings.length > 0 ? (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Needs Review
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                All Cleared
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Inquiries</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{pendingBookings.length}</p>
        </div>

        {/* KPI 4 */}
        <div className="dash-fade-up dash-delay-4 bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {globalOccupancyRate}% Occupancy
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Occupancy</p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${globalOccupancyRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <AddHostelForm defaultOwnerPhone={user?.ownerPhone || ""} />
        </div>

        {/* Right Column: Inquiries & Portfolio */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section: Pending Student Applications */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Student Inbox</h2>
                {pendingBookings.length > 0 && (
                  <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                    {pendingBookings.length} New
                  </span>
                )}
              </div>
            </div>

            {pendingBookings.length === 0 ? (
              <div className="bg-white py-12 px-6 rounded-2xl text-center flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl text-emerald-600 mb-2">
                  ✓
                </div>
                <p className="text-slate-900 font-bold text-base">Inbox Zero</p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs font-normal">
                  All student requests have been processed.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pendingBookings.map((booking: EnrichedBooking) => (
                  <div
                    key={booking.id}
                    className="bg-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition duration-200 border border-slate-200 hover:border-amber-300"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {booking.student?.name?.[0]?.toUpperCase() || "S"}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          {booking.student?.name || "Student User"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-normal">
                        <span>✉️ {booking.student?.email}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        {booking.student?.phoneNumber ? (
                          <a
                            href={`tel:+91${booking.student.phoneNumber.replace(/\D/g, "").slice(-10)}`}
                            className="font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded flex items-center gap-1 hover:underline"
                            title={`Call student: +91 ${booking.student.phoneNumber}`}
                          >
                            <span>📞</span>
                            <span>+91 {booking.student.phoneNumber.replace(/\D/g, "").slice(-10)}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No phone added</span>
                        )}
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded">
                          🏢 {booking.hostelName}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                        Applied on {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <ManagerInboxChatButton
                        bookingId={booking.id}
                        studentName={booking.student?.name || "Student User"}
                        studentPhone={booking.student?.phoneNumber}
                        hostelName={booking.hostelName}
                      />
                      <BookingActionButtons bookingId={booking.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Active Accommodations Portfolio */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Active Portfolio</h2>
              <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                {hostels.length} Listed
              </span>
            </div>

            {hostels.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                <span className="text-4xl mb-2">🏡</span>
                <p className="text-slate-900 font-bold text-base">Build Your Portfolio</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1 font-normal">
                  You haven't listed any properties yet. Use the form on the left to publish your first hostel or PG.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostels.map((hostel: HostelItem) => {
                  const occupied = (hostel.bookingRequests || []).filter(
                    (b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED"
                  ).length;
                  const totalBeds = hostel.availableBeds + occupied;
                  const occupancyPercent =
                    totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;
                  const isFull = hostel.availableBeds === 0;
                  const isHighDemand = occupancyPercent >= 80 && !isFull;

                  return (
                    <div
                      key={hostel.id}
                      className="dash-fade-up bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between border border-slate-200 hover:border-amber-300"
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                            {hostel.type || "HOSTEL"}
                          </span>
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {hostel.gender === "ANY" ? "Co-ed" : hostel.gender}
                          </span>

                          {isHighDemand && (
                            <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <span>🔥</span>
                              <span>High Demand</span>
                            </span>
                          )}

                          {isFull && (
                            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                              Full
                            </span>
                          )}

                          {hostel.aadhaarNumber && hostel.aadhaarNumber.trim().length >= 12 ? (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1" title="Aadhaar Verified Host">
                              <span>🛡️</span>
                              <span>Aadhaar Verified</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1" title="Aadhaar not submitted">
                              <span>⚠️</span>
                              <span>Unverified Host</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                          {hostel.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1 line-clamp-2 min-h-[30px] font-normal">
                          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{hostel.address}, {hostel.city}</span>
                        </p>
                      </div>

                      {/* Pricing & Occupancy Meter */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100">
                        <div className="mb-3">
                          <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                            <span>{hostel.availableBeds} Beds Vacant</span>
                            <span className={isFull ? "text-rose-600 font-semibold" : "text-emerald-700 font-semibold"}>
                              {occupancyPercent}% Booked
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isFull
                                  ? "bg-rose-500"
                                  : isHighDemand
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2.5">
                          <div>
                            <span className="text-xl font-bold text-slate-900">
                              {formatINR(hostel.monthlyPrice)}
                            </span>
                            <span className="text-xs text-slate-400 font-normal">/mo</span>
                          </div>
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {formatINR(hostel.dailyPrice)}/day
                          </span>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <DeleteHostelButton hostelId={hostel.id} hostelName={hostel.name} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}