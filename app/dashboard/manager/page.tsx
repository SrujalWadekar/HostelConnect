import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅
import { redirect } from "next/navigation";
import AddHostelForm from "@/components/AddHostelForm";
import BookingActionButtons from "@/components/BookingActionButtons";

// Strongly-typed interfaces to eliminate TS build errors
interface StudentProfile {
  name: string | null;
  email: string | null;
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
    include: {
      hostels: {
        include: {
          bookingRequests: {
            include: { user: true },
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
  const confirmedBookings = allBookings.filter((b: EnrichedBooking) => b.status === "CONFIRMED" || b.status === "APPROVED");

  // Global Portfolio Analytics
  const activeResidents = confirmedBookings.length;
  const totalCapacity = hostels.reduce((acc: number, h: HostelItem) => {
    const occupiedInHostel = (h.bookingRequests || []).filter((b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED").length;
    return acc + h.availableBeds + occupiedInHostel;
  }, 0);

  const globalOccupancyRate = totalCapacity > 0 ? Math.round((activeResidents / totalCapacity) * 100) : 0;

  const estimatedRevenue = hostels.reduce(
    (acc: number, h: HostelItem) =>
      acc + h.monthlyPrice * (h.bookingRequests || []).filter((b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED").length,
    0
  );

  const lockedRevenue = pendingBookings.reduce((acc: number, b: EnrichedBooking) => acc + b.hostelPrice, 0);

  return (
    <div className="min-h-screen bg-[#ecfeff] text-[#020617] p-4 md:p-8 space-y-8 pb-20 font-sans">
      {/* Midnight Premium Header */}
      <div className="relative bg-[#020617] text-white p-8 md:p-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-cyan-900/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#020617] bg-cyan-400 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                Pro Dashboard
              </span>
              <span className="text-xs text-cyan-200/60 font-mono tracking-wider">
                ID: {user?.id.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              Hello, {session.user.name?.split(" ")[0] || "Manager"} <span className="inline-block">👋</span>
            </h1>
            <p className="text-sm md:text-base text-cyan-100/70 max-w-xl leading-relaxed">
              Command central for your properties. Monitor occupancy, manage students, and scale your hostel & PG network.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center min-w-[160px]">
            <p className="text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-1">Total Yield</p>
            <p className="text-2xl font-black text-white">{formatINR(estimatedRevenue)}</p>
            <p className="text-[10px] text-emerald-400 mt-1 font-medium tracking-wide">/ monthly</p>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      {pendingBookings.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-lg shadow-cyan-900/10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Action Required</h3>
              <p className="text-sm text-cyan-100">
                You have <span className="font-bold text-white">{pendingBookings.length} pending</span> requests. Approve them to unlock an additional <span className="font-black text-white border-b border-dashed border-white/50">{formatINR(lockedRevenue)}</span> in revenue!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 border border-transparent hover:border-cyan-100 group">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Properties</p>
          <p className="text-4xl font-black text-[#020617] mt-1">{hostels.length}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 border border-transparent hover:border-emerald-100 group">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Residents</p>
          <p className="text-4xl font-black text-[#020617] mt-1">{activeResidents} <span className="text-sm font-semibold text-slate-400">/ {totalCapacity}</span></p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 border border-transparent hover:border-amber-100 group">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inquiries</p>
          <p className="text-4xl font-black text-[#020617] mt-1">{pendingBookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 border border-transparent hover:border-cyan-100 group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Overall {globalOccupancyRate}%</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Occupancy</p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${globalOccupancyRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Column: Create Listing Form (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
          <AddHostelForm />
        </div>

        {/* Right Column: Inquiries & Listed Accommodations */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section: Pending Applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Inbox</h2>
              {pendingBookings.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-full border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  {pendingBookings.length} New
                </span>
              )}
            </div>

            {pendingBookings.length === 0 ? (
              <div className="bg-white py-16 px-6 rounded-[2rem] text-center flex flex-col items-center justify-center shadow-sm">
                <div className="w-20 h-20 bg-[#ecfeff] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-900 font-bold text-lg">Inbox Zero!</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">All student requests have been processed.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pendingBookings.map((booking: EnrichedBooking) => (
                  <div key={booking.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition duration-300 border border-slate-100 hover:border-cyan-200 group">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">
                          {booking.student?.name || "Student User"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {booking.student?.email}
                        </span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {booking.hostelName}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-2">
                        Applied {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <BookingActionButtons bookingId={booking.id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Active Accommodations Grid */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Portfolio</h2>
              <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                {hostels.length} Listed
              </span>
            </div>

            {hostels.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center flex flex-col items-center justify-center shadow-sm">
                <span className="text-6xl mb-4">🏢</span>
                <p className="text-slate-900 font-bold text-lg">Build Your Portfolio</p>
                <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                  You haven't listed any properties yet. Use the form to publish your first hostel or PG.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {hostels.map((hostel: HostelItem) => {
                  const occupied = (hostel.bookingRequests || []).filter((b: BookingItem) => b.status === "CONFIRMED" || b.status === "APPROVED").length;
                  const totalBeds = hostel.availableBeds + occupied;
                  const occupancyPercent = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;
                  const isFull = hostel.availableBeds === 0;
                  const isHighDemand = occupancyPercent >= 80 && !isFull;

                  return (
                    <div
                      key={hostel.id}
                      className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative border border-slate-100"
                    >
                      {/* Top Badges */}
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md">
                            {hostel.type || "HOSTEL"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                            {hostel.gender === "ANY" ? "CO-ED" : hostel.gender}
                          </span>

                          {isHighDemand && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                              🔥 High Demand
                            </span>
                          )}
                          {isFull && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-100 px-2.5 py-1 rounded-md">
                              Fully Booked
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-slate-900 text-xl group-hover:text-cyan-600 transition-colors">
                          {hostel.name}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-2 flex items-start gap-1.5 line-clamp-2 min-h-[32px]">
                          <svg className="w-4 h-4 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {hostel.address}, {hostel.city}
                        </p>
                      </div>

                      {/* Pricing & Occupancy */}
                      <div className="mt-8">
                        <div className="mb-5">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                            <span>{hostel.availableBeds} Beds Left</span>
                            <span className={isFull ? "text-rose-500" : "text-cyan-600"}>{occupancyPercent}% Booked</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                isFull
                                  ? "bg-rose-500"
                                  : isHighDemand
                                  ? "bg-gradient-to-r from-orange-400 to-rose-500"
                                  : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                          <div>
                            <span className="text-2xl font-black text-slate-900">{formatINR(hostel.monthlyPrice)}</span>
                            <span className="text-xs font-bold text-slate-400"> / mo</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            {formatINR(hostel.dailyPrice)} / day
                          </span>
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