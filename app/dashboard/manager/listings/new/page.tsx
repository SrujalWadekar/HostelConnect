import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyListingForm from "@/components/PropertyListingForm";

export const metadata = {
  title: "List Property | HostelConnect Manager Portal",
};

export default async function NewListingPage() {
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

  // Pre-fill manager contact details
  const initialData = {
    managerName: user.name || "",
    contactNumber: user.ownerPhone || "",
    email: user.email || "",
  };

  return (
    <div className="min-h-screen bg-cyan-50/40 p-4 sm:p-6 md:p-10 pb-24">
      <PropertyListingForm initialData={initialData} />
    </div>
  );
}

