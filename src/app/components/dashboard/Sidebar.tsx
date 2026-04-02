"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react"
import { FaTachometerAlt, FaUsers, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import LogOut from '../other/LogOut';

export default function DashboardSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/dashboard/users', label: 'Utilisateurs', icon: <FaUsers /> },
    {href: '/dashboard/demandes', label: 'G. des demandes', icon: <FaCog /> },
    { href: '/dashboard/garanties', label: 'Gestion des garanties', icon: <FaCog /> },
    
  ];

  if (status !== "authenticated" || session?.user?.role !== "ADMIN") return null;

  const NavLinks = () => (
    <ul className="space-y-1 flex-grow w-full">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-linear-to-r from-blue-600/20 to-cyan-500/20 border border-blue-600/30 text-gray-500'
                  : 'bg-gray-100/50 text-gray-500/50 hover:text-gray-500 hover:bg-white/80'
              }`}
            >
              <span className={`text-base ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_2px_rgba(217,70,239,0.5)]" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0d0d18]/90 backdrop-blur-xl border-b border-white/10">
        <span className="text-gray-500 font-bold text-sm tracking-wide">Admin Panel</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-500/60 hover:text-gray-500 transition-colors p-1"
        >
          {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-64 bg-[#0d0d18] border-r border-white/10 flex flex-col p-4 pt-16 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-6 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/60">Navigation</span>
          </div>
          <NavLinks />
          <div className="mt-auto pt-4 border-t border-white/10">
            <LogOut />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen bg-cyan-600/20  rounded-r-2xl backdrop-blur-xl  p-4 shadow-2xl">
        <div className="mb-8 px-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <FaTachometerAlt className="text-gray-100 text-xs" />
            </div>
            <span className="text-blue-700 font-bold text-sm tracking-wide">Amana Panel</span>
          </div>
          <p className="text-gray-500/80 text-xs mt-2 px-0.5 truncate">{session.user?.email}</p>
        </div>

        <div className="mb-2 px-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">Navigation</span>
        </div>
        <NavLinks />

        <div className="mt-auto pt-4 border-t border-white/10">
          <LogOut />
        </div>
      </aside>
    </>
  );
}
