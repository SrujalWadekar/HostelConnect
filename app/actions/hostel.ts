"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PropertyType, GenderAllowed, Prisma } from "@prisma/client";

export async function createHostel(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please sign in to create a listing.");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Manager profile not found in database.");
  }

  const name = formData.get("name") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const dailyPrice = parseInt(formData.get("dailyPrice") as string, 10);
  const monthlyPrice = parseInt(formData.get("monthlyPrice") as string, 10);
  const availableBeds = parseInt(formData.get("availableBeds") as string, 10);

  const type = (formData.get("type") as PropertyType) || "HOSTEL";
  const gender = (formData.get("gender") as GenderAllowed) || "ANY";

  if (!name || !city || !address || isNaN(dailyPrice) || isNaN(monthlyPrice) || isNaN(availableBeds)) {
    throw new Error("Please provide all required fields with valid numbers.");
  }

  const newHostel = await prisma.hostel.create({
    data: {
      name,
      type,
      city,
      address,
      dailyPrice,
      monthlyPrice,
      availableBeds,
      gender,
      managerId: user.id,
    },
  });

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/student");

  return { success: true, hostelId: newHostel.id };
}

// Filters students can search/browse by
export type HostelFilters = {
  city?: string;
  type?: PropertyType;
  gender?: GenderAllowed;
  minPrice?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
};

export async function getAllHostels(filters?: HostelFilters) {
  try {
    const where: Prisma.HostelWhereInput = {};

    if (filters?.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.gender) {
      where.gender = filters.gender;
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.monthlyPrice = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      };
    }
    if (filters?.onlyAvailable) {
      where.availableBeds = { gt: 0 };
    }

    return await prisma.hostel.findMany({
      where,
      include: {
        manager: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch hostels:", error);
    return [];
  }
}

export async function updateHostelBeds(hostelId: string, newBedCount: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  if (newBedCount < 0) {
    throw new Error("Bed count cannot be negative.");
  }

  const updated = await prisma.hostel.update({
    where: { id: hostelId },
    data: { availableBeds: Math.round(newBedCount) },
  });

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/manager/profile");
  revalidatePath("/dashboard/student");

  return { success: true, availableBeds: updated.availableBeds };
}

export async function updateHostelDetails(
  hostelId: string,
  data: {
    name: string;
    type: PropertyType;
    gender: GenderAllowed;
    city: string;
    address: string;
    dailyPrice: number;
    monthlyPrice: number;
    availableBeds: number;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
  });

  if (!hostel || hostel.managerId !== user.id) {
    throw new Error("Property not found or unauthorized.");
  }

  await prisma.hostel.update({
    where: { id: hostelId },
    data: {
      name: data.name,
      type: data.type,
      gender: data.gender,
      city: data.city,
      address: data.address,
      dailyPrice: Math.round(Number(data.dailyPrice)),
      monthlyPrice: Math.round(Number(data.monthlyPrice)),
      availableBeds: Math.round(Number(data.availableBeds)),
    },
  });

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/manager/profile");
  revalidatePath("/dashboard/student");

  return { success: true };
}

// Delete a hostel listing (manager-only, and only their own listing)
export async function deleteHostel(hostelId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
  });

  if (!hostel || hostel.managerId !== user.id) {
    throw new Error("Property not found or unauthorized.");
  }

  // BookingRequest and Review both reference Hostel without onDelete: Cascade,
  // so related rows must be removed first or the delete will fail on the FK constraint.
  await prisma.$transaction([
    prisma.bookingRequest.deleteMany({ where: { hostelId } }),
    prisma.review.deleteMany({ where: { hostelId } }),
    prisma.hostel.delete({ where: { id: hostelId } }),
  ]);

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/manager/profile");
  revalidatePath("/dashboard/student");

  return { success: true };
}

export async function addReview(hostelId: string, rating: number, comment?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized: Please sign in to review.");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User profile not found.");

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars.");
  } 

  await prisma.review.create({
    data: {
      rating,
      comment: comment || "",
      userId: user.id,
      hostelId: hostelId,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/manager");

  return { success: true };
}

export async function switchUserRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const newRole = user.role === "MANAGER" ? "STUDENT" : "MANAGER";

  await prisma.user.update({
    where: { id: user.id },
    data: { role: newRole },
  });

  revalidatePath("/dashboard/manager");
  revalidatePath("/dashboard/student");
  revalidatePath("/", "layout");

  return { success: true, newRole };
}