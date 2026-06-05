"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import {
  FaShieldAlt, FaArrowLeft, FaDownload, FaCar, FaUser,
  FaCalendarAlt, FaIdCard, FaCheckCircle, FaClock, FaTimesCircle,
} from "react-icons/fa";

// ── Mock data (replace with real API later) ────────────────────────────────────
const CONTRACTS = [
  {
    id: "AMT-2026-001",
    insuredName: "Salem Louafi",
    insuredId: "DZ-09-2026-001",
    vehicle: "Peugeot 208",
    year: "2021",
    plate: "123-456-16",
    coverage: "Tous Risques",
    coverageEn: "Full Coverage",
    premium: "18 500 DA/an",
    validFrom: "2026-03-15",
    validTo: "2027-03-15",
    agency: "Amana Alger Centre",
    status: "Active" as const,
    phone: "+213 555 012 345",
  },
  {
    id: "AMT-2026-047",
    insuredName: "Salem Louafi",
    insuredId: "DZ-09-2026-047",
    vehicle: "Renault Symbol",
    year: "2019",
    plate: "789-012-09",
    coverage: "Tiers",
    coverageEn: "Third-Party",
    premium: "9 200 DA/an",
    validFrom: "2026-06-01",
    validTo: "2027-06-01",
    agency: "Amana Alger Centre",
    status: "Pending" as const,
    phone: "+213 555 012 345",
  },
];

const statusCfg = {
  Active: {
    label: "Actif",
    icon: FaCheckCircle,
    cls: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  Pending: {
    label: "En attente",
    icon: FaClock,
    cls: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  Expired: {
    label: "Expiré",
    icon: FaTimesCircle,
    cls: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-DZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ── Printable card ─────────────────────────────────────────────────────────────
function ContractCard({ contract }: { contract: typeof CONTRACTS[0] }) {
  const cfg = statusCfg[contract.status];
  const verifyUrl = `https://amana-assurance.dz/verify/${contract.id}`;

  return (
    <div
      className="relative w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ── Top gradient bar ── */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Amana</p>
            <p className="text-[10px] text-gray-400 tracking-wide">Assurance Automobile</p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${cfg.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
      </div>

      {/* ── Contract number ── */}
      <div className="px-8 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">N° Contrat</p>
        <p className="text-2xl font-black tracking-wide text-gray-900 font-mono">{contract.id}</p>
      </div>

      {/* ── Main content grid ── */}
      <div className="px-8 py-4 flex gap-6">

        {/* Left — details */}
        <div className="flex-1 space-y-3">
          {/* Assuré */}
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

          {/* Véhicule */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaCar className="text-cyan-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Véhicule</p>
              <p className="text-sm font-bold text-gray-800">{contract.vehicle} — {contract.year}</p>
              <p className="text-[10px] font-mono text-gray-500">Plaque: {contract.plate}</p>
            </div>
          </div>

          {/* Couverture */}
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

          {/* Validité */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <FaCalendarAlt className="text-violet-500 text-xs" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Période de validité</p>
              <p className="text-sm font-bold text-gray-800">
                {fmt(contract.validFrom)} → {fmt(contract.validTo)}
              </p>
            </div>
          </div>
        </div>

        {/* Right — QR code */}
        <div className="flex flex-col items-center justify-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl border-2 border-gray-100 bg-white shadow-sm">
            <QRCodeSVG
              value={verifyUrl}
              size={110}
              level="H"
              fgColor="#1e3a8a"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-[9px] text-center text-gray-400 font-medium max-w-[120px] leading-tight">
            Scanner pour vérifier l'authenticité
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-8 border-t border-dashed border-gray-200" />

      {/* ── Footer ── */}
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

      {/* ── Bottom gradient bar ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500" />
    </div>
  );
}

// ── Printable wrapper (clean print layout) ─────────────────────────────────────
function PrintableCard({ contract }: { contract: typeof CONTRACTS[0] }) {
  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <ContractCard contract={contract} />
      </div>
      <p className="mt-6 text-[9px] text-gray-400 text-center">
        Document généré par Amana Assurance — {new Date().toLocaleDateString("fr-DZ")} — amana-assurance.dz
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ContractPage() {
  const [selected, setSelected] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Contrat-${CONTRACTS[selected].id}`,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const contract = CONTRACTS[selected];

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link href="/main" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 mb-4 transition-colors">
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

        {/* Contract selector (if multiple) */}
        {CONTRACTS.length > 1 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
            {CONTRACTS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(i)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  selected === i
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                {c.id} — {c.vehicle}
              </button>
            ))}
          </div>
        )}

        {/* Card preview */}
        <div className="mb-6">
          <ContractCard contract={contract} />
        </div>

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <FaShieldAlt className="text-blue-400 text-sm shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Ce document fait foi de votre couverture d'assurance. Le QR code permet à tout agent ou tiers de vérifier l'authenticité et la validité de votre contrat en temps réel.
          </p>
        </div>
      </div>

      {/* Hidden print area */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintableCard contract={contract} />
        </div>
      </div>
    </div>
  );
}
