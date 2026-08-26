import Link from "next/link";

const properties = [
  {
    name: "Urban Nest Residency",
    location: "Katraj, Pune",
    price: "₹7,500",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    tag: "Verified",
  },
  {
    name: "Campus Comfort PG",
    location: "Dhankawadi, Pune",
    price: "₹8,500",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    tag: "Popular",
  },
  {
    name: "Student Haven",
    location: "Kothrud, Pune",
    price: "₹6,800",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=80",
    tag: "Top Rated",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-300 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur">
                ✨ Trusted student accommodation platform
              </div>

              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Find Your Perfect
                <span className="block text-cyan-300">Student Stay.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Discover verified hostels and PG accommodations near your college.
                No brokers, no hidden charges — just simple and reliable booking.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/dashboard/student"
                  className="rounded-xl bg-white px-7 py-4 text-center font-bold text-blue-700 shadow-xl transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Explore Hostels →
                </Link>

                <Link
                  href="/dashboard/manager"
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  List Your Property
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex justify-center gap-8 text-white lg:justify-start">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-blue-200">Properties</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-blue-200">Students</p>
                </div>

                <div>
                  <p className="text-2xl font-bold">4.8★</p>
                  <p className="text-sm text-blue-200">Average Rating</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern student accommodation"
                  className="h-[420px] w-full rounded-2xl object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
                <p className="text-sm text-slate-500">Verified Properties</p>
                <p className="text-xl font-bold text-slate-900">✓ 100% Checked</p>
              </div>

              <div className="absolute -right-3 top-8 rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-sm text-slate-500">Starting from</p>
                <p className="text-xl font-bold text-blue-600">₹6,500/mo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6">
        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                📍 Location
              </label>
              <input
                placeholder="Enter city or area"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                🏠 Stay Type
              </label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none">
                <option>Any type</option>
                <option>Hostel</option>
                <option>PG</option>
                <option>Apartment</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                💰 Budget
              </label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none">
                <option>Any budget</option>
                <option>Under ₹7,000</option>
                <option>₹7,000 - ₹10,000</option>
                <option>Above ₹10,000</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                href="/dashboard/student"
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-bold text-white transition hover:bg-blue-700"
              >
                Search Properties 🔍
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold text-blue-600">WHY HOSTELCONNECT?</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything you need for a stress-free stay
          </h2>

          <p className="mt-4 text-slate-600">
            Finding student accommodation should be simple, safe and affordable.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🛡️
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Verified Properties
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Every property is checked to help students find safer and more
              reliable accommodation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              💰
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              No Broker Fees
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Connect directly with property managers and avoid unnecessary
              commissions and broker charges.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
              ⚡
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Easy Booking
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Search, compare and connect with managers quickly using one
              simple platform.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-blue-600">EXPLORE</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Featured Properties
              </h2>
              <p className="mt-3 text-slate-600">
                Popular stays chosen by students.
              </p>
            </div>

            <Link
              href="/dashboard/student"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              View all properties →
            </Link>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-600 shadow">
                    ✓ {property.tag}
                  </span>

                  <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow">
                    ♡
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {property.name}
                    </h3>

                    <span className="whitespace-nowrap text-sm font-semibold text-amber-500">
                      ⭐ {property.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    📍 {property.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-5">
                    <div>
                      <span className="text-xl font-bold text-slate-900">
                        {property.price}
                      </span>
                      <span className="text-sm text-slate-500"> / month</span>
                    </div>

                    <Link
                      href="/dashboard/student"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to find your next home?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join students who are finding affordable and verified accommodation
            without the hassle.
          </p>

          <Link
            href="/dashboard/student"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-700 transition hover:scale-105"
          >
            Get Started for Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-blue-600">HostelConnect</p>
            <p className="mt-1 text-sm text-slate-500">
              Find your perfect student accommodation.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 HostelConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}