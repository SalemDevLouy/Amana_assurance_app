"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card } from "@heroui/react";
import {
  FaFire, FaLock, FaTractor, FaLeaf, FaCheckCircle, FaChevronRight,
} from "react-icons/fa";
import { GiCow, GiChicken, GiWheat } from "react-icons/gi";
import StepFarmerInfo from "../components/StepFarmerInfo";
import StepGuarantees from "../components/StepGuarantees";
import StepIndicator from "../components/StepIndicator";
import StepPayment from "../components/StepPayment";
import SubmissionSuccess from "../components/SubmissionSuccess";
import {
  FarmerInfo, GuaranteeGroup, GuaranteeOption,
  GuaranteeSelections, PaymentInfo,
} from "../types";
import {
  getProfileStatusCached,
  makeGuaranteesCacheKey,
  readGuaranteesCache,
  writeGuaranteesCache,
} from "@/app/lib/clientCache";

// ── Agricultural coverage types ───────────────────────────────────────────────
type AgriType =
  | ""
  | "agri_fire"
  | "agri_poultry"
  | "agri_livestock"
  | "agri_crop"
  | "agri_theft"
  | "agri_vehicles";

type AgriCoverageOption = {
  key: Exclude<AgriType, "">;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  includes: string[];
  color: string;
  selectedBorder: string;
  selectedBg: string;
  basePrice: number;
};

const AGRI_OPTIONS: AgriCoverageOption[] = [
  {
    key: "agri_fire",
    icon: FaFire,
    badge: "Incendie",
    badgeColor: "bg-rose-100 text-rose-700",
    title: "Annexe Incendie Agricole",
    description:
      "Couvre tous les mâcosûtés de l'élevage : fabriques d'aliments, couvoirs, entrepôts à céréales et chambres froides contre l'incendie et risques additionnels (tempêtes, inondations, explosions, séismes…).",
    includes: [
      "Bâtiments d'élevage et de stockage",
      "Risques additionnels (tempête, inondation, grêle)",
      "Explosions, séismes, chutes d'aéronefs",
    ],
    color: "text-rose-600",
    selectedBorder: "border-rose-400",
    selectedBg: "bg-rose-50",
    basePrice: 15000,
  },
  {
    key: "agri_poultry",
    icon: GiChicken,
    badge: "Aviculture",
    badgeColor: "bg-amber-100 text-amber-700",
    title: "Annexe Aviculture",
    description:
      "Indemnise les mortalités de volailles dues aux maladies ou accidents : poulets de chair (56 jours), poules pondeuses (jusqu'à 1,5 an) et dindes (78 semaines). Taux fixé après inspection du champ.",
    includes: [
      "Poulets de chair (56 jours)",
      "Poules pondeuses (élevage + ponte)",
      "Dindes (78 semaines)",
    ],
    color: "text-amber-600",
    selectedBorder: "border-amber-400",
    selectedBg: "bg-amber-50",
    basePrice: 12000,
  },
  {
    key: "agri_livestock",
    icon: GiCow,
    badge: "Bétail",
    badgeColor: "bg-emerald-100 text-emerald-700",
    title: "Annexe Bétail",
    description:
      "Couvre la mort de bovins, buffles, moutons, chèvres et chevaux due à une maladie ou un accident pendant une année entière. Le taux est basé sur le rapport d'inspection.",
    includes: [
      "Bovins, buffles, ovins, caprins",
      "Chevaux et équidés",
      "Durée : 1 année complète",
    ],
    color: "text-emerald-600",
    selectedBorder: "border-emerald-400",
    selectedBg: "bg-emerald-50",
    basePrice: 18000,
  },
  {
    key: "agri_crop",
    icon: GiWheat,
    badge: "Production végétale",
    badgeColor: "bg-green-100 text-green-700",
    title: "Production Végétale",
    description:
      "Protège les céréales, vergers, légumes et pépinières contre l'incendie, la foudre, la grêle, les pluies torrentielles, la sécheresse (zones pluviales) et les ravageurs incontrôlables.",
    includes: [
      "Céréales, vergers et jardins fruitiers",
      "Légumes et pépinières",
      "Grêle, sécheresse, ravageurs incontrôlables",
    ],
    color: "text-green-600",
    selectedBorder: "border-green-400",
    selectedBg: "bg-green-50",
    basePrice: 10000,
  },
  {
    key: "agri_theft",
    icon: FaLock,
    badge: "Vol",
    badgeColor: "bg-violet-100 text-violet-700",
    title: "Annexe Vol",
    description:
      "Couvre toute perte ou tout dommage aux biens assurés résultant d'un vol ou d'une tentative de vol sur l'exploitation. S'applique aux équipements, récoltes stockées et cheptel.",
    includes: [
      "Vol de matériel et équipements agricoles",
      "Tentatives de vol couvertes",
      "Récoltes stockées et cheptel",
    ],
    color: "text-violet-600",
    selectedBorder: "border-violet-400",
    selectedBg: "bg-violet-50",
    basePrice: 8000,
  },
  {
    key: "agri_vehicles",
    icon: FaTractor,
    badge: "Véhicules",
    badgeColor: "bg-lime-100 text-lime-700",
    title: "Véhicules Agricoles",
    description:
      "Couvre tous les engins agricoles (tracteurs, moissonneuses, etc.) contre l'incendie, le vol, le tonnage, la collision et la responsabilité civile selon les tarifs réglementaires.",
    includes: [
      "Incendie, vol et tonnage",
      "Collision et dommages",
      "Responsabilité civile tous risques",
    ],
    color: "text-lime-700",
    selectedBorder: "border-lime-400",
    selectedBg: "bg-lime-50",
    basePrice: 25000,
  },
];

