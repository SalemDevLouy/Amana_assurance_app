"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaClipboardList, FaCheckCircle, FaShieldAlt, FaExclamationTriangle, FaClock, FaUserCheck, FaChartLine } from "react-icons/fa";

type TrendPoint = { label: string; users: number; claims: number };
type StatusSlice = { label: string; value: number; color: string };

const monthlyTrend: TrendPoint[] = [
  { label: "Jan", users: 36, claims: 18 }, { label: "Feb", users: 42, claims: 22 },
  { label: "Mar", users: 48, claims: 27 }, { label: "Apr", users: 55, claims: 31 },
  { label: "May", users: 63, claims: 34 }, { label: "Jun", users: 71, claims: 39 },
  { label: "Jul", users: 79, claims: 45 }, { label: "Aug", users: 84, claims: 48 },
  { label: "Sep", users: 92, claims: 54 }, { label: "Oct", users: 101, claims: 57 },
  { label: "Nov", users: 112, claims: 61 }, { label: "Dec", users: 124, claims: 67 },
];

const claimStatusSlices: StatusSlice[] = [
  { label: "Pending", value: 16, color: "#f59e0b" },
  { label: "Under Review", value: 9, color: "#0ea5e9" },
  { label: "Approved", value: 22, color: "#10b981" },
  { label: "Rejected", value: 5, color: "#ef4444" },
];

const alerts = [
  { title: "7 priority claims", text: "Accident declarations require attention today.", tone: "amber" },
  { title: "3 documents missing", text: "Some files are awaiting a police report or photo.", tone: "blue" },
  { title: "2 incomplete profiles", text: "Customer profiles must be completed before validation.", tone: "slate" },
];

const recentActivity = [
  { title: "Claim CLM-2026-0142", meta: "Approved by the claims team", time: "12 min ago" },
  { title: "Claim CLM-2026-0133", meta: "Passed to review for additional checks", time: "34 min ago" },
  { title: "New customer account", meta: "Profile created with 84% completion", time: "1 hr ago" },
  { title: "Contract finalized", meta: "New policy AMT-2026-091 issued", time: "2 hr ago" },
];

const opsQueue = [
  { label: "Pending Claims", value: 16, helper: "Requires immediate attention", icon: FaClock },
  { label: "Approved Claims", value: 22, helper: "Ready for compensation", icon: FaCheckCircle },
  { label: "Active Customers", value: 124, helper: "Logged in last 30 days", icon: FaUsers },
  { label: "Profile Completion", value: "87%", helper: "Average across all accounts", icon: FaUserCheck },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  const kpis = useMemo(() => [
    { label: "Total Customers", value: "124", delta: "+18%", note: "vs last month", icon: FaUsers, color: "bg-blue-50 text-blue-600" },
    { label: "Total Claims", value: "67", delta: "+11%", note: "New accident declarations", icon: FaClipboardList, color: "bg-amber-50 text-amber-600" },
    { label: "Resolved Claims", value: "64", delta: "+24%", note: "Validated and closed", icon: FaCheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Approval Rate", value: "81%", delta: "+4pts", note: "First-pass validation rate", icon: FaShieldAlt, color: "bg-indigo-50 text-indigo-600" },
  ], []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 text-sm text-gray-500 shadow-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="bg-white border border-red-100 rounded-3xl p-8 text-sm text-red-600 shadow-sm max-w-sm text-center">
          Access denied. This dashboard is restricted to administrators.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Hero banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-7 sm:p-10 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">Admin Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Amaneka Platform Overview
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Monitor customer accounts, insurance contracts, claims pipeline, and platform performance in real-time.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Signed in as <span className="text-cyan-400 font-semibold">{session?.user?.name ?? session?.user?.email}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: "Customers", value: "124" }, { label: "Claims", value: "67" },
              { label: "Resolved", value: "64" }, { label: "Rate", value: "81%" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/8 border border-white/10 p-3 text-center">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white/80 border border-gray-100 rounded-3xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="text-sm" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{kpi.delta}</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{kpi.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-1">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Monthly Trends</h2>
              <p className="text-xs text-slate-500 mt-1">Customer growth and claims volume over the last 12 months.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <FaChartLine className="text-xs" /> 12 months
            </div>
          </div>
          <TrendChart points={monthlyTrend} />
        </div>

        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Claim Status</h2>
            <p className="text-xs text-slate-500 mt-1">Distribution of accident declarations by processing state.</p>
          </div>
          <StatusDonut slices={claimStatusSlices} />
        </div>
      </div>

      {/* Ops + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Operational Pipeline</h2>
            <p className="text-xs text-slate-500 mt-1">Real-time processing status across claims and customers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {opsQueue.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.helper}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <item.icon className="text-blue-500 text-xs" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-2">Active Alerts</p>
                <ul className="space-y-2">
                  {alerts.map((a) => (
                    <li key={a.title} className="rounded-xl bg-white/70 px-3 py-2 text-xs text-amber-700">
                      <span className="font-semibold">{a.title}</span> — {a.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500 mt-1">Latest actions recorded on the platform.</p>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.meta}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-full">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function TrendChart({ points }: Readonly<{ points: TrendPoint[] }>) {
  const maxVal = Math.max(...points.flatMap((p) => [p.users, p.claims]));
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-end gap-1.5 h-48">
          {points.map((pt) => (
            <div key={pt.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-40 w-full items-end gap-0.5 rounded-xl bg-white/60 p-1.5">
                <div className="flex-1 rounded-t-full" style={{ height: `${Math.max((pt.users / maxVal) * 100, 6)}%`, background: "linear-gradient(to top, #3b82f6, #93c5fd)" }} />
                <div className="flex-1 rounded-t-full" style={{ height: `${Math.max((pt.claims / maxVal) * 100, 6)}%`, background: "linear-gradient(to top, #06b6d4, #a5f3fc)" }} />
              </div>
              <span className="text-[10px] font-medium text-slate-400">{pt.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {[{ color: "#3b82f6", label: "Customers" }, { color: "#06b6d4", label: "Claims" }].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDonut({ slices }: Readonly<{ slices: StatusSlice[] }>) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  let cum = 0;
  const segments = slices.map((sl) => {
    const start = (cum / total) * 100;
    cum += sl.value;
    return `${sl.color} ${start}% ${(cum / total) * 100}%`;
  }).join(", ");
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-48 h-48 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${segments})` }}>
        <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-lg">
          <p className="text-3xl font-extrabold text-slate-900">{total}</p>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Claims</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {slices.map((sl) => (
          <div key={sl.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sl.color }} />
              <span className="text-xs font-medium text-slate-700">{sl.label}</span>
            </div>
            <span className="text-xs font-bold text-slate-900">{sl.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
