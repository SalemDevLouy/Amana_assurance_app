import { FaShieldAlt, FaStar, FaTruck } from "react-icons/fa";
import { AssuranceType } from "../types";

type CoverageOption = {
  key: AssuranceType;
  apiType: "car";
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  includes: string[];
  color: string;
  selectedBorder: string;
  selectedBg: string;
};

const coverageOptions: CoverageOption[] = [
  {
    key: "third_party",
    apiType: "car",
    icon: FaShieldAlt,
    badge: "Urban",
    badgeColor: "bg-slate-100 text-slate-600",
    title: "Urban Pack (Short Distances)",
    description:
      "Why pay for full coverage if you drive less? Ideal for short-distance urban drivers; a reduced base premium calculated by kilometers, offering savings of 20–25% versus traditional insurance.",
    includes: [
      "Kilometer-based reduced premium",
      "Average 20–25% savings",
      "Third-party liability coverage",
    ],
    color: "text-slate-600",
    selectedBorder: "border-slate-400",
    selectedBg: "bg-slate-50",
  },
  {
    key: "full_coverage",
    apiType: "car",
    icon: FaStar,
    badge: "Flexible",
    badgeColor: "bg-blue-100 text-blue-700",
    title: "Flexible Pack",
    description:
      "Insurance that adapts to your mobility — a flexible plan with a premium that adjusts to your needs and usage level, providing tailored protection as driving patterns change.",
    includes: [
      "Adjustable premium based on usage",
      "Optional add-on coverages",
      "Protection for varied driving patterns",
    ],
    color: "text-blue-600",
    selectedBorder: "border-blue-400",
    selectedBg: "bg-blue-50",
  },
  {
    key: "commercial",
    apiType: "car",
    icon: FaTruck,
    badge: "Professional",
    badgeColor: "bg-indigo-100 text-indigo-700",
    title: "Professional Pack",
    description:
      "Insurance that protects your livelihood — enhanced coverage for high-frequency vehicle use with added benefits like priority access to maintenance and service to minimize downtime and protect your income.",
    includes: [
      "Enhanced commercial coverage",
      "Priority maintenance & service",
      "Business interruption protection",
      "Extended mileage support",
    ],
    color: "text-indigo-600",
    selectedBorder: "border-indigo-400",
    selectedBg: "bg-indigo-50",
  },
];

type StepAssuranceTypeProps = Readonly<{
  assuranceType: AssuranceType;
  basePrice: Record<string, number>;
  setAssuranceType: (type: AssuranceType) => void;
  setStep: (step: number) => void;
}>;

export default function StepAssuranceType({
  assuranceType,
  basePrice,
  setAssuranceType,
  setStep,
}: StepAssuranceTypeProps) {
  const handleSelect = (key: AssuranceType) => {
    setAssuranceType(key);
    setTimeout(() => setStep(2), 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-800">Choose Your Coverage</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select the insurance type that best suits your vehicle and needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {coverageOptions.map((opt) => {
          const isSelected = assuranceType === opt.key;
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
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isSelected ? opt.selectedBg : "bg-gray-100"}`}>
                  <opt.icon className={`text-base ${isSelected ? opt.color : "text-gray-400"}`} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
              </div>

              <p className={`text-base font-extrabold mb-1.5 ${isSelected ? opt.color : "text-gray-800"}`}>{opt.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{opt.description}</p>

              <ul className="space-y-1.5 mb-4">
                {opt.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? opt.color.replace("text-", "bg-") : "bg-gray-300"}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <p className={`text-sm font-bold ${isSelected ? opt.color : "text-gray-500"}`}>
                From {basePrice["car"] ?? 500} DA/yr
              </p>
            </button>
          );
        })}
      </div>

      {assuranceType === "" && (
        <p className="text-xs text-amber-600 font-medium">
          Please select a coverage type to continue.
        </p>
      )}
    </div>
  );
}
