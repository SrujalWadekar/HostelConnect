import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudentPhoneForm from "./StudentPhoneForm";
import StudentBookingChatButton from "@/components/StudentBookingChatButton";

export default async function StudentProfilePage() {
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
      role: true,
      phoneNumber: true,
      bookingRequests: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          hostel: {
            select: {
              id: true,
              name: true,
              city: true,
              monthlyPrice: true,
              ownerPhone: true,
            },
          },
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

  const confirmedBookings = user.bookingRequests.filter(
    (booking) => booking.status === "CONFIRMED"
  );

  const pendingBookings = user.bookingRequests.filter(
    (booking) => booking.status === "PENDING"
  );

  const rejectedBookings = user.bookingRequests.filter(
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
      <div className="dash-fade-up">
        <Link
          href="/dashboard/student"
          className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-800 transition hover:text-cyan-950"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>
      </div>

      {/* Identity Card — role-themed badge, no Google photo */}
      <div className="dash-fade-up dash-delay-1 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 px-6 py-6 text-white shadow-xl shadow-cyan-950/15 md:px-8 md:py-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-cyan-500 opacity-20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <div className="relative h-20 w-20 md:h-22 md:w-22 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[2.5px] shadow-md shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-[#020617] text-3xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#020617] text-xs ring-2 ring-[#020617]">
                🎓
              </span>
            </div>

            <div className="text-center md:text-left">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-300">
                Student Portal
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {user.name || "Student"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <span className="font-mono text-cyan-100/75">
                  {user.email}
                </span>
                {user.phoneNumber ? (
                  <>
                    <span className="text-cyan-400/50 hidden sm:inline">•</span>
                    <a
                      href="#contact-number"
                      className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 px-2.5 py-0.5 rounded-full hover:bg-emerald-500/25 transition"
                    >
                      <span>📱</span>
                      <span>+91 {user.phoneNumber.slice(0, 5)} {user.phoneNumber.slice(5)}</span>
                      <span className="text-[10px] text-emerald-300">✓</span>
                    </a>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400/50 hidden sm:inline">•</span>
                    <a
                      href="#contact-number"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full hover:bg-amber-400/25 transition"
                    >
                      <span>+ Add Indian Phone</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-[140px] rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
              Confirmed Stays
            </p>

            <p className="text-3xl font-bold text-white">
              {confirmedBookings.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="dash-fade-up dash-delay-1 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Confirmed Bookings
          </p>

          <p className="mt-1.5 text-3xl font-bold text-emerald-600">
            {confirmedBookings.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your currently confirmed stays
          </p>
        </div>

        <div className="dash-fade-up dash-delay-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Requests
          </p>

          <p className="mt-1.5 text-3xl font-bold text-amber-500">
            {pendingBookings.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Awaiting hostel manager approval
          </p>
        </div>

        <div className="dash-fade-up dash-delay-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Rejected Requests
          </p>

          <p className="mt-1.5 text-3xl font-bold text-rose-500">
            {rejectedBookings.length}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Requests that were not approved
          </p>
        </div>
      </div>

      {/* ── Phone Number Card ── */}
      <div id="contact-number" className="dash-fade-up dash-delay-2 scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-1 mb-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Contact Number</h2>
          <p className="text-xs text-slate-500">
            {user.phoneNumber
              ? "Your verified Indian mobile number shown to managers on booking requests."
              : "Add your Indian mobile number so managers can contact you directly."}
          </p>
        </div>
        <StudentPhoneForm currentPhone={user.phoneNumber ?? ""} />
      </div>

      {/* ── How to Chat with Listed Properties for a Bed ── */}
      <div className="dash-fade-up dash-delay-2 overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-2">
              <span>💬 Direct Messaging</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              How to Chat with Listed Properties for a Bed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Contact hostel managers, verify food and amenities, and confirm your room move-in details easily.
            </p>
          </div>

          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs hover:shadow transition shrink-0"
          >
            <span>Browse Accommodations</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 font-bold text-sm flex items-center justify-center mb-2.5">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">Browse Listed Properties</h3>
            <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
              Explore verified hostels & PGs on your Dashboard with live room prices and bed vacancies.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center mb-2.5">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Instant Chat Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
              Click <span className="font-semibold text-cyan-700">"💬 Chat"</span> on any listing to ask about gate timings, meals, security deposit, or schedule a physical visit.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center mb-2.5">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Request Bed & Chat Mode</h3>
            <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
              Submit a bed request. A dedicated <span className="font-semibold text-emerald-700">"Chat Mode"</span> is enabled below so you and the manager can finalize confirmation!
            </p>
          </div>
        </div>
      </div>

      <div
        id="history"
        className="dash-fade-up scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Recent Booking History
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Review all your booking requests and stays with direct manager chat.
            </p>
          </div>

          <Link
            href="/dashboard/student"
            className="text-xs font-semibold uppercase tracking-wider text-cyan-700 transition hover:text-cyan-950"
          >
            Find accommodation →
          </Link>
        </div>

        {user.bookingRequests.length === 0 ? (
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
              <thead className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-2 pb-4">Property</th>
                  <th className="px-2 pb-4">Location</th>
                  <th className="px-2 pb-4">Monthly Rent</th>
                  <th className="px-2 pb-4">Status</th>
                  <th className="px-2 pb-4">Request Date</th>
                  <th className="px-2 pb-4">Manager Contact & Chat</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {user.bookingRequests.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-cyan-50/50"
                  >
                    <td className="px-2 py-5 text-sm sm:text-base font-bold text-slate-900">
                      {booking.hostel.name}
                    </td>

                    <td className="px-2 py-5 text-xs font-semibold text-slate-500">
                      {booking.hostel.city}
                    </td>

                    <td className="px-2 py-5 font-bold text-emerald-600">
                      {formatINR(booking.hostel.monthlyPrice)}
                    </td>

                    <td className="px-2 py-5">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${getStatusStyle(
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

                    <td className="px-2 py-5">
                      <div className="flex flex-col gap-1.5 min-w-[170px]">
                        {booking.hostel.ownerPhone ? (
                          <a
                            href={`tel:+91${booking.hostel.ownerPhone.replace(/\D/g, "").slice(-10)}`}
                            className="font-mono text-xs font-bold text-slate-700 hover:text-cyan-700 hover:underline flex items-center gap-1"
                            title={`Call Manager +91 ${booking.hostel.ownerPhone}`}
                          >
                            <span>📞</span>
                            <span>+91 {booking.hostel.ownerPhone.replace(/\D/g, "").slice(-10)}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Contact via chat</span>
                        )}
                        <StudentBookingChatButton
                          bookingId={booking.id}
                          hostelName={booking.hostel.name}
                          ownerPhone={booking.hostel.ownerPhone}
                        />
                      </div>
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