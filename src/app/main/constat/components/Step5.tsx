"use client";

import React from "react";
import { ConstatForm } from "../types";

type Props = {
  form: ConstatForm;
  setForm: (updater: (prev: ConstatForm) => ConstatForm) => void;
  next: () => void;
  prev: () => void;
};

export default function Step5({ form, setForm, next, prev }: Props) {
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const dataUrls = await Promise.all(arr.map((f) => new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(f);
    })));
    setForm((p) => ({ ...p, sketchFiles: [...p.sketchFiles, ...dataUrls] }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Step 5 — Sketch / Visual proof</h2>

      <p className="text-sm text-gray-600 mb-2">Upload a photo of a hand-drawn sketch or use the advanced sketch pad (not implemented here).</p>

      <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />

      <div className="mt-4 grid grid-cols-3 gap-2">
        {form.sketchFiles.map((s, i) => (
          <img key={i} src={s} alt={`sketch-${i}`} className="h-24 w-full object-cover rounded border" />
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button type="button" className="rounded border px-4 py-2" onClick={prev}>Back</button>
        <button type="button" className="rounded bg-cyan-600 px-4 py-2 text-white" onClick={next}>Next</button>
      </div>
    </div>
  );
}
