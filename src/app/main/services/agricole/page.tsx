"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaShieldAlt, FaChevronRight, FaPlus, FaClipboardList,
  FaCheckCircle, FaClock, FaRegIdCard, FaBell, FaTimes,
  FaCheckDouble, FaLeaf, FaFire, FaSnowflake, FaExclamationTriangle,
  FaTractor, FaLock,
} from "react-icons/fa";
import { GiCow, GiChicken, GiWheat } from "react-icons/gi";
import { getProfileStatusCached } from "@/app/lib/clientCache";

const AGENCIES = [
  {
    id: "CAAT",
    name: "Compagnie Algérienne des Assurances et de Réassurance",
    abbr: "CAAT",
    desc: "Spécialiste assurance agricole et transport depuis 1985.",
    gradient: "from-emerald-600 to-teal-700",
    light: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-600",
    hover: "hover:border-emerald-400",
  },
  {
    id: "SAA",
    name: "Société Algérienne des Assurances",
    abbr: "SAA",
    desc: "Premier assureur national, fondé en 1963.",
    gradient: "from-lime-600 to-green-700",
    light: "bg-lime-50 border-lime-200",
    badge: "bg-lime-100 text-lime-700 border-lime-200",
    dot: "bg-lime-600",
    hover: "hover:border-lime-400",
  },
  {
    id: "CIAR",
    name: "Compagnie d'Assurances des Hydrocarbures",
    abbr: "CIAR",
    desc: "Partenaire de confiance en assurance agricole et énergie.",
    gradient: "from-amber-500 to-orange-600",
    light: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    hover: "hover:border-amber-400",
  },
];

const AGRI_COVERAGE_TYPES = [
  {
    id: "agri_fire",
    icon: FaFire,
    label: "Annexe Incendie",
    shortDesc: "Bâtiments d'élevage, fabriques, entrepôts",
    fullDesc:
      "Couvre les mâcosûtés de l'élevage, les fabriques d'aliments, les couvoirs, les entrepôts à céréales et les chambres froides contre l'incendie et les risques additionnels (tempêtes, inondations, explosion, grêle, etc.).",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    gradient: "from-rose-500 to-red-600",
  },
  {
    id: "agri_poultry",
    icon: GiChicken,
    label: "Annexe Aviculture",
    shortDesc: "Poulets de chair, poules pondeuses et dindes",
    fullDesc:
      "Indemnise le mortalités dues aux maladies ou accidents selon les espèces : poulets de chair (56 jours), poules pondeuses (élevage 6 mois + ponte 1,5 an) et dindes (78 semaines).",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "agri_livestock",
    icon: GiCow,
    label: "Annexe Bétail",
    shortDesc: "Bovins, ovins, caprins, chevaux — 1 an",
    fullDesc:
      "Couvre la mort des bovins, des buffles, des moutons, des chèvres et des chevaux due à maladie ou accident pendant une année entière. Le taux est fixé après inspection.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "agri_crop",
    icon: GiWheat,
    label: "Production végétale",
    shortDesc: "Céréales, vergers, légumes, pépinières",
    fullDesc:
      "Protège les cultures, les vergers, les légumes et les pépinières contre l'incendie, la foudre, la grêle, les pluies torrentielles, les inondations, la sécheresse (zones pluviales) et les ravageurs non maîtrisables.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    gradient: "from-green-500 to-lime-600",
  },
  {
    id: "agri_theft",
    icon: FaLock,
    label: "Annexe Vol",
    shortDesc: "Perte ou dommage par vol ou tentative",
    fullDesc:
      "Couvre toute perte ou tout dommage aux biens assurés résultant d'un vol ou d'une tentative de vol sur l'exploitation agricole.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "agri_vehicles",
    icon: FaTractor,
    label: "Véhicules agricoles",
    shortDesc: "Incendie, vol, tonnage, collision, RC",
    fullDesc:
      "Couvre tous les engins agricoles contre l'incendie, le vol, le tonnage, la collision et la responsabilité civile, selon les tarifs en vigueur.",
    color: "text-lime-700",
    bg: "bg-lime-50",
    border: "border-lime-200",
    gradient: "from-lime-500 to-green-600",
  },
];

const AGRI_ASSURANCE_TYPES = new Set([
  "agri_fire", "agri_poultry", "agri_livestock",
  "agri_crop", "agri_theft", "agri_vehicles",
]);

