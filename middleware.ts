// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isManagerRoute = path.startsWith("/dashboard/manager");
    const isStudentRoute = path.startsWith("/dashboard/student");

    const role = (token as any)?.role;

    if (isManagerRoute && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    if (isStudentRoute && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard/manager", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};