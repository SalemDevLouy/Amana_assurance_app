type StepIndicatorProps = Readonly<{ step: number }>;

const steps = ["Coverage Type", "Vehicle Info", "Guarantees", "Payment"];

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((label, index) => {
        const num = index + 1;
        const isDone = step > num;
        const isActive = step === num;
        return (
          <div
            key={num}
            className={`rounded-2xl border px-4 py-3 text-left transition-all ${
              isActive ? "border-blue-300 bg-blue-50 shadow-sm" : isDone ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
              isActive ? "text-blue-500" : isDone ? "text-emerald-600" : "text-gray-400"
            }`}>
              {isDone ? "✓ Done" : `Step ${num}`}
            </p>
            <p className={`text-sm font-bold ${
              isActive ? "text-blue-800" : isDone ? "text-emerald-800" : "text-gray-500"
            }`}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
