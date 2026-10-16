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

  // 1. Fetch only the logged-in student's active bookings and required fields
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookingRequests: {
        select: {
          id: true,
          status: true,
          hostelId: true,
          createdAt: true,
          hostel: {
            select: {
              id: true,
              name: true,
              type: true,
              address: true,
              city: true,
              monthlyPrice: true,
              dailyPrice: true,
              ownerPhone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 2. Fetch properties that have at least 1 bed available, with reviews
  const availableProperties = await prisma.hostel.findMany({
    where: { availableBeds: { gt: 0 } },
    select: {
      id: true,
      name: true,
      ownerName: true,
      ownerPhone: true,
      type: true,
      city: true,
      address: true,
      dailyPrice: true,
      monthlyPrice: true,
      availableBeds: true,
      gender: true,
      aadhaarNumber: true,
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

  const studentBookings = user?.bookingRequests || [];
  const approvedHostelIds = new Set(
    studentBookings
      .filter((b) => b.status === "APPROVED" || b.status === "CONFIRMED")
      .map((b) => b.hostelId)
  );

  // 3. Enrich each property with rating stats and this student's review eligibility
  const enrichedProperties = availableProperties.map((h) => {
    const reviewCount = h.reviews.length;
    const avgRating =
      reviewCount > 0 ? h.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;

    const hasApprovedBooking = approvedHostelIds.has(h.id);
    const hasReviewed = user ? h.reviews.some((r) => r.userId === user.id) : false;
    const isAadhaarVerified = Boolean(h.aadhaarNumber && h.aadhaarNumber.trim().length >= 12);

    return {
      id: h.id,
      name: h.name,
      ownerName: h.ownerName,
      ownerPhone: h.ownerPhone,
      type: h.type,
      city: h.city,
      address: h.address,
      dailyPrice: h.dailyPrice,
      monthlyPrice: h.monthlyPrice,
      availableBeds: h.availableBeds,
      gender: h.gender,
      isAadhaarVerified,
      avgRating,
      reviewCount,
      canReview: hasApprovedBooking && !hasReviewed,
      reviews: h.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        reviewerName: r.user?.name || "Student",
      })),
    };
  });

  // 4. Clean serialized data passed to Client Component
  const safeBookings = studentBookings.map((b) => ({
    id: b.id,
    status: b.status,
    hostel: b.hostel,
  }));

  return (
    <div className="min-h-screen bg-[#ecfeff]">
      <ClientDashboard
        myBookings={safeBookings}
        availableProperties={enrichedProperties}
      />
    </div>
  );
}