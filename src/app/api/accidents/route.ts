import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";

function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ACC-${year}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      contractId: string;
      accidentDate: string;
      accidentTime: string;
      location: string;
      wilaya: string;
      weather: string;
      description: string;
      vehiclePlate: string;
      formData: Record<string, unknown> | null;
      photoUrls?: string[];
      sketchUrls?: string[];
    };

    const { contractId, accidentDate, accidentTime, location, wilaya, weather, description, vehiclePlate, formData, photoUrls, sketchUrls } = body;

    if (!contractId || !accidentDate || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract || contract.userId !== user.id) {
      return NextResponse.json({ error: "Contract not found or unauthorized" }, { status: 404 });
    }

    let caseNumber = generateCaseNumber();
    for (let i = 0; i < 3; i++) {
      const existing = await prisma.accidentDeclaration.findUnique({ where: { caseNumber } });
      if (!existing) break;
      caseNumber = generateCaseNumber();
    }

    const accident = await prisma.accidentDeclaration.create({
      data: {
        caseNumber,
        contractId,
        userId: user.id,
        accidentDate,
        accidentTime: accidentTime ?? "",
        location,
        wilaya: wilaya ?? "",
        weather: weather ?? "",
        description: description ?? "",
        vehiclePlate: vehiclePlate ?? contract.registration,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData: (formData ?? {}) as any,
        photoUrls: photoUrls ?? [],
        sketchUrls: sketchUrls ?? [],
      },
    });

    return NextResponse.json(
      { accident: { id: accident.id, caseNumber: accident.caseNumber, status: accident.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating accident declaration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const accidents = await prisma.accidentDeclaration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        caseNumber: true,
        status: true,
        accidentDate: true,
        location: true,
        vehiclePlate: true,
        createdAt: true,
        contract: { select: { contractNumber: true, brand: true, model: true } },
      },
    });

    return NextResponse.json({ accidents });
  } catch (error) {
    console.error("Error fetching accidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
