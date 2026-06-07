export type AssuranceType = "" | "third_party" | "full_coverage" | "commercial";

export type PaymentMethod = "card" | "transfer" ;

export type GuaranteeOption = {
  id: string;
  key: string;
  label: string;
  price: number;
};

export type GuaranteeInputType = "checkbox" | "selectgroup";

export type GuaranteeGroup = {
  id: string;
  key: string;
  title: string;
  description?: string;
  inputType: GuaranteeInputType;
  mandatory: boolean;
  options: GuaranteeOption[];
};

export type GuaranteeSelections = Record<string, string[]>;

export type CarInfo = {
  brand: string;
  model: string;
  version: string;
  energy: string;
  seats: string;
  parking: string;
  registration: string;
  chassisNumber: string;
  firstRegistrationDate: string;
  marketValue: string;
  usage: string;
  circulationZone: string;
  insuredCapital: string;
  mileage: string;
  estimatedKmPerYear: string;
  horsepower: string;
  technicalCertificate: string;
  carteGriseNumber?: string;
  previousInsuranceNumber?: string;
  peakHoursDriving?: string;
  nightDrive?: "yes" | "no" | "";
  priorViolations?: "yes" | "no" | "";
  priorAccidents?: "yes" | "no" | "";
};

export type PaymentInfo = {
  fullName: string;
  email: string;
  phone: string;
  method: PaymentMethod;
  acceptTerms: boolean;
};

export type FarmerInfo = {
  // Equipment Information
  equipmentType: string;
  equipmentBrand: string;
  equipmentModel: string;
  equipmentYear: string;
  equipmentValue: string;
  equipmentQuantity: string;

  // Agricultural Information
  farmArea: string;
  cropTypes: string;
  cropProduction: string;
  livestockTypes: string;
  livestockQuantity: string;
  farmingExperience: string;
};