// ── Guarantee helpers (same as auto wizard) ───────────────────────────────────
function getInitialSelections(groups: GuaranteeGroup[]): GuaranteeSelections {
  const selections: GuaranteeSelections = {};
  for (const group of groups) {
    if (group.mandatory) {
      selections[group.key] = group.options.map((o) => o.id);
    } else if (group.inputType === "selectgroup") {
      const none = group.options.find((o) => o.key === "none");
      const def = none ?? group.options[0];
      selections[group.key] = def ? [def.id] : [];
    } else {
      selections[group.key] = [];
    }
  }
  return selections;
}

function sumGroupPrices(group: GuaranteeGroup, selectedIds: string[]): number {
  return selectedIds.reduce((sum, id) => {
    const opt = group.options.find((o) => o.id === id);
    return sum + (opt?.price ?? 0);
  }, 0);
}

function buildSummary(groups: GuaranteeGroup[], selections: GuaranteeSelections): GuaranteeOption[] {
  const summary: GuaranteeOption[] = [];
  for (const group of groups) {
    for (const id of selections[group.key] ?? []) {
      const opt = group.options.find((o) => o.id === id);
      if (opt && !(!group.mandatory && opt.key === "none")) {
        summary.push(opt);
      }
    }
  }
  return summary;
}

