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

export async function POST(request: NextRequest) {
  try {
    const session = await ensureAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      name?: string;
      type?: string;
      wilaya?: string;
      city?: string;
      address?: string;
      phone?: string;
      rating?: number;
      available?: boolean;
      hours?: string;
      eta?: string;
      description?: string;
      logoUrl?: string;
    };

    const { name, type, wilaya, address, phone, hours } = body;

    if (!name?.trim() || !type || !wilaya?.trim() || !address?.trim() || !phone?.trim() || !hours?.trim()) {
      return NextResponse.json({ error: "name, type, wilaya, address, phone and hours are required" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        type: type as PartnerType,
        wilaya: wilaya.trim(),
        city: body.city?.trim() || null,
        address: address.trim(),
        phone: phone.trim(),
        rating: typeof body.rating === "number" ? body.rating : 0,
        available: typeof body.available === "boolean" ? body.available : true,
        hours: hours.trim(),
        eta: body.eta?.trim() || null,
        description: body.description?.trim() || null,
        logoUrl: body.logoUrl?.trim() || null,
      },
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
