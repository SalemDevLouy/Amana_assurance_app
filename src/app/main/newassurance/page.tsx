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
import { DEFAULT_GUARANTEE_CATALOG } from "./constants";

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
  const [payment] = useState<PaymentInfo>({
    fullName: "",
    email: "",
    phone: "",
    method: "card",
    acceptTerms: false,
  });

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
          console.debug("Loaded guarantees from cache:", cachedGroups);
          setGuaranteesLoading(false);
          return;
        }

        // Load guarantees from local static catalog instead of calling the API
        const apiType = assuranceType ? COVERAGE_TO_API_TYPE[assuranceType] : "car";
        const seedGroups = DEFAULT_GUARANTEE_CATALOG[apiType] ?? DEFAULT_GUARANTEE_CATALOG.car;

        // Map seed groups to the GuaranteeGroup shape expected by the UI (add ids)
        const mappedGroups: GuaranteeGroup[] = seedGroups.map((g, gi) => ({
          key: g.key,
          title: g.title,
          description: g.description,
          inputType: g.inputType,
          mandatory: !!g.mandatory,
          options: g.options.map((opt, oi) => ({
            id: `${g.key}--${opt.key}`,
            key: opt.key,
            label: opt.label,
            price: opt.price,
          })),
        }));

        if (isCancelled) return;

        setGuaranteeGroups(mappedGroups);
        writeGuaranteesCache(cacheKey, mappedGroups);
        setGuaranteeSelections(getInitialSelections(mappedGroups));
        console.debug("Loaded guarantees from local catalog:", mappedGroups);
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

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return assuranceType !== "";
    }

    if (step === 2) {
      return (
        carInfo.brand.trim() !== "" &&
        carInfo.model.trim() !== "" &&
        carInfo.version.trim() !== "" &&
        carInfo.horsepower.trim() !== "" &&
        carInfo.energy.trim() !== "" &&
        carInfo.seats.trim() !== "" &&
        carInfo.parking.trim() !== "" &&
        carInfo.registration.trim() !== "" &&
        carInfo.chassisNumber.trim() !== "" &&
        carInfo.firstRegistrationDate.trim() !== "" &&
        carInfo.marketValue.trim() !== "" &&
        carInfo.usage.trim() !== "" &&
        carInfo.circulationZone.trim() !== "" &&
        carInfo.insuredCapital.trim() !== "" &&
        carInfo.mileage.trim() !== "" &&
        carInfo.estimatedKmPerYear.trim() !== "" &&
        carInfo.technicalCertificate.trim() !== "" &&
        vehiclePhotos.length >= 4 &&
        chassisPhoto !== null &&
        platePhoto !== null &&
        odometerPhoto !== null
      );
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
    carInfo,
    chassisPhoto,
    odometerPhoto,
    payment,
    platePhoto,
    step,
    guaranteeGroups.length,
    guaranteesLoading,
    vehiclePhotos.length,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canGoNext) {
      return;
    }
    setSubmitted(true);
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
    return <SubmissionSuccess totalCost={totalCost} />;
  }

  return (
    <section className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 py-10 pt-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)]" />

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-lg md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">New Insurance Contract</p>
        <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
          Subscribe to Auto Insurance
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete 4 steps: choose coverage → vehicle details → select options → payment & contract.
        </p>
      </div>

      <div className="relative">
        <StepIndicator step={step} />
      </div>

      <Card className="relative rounded-3xl border border-cyan-200 bg-white/85 shadow-2xl shadow-blue-100">
        <div className="p-5 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit}>
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
                canGoNext={canGoNext}
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

            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <Button
                type="button"
                variant="outline"
                onPress={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700"
              >
                Back
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onPress={() => setStep((prev) => Math.min(4, prev + 1))}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25"
                >
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="secondary" className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25">
                  Confirm & Pay
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
