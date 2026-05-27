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
      title: "Responsabilite civile",
      description: "Garantie obligatoire",
      inputType: "checkbox",
      mandatory: true,
      options: [{ key: "civil-liability", label: "Responsabilite civile (obligatoire)", price: 0 }],
    },
    {
      key: "optional-simple",
      title: "Garanties facultatives",
      description: "Choisissez toutes les options qui s'appliquent.",
      inputType: "checkbox",
      mandatory: false,
      options: [
        { key: "defense-recourse", label: "Defense et recours", price: 0 },
        { key: "rachat-vetuste-franchise", label: "Rachat de vetuste et de franchise", price: 0 },
        { key: "loss-of-use", label: "Perte de jouissance ou d'exploitation", price: 0 },
        { key: "transported-people", label: "Personnes transportees", price: 0 },
      ],
    },
    {
      key: "glass",
      title: "Bris de glace",
      description: "Choisissez une protection bris de glace.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "Aucune", price: 0 },
        { key: "glass-standard", label: "Bris de glace", price: 0 },
        { key: "glass-panoramic", label: "Bris de glace panoramique", price: 0 },
      ],
    },
    {
      key: "theft-fire",
      title: "Vol et incendie",
      description: "Selectionnez le niveau de couverture vol/incendie.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "Aucune", price: 0 },
        { key: "theft-fire-vehicle-value", label: "Vol & Incendie Valeur vehicule", price: 0 },
        { key: "theft-fire-100000", label: "Vol & Incendie 100.000 DA", price: 0 },
        { key: "theft-fire-200000", label: "Vol & Incendie 200.000 DA", price: 0 },
        { key: "theft-fire-300000", label: "Vol & Incendie 300.000 DA", price: 0 },
        { key: "theft-fire-400000", label: "Vol & Incendie 400.000 DA", price: 0 },
        { key: "theft-fire-500000", label: "Vol & Incendie 500.000 DA", price: 0 },
        { key: "theft-fire-600000", label: "Vol & Incendie 600.000 DA", price: 0 },
        { key: "theft-fire-700000", label: "Vol & Incendie 700.000 DA", price: 0 },
        { key: "theft-fire-800000", label: "Vol & Incendie 800.000 DA", price: 0 },
        { key: "theft-fire-900000", label: "Vol & Incendie 900.000 DA", price: 0 },
        { key: "theft-fire-1000000", label: "Vol & Incendie 1.000.000 DA", price: 0 },
      ],
    },
    {
      key: "collision",
      title: "Dommages avec ou sans collision",
      description: "Choisissez votre formule dommages.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "Aucune", price: 0 },
        { key: "collision-vehicle-value", label: "Dommages Collision Valeur vehicule", price: 0 },
        { key: "collision-10000", label: "Dommages Collision 10.000 DA", price: 0 },
        { key: "collision-20000", label: "Dommages Collision 20.000 DA", price: 0 },
        { key: "collision-30000", label: "Dommages Collision 30.000 DA", price: 0 },
        { key: "collision-40000", label: "Dommages Collision 40.000 DA", price: 0 },
        { key: "collision-50000", label: "Dommages Collision 50.000 DA", price: 0 },
      ],
    },
    {
      key: "assistance",
      title: "Assistance Automobile",
      description: "Choisissez votre niveau d'assistance.",
      inputType: "selectgroup",
      mandatory: false,
      options: [
        { key: "none", label: "Aucune", price: 0 },
        { key: "assist-basic", label: "Assistance Basique (70 km)", price: 500 },
        { key: "assist-classic", label: "Assistance Classique", price: 1150 },
        { key: "assist-silver", label: "Assistance Silver (500 km)", price: 2500 },
        { key: "assist-gold", label: "Assistance Gold", price: 6000 },
        { key: "assist-platinum", label: "Assistance Platinum (1 500 km)", price: 6400 },
        { key: "assist-truck", label: "Assistance Truck (vehicules lourds)", price: 0 },
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
  third_party: 9200,
  full_coverage: 18500,
  commercial: 24000,
};

// Maps UI coverage types to the API catalog type
export const COVERAGE_TO_API_TYPE: Record<Exclude<AssuranceType, "">, "car"> = {
  third_party: "car",
  full_coverage: "car",
  commercial: "car",
};
