"use client";

import React from "react";
import { ConstatForm } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  next: () => void;
  prev: () => void;
};

const CASE_KEYS = [
  "parked",
  "leaving_parking",
  "entering_parking",
  "emerging_private",
  "entering_private",
  "entering_roundabout",
  "circulating_roundabout",
  "rear_strike",
  "same_direction_diff_lane",
  "changing_lanes",
  "overtaking",
  "turning_right",
  "turning_left",
  "reversing",
  "oncoming_lane",
  "coming_from_right",
  "failed_give_way",
];

export default function Step3({ form, setForm, next, prev }: Props) {
  const countChecked = (side: "A" | "B") => {
    const obj = side === "A" ? form.circumstancesA : form.circumstancesB;
    return CASE_KEYS.reduce((s, k) => (obj[k] ? s + 1 : s), 0);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 3 — Circumstances</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium">My Situation (A)</h3>
          {CASE_KEYS.map((k) => (
            <label className="block" key={k}>
              <input type="checkbox" checked={!!form.circumstancesA[k]} onChange={(e) => setForm((p) => ({ ...p, circumstancesA: { ...p.circumstancesA, [k]: e.target.checked } }))} />
              <span className="ml-2 text-sm">{k.replace(/_/g, " ")}</span>
            </label>
          ))}
          <div className="mt-2 text-sm">Checked: {countChecked("A")}</div>
        </div>

        <div>
          <h3 className="font-medium">Their Situation (B)</h3>
          {CASE_KEYS.map((k) => (
            <label className="block" key={k}>
              <input type="checkbox" checked={!!form.circumstancesB[k]} onChange={(e) => setForm((p) => ({ ...p, circumstancesB: { ...p.circumstancesB, [k]: e.target.checked } }))} />
              <span className="ml-2 text-sm">{k.replace(/_/g, " ")}</span>
            </label>
          ))}
          <div className="mt-2 text-sm">Checked: {countChecked("B")}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={prev}>Back</button>
        <button type="button" className="rounded bg-cyan-600 px-4 py-2 text-white" onClick={next}>Next</button>
      </div>
    </div>
  );
}