// ── Step 1: Agricultural coverage selection ───────────────────────────────────
function StepAgriCoverageType({
  agriType,
  setAgriType,
  setStep,
}: {
  agriType: AgriType;
  setAgriType: (t: AgriType) => void;
  setStep: (s: number) => void;
}) {
  const handleSelect = (key: AgriType) => {
    setAgriType(key);
    setTimeout(() => setStep(2), 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800">Choisissez votre couverture agricole</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sélectionnez l'annexe ou la police qui correspond à votre activité.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGRI_OPTIONS.map((opt) => {
          const isSelected = agriType === opt.key;
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelect(opt.key)}
              className={`rounded-3xl border-2 p-5 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? `${opt.selectedBorder} ${opt.selectedBg} shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isSelected ? opt.selectedBg : "bg-gray-100"}`}>
                  <Icon className={`text-base ${isSelected ? opt.color : "text-gray-400"}`} />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${opt.badgeColor}`}>{opt.badge}</span>
              </div>

              <p className={`mb-1.5 text-sm font-extrabold ${isSelected ? opt.color : "text-gray-800"}`}>{opt.title}</p>
              <p className="mb-4 text-xs leading-relaxed text-gray-500">{opt.description}</p>

              <ul className="mb-4 space-y-1.5">
                {opt.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isSelected ? opt.color.replace("text-", "bg-") : "bg-gray-300"}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <p className={`text-sm font-bold ${isSelected ? opt.color : "text-gray-500"}`}>
                À partir de {opt.basePrice.toLocaleString("fr-DZ")} DA/an
              </p>
            </button>
          );
        })}
      </div>

      {agriType === "" && (
        <p className="text-xs font-medium text-amber-600">
          Veuillez sélectionner un type de couverture pour continuer.
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const EMPTY_FARMER: FarmerInfo = {
  equipmentType: "",
  equipmentBrand: "",
  equipmentModel: "",
  equipmentYear: "",
  equipmentValue: "",
  equipmentQuantity: "",
  farmArea: "",
  cropTypes: "",
  cropProduction: "",
  livestockTypes: "",
  livestockQuantity: "",
  farmingExperience: "",
};

const EMPTY_PAYMENT: PaymentInfo = {
  fullName: "",
  email: "",
  phone: "",
  method: "card",
  acceptTerms: false,
};

export default function AgricoleWizardPage() {
  const router = useRouter();
  const { status } = useSession();

  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [step, setStep]       = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [agriType, setAgriType]       = useState<AgriType>("");
  const [farmerInfo, setFarmerInfo]   = useState<FarmerInfo>(EMPTY_FARMER);
  const [payment, setPayment]         = useState<PaymentInfo>(EMPTY_PAYMENT);

  const [guaranteeGroups, setGuaranteeGroups]       = useState<GuaranteeGroup[]>([]);
  const [guaranteeSelections, setGuaranteeSelections] = useState<GuaranteeSelections>({});
  const [guaranteesLoading, setGuaranteesLoading]   = useState(false);
  const [guaranteesError, setGuaranteesError]       = useState<string | null>(null);

  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [contractNumber, setContractNumber] = useState<string | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.replace("/login"); return; }

    let cancelled = false;
    (async () => {
      try {
        const ok = await getProfileStatusCached();
        if (!ok) { router.replace("/main/profile?complete=1"); return; }
      } catch {
        router.replace("/main/profile?complete=1");
        return;
      } finally {
        if (!cancelled) setIsCheckingAccess(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router, status]);

  // ── Load FARMER guarantees when type is selected ────────────────────────────
  useEffect(() => {
    if (agriType === "") {
      setGuaranteeGroups([]);
      setGuaranteeSelections({});
      return;
    }

    let cancelled = false;
    const load = async () => {
      setGuaranteesLoading(true);
      setGuaranteesError(null);
      try {
        const cacheKey = makeGuaranteesCacheKey("farmer");
        const cached = readGuaranteesCache<GuaranteeGroup[]>(cacheKey);
        if (cached && cached.length > 0) {
          setGuaranteeGroups(cached);
          setGuaranteeSelections(getInitialSelections(cached));
          return;
        }

        const res = await fetch("/api/guarantees?assuranceType=farmer");
        const data = (await res.json()) as { groups?: GuaranteeGroup[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Impossible de charger les garanties.");

        const groups = data.groups ?? [];
        if (!cancelled) {
          setGuaranteeGroups(groups);
          writeGuaranteesCache(cacheKey, groups);
          setGuaranteeSelections(getInitialSelections(groups));
        }
      } catch (err) {
        if (!cancelled) {
          setGuaranteesError(err instanceof Error ? err.message : "Erreur réseau.");
          setGuaranteeGroups([]);
          setGuaranteeSelections({});
        }
      } finally {
        if (!cancelled) setGuaranteesLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [agriType]);

  // ── Computed values ─────────────────────────────────────────────────────────
  const basePrice = AGRI_OPTIONS.find((o) => o.key === agriType)?.basePrice ?? 0;

  const optionsTotal = useMemo(() =>
    guaranteeGroups.reduce((sum, group) => {
      if (group.mandatory) return sum;
      return sum + sumGroupPrices(group, guaranteeSelections[group.key] ?? []);
    }, 0),
  [guaranteeGroups, guaranteeSelections]);

  const selectedGuaranteesSummary = useMemo(
    () => buildSummary(guaranteeGroups, guaranteeSelections),
    [guaranteeGroups, guaranteeSelections]
  );

  const totalCost = basePrice + optionsTotal;

  // ── Step 2 validation (farmer info) ────────────────────────────────────────
  const step2Valid = useMemo(() => {
    // At minimum, the user must provide equipment type OR farm area
    const hasEquipmentOrFarm = farmerInfo.equipmentType.trim() !== "" || farmerInfo.farmArea.trim() !== "";
    // Vehicle-type coverage also needs equipment brand
    if (agriType === "agri_vehicles") {
      return farmerInfo.equipmentType.trim() !== "" && farmerInfo.equipmentBrand.trim() !== "";
    }
    // Poultry/livestock need the relevant field
    if (agriType === "agri_poultry") {
      return hasEquipmentOrFarm && farmerInfo.farmArea.trim() !== "";
    }
    if (agriType === "agri_livestock") {
      return farmerInfo.livestockTypes.trim() !== "" && farmerInfo.livestockQuantity.trim() !== "";
    }
    if (agriType === "agri_crop") {
      return farmerInfo.farmArea.trim() !== "" && farmerInfo.cropTypes.trim() !== "";
    }
    return hasEquipmentOrFarm;
  }, [agriType, farmerInfo]);

  const canGoNext = useMemo(() => {
    if (step === 1) return agriType !== "";
    if (step === 2) return step2Valid;
    if (step === 3) return !guaranteesLoading && guaranteeGroups.length > 0;
    if (step === 4) return payment.fullName.trim() !== "" && payment.email.trim() !== "" && payment.phone.trim() !== "" && payment.acceptTerms;
    return false;
  }, [step, agriType, step2Valid, guaranteesLoading, guaranteeGroups.length, payment]);

  // ── Build a carInfo-compatible object from farmerInfo ───────────────────────
  function buildCarInfo() {
    const brand =
      farmerInfo.equipmentBrand.trim() ||
      farmerInfo.equipmentType.trim() ||
      farmerInfo.cropTypes.trim() ||
      farmerInfo.livestockTypes.trim() ||
      (AGRI_OPTIONS.find((o) => o.key === agriType)?.badge ?? "Agricole");

    const model =
      farmerInfo.equipmentModel.trim() ||
      farmerInfo.cropTypes.trim() ||
      farmerInfo.livestockTypes.trim() ||
      "N/A";

    const registration =
      farmerInfo.equipmentModel.trim()
        ? `AGR-${farmerInfo.equipmentBrand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`
        : `AGR-${Date.now().toString().slice(-8)}`;

    return {
      brand,
      model,
      version: farmerInfo.equipmentType,
      energy: "",
      seats: farmerInfo.equipmentQuantity,
      parking: "",
      registration,
      chassisNumber: farmerInfo.equipmentYear,
      firstRegistrationDate: farmerInfo.equipmentYear ? `${farmerInfo.equipmentYear}-01-01` : "",
      marketValue: farmerInfo.equipmentValue,
      usage: "agricultural",
      circulationZone: "",
      insuredCapital: farmerInfo.farmArea,
      mileage: "",
      estimatedKmPerYear: farmerInfo.cropProduction,
      horsepower: "",
      technicalCertificate: "",
    };
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canGoNext || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const carInfo = buildCarInfo();

      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assuranceType: agriType,
          carInfo,
          selectedGuarantees: selectedGuaranteesSummary,
          basePrice,
          optionsTotal,
          totalCost,
          paymentMethod: payment.method,
          vehiclePhotoUrls: [],
          documentUrls: { farmerData: JSON.stringify(farmerInfo) },
        }),
      });

      const data = (await res.json()) as { contract?: { contractNumber: string }; error?: string };
      if (!res.ok) { setSubmitError(data.error ?? "Échec de la soumission."); return; }

      setContractNumber(data.contract?.contractNumber ?? null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur réseau. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isCheckingAccess) {
    return (
      <section className="mx-auto min-h-screen max-w-5xl px-4 py-10 pt-24 sm:px-6">
        <div className="rounded-2xl border border-lime-100 bg-white/80 p-6 text-sm font-semibold text-gray-500 shadow-sm">
          Vérification de votre profil…
        </div>
      </section>
    );
  }

  if (submitted) {
    return <SubmissionSuccess totalCost={totalCost} contractNumber={contractNumber} />;
  }

  const agriOption = AGRI_OPTIONS.find((o) => o.key === agriType);

  return (
    <section className="relative z-10 mx-auto min-h-screen max-w-6xl px-3 py-10 pt-20 pb-28 sm:px-6 sm:pt-24 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_45%)]" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-lime-100 bg-white/80 p-5 shadow-lg sm:mb-8 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-600 to-green-500 shadow-md">
            <FaLeaf className="text-lg text-white" />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-lime-600">Nouveau contrat</p>
            <h1 className="text-xl font-extrabold text-gray-800 sm:text-3xl">Assurance Agricole</h1>
            <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
              4 étapes : couverture → exploitation → garanties → paiement.
            </p>
          </div>
        </div>

        {/* Coverage type chip once selected */}
        {agriOption && step > 1 && (
          <div className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${agriOption.selectedBg} ${agriOption.selectedBorder} ${agriOption.color}`}>
            <agriOption.icon className="text-xs" />
            {agriOption.title}
            <FaCheckCircle className="text-xs" />
          </div>
        )}
      </div>

      <div className="relative">
        <StepIndicator step={step} />
      </div>

      <Card className="relative rounded-3xl border border-lime-200 bg-white/85 shadow-2xl shadow-lime-100">
        <div className="p-4 sm:p-8 md:p-10">
          <form id="agri-form" onSubmit={handleSubmit}>

            {step === 1 && (
              <StepAgriCoverageType
                agriType={agriType}
                setAgriType={setAgriType}
                setStep={setStep}
              />
            )}

            {step === 2 && (
              <StepFarmerInfo
                farmerInfo={farmerInfo}
                setFarmerInfo={setFarmerInfo}
                canGoNext={step2Valid}
              />
            )}

            {step === 3 && (
              <StepGuarantees
                assuranceType={"" as never}
                guaranteeGroups={guaranteeGroups}
                selections={guaranteeSelections}
                isLoading={guaranteesLoading}
                error={guaranteesError}
                onCheckboxChange={(key, vals) =>
                  setGuaranteeSelections((prev) => ({ ...prev, [key]: vals }))
                }
                onSelectGroupChange={(key, val) =>
                  setGuaranteeSelections((prev) => ({ ...prev, [key]: val ? [val] : [] }))
                }
              />
            )}

            {step === 4 && (
              <StepPayment
                payment={payment}
                setPayment={setPayment}
                assuranceType={agriType}
                carBrand={farmerInfo.equipmentBrand || farmerInfo.cropTypes || farmerInfo.livestockTypes || "Exploitation agricole"}
                carModel={farmerInfo.equipmentModel || farmerInfo.equipmentType || "—"}
                registration={farmerInfo.farmArea ? `${farmerInfo.farmArea} ha` : "—"}
                selectedGuaranteesSummary={selectedGuaranteesSummary}
                basePrice={basePrice}
                optionsTotal={optionsTotal}
                totalCost={totalCost}
              />
            )}

            {submitError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            {/* ── Desktop nav ──────────────────────────────────── */}
            <div className="mt-8 hidden items-center justify-between border-t border-gray-200 pt-6 sm:flex">
              <Button
                type="button"
                variant="outline"
                onPress={() => setStep((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700"
              >
                Retour
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  isDisabled={!canGoNext}
                  onPress={() => setStep((p) => Math.min(4, p + 1))}
                  className="rounded-xl bg-gradient-to-r from-lime-600 to-green-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-lime-500/25 disabled:opacity-50"
                >
                  Continuer <FaChevronRight className="inline text-xs" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  isDisabled={submitting || !canGoNext}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 disabled:opacity-50"
                >
                  {submitting ? "Envoi en cours…" : "Confirmer & Payer"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>

      {/* ── Mobile sticky bar ─────────────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((p) => Math.max(1, p - 1))}
            className="flex-shrink-0 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            Retour
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep((p) => Math.min(4, p + 1))}
              className="flex-1 rounded-2xl bg-gradient-to-r from-lime-600 to-green-500 py-3 text-sm font-bold text-white shadow-md shadow-lime-500/25 disabled:opacity-50 active:opacity-90"
            >
              Continuer
            </button>
          ) : (
            <button
              type="submit"
              form="agri-form"
              disabled={submitting || !canGoNext}
              className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/25 disabled:opacity-50 active:opacity-90"
            >
              {submitting ? "Envoi…" : "Confirmer & Payer"}
            </button>
          )}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </section>
  );
}
