import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AddHostelForm from "@/components/AddHostelForm";
import BookingActionButtons from "@/components/BookingActionButtons";
import { Prisma } from "@prisma/client";

// Define Prisma payload types to prevent implicit 'any' compiler errors
type HostelWithBookings = Prisma.HostelGetPayload<{
  include: {
    bookings: {
      include: { student: true };
    };
  };
}>;

type BookingWithDetails = Prisma.BookingRequestGetPayload<{
  include: { student: true };
}> & { hostelName: string };

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
          bookings: {
            include: { student: true },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const hostels: HostelWithBookings[] = user?.hostels || [];

  const allBookings: BookingWithDetails[] = hostels.flatMap((h: HostelWithBookings) =>
    h.bookings.map((b) => ({ ...b, hostelName: h.name }))
  );

  const pendingBookings = allBookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = allBookings.filter((b) => b.status === "CONFIRMED");

  const totalCapacity = hostels.reduce(
    (acc: number, h: HostelWithBookings) => acc + h.availableBeds,
    0
  );
  const activeResidents = confirmedBookings.length;
  const estimatedRevenue = hostels.reduce(
    (acc: number, h: HostelWithBookings) =>
      acc + h.monthlyPrice * h.bookings.filter((b) => b.status === "CONFIRMED").length,
    0
  );

  return (
    <div className="min-h-screen bg-[#ecfeff]/40 text-[#020617] p-6 md:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-950/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
              Hostel Manager
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: {user?.id.slice(0, 8)}...
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#020617] mt-2 tracking-tight">
            Welcome back, {session.user.name?.split(" ")[0] || "Manager"} 👋
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time management for listings, bed occupancies, and incoming student applications.
          </p>
        </div>
      </div>

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cyan-900/10 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Properties</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-extrabold text-[#020617]">{hostels.length}</p>
            <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Managed across all locations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cyan-900/10 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vacant Beds</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-extrabold text-cyan-700">{totalCapacity}</p>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {activeResidents} Occupied
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Available for immediate booking</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cyan-900/10 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Inquiries</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-extrabold text-amber-600">{pendingBookings.length}</p>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">Action required</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Awaiting your confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cyan-900/10 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Revenue</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-extrabold text-emerald-600">₹{estimatedRevenue.toLocaleString()}</p>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Monthly</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">From confirmed student bookings</p>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Listing Form */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <AddHostelForm />
        </div>

        {/* Right Column: Inquiries & Listed Accommodations */}
        <div className="lg:col-span-7 space-y-8">
          {/* Pending Applications Box */}
          <div className="bg-white p-6 rounded-2xl border border-cyan-900/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#020617]">Student Applications</h2>
                <p className="text-xs text-slate-500">Incoming bed requests from students</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                {pendingBookings.length} Pending
              </span>
            </div>

            {pendingBookings.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-sm font-medium">No pending requests right now.</p>
                <p className="text-xs text-slate-400 mt-1">New student requests will appear here in real time.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingBookings.map((booking: BookingWithDetails) => (
                  <div key={booking.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {booking.student?.name || "Student"}
                        </span>
                        <span className="text-[11px] font-bold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded">
                          {booking.stayType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{booking.student?.email}</p>
                      <p className="text-xs font-medium text-cyan-900">Target Property: {booking.hostelName}</p>
                    </div>

                    <BookingActionButtons bookingId={booking.id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Accommodations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#020617]">Listed Accommodations</h2>
              <span className="text-xs font-semibold text-slate-500">{hostels.length} Total</span>
            </div>

            {hostels.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-dashed border-cyan-900/20 text-center space-y-2">
                <div className="text-2xl">🏨</div>
                <p className="text-slate-600 font-semibold text-sm">No properties listed yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill out the listing form on the left to publish your first hostel to student search results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hostels.map((hostel: HostelWithBookings) => (
                  <div
                    key={hostel.id}
                    className="bg-white p-5 rounded-2xl border border-cyan-900/10 shadow-sm flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                          {hostel.gender}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          hostel.availableBeds > 0 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {hostel.availableBeds > 0 ? `${hostel.availableBeds} beds left` : "Full House"}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 mt-3 text-base group-hover:text-cyan-700 transition">
                        {hostel.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {hostel.address}, {hostel.city}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold text-cyan-950">₹{hostel.monthlyPrice.toLocaleString()}</span>
                        <span className="text-xs text-slate-500"> / month</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        ₹{hostel.dailyPrice} / day
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}