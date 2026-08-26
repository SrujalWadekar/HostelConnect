import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "HostelConnect | Student Accommodation",
  description:
    "Find verified and affordable short-term and long-term student accommodation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          
          {/* Navigation */}
          <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <Navbar />
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                
                {/* Brand */}
                <div className="text-center md:text-left">
                  <p className="text-lg font-bold text-slate-900">
                    Hostel<span className="text-blue-600">Connect</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Making student accommodation simple and accessible.
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 text-sm">
                  <a
                    href="/"
                    className="text-slate-500 transition hover:text-blue-600"
                  >
                    Home
                  </a>

                  <a
                    href="/login"
                    className="text-slate-500 transition hover:text-blue-600"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="text-slate-500 transition hover:text-blue-600"
                  >
                    Sign Up
                  </a>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:flex-row">
                <p>
                  © {new Date().getFullYear()} HostelConnect. All rights reserved.
                </p>

                <p>
                  Built for students 🏠
                </p>
              </div>
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}