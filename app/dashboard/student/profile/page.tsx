import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: {
          hostel: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role === "MANAGER") {
    redirect("/dashboard/manager/profile");
  }

  const confirmedBookings = user.bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  );

  const pendingBookings = user.bookings.filter(
    (booking) => booking.status === "PENDING"
  );

  const rejectedBookings = user.bookings.filter(
    (booking) => booking.status === "REJECTED"
  );

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusStyle = (status: string) => {
    if (status === "CONFIRMED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "PENDING") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "REJECTED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen space-y-10 bg-[#ecfeff] p-4 pb-20 font-sans text-[#020617] md:p-10">
      <div>
        <Link
          href="/dashboard/student"
          className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-800 transition hover:text-cyan-950"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          My Profile
        </h1>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#020617] p-8 text-white shadow-2xl shadow-cyan-900/20 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-500 opacity-20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Student"}
                className="h-32 w-32 rounded-[2rem] border-4 border-cyan-400/30 object-cover shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-white/10 bg-gradient-to-br from-cyan-400 to-blue-600 text-5xl font-black text-white shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                {user.name?.charAt(0).toUpperCase() || "S"}
              </div>
            )}

            <div className="text-center md:text-left">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Verified Student
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                {user.name || "Student"}
              </h2>

              <p className="mt-1 font-mono text-sm text-cyan-100/70">
                {user.email}
              </p>
            </div>
          </div>

          <div className="min-w-[160px] rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-md">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
              Confirmed Stays
            </p>

            <p className="text-3xl font-black text-white">
              {confirmedBookings.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-2 bg-emerald-500" />

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Confirmed Bookings
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-600">
            {confirmedBookings.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Your currently confirmed stays
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Requests
          </p>

          <p className="mt-2 text-3xl font-black text-amber-500">
            {pendingBookings.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Awaiting hostel manager approval
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rejected Requests
          </p>

          <p className="mt-2 text-3xl font-black text-rose-500">
            {rejectedBookings.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Requests that were not approved
          </p>
        </div>
      </div>

      <div
        id="history"
        className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Recent Booking History
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Review all your booking requests and stays.
            </p>
          </div>

          <Link
            href="/dashboard/student"
            className="text-xs font-black uppercase tracking-wider text-cyan-700 transition hover:text-cyan-950"
          >
            Find accommodation →
          </Link>
        </div>

        {user.bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 py-12 text-center">
            <span className="text-4xl">🏠</span>

            <p className="mt-3 text-lg font-bold text-slate-900">
              No bookings yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Explore available hostels and send your first booking request.
            </p>

            <Link
              href="/dashboard/student"
              className="mt-5 inline-flex rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              Explore accommodations
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-2 pb-4">Property</th>
                  <th className="px-2 pb-4">Location</th>
                  <th className="px-2 pb-4">Monthly Rent</th>
                  <th className="px-2 pb-4">Status</th>
                  <th className="px-2 pb-4">Request Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {user.bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-cyan-50/50"
                  >
                    <td className="px-2 py-5 text-base font-black text-slate-900">
                      {booking.hostel.name}
                    </td>

                    <td className="px-2 py-5 text-xs font-semibold text-slate-500">
                      {booking.hostel.city}
                    </td>

                    <td className="px-2 py-5 font-black text-emerald-600">
                      {formatINR(booking.hostel.monthlyPrice)}
                    </td>

                    <td className="px-2 py-5">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-2 py-5 text-xs font-semibold text-slate-500">
                      {new Date(booking.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejectedBookings.length > 0 && (
        <p className="text-center text-xs font-medium text-slate-400">
          Rejected booking requests: {rejectedBookings.length}
        </p>
      )}
    </div>
  );
}