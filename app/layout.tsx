import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "HostelConnect",
  description: "Short-term & long-term student accommodation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-slate-500 bg-white">
          © {new Date().getFullYear()} HostelConnect. All rights reserved.
        </footer>
      </body>
    </html>
  );
}