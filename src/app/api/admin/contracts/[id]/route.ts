import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";
import { ContractStatus } from "@prisma/client";

const VALID_STATUSES: ContractStatus[] = ["EN_ATTENTE", "APPROUVE", "REFUSE", "EXPIRE"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = (await request.json()) as { status?: ContractStatus; adminNote?: string };

    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.adminNote?.trim()
          ? { adminNotes: { push: body.adminNote.trim() } }
          : {}),
      },
    });

    return NextResponse.json({ contract: updated });
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
