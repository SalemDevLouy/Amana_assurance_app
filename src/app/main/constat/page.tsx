"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import { ConstatForm, DEFAULT_CONSTAT_ID } from "./types";
import { saveDraft, loadDraft, clearDraft } from "./lib/autosave";

const INITIAL_FORM = (): ConstatForm => ({
  id: DEFAULT_CONSTAT_ID,
  dateTime: new Date().toISOString().slice(0, 16),
  location: "",
  hasInjuries: null,
  injuryDetails: [],
  otherPropertyDamage: null,
  witnessesPresent: null,
  witnessList: [],
  vehicles: [
    { id: uuidv4(), side: "A", plateNumber: "", brand: "", model: "", country: "", driverName: "", refusedCooperation: false },
    { id: uuidv4(), side: "B", plateNumber: "", brand: "", model: "", country: "", driverName: "", refusedCooperation: false },
  ],
  circumstancesA: {},
  circumstancesB: {},
  pointOfImpact: undefined,
  apparentDamages: undefined,
  sketchFiles: [],
  observations: "",
  signatureA: undefined,
  signatureB: undefined,
});

export default function Page() {
  const [step, setStep] = useState(1);
  const [form, setFormState] = useState<ConstatForm>(() => INITIAL_FORM());

  useEffect(() => {
    const draft = loadDraft<ConstatForm>(DEFAULT_CONSTAT_ID);
    if (draft) {
      setFormState(draft);
    }
  }, []);

  // autosave on change
  useEffect(() => {
    const id = setTimeout(() => saveDraft(DEFAULT_CONSTAT_ID, form), 400);
    return () => clearTimeout(id);
  }, [form]);

  const setForm = (updater: (prev: ConstatForm) => ConstatForm) => {
    setFormState((p) => updater(p));
  };

  const next = () => setStep((s) => Math.min(6, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    // stub: in a real app send to API and clear draft
    console.info("Submitting constat:", form);
    clearDraft(DEFAULT_CONSTAT_ID);
    setStep(1);
    setFormState(INITIAL_FORM());
    alert("Constat submitted (stub). Check console for payload.");
  };

  const stepNode = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1 form={form} setForm={setForm} next={next} />;
      case 2:
        return <Step2 form={form} setForm={setForm} next={next} prev={prev} />;
      case 3:
        return <Step3 form={form} setForm={setForm} next={next} prev={prev} />;
      case 4:
        return <Step4 form={form} setForm={setForm} next={next} prev={prev} />;
      case 5:
        return <Step5 form={form} setForm={setForm} next={next} prev={prev} />;
      case 6:
        return <Step6 form={form} setForm={setForm} prev={prev} submit={submit} />;
      default:
        return null;
    }
  }, [step, form]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 rounded border bg-white p-6">
        <h1 className="text-2xl font-bold">e-Constat — Digital accident report</h1>
        <p className="text-sm text-gray-600">Step {step} of 6 — autosave enabled</p>
      </div>

      <div className="rounded border bg-white p-6">{stepNode}</div>
    </section>
  );
}
