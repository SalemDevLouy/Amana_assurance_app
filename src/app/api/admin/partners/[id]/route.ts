import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";
import { PartnerType } from "@prisma/client";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? session : null;
}

const VALID_TYPES = Object.values(PartnerType) as string[];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await ensureAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    const body = (await request.json()) as Partial<{
      name: string;
      type: string;
      wilaya: string;
      city: string | null;
      address: string;
      phone: string;
      rating: number;
      available: boolean;
      hours: string;
      eta: string | null;
      description: string | null;
      logoUrl: string | null;
    }>;

    if (body.type && !VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const updated = await prisma.partner.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.type !== undefined && { type: body.type as PartnerType }),
        ...(body.wilaya !== undefined && { wilaya: body.wilaya.trim() }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.address !== undefined && { address: body.address.trim() }),
        ...(body.phone !== undefined && { phone: body.phone.trim() }),
        ...(typeof body.rating === "number" && { rating: body.rating }),
        ...(typeof body.available === "boolean" && { available: body.available }),
        ...(body.hours !== undefined && { hours: body.hours.trim() }),
        ...(body.eta !== undefined && { eta: body.eta }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      },
    });

    return NextResponse.json({ partner: updated });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await ensureAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
