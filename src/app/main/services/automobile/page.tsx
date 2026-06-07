"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaShieldAlt, FaCar, FaExclamationTriangle, FaBell,
  FaPlus, FaClipboardList, FaCheckCircle, FaClock, FaChevronRight,
  FaRegIdCard, FaTimes, FaCheckDouble, FaSyncAlt, FaTachometerAlt,
  FaTruck, FaWrench, FaSearch, FaTools, FaPhone, FaMapMarkerAlt, FaStar,
  FaBoxOpen, FaOilCan, FaCogs, FaCarBattery, FaUserTie, FaBus,
} from "react-icons/fa";
import { getProfileStatusCached } from "@/app/lib/clientCache";

// ── Agencies ─────────────────────────────────────────────────────────────────
const AGENCIES = [
  {
    id: "SAA",
    name: "Société Algérienne des Assurances",
    abbr: "SAA",
    desc: "Premier assureur national, fondé en 1963.",
    gradient: "from-blue-600 to-blue-800",
    light: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-600",
    hover: "hover:border-blue-400",
  },
  {
    id: "CAAT",
    name: "Compagnie Algérienne des Assurances et de Réassurance",
    abbr: "CAAT",
    desc: "Spécialiste assurance transport et automobile depuis 1985.",
    gradient: "from-emerald-600 to-teal-700",
    light: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-600",
    hover: "hover:border-emerald-400",
  },
  {
    id: "CIAR",
    name: "Compagnie d'Assurances des Hydrocarbures",
    abbr: "CIAR",
    desc: "Partenaire de confiance en assurance auto et énergie.",
    gradient: "from-amber-500 to-orange-600",
    light: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    hover: "hover:border-amber-400",
  },
];

