"use client";

import React from "react";
import { ConstatForm } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  next: () => void;
  prev: () => void;
};

const ZONES = ["front", "front-left", "front-right", "rear", "rear-left", "rear-right", "left-side", "right-side", "roof"];

export default function Step4({ form, setForm, next, prev }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 4 — Point of Impact & Damages</h2>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {ZONES.map((z) => (
          <button key={z} type="button" onClick={() => setForm((p) => ({ ...p, pointOfImpact: z }))} className={`px-2 py-2 rounded border ${form.pointOfImpact === z ? "bg-blue-600 text-white" : "bg-white"}`}>
            {z}
          </button>
        ))}
      </div>

      <label className="block text-sm font-medium">Apparent damages</label>
      <textarea className="w-full rounded border px-3 py-2 mt-2" rows={4} value={form.apparentDamages ?? ""} onChange={(e) => setForm((p) => ({ ...p, apparentDamages: e.target.value }))} />

      <div className="mt-6 flex gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={prev}>Back</button>
        <button type="button" className="rounded bg-cyan-600 px-4 py-2 text-white" onClick={next}>Next</button>
      </div>
    </div>
  );
}
