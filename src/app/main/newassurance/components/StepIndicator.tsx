type StepIndicatorProps = Readonly<{ step: number }>;

const STEPS = ["Couverture", "Véhicule", "Garanties", "Paiement"];

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      {/* ── Mobile: dot trail + label ────────────────────────────── */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const done   = step > num;
            const active = step === num;
            return (
              <div key={num} className="flex items-center">
                {/* dot */}
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold transition-all ${
                  done   ? "bg-emerald-500 text-white shadow-sm shadow-emerald-400/40"
                  : active ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 scale-110"
                           : "bg-gray-200 text-gray-400"
                }`}>
                  {done ? "✓" : num}
                </div>
                {/* connector */}
                {i < STEPS.length - 1 && (
                  <div className={`h-[2px] w-8 rounded-full transition-all ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2.5 text-center text-xs font-semibold text-gray-500">
          Étape {step} sur {STEPS.length} :{" "}
          <span className="font-bold text-blue-600">{STEPS[step - 1]}</span>
        </p>
      </div>

      {/* ── Desktop: card grid ───────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-4 sm:gap-3">
        {STEPS.map((label, i) => {
          const num    = i + 1;
          const done   = step > num;
          const active = step === num;
          return (
            <div
              key={num}
              className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                active ? "border-blue-300 bg-blue-50 shadow-sm"
                : done  ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-white"
              }`}
            >
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${
                active ? "text-blue-500" : done ? "text-emerald-600" : "text-gray-400"
              }`}>
                {done ? "✓ Terminé" : `Étape ${num}`}
              </p>
              <p className={`text-sm font-bold ${
                active ? "text-blue-800" : done ? "text-emerald-800" : "text-gray-500"
              }`}>
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
