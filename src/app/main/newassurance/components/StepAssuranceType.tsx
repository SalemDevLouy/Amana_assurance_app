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
    setStep(2);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">
        1. Type d&apos;assurance
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Selectionnez le type de contrat que vous souhaitez.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSelectType("car")}
          className={`rounded-2xl border p-5 text-left transition-all ${
            assuranceType === "car"
              ? "border-cyan-300 bg-cyan-50 shadow-md shadow-cyan-100"
              : "border-gray-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/40"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Auto</p>
          <p className="mt-2 text-lg font-bold text-gray-800">Car Assurance</p>
          <p className="mt-1 text-sm text-gray-600">Protection complete pour vehicules particuliers.</p>
          <p className="mt-3 text-sm font-semibold text-cyan-800">Base: {basePrice.car} DZD</p>
        </button>

        <button
          type="button"
          onClick={() => handleSelectType("farmer")}
          className={`rounded-2xl border p-5 text-left transition-all ${
            assuranceType === "farmer"
              ? "border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-100"
              : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Agricole</p>
          <p className="mt-2 text-lg font-bold text-gray-800">Farmer Assurance</p>
          <p className="mt-1 text-sm text-gray-600">Couverture du materiel, activite et production agricole.</p>
          <p className="mt-3 text-sm font-semibold text-emerald-800">Base: {basePrice.farmer} DZD</p>
        </button>
      </div>

      {assuranceType !== "" && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          Type selectionne: <span className="font-semibold">{assuranceType === "car" ? "Assurance automobile" : "Assurance agricole"}</span>
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