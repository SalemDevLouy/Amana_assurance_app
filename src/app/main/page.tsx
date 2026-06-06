"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaCar, FaHome, FaPlaneDeparture, FaIndustry, FaStore,
  FaUmbrella, FaChevronRight, FaLock, FaRegIdCard,
} from "react-icons/fa";
import { getProfileStatusCached } from "@/app/lib/clientCache";

const INSURANCE_SERVICES = [
  {
    id: "auto",
    label: "Automobile",
    desc: "Tous risques, tiers et plus",
    icon: FaCar,
    gradient: "from-blue-600 to-cyan-500",
    bg: "bg-blue-50",
    color: "text-blue-600",
    border: "border-blue-200",
    available: true,
    href: "/main/services/automobile",
  },
  {
    id: "habitation",
    label: "Habitation",
    desc: "Maison, appartement, locataire",
    icon: FaHome,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    border: "border-emerald-200",
    available: false,
    href: "#",
  },
  {
    id: "voyage",
    label: "Voyage",
    desc: "Couverture nationale et internationale",
    icon: FaPlaneDeparture,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    color: "text-violet-600",
    border: "border-violet-200",
    available: false,
    href: "#",
  },
  {
    id: "industrie",
    label: "Industrie",
    desc: "Risques industriels et équipements",
    icon: FaIndustry,
    gradient: "from-gray-600 to-gray-800",
    bg: "bg-gray-50",
    color: "text-gray-600",
    border: "border-gray-200",
    available: false,
    href: "#",
  },
  {
    id: "commerce",
    label: "Commerce",
    desc: "Fonds de commerce et locaux pros",
    icon: FaStore,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    color: "text-amber-600",
    border: "border-amber-200",
    available: false,
    href: "#",
  },
  {
    id: "multirisque",
    label: "Multirisque",
    desc: "Protection globale personnalisée",
    icon: FaUmbrella,
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    color: "text-rose-600",
    border: "border-rose-200",
    available: false,
    href: "#",
  },
  {
    id: "agricole",
    label: "Agricole",
    desc: "Récoltes, matériel et cheptel",
    icon: FaIndustry,
    gradient: "from-lime-500 to-green-600",
    bg: "bg-lime-50",
    color: "text-lime-700",
    border: "border-lime-200",
    available: false,
    href: "#",
  },
];

export default function MainPage() {
  const { data: session, status } = useSession();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-3 pt-20 pb-6 sm:px-6 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Welcome header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Espace client</p>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Bonjour, <span className="text-blue-600">{session?.user?.name?.split(" ")[0] ?? "—"}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Choisissez un service d'assurance pour commencer.</p>
        </div>

        {/* Profile completion banner */}
        {!isCheckingProfile && !profileCompleted && (
          <div className="flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <FaRegIdCard className="mt-0.5 shrink-0 text-xl text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">Complétez votre profil pour souscrire</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Vos informations personnelles et permis de conduire sont requis avant de créer un contrat.
              </p>
            </div>
            <Link
              href="/main/profile"
              className="inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-amber-200 bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition-all hover:bg-amber-200"
            >
              Compléter <FaChevronRight className="text-xs" />
            </Link>
          </div>
        )}

        {/* Services grid */}
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">Nos services d'assurance</h2>
            <p className="mt-0.5 text-xs text-gray-500">Souscrivez en ligne — disponible maintenant ou bientôt</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INSURANCE_SERVICES.map((svc) => {
              const card = (
                <div
                  className={`relative flex flex-col gap-3 rounded-2xl border-2 p-4 transition-all ${
                    svc.available
                      ? `${svc.border} ${svc.bg} cursor-pointer hover:scale-[1.02] hover:shadow-md`
                      : "cursor-not-allowed select-none border-gray-200 bg-gray-50/60 opacity-60"
                  }`}
                >
                  {!svc.available && (
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500">
                      <FaLock className="text-[8px]" /> Bientôt
                    </span>
                  )}
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${svc.gradient}`}>
                    <svc.icon className="text-base text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-extrabold ${svc.available ? svc.color : "text-gray-500"}`}>
                      {svc.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-gray-400">{svc.desc}</p>
                  </div>
                  {svc.available && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${svc.color}`}>
                      Accéder <FaChevronRight className="text-[8px]" />
                    </span>
                  )}
                </div>
              );

              return svc.available ? (
                <Link key={svc.id} href={svc.href}>{card}</Link>
              ) : (
                <div key={svc.id}>{card}</div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
