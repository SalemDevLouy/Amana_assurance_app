"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaShieldAlt, FaCar, FaExclamationTriangle, FaBell,
  FaPlus, FaClipboardList, FaCheckCircle, FaClock, FaChevronRight,
  FaRegIdCard, FaBuilding, FaTimes, FaCheckDouble,
  FaTruck, FaWrench, FaSearch, FaTools, FaPhone, FaMapMarkerAlt, FaStar,
  FaHome, FaPlaneDeparture, FaIndustry, FaStore, FaUmbrella, FaLock,
} from 'react-icons/fa';
import { getProfileStatusCached } from '@/app/lib/clientCache';

// ── Partner agencies ────────────────────────────────────────────────────────────
const AGENCIES = [
  {
    id: 'SAA',
    name: 'Société Algérienne des Assurances',
    abbr: 'SAA',
    desc: 'Premier assureur national, fondé en 1963. Leader en assurance automobile.',
    gradient: 'from-blue-600 to-blue-800',
    light: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-600',
  },
  {
    id: 'CAAT',
    name: 'Compagnie Algérienne des Assurances et de Réassurance',
    abbr: 'CAAT',
    desc: 'Spécialiste assurance transport, industrie et automobile depuis 1985.',
    gradient: 'from-emerald-600 to-teal-700',
    light: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-600',
  },
  {
    id: 'CIAR',
    name: "Compagnie d'Assurances des Hydrocarbures",
    abbr: 'CIAR',
    desc: 'Partenaire de confiance en assurance auto et énergie.',
    gradient: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
];

// ── Insurance services ─────────────────────────────────────────────────────────
const INSURANCE_SERVICES = [
  {
    id: 'auto',
    label: 'Automobile',
    desc: 'Tous risques, tiers et plus',
    icon: FaCar,
    gradient: 'from-blue-600 to-cyan-500',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    border: 'border-blue-200',
    available: true,
    href: '/main/services/automobile',
  },
  {
    id: 'habitation',
    label: 'Habitation',
    desc: 'Maison, appartement, locataire',
    icon: FaHome,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'border-emerald-200',
    available: false,
    href: '#',
  },
  {
    id: 'voyage',
    label: 'Voyage',
    desc: 'Couverture nationale et internationale',
    icon: FaPlaneDeparture,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
    border: 'border-violet-200',
    available: false,
    href: '#',
  },
  {
    id: 'industrie',
    label: 'Industrie',
    desc: 'Risques industriels et équipements',
    icon: FaIndustry,
    gradient: 'from-gray-600 to-gray-800',
    bg: 'bg-gray-50',
    color: 'text-gray-600',
    border: 'border-gray-200',
    available: false,
    href: '#',
  },
  {
    id: 'commerce',
    label: 'Commerce',
    desc: 'Fonds de commerce et locaux pros',
    icon: FaStore,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
    border: 'border-amber-200',
    available: false,
    href: '#',
  },
  {
    id: 'multirisque',
    label: 'Multirisque',
    desc: 'Protection globale personnalisée',
    icon: FaUmbrella,
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    color: 'text-rose-600',
    border: 'border-rose-200',
    available: false,
    href: '#',
  },
  {
    id: 'agricole',
    label: 'Agricole',
    desc: 'Récoltes, matériel et cheptel',
    icon: FaIndustry,
    gradient: 'from-lime-500 to-green-600',
    bg: 'bg-lime-50',
    color: 'text-lime-700',
    border: 'border-lime-200',
    available: false,
    href: '#',
  },
];

// ── Service partners ───────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { id: 'towing',   label: 'Dépannage',        icon: FaTruck,   color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200',   active: 'bg-rose-600' },
  { id: 'mechanic', label: 'Mécanicien',        icon: FaWrench,  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   active: 'bg-blue-600' },
  { id: 'expert',   label: 'Expert Automobile', icon: FaSearch,  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', active: 'bg-violet-600' },
  { id: 'body',     label: 'Carrosserie',       icon: FaTools,   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  active: 'bg-amber-600' },
];

const SERVICE_PARTNERS: Record<string, {
  id: string; name: string; wilaya: string; address: string;
  phone: string; rating: number; available: boolean; hours: string;
}[]> = {
  towing: [
    { id: 't1', name: 'Dépannage Express Alger',   wilaya: 'Alger',       address: 'Rue Hassiba Ben Bouali, Alger-Centre', phone: '+213 21 63 00 11', rating: 4.8, available: true,  hours: '24h/24' },
    { id: 't2', name: 'SOS Route Oran',            wilaya: 'Oran',        address: 'Bd Millenium, Oran',                   phone: '+213 41 33 55 77', rating: 4.6, available: true,  hours: '24h/24' },
    { id: 't3', name: 'Remorquage Rapide Annaba',  wilaya: 'Annaba',      address: 'Zone Industrielle, Annaba',            phone: '+213 38 86 20 44', rating: 4.4, available: false, hours: '06h–22h' },
    { id: 't4', name: 'Assistance Auto Constantine',wilaya: 'Constantine', address: 'Route nationale 3, Constantine',       phone: '+213 31 68 90 12', rating: 4.5, available: true,  hours: '24h/24' },
  ],
  mechanic: [
    { id: 'm1', name: 'Garage Central Alger',      wilaya: 'Alger',       address: '14 Rue des Ateliers, Hussein Dey',     phone: '+213 21 77 44 22', rating: 4.7, available: true,  hours: 'Lun–Sam 08h–18h' },
    { id: 'm2', name: 'Auto Service Blida',        wilaya: 'Blida',       address: 'Cité 500 Logements, Blida',            phone: '+213 25 41 09 33', rating: 4.5, available: true,  hours: 'Lun–Sam 07h–19h' },
    { id: 'm3', name: 'Mécanique Générale Sétif',  wilaya: 'Sétif',       address: 'Route de Aïn Arnat, Sétif',            phone: '+213 36 84 17 65', rating: 4.6, available: false, hours: 'Lun–Sam 08h–17h' },
    { id: 'm4', name: 'Garage Moderne Tizi Ouzou', wilaya: 'Tizi Ouzou',  address: 'Avenue Hocine Aït Ahmed, T.O.',         phone: '+213 26 22 31 88', rating: 4.3, available: true,  hours: 'Lun–Ven 08h–18h' },
  ],
  expert: [
    { id: 'e1', name: 'Cabinet d\'Expertise Hamdi',wilaya: 'Alger',       address: '8 Rue Larbi Ben M\'hidi, Alger',       phone: '+213 21 73 56 10', rating: 4.9, available: true,  hours: 'Lun–Ven 08h–17h' },
    { id: 'e2', name: 'Expertise Auto Maghreb',    wilaya: 'Oran',        address: 'Centre Commercial Les Dunes, Oran',    phone: '+213 41 44 62 30', rating: 4.7, available: true,  hours: 'Lun–Ven 08h–17h' },
    { id: 'e3', name: 'Bureau d\'Expertise Meriem',wilaya: 'Annaba',      address: 'Rue du 1er Novembre, Annaba',          phone: '+213 38 72 40 55', rating: 4.6, available: false, hours: 'Lun–Jeu 09h–16h' },
  ],
  body: [
    { id: 'b1', name: 'Carrosserie El Amel',       wilaya: 'Alger',       address: 'Zone Artisanale Rouiba, Alger',         phone: '+213 21 81 34 70', rating: 4.7, available: true,  hours: 'Lun–Sam 07h–18h' },
    { id: 'b2', name: 'Atelier Peinture Moderne',  wilaya: 'Blida',       address: 'Route de Boufarik, Blida',             phone: '+213 25 39 11 46', rating: 4.5, available: true,  hours: 'Lun–Sam 08h–18h' },
    { id: 'b3', name: 'Carrosserie du Sahel',      wilaya: 'Tipaza',      address: 'Cité des Orangers, Tipaza',            phone: '+213 24 47 88 21', rating: 4.4, available: false, hours: 'Lun–Ven 08h–17h' },
    { id: 'b4', name: 'Auto Carrosserie Nord',     wilaya: 'Oran',        address: 'Zone d\'Activité Sidi Maarouf, Oran',  phone: '+213 41 52 77 33', rating: 4.6, available: true,  hours: 'Lun–Sam 07h–19h' },
  ],
};

// ── Mock data ───────────────────────────────────────────────────────────────────
const mockContracts = [
  { id: 'AMT-2026-001', vehicle: 'Peugeot 208 – 2021', coverage: 'Full Coverage', status: 'Active', premium: '18 500 DA/yr', expires: '2027-03-15' },
];

const mockClaims = [
  { id: 'CLM-2026-012', date: '2026-04-10', description: 'Rear-end collision on highway', status: 'Under Review', garage: 'Garage Centrale Alger' },
  { id: 'CLM-2025-088', date: '2025-11-22', description: 'Door damage in parking lot', status: 'Resolved', garage: 'Auto Repair Oran' },
];

const mockNotifications = [
  { id: 1, text: 'Your contract AMT-2026-001 has been approved.', time: '2 hours ago', read: false },
  { id: 2, text: 'Inspection scheduled for claim CLM-2026-012 on May 30.', time: '1 day ago', read: false },
  { id: 3, text: 'Payment confirmed for policy renewal.', time: '3 days ago', read: true },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    Expired: 'bg-gray-100 text-gray-500 border border-gray-200',
    'Under Review': 'bg-blue-50 text-blue-700 border border-blue-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-500';
};

// ── Agency selection modal ──────────────────────────────────────────────────────
function AgencyModal({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FaBuilding className="text-white text-sm" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Bienvenue sur Amaneka</p>
          </div>
          <h2 className="text-xl font-extrabold text-white">Choisissez votre agence partenaire</h2>
          <p className="text-sm text-white/70 mt-1">
            Sélectionnez la compagnie d'assurance avec laquelle vous travaillez.
          </p>
        </div>

        {/* Agency cards */}
        <div className="p-6 space-y-3">
          {AGENCIES.map((agency) => (
            <button
              key={agency.id}
              type="button"
              onMouseEnter={() => setHovered(agency.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(agency.id)}
              className={`w-full flex items-center gap-5 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                hovered === agency.id
                  ? agency.light + ' shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Abbr badge */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agency.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                <span className="text-white font-black text-sm tracking-tight">{agency.abbr}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${agency.badge}`}>
                    Partenaire officiel
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-800 truncate">{agency.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{agency.desc}</p>
              </div>

              {/* Arrow */}
              <FaChevronRight className={`text-xs shrink-0 transition-colors ${hovered === agency.id ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>

        <div className="px-6 pb-5">
          <p className="text-[10px] text-center text-gray-400">
            Ce choix peut être modifié à tout moment depuis votre profil.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showChangeAgency, setShowChangeAgency] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('towing');

  // Load stored agency on mount
  useEffect(() => {
    if (status !== 'authenticated') return;
    const stored = localStorage.getItem('amana_selectedAgency');
    if (stored) setSelectedAgency(stored);
    else setShowAgencyModal(true);
  }, [status]);

  // Profile check
  useEffect(() => {
    if (status !== 'authenticated') { setIsCheckingProfile(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const ok = await getProfileStatusCached();
        if (!cancelled) setProfileCompleted(Boolean(ok));
      } catch { /* ok */ } finally {
        if (!cancelled) setIsCheckingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, [status]);

  const handleSelectAgency = (id: string) => {
    localStorage.setItem('amana_selectedAgency', id);
    setSelectedAgency(id);
    setShowAgencyModal(false);
    setShowChangeAgency(false);
  };

  const agency = AGENCIES.find((a) => a.id === selectedAgency);

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-8 sm:px-6 pt-24">

      {/* Agency selection modal */}
      {showAgencyModal && <AgencyModal onSelect={handleSelectAgency} />}

      {/* Change agency modal */}
      {showChangeAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-base font-extrabold text-gray-800">Changer d'agence partenaire</h2>
              <button type="button" onClick={() => setShowChangeAgency(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes />
              </button>
            </div>
            <div className="px-6 pb-6 space-y-3">
              {AGENCIES.map((a) => (
                <button key={a.id} type="button" onClick={() => handleSelectAgency(a.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedAgency === a.id ? a.light + ' shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shrink-0 shadow`}>
                    <span className="text-white font-black text-xs">{a.abbr}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                  </div>
                  {selectedAgency === a.id && <FaCheckDouble className="text-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Customer Space</p>
            <h1 className="text-3xl font-extrabold text-gray-800">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{session?.user?.name || session?.user?.email}</span>
            </p>

            {/* Selected agency badge */}
            {agency && (
              <button
                type="button"
                onClick={() => setShowChangeAgency(true)}
                className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm ${agency.badge}`}
              >
                <span className={`w-2 h-2 rounded-full ${agency.dot}`} />
                {agency.abbr} — {agency.name.split(' ').slice(0, 2).join(' ')}
                <span className="text-[10px] opacity-60 ml-1">· Changer</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/main/contract"
              className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm">
              <FaRegIdCard className="text-xs" /> My Card
            </Link>
            <Link href="/main/accident"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-rose-500/20">
              <FaExclamationTriangle className="text-xs" /> Declare Accident
            </Link>
            <Link href="/main/services/automobile"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40">
              <FaPlus className="text-xs" /> New Insurance
            </Link>
          </div>
        </div>

        {/* Profile completion banner */}
        {!isCheckingProfile && !profileCompleted && (
          <div className="flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <FaRegIdCard className="text-amber-500 text-xl mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">Complete your profile to subscribe</p>
              <p className="text-xs text-amber-600 mt-0.5">Personal info and driver's license details are required before creating an insurance contract.</p>
            </div>
            <Link href="/main/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 px-3 py-2 rounded-xl transition-all shrink-0">
              Complete Profile <FaChevronRight className="text-xs" />
            </Link>
          </div>
        )}

        {/* Agency banner — shows selected agency info */}
        {agency && (
          <div className={`rounded-3xl border-2 p-5 flex items-center gap-5 ${agency.light}`}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${agency.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
              <span className="text-white font-black text-sm">{agency.abbr}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-0.5">Agence partenaire active</p>
              <p className="text-sm font-extrabold text-gray-800">{agency.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{agency.desc}</p>
            </div>
            <button type="button" onClick={() => setShowChangeAgency(true)}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 transition-all shrink-0">
              Changer
            </button>
          </div>
        )}

        {/* Insurance services — primary section */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Nos services d'assurance</h2>
              <p className="text-xs text-gray-500 mt-0.5">Souscrivez en ligne — disponible maintenant ou bientôt</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INSURANCE_SERVICES.map((svc) => {
              const Card = (
                <div
                  key={svc.id}
                  className={`relative flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all ${
                    svc.available
                      ? `${svc.border} ${svc.bg} hover:shadow-md hover:scale-[1.02] cursor-pointer`
                      : 'border-gray-200 bg-gray-50/60 opacity-60 cursor-not-allowed select-none'
                  }`}
                >
                  {!svc.available && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 border border-gray-300">
                      <FaLock className="text-[8px]" /> Bientôt
                    </span>
                  )}
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center shadow-md`}>
                    <svc.icon className="text-white text-base" />
                  </div>
                  <div>
                    <p className={`text-sm font-extrabold ${svc.available ? svc.color : 'text-gray-500'}`}>{svc.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{svc.desc}</p>
                  </div>
                  {svc.available && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${svc.color}`}>
                      Souscrire <FaChevronRight className="text-[8px]" />
                    </span>
                  )}
                </div>
              );
              return svc.available
                ? <Link key={svc.id} href={svc.href}>{Card}</Link>
                : <div key={svc.id}>{Card}</div>;
            })}
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Contracts', value: '2', icon: FaShieldAlt, color: 'text-blue-600 bg-blue-50' },
            { label: 'Open Claims', value: '1', icon: FaClipboardList, color: 'text-amber-600 bg-amber-50' },
            { label: 'Resolved Claims', value: '1', icon: FaCheckCircle, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Pending Payments', value: '0', icon: FaClock, color: 'text-gray-500 bg-gray-100' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white/80 border border-gray-100 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${kpi.color}`}>
                <kpi.icon className="text-sm" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contracts */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <FaShieldAlt className="text-blue-600" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">My Contracts</h2>
              <span className="bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">{mockContracts.length}</span>
            </div>
            <Link href="/main/services/automobile" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              + New <FaChevronRight className="text-xs" />
            </Link>
          </div>
          {mockContracts.length === 0 ? (
            <div className="text-center py-10">
              <FaCar className="text-gray-200 text-4xl mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600">No contracts yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockContracts.map((c) => (
                <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-blue-50/30 hover:border-blue-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <FaCar className="text-blue-600 text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{c.vehicle}</p>
                      <p className="text-xs text-gray-500">{c.id} · {c.coverage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span className="text-xs font-semibold text-gray-600">{c.premium}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(c.status)}`}>{c.status}</span>
                    <span className="text-xs text-gray-400">Exp: {c.expires}</span>
                    <Link href="/main/contract" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-xl transition-all">
                      <FaRegIdCard className="text-xs" /> Carte
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claims */}
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <FaClipboardList className="text-amber-500" />
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">My Claims</h2>
                <span className="bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold px-2 py-0.5 rounded-full">{mockClaims.length}</span>
              </div>
              <Link href="/main/claims" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                View all <FaChevronRight className="text-xs" />
              </Link>
            </div>
            <div className="space-y-3">
              {mockClaims.map((cl) => (
                <div key={cl.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-bold text-gray-800">{cl.id}</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusBadge(cl.status)}`}>{cl.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{cl.description}</p>
                  <p className="text-xs text-gray-400">{cl.date} · {cl.garage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <FaBell className="text-indigo-500" />
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Notifications</h2>
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {mockNotifications.filter(n => !n.read).length} new
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {mockNotifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${n.read ? 'border-gray-100 bg-gray-50/40' : 'border-indigo-100 bg-indigo-50/40'}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-indigo-500'}`} />
                  <div>
                    <p className="text-xs text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service partners */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Partenaires de service</h2>
              <p className="text-xs text-gray-500 mt-0.5">Contactez directement un prestataire agréé Amaneka</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
            {SERVICE_CATEGORIES.map((cat) => {
              const active = activeServiceTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveServiceTab(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all shrink-0 ${
                    active
                      ? `${cat.active} text-white border-transparent shadow-md`
                      : `${cat.bg} ${cat.color} ${cat.border} hover:opacity-80`
                  }`}
                >
                  <cat.icon className="text-xs" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Partner cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(SERVICE_PARTNERS[activeServiceTab] ?? []).map((partner) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.id === activeServiceTab)!;
              return (
                <div key={partner.id}
                  className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:border-gray-200 hover:shadow-sm transition-all">

                  {/* Header row */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.border} border flex items-center justify-center shrink-0`}>
                      <cat.icon className={`${cat.color} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-800 truncate">{partner.name}</p>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          partner.available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}>
                          {partner.available ? '● Disponible' : '○ Indisponible'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FaStar className="text-amber-400 text-[10px]" />
                        <span className="text-[10px] font-semibold text-gray-600">{partner.rating}</span>
                        <span className="text-[10px] text-gray-400">· {partner.wilaya}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-300 text-xs mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-500 leading-tight">{partner.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-300 text-xs shrink-0" />
                      <p className="text-xs text-gray-500">{partner.hours}</p>
                    </div>
                  </div>

                  {/* Call button */}
                  <a
                    href={`tel:${partner.phone}`}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all ${
                      partner.available
                        ? `${cat.bg} ${cat.color} ${cat.border} hover:opacity-80`
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <FaPhone className="text-xs" />
                    {partner.phone}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'New Insurance', href: '/main/services/automobile', icon: FaPlus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100' },
              { label: 'Declare Accident', href: '/main/accident', icon: FaExclamationTriangle, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100' },
              { label: 'Track Claims', href: '/main/claims', icon: FaClipboardList, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100' },
              { label: 'My Profile', href: '/main/profile', icon: FaRegIdCard, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100' },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all ${action.color}`}>
                <action.icon className="text-xl" />
                <span className="text-xs font-semibold">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
