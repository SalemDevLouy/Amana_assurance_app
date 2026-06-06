"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaCar, FaExclamationTriangle, FaUser } from "react-icons/fa";

const TABS = [
  {
    href: "/main",
    label: "Accueil",
    icon: FaHome,
    match: (p: string) => p === "/main",
  },
  {
    href: "/main/services/automobile",
    label: "Auto",
    icon: FaCar,
    match: (p: string) =>
      p.startsWith("/main/services") || p.startsWith("/main/newassurance"),
  },
  {
    href: "/main/accident",
    label: "Sinistre",
    icon: FaExclamationTriangle,
    match: (p: string) =>
      p.startsWith("/main/accident") || p.startsWith("/main/claims") || p.startsWith("/main/demmande"),
  },
  {
    href: "/main/profile",
    label: "Profil",
    icon: FaUser,
    match: (p: string) => p.startsWith("/main/profile"),
  },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom padding on mobile to clear the tab bar */}
      <div className="pb-20 md:pb-0">{children}</div>

      {/* ── Mobile bottom tab bar ─────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* safe-area inset for iPhone home indicator */}
        <div className="border-t border-gray-100 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="flex items-stretch">
            {TABS.map((tab) => {
              const active = tab.match(pathname);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors ${
                    active ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {/* top indicator line */}
                  {active && (
                    <span className="absolute top-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-b-full bg-blue-600" />
                  )}
                  <tab.icon
                    className={`text-[18px] transition-transform ${
                      active ? "scale-110 text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold tracking-tight ${
                      active ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
          {/* iOS home-indicator safe area */}
          <div className="h-safe-bottom" style={{ height: "env(safe-area-inset-bottom)" }} />
        </div>
      </nav>
    </>
  );
}
