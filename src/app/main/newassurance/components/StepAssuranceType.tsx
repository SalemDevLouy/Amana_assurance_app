import { Button } from "@heroui/react";
import { AssuranceType } from "../types";

type StepAssuranceTypeProps = Readonly<{
  assuranceType: AssuranceType;
  basePrice: { car: number; farmer: number };
  setAssuranceType: (type: AssuranceType) => void;
  setStep: (step: number) => void;
}>;

export default function StepAssuranceType({
  assuranceType,
  basePrice,
  setAssuranceType,
  setStep,
}: StepAssuranceTypeProps) {
  const handleSelectType = (type: AssuranceType) => {
    setAssuranceType(type);
    // Go to step 2 for both car and farmer
    setStep(2);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800">
        1. Type d&apos;assurance
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Selectionnez le type de contrat que vous souhaitez.
      </p>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <Button
          onPress={() => handleSelectType("car")}
        >
          Car Assurance
        </Button>

        <Button
          onPress={() => handleSelectType("farmer")}
        >
          Farmer Assurance (Agricole)
        </Button>
      </div>

      {/* Dynamic content */}
      {assuranceType === "car" && (
        <div className="mt-4">
          <p className="font-medium">Car Assurance</p>
          <p className="text-sm text-gray-500">
            Base: {basePrice.car} DZD
          </p>
        </div>
      )}

      {assuranceType === "farmer" && (
        <div className="mt-4">
          <p className="font-medium">
            Farmer Assurance (Agricole)
          </p>
          <p className="text-sm text-gray-500">
            Base: {basePrice.farmer} DZD
          </p>
        </div>
      )}

      {assuranceType === "" && (
        <p className="mt-3 text-xs text-amber-600">
          Veuillez selectionner un type d&apos;assurance pour continuer.
        </p>
      )}
    </div>
  );
}