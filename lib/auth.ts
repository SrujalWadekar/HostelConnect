import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_secret",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
        async signIn({ user }) {
      if (!user?.email) return true;
      try {
        let intendedRole: "STUDENT" | "MANAGER" = "STUDENT";
        try {
          const cookieStore = await cookies();
          const raw = cookieStore.get("role_intent")?.value;
          if (raw === "MANAGER") intendedRole = "MANAGER";
        } catch {
          // cookies() unavailable in this context — safe default stays STUDENT
        }

        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              image: user.image || "",
              role: intendedRole,
            },
          });
        } else if (existing.role !== intendedRole) {
          // Portal choice is authoritative: whichever portal you sign in
          // through becomes your role for this account, every time.
          await prisma.user.update({
            where: { id: existing.id },
            data: { role: intendedRole },
          });
        }

        return true;
      } catch (error) {
        console.error("signIn error:", error);
        return true;
      }
    },

    async jwt({ token }) {
      if (token?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error("jwt error:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token?.role || "STUDENT";
        (session.user as any).id = token?.id;
      }
      return session;
    },
  },
};