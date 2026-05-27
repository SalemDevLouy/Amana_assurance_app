"use client";

import Link from "next/link";
import { FaArrowLeft, FaClipboardList, FaCheckCircle, FaClock, FaTimes, FaSearch, FaTools, FaCar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

type ClaimStatus = "Under Review" | "Expert Assigned" | "Inspection Scheduled" | "Repair in Progress" | "Resolved" | "Rejected";

type ClaimEvent = { date: string; label: string; done: boolean };

type Claim = {
  id: string;
  contractId: string;
  vehicle: string;
  date: string;
  description: string;
  status: ClaimStatus;
  garage?: string;
  expert?: string;
  repairETA?: string;
  timeline: ClaimEvent[];
};

const mockClaims: Claim[] = [
  {
    id: "CLM-2026-012",
    contractId: "AMT-2026-001",
    vehicle: "Peugeot 208 – 2021",
    date: "2026-04-10",
    description: "Rear-end collision on highway RN5 near Blida. Significant bumper and trunk damage.",
    status: "Repair in Progress",
    expert: "Karim Benali (Expert #04)",
    garage: "Garage Central Alger – Bab Ezzouar",
    repairETA: "2026-05-28",
    timeline: [
      { date: "Apr 10", label: "Declaration submitted", done: true },
      { date: "Apr 10", label: "Expert assigned", done: true },
      { date: "Apr 14", label: "Inspection completed", done: true },
      { date: "Apr 16", label: "Repair order sent to garage", done: true },
      { date: "May 20", label: "Parts ordered & received", done: true },
      { date: "May 22", label: "Repair started", done: true },
      { date: "May 28", label: "Repair completed", done: false },
      { date: "Jun 01", label: "Vehicle ready for pickup", done: false },
    ],
  },
  {
    id: "CLM-2025-088",
    contractId: "AMT-2026-001",
    vehicle: "Peugeot 208 – 2021",
    date: "2025-11-22",
    description: "Door dented in parking lot by unknown vehicle.",
    status: "Resolved",
    expert: "Samia Hadj (Expert #11)",
    garage: "Auto Repair Oran",
    timeline: [
      { date: "Nov 22", label: "Declaration submitted", done: true },
      { date: "Nov 23", label: "Expert assigned", done: true },
      { date: "Nov 25", label: "Inspection completed", done: true },
      { date: "Nov 27", label: "Repair order issued", done: true },
      { date: "Dec 02", label: "Repair completed", done: true },
      { date: "Dec 03", label: "Vehicle returned", done: true },
    ],
  },
];

const statusConfig: Record<ClaimStatus, { color: string; icon: React.ElementType; label: string }> = {
  "Under Review": { color: "bg-amber-50 text-amber-700 border-amber-200", icon: FaClock, label: "Under Review" },
  "Expert Assigned": { color: "bg-blue-50 text-blue-700 border-blue-200", icon: FaSearch, label: "Expert Assigned" },
  "Inspection Scheduled": { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: FaClipboardList, label: "Inspection Scheduled" },
  "Repair in Progress": { color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: FaTools, label: "Repair in Progress" },
  "Resolved": { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: FaCheckCircle, label: "Resolved" },
  "Rejected": { color: "bg-red-50 text-red-700 border-red-200", icon: FaTimes, label: "Rejected" },
};

export default function ClaimsPage() {
  const [expandedId, setExpandedId] = useState<string | null>("CLM-2026-012");

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link href="/main" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <FaArrowLeft className="text-xs" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <FaClipboardList className="text-amber-600 text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">My Claims</h1>
                <p className="text-sm text-gray-500">Track your accident claims and repair status.</p>
              </div>
            </div>
            <Link
              href="/main/accident"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md shadow-rose-500/20 shrink-0"
            >
              + New Claim
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Claims", value: mockClaims.length, color: "text-gray-800 bg-white border-gray-100" },
            { label: "In Progress", value: mockClaims.filter((c) => !["Resolved", "Rejected"].includes(c.status)).length, color: "text-blue-700 bg-blue-50 border-blue-100" },
            { label: "Resolved", value: mockClaims.filter((c) => c.status === "Resolved").length, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center shadow-sm ${s.color}`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Claims list */}
        <div className="space-y-4">
          {mockClaims.map((claim) => {
            const cfg = statusConfig[claim.status];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === claim.id;

            return (
              <div key={claim.id} className="bg-white/80 border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                {/* Claim header */}
                <button
                  type="button"
                  className="w-full text-left p-5 sm:p-6 hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCar className="text-gray-500 text-xs" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-extrabold text-gray-800">{claim.id}</p>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                            <StatusIcon className="text-xs" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-0.5">{claim.vehicle} · {claim.date}</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{claim.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-gray-400">
                      {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 pt-5 space-y-5">
                    {/* Info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Expert", value: claim.expert ?? "—" },
                        { label: "Garage", value: claim.garage ?? "—" },
                        { label: "Repair ETA", value: claim.repairETA ?? "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
                          <p className="text-xs font-bold text-gray-700">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                      <p className="text-sm text-gray-700">{claim.description}</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-4">Repair Timeline</p>
                      <div className="relative">
                        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-200" />
                        <div className="space-y-3">
                          {claim.timeline.map((event, idx) => (
                            <div key={idx} className="flex items-start gap-4 relative">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${event.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                                {event.done
                                  ? <FaCheckCircle className="text-white text-xs" />
                                  : <div className="w-2 h-2 rounded-full bg-gray-400" />
                                }
                              </div>
                              <div className="pb-1">
                                <p className={`text-sm font-semibold ${event.done ? "text-gray-800" : "text-gray-400"}`}>{event.label}</p>
                                <p className={`text-xs mt-0.5 ${event.done ? "text-gray-500" : "text-gray-300"}`}>{event.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {mockClaims.length === 0 && (
          <div className="bg-white/80 border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
            <FaClipboardList className="text-gray-200 text-4xl mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-600">No claims yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">Your accident declarations will appear here.</p>
            <Link
              href="/main/accident"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-rose-700 transition-all"
            >
              Declare an Accident
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
