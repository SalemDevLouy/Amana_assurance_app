export type UUID = string;

export type Witness = {
  id: UUID;
  name: string;
  phone?: string;
  address?: string;
};

export type InjuryDetail = {
  id: UUID;
  name: string;
  phone?: string;
  type?: string;
};

export type VehicleProfile = {
  id: UUID;
  side: "A" | "B";
  plateNumber?: string;
  brand?: string;
  model?: string;
  country?: string;
  insuranceCompany?: string;
  policyNumber?: string;
  driverName?: string;
  driverPhone?: string;
  refusedCooperation?: boolean;
};

export type Circumstances = Record<string, boolean>;

export type ConstatForm = {
  id: UUID;
  dateTime: string;
  location?: string;
  hasInjuries?: boolean | null;
  injuryDetails: InjuryDetail[];
  otherPropertyDamage?: boolean | null;
  witnessesPresent?: boolean | null;
  witnessList: Witness[];
  vehicles: VehicleProfile[]; // A and B
  circumstancesA: Circumstances;
  circumstancesB: Circumstances;
  pointOfImpact?: string;
  apparentDamages?: string;
  sketchFiles: string[]; // data URLs or file names
  observations?: string;
  signatureA?: string; // data URL
  signatureB?: string; // data URL or remote approval token
};

export const DEFAULT_CONSTAT_ID = "local-constat-draft";
