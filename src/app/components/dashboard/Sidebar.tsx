"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaTachometerAlt, FaUsers, FaFileAlt, FaExclamationTriangle,
  FaShieldAlt, FaHandshake, FaBars, FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import LogOut from "../other/LogOut";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Vue générale",
    items: [
      { href: "/dashboard",          label: "Tableau de bord", icon: FaTachometerAlt },
      { href: "/dashboard/users",    label: "Clients",         icon: FaUsers },
    ],
  },
  {
    title: "Gestion",
    items: [
      { href: "/dashboard/contrats",  label: "Contrats",       icon: FaFileAlt },
      { href: "/dashboard/demandes",  label: "Déclarations",   icon: FaExclamationTriangle },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { href: "/dashboard/garanties", label: "Garanties",      icon: FaShieldAlt },
      { href: "/dashboard/partners",  label: "Partenaires",    icon: FaHandshake },
    ],
  },
];

function useIsActive(href: string) {
  const pathname = usePathname();
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const active = useIsActive(item.href);
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
      }`}
    >
      <item.icon className={`text-sm shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
      <span>{item.label}</span>
    </Link>
  );
}

function NavSections({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <div className="space-y-5 flex-grow w-full">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onClick={onLinkClick} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function DashboardSidebar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status !== "authenticated" || session?.user?.role !== "ADMIN") return null;

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <FaShieldAlt className="text-white text-xs" />
          </div>
          <span className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            Amaneka Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          {mobileOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
        <div className={`absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col p-4 pt-16 shadow-xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <NavSections onLinkClick={close} />
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="text-xs text-slate-400 px-1 mb-3 truncate">{session.user?.email}</div>
            <LogOut />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-white border-r border-gray-100 p-4 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-1 mb-8 pt-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
            <FaShieldAlt className="text-white text-xs" />
          </div>
          <div>
            <p className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight leading-none">
              Amaneka
            </p>
            <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
          </div>
        </div>

        <NavSections />

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-1 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {session.user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{session.user?.name ?? "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <LogOut />
        </div>
      </aside>
    </>
  );
}