// ── Service partners ──────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { id: "towing",      label: "Towing",         icon: FaTruck,        color: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-200",   active: "bg-rose-600" },
  { id: "mechanic",    label: "Mechanics",       icon: FaWrench,       color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   active: "bg-blue-600" },
  { id: "body",        label: "Body Shop",       icon: FaTools,        color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  active: "bg-amber-600" },
  { id: "spare_parts", label: "Spare Parts",     icon: FaBoxOpen,      color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", active: "bg-orange-600" },
  { id: "oil",         label: "Oil & Fluids",    icon: FaOilCan,       color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", active: "bg-yellow-600" },
  { id: "control",     label: "Tech Control",    icon: FaCogs,         color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200",  active: "bg-slate-600" },
  { id: "tires",       label: "Tires",           icon: FaCar,          color: "text-zinc-600",   bg: "bg-zinc-50",   border: "border-zinc-200",   active: "bg-zinc-600" },
  { id: "electrician", label: "Auto Electrician",icon: FaCarBattery,   color: "text-cyan-600",   bg: "bg-cyan-50",   border: "border-cyan-200",   active: "bg-cyan-600" },
  { id: "expert",      label: "Expert",          icon: FaSearch,       color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", active: "bg-violet-600" },
  { id: "legal",       label: "Legal Advisor",   icon: FaUserTie,      color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", active: "bg-indigo-600" },
  { id: "transport",   label: "Transport",       icon: FaBus,          color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-200",   active: "bg-teal-600", soon: true },
];


type ApiContract = {
  id: string;
  contractNumber: string;
  status: string;
  assuranceType: string;
  brand: string;
  model: string;
  registration: string;
  firstRegistrationDate: string;
  totalCost: number;
  createdAt: string;
};

type ApiAccident = {
  id: string;
  caseNumber: string;
  status: string;
  accidentDate: string;
  location: string;
  vehiclePlate: string;
  createdAt: string;
  contract: { contractNumber: string; brand: string; model: string } | null;
};

type DbPartner = {
  id: string;
  name: string;
  type: string;
  wilaya: string;
  address: string;
  phone: string;
  rating: number;
  available: boolean;
  hours: string;
  eta?: string | null;
};

const TAB_TO_TYPE: Record<string, string> = {
  towing:      "TOWING",
  mechanic:    "MECHANIC",
  expert:      "EXPERT",
  body:        "BODY_SHOP",
  spare_parts: "SPARE_PARTS",
  oil:         "OIL_DISTRIBUTOR",
  control:     "CONTROL_CENTER",
  tires:       "TIRE_CENTER",
  electrician: "AUTO_ELECTRICIAN",
  legal:       "LEGAL",
};

const COVERAGE_LABEL: Record<string, string> = {
  third_party:   "Third Party",
  full_coverage: "Full Coverage",
  commercial:    "Commercial",
};

const STATUS_LABEL: Record<string, string> = {
  APPROUVE:   "Active",
  EN_ATTENTE: "Pending",
  REFUSE:     "Refused",
  EXPIRE:     "Expired",
  EN_REVUE:   "In Review",
  ACCEPTEE:   "Accepted",
  REFUSEE:    "Refused",
};

const mockNotifications = [
  { id: 1, text: "Your new contract has been received and is being processed.",          time: "2h ago",  read: false },
  { id: 2, text: "Your claim has been forwarded to an expert for review.",               time: "1d ago",  read: false },
  { id: 3, text: "Payment confirmed for your subscription.",                             time: "3d ago",  read: true  },
  { id: 4, text: "Reminder: Technical inspection (contrôle technique) due in 30 days.", time: "1w ago",  read: false },
  { id: 5, text: "Reminder: Oil change recommended — check your mileage.",              time: "1w ago",  read: true  },
  { id: 6, text: "Reminder: Tyre inspection advised before the next long trip.",        time: "2w ago",  read: true  },
];

const statusBadge = (s: string) =>
  ({
    APPROUVE:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    ACCEPTEE:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    EN_ATTENTE: "bg-amber-50 text-amber-700 border border-amber-200",
    EN_REVUE:   "bg-blue-50 text-blue-700 border border-blue-200",
    REFUSE:     "bg-gray-100 text-gray-500 border border-gray-200",
    REFUSEE:    "bg-gray-100 text-gray-500 border border-gray-200",
    EXPIRE:     "bg-gray-100 text-gray-500 border border-gray-200",
  } as Record<string, string>)[s] ?? "bg-gray-100 text-gray-500";

// ── Agency bottom-sheet (full-screen on mobile, centered on desktop) ──────────
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
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
        />
      )}
      <div className="relative w-full max-w-lg md:mx-4 overflow-hidden rounded-t-3xl md:rounded-3xl bg-white shadow-2xl">
        {/* drag handle (mobile) */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-gray-800">
              {current ? "Changer d'agence" : "Choisissez votre agence"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">Partenaire officiel Amaneka</p>
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
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  selected ? `${a.light} shadow-sm` : `border-gray-200 bg-white ${a.hover}`
                }`}
              >
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AutomobilePage() {
  const { data: session, status } = useSession();
  const [profileCompleted, setProfileCompleted]   = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [selectedAgency, setSelectedAgency]       = useState<string | null>(null);
  const [showAgencySheet, setShowAgencySheet]     = useState(false);
  const [showChangeSheet, setShowChangeSheet]     = useState(false);
  const [activeServiceTab, setActiveServiceTab]   = useState("towing");
  const [contracts, setContracts]                 = useState<ApiContract[]>([]);
  const [accidents, setAccidents]                 = useState<ApiAccident[]>([]);
  const [partners, setPartners]                   = useState<DbPartner[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const stored = localStorage.getItem("amana_selectedAgency");
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
        const [cRes, aRes, pRes] = await Promise.all([
          fetch("/api/contracts"),
          fetch("/api/accidents"),
          fetch("/api/partners"),
        ]);
        const [cData, aData, pData] = await Promise.all([
          cRes.json() as Promise<{ contracts?: ApiContract[] }>,
          aRes.json() as Promise<{ accidents?: ApiAccident[] }>,
          pRes.json() as Promise<{ partners?: DbPartner[] }>,
        ]);
        if (!cancelled) {
          setContracts(cData.contracts ?? []);
          setAccidents(aData.accidents ?? []);
          setPartners(pData.partners ?? []);
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [status]);

  const handleSelect = (id: string) => {
    localStorage.setItem("amana_selectedAgency", id);
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

        {/* ── Header card ──────────────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/90 p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Auto Insurance</p>
              <h1 className="mt-0.5 text-lg font-extrabold text-gray-800 sm:text-2xl">
                Hello, <span className="text-blue-600">{session?.user?.name?.split(" ")[0] ?? "—"}</span>
              </h1>
              {agency && (
                <button
                  type="button"
                  onClick={() => setShowChangeSheet(true)}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold ${agency.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${agency.dot}`} />
                  {agency.abbr} <span className="opacity-60">· Change</span>
                </button>
              )}
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Link href="/main/contract"
                className="inline-flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-600 shadow-sm hover:bg-blue-50">
                <FaRegIdCard className="text-xs" /> My Card
              </Link>
              <Link href="/main/accident"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700">
                <FaExclamationTriangle className="text-xs" /> Accident
              </Link>
              <Link href="/main/newassurance"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md">
                <FaPlus className="text-xs" /> New
              </Link>
            </div>
          </div>
        </div>

        {/* ── Profile incomplete banner ─────────────────────────────── */}
        {!isCheckingProfile && !profileCompleted && (
          <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <FaRegIdCard className="mt-0.5 shrink-0 text-base text-amber-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">Complete your profile</p>
              <p className="mt-0.5 text-xs text-amber-600">Required to create a contract.</p>
            </div>
            <Link href="/main/profile"
              className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-200">
              Complete <FaChevronRight className="text-[10px]" />
            </Link>
          </div>
        )}

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {[
              { label: "New Contract",   href: "/main/newassurance", icon: FaPlus,               cls: "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20" },
              { label: "Report Accident",href: "/main/accident",      icon: FaExclamationTriangle, cls: "bg-rose-600 text-white shadow-md shadow-rose-500/20" },
              { label: "Renew",          href: "/main/newassurance",  icon: FaSyncAlt,             cls: "border border-emerald-200 bg-emerald-50 text-emerald-700" },
              { label: "Recharge km",   href: "/main/profile",       icon: FaTachometerAlt,       cls: "border border-amber-200 bg-amber-50 text-amber-700" },
              { label: "My Card",        href: "/main/contract",      icon: FaRegIdCard,           cls: "border border-blue-200 bg-blue-50 text-blue-700" },
              { label: "My Profile",     href: "/main/profile",       icon: FaClipboardList,       cls: "border border-gray-200 bg-gray-50 text-gray-700" },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-3.5 text-center transition-all hover:opacity-90 ${a.cls}`}>
                <a.icon className="text-lg" />
                <span className="text-[11px] font-bold leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── KPI strip ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Active Contracts", value: contracts.filter((c) => c.status === "APPROUVE").length, icon: FaShieldAlt,    color: "text-blue-600",    bg: "bg-blue-50" },
            { label: "Open Claims",     value: accidents.filter((a) => a.status === "EN_ATTENTE" || a.status === "EN_REVUE").length, icon: FaClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Resolved Claims", value: accidents.filter((a) => a.status === "ACCEPTEE").length, icon: FaCheckCircle,  color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Contracts", value: contracts.length, icon: FaClock, color: "text-gray-500", bg: "bg-gray-100" },
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

        {/* ── My Contracts ─────────────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800">My Contracts</h2>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                {contracts.length}
              </span>
            </div>
            <Link href="/main/newassurance" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
              + New <FaChevronRight className="text-xs" />
            </Link>
          </div>

          {contracts.length === 0 ? (
            <div className="py-8 text-center">
              <FaCar className="mx-auto mb-2 text-3xl text-gray-200" />
              <p className="text-sm text-gray-400">No contracts yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map((c) => {
                const expiry = new Date(new Date(c.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000)
                  .toISOString().split("T")[0];
                return (
                  <div key={c.id} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                          <FaCar className="text-xs text-blue-600" />
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
                        <p className="text-[10px] text-gray-400">Exp: {expiry}</p>
                      </div>
                      <Link href="/main/contract"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                        <FaRegIdCard className="text-xs" /> Card
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Claims + Notifications ────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaClipboardList className="text-amber-500" />
                <h2 className="text-sm font-bold text-gray-800">My Claims</h2>
                <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                  {accidents.length}
                </span>
              </div>
              <Link href="/main/claims" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                View all <FaChevronRight className="text-xs" />
              </Link>
            </div>
            {accidents.length === 0 ? (
              <div className="py-6 text-center">
                <FaClipboardList className="mx-auto mb-2 text-3xl text-gray-200" />
                <p className="text-sm text-gray-400">No claims declared.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {accidents.map((cl) => (
                  <div key={cl.id} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
                    <div className="mb-1.5 flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-gray-800">{cl.caseNumber}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(cl.status)}`}>
                        {STATUS_LABEL[cl.status] ?? cl.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{cl.location}</p>
                    <p className="mt-1 text-xs text-gray-400">{cl.accidentDate} · {cl.contract?.brand} {cl.contract?.model}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <FaBell className="text-indigo-500" />
              <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                {mockNotifications.filter((n) => !n.read).length} new
              </span>
            </div>
            <div className="space-y-2.5">
              {mockNotifications.map((n) => (
                <div key={n.id}
                  className={`flex items-start gap-3 rounded-2xl border p-3 ${
                    n.read ? "border-gray-100 bg-gray-50/40" : "border-indigo-100 bg-indigo-50/40"
                  }`}>
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-gray-300" : "bg-indigo-500"}`} />
                  <div className="min-w-0">
                    <p className="text-xs leading-relaxed text-gray-700">{n.text}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Service partners ──────────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-800">Service Partners</h2>
            <p className="mt-0.5 text-xs text-gray-500">Amaneka certified providers</p>
          </div>

          {/* Tabs — scrollable row on mobile */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {SERVICE_CATEGORIES.map((cat) => {
              const active = activeServiceTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => !cat.soon && setActiveServiceTab(cat.id)}
                  disabled={cat.soon}
                  className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all ${
                    cat.soon
                      ? `${cat.bg} ${cat.color} ${cat.border} opacity-60 cursor-not-allowed`
                      : active
                        ? `${cat.active} border-transparent text-white shadow-md`
                        : `${cat.bg} ${cat.color} ${cat.border}`
                  }`}
                >
                  <cat.icon className="text-xs" /> {cat.label}
                  {cat.soon && (
                    <span className="ml-1 rounded-full bg-white/60 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-current opacity-80">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {SERVICE_CATEGORIES.find((c) => c.id === activeServiceTab)?.soon ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FaBus className="text-4xl text-teal-200" />
              <p className="text-sm font-bold text-gray-600">Transport — Coming Soon</p>
              <p className="text-xs text-gray-400">This service will be available shortly.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {partners.filter((p) => p.type === TAB_TO_TYPE[activeServiceTab]).map((partner) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.id === activeServiceTab)!;
              return (
                <div key={partner.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${cat.bg} ${cat.border}`}>
                      <cat.icon className={`text-sm ${cat.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-gray-800">{partner.name}</p>
                        <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${
                          partner.available
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}>
                          {partner.available ? "● Available" : "○ Unavailable"}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <FaStar className="text-[10px] text-amber-400" />
                        <span className="text-[10px] font-semibold text-gray-600">{partner.rating}</span>
                        <span className="text-[10px] text-gray-400">· {partner.wilaya}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-0.5 shrink-0 text-xs text-gray-300" />
                      <p className="text-xs leading-tight text-gray-500">{partner.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="shrink-0 text-xs text-gray-300" />
                      <p className="text-xs text-gray-500">{partner.hours}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${partner.phone}`}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-all ${
                      partner.available
                        ? `${cat.bg} ${cat.color} ${cat.border} active:opacity-70`
                        : "pointer-events-none border-gray-200 bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FaPhone className="text-xs" /> {partner.phone}
                  </a>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* ── Active agency pill ────────────────────────────────────── */}
        {agency && (
          <div className={`flex items-center gap-3 rounded-2xl border-2 p-4 sm:rounded-3xl ${agency.light}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${agency.gradient}`}>
              <span className="text-xs font-black text-white">{agency.abbr}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active agency</p>
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
