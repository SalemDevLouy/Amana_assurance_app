import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/lib/authOptions";

type RequestBody = {
  groupId?: string;
  key?: string;
  label?: string;
  price?: number;
};

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function POST(request: NextRequest) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as RequestBody;

    if (!body.groupId || !body.key || !body.label) {
      return NextResponse.json({ error: "groupId, key and label are required" }, { status: 400 });
    }

    if (typeof body.price !== "number" || Number.isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ error: "price must be a non-negative number" }, { status: 400 });
    }

    const group = await prisma.guaranteeGroup.findUnique({ where: { id: body.groupId } });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const key = body.key.trim();
    const label = body.label.trim();

    if (!key || !label) {
      return NextResponse.json({ error: "key and label cannot be empty" }, { status: 400 });
    }

    const duplicate = await prisma.guaranteeOption.findFirst({
      where: {
        groupId: body.groupId,
        key,
      },
    });

    if (duplicate) {
      return NextResponse.json({ error: "Option key already exists in this group" }, { status: 409 });
    }

    const sortOrder = await prisma.guaranteeOption.count({ where: { groupId: body.groupId } });

    const created = await prisma.guaranteeOption.create({
      data: {
        groupId: body.groupId,
        key,
        label,
        price: Math.trunc(body.price),
        sortOrder,
      },
    });

    return NextResponse.json({
      option: {
        id: created.id,
        key: created.key,
        label: created.label,
        price: created.price,
      },
    });
  } catch (error) {
    console.error("Error creating guarantee option:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
