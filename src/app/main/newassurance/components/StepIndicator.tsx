import { Card } from "@heroui/react";

type StepIndicatorProps = Readonly<{
  step: number;
}>;

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
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
  );
}
