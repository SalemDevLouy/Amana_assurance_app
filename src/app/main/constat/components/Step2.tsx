"use client";

import React from "react";
import { ConstatForm, VehicleProfile } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  next: () => void;
  prev: () => void;
};

function updateVehicle(form: ConstatForm, side: "A" | "B", patch: Partial<VehicleProfile>) {
  const vehicles = form.vehicles.map((v) => (v.side === side ? { ...v, ...patch } : v));
  return { ...form, vehicles } as ConstatForm;
}

export default function Step2({ form, setForm, next, prev }: Props) {
  const vehicleA = form.vehicles.find((v) => v.side === "A")!;
  const vehicleB = form.vehicles.find((v) => v.side === "B")!;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 2 — Vehicles & Drivers</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium">My Vehicle (A)</h3>
          <input className="w-full rounded border px-3 py-2 mt-2" placeholder="Plate number" value={vehicleA.plateNumber ?? ""} onChange={(e) => setForm((p) => updateVehicle(p, "A", { plateNumber: e.target.value }))} />
          <input className="w-full rounded border px-3 py-2 mt-2" placeholder="Driver name" value={vehicleA.driverName ?? ""} onChange={(e) => setForm((p) => updateVehicle(p, "A", { driverName: e.target.value }))} />
        </div>

        <div>
          <h3 className="font-medium">Other Vehicle (B)</h3>
          <input className="w-full rounded border px-3 py-2 mt-2" placeholder="Plate number" value={vehicleB.plateNumber ?? ""} onChange={(e) => setForm((p) => updateVehicle(p, "B", { plateNumber: e.target.value }))} />
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={vehicleB.refusedCooperation ?? false} onChange={(e) => setForm((p) => updateVehicle(p, "B", { refusedCooperation: e.target.checked }))} />
            <span className="text-sm">Other driver refused to cooperate / Hit and Run</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={prev}>Back</button>
        <button type="button" className="rounded bg-cyan-600 px-4 py-2 text-white" onClick={next}>Next</button>
      </div>
    </div>
  );
}
