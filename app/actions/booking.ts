"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export type BookingStatus = "PENDING" | "CONFIRMED" | "APPROVED" | "REJECTED";

// Action for Students to Request a Bed
export async function createBookingRequest(hostelId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User profile not found");

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

  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/student");
}