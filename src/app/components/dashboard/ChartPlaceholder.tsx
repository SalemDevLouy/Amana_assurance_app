"use client"; // Added for client-side rendering if interactivity is needed

import React from 'react';

export default function ChartPlaceholder() {
  return (
    <div className="w-full h-56 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3">
      <div className="flex gap-1 items-end h-16">
        {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
          <div
            key={i}
            className="w-5 rounded-t-sm bg-gradient-to-t from-blue-600/60 to-cyan-500/60"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="text-gray-500/30 text-xs font-medium">Aperçu graphique</p>
    </div>
  );
}