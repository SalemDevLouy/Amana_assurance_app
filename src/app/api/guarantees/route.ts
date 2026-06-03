import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AssuranceCatalogType, GuaranteeInputType } from "@prisma/client";
import { DEFAULT_GUARANTEE_CATALOG } from "@/app/main/newassurance/constants";

type AssuranceQueryType = "car" | "farmer";

const assuranceTypeMap: Record<AssuranceQueryType, AssuranceCatalogType> = {
  car: AssuranceCatalogType.CAR,
  farmer: AssuranceCatalogType.FARMER,
};

const inputTypeMap: Record<GuaranteeInputType, "checkbox" | "selectgroup"> = {
  CHECKBOX: "checkbox",
  SELECTGROUP: "selectgroup",
};

function isAssuranceQueryType(value: string | null): value is AssuranceQueryType {
  return value === "car" || value === "farmer";
}

async function ensureDefaultCatalogExists(assuranceType: AssuranceQueryType) {
  const prismaAssuranceType = assuranceTypeMap[assuranceType];

  const existingCount = await prisma.guaranteeGroup.count({
    where: { assuranceType: prismaAssuranceType },
  });

  if (existingCount > 0) {
    return;
  }

  const groups = DEFAULT_GUARANTEE_CATALOG[assuranceType];

  for (const [groupIndex, group] of groups.entries()) {
    const createdGroup = await prisma.guaranteeGroup.create({
      data: {
        assuranceType: prismaAssuranceType,
        key: group.key,
        title: group.title,
        description: group.description,
        inputType: group.inputType === "checkbox" ? GuaranteeInputType.CHECKBOX : GuaranteeInputType.SELECTGROUP,
        mandatory: group.mandatory,
        sortOrder: groupIndex,
      },
    });

    if (group.options.length > 0) {
      await prisma.guaranteeOption.createMany({
        data: group.options.map((option: { key: string; label: string; price: number }, optionIndex: number) => ({
          groupId: createdGroup.id,
          key: option.key,
          label: option.label,
          price: option.price,
          sortOrder: optionIndex,
        })),
      });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const assuranceTypeParam = request.nextUrl.searchParams.get("assuranceType");

    if (!isAssuranceQueryType(assuranceTypeParam)) {
      return NextResponse.json(
        { error: "Invalid assuranceType. Expected 'car' or 'farmer'." },
        { status: 400 }
      );
    }

    // Try to ensure DB seed exists, but if anything fails we'll fall back to the in-memory defaults
    try {
      await ensureDefaultCatalogExists(assuranceTypeParam);
    } catch (seedErr) {
      console.warn("Guarantees DB seed failed, falling back to defaults:", seedErr);
    }

    let groups = [] as any[];

    try {
      groups = await prisma.guaranteeGroup.findMany({
        where: { assuranceType: assuranceTypeMap[assuranceTypeParam] },
        orderBy: { sortOrder: "asc" },
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });
    } catch (dbErr) {
      console.warn("Guarantees DB read failed, falling back to defaults:", dbErr);
      groups = [];
    }

    if (!groups || groups.length === 0) {
      // fallback to the in-memory DEFAULT_GUARANTEE_CATALOG
      const fallback = DEFAULT_GUARANTEE_CATALOG[assuranceTypeParam as "car" | "farmer"] ?? [];
      return NextResponse.json({
        assuranceType: assuranceTypeParam,
        groups: fallback.map((g) => ({
          id: g.key,
          key: g.key,
          title: g.title,
          description: g.description ?? undefined,
          inputType: g.inputType,
          mandatory: g.mandatory,
          options: g.options.map((o) => ({ id: `${g.key}__${o.key}`, key: o.key, label: o.label, price: o.price })),
        })),
      });
    }

    return NextResponse.json({
      assuranceType: assuranceTypeParam,
      groups: groups.map((group) => ({
        id: group.id,
        key: group.key,
        title: group.title,
        description: group.description ?? undefined,
        inputType: inputTypeMap[group.inputType],
        mandatory: group.mandatory,
        options: group.options.map((option) => ({
          id: option.id,
          key: option.key,
          label: option.label,
          price: option.price,
        })),
      })),
    });
  } catch (error) {
    console.error("Error loading guarantees catalog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
