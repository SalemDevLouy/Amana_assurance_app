"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card } from "@heroui/react";
import { BASE_PRICE, COVERAGE_TO_API_TYPE } from "./constants";
import StepAssuranceType from "./components/StepAssuranceType";
import StepGuarantees from "./components/StepGuarantees";
import StepIndicator from "./components/StepIndicator";
import StepPayment from "./components/StepPayment";
import StepVehicleInfo from "./components/StepVehicleInfo";
import SubmissionSuccess from "./components/SubmissionSuccess";
import { compressAll } from "@/lib/compressImage";
import {
  AssuranceType,
  CarInfo,
  GuaranteeGroup,
  GuaranteeOption,
  GuaranteeSelections,
  PaymentInfo,
} from "./types";
import {
  getProfileStatusCached,
  makeGuaranteesCacheKey,
  readGuaranteesCache,
  writeGuaranteesCache,
} from "@/app/lib/clientCache";

function getInitialSelections(groups: GuaranteeGroup[]): GuaranteeSelections {
  const selections: GuaranteeSelections = {};

  for (const group of groups) {
    if (group.mandatory) {
      selections[group.key] = group.options.map((option) => option.id);
      continue;
    }

    if (group.inputType === "selectgroup") {
      const noneOption = group.options.find((option) => option.key === "none");
      const defaultOption = noneOption ?? group.options[0];
      selections[group.key] = defaultOption ? [defaultOption.id] : [];
      continue;
    }

    selections[group.key] = [];
  }

  return selections;
}

function sumSelectedGroupPrices(group: GuaranteeGroup, selectedIds: string[]): number {
  return selectedIds.reduce((groupSum, optionId) => {
    const option = group.options.find((item) => item.id === optionId);
    return groupSum + (option?.price ?? 0);
  }, 0);
}

