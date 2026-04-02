import { Card } from "@heroui/react";

type StepIndicatorProps = Readonly<{
  step: number;
}>;

export default function StepIndicator({ step }: StepIndicatorProps) {
  const labels = ["Type", "Infos", "Garanties", "Paiement"];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[1, 2, 3, 4].map((item, index) => {
        let cardStateClass = "border-gray-200 bg-white text-gray-500";

        if (step === item) {
          cardStateClass = "border-cyan-300 bg-cyan-50 text-cyan-900 shadow-sm";
        } else if (step > item) {
          cardStateClass = "border-emerald-200 bg-emerald-50 text-emerald-800";
        }

        return (
          <Card
            key={item}
            className={`rounded-2xl border px-3 py-3 text-left text-sm font-medium transition-all ${cardStateClass}`}
          >
            <p className="text-[11px] uppercase tracking-[0.2em]">Etape {item}</p>
            <p className="mt-1 text-sm font-bold">{labels[index]}</p>
          </Card>
        );
      })}
    </div>
  );
}
