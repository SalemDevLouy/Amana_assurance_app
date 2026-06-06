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

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

    const contracts = await prisma.contract.findMany({
      where: {
        ...(status ? { status: status as "EN_ATTENTE" | "APPROUVE" | "REFUSE" | "EXPIRE" } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const filtered = search
      ? contracts.filter((c) =>
          [c.contractNumber, c.brand, c.model, c.registration, c.assuranceType]
            .join(" ")
            .toLowerCase()
            .includes(search)
        )
      : contracts;

    // Enrich with user name
    const userIds = [...new Set(filtered.map((c) => c.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, phone: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enriched = filtered.map((c) => ({
      ...c,
      user: userMap[c.userId] ?? null,
    }));

    return NextResponse.json({ contracts: enriched });
  } catch (error) {
    console.error("Error fetching admin contracts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
