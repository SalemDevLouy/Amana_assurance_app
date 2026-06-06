"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import {
  FaShieldAlt, FaArrowLeft, FaDownload, FaCar, FaUser,
  FaCalendarAlt, FaIdCard, FaCheckCircle, FaClock, FaTimesCircle,
} from "react-icons/fa";

type ApiContract = {
  id: string;
  contractNumber: string;
  status: "EN_ATTENTE" | "APPROUVE" | "REFUSE" | "EXPIRE";
  assuranceType: string;
  brand: string;
  model: string;
  registration: string;
  firstRegistrationDate: string;
  totalCost: number;
  createdAt: string;
};

type DisplayContract = {
  id: string;
  insuredName: string;
  insuredId: string;
  vehicle: string;
  year: string;
  plate: string;
  coverage: string;
  coverageEn: string;
  premium: string;
  validFrom: string;
  validTo: string;
  agency: string;
  status: "Active" | "Pending" | "Expired";
  phone: string;
};

const COVERAGE_LABELS: Record<string, { fr: string; en: string }> = {
  third_party:   { fr: "Tiers",        en: "Third-Party" },
  full_coverage: { fr: "Tous Risques", en: "Full Coverage" },
  commercial:    { fr: "Commercial",   en: "Commercial" },
};

const STATUS_MAP: Record<string, "Active" | "Pending" | "Expired"> = {
  APPROUVE:   "Active",
  EN_ATTENTE: "Pending",
  REFUSE:     "Expired",
  EXPIRE:     "Expired",
};

function toDisplayContract(c: ApiContract, userName: string): DisplayContract {
  const cov = COVERAGE_LABELS[c.assuranceType] ?? { fr: c.assuranceType, en: c.assuranceType };
  const validFrom = c.createdAt.split("T")[0];
  const validTo = new Date(new Date(c.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return {
    id: c.contractNumber,
    insuredName: userName,
    insuredId: `DZ-${c.contractNumber.slice(-6)}`,
    vehicle: `${c.brand} ${c.model}`,
    year: c.firstRegistrationDate ? c.firstRegistrationDate.slice(0, 4) : "",
    plate: c.registration,
    coverage: cov.fr,
    coverageEn: cov.en,
    premium: `${c.totalCost.toLocaleString("fr-DZ")} DA/an`,
    validFrom,
    validTo,
    agency: "Amanatek Alger Centre",
    status: STATUS_MAP[c.status] ?? "Pending",
    phone: "+213 555 012 345",
  };
}

const statusCfg = {
  Active:  { label: "Actif",       icon: FaCheckCircle,  cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Pending: { label: "En attente",  icon: FaClock,        cls: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  Expired: { label: "Expiré",      icon: FaTimesCircle,  cls: "bg-gray-100 text-gray-500",       dot: "bg-gray-400" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-DZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ContractCard({ contract }: { contract: DisplayContract }) {
  const cfg = statusCfg[contract.status];
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/verify/${contract.id}`;

  return (
    <div className="relative w-full bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Amanatek</p>
            <p className="text-[10px] text-gray-400 tracking-wide">Assurance Automobile</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cfg.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
      </div>

      <div className="px-8 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">N° Contrat</p>
        <p className="text-2xl font-black tracking-wide text-gray-900 font-mono">{contract.id}</p>
      </div>

      <div className="px-8 py-4 flex gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaUser className="text-blue-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Assuré</p>
              <p className="text-sm font-bold text-gray-800">{contract.insuredName}</p>
              <p className="text-[10px] text-gray-400 font-mono">{contract.insuredId}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaCar className="text-cyan-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Véhicule</p>
              <p className="text-sm font-bold text-gray-800">{contract.vehicle}{contract.year ? ` — ${contract.year}` : ""}</p>
              <p className="text-[10px] font-mono text-gray-500">Plaque: {contract.plate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaShieldAlt className="text-emerald-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Couverture</p>
              <p className="text-sm font-bold text-gray-800">{contract.coverage}</p>
              <p className="text-[10px] text-gray-400">{contract.coverageEn}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaCalendarAlt className="text-violet-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Période de validité</p>
              <p className="text-sm font-bold text-gray-800">{fmt(contract.validFrom)} → {fmt(contract.validTo)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl border-2 border-gray-100 bg-white shadow-sm">
            <QRCodeSVG value={verifyUrl} size={110} level="H" fgColor="#1e3a8a" bgColor="#ffffff" />
          </div>
          <p className="text-[9px] text-center text-gray-400 font-medium max-w-[120px] leading-tight">
            Scanner pour vérifier l'authenticité
          </p>
        </div>
      </div>

      <div className="mx-8 border-t border-dashed border-gray-200" />

      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaIdCard className="text-gray-300 text-sm" />
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Agence</p>
            <p className="text-[10px] font-bold text-gray-600">{contract.agency}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Prime annuelle</p>
          <p className="text-sm font-black text-blue-700">{contract.premium}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Contact</p>
          <p className="text-[10px] font-bold text-gray-600">{contract.phone}</p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500" />
    </div>
  );
}

function PrintableCard({ contract }: { contract: DisplayContract }) {
  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <ContractCard contract={contract} />
      </div>
      <p className="mt-6 text-[9px] text-gray-400 text-center">
        Document généré par Amanatek — {new Date().toLocaleDateString("fr-DZ")} — amanatek.dz
      </p>
    </div>
  );
}

export default function ContractPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<DisplayContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/contracts");
        const data = (await res.json()) as { contracts?: ApiContract[]; error?: string };
        if (!res.ok || !data.contracts) return;
        const userName = session?.user?.name ?? "—";
        if (!cancelled) {
          setContracts(data.contracts.map((c) => toDisplayContract(c, userName)));
          setSelected(0);
        }
      } catch { /* ignore */ } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [session?.user?.name]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: contracts[selected] ? `Contrat-${contracts[selected].id}` : "Contrat",
    pageStyle: `@page { size: A4; margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] pt-24 flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Chargement de vos contrats…</p>
      </div>
    );
  }

  if (!contracts.length) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/main/services/automobile" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <FaArrowLeft className="text-xs" /> Retour
          </Link>
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
            <FaShieldAlt className="text-4xl text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-600 mb-1">Aucun contrat trouvé</p>
            <p className="text-xs text-gray-400 mb-6">Souscrivez à votre première assurance automobile.</p>
            <Link href="/main/newassurance" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md">
              Nouveau contrat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const contract = contracts[selected];

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <Link href="/main/services/automobile" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <FaArrowLeft className="text-xs" /> Retour au tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Carte d'assurance digitale</h1>
              <p className="text-sm text-gray-500">Téléchargez ou imprimez votre attestation.</p>
            </div>
            <button
              type="button"
              onClick={() => handlePrint()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              <FaDownload className="text-xs" />
              Télécharger PDF
            </button>
          </div>
        </div>

        {contracts.length > 1 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
            {contracts.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(i)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  selected === i ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                {c.id} — {c.vehicle}
              </button>
            ))}
          </div>
        )}

        <div className="mb-6">
          <ContractCard contract={contract} />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <FaShieldAlt className="text-blue-400 text-sm shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Ce document fait foi de votre couverture d'assurance. Le QR code permet à tout agent ou tiers de vérifier l'authenticité et la validité de votre contrat en temps réel.
          </p>
        </div>
      </div>

      <div className="hidden">
        <div ref={printRef}>
          {contract && <PrintableCard contract={contract} />}
        </div>
      </div>
    </div>
  );
}
