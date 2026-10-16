import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyListingForm from "@/components/PropertyListingForm";

export const metadata = {
  title: "Edit Property | HostelConnect Manager Portal",
};

interface EditListingPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditListingPage({ searchParams }: EditListingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "MANAGER") {
    redirect("/dashboard/student");
  }

  const { id } = await searchParams;

  if (!id) {
    redirect("/dashboard/manager/profile");
  }

  const hostel = await prisma.hostel.findUnique({
    where: { id },
  });

  if (!hostel || hostel.managerId !== user.id) {
    redirect("/dashboard/manager/profile");
  }

  const initialData = {
    managerName: hostel.ownerName || user.name || "",
    contactNumber: hostel.ownerPhone || user.ownerPhone || "",
    aadhaarNumber: hostel.aadhaarNumber || "",
    email: user.email || "",
    propertyName: hostel.name,
    city: hostel.city,
    address: hostel.address,
    propertyType: hostel.type as "PG" | "HOSTEL",
    targetGender: (hostel.gender === "MALE"
      ? "BOYS"
      : hostel.gender === "FEMALE"
      ? "GIRLS"
      : "COED") as "BOYS" | "GIRLS" | "COED",
    monthlyRent: hostel.monthlyPrice,
    dailyRate: hostel.dailyPrice,
    totalCapacity: hostel.availableBeds,
  };

  return (
    <div className="min-h-screen bg-cyan-50/40 p-4 sm:p-6 md:p-10 pb-24">
      <PropertyListingForm
        initialData={initialData}
        hostelId={hostel.id}
        isEditing={true}
      />
    </div>
  );
}

