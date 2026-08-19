import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Find Affordable Student Accommodation
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Short-term and long-term hostel/PG beds for students. Direct connection with verified managers, broker-free.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard/student"
            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Hostels
          </Link>
          <Link
            href="/dashboard/manager"
            className="border-2 border-blue-600 text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            List Your Property
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900">Short-Term Stays</h3>
          <p className="mt-2 text-sm text-slate-600">
            Book 1–3 day micro-stays during competitive exams, college festivals, laboratory blocks, or campus visits.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900">Long-Term Stays</h3>
          <p className="mt-2 text-sm text-slate-600">
            Rent reliable, full-semester or annual hostel and PG rooms without broker fees or heavy commissions.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900">Direct & Verified</h3>
          <p className="mt-2 text-sm text-slate-600">
            Communicate directly with property managers with verified beds, simple check-in, and clear daily/monthly rates.
          </p>
        </div>
      </section>
    </div>
  );
}