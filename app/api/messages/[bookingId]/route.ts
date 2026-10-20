import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ bookingId: string }> };

async function authorize(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    select: { userId: true, hostel: { select: { managerId: true } } },
  });
  if (!booking) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  // Only the student who made the request, or the manager of that hostel
  if (booking.userId !== user.id && booking.hostel.managerId !== user.id) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

export async function GET(_req: Request, { params }: Ctx) {
  const { bookingId } = await params;
  const auth = await authorize(bookingId);
  if ("error" in auth) return auth.error;

  const rows = await prisma.message.findMany({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      text: true,
      createdAt: true,
      senderId: true,
      sender: { select: { name: true } },
    },
  });

  const messages = rows.reverse().map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    mine: m.senderId === auth.user.id,
    senderName: m.senderId === auth.user.id ? "You" : m.sender.name || "User",
  }));

  return NextResponse.json({ messages });
}

export async function POST(req: Request, { params }: Ctx) {
  const { bookingId } = await params;
  const auth = await authorize(bookingId);
  if ("error" in auth) return auth.error;

  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 1000) {
    return NextResponse.json(
      { error: "Message must be between 1 and 1000 characters." },
      { status: 400 }
    );
  }

  await prisma.message.create({
    data: { bookingId, senderId: auth.user.id, text },
  });

  return NextResponse.json({ ok: true });
}