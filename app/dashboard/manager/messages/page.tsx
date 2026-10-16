import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ManagerMessageCenterClient, { StudentConversation } from "./ManagerMessageCenterClient";

export const metadata = {
  title: "Message Center | HostelConnect Manager Portal",
};

export default async function ManagerMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  if (!user || user.role !== "MANAGER") {
    redirect("/dashboard/student");
  }

  // Fetch all manager's hostels and associated student booking inquiries
  const hostels = await prisma.hostel.findMany({
    where: { managerId: user.id },
    select: {
      id: true,
      name: true,
      city: true,
      aadhaarNumber: true,
      bookingRequests: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const conversations: StudentConversation[] = hostels.flatMap((h) =>
    h.bookingRequests.map((b) => ({
      bookingId: b.id,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
      hostelId: h.id,
      hostelName: h.name,
      hostelCity: h.city,
      studentName: b.user.name || "Student Applicant",
      studentEmail: b.user.email || "No email",
      studentPhone: b.user.phoneNumber || null,
    }))
  );

  const managerHasAadhaar = Boolean(
    hostels.some((h) => h.aadhaarNumber && h.aadhaarNumber.trim().length >= 12)
  );

  return (
    <div className="min-h-screen bg-cyan-50/40 p-4 sm:p-6 md:p-8 pb-20">
      <ManagerMessageCenterClient
        conversations={conversations}
        managerName={user.name || "Manager"}
        managerHasAadhaar={managerHasAadhaar}
      />
    </div>
  );
}

