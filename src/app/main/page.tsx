"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaShieldAlt, FaCar, FaExclamationTriangle, FaBell,
  FaPlus, FaClipboardList, FaCheckCircle, FaClock, FaChevronRight, FaRegIdCard
} from 'react-icons/fa';
import { getProfileStatusCached } from '@/app/lib/clientCache';

const mockContracts = [
  { id: 'AMT-2026-001', vehicle: 'Peugeot 208 – 2021', coverage: 'Full Coverage', status: 'Active', premium: '18 500 DA/yr', expires: '2027-03-15' },
  //{ id: 'AMT-2026-047', vehicle: 'Renault Symbol – 2019', coverage: 'Third-Party', status: 'Pending', premium: '9 200 DA/yr', expires: '2027-06-01' },
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

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-8 sm:px-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Customer Space</p>
            <h1 className="text-3xl font-extrabold text-gray-800">
              My Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{session?.user?.name || session?.user?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/main/accident"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-rose-500/20"
            >
              <FaExclamationTriangle className="text-xs" />
              Declare Accident
            </Link>
            <Link
              href="/main/newassurance"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <FaPlus className="text-xs" />
              New Insurance
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
            <Link
              href="/main/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 px-3 py-2 rounded-xl transition-all shrink-0"
            >
              Complete Profile
              <FaChevronRight className="text-xs" />
            </Link>
          </div>
        )}

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
            <Link href="/main/newassurance" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              + New <FaChevronRight className="text-xs" />
            </Link>
          </div>

          {mockContracts.length === 0 ? (
            <div className="text-center py-10">
              <FaCar className="text-gray-200 text-4xl mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600">No contracts yet.</p>
              <p className="text-xs text-gray-400 mt-1">Start by subscribing to your first policy.</p>
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

        {/* Quick actions */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'New Insurance', href: '/main/newassurance', icon: FaPlus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100' },
              { label: 'Declare Accident', href: '/main/accident', icon: FaExclamationTriangle, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100' },
              { label: 'Track Claims', href: '/main/claims', icon: FaClipboardList, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100' },
              { label: 'My Profile', href: '/main/profile', icon: FaRegIdCard, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all ${action.color}`}
              >
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
