"use client";

import ChartPlaceholder from './ChartPlaceholder';

export default function AdminOverview() {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500/25 mb-4">
        Vue d&apos;ensemble
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-blue-600/20 hover:bg-white/10 transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Activité utilisateurs</h3>
          <ChartPlaceholder />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-cyan-500/20 hover:bg-white/10 transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Dossiers complétés</h3>
          <ChartPlaceholder />
        </div>
      </div>
    </section>
  );
}