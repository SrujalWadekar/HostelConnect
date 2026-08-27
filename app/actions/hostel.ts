"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

type GenderAllowed = "ANY" | "MALE" | "FEMALE";
type PropertyType = "HOSTEL" | "PG";

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

  const latRaw = formData.get("latitude") as string;
  const lngRaw = formData.get("longitude") as string;
  const latitude = latRaw && !isNaN(parseFloat(latRaw)) ? parseFloat(latRaw) : null;
  const longitude = lngRaw && !isNaN(parseFloat(lngRaw)) ? parseFloat(lngRaw) : null;

  if (!name || !city || !address || isNaN(dailyPrice) || isNaN(monthlyPrice) || isNaN(availableBeds)) {
    throw new Error("Please provide all required fields with valid numbers.");
  }

  const newHostel = await prisma.hostel.create({
    data: {
      name,
      type,
      city,
      address,
      latitude,
      longitude,
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