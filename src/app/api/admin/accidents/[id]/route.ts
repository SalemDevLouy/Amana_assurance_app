import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";
import { AccidentStatus } from "@prisma/client";

const VALID_STATUSES: AccidentStatus[] = ["EN_ATTENTE", "EN_REVUE", "ACCEPTEE", "REFUSEE"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = (await request.json()) as { status?: AccidentStatus; internalNote?: string };

    const existing = await prisma.accidentDeclaration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Accident declaration not found" }, { status: 404 });
    }

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.accidentDeclaration.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.internalNote?.trim()
          ? { internalNotes: { push: body.internalNote.trim() } }
          : {}),
      },
    });

    return NextResponse.json({ accident: updated });
  } catch (error) {
    console.error("Error updating accident:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
