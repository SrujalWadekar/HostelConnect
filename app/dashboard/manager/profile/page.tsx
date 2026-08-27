import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

const formatINR = (amount: number) => {
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

  // Database-level lean projection: Fetches only counts and pricing
  const hostels = await prisma.hostel.findMany({
    where: { manager: { email: session.user.email } },
    select: {
      id: true,
      name: true,
      city: true,
      monthlyPrice: true,
      availableBeds: true,
      _count: {
        select: {
          bookings: {
            where: { status: "CONFIRMED" },
          },
        },
      },
    },
  });

  let totalBedsCapacity = 0;
  let totalOccupiedBeds = 0;
  let totalVacantBeds = 0;
  let actualRevenue = 0;
  let maxPotentialRevenue = 0;

  const propertyMetrics = hostels.map((hostel) => {
    const confirmedCount = hostel._count.bookings;
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
      city: hostel.city,
      capacity,
      occupied: confirmedCount,
      vacant: vacancy,
      realizedMonthly,
      potentialMonthly,
      vacancyLoss,
      efficiencyRate: capacity > 0 ? Math.round((confirmedCount / capacity) * 100) : 0,
    };
  });

  const totalVacancyLoss = maxPotentialRevenue - actualRevenue;
  const portfolioEfficiency = maxPotentialRevenue > 0
    ? Math.round((actualRevenue / maxPotentialRevenue) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#ecfeff] text-[#020617] p-4 md:p-10 space-y-8 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/manager"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-800 hover:text-cyan-950 mb-2 transition"
          >
            ← Back to Operations
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Financial & Performance Portfolio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audited earnings, occupancy efficiency, and uncaptured vacancy loss analysis.
          </p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Portfolio Efficiency</span>
          <span className="text-xl font-black text-cyan-700">{portfolioEfficiency}%</span>
        </div>
      </div>

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

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Property Yield & Loss Breakdown</h2>
          <p className="text-xs text-slate-500 mt-0.5">Individual property financial efficiency review</p>
        </div>

        {propertyMetrics.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No properties listed yet to analyze.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="pb-3">Property Name</th>
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
        )}
      </div>
    </div>
  );
}