import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

    const accidents = await prisma.accidentDeclaration.findMany({
      where: {
        ...(status ? { status: status as "EN_ATTENTE" | "EN_REVUE" | "ACCEPTEE" | "REFUSEE" } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        contract: { select: { contractNumber: true, assuranceType: true, brand: true, model: true, registration: true } },
      },
    });

    const filtered = search
      ? accidents.filter((a) =>
          [a.caseNumber, a.location, a.wilaya, a.vehiclePlate, a.contract.contractNumber]
            .join(" ")
            .toLowerCase()
            .includes(search)
        )
      : accidents;

    // Enrich with user info
    const userIds = [...new Set(filtered.map((a) => a.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, phone: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enriched = filtered.map((a) => ({
      ...a,
      user: userMap[a.userId] ?? null,
    }));

    return NextResponse.json({ accidents: enriched });
  } catch (error) {
    console.error("Error fetching admin accidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
