"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type BookingStatus = "PENDING" | "CONFIRMED" | "APPROVED" | "REJECTED";

// Action for Students to Request a Bed
export async function createBookingRequest(hostelId: string, stayType?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User profile not found");

  const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
  if (!hostel) throw new Error("Property not found");

  if (hostel.availableBeds <= 0) {
    throw new Error("No beds available for this property right now.");
  }

  // Prevent duplicate requests for the same property
  const existingRequest = await prisma.bookingRequest.findFirst({
    where: {
      userId: user.id,
      hostelId: hostelId,
      status: { in: ["PENDING", "CONFIRMED", "APPROVED"] },
    },
  });

  if (existingRequest) {
    throw new Error("You already have an active or pending request for this property.");
  }

  await prisma.bookingRequest.create({
    data: {
      status: "PENDING",
      userId: user.id,
      hostelId: hostelId,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/manager");

  return { success: true };
}

// Action for Managers to Accept/Reject
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: { hostel: true },
  });
  if (!booking) throw new Error("Booking request not found");

  // Only decrement beds the moment a PENDING/CONFIRMED request first becomes APPROVED
  const isNewlyApproved = status === "APPROVED" && booking.status !== "APPROVED";

  if (isNewlyApproved) {
    if (booking.hostel.availableBeds <= 0) {
      throw new Error("No beds left to approve this request.");
    }

    await prisma.$transaction([
      prisma.bookingRequest.update({
        where: { id: bookingId },
        data: { status },
      }),
      prisma.hostel.update({
        where: { id: booking.hostelId },
        data: { availableBeds: { decrement: 1 } },
      }),
    ]);
  } else if (booking.status === "APPROVED" && status !== "APPROVED") {
    // Manager reverses an approval (e.g. APPROVED -> REJECTED) — give the bed back
    await prisma.$transaction([
      prisma.bookingRequest.update({
        where: { id: bookingId },
        data: { status },
      }),
      prisma.hostel.update({
        where: { id: booking.hostelId },
        data: { availableBeds: { increment: 1 } },
      }),
    ]);
  } else {
    await prisma.bookingRequest.update({
      where: { id: bookingId },
      data: { status },
    });
  }

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/student");
}