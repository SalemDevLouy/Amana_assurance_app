import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/lib/authOptions";

type RouteContext = {
  params: Promise<{ optionId: string }>;
};

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionId } = await context.params;
    const body = (await request.json()) as {
      label?: string;
      price?: number;
      key?: string;
    };

    if (!optionId) {
      return NextResponse.json({ error: "Missing option id" }, { status: 400 });
    }

    if (!body.label || typeof body.label !== "string") {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    if (typeof body.price !== "number" || Number.isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });
    }

    const existingOption = await prisma.guaranteeOption.findUnique({
      where: { id: optionId },
      include: { group: true },
    });

    if (!existingOption) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    const updated = await prisma.guaranteeOption.update({
      where: { id: optionId },
      data: {
        label: body.label.trim(),
        price: Math.trunc(body.price),
        key: body.key?.trim() || existingOption.key,
      },
    });

    return NextResponse.json({
      message: "Option updated successfully",
      option: {
        id: updated.id,
        key: updated.key,
        label: updated.label,
        price: updated.price,
      },
    });
  } catch (error) {
    console.error("Error updating guarantee option:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { optionId } = await context.params;

    if (!optionId) {
      return NextResponse.json({ error: "Missing option id" }, { status: 400 });
    }

    const existingOption = await prisma.guaranteeOption.findUnique({
      where: { id: optionId },
      include: { group: true },
    });

    if (!existingOption) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    const siblingCount = await prisma.guaranteeOption.count({
      where: { groupId: existingOption.groupId },
    });

    if (existingOption.group.mandatory && siblingCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only option of a mandatory group" },
        { status: 400 }
      );
    }

    await prisma.guaranteeOption.delete({
      where: { id: optionId },
    });

    return NextResponse.json({ message: "Option deleted successfully" });
  } catch (error) {
    console.error("Error deleting guarantee option:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
