"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt, FaCamera, FaFileAlt, FaUserCheck, FaArrowLeft,
  FaArrowRight, FaCheckCircle, FaTruck, FaCar, FaCloudSun,
} from "react-icons/fa";

type Step = 1 | 2 | 3 | 4;

const steps = [
  { label: "Incident Details", icon: FaMapMarkerAlt },
  { label: "Photo Upload", icon: FaCamera },
  { label: "Constat Form", icon: FaFileAlt },
  { label: "Review & Submit", icon: FaUserCheck },
];

type AccidentForm = {
  date: string;
  time: string;
  location: string;
  wilaya: string;
  weather: string;
  description: string;
  needTowing: boolean;
  contractId: string;
  otherVehiclePlate: string;
  otherDriverName: string;
  otherInsurance: string;
  policeReport: boolean;
  policeReportNumber: string;
  responsible: "me" | "other" | "shared" | "";
  photos: File[];
};

const weatherOptions = ["Clear", "Rainy", "Foggy", "Windy", "Icy", "Night"];

export default function AccidentDeclarationPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<AccidentForm>({
    date: "", time: "", location: "", wilaya: "", weather: "",
    description: "", needTowing: false, contractId: "",
    otherVehiclePlate: "", otherDriverName: "", otherInsurance: "",
    policeReport: false, policeReportNumber: "", responsible: "",
    photos: [],
  });

  const set = <K extends keyof AccidentForm>(field: K, value: AccidentForm[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputCls = "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] pt-24 flex items-center justify-center px-4">
        <div className="bg-white border border-emerald-200 rounded-3xl p-10 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <FaCheckCircle className="text-emerald-500 text-3xl" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Declaration Submitted</p>
          <h2 className="text-xl font-extrabold text-gray-800 mb-3">Your accident has been reported</h2>
          <p className="text-sm text-gray-500 mb-6">
            A regional expert has been assigned to your case. You will receive a notification within 2 hours to schedule your inspection.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Reference Number</p>
            <p className="text-base font-extrabold text-blue-600">CLM-2026-{Math.floor(Math.random() * 900 + 100)}</p>
          </div>
          <Link
            href="/main"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            Back to Dashboard
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link href="/main" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <FaArrowLeft className="text-xs" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
              <FaCar className="text-rose-600 text-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Declare an Accident</h1>
              <p className="text-sm text-gray-500">Complete all 4 steps to submit your claim.</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {steps.map((s, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={num} className={`rounded-2xl border p-3 transition-all ${active ? "border-blue-300 bg-blue-50" : done ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${active ? "bg-blue-600" : done ? "bg-emerald-500" : "bg-gray-200"}`}>
                  {done ? <FaCheckCircle className="text-white text-xs" /> : <s.icon className={`text-xs ${active ? "text-white" : "text-gray-400"}`} />}
                </div>
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-gray-400"}`}>
                  Step {num}
                </p>
                <p className={`text-xs font-bold leading-tight ${active ? "text-blue-800" : done ? "text-emerald-800" : "text-gray-500"}`}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">

          {/* Step 1 - Incident Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Incident Details</h2>
                <p className="text-sm text-gray-500">Provide the basic information about the accident.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Time *</label>
                  <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    <FaMapMarkerAlt className="inline mr-1 text-blue-500" /> Location / Address *
                  </label>
                  <input type="text" placeholder="e.g. RN3 near Blida, intersection..." value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Wilaya</label>
                  <input type="text" placeholder="e.g. Alger" value={form.wilaya} onChange={(e) => set("wilaya", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    <FaCloudSun className="inline mr-1 text-cyan-500" /> Weather Conditions
                  </label>
                  <select value={form.weather} onChange={(e) => set("weather", e.target.value)} className={inputCls}>
                    <option value="">Select weather...</option>
                    {weatherOptions.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Insurance Contract</label>
                  <select value={form.contractId} onChange={(e) => set("contractId", e.target.value)} className={inputCls}>
                    <option value="">Select contract...</option>
                    <option value="AMT-2026-001">AMT-2026-001 – Peugeot 208</option>
                    <option value="AMT-2026-047">AMT-2026-047 – Renault Symbol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Accident Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  placeholder="Describe what happened in detail: where you were going, how the collision occurred, what damage was caused..."
                  className={inputCls}
                />
              </div>

              {/* Towing */}
              <div className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.needTowing ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50"}`}
                onClick={() => set("needTowing", !form.needTowing)}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${form.needTowing ? "bg-amber-100" : "bg-white border border-gray-200"}`}>
                  <FaTruck className={`text-sm ${form.needTowing ? "text-amber-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">I need a towing service</p>
                  <p className="text-xs text-gray-500 mt-0.5">We'll dispatch the nearest available towing partner to your location.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Photo Upload */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Upload Accident Photos</h2>
                <p className="text-sm text-gray-500">Photos are analyzed by our AI system for damage detection and fraud prevention.</p>
              </div>

              {[
                { label: "Vehicle Damage Photos *", hint: "At least 4 photos showing all damaged areas", multiple: true },
                { label: "Accident Scene Photos", hint: "Show the road, positions of vehicles, signage", multiple: true },
                { label: "Other Driver's License & ID", hint: "Clear photo of documents", multiple: false },
                { label: "Police Report (if available)", hint: "PV or official report document", multiple: false },
              ].map((upload) => (
                <div key={upload.label} className="border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl p-6 text-center transition-all cursor-pointer bg-gray-50 hover:bg-blue-50/30">
                  <FaCamera className="text-2xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700 mb-1">{upload.label}</p>
                  <p className="text-xs text-gray-400 mb-3">{upload.hint}</p>
                  <label className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <FaCamera className="text-xs" />
                    {upload.multiple ? "Select Photos" : "Select File"}
                    <input type="file" className="hidden" accept="image/*" multiple={upload.multiple}
                      onChange={(e) => { if (e.target.files) set("photos", [...form.photos, ...Array.from(e.target.files)]); }} />
                  </label>
                </div>
              ))}

              {form.photos.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                  <p className="text-xs font-semibold text-emerald-700">{form.photos.length} file(s) selected</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 - Constat Form */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Digital Constat Form</h2>
                <p className="text-sm text-gray-500">Fill in the details about the other vehicle and responsibility.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Who is responsible?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "me", label: "My Fault" },
                    { value: "other", label: "Other Driver" },
                    { value: "shared", label: "Shared" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("responsible", opt.value as AccidentForm["responsible"])}
                      className={`py-2.5 px-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                        form.responsible === opt.value ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Other Vehicle Plate</label>
                  <input type="text" placeholder="e.g. 12345-123-16" value={form.otherVehiclePlate} onChange={(e) => set("otherVehiclePlate", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Other Driver's Name</label>
                  <input type="text" placeholder="Full name" value={form.otherDriverName} onChange={(e) => set("otherDriverName", e.target.value)} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Other Driver's Insurance</label>
                  <input type="text" placeholder="e.g. SAA – Policy #12345" value={form.otherInsurance} onChange={(e) => set("otherInsurance", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.policeReport ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                onClick={() => set("policeReport", !form.policeReport)}
              >
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 ${form.policeReport ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                  {form.policeReport && <FaCheckCircle className="text-white text-xs" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">A police report (PV) was filed</p>
                  <p className="text-xs text-gray-500 mt-0.5">Check this if law enforcement was involved and issued a report.</p>
                </div>
              </div>

              {form.policeReport && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Police Report Number</label>
                  <input type="text" placeholder="PV Reference Number" value={form.policeReportNumber} onChange={(e) => set("policeReportNumber", e.target.value)} className={inputCls} />
                </div>
              )}
            </div>
          )}

          {/* Step 4 - Review */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Review & Submit</h2>
                <p className="text-sm text-gray-500">Check your declaration before submitting.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Date & Time", value: `${form.date} at ${form.time}` },
                  { label: "Location", value: form.location || "—" },
                  { label: "Wilaya", value: form.wilaya || "—" },
                  { label: "Weather", value: form.weather || "—" },
                  { label: "Contract", value: form.contractId || "—" },
                  { label: "Towing Requested", value: form.needTowing ? "Yes" : "No" },
                  { label: "Responsible Party", value: form.responsible || "—" },
                  { label: "Other Vehicle Plate", value: form.otherVehiclePlate || "—" },
                  { label: "Photos Uploaded", value: `${form.photos.length} file(s)` },
                  { label: "Police Report", value: form.policeReport ? `Yes — ${form.policeReportNumber || "No ref"}` : "No" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-medium text-gray-700">{value}</span>
                  </div>
                ))}
              </div>

              {form.description && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-sm text-gray-700">{form.description}</p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700">
                By submitting, you confirm this declaration is accurate and complete. Providing false information may result in claim rejection.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaArrowLeft className="text-xs" /> Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                Continue <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-sm font-bold shadow-md shadow-rose-500/25 hover:bg-rose-700 transition-all"
              >
                Submit Declaration <FaCheckCircle className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
