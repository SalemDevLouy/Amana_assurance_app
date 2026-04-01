import { Card } from "@heroui/react";

type SubmissionSuccessProps = Readonly<{
  totalCost: number;
}>;

export default function SubmissionSuccess({ totalCost }: SubmissionSuccessProps) {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
      <Card className="border border-emerald-200 bg-emerald-50">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-700">Demande envoyee</h1>
          <p className="mt-3 text-sm text-emerald-800">
            Votre demande d&apos;assurance a ete enregistree avec succes.
          </p>
          <p className="mt-2 text-sm text-emerald-800">
            Cout total: <span className="font-semibold">{totalCost} DZD</span>
          </p>
        </div>
      </Card>
    </section>
  );
}
