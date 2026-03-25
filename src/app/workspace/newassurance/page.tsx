"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";

type AssuranceType = "" | "car" | "farmer";
type PaymentMethod = "card" | "transfer" | "cash";

type GuaranteeOption = {
  id: string;
  label: string;
  price: number;
};

const MANDATORY_GUARANTEE: GuaranteeOption = {
  id: "civil-liability",
  label: "Responsabilite civile (obligatoire)",
  price: 0,
};

const OPTIONAL_SIMPLE_GUARANTEES: GuaranteeOption[] = [
  { id: "defense-recourse", label: "Defense et recours", price: 0 },
  { id: "rachat-vetuste-franchise", label: "Rachat de vetuste et de franchise", price: 0 },
  { id: "loss-of-use", label: "Perte de jouissance ou d'exploitation", price: 0 },
  { id: "transported-people", label: "Personnes transportees", price: 0 },
];

const GLASS_GUARANTEES: GuaranteeOption[] = [
  { id: "none", label: "Aucune", price: 0 },
  { id: "glass-standard", label: "Bris de glace", price: 0 },
  { id: "glass-panoramic", label: "Bris de glace panoramique", price: 0 },
];

const THEFT_FIRE_GUARANTEES: GuaranteeOption[] = [
  { id: "none", label: "Aucune", price: 0 },
  { id: "theft-fire-vehicle-value", label: "Vol & Incendie Valeur vehicule", price: 0 },
  { id: "theft-fire-100000", label: "Vol & Incendie 100.000 DA", price: 0 },
  { id: "theft-fire-200000", label: "Vol & Incendie 200.000 DA", price: 0 },
  { id: "theft-fire-300000", label: "Vol & Incendie 300.000 DA", price: 0 },
  { id: "theft-fire-400000", label: "Vol & Incendie 400.000 DA", price: 0 },
  { id: "theft-fire-500000", label: "Vol & Incendie 500.000 DA", price: 0 },
  { id: "theft-fire-600000", label: "Vol & Incendie 600.000 DA", price: 0 },
  { id: "theft-fire-700000", label: "Vol & Incendie 700.000 DA", price: 0 },
  { id: "theft-fire-800000", label: "Vol & Incendie 800.000 DA", price: 0 },
  { id: "theft-fire-900000", label: "Vol & Incendie 900.000 DA", price: 0 },
  { id: "theft-fire-1000000", label: "Vol & Incendie 1.000.000 DA", price: 0 },
];

const COLLISION_GUARANTEES: GuaranteeOption[] = [
  { id: "none", label: "Aucune", price: 0 },
  { id: "collision-vehicle-value", label: "Dommages Collision Valeur vehicule", price: 0 },
  { id: "collision-10000", label: "Dommages Collision 10.000 DA", price: 0 },
  { id: "collision-20000", label: "Dommages Collision 20.000 DA", price: 0 },
  { id: "collision-30000", label: "Dommages Collision 30.000 DA", price: 0 },
  { id: "collision-40000", label: "Dommages Collision 40.000 DA", price: 0 },
  { id: "collision-50000", label: "Dommages Collision 50.000 DA", price: 0 },
];

const ASSISTANCE_GUARANTEES: GuaranteeOption[] = [
  { id: "none", label: "Aucune", price: 0 },
  { id: "assist-basic", label: "Assistance Basique (70 km)", price: 500 },
  { id: "assist-classic", label: "Assistance Classique", price: 1150 },
  { id: "assist-silver", label: "Assistance Silver (500 km)", price: 2500 },
  { id: "assist-gold", label: "Assistance Gold", price: 6000 },
  { id: "assist-platinum", label: "Assistance Platinum (1 500 km)", price: 6400 },
  { id: "assist-truck", label: "Assistance Truck (vehicules lourds)", price: 0 },
];

