"use client";
import React, { useEffect, useState } from 'react';
import { Stat } from '../../types/types';

const ACCENT_COLORS = ['#e879f9', '#22d3ee', '#a78bfa'];

export default function Statistics() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setStats(data);
      } catch (error: unknown) {
        if (error instanceof Error) console.error('Error fetching statistics:', error.message);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500/25 mb-4">
        Statistiques globales
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.length === 0 ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
          ))
        ) : (
          stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-blue-600/30 hover:bg-white/10 transition-all duration-300 group"
            >
              <div
                className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: ACCENT_COLORS[index % 3] }}
              />
              <p className="text-gray-500/50 text-xs font-medium uppercase tracking-wider mb-3 capitalize">
                {stat.metric}
              </p>
              <p className="text-3xl font-extrabold" style={{ color: ACCENT_COLORS[index % 3] }}>
                {stat.value}
              </p>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((stat.value / 100) * 100, 100)}%`,
                    background: `linear-gradient(to right, ${ACCENT_COLORS[index % 3]}, #22d3ee)`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}