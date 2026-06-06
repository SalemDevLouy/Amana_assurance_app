import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { PartnerType } from "@prisma/client";

const SEED_PARTNERS = [
  // Insurance companies
  { name: "Société Algérienne des Assurances", type: PartnerType.INSURANCE, wilaya: "Alger", city: "Alger", address: "5 Boulevard Colonel Amirouche, Alger", phone: "+213 21 71 11 33", rating: 4.5, available: true, hours: "Dim–Jeu 08h–17h", description: "Premier assureur national, fondé en 1963." },
  { name: "CAAT — Compagnie Algérienne des Assurances et de Réassurance", type: PartnerType.INSURANCE, wilaya: "Alger", city: "Alger", address: "11 Chemin Ibn Badis, El Biar, Alger", phone: "+213 21 92 40 00", rating: 4.3, available: true, hours: "Dim–Jeu 08h–17h", description: "Spécialiste assurance transport et automobile depuis 1985." },
  { name: "CIAR — Compagnie d'Assurances des Hydrocarbures", type: PartnerType.INSURANCE, wilaya: "Alger", city: "Alger", address: "2 Rue Ahmed Bey, Alger", phone: "+213 21 44 20 10", rating: 4.2, available: true, hours: "Dim–Jeu 08h–17h", description: "Partenaire de confiance en assurance auto et énergie." },

  // Towing
  { name: "Dépannage Express Alger", type: PartnerType.TOWING, wilaya: "Alger", city: "Alger", address: "Rue Hassiba Ben Bouali, Alger", phone: "+213 21 63 00 11", rating: 4.8, available: true, hours: "24h/24", eta: "~12 min" },
  { name: "SOS Route Oran", type: PartnerType.TOWING, wilaya: "Oran", city: "Oran", address: "Bd Millenium, Oran", phone: "+213 41 33 55 77", rating: 4.6, available: true, hours: "24h/24", eta: "~25 min" },
  { name: "Remorquage Rapide Annaba", type: PartnerType.TOWING, wilaya: "Annaba", city: "Annaba", address: "Zone Industrielle, Annaba", phone: "+213 38 86 20 44", rating: 4.4, available: false, hours: "06h–22h", eta: "~35 min" },
  { name: "Assistance Auto Constantine", type: PartnerType.TOWING, wilaya: "Constantine", city: "Constantine", address: "RN3, Constantine", phone: "+213 31 68 90 12", rating: 4.5, available: true, hours: "24h/24", eta: "~30 min" },

  // Mechanics
  { name: "Garage Central Alger", type: PartnerType.MECHANIC, wilaya: "Alger", city: "Hussein Dey", address: "14 Rue des Ateliers, Hussein Dey", phone: "+213 21 77 44 22", rating: 4.7, available: true, hours: "Lun–Sam 08h–18h" },
  { name: "Auto Service Blida", type: PartnerType.MECHANIC, wilaya: "Blida", city: "Blida", address: "Cité 500 Logements, Blida", phone: "+213 25 41 09 33", rating: 4.5, available: true, hours: "Lun–Sam 07h–19h" },
  { name: "Mécanique Générale Sétif", type: PartnerType.MECHANIC, wilaya: "Sétif", city: "Sétif", address: "Route de Aïn Arnat, Sétif", phone: "+213 36 84 17 65", rating: 4.6, available: false, hours: "Lun–Sam 08h–17h" },
  { name: "Garage Moderne Tizi Ouzou", type: PartnerType.MECHANIC, wilaya: "Tizi Ouzou", city: "Tizi Ouzou", address: "Av. Hocine Aït Ahmed, T.O.", phone: "+213 26 22 31 88", rating: 4.3, available: true, hours: "Lun–Ven 08h–18h" },

  // Experts
  { name: "Cabinet d'Expertise Hamdi", type: PartnerType.EXPERT, wilaya: "Alger", city: "Alger", address: "8 Rue Larbi Ben M'hidi, Alger", phone: "+213 21 73 56 10", rating: 4.9, available: true, hours: "Lun–Ven 08h–17h" },
  { name: "Expertise Auto Maghreb", type: PartnerType.EXPERT, wilaya: "Oran", city: "Oran", address: "Centre Commercial Les Dunes, Oran", phone: "+213 41 44 62 30", rating: 4.7, available: true, hours: "Lun–Ven 08h–17h" },
  { name: "Bureau d'Expertise Meriem", type: PartnerType.EXPERT, wilaya: "Annaba", city: "Annaba", address: "Rue du 1er Novembre, Annaba", phone: "+213 38 72 40 55", rating: 4.6, available: false, hours: "Lun–Jeu 09h–16h" },

  // Body shops
  { name: "Carrosserie El Amel", type: PartnerType.BODY_SHOP, wilaya: "Alger", city: "Rouiba", address: "Zone Artisanale Rouiba, Alger", phone: "+213 21 81 34 70", rating: 4.7, available: true, hours: "Lun–Sam 07h–18h" },
  { name: "Atelier Peinture Moderne", type: PartnerType.BODY_SHOP, wilaya: "Blida", city: "Blida", address: "Route de Boufarik, Blida", phone: "+213 25 39 11 46", rating: 4.5, available: true, hours: "Lun–Sam 08h–18h" },
  { name: "Carrosserie du Sahel", type: PartnerType.BODY_SHOP, wilaya: "Tipaza", city: "Tipaza", address: "Cité des Orangers, Tipaza", phone: "+213 24 47 88 21", rating: 4.4, available: false, hours: "Lun–Ven 08h–17h" },
  { name: "Auto Carrosserie Nord", type: PartnerType.BODY_SHOP, wilaya: "Oran", city: "Oran", address: "Sidi Maarouf, Oran", phone: "+213 41 52 77 33", rating: 4.6, available: true, hours: "Lun–Sam 07h–19h" },
];

const TYPE_MAP: Record<string, PartnerType> = {
  towing: PartnerType.TOWING,
  mechanic: PartnerType.MECHANIC,
  expert: PartnerType.EXPERT,
  body_shop: PartnerType.BODY_SHOP,
  body: PartnerType.BODY_SHOP,
  insurance: PartnerType.INSURANCE,
};

async function ensureSeedExists() {
  const count = await prisma.partner.count();
  if (count > 0) return;
  await prisma.partner.createMany({ data: SEED_PARTNERS });
}

export async function GET(request: NextRequest) {
  try {
    const typeParam = request.nextUrl.searchParams.get("type");
    const wilayaParam = request.nextUrl.searchParams.get("wilaya");

    try {
      await ensureSeedExists();
    } catch (seedErr) {
      console.warn("Partner seed failed:", seedErr);
    }

    const where: Record<string, unknown> = {};
    if (typeParam) {
      const mappedType = TYPE_MAP[typeParam.toLowerCase()];
      if (mappedType) where.type = mappedType;
    }
    if (wilayaParam) {
      where.wilaya = wilayaParam;
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [{ available: "desc" }, { rating: "desc" }],
    });

    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
