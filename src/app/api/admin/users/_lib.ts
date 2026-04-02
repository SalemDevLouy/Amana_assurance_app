import { Role } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export type SerializedAdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  dateOfBirth: string | null;
  gender: string | null;
  phone: string | null;
  profession: string | null;
  wilaya: string | null;
  region: string | null;
  address: string | null;
  licenseNumber: string | null;
  licenseType: string | null;
  licenseIssueDate: string | null;
  secondaryDrivers: string[];
  profileCompletion: number;
  accountStatus: "Actif" | "Partiel" | "Administrateur";
  assuranceCount: number;
  demandCount: number;
};

export type AssuranceHistoryEntry = {
  id: string;
  title: string;
  category: string;
  status: "Active" | "En cours" | "Expiree";
  premium: string;
  lastUpdate: string;
  reference: string;
};

export type DemandHistoryEntry = {
  id: string;
  title: string;
  status: "En attente" | "Traitee" | "Approuvee";
  submittedAt: string;
  channel: string;
  notes: string;
};

export type AdminUserDetail = SerializedAdminUser & {
  assurances: AssuranceHistoryEntry[];
  demands: DemandHistoryEntry[];
};

export type UserRecord = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    dateOfBirth: true;
    gender: true;
    phone: true;
    profession: true;
    wilaya: true;
    region: true;
    address: true;
    licenseNumber: true;
    licenseType: true;
    licenseIssueDate: true;
    secondaryDrivers: true;
  };
}>;

const PROFILE_FIELDS: Array<keyof Pick<
  UserRecord,
  | "name"
  | "dateOfBirth"
  | "gender"
  | "phone"
  | "profession"
  | "wilaya"
  | "region"
  | "address"
  | "licenseNumber"
  | "licenseType"
  | "licenseIssueDate"
>> = [
  "name",
  "dateOfBirth",
  "gender",
  "phone",
  "profession",
  "wilaya",
  "region",
  "address",
  "licenseNumber",
  "licenseType",
  "licenseIssueDate",
];

function hashString(value: string) {
  let hash = 0;

  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    hash = Math.imul(31, hash) + codePoint;
  }

  return hash;
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function calculateProfileCompletion(user: UserRecord) {
  const filledFields = PROFILE_FIELDS.reduce((count, field) => {
    const value = user[field];

    if (value instanceof Date) {
      return count + 1;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return count + 1;
    }

    return count;
  }, 0);

  const secondaryDriversBonus = user.secondaryDrivers.length > 0 ? 1 : 0;
  const totalFields = PROFILE_FIELDS.length + 1;

  return Math.min(100, Math.round(((filledFields + secondaryDriversBonus) / totalFields) * 100));
}

function buildAssuranceHistory(user: UserRecord): AssuranceHistoryEntry[] {
  const seed = Math.abs(hashString(user.id + user.email));
  const baseDate = new Date(user.createdAt);

  const templates = [
    {
      title: "Assurance automobile",
      category: "Vehicule particulier",
      status: "Active" as const,
      premium: 18500,
    },
    {
      title: "Assurance agricole",
      category: "Materiel et recolte",
      status: "En cours" as const,
      premium: 12400,
    },
    {
      title: "Protection complementaire",
      category: "Assistance et recours",
      status: "Expiree" as const,
      premium: 9200,
    },
  ];

  return templates.map((template, index) => {
    const offset = ((seed >> (index * 3)) % 9) + index + 1;

    return {
      id: `ASS-${String(seed % 1000).padStart(3, "0")}-${index + 1}`,
      title: template.title,
      category: template.category,
      status: template.status,
      premium: `${template.premium + (seed % 1500) * (index + 1)} DA / an`,
      lastUpdate: formatDate(new Date(baseDate.getTime() + offset * 86400000)),
      reference: `Dossier ${user.id.slice(0, 6).toUpperCase()}-${index + 1}`,
    };
  });
}

function buildDemandHistory(user: UserRecord): DemandHistoryEntry[] {
  const seed = Math.abs(hashString(user.email + user.id));
  const baseDate = new Date(user.updatedAt);

  const templates = [
    {
      title: "Demande de devis",
      status: "Approuvee" as const,
      channel: "Portail client",
      notes: "Demande initiale enregistree et envoyee pour validation.",
    },
    {
      title: "Mise a jour du dossier",
      status: "Traitee" as const,
      channel: "Espace personnel",
      notes: "Informations personnelles synchronisees avec le profil client.",
    },
    {
      title: "Declaration d'accident",
      status: "En attente" as const,
      channel: "Formulaire mobile",
      notes: "Pieces jointes en cours de traitement par l'equipe support.",
    },
  ];

  return templates.map((template, index) => {
    const offset = ((seed >> (index * 2)) % 7) + index + 2;

    return {
      id: `DEM-${String(seed % 1000).padStart(3, "0")}-${index + 1}`,
      title: template.title,
      status: template.status,
      submittedAt: formatDateTime(new Date(baseDate.getTime() - offset * 86400000)),
      channel: template.channel,
      notes: template.notes,
    };
  });
}

export function serializeUser(user: UserRecord): SerializedAdminUser {
  const profileCompletion = calculateProfileCompletion(user);
  let accountStatus: SerializedAdminUser["accountStatus"];

  if (user.role === Role.ADMIN) {
    accountStatus = "Administrateur";
  } else if (profileCompletion >= 75) {
    accountStatus = "Actif";
  } else {
    accountStatus = "Partiel";
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: formatDateTime(user.createdAt),
    updatedAt: formatDateTime(user.updatedAt),
    dateOfBirth: user.dateOfBirth ? formatDate(user.dateOfBirth) : null,
    gender: user.gender ?? null,
    phone: user.phone ?? null,
    profession: user.profession ?? null,
    wilaya: user.wilaya ?? null,
    region: user.region ?? null,
    address: user.address ?? null,
    licenseNumber: user.licenseNumber ?? null,
    licenseType: user.licenseType ?? null,
    licenseIssueDate: user.licenseIssueDate ? formatDate(user.licenseIssueDate) : null,
    secondaryDrivers: user.secondaryDrivers,
    profileCompletion,
    accountStatus,
    assuranceCount: buildAssuranceHistory(user).length,
    demandCount: buildDemandHistory(user).length,
  };
}

export function serializeUserDetail(user: UserRecord): AdminUserDetail {
  return {
    ...serializeUser(user),
    assurances: buildAssuranceHistory(user),
    demands: buildDemandHistory(user),
  };
}