const COVERAGE_LABEL: Record<string, string> = {
  agri_fire:     "Incendie agricole",
  agri_poultry:  "Aviculture",
  agri_livestock:"Bétail",
  agri_crop:     "Production végétale",
  agri_theft:    "Vol agricole",
  agri_vehicles: "Véhicules agricoles",
};

const STATUS_LABEL: Record<string, string> = {
  APPROUVE:   "Actif",
  EN_ATTENTE: "En attente",
  REFUSE:     "Refusé",
  EXPIRE:     "Expiré",
};

const statusBadge = (s: string) =>
  ({
    APPROUVE:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    EN_ATTENTE: "bg-amber-50 text-amber-700 border border-amber-200",
    REFUSE:     "bg-gray-100 text-gray-500 border border-gray-200",
    EXPIRE:     "bg-gray-100 text-gray-500 border border-gray-200",
  } as Record<string, string>)[s] ?? "bg-gray-100 text-gray-500";

type ApiContract = {
  id: string;
  contractNumber: string;
  status: string;
  assuranceType: string;
  brand: string;
  model: string;
  registration: string;
  totalCost: number;
  createdAt: string;
};

function AgencySheet({
  current,
  onSelect,
  onClose,
}: {
  current: string | null;
  onSelect: (id: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      {onClose && (
        <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      )}
      <div className="relative w-full max-w-lg md:mx-4 overflow-hidden rounded-t-3xl md:rounded-3xl bg-white shadow-2xl">
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-gray-800">
              {current ? "Changer d'agence" : "Choisissez votre agence"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">Partenaire officiel Amaneka Agricole</p>
          </div>
          {onClose && (
            <button type="button" onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
        <div className="space-y-2.5 px-5 pb-6">
          {AGENCIES.map((a) => {
            const selected = current === a.id;
            return (
              <button key={a.id} type="button" onClick={() => onSelect(a.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  selected ? `${a.light} shadow-sm` : `border-gray-200 bg-white ${a.hover}`
                }`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${a.gradient}`}>
                  <span className="text-sm font-black text-white">{a.abbr}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-800">{a.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{a.desc}</p>
                </div>
                {selected
                  ? <FaCheckDouble className="shrink-0 text-emerald-500" />
                  : <FaChevronRight className="shrink-0 text-xs text-gray-300" />}
              </button>
            );
          })}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </div>
  );
}

export default function AgricolePage() {
  const { data: session, status } = useSession();
  const [profileCompleted, setProfileCompleted]   = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [selectedAgency, setSelectedAgency]       = useState<string | null>(null);
  const [showAgencySheet, setShowAgencySheet]     = useState(false);
  const [showChangeSheet, setShowChangeSheet]     = useState(false);
  const [contracts, setContracts]                 = useState<ApiContract[]>([]);
  const [expandedCoverage, setExpandedCoverage]   = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const stored = localStorage.getItem("amana_agri_selectedAgency");
    if (stored) setSelectedAgency(stored);
    else setShowAgencySheet(true);
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") { setIsCheckingProfile(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const ok = await getProfileStatusCached();
        if (!cancelled) setProfileCompleted(Boolean(ok));
      } catch { /* ignore */ } finally {
        if (!cancelled) setIsCheckingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/contracts");
        const data = (await res.json()) as { contracts?: ApiContract[] };
        if (!cancelled) {
          const agriContracts = (data.contracts ?? []).filter((c) =>
            AGRI_ASSURANCE_TYPES.has(c.assuranceType)
          );
          setContracts(agriContracts);
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [status]);

  const handleSelect = (id: string) => {
    localStorage.setItem("amana_agri_selectedAgency", id);
    setSelectedAgency(id);
    setShowAgencySheet(false);
    setShowChangeSheet(false);
  };

  const agency = AGENCIES.find((a) => a.id === selectedAgency);

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-3 pt-20 pb-6 sm:px-6 sm:pt-24 sm:pb-10">

      {showAgencySheet && <AgencySheet current={null} onSelect={handleSelect} />}
      {showChangeSheet && (
        <AgencySheet current={selectedAgency} onSelect={handleSelect} onClose={() => setShowChangeSheet(false)} />
      )}

      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">

        {/* ── Header card ──────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-lime-600">Assurance Agricole</p>
              <h1 className="mt-0.5 text-lg font-extrabold text-gray-800 sm:text-2xl">
                Bonjour, <span className="text-lime-600">{session?.user?.name?.split(" ")[0] ?? "—"}</span>
              </h1>
              {agency && (
                <button type="button" onClick={() => setShowChangeSheet(true)}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold ${agency.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${agency.dot}`} />
                  {agency.abbr} <span className="opacity-60">· Changer</span>
                </button>
              )}
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Link href="/main/contract"
                className="inline-flex items-center gap-1.5 rounded-2xl border border-lime-200 bg-white px-3 py-2 text-xs font-bold text-lime-600 shadow-sm hover:bg-lime-50">
                <FaRegIdCard className="text-xs" /> Mes contrats
              </Link>
              <Link href="/main/newassurance/agricole"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-lime-600 to-green-500 px-4 py-2 text-xs font-bold text-white shadow-md">
                <FaPlus className="text-xs" /> Nouveau
              </Link>
            </div>
          </div>
        </div>

        {/* ── Profile incomplete banner ─────────────────────── */}
        {!isCheckingProfile && !profileCompleted && (
          <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <FaRegIdCard className="mt-0.5 shrink-0 text-base text-amber-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">Complétez votre profil</p>
              <p className="mt-0.5 text-xs text-amber-600">Requis pour créer un contrat d'assurance agricole.</p>
            </div>
            <Link href="/main/profile"
              className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200">
              Compléter <FaChevronRight className="text-[10px]" />
            </Link>
          </div>
        )}

        {/* ── Quick actions ─────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-800">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {[
              { label: "Nouveau contrat",  href: "/main/newassurance/agricole", icon: FaPlus,        cls: "bg-gradient-to-br from-lime-600 to-green-500 text-white shadow-md shadow-lime-500/20" },
              { label: "Mes contrats",     href: "/main/contract",              icon: FaShieldAlt,   cls: "border border-lime-200 bg-lime-50 text-lime-700" },
              { label: "Mes sinistres",    href: "/main/claims",                icon: FaClipboardList, cls: "border border-amber-200 bg-amber-50 text-amber-700" },
              { label: "Mon profil",       href: "/main/profile",               icon: FaRegIdCard,   cls: "border border-gray-200 bg-gray-50 text-gray-700" },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-3.5 text-center transition-all hover:opacity-90 ${a.cls}`}>
                <a.icon className="text-lg" />
                <span className="text-[11px] font-bold leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── KPI strip ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Contrats actifs",    value: contracts.filter((c) => c.status === "APPROUVE").length,   icon: FaShieldAlt,   color: "text-lime-600",    bg: "bg-lime-50" },
            { label: "En attente",         value: contracts.filter((c) => c.status === "EN_ATTENTE").length, icon: FaClock,       color: "text-amber-600",   bg: "bg-amber-50" },
            { label: "Réglés",             value: contracts.filter((c) => c.status === "EXPIRE").length,     icon: FaCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total contrats",     value: contracts.length,                                          icon: FaClipboardList,color: "text-gray-500",   bg: "bg-gray-100" },
          ].map((kpi) => (
            <div key={kpi.label}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/80 p-3.5 shadow-sm sm:rounded-3xl sm:p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`text-sm ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-extrabold text-gray-800 sm:text-2xl">{kpi.value}</p>
                <p className="truncate text-[10px] leading-tight text-gray-500">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── My agricultural contracts ─────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaLeaf className="text-lime-600" />
              <h2 className="text-sm font-bold text-gray-800">Mes contrats agricoles</h2>
              <span className="rounded-full border border-lime-100 bg-lime-50 px-2 py-0.5 text-xs font-semibold text-lime-600">
                {contracts.length}
              </span>
            </div>
            <Link href="/main/newassurance/agricole" className="flex items-center gap-1 text-xs font-semibold text-lime-600">
              + Nouveau <FaChevronRight className="text-xs" />
            </Link>
          </div>

          {contracts.length === 0 ? (
            <div className="py-10 text-center">
              <FaLeaf className="mx-auto mb-3 text-4xl text-gray-200" />
              <p className="text-sm font-semibold text-gray-500">Aucun contrat agricole.</p>
              <p className="mt-1 text-xs text-gray-400">Souscrivez à une couverture agricole pour commencer.</p>
              <Link href="/main/newassurance/agricole"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-lime-600 to-green-500 px-5 py-2.5 text-xs font-bold text-white shadow-md">
                <FaPlus /> Souscrire maintenant
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map((c) => {
                const expiry = new Date(new Date(c.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString().split("T")[0];
                const coverage = AGRI_COVERAGE_TYPES.find((t) => t.id === c.assuranceType);
                const Icon = coverage?.icon ?? FaLeaf;
                return (
                  <div key={c.id} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${coverage?.bg ?? "bg-lime-50"}`}>
                          <Icon className={`text-xs ${coverage?.color ?? "text-lime-600"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-800">{c.brand} {c.model}</p>
                          <p className="text-xs text-gray-500">{c.contractNumber} · {COVERAGE_LABEL[c.assuranceType] ?? c.assuranceType}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(c.status)}`}>
                        {STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{c.totalCost.toLocaleString("fr-DZ")} DA/an</p>
                        <p className="text-[10px] text-gray-400">Exp : {expiry}</p>
                      </div>
                      <Link href="/main/contract"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-lime-100 bg-lime-50 px-3 py-1.5 text-xs font-bold text-lime-600">
                        <FaRegIdCard className="text-xs" /> Carte
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Coverage types explained ──────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-800">Nos annexes agricoles</h2>
            <p className="mt-0.5 text-xs text-gray-500">Choisissez la couverture adaptée à votre exploitation</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGRI_COVERAGE_TYPES.map((type) => {
              const expanded = expandedCoverage === type.id;
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setExpandedCoverage(expanded ? null : type.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all ${
                    expanded ? `${type.border} ${type.bg}` : "border-gray-200 bg-gray-50/60 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${type.gradient}`}>
                      <Icon className="text-sm text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-extrabold ${expanded ? type.color : "text-gray-800"}`}>{type.label}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-gray-500">{type.shortDesc}</p>
                    </div>
                    <FaChevronRight className={`mt-1 shrink-0 text-[10px] text-gray-300 transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </div>
                  {expanded && (
                    <p className="mt-3 text-xs leading-relaxed text-gray-600 border-t border-gray-200 pt-3">
                      {type.fullDesc}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <Link href="/main/newassurance/agricole"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-lime-600 to-green-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-lime-500/25 hover:opacity-90">
              <FaPlus /> Souscrire à une assurance agricole
            </Link>
          </div>
        </div>

        {/* ── Notifications placeholder ─────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaBell className="text-lime-500" />
            <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-2.5">
            {[
              { text: "Votre contrat agricole est en cours de traitement.", time: "Aujourd'hui", read: false },
              { text: "Rappel : vérification annuelle de votre cheptel requise.", time: "Il y a 3 jours", read: true },
              { text: "Campagne agricole 2026 : pensez à renouveler votre couverture.", time: "Il y a 1 semaine", read: true },
            ].map((n, i) => (
              <div key={i}
                className={`flex items-start gap-3 rounded-2xl border p-3 ${
                  n.read ? "border-gray-100 bg-gray-50/40" : "border-lime-100 bg-lime-50/40"
                }`}>
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-gray-300" : "bg-lime-500"}`} />
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed text-gray-700">{n.text}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Climate info strip ────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: FaFire,      label: "Risque incendie",  value: "Modéré",   color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200" },
            { icon: FaSnowflake, label: "Risque gel",       value: "Faible",   color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
            { icon: FaExclamationTriangle, label: "Risque grêle", value: "Élevé", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          ].map((r) => (
            <div key={r.label}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center ${r.bg} ${r.border}`}>
              <r.icon className={`text-lg ${r.color}`} />
              <p className="text-[10px] font-semibold text-gray-600">{r.label}</p>
              <p className={`text-xs font-extrabold ${r.color}`}>{r.value}</p>
            </div>
          ))}
        </div>

        {/* ── Active agency pill ────────────────────────────── */}
        {agency && (
          <div className={`flex items-center gap-3 rounded-2xl border-2 p-4 sm:rounded-3xl ${agency.light}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${agency.gradient}`}>
              <span className="text-xs font-black text-white">{agency.abbr}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Agence active</p>
              <p className="truncate text-sm font-extrabold text-gray-800">{agency.name}</p>
            </div>
            <button type="button" onClick={() => setShowChangeSheet(true)}
              className="shrink-0 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50">
              Changer
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