function buildSelectedGuaranteesSummary(
  groups: GuaranteeGroup[],
  selections: GuaranteeSelections
): GuaranteeOption[] {
  const summary: GuaranteeOption[] = [];

  for (const group of groups) {
    const selectedIds = selections[group.key] ?? [];

    for (const optionId of selectedIds) {
      const option = group.options.find((item) => item.id === optionId);
      if (!option) {
        continue;
      }

      if (!group.mandatory && option.key === "none") {
        continue;
      }

      summary.push(option);
    }
  }

  return summary;
}

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [assuranceType, setAssuranceType] = useState<AssuranceType>("");
  const [carInfo, setCarInfo] = useState<CarInfo>({
    brand: "",
    model: "",
    version: "",
    energy: "",
    seats: "",
    parking: "",
    registration: "",
    chassisNumber: "",
    firstRegistrationDate: "",
    marketValue: "",
    usage: "",
    circulationZone: "",
    insuredCapital: "",
    mileage: "",
    estimatedKmPerYear: "",
    horsepower: "",
    technicalCertificate: "",
  });
  const [vehiclePhotos, setVehiclePhotos] = useState<File[]>([]);
  const [chassisPhoto, setChassisPhoto] = useState<File | null>(null);
  const [platePhoto, setPlatePhoto] = useState<File | null>(null);
  const [odometerPhoto, setOdometerPhoto] = useState<File | null>(null);
  const [carteGriseFile, setCarteGriseFile] = useState<File | null>(null);
  const [previousInsuranceFile, setPreviousInsuranceFile] = useState<File | null>(null);
  const [guaranteeGroups, setGuaranteeGroups] = useState<GuaranteeGroup[]>([]);
  const [guaranteeSelections, setGuaranteeSelections] = useState<GuaranteeSelections>({});
  const [guaranteesLoading, setGuaranteesLoading] = useState(false);
  const [guaranteesError, setGuaranteesError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentInfo>({
    fullName: "",
    email: "",
    phone: "",
    method: "card",
    acceptTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [contractNumber, setContractNumber] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    let isCancelled = false;

    const validateProfileCompletion = async () => {
      try {
        const profileCompleted = await getProfileStatusCached();

        if (!profileCompleted) {
          router.replace("/main/profile?complete=1");
          return;
        }
      } catch {
        router.replace("/main/profile?complete=1");
        return;
      } finally {
        if (!isCancelled) {
          setIsCheckingAccess(false);
        }
      }
    };

    void validateProfileCompletion();

    return () => {
      isCancelled = true;
    };
  }, [router, status]);

  useEffect(() => {
    if (assuranceType === "") {
      setGuaranteeGroups([]);
      setGuaranteeSelections({});
      setGuaranteesError(null);
      setGuaranteesLoading(false);
      return;
    }

    let isCancelled = false;

    const loadGuarantees = async () => {
      setGuaranteesLoading(true);
      setGuaranteesError(null);

      try {
        const cacheKey = makeGuaranteesCacheKey(assuranceType);
        const cachedGroups = readGuaranteesCache<GuaranteeGroup[]>(cacheKey);

        if (cachedGroups && cachedGroups.length > 0) {
          setGuaranteeGroups(cachedGroups);
          setGuaranteeSelections(getInitialSelections(cachedGroups));
          setGuaranteesLoading(false);
          return;
        }

        const apiType = assuranceType ? COVERAGE_TO_API_TYPE[assuranceType] : "car";
        const response = await fetch(`/api/guarantees?assuranceType=${apiType}`);
        const data = (await response.json()) as { groups?: GuaranteeGroup[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load coverage options.");
        }

        const fetchedGroups: GuaranteeGroup[] = data.groups ?? [];

        if (isCancelled) return;

        setGuaranteeGroups(fetchedGroups);
        writeGuaranteesCache(cacheKey, fetchedGroups);
        setGuaranteeSelections(getInitialSelections(fetchedGroups));
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to load local guarantees:", err);
          setGuaranteesError("Failed to load coverage options. Please try again.");
          setGuaranteeGroups([]);
          setGuaranteeSelections({});
        }
      } finally {
        if (!isCancelled) setGuaranteesLoading(false);
      }
    };

    void loadGuarantees();

    return () => {
      isCancelled = true;
    };
  }, [assuranceType]);

  const handleCheckboxChange = (groupKey: string, values: string[]) => {
    setGuaranteeSelections((prev) => ({
      ...prev,
      [groupKey]: values,
    }));
  };

  const handleSelectGroupChange = (groupKey: string, value: string) => {
    setGuaranteeSelections((prev) => ({
      ...prev,
      [groupKey]: value ? [value] : [],
    }));
  };

  const optionsTotal = useMemo(() => {
    return guaranteeGroups.reduce((sum, group) => {
      if (group.mandatory) {
        return sum;
      }

      const selectedIds = guaranteeSelections[group.key] ?? [];
      const groupTotal = sumSelectedGroupPrices(group, selectedIds);

      return sum + groupTotal;
    }, 0);
  }, [guaranteeGroups, guaranteeSelections]);

  const selectedGuaranteesSummary = useMemo(() => {
    return buildSelectedGuaranteesSummary(guaranteeGroups, guaranteeSelections);
  }, [guaranteeGroups, guaranteeSelections]);

  const basePrice = assuranceType ? BASE_PRICE[assuranceType] : 0;
  const totalCost = basePrice + optionsTotal;

  const step2Missing = useMemo(() => {
    const missing: string[] = [];
    if (!carInfo.brand.trim()) missing.push("Marque");
    if (!carInfo.model.trim()) missing.push("Modèle");
    if (!carInfo.version.trim()) missing.push("Version");
    if (!carInfo.horsepower.trim()) missing.push("Puissance fiscale");
    if (!carInfo.energy.trim()) missing.push("Énergie");
    if (!carInfo.seats.trim()) missing.push("Nombre de places");
    if (!carInfo.parking.trim()) missing.push("Stationnement");
    if (!carInfo.registration.trim()) missing.push("Immatriculation");
    if (!carInfo.chassisNumber.trim()) missing.push("N° châssis");
    if (!carInfo.firstRegistrationDate.trim()) missing.push("Date de mise en circulation");
    if (!carInfo.marketValue.trim()) missing.push("Valeur vénale");
    if (!carInfo.usage.trim()) missing.push("Usage");
    if (!carInfo.circulationZone.trim()) missing.push("Zone de circulation");
    if (!carInfo.insuredCapital.trim()) missing.push("Capital assuré");
    if (!carInfo.mileage.trim()) missing.push("Kilométrage");
    if (!carInfo.estimatedKmPerYear.trim()) missing.push("Km/an estimé");
    if (vehiclePhotos.length === 0) missing.push("Au moins 1 photo du véhicule");
    if (!chassisPhoto) missing.push("Photo châssis");
    if (!platePhoto) missing.push("Photo plaque");
    if (!odometerPhoto) missing.push("Photo compteur");
    return missing;
  }, [carInfo, vehiclePhotos.length, chassisPhoto, platePhoto, odometerPhoto]);

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return assuranceType !== "";
    }

    if (step === 2) {
      return step2Missing.length === 0;
    }

    if (step === 3) {
      return !guaranteesLoading && guaranteeGroups.length > 0;
    }

    if (step === 4) {
      return (
        payment.fullName.trim() !== "" &&
        payment.email.trim() !== "" &&
        payment.phone.trim() !== "" &&
        payment.acceptTerms
      );
    }

    return false;
  }, [
    assuranceType,
    step2Missing,
    payment,
    step,
    guaranteeGroups.length,
    guaranteesLoading,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canGoNext || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Upload photos to Cloudinary
      let vehiclePhotoUrls: string[] = [];
      const documentUrls: Record<string, string> = {};

      const orderedDocs: { key: string; file: File | null }[] = [
        { key: "chassis", file: chassisPhoto },
        { key: "plate", file: platePhoto },
        { key: "odometer", file: odometerPhoto },
        { key: "carteGrise", file: carteGriseFile },
        { key: "previousInsurance", file: previousInsuranceFile },
      ];

      const rawFiles: File[] = [...vehiclePhotos, ...orderedDocs.map((d) => d.file).filter((f): f is File => f !== null)];
      const allFiles = rawFiles.length > 0 ? await compressAll(rawFiles) : [];

      if (allFiles.length > 0) {
        const fd = new FormData();
        for (const f of allFiles) fd.append("files", f);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = (await uploadRes.json()) as { urls?: string[]; error?: string };
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Photo upload failed");
        const urls = uploadData.urls ?? [];
        vehiclePhotoUrls = urls.slice(0, vehiclePhotos.length);
        const docUrls = urls.slice(vehiclePhotos.length);
        let di = 0;
        for (const { key, file } of orderedDocs) {
          if (file) documentUrls[key] = docUrls[di++] ?? "";
        }
      }

      // Step 2: Save contract
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assuranceType,
          carInfo,
          selectedGuarantees: selectedGuaranteesSummary,
          basePrice,
          optionsTotal,
          totalCost,
          paymentMethod: payment.method,
          vehiclePhotoUrls,
          documentUrls,
        }),
      });

      const data = (await response.json()) as { contract?: { contractNumber: string }; error?: string };

      if (!response.ok) {
        setSubmitError(data.error ?? "Failed to submit contract.");
        return;
      }

      setContractNumber(data.contract?.contractNumber ?? null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isCheckingAccess) {
    return (
      <section className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 py-10 pt-24 sm:px-6">
        <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 text-sm font-semibold text-gray-500 shadow-sm">
          Verifying your profile...
        </div>
      </section>
    );
  }

  if (submitted) {
    return <SubmissionSuccess totalCost={totalCost} contractNumber={contractNumber} />;
  }

  return (
    <section className="relative z-10 mx-auto min-h-screen max-w-6xl px-3 py-10 pt-20 pb-28 sm:px-6 sm:pt-24 sm:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)]" />

      <div className="relative mb-5 overflow-hidden rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-lg sm:mb-8 sm:p-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">Nouveau contrat</p>
        <h1 className="text-xl font-extrabold text-gray-800 sm:text-3xl">
          Souscrire à l&apos;assurance auto
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          4 étapes : couverture → véhicule → garanties → paiement.
        </p>
      </div>

      <div className="relative">
        <StepIndicator step={step} />
      </div>

      <Card className="relative rounded-3xl border border-cyan-200 bg-white/85 shadow-2xl shadow-blue-100">
        <div className="p-4 sm:p-8 md:p-10">
          <form id="assurance-form" onSubmit={handleSubmit}>
            {step === 1 && <StepAssuranceType assuranceType={assuranceType} basePrice={BASE_PRICE} setAssuranceType={setAssuranceType} setStep={setStep} />}

            {step === 2 && (
              <StepVehicleInfo
                carInfo={carInfo}
                setCarInfo={setCarInfo}
                setVehiclePhotos={setVehiclePhotos}
                setChassisPhoto={setChassisPhoto}
                setPlatePhoto={setPlatePhoto}
                setOdometerPhoto={setOdometerPhoto}
                setCarteGriseFile={setCarteGriseFile}
                setPreviousInsuranceFile={setPreviousInsuranceFile}
                missingFields={step2Missing}
              />
            )}

            {step === 3 && (
              <StepGuarantees
                assuranceType={assuranceType}
                guaranteeGroups={guaranteeGroups}
                selections={guaranteeSelections}
                isLoading={guaranteesLoading}
                error={guaranteesError}
                onCheckboxChange={handleCheckboxChange}
                onSelectGroupChange={handleSelectGroupChange}
              />
            )}

            {step === 4 && (
              <StepPayment
                payment={payment}
                setPayment={setPayment}
                assuranceType={assuranceType}
                carBrand={carInfo.brand}
                carModel={carInfo.model}
                registration={carInfo.registration}
                selectedGuaranteesSummary={selectedGuaranteesSummary}
                basePrice={basePrice}
                optionsTotal={optionsTotal}
                totalCost={totalCost}
              />
            )}

            {submitError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{submitError}</p>
            ) : null}

            {/* ── Desktop nav (inside card) ─────────────────────── */}
            <div className="mt-8 hidden items-center justify-between border-t border-gray-200 pt-6 sm:flex">
              <Button
                type="button"
                variant="outline"
                onPress={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700"
              >
                Retour
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  isDisabled={!canGoNext}
                  onPress={() => setStep((prev) => Math.min(4, prev + 1))}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 disabled:opacity-50"
                >
                  Continuer
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

      {/* ── Mobile sticky bottom bar ──────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="flex-shrink-0 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            Retour
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 disabled:opacity-50 active:opacity-90"
            >
              Continuer
            </button>
          ) : (
            <button
              type="submit"
              form="assurance-form"
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
