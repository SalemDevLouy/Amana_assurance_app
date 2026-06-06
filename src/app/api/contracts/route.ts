import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/lib/db";

function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `AMT-${year}-${rand}`;
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
      assuranceType: string;
      carInfo: Record<string, string>;
      selectedGuarantees: Array<{ id: string; key: string; label: string; price: number }>;
      basePrice: number;
      optionsTotal: number;
      totalCost: number;
      paymentMethod: string;
    };

    const { assuranceType, carInfo, selectedGuarantees, basePrice, optionsTotal, totalCost, paymentMethod } = body;

    if (!assuranceType || !carInfo?.brand || !carInfo?.registration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let contractNumber = generateContractNumber();
    // Retry on collision (extremely unlikely but safe)
    for (let i = 0; i < 3; i++) {
      const existing = await prisma.contract.findUnique({ where: { contractNumber } });
      if (!existing) break;
      contractNumber = generateContractNumber();
    }

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        userId: user.id,
        assuranceType,
        brand: carInfo.brand,
        model: carInfo.model,
        version: carInfo.version ?? "",
        energy: carInfo.energy ?? "",
        seats: carInfo.seats ?? "",
        parking: carInfo.parking ?? "",
        registration: carInfo.registration,
        chassisNumber: carInfo.chassisNumber ?? "",
        firstRegistrationDate: carInfo.firstRegistrationDate ?? "",
        marketValue: carInfo.marketValue ?? "",
        usage: carInfo.usage ?? "",
        circulationZone: carInfo.circulationZone ?? "",
        insuredCapital: carInfo.insuredCapital ?? "",
        mileage: carInfo.mileage ?? "",
        estimatedKmPerYear: carInfo.estimatedKmPerYear ?? "",
        horsepower: carInfo.horsepower ?? "",
        basePrice,
        optionsTotal,
        totalCost,
        selectedGuarantees,
        paymentMethod,
      },
    });

    return NextResponse.json({ contract: { id: contract.id, contractNumber: contract.contractNumber, status: contract.status } }, { status: 201 });
  } catch (error) {
    console.error("Error creating contract:", error);
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

    const contracts = await prisma.contract.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        contractNumber: true,
        status: true,
        assuranceType: true,
        brand: true,
        model: true,
        registration: true,
        chassisNumber: true,
        totalCost: true,
        createdAt: true,
      },
    });

    // Build prefill data for accident form using user profile + contract
    const contractsWithPrefill = contracts.map((c) => ({
      ...c,
      prefill: {
        vaMarque: c.brand,
        vaType: c.model,
        vaPlateNumber: c.registration,
        vaInsuredLastName: user.name?.split(" ").slice(0, 1).join(" ") ?? "",
        vaInsuredFirstName: user.name?.split(" ").slice(1).join(" ") ?? "",
        vaInsuredAddress: user.address ?? "",
        vaInsuranceCompany: "Amana Assurance",
        vaPolicyNumber: c.contractNumber,
        vaAttestationFrom: c.createdAt.toISOString().split("T")[0],
        vaAttestationTo: new Date(c.createdAt.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        vaAgency: "Amana Alger Centre",
        vaDriverLastName: user.name?.split(" ").slice(0, 1).join(" ") ?? "",
        vaDriverFirstName: user.name?.split(" ").slice(1).join(" ") ?? "",
        vaDriverAddress: user.address ?? "",
        vaLicenseNumber: user.licenseNumber ?? "",
        vaLicenseDate: user.licenseIssueDate ? user.licenseIssueDate.toISOString().split("T")[0] : "",
        vaLicenseWilaya: user.wilaya ?? "",
        vaLicenseCategory: user.licenseType ?? "B",
      },
    }));

    return NextResponse.json({ contracts: contractsWithPrefill });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
