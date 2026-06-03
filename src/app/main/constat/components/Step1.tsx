"use client";

import React from "react";
import { ConstatForm } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  next: () => void;
};

export default function Step1({ form, setForm, next }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 1 — Incident metadata</h2>

      <label className="block text-sm font-medium">Date & Time</label>
      <input
        type="datetime-local"
        className="mt-1 mb-3 w-full rounded border px-3 py-2"
        value={form.dateTime}
        onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
      />

      <label className="block text-sm font-medium">Location</label>
      <div className="flex gap-2 mt-1 mb-3">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={form.location ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-3 text-white"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              setForm((p) => ({ ...p, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
            });
          }}
        >
          Locate Me
        </button>
      </div>

      <label className="block text-sm font-medium">Any injuries?</label>
      <div className="mt-2 mb-4 flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded ${form.hasInjuries === true ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setForm((p) => ({ ...p, hasInjuries: true }))}
        >
          Yes
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${form.hasInjuries === false ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          onClick={() => setForm((p) => ({ ...p, hasInjuries: false }))}
        >
          No
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="rounded bg-cyan-600 px-4 py-2 text-white"
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
}
