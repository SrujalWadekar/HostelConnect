import { prisma } from "@/lib/prisma";
import HomeClient, { PublicHostel } from "./HomeClient";

// Revalidate homepage every 60s in the background, or instantly via server action revalidatePath("/")
export const revalidate = 60;

export default async function Home() {
  let initialHostels: PublicHostel[] = [];

  try {
    const raw = await prisma.hostel.findMany({
      orderBy: { id: "desc" },
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
        aadhaarNumber: true,
      },
    });

    initialHostels = raw.map((h) => ({
      id: h.id,
      name: h.name,
      type: h.type,
      city: h.city,
      address: h.address,
      dailyPrice: h.dailyPrice,
      monthlyPrice: h.monthlyPrice,
      availableBeds: h.availableBeds,
      gender: h.gender,
      aadhaarNumber: h.aadhaarNumber,
      isReal: true,
    }));
  } catch (error) {
    console.error("Could not fetch database hostels for homepage:", error);
    initialHostels = [];
  }

  return <HomeClient initialHostels={initialHostels} />;
}