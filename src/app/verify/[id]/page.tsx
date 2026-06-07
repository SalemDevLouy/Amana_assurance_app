import Link from "next/link";
import {
  FaShieldAlt, FaCheckCircle, FaTimesCircle, FaCar,
  FaUser, FaCalendarAlt, FaIdCard,
} from "react-icons/fa";
import prisma from "@/lib/db";

const COVERAGE: Record<string, string> = {
  third_party:   "Tiers",
  full_coverage: "Tous Risques",
  commercial:    "Commercial",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-DZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contract = await prisma.contract.findUnique({
    where: { contractNumber: id },
  });

  const contractUser = contract
    ? await prisma.user.findUnique({ where: { id: contract.userId }, select: { name: true } })
    : null;

  const verifiedAt = new Date().toLocaleString("fr-DZ", {
    dateStyle: "long", timeStyle: "short",
  });

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <FaTimesCircle className="text-red-500 text-3xl" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Contrat introuvable</p>
          <h1 className="text-xl font-extrabold text-gray-800 mb-3">
            Aucun contrat correspondant à <span className="font-mono text-red-600">{id}</span>
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Ce QR code ne correspond à aucun contrat enregistré dans notre système. Il est peut-être invalide ou falsifié.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 mb-6">
            Si vous pensez qu'il s'agit d'une erreur, contactez votre agence Amaneka.
          </div>
          <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = contract.status === "APPROUVE";
  const validFrom = contract.createdAt.toISOString().split("T")[0];
  const validTo = new Date(contract.createdAt.getTime() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const isValid = isApproved && new Date(validTo) >= new Date();

  const insuredName = contractUser?.name ?? "—";
  const coverage = COVERAGE[contract.assuranceType] ?? contract.assuranceType;

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-5">

        {/* Status banner */}
        <div className={`rounded-3xl p-6 text-center shadow-lg ${isValid ? "bg-emerald-600" : "bg-amber-500"}`}>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            {isValid
              ? <FaCheckCircle className="text-white text-3xl" />
              : <FaTimesCircle className="text-white text-3xl" />}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">
            {isValid ? "Contrat vérifié" : "Contrat non valide"}
          </p>
          <h1 className="text-2xl font-extrabold text-white">
            {isValid ? "Couverture active et authentique" : "Ce contrat n'est pas en vigueur"}
          </h1>
          <p className="text-xs text-white/70 mt-2">Vérifié le {verifiedAt}</p>
        </div>

        {/* Contract details card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <FaShieldAlt className="text-white text-sm" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Amaneka Assurance</p>
              <p className="text-[10px] text-gray-400">Attestation d'assurance automobile</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">N° Contrat</p>
              <p className="text-sm font-black font-mono text-gray-800">{contract.contractNumber}</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <Row icon={<FaUser className="text-blue-500" />} label="Assuré">
              <p className="text-sm font-bold text-gray-800">{insuredName}</p>
            </Row>

            <Row icon={<FaCar className="text-cyan-500" />} label="Véhicule">
              <p className="text-sm font-bold text-gray-800">{contract.brand} {contract.model}</p>
              <p className="text-[10px] font-mono text-gray-400">Plaque: {contract.registration}</p>
            </Row>

            <Row icon={<FaShieldAlt className="text-emerald-500" />} label="Couverture">
              <p className="text-sm font-bold text-gray-800">{coverage}</p>
            </Row>

            <Row icon={<FaCalendarAlt className="text-violet-500" />} label="Validité">
              <p className="text-sm font-bold text-gray-800">
                {fmt(validFrom)} → {fmt(validTo)}
              </p>
            </Row>

            <Row icon={<FaIdCard className="text-gray-400" />} label="Agence">
              <p className="text-sm font-bold text-gray-800">Amaneka Alger Centre</p>
            </Row>
          </div>

          <div className="px-6 pb-5">
            <div className={`rounded-2xl p-3 text-xs font-medium ${isValid ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
              {isValid
                ? "✓ Ce document est authentique. La couverture est active à la date de vérification."
                : "⚠ Ce contrat n'est pas en vigueur actuellement. Il peut être en attente de validation ou expiré."}
            </div>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500" />
        </div>

        <p className="text-center text-xs text-gray-400">
          Vérification fournie par <span className="font-bold text-blue-600">Amaneka Assurance</span>
        </p>
      </div>
    </div>
  );
}

function Row({
  icon, label, children,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-xs">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}
