import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 1. Fetch the logged-in student's active bookings
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookingRequests: {
        include: { hostel: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 2. Fetch all properties that have at least 1 bed available, with reviews
  const availableProperties = await prisma.hostel.findMany({
    where: { availableBeds: { gt: 0 } },
    select: {
      id: true,
      name: true,
      ownerPhone: true,
      type: true,
      city: true,
      address: true,
      dailyPrice: true,
      monthlyPrice: true,
      availableBeds: true,
      gender: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          userId: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 3. Enrich each property with rating stats and this student's review eligibility
  const enrichedProperties = availableProperties.map((h) => {
    const reviewCount = h.reviews.length;
    const avgRating =
      reviewCount > 0 ? h.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;

    const hasApprovedBooking = (user?.bookingRequests || []).some(
      (b) => b.hostelId === h.id && (b.status === "APPROVED" || b.status === "CONFIRMED")
    );
    const hasReviewed = user ? h.reviews.some((r) => r.userId === user.id) : false;

    return {
      id: h.id,
      name: h.name,
      type: h.type,
      city: h.city,
      address: h.address,
      dailyPrice: h.dailyPrice,
      monthlyPrice: h.monthlyPrice,
      availableBeds: h.availableBeds,
      gender: h.gender,
      avgRating,
      reviewCount,
      canReview: hasApprovedBooking && !hasReviewed,
      reviews: h.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewerName: r.user?.name || "Student",
      })),
    };
  });

  // 4. Force data serialization to safely pass Prisma objects to a Client Component
  const safeBookings = JSON.parse(JSON.stringify(user?.bookingRequests || []));
  const safeProperties = JSON.parse(JSON.stringify(enrichedProperties));

  return (
    <div className="min-h-screen bg-[#ecfeff]">
      <ClientDashboard
        myBookings={safeBookings}
        availableProperties={safeProperties}
      />
    </div>
  );
}