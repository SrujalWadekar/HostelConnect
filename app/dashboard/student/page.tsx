import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard"; // Ensure this matches exactly

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 1. Fetch the logged-in student's active bookings
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: { hostel: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 2. Fetch all properties that have at least 1 bed available
  const availableProperties = await prisma.hostel.findMany({
    where: { availableBeds: { gt: 0 } },
    select: {
      id: true,
      name: true,
      type: true,
      city: true,
      address: true,
      dailyPrice: true,
      monthlyPrice: true,
      availableBeds: true,
      gender: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Force data serialization to safely pass Prisma objects to a Client Component
  const safeBookings = JSON.parse(JSON.stringify(user?.bookings || []));
  const safeProperties = JSON.parse(JSON.stringify(availableProperties));

  return (
    <div className="min-h-screen bg-[#ecfeff]">
      <ClientDashboard 
        myBookings={safeBookings} 
        availableProperties={safeProperties} 
      />
    </div>
  );
}