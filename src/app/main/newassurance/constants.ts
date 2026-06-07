import { AssuranceType, GuaranteeInputType } from "./types";

// Internal API catalog type (maps to DB AssuranceCatalogType enum)
export type ApiCatalogType = "car" | "farmer";

type GuaranteeSeedOption = {
  key: string;
  label: string;
  price: number;
};

type GuaranteeSeedGroup = {
  key: string;
  title: string;
  description?: string;
  inputType: GuaranteeInputType;
  mandatory: boolean;
  options: GuaranteeSeedOption[];
};

export const DEFAULT_GUARANTEE_CATALOG: Record<ApiCatalogType, GuaranteeSeedGroup[]> = {
  car: [
    {
      key: "civil-liability",
      title: "Civil Liability",
      description: "Mandatory coverage",
      inputType: "checkbox",
      mandatory: true,
      options: [{ key: "civil-liability", label: "Civil Liability (mandatory)", price: 0 }],
    },
    {
      key: "optional-simple",
      title: "Optional Coverages",
      description: "Choose any optional protections that apply.",
      inputType: "checkbox",
      mandatory: false,
      options: [
        { key: "defense-recourse", label: "Defense & Recourse", price: 500 },
        { key: "rachat-vetuste-franchise", label: "Wear & Deductible Buyback", price: 2500 },
        { key: "loss-of-use", label: "Loss of Use / Business Interruption", price: 2000 },
      ],
    },
    {
      key: "personnes-transportees",
      title: "Passengers",
      description: "Select the coverage limit for passengers.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "None", price: 0 },
        { key: "pt-20000", label: "20,000 DA", price: 500 },
        { key: "pt-30000", label: "30,000 DA", price: 750 },
        { key: "pt-50000", label: "50,000 DA", price: 1200 },
        { key: "pt-100000", label: "100,000 DA", price: 2200 },
        { key: "pt-200000", label: "200,000 DA", price: 4000 },
      ],
    },
    {
      key: "glass",
      title: "Glass Breakage",
      description: "Choose a glass protection option.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "None", price: 0 },
        { key: "glass-standard", label: "Standard glass", price: 1500 },
        { key: "glass-panoramic", label: "Panoramic glass", price: 3000 },
      ],
    },
    {
      key: "theft-fire",
      title: "Theft & Fire",
      description: "Select theft/fire coverage level.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "None", price: 0 },
        { key: "theft-fire-vehicle-value", label: "Theft & Fire - Vehicle value", price: 20000 },
        { key: "theft-fire-100000", label: "Theft & Fire - 100,000 DA", price: 3000 },
        { key: "theft-fire-200000", label: "Theft & Fire - 200,000 DA", price: 4500 },
        { key: "theft-fire-300000", label: "Theft & Fire - 300,000 DA", price: 6000 },
        { key: "theft-fire-400000", label: "Theft & Fire - 400,000 DA", price: 7500 },
        { key: "theft-fire-500000", label: "Theft & Fire - 500,000 DA", price: 9000 },
        { key: "theft-fire-600000", label: "Theft & Fire - 600,000 DA", price: 10500 },
        { key: "theft-fire-700000", label: "Theft & Fire - 700,000 DA", price: 12000 },
        { key: "theft-fire-800000", label: "Theft & Fire - 800,000 DA", price: 13500 },
        { key: "theft-fire-900000", label: "Theft & Fire - 900,000 DA", price: 15000 },
        { key: "theft-fire-1000000", label: "Theft & Fire - 1,000,000 DA", price: 16500 },
      ],
    },
    {
      key: "collision",
      title: "Collision Damage",
      description: "Choose your collision coverage level.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "None", price: 0 },
        { key: "collision-vehicle-value", label: "Collision - Vehicle value", price: 25000 },
        { key: "collision-10000", label: "Collision - 10,000 DA", price: 2000 },
        { key: "collision-20000", label: "Collision - 20,000 DA", price: 3500 },
        { key: "collision-30000", label: "Collision - 30,000 DA", price: 5000 },
        { key: "collision-40000", label: "Collision - 40,000 DA", price: 6500 },
        { key: "collision-50000", label: "Collision - 50,000 DA", price: 8000 },
      ],
    },
    {
      key: "assistance",
      title: "Roadside Assistance",
      description: "Choose your assistance level.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "None", price: 0 },
        { key: "assist-basic", label: "Basic Assistance (70 km)", price: 500 },
        { key: "assist-classic", label: "Classic Assistance", price: 1150 },
        { key: "assist-silver", label: "Silver Assistance (500 km)", price: 2500 },
        { key: "assist-gold", label: "Gold Assistance", price: 6000 },
        { key: "assist-platinum", label: "Platinum Assistance (1,500 km)", price: 6400 },
        { key: "assist-truck", label: "Truck Assistance (heavy vehicles)", price: 0 },
      ],
    },
  ],
  farmer: [
    {
      key: "agricultural-civil-liability",
      title: "Responsabilite civile agricole",
      description: "Garantie obligatoire",
      inputType: "checkbox",
      mandatory: true,
      options: [{ key: "agricultural-civil-liability", label: "Responsabilite civile agricole (obligatoire)", price: 0 }],
    },
    {
      key: "agricultural-optionals",
      title: "Garanties Agricole facultatives",
      description: "Choisissez toutes les options qui s'appliquent.",
      inputType: "checkbox",
      mandatory: false,
      options: [
        { key: "agr-hail-fire-storm", label: "Multirisque grele, incendie, tempete, gel et inondation", price: 0 },
        { key: "agr-rolling-equipment", label: "Materiel agricole roulant", price: 0 },
        { key: "agr-livestock", label: "Multirisques Betail", price: 0 },
        { key: "agr-farm-exploitation", label: "Multirisque exploitation agricole", price: 0 },
        { key: "agr-crop-insurance", label: "Assurance recolte (perte de rendement)", price: 0 },
        { key: "agr-transport", label: "Assurance transport agricole", price: 0 },
      ],
    },
  ],
};

export const BASE_PRICE: Record<Exclude<AssuranceType, "">, number> = {
  third_party: 21000,
  full_coverage: 21000,
  commercial: 21000,
};

// Maps UI coverage types to the API catalog type
export const COVERAGE_TO_API_TYPE: Record<Exclude<AssuranceType, "">, "car"> = {
  third_party: "car",
  full_coverage: "car",
  commercial: "car",
};