const BASE_PRICE: Record<Exclude<AssuranceType, "">, number> = {
  car: 500,
  farmer: 650,
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [assuranceType, setAssuranceType] = useState<AssuranceType>("");
  const [carInfo, setCarInfo] = useState({
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
  const [selectedSimpleGuarantees, setSelectedSimpleGuarantees] = useState<string[]>([]);
  const [selectedGlassGuarantee, setSelectedGlassGuarantee] = useState("none");
  const [selectedTheftFireGuarantee, setSelectedTheftFireGuarantee] = useState("none");
  const [selectedCollisionGuarantee, setSelectedCollisionGuarantee] = useState("none");
  const [selectedAssistanceGuarantee, setSelectedAssistanceGuarantee] = useState("none");
  const [payment, setPayment] = useState({
    fullName: "",
    email: "",
    phone: "",
    method: "card" as PaymentMethod,
    acceptTerms: false,
  });

  const optionsTotal = useMemo(() => {
    const simpleTotal = selectedSimpleGuarantees.reduce((sum, optionId) => {
      const option = OPTIONAL_SIMPLE_GUARANTEES.find((item) => item.id === optionId);
      return sum + (option?.price ?? 0);
    }, 0);

    const glassPrice = GLASS_GUARANTEES.find((item) => item.id === selectedGlassGuarantee)?.price ?? 0;
    const theftFirePrice =
      THEFT_FIRE_GUARANTEES.find((item) => item.id === selectedTheftFireGuarantee)?.price ?? 0;
    const collisionPrice =
      COLLISION_GUARANTEES.find((item) => item.id === selectedCollisionGuarantee)?.price ?? 0;
    const assistancePrice =
      ASSISTANCE_GUARANTEES.find((item) => item.id === selectedAssistanceGuarantee)?.price ?? 0;

    return simpleTotal + glassPrice + theftFirePrice + collisionPrice + assistancePrice;
  }, [
    selectedAssistanceGuarantee,
    selectedCollisionGuarantee,
    selectedGlassGuarantee,
    selectedSimpleGuarantees,
    selectedTheftFireGuarantee,
  ]);

  const selectedGuaranteesSummary = useMemo(() => {
    const summary: GuaranteeOption[] = [MANDATORY_GUARANTEE];

    selectedSimpleGuarantees.forEach((id) => {
      const option = OPTIONAL_SIMPLE_GUARANTEES.find((item) => item.id === id);
      if (option) {
        summary.push(option);
      }
    });

    const glass = GLASS_GUARANTEES.find((item) => item.id === selectedGlassGuarantee);
    if (glass && glass.id !== "none") {
      summary.push(glass);
    }

    const theftFire = THEFT_FIRE_GUARANTEES.find((item) => item.id === selectedTheftFireGuarantee);
    if (theftFire && theftFire.id !== "none") {
      summary.push(theftFire);
    }

    const collision = COLLISION_GUARANTEES.find((item) => item.id === selectedCollisionGuarantee);
    if (collision && collision.id !== "none") {
      summary.push(collision);
    }

    const assistance = ASSISTANCE_GUARANTEES.find((item) => item.id === selectedAssistanceGuarantee);
    if (assistance && assistance.id !== "none") {
      summary.push(assistance);
    }

    return summary;
  }, [
    selectedAssistanceGuarantee,
    selectedCollisionGuarantee,
    selectedGlassGuarantee,
    selectedSimpleGuarantees,
    selectedTheftFireGuarantee,
  ]);

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
      return true;
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
    vehiclePhotos.length,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canGoNext) {
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <Card className="border border-emerald-200 bg-emerald-50">
          <CardBody className="p-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-700">Demande envoyee</h1>
            <p className="mt-3 text-sm text-emerald-800">
              Votre demande d&apos;assurance a ete enregistree avec succes.
            </p>
            <p className="mt-2 text-sm text-emerald-800">
              Cout total: <span className="font-semibold">{totalCost} MAD</span>
            </p>
          </CardBody>
        </Card>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 py-10 pt-24 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
          Nouveau contrat d&apos;assurance
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Completez les 4 etapes: type, informations du vehicule, personnalisation,
          puis paiement.
        </p>
      </div>

      <Progress
        aria-label="Progression des etapes"
        value={(step / 4) * 100}
        className="mb-8"
        color="primary"
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card
            key={item}
            className={`rounded-lg border px-3 py-2 text-center text-sm font-medium ${
              step === item
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            Etape {item}
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border border-gray-200 bg-white">
        <CardBody className="p-5 sm:p-8">
          <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">1. Type d&apos;assurance</h2>
            <p className="mt-1 text-sm text-gray-500">
              Selectionnez le type de contrat que vous souhaitez.
            </p>

            <RadioGroup
              value={assuranceType}
              onValueChange={(value) => setAssuranceType(value as AssuranceType)}
              className="mt-5"
            >
              <Card className="border border-gray-200">
                <CardBody>
                  <Radio value="car">Car Assurance - Base: {BASE_PRICE.car} MAD</Radio>
                </CardBody>
              </Card>
              <Card className="mt-3 border border-gray-200">
                <CardBody>
                  <Radio value="farmer">Farmer Assurance - Base: {BASE_PRICE.farmer} MAD</Radio>
                </CardBody>
              </Card>
            </RadioGroup>

            {assuranceType === "" && (
              <p className="mt-3 text-xs text-amber-600">
                Veuillez selectionner un type d&apos;assurance pour continuer.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">2. Informations Vehicule (obligatoire)</h2>
            <p className="mt-1 text-sm text-gray-500">
              Renseignez toutes les donnees obligatoires pour valider le contrat.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="text"
                label="Marque"
                value={carInfo.brand}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, brand: value }))}
                placeholder="Marque"
              />
              <Input
                type="text"
                label="Modele"
                value={carInfo.model}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, model: value }))}
                placeholder="Modele"
              />
              <Input
                type="text"
                label="Version"
                value={carInfo.version}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, version: value }))}
                placeholder="Version du vehicule"
              />
              <Input
                type="number"
                label="Puissance fiscale (CV)"
                value={carInfo.horsepower}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, horsepower: value }))
                }
                placeholder="Ex: 6"
              />
              <Input
                type="text"
                label="Energie"
                value={carInfo.energy}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, energy: value }))
                }
                placeholder="Essence, Diesel, Hybride..."
              />
              <Input
                type="number"
                label="Nombre de places"
                value={carInfo.seats}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, seats: value }))}
                placeholder="Ex: 5"
              />
              <Input
                type="text"
                label="Stationnement"
                value={carInfo.parking}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, parking: value }))}
                placeholder="Garage, rue..."
              />
              <Input
                type="text"
                label="Numero d&apos;immatriculation"
                value={carInfo.registration}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, registration: value }))
                }
                placeholder="Plaque police"
              />
              <Input
                type="text"
                label="Numero de chassis"
                value={carInfo.chassisNumber}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, chassisNumber: value }))
                }
                placeholder="VIN"
              />
              <Input
                type="date"
                label="Date de mise en circulation"
                value={carInfo.firstRegistrationDate}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, firstRegistrationDate: value }))
                }
              />
              <Input
                type="number"
                label="Valeur venale"
                value={carInfo.marketValue}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, marketValue: value }))
                }
                placeholder="Montant en DZD"
              />
              <Input
                type="text"
                label="Usage du vehicule"
                value={carInfo.usage}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, usage: value }))}
                placeholder="Personnel, affaire, auto-ecole..."
              />
              <Input
                type="text"
                label="Zone de circulation"
                value={carInfo.circulationZone}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, circulationZone: value }))
                }
                placeholder="Ville, wilaya, national..."
              />
              <Input
                type="text"
                label="Capital assure"
                value={carInfo.insuredCapital}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, insuredCapital: value }))
                }
                placeholder="100000 DZD, 200000 DZD..."
              />
              <Input
                type="number"
                label="Kilometrage actuel"
                value={carInfo.mileage}
                onValueChange={(value) => setCarInfo((prev) => ({ ...prev, mileage: value }))}
                placeholder="Km"
              />
              <Input
                type="number"
                label="Estimation Km par an"
                value={carInfo.estimatedKmPerYear}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, estimatedKmPerYear: value }))
                }
                placeholder="Km/an"
              />
              <Textarea
                label="Certificat de visite technique"
                value={carInfo.technicalCertificate}
                onValueChange={(value) =>
                  setCarInfo((prev) => ({ ...prev, technicalCertificate: value }))
                }
                placeholder="Redigez le certificat de visite technique..."
                className="sm:col-span-2"
              />
            </div>

            <Card className="mt-6 border border-gray-200 bg-gray-50">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Documents photo obligatoires
              </CardHeader>
              <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  type="file"
                  label="Photos vehicule (4 angles minimum)"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setVehiclePhotos(Array.from(event.target.files ?? []))
                  }
                  className="sm:col-span-2"
                />
                <Input
                  type="file"
                  label="Photo numero de chassis"
                  accept="image/*"
                  onChange={(event) =>
                    setChassisPhoto(event.target.files?.[0] ?? null)
                  }
                />
                <Input
                  type="file"
                  label="Photo plaque d&apos;immatriculation"
                  accept="image/*"
                  onChange={(event) =>
                    setPlatePhoto(event.target.files?.[0] ?? null)
                  }
                />
                <Input
                  type="file"
                  label="Photo compteur"
                  accept="image/*"
                  onChange={(event) =>
                    setOdometerPhoto(event.target.files?.[0] ?? null)
                  }
                />
              </CardBody>
            </Card>

            {!canGoNext && (
              <p className="mt-3 text-xs text-amber-600">
                Tous les champs et documents de l&apos;etape 2 sont obligatoires.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              3. Les garanties Automobile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              La responsabilite civile est obligatoire. Les autres garanties sont facultatives.
            </p>

            <Card className="mt-5 border border-emerald-200 bg-emerald-50">
              <CardBody className="flex flex-row items-center justify-between gap-3">
                <Checkbox isSelected isDisabled>
                  {MANDATORY_GUARANTEE.label}
                </Checkbox>
                <span className="text-sm font-semibold text-gray-800">Obligatoire</span>
              </CardBody>
            </Card>

            <Card className="mt-4 border border-gray-200">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Garanties facultatives
              </CardHeader>
              <CardBody className="pt-2">
                <CheckboxGroup
                  value={selectedSimpleGuarantees}
                  onValueChange={setSelectedSimpleGuarantees}
                >
                  {OPTIONAL_SIMPLE_GUARANTEES.map((option) => (
                    <Checkbox key={option.id} value={option.id}>
                      {option.label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </CardBody>
            </Card>

            <Card className="mt-4 border border-gray-200">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Bris de glace
              </CardHeader>
              <CardBody className="pt-2">
                <RadioGroup
                  value={selectedGlassGuarantee}
                  onValueChange={setSelectedGlassGuarantee}
                >
                  {GLASS_GUARANTEES.map((option) => (
                    <Radio key={option.id} value={option.id}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>

            <Card className="mt-4 border border-gray-200">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Vol et incendie
              </CardHeader>
              <CardBody className="pt-2">
                <RadioGroup
                  value={selectedTheftFireGuarantee}
                  onValueChange={setSelectedTheftFireGuarantee}
                >
                  {THEFT_FIRE_GUARANTEES.map((option) => (
                    <Radio key={option.id} value={option.id}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>

            <Card className="mt-4 border border-gray-200">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Dommages avec ou sans collision
              </CardHeader>
              <CardBody className="pt-2">
                <RadioGroup
                  value={selectedCollisionGuarantee}
                  onValueChange={setSelectedCollisionGuarantee}
                >
                  {COLLISION_GUARANTEES.map((option) => (
                    <Radio key={option.id} value={option.id}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>

            <Card className="mt-4 border border-gray-200">
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">
                Assistance Automobile
              </CardHeader>
              <CardBody className="pt-2">
                <RadioGroup
                  value={selectedAssistanceGuarantee}
                  onValueChange={setSelectedAssistanceGuarantee}
                >
                  {ASSISTANCE_GUARANTEES.map((option) => (
                    <Radio key={option.id} value={option.id}>
                      {option.label}
                      {option.price > 0 ? ` - ${option.price} DA` : ""}
                    </Radio>
                  ))}
                </RadioGroup>
              </CardBody>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">4. Payment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Finalisez votre demande et confirmez le paiement.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="text"
                label="Nom complet"
                value={payment.fullName}
                onValueChange={(value) => setPayment((prev) => ({ ...prev, fullName: value }))}
                placeholder="Nom complet"
              />
              <Input
                type="email"
                label="Email"
                value={payment.email}
                onValueChange={(value) => setPayment((prev) => ({ ...prev, email: value }))}
                placeholder="Email"
              />
              <Input
                type="tel"
                label="Telephone"
                value={payment.phone}
                onValueChange={(value) => setPayment((prev) => ({ ...prev, phone: value }))}
                className="sm:col-span-2"
                placeholder="Telephone"
              />
            </div>

            <Card className="mt-5 border border-gray-200 bg-gray-50">
              <CardHeader className="pb-0 text-sm font-semibold text-gray-700">
                Resume du contrat
              </CardHeader>
              <CardBody className="pt-2">
                <p className="text-sm text-gray-600">Type assurance: {assuranceType || "-"}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Vehicule: {carInfo.brand || "-"} {carInfo.model || "-"} ({carInfo.registration || "-"})
                </p>

                <div className="mt-3 space-y-1">
                  <p className="text-sm font-semibold text-gray-700">Garanties selectionnees (Etape 3)</p>
                  {selectedGuaranteesSummary.map((guarantee) => (
                    <div key={guarantee.id} className="flex items-center justify-between text-sm text-gray-600">
                      <span>{guarantee.label}</span>
                      <span>{guarantee.price > 0 ? `${guarantee.price} DA` : "Inclus"}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm text-gray-600">Base: {basePrice} MAD</p>
                <p className="mt-1 text-sm text-gray-600">Options: {optionsTotal} MAD</p>
                <p className="mt-2 text-base font-bold text-gray-900">Total: {totalCost} MAD</p>
              </CardBody>
            </Card>

            <div className="mt-5 space-y-3">
              <RadioGroup
                label="Methode de paiement"
                value={payment.method}
                onValueChange={(value) =>
                  setPayment((prev) => ({ ...prev, method: value as PaymentMethod }))
                }
                orientation="horizontal"
              >
                <Radio value="card">Carte bancaire</Radio>
                <Radio value="transfer">Virement</Radio>
                <Radio value="cash">Especes</Radio>
              </RadioGroup>

              <Checkbox
                isSelected={payment.acceptTerms}
                onValueChange={(checked) =>
                  setPayment((prev) => ({ ...prev, acceptTerms: checked }))
                }
              >
                J&apos;accepte les conditions generales du contrat.
              </Checkbox>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
          <Button
            type="button"
            variant="bordered"
            disabled={step === 1}
            onPress={() => setStep((prev) => Math.max(1, prev - 1))}
          >
            Retour
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              color="primary"
              disabled={!canGoNext}
              onPress={() => setStep((prev) => Math.min(4, prev + 1))}
            >
              Continuer
            </Button>
          ) : (
            <Button
              type="submit"
              color="success"
              disabled={!canGoNext}
            >
              Confirmer et payer
            </Button>
          )}
        </div>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
