"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

/**
 * Manager action: Approve or reject an incoming student booking request
 */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please log in to manage requests.");
  }

  // Fetch current booking with hostel details to check initial state
  const existingBooking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: { hostel: true },
  });

  if (!existingBooking) {
    throw new Error("Booking request not found.");
  }

  // Prevent approving if no beds are left
  if (status === BookingStatus.CONFIRMED && existingBooking.hostel.availableBeds <= 0) {
    throw new Error("Cannot approve: No beds remaining in this hostel.");
  }

  const updatedBooking = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status },
  });

  // If approved and previously pending, decrement available beds
  if (status === BookingStatus.CONFIRMED && existingBooking.status !== BookingStatus.CONFIRMED) {
    await prisma.hostel.update({
      where: { id: existingBooking.hostelId },
      data: {
        availableBeds: {
          decrement: 1,
        },
      },
    });
  }

  // If rejected after being previously confirmed, restore the bed
  if (status === BookingStatus.REJECTED && existingBooking.status === BookingStatus.CONFIRMED) {
    await prisma.hostel.update({
      where: { id: existingBooking.hostelId },
      data: {
        availableBeds: {
          increment: 1,
        },
      },
    });
  }

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/student");

  return { success: true, bookingId: updatedBooking.id };
}

/**
 * Student action: Submit a reservation request for a bed
 */
export async function requestBooking(
  hostelId: string,
  stayType: string = "MONTHLY"
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please log in to book a hostel.");
  }

  const student = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!student) {
    throw new Error("Student profile record not found.");
  }

  // Verify hostel availability
  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
  });

  if (!hostel) {
    throw new Error("Selected hostel does not exist.");
  }

  if (hostel.availableBeds <= 0) {
    throw new Error("Sorry, this hostel is currently fully booked.");
  }

  // Check if student already has a pending or active booking for this hostel
  const existingApplication = await prisma.bookingRequest.findFirst({
    where: {
      hostelId,
      studentId: student.id,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
  });

  if (existingApplication) {
    throw new Error(
      existingApplication.status === BookingStatus.PENDING
        ? "You already have a pending booking request for this property."
        : "You already have a confirmed booking for this property."
    );
  }

  const newBooking = await prisma.bookingRequest.create({
    data: {
      hostelId,
      studentId: student.id,
      stayType,
      status: BookingStatus.PENDING,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/manager");

  return { success: true, bookingId: newBooking.id };
}