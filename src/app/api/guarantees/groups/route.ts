import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AssuranceCatalogType, GuaranteeInputType } from "@prisma/client";
import prisma from "@/lib/db";
import { authOptions } from "@/app/lib/authOptions";

type RequestBody = {
  assuranceType?: "car" | "farmer";
  key?: string;
  title?: string;
  description?: string;
  inputType?: "checkbox" | "selectgroup";
  mandatory?: boolean;
};

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

function mapAssuranceType(value: "car" | "farmer") {
  return value === "car" ? AssuranceCatalogType.CAR : AssuranceCatalogType.FARMER;
}

function mapInputType(value: "checkbox" | "selectgroup") {
  return value === "checkbox" ? GuaranteeInputType.CHECKBOX : GuaranteeInputType.SELECTGROUP;
}

export async function POST(request: NextRequest) {
  try {
    const session = await ensureAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as RequestBody;

    if (!body.assuranceType || !["car", "farmer"].includes(body.assuranceType)) {
      return NextResponse.json({ error: "assuranceType is required" }, { status: 400 });
    }

    if (!body.key || !body.title || !body.inputType) {
      return NextResponse.json({ error: "key, title and inputType are required" }, { status: 400 });
    }

    const key = body.key.trim();
    const title = body.title.trim();

    if (!key || !title) {
      return NextResponse.json({ error: "key and title cannot be empty" }, { status: 400 });
    }

    const assuranceType = mapAssuranceType(body.assuranceType);

    const existing = await prisma.guaranteeGroup.findFirst({
      where: {
        assuranceType,
        key,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Group key already exists for this assurance type" }, { status: 409 });
    }

    const sortOrder = await prisma.guaranteeGroup.count({ where: { assuranceType } });

    const created = await prisma.guaranteeGroup.create({
      data: {
        assuranceType,
        key,
        title,
        description: body.description?.trim() || null,
        inputType: mapInputType(body.inputType),
        mandatory: Boolean(body.mandatory),
        sortOrder,
      },
      include: {
        options: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      group: {
        id: created.id,
        key: created.key,
        title: created.title,
        description: created.description ?? undefined,
        inputType: created.inputType === GuaranteeInputType.CHECKBOX ? "checkbox" : "selectgroup",
        mandatory: created.mandatory,
        options: created.options.map((option) => ({
          id: option.id,
          key: option.key,
          label: option.label,
          price: option.price,
        })),
      },
    });
  } catch (error) {
    console.error("Error creating guarantee group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
