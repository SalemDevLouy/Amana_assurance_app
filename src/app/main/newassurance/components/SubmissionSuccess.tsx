import { Card } from "@heroui/react";

type SubmissionSuccessProps = Readonly<{
  totalCost: number;
}>;

export default function SubmissionSuccess({ totalCost }: SubmissionSuccessProps) {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
      <Card className="overflow-hidden border border-emerald-300 bg-white shadow-2xl shadow-emerald-100">
        <div className="h-2 bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500" />
        <div className="p-8 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Confirmation</p>
          <h1 className="mt-2 text-2xl font-bold text-emerald-700">Demande envoyee</h1>
          <p className="mt-3 text-sm text-emerald-800">
            Votre demande d&apos;assurance a ete enregistree avec succes.
          </p>
          <p className="mt-2 text-sm font-medium text-emerald-900">
            Cout total: <span className="font-semibold">{totalCost} DZD</span>
          </p>
        </div>
      </Card>
    </section>
  );
}
