import { Card } from "@heroui/react";

type SubmissionSuccessProps = Readonly<{
  totalCost: number;
  contractNumber: string | null;
}>;

export default function SubmissionSuccess({ totalCost, contractNumber }: SubmissionSuccessProps) {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
      <Card className="overflow-hidden border border-emerald-300 bg-white shadow-2xl shadow-emerald-100">
        <div className="h-2 bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500" />
        <div className="p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-3xl">✓</div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Submitted Successfully</p>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Your Insurance Request is In!</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
            Your auto insurance application has been received. Our team will review your documents and contact you shortly to finalize your contract.
          </p>
          {contractNumber ? (
            <p className="mt-2 mb-3 inline-block rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              N° de contrat : {contractNumber}
            </p>
          ) : null}
          <p className="text-base font-bold text-emerald-700">
            Total Premium: <span className="text-emerald-800">{totalCost.toLocaleString()} DA/yr</span>
          </p>
        </div>
      </Card>
    </section>
  );
}
