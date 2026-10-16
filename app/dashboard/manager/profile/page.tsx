import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditHostelModal from "@/components/EditHostelModal";
import BedInventoryControl from "@/components/BedInventoryControl";
import ManagerInboxChatButton from "@/components/ManagerInboxChatButton";
import { PropertyType, GenderAllowed } from "@prisma/client";

interface StudentChatUser {
  name: string | null;
  email: string | null;
  phoneNumber?: string | null;
}

interface StudentChatBooking {
  id: string;
  status: string;
  createdAt: Date;
  user: StudentChatUser | null;
}

interface HostelProfileData {
  id: string;
  name: string;
  ownerPhone: string | null;
  aadhaarNumber?: string | null;
  type: PropertyType;
  gender: GenderAllowed;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  bookingRequests?: StudentChatBooking[];
  _count: {
    bookingRequests: number;
  };
}

interface PropertyMetric {
  id: string;
  name: string;
  ownerPhone: string | null;
  aadhaarNumber?: string | null;
  type: PropertyType;
  gender: GenderAllowed;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  capacity: number;
  occupied: number;
  vacant: number;
  realizedMonthly: number;
  potentialMonthly: number;
  vacancyLoss: number;
  efficiencyRate: number;
}

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default async function ManagerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      ownerPhone: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch manager's listed properties and booking stats
  const rawHostels = await prisma.hostel.findMany({
    where: { managerId: user.id },
    select: {
      id: true,
      name: true,
      ownerPhone: true,
      aadhaarNumber: true,
      type: true,
      gender: true,
      city: true,
      address: true,
      dailyPrice: true,
      monthlyPrice: true,
      availableBeds: true,
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
      _count: {
        select: {
          bookingRequests: {
            where: { status: "CONFIRMED" },
          },
        },
      },
    },
  });

  const hostels: HostelProfileData[] = rawHostels as unknown as HostelProfileData[];

  const studentChats = hostels.flatMap((h) =>
    (h.bookingRequests || []).map((b) => ({
      bookingId: b.id,
      status: b.status,
      createdAt: b.createdAt,
      hostelName: h.name,
      hostelCity: h.city,
      studentName: b.user?.name || "Student Applicant",
      studentEmail: b.user?.email || "No email",
      studentPhone: b.user?.phoneNumber || null,
    }))
  );

  let totalBedsCapacity = 0;
  let totalOccupiedBeds = 0;
  let totalVacantBeds = 0;
  let actualRevenue = 0;
  let maxPotentialRevenue = 0;

  const propertyMetrics: PropertyMetric[] = hostels.map(
    (hostel: HostelProfileData): PropertyMetric => {
      const confirmedCount = hostel._count.bookingRequests;
      const capacity = hostel.availableBeds + confirmedCount;
      const vacancy = hostel.availableBeds;

      const realizedMonthly = confirmedCount * hostel.monthlyPrice;
      const potentialMonthly = capacity * hostel.monthlyPrice;
      const vacancyLoss = vacancy * hostel.monthlyPrice;

      totalBedsCapacity += capacity;
      totalOccupiedBeds += confirmedCount;
      totalVacantBeds += vacancy;
      actualRevenue += realizedMonthly;
      maxPotentialRevenue += potentialMonthly;

      return {
        id: hostel.id,
        name: hostel.name,
        ownerPhone: hostel.ownerPhone,
        aadhaarNumber: hostel.aadhaarNumber,
        type: hostel.type,
        gender: hostel.gender,
        city: hostel.city,
        address: hostel.address,
        dailyPrice: hostel.dailyPrice,
        monthlyPrice: hostel.monthlyPrice,
        availableBeds: hostel.availableBeds,
        capacity,
        occupied: confirmedCount,
        vacant: vacancy,
        realizedMonthly,
        potentialMonthly,
        vacancyLoss,
        efficiencyRate: capacity > 0 ? Math.round((confirmedCount / capacity) * 100) : 0,
      };
    }
  );

  const isAadhaarVerified = Boolean(
    hostels.some((h) => h.aadhaarNumber && h.aadhaarNumber.trim().length >= 12)
  );

  const totalVacancyLoss = maxPotentialRevenue - actualRevenue;
  const portfolioEfficiency =
    maxPotentialRevenue > 0
      ? Math.round((actualRevenue / maxPotentialRevenue) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#ecfeff] text-[#020617] p-4 md:p-10 space-y-8 pb-20 font-sans">

      {/* 1. Header Navigation */}
      <div className="dash-fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/manager"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-800 hover:text-cyan-950 mb-2 transition"
          >
            ← Back to Operations
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Manager Portfolio & Asset Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Manage your accommodation listing, edit prices and capacity, and review audited earnings.
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
            🏢
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">Portfolio Efficiency</span>
            <span className="text-sm font-bold text-amber-600">{portfolioEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* 2. Manager Identity Card — role-themed badge, no Google photo */}
      <div className="dash-fade-up dash-delay-1 bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-900 rounded-[2.5rem] px-6 py-6 md:px-10 md:py-8 text-white shadow-2xl shadow-cyan-900/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-amber-500 opacity-10 blur-[120px]" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-[3px] shadow-lg shadow-amber-900/40">
            <div className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-[#020617] text-2xl md:text-3xl font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "M"}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#020617] text-xs ring-2 ring-[#020617]">
              🏢
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#020617] bg-amber-400 px-3 py-0.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                Manager Portal
              </span>
              {isAadhaarVerified ? (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Aadhaar Verified Host</span>
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  ⚠️ Aadhaar Unverified
                </span>
              )}
              <span className="text-[10px] font-medium text-cyan-200/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                🔒 Details Private To You
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{user.name || "Manager"}</h2>
            <p className="text-xs text-cyan-200/70 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 relative z-10">
          <div className="text-center px-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200 block">Listed Properties</span>
            <span className="text-2xl font-bold text-white mt-1 block">{hostels.length}</span>
          </div>
          <div className="text-center px-3 border-l border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200 block">Active Residents</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">{totalOccupiedBeds}</span>
          </div>
          <div className="text-center px-3 border-l border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200 block">Vacant Beds</span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{totalVacantBeds}</span>
          </div>
        </div>
      </div>

      {/* 3. STUDENT CHATS & INQUIRIES RECEIVED AFTER REQUESTING A BED */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                💬 Student Messaging Hub
              </span>
              {studentChats.length > 0 && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {studentChats.length} Inquiries
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Student Inquiries & Chat Mode
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Direct chat details received from students who requested a bed in your properties.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/dashboard/manager/messages"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>💬 Open Full Message Center</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {studentChats.length === 0 ? (
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 font-bold text-xl flex items-center justify-center mb-1">
              💬
            </div>
            <h3 className="font-bold text-base text-slate-900">No Student Messages Yet</h3>
            <p className="text-xs text-slate-500 max-w-md font-normal leading-relaxed">
              When students browse your hostels and request a bed, their verified contact details and direct Chat Mode will appear right here so you can answer inquiries and confirm bookings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentChats.map((chat) => {
              const cleanPhone = chat.studentPhone ? chat.studentPhone.replace(/\D/g, "").slice(-10) : null;
              const isApproved = chat.status === "CONFIRMED" || chat.status === "APPROVED";
              const isRejected = chat.status === "REJECTED";

              return (
                <div
                  key={chat.bookingId}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {chat.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {chat.studentName}
                          </h4>
                          <p className="text-xs text-slate-400 font-normal">
                            {chat.studentEmail}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md border shrink-0 ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isRejected
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {chat.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px] font-medium">Applied Accommodation</span>
                        <span className="font-bold text-slate-900 truncate max-w-[180px]">
                          🏢 {chat.hostelName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 text-[11px] font-medium">Student Mobile</span>
                        {cleanPhone ? (
                          <a
                            href={`tel:+91${cleanPhone}`}
                            className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            title={`Call student +91 ${cleanPhone}`}
                          >
                            <span>📞</span>
                            <span>+91 {cleanPhone.slice(0, 5)} {cleanPhone.slice(5)}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Applied {new Date(chat.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>

                    <div className="flex items-center gap-2">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                            `Hi ${chat.studentName}, I received your booking request for ${chat.hostelName} on HostelConnect.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition"
                          title="Chat on WhatsApp"
                        >
                          💬 WhatsApp
                        </a>
                      )}

                      <ManagerInboxChatButton
                        bookingId={chat.bookingId}
                        studentName={chat.studentName}
                        studentPhone={chat.studentPhone}
                        hostelName={chat.hostelName}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. YOUR LISTED PROPERTY (List Once & Edit Anytime) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Your Property Information</h2>
            <p className="text-xs text-slate-500">List your property once and edit details or availability whenever needed.</p>
          </div>
          <Link
            href="/dashboard/manager/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition self-start sm:self-auto"
          >
            <span>+ List New Property</span>
          </Link>
        </div>

        {propertyMetrics.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center space-y-3">
            <span className="text-5xl block mb-2">🏢</span>
            <h3 className="text-lg font-bold text-slate-900">No property listed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              List your Hostel or PG once on the operations dashboard, and you can edit prices, rooms, and location here anytime.
            </p>
            <Link
              href="/dashboard/manager/listings/new"
              className="inline-block mt-3 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Go to List Property Form →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {propertyMetrics.map((hostel) => (
              <div
                key={hostel.id}
                className="dash-fade-up bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Property Badges & Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md">
                          {hostel.type}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {hostel.gender === "ANY" ? "CO-ED" : hostel.gender}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{hostel.name}</h3>
                      {hostel.ownerPhone && (
                        <p className="text-[11px] font-mono text-slate-400 mt-1">
                          Owner: +91 {hostel.ownerPhone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <EditHostelModal hostel={hostel} />
                      <Link
                        href={`/dashboard/manager/listings/edit?id=${hostel.id}`}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-semibold transition"
                        title="Comprehensive Property Editor"
                      >
                        Edit ↗
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-500 flex items-start gap-1.5">
                    <svg className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{hostel.address}, {hostel.city}</span>
                  </p>

                  {/* Pricing Overview */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
                      <span className="text-lg font-bold text-slate-900">{formatINR(hostel.monthlyPrice)}<span className="text-xs font-normal text-slate-400">/mo</span></span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Daily Rate</span>
                      <span className="text-lg font-bold text-slate-900">{formatINR(hostel.dailyPrice)}<span className="text-xs font-normal text-slate-400">/day</span></span>
                    </div>
                  </div>
                </div>

                {/* Bed Inventory Quick Controller */}
                <div>
                  <BedInventoryControl hostelId={hostel.id} initialBeds={hostel.vacant} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FINANCIAL & YIELD KPIS */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Financial & Portfolio Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="dash-fade-up dash-delay-1 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
            <div className="w-2 h-full bg-emerald-500 absolute top-0 left-0"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Monthly Yield</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{formatINR(actualRevenue)}</p>
            <p className="text-xs text-slate-500 mt-2">Realized from confirmed student beds</p>
          </div>

          <div className="dash-fade-up dash-delay-2 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Potential Gross</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{formatINR(maxPotentialRevenue)}</p>
            <p className="text-xs text-slate-500 mt-2">Estimated yield at 100% capacity</p>
          </div>

          <div className="dash-fade-up dash-delay-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
            <div className="w-2 h-full bg-rose-500 absolute top-0 left-0"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Vacancy Loss</p>
            <p className="text-3xl font-bold text-rose-600 mt-2">{formatINR(totalVacancyLoss)}</p>
            <p className="text-xs text-rose-700/80 mt-2 font-medium">Uncollected from {totalVacantBeds} empty beds</p>
          </div>

          <div className="dash-fade-up dash-delay-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bed Utilization</p>
            <p className="text-3xl font-bold text-cyan-800 mt-2">
              {totalOccupiedBeds} <span className="text-base text-slate-400 font-semibold">/ {totalBedsCapacity}</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">{totalVacantBeds} beds remaining to monetize</p>
          </div>
        </div>
      </section>

      {/* 5. PROPERTY YIELD BREAKDOWN TABLE */}
      {propertyMetrics.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Property Yield & Loss Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">Individual property financial efficiency audit</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3">Property Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Capacity</th>
                  <th className="pb-3">Realized Yield</th>
                  <th className="pb-3">Vacancy Loss</th>
                  <th className="pb-3">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {propertyMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-4">
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-xs">{item.city}</td>
                    <td className="py-4 text-xs font-semibold text-slate-700">
                      {item.occupied} occ / {item.vacant} vac
                    </td>
                    <td className="py-4 font-bold text-emerald-600">{formatINR(item.realizedMonthly)}</td>
                    <td className="py-4 font-bold text-rose-600">{formatINR(item.vacancyLoss)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-600 h-full rounded-full"
                            style={{ width: `${item.efficiencyRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.efficiencyRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}