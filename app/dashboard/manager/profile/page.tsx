import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditHostelModal from "@/components/EditHostelModal";
import BedInventoryControl from "@/components/BedInventoryControl";
import { PropertyType, GenderAllowed } from "@prisma/client";

interface HostelProfileData {
  id: string;
  name: string;
  type: PropertyType;
  gender: GenderAllowed;
  city: string;
  address: string;
  dailyPrice: number;
  monthlyPrice: number;
  availableBeds: number;
  _count: {
    bookingRequests: number;
  };
}

interface PropertyMetric {
  id: string;
  name: string;
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
      type: true,
      gender: true,
      city: true,
      address: true,
      dailyPrice: true,
      monthlyPrice: true,
      availableBeds: true,
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

  const totalVacancyLoss = maxPotentialRevenue - actualRevenue;
  const portfolioEfficiency =
    maxPotentialRevenue > 0
      ? Math.round((actualRevenue / maxPotentialRevenue) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#ecfeff] text-[#020617] p-4 md:p-10 space-y-8 pb-20 font-sans">
      
      {/* 1. Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/manager"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-800 hover:text-cyan-950 mb-2 transition"
          >
            ← Back to Operations
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Manager Portfolio & Asset Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your accommodation listing, edit prices and capacity, and review audited earnings.
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
            🏢
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Portfolio Efficiency</span>
            <span className="text-sm font-black text-cyan-700">{portfolioEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* 2. Manager Identity Card */}
      <div className="bg-[#020617] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-cyan-900/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-500 opacity-20 blur-[120px]" />
        
        <div className="flex items-center gap-5 relative z-10">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Manager"}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cyan-400/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-black text-white flex items-center justify-center shadow-lg">
              {user.name?.[0]?.toUpperCase() || "M"}
            </div>
          )}

          <div>
            <div className="inline-block text-[10px] font-black uppercase tracking-widest text-[#020617] bg-cyan-400 px-3 py-0.5 rounded-full mb-1.5 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              Verified Host / Manager
            </div>
            <h2 className="text-2xl md:text-3xl font-black">{user.name || "Manager"}</h2>
            <p className="text-xs text-cyan-200/70 font-mono mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 relative z-10">
          <div className="text-center px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block">Listed Properties</span>
            <span className="text-2xl font-black text-white mt-1 block">{hostels.length}</span>
          </div>
          <div className="text-center px-3 border-l border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block">Active Residents</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{totalOccupiedBeds}</span>
          </div>
          <div className="text-center px-3 border-l border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block">Vacant Beds</span>
            <span className="text-2xl font-black text-cyan-300 mt-1 block">{totalVacantBeds}</span>
          </div>
        </div>
      </div>

      {/* 3. YOUR LISTED PROPERTY (List Once & Edit Anytime) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Property Information</h2>
            <p className="text-xs text-slate-500">List your property once and edit details or availability whenever needed.</p>
          </div>
        </div>

        {propertyMetrics.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-200 text-center space-y-3">
            <span className="text-5xl block mb-2">🏢</span>
            <h3 className="text-lg font-bold text-slate-900">No property listed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              List your Hostel or PG once on the operations dashboard, and you can edit prices, rooms, and location here anytime.
            </p>
            <Link
              href="/dashboard/manager"
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
                className="bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Property Badges & Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-md">
                          {hostel.type}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {hostel.gender === "ANY" ? "CO-ED" : hostel.gender}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{hostel.name}</h3>
                    </div>

                    <EditHostelModal hostel={hostel} />
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Monthly Rent</span>
                      <span className="text-lg font-black text-slate-900">{formatINR(hostel.monthlyPrice)}<span className="text-xs font-normal text-slate-400">/mo</span></span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Daily Rate</span>
                      <span className="text-lg font-black text-slate-900">{formatINR(hostel.dailyPrice)}<span className="text-xs font-normal text-slate-400">/day</span></span>
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
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial & Portfolio Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-2 h-full bg-emerald-500 absolute top-0 left-0"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Monthly Yield</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{formatINR(actualRevenue)}</p>
            <p className="text-xs text-slate-500 mt-2">Realized from confirmed student beds</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Potential Gross</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{formatINR(maxPotentialRevenue)}</p>
            <p className="text-xs text-slate-500 mt-2">Estimated yield at 100% capacity</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-2 h-full bg-rose-500 absolute top-0 left-0"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Vacancy Loss</p>
            <p className="text-3xl font-black text-rose-600 mt-2">{formatINR(totalVacancyLoss)}</p>
            <p className="text-xs text-rose-700/80 mt-2 font-medium">Uncollected from {totalVacantBeds} empty beds</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bed Utilization</p>
            <p className="text-3xl font-black text-cyan-800 mt-2">
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Property Yield & Loss Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">Individual property financial efficiency audit</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
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
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-xs">{item.city}</td>
                    <td className="py-4 text-xs font-semibold text-slate-700">
                      {item.occupied} occ / {item.vacant} vac
                    </td>
                    <td className="py-4 font-black text-emerald-600">{formatINR(item.realizedMonthly)}</td>
                    <td className="py-4 font-black text-rose-600">{formatINR(item.vacancyLoss)}</td>
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