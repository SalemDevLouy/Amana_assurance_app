"use client";

import React from "react";
import { ConstatForm } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  prev: () => void;
  submit: () => void;
};

export default function Step6({ form, setForm, prev, submit }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 6 — Observations & Signatures</h2>

      <label className="block text-sm font-medium">Observations</label>
      <textarea className="w-full rounded border px-3 py-2 mt-2" rows={4} value={form.observations ?? ""} onChange={(e) => setForm((p) => ({ ...p, observations: e.target.value }))} />

      <p className="mt-3 text-sm text-gray-600">Digital signature capture is not fully implemented in this scaffold. Use device camera or a signature component later.</p>

      <div className="mt-6 flex gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={prev}>Back</button>
        <button type="button" className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={submit}>Submit Constat</button>
      </div>
    </div>
  );
}
