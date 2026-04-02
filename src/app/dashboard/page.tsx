"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  FaArrowTrendUp,
  FaChartLine,
  FaChartPie,
  FaClipboardCheck,
  FaClock,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa6";
import { FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";

type TrendPoint = {
  label: string;
  users: number;
  demandes: number;
};

type StatusSlice = {
  label: string;
  value: number;
  color: string;
};

const monthlyTrend: TrendPoint[] = [
  { label: "Jan", users: 36, demandes: 18 },
  { label: "Fév", users: 42, demandes: 22 },
  { label: "Mar", users: 48, demandes: 27 },
  { label: "Avr", users: 55, demandes: 31 },
  { label: "Mai", users: 63, demandes: 34 },
  { label: "Juin", users: 71, demandes: 39 },
  { label: "Juil", users: 79, demandes: 45 },
  { label: "Août", users: 84, demandes: 48 },
  { label: "Sep", users: 92, demandes: 54 },
  { label: "Oct", users: 101, demandes: 57 },
  { label: "Nov", users: 112, demandes: 61 },
  { label: "Déc", users: 124, demandes: 67 },
];

const demandStatusSlices: StatusSlice[] = [
  { label: "En attente", value: 16, color: "#f59e0b" },
  { label: "En revue", value: 9, color: "#0ea5e9" },
  { label: "Acceptées", value: 22, color: "#10b981" },
  { label: "Refusées", value: 5, color: "#ef4444" },
];

const alertItems = [
  {
    title: "7 dossiers prioritaires",
    text: "Des demandes accident nécessitent une réponse aujourd'hui.",
    tone: "amber",
  },
  {
    title: "3 pièces manquantes",
    text: "Certains dossiers attendent encore un PV ou une photo lisible.",
    tone: "blue",
  },
  {
    title: "2 comptes incomplets",
    text: "Les profils clients doivent être complétés avant validation.",
    tone: "slate",
  },
];

const recentActivity = [
  {
    title: "Dossier ACC-2026-0142",
    meta: "Accepté par l'équipe sinistres",
    time: "Il y a 12 min",
  },
  {
    title: "Dossier ACC-2026-0133",
    meta: "Passé en revue pour contrôle complémentaire",
    time: "Il y a 34 min",
  },
  {
    title: "Nouveau compte client",
    meta: "Profil utilisateur créé avec 84 % de complétion",
    time: "Il y a 1 h",
  },
  {
    title: "Dossier finalisé",
    meta: "Un nouveau dossier a été validé",
    time: "Il y a 2 h",
  },
];

const opsQueue = [
  {
    label: "Demandes en attente",
    value: 16,
    helper: "À traiter en priorité",
    icon: <FaClock />,
  },
  {
    label: "Demandes acceptées",
    value: 22,
    helper: "Prêtes pour indemnisation",
    icon: <FaClipboardCheck />,
  },
  {
    label: "Utilisateurs actifs",
    value: 124,
    helper: "Connectés sur les 30 derniers jours",
    icon: <FaUsers />,
  },
  {
    label: "Complétion moyenne",
    value: 87,
    helper: "Dossiers presque complets",
    icon: <FaUserCheck />,
  },
];

export default function Dashboard() {
  const { data: session, status } = useSession();

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  const kpis = useMemo(
    () => [
      {
        label: "Utilisateurs",
        value: "124",
        delta: "+18 %",
        note: "Par rapport au mois précédent",
        icon: <FaUsers />,
      },
      {
        label: "Demandes",
        value: "67",
        delta: "+11 %",
        note: "Nouvelles déclarations accident",
        icon: <FaShieldAlt />,
      },
      {
        label: "Dossiers finalisés",
        value: "64",
        delta: "+24 %",
        note: "Dossiers validés et clôturés",
        icon: <FaChartLine />,
      },
      {
        label: "Taux d’acceptation",
        value: "81 %",
        delta: "+4 pts",
        note: "Dossiers validés au premier passage",
        icon: <FaArrowTrendUp />,
      },
    ],
    []
  );

  if (status === "loading") {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-7xl rounded-3xl border border-cyan-400/30 bg-white/80 p-8 shadow-xl">
        Chargement du tableau de bord...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-red-200 bg-white/90 p-8 text-red-700 shadow-xl">
        Acces refuse. Le tableau de bord est reserve aux administrateurs.
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
      <section
        className="rounded-3xl border border-cyan-500/30 p-6 text-white shadow-2xl md:p-8"
        style={{
          backgroundImage: "linear-gradient(135deg, #020617 0%, #0f172a 52%, #1e293b 100%)",
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <FaChartPie /> Tableau de bord
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Pilotage temps réel de la plateforme Amana.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Suivez l&apos;activité des utilisateurs, le volume de demandes accident, les dossiers
              et le niveau de traitement opérationnel depuis une vue unifiée.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur md:grid-cols-4">
            <MiniStat label="Comptes" value="124" helper="Utilisateurs actifs" />
            <MiniStat label="Demandes" value="67" helper="Sinistres / déclarations" />
            <MiniStat label="Validés" value="64" helper="Dossiers finalisés" />
            <MiniStat label="Taux" value="81 %" helper="Acceptation moyenne" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl transition hover:-translate-y-0.5 hover:border-cyan-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-black text-slate-900">{item.value}</p>
              </div>
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">{item.icon}</div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {item.delta}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Tendances mensuelles</h2>
              <p className="mt-1 text-sm text-slate-500">
                Croissance des utilisateurs et demandes sur les 12 derniers mois.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <FaChartLine /> Vue globale
            </div>
          </div>
          <TrendChart points={monthlyTrend} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Statut des demandes</h2>
              <p className="mt-1 text-sm text-slate-500">
                Répartition des déclarations accident à traiter.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <FaClock /> Pipeline
            </div>
          </div>
          <StatusDonut slices={demandStatusSlices} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Pipeline opérationnel</h2>
              <p className="mt-1 text-sm text-slate-500">
                État du traitement des demandes et de la base client.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {opsQueue.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-cyan-700 shadow-sm">{item.icon}</div>
                </div>
                <p className="mt-4 text-3xl font-black text-slate-900">{item.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="mt-0.5 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-amber-800">Alertes à surveiller</p>
                <ul className="mt-3 space-y-2 text-sm text-amber-700">
                  {alertItems.map((item) => (
                    <li key={item.title} className="rounded-xl bg-white/70 px-3 py-2">
                      <span className="font-semibold">{item.title}</span> - {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Activité récente</h2>
              <p className="mt-1 text-sm text-slate-500">Dernières actions enregistrées dans la plateforme.</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.meta}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    {item.time}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-sm font-bold text-cyan-800">Session connectée</p>
            <p className="mt-2 text-sm text-cyan-700">
              {session?.user?.name ?? session?.user?.email ?? "Administrateur"} - accès complet aux modules de gestion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  helper,
}: Readonly<{
  label: string;
  value: string;
  helper: string;
}>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

function TrendChart({ points }: Readonly<{ points: TrendPoint[] }>) {
  const maxValue = Math.max(...points.map((point) => Math.max(point.users, point.demandes)));

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-end gap-2">
          {points.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-56 w-full items-end gap-1.5 rounded-2xl bg-white/60 p-2">
                <Bar value={point.users} max={maxValue} color="#06b6d4" />
                <Bar value={point.demandes} max={maxValue} color="#3b82f6" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <LegendSwatch color="#06b6d4" label="Utilisateurs" />
        <LegendSwatch color="#3b82f6" label="Demandes" />
      </div>
    </div>
  );
}

function Bar({
  value,
  max,
  color,
}: Readonly<{
  value: number;
  max: number;
  color: string;
}>) {
  const height = `${Math.max((value / max) * 100, 8)}%`;

  return (
    <div className="flex w-full justify-center">
      <div
        className="w-3 rounded-t-full shadow-sm"
        style={{
          height,
          background: `linear-gradient(to top, ${color}, rgba(255,255,255,0.2))`,
        }}
      />
    </div>
  );
}

function LegendSwatch({
  color,
  label,
}: Readonly<{
  color: string;
  label: string;
}>) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}

function StatusDonut({ slices }: Readonly<{ slices: StatusSlice[] }>) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let cumulative = 0;

  const segments = slices
    .map((slice) => {
      const start = (cumulative / total) * 100;
      cumulative += slice.value;
      const end = (cumulative / total) * 100;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative flex h-64 w-64 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${segments})`,
        }}
      >
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white text-center shadow-xl">
          <p className="text-3xl font-black text-slate-900">{total}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dossiers
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-sm font-semibold text-slate-700">{slice.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{slice.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}