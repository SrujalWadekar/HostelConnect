import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StudentMessageCenterClient, { PropertyConversation } from "./StudentMessageCenterClient";

export const metadata = {
  title: "Message Center | HostelConnect Student Portal",
};

export default async function StudentMessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
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
              address: true,
              monthlyPrice: true,
              type: true,
              gender: true,
              ownerName: true,
              ownerPhone: true,
              aadhaarNumber: true,
              manager: {
                select: {
                  name: true,
                  ownerPhone: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const conversations: PropertyConversation[] = (user.bookingRequests || []).map((b) => ({
    bookingId: b.id,
    hostelId: b.hostel.id,
    hostelName: b.hostel.name,
    hostelCity: b.hostel.city,
    hostelAddress: b.hostel.address,
    monthlyPrice: b.hostel.monthlyPrice,
    type: b.hostel.type,
    gender: b.hostel.gender,
    status: b.status,
    managerName: b.hostel.manager?.name || b.hostel.ownerName || "Property Manager",
    ownerPhone: b.hostel.ownerPhone || b.hostel.manager?.ownerPhone || null,
    aadhaarNumber: b.hostel.aadhaarNumber || null,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-cyan-50/40 p-4 sm:p-6 md:p-8 pb-20">
      <StudentMessageCenterClient
        conversations={conversations}
        studentName={user.name || "Student"}
      />
    </div>
  );
}

