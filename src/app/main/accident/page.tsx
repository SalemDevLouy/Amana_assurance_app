"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
  FaMapMarkerAlt, FaCamera, FaFileAlt, FaUserCheck, FaArrowLeft,
  FaArrowRight, FaCheckCircle, FaTruck, FaCar, FaCloudSun, FaPlus, FaTrash,
  FaTimes, FaPhone, FaStar, FaClock,
} from "react-icons/fa";

// ── Constants ──────────────────────────────────────────────────────────────────

const CIRCUMSTANCES = [
  "Heurtait à l'arrière", "Même sens, même file", "Même sens, file différente",
  "Sens inverse", "Provenait d'une autre chaussée", "Venait de droite",
  "S'engageait dans un giratoire", "Circulait dans un giratoire", "Stationné",
  "Quittait un stationnement", "Prenait un stationnement", "Reculait", "Doublait",
  "Dépassement irrégulier", "Changeait de file", "Virait à droite", "Virait à gauche",
  "Entrait dans un parking", "Sortait d'un parking", "Empiétait sur la voie inverse",
  "Sens interdit", "Non-respect de priorité", "Demi-tour", "Ouvrait une portière",
];

const IMPACT_ZONES = [
  "Avant", "Avant-gauche", "Avant-droit",
  "Arrière", "Arrière-gauche", "Arrière-droit",
  "Côté gauche", "Côté droit", "Toit",
];

const LICENSE_CATS = ["A", "B", "C", "D", "E", "EB", "EC", "ED"];
const WEATHER_OPTS = ["Clear", "Rainy", "Foggy", "Windy", "Icy", "Night"];

// Towing service partners
type TowingPartner = {
  id: string;
  name: string;
  wilaya: string;
  address: string;
  phone: string;
  rating: number;
  available: boolean;
  hours: string;
  eta?: string | null;
};

type UserContract = {
  id: string;
  contractNumber: string;
  brand: string;
  model: string;
  registration: string;
  status: string;
  prefill: Partial<AccidentForm>;
};

const CONSTAT_LABELS = [
  "Informations de l'accident",
  "Véhicule A",
  "Véhicule B",
  "Circonstances",
  "Croquis",
  "Infos complémentaires",
  "Véhicule assuré",
  "Blessés",
  "Signature",
];

const MAIN_STEPS = [
  { label: "Incident Details", icon: FaMapMarkerAlt },
  { label: "Photo Upload", icon: FaCamera },
  { label: "Constat Form", icon: FaFileAlt },
  { label: "Review & Submit", icon: FaUserCheck },
];

// ── Types ──────────────────────────────────────────────────────────────────────

type MainStep = 1 | 2 | 3 | 4;

type BlessedItem = {
  id: string;
  nom: string; prenom: string; age: string; adresse: string;
  profession: string; securiteSociale: string; natureBlessures: string;
  gravite: string; situation: "Piéton" | "A" | "B" | ""; soins: string;
};

type AccidentForm = {
  // Main Step 1
  date: string; time: string; location: string; wilaya: string;
  weather: string; description: string; needTowing: boolean;
  contractId: string; photos: File[];

  // Constat 1 — Informations de l'accident
  otherPropertyDamage: string;
  witnessPresent: boolean; witnessName: string; witnessAddress: string;
  witnessVehicle: "A" | "B" | "";

  // Constat 2 — Véhicule A
  vaMarque: string; vaType: string; vaPlateNumber: string;
  vaProvenance: string; vaDestination: string;
  vaInsuredLastName: string; vaInsuredFirstName: string; vaInsuredAddress: string;
  vaInsuranceCompany: string; vaPolicyNumber: string;
  vaAttestationFrom: string; vaAttestationTo: string; vaAgency: string;
  vaDriverLastName: string; vaDriverFirstName: string; vaDriverAddress: string;
  vaLicenseNumber: string; vaLicenseDate: string;
  vaLicenseWilaya: string; vaLicenseCategory: string;
  vaPointOfImpact: string; vaApparentDamages: string; vaObservations: string;

  // Constat 3 — Véhicule B
  vbMarque: string; vbType: string; vbPlateNumber: string;
  vbProvenance: string; vbDestination: string;
  vbInsuredLastName: string; vbInsuredFirstName: string; vbInsuredAddress: string;
  vbInsuranceCompany: string; vbPolicyNumber: string;
  vbAttestationFrom: string; vbAttestationTo: string; vbAgency: string;
  vbDriverLastName: string; vbDriverFirstName: string; vbDriverAddress: string;
  vbLicenseNumber: string; vbLicenseDate: string;
  vbLicenseWilaya: string; vbLicenseCategory: string;
  vbPointOfImpact: string; vbApparentDamages: string; vbObservations: string;

  // Constat 4 — Circonstances
  circumstancesA: Record<string, boolean>;
  circumstancesB: Record<string, boolean>;

  // Constat 5 — Croquis
  sketchFiles: File[];

  // Constat 6 — Informations complémentaires
  declaredName: string; declaredProfession: string; declaredPhone: string;
  pvGendarmerie: boolean; rapportPolice: boolean; brigadeName: string;
  isUsualDriver: boolean | null; residesWithInsured: boolean | null;
  driverBirthDate: string;

  // Constat 7 — Véhicule assuré
  garageLocation: string; tripReason: string;
  expertiseLocation: string; expertiseDate: string; contactPhone: string;
  vehicleStolen: boolean; serialNumber: string;
  vehiclePledged: boolean; creditOrganization: string;
  totalWeight: string; vehicleTowing: boolean;
  trailerPlate: string; trailerInsurance: string; trailerPolicy: string;

  // Constat 8 — Blessés
  injuries: BlessedItem[];

  // Constat 9 — Signatures
  signatureA: string; signatureB: string; signatureInsured: string;

  // Other
  responsible: "me" | "other" | "shared" | "";
  selectedTowingPartnerId: string;
};

// ── Signature Canvas ───────────────────────────────────────────────────────────

function SignatureCanvas({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const xy = (e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    const sx = c.width / r.width;
    const sy = c.height / r.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    return { x: ((e as React.MouseEvent).clientX - r.left) * sx, y: ((e as React.MouseEvent).clientY - r.top) * sy };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const c = ref.current; if (!c) return;
    drawing.current = true;
    const { x, y } = xy(e, c);
    const ctx = c.getContext("2d")!;
    ctx.beginPath(); ctx.moveTo(x, y);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const { x, y } = xy(e, c);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1e3a8a"; ctx.lineWidth = 2;
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
    if (ref.current) onChange(ref.current.toDataURL());
  };

  const clear = () => {
    const c = ref.current; if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <canvas
        ref={ref} width={500} height={150}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 cursor-crosshair touch-none"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <div className="flex items-center justify-between">
        {value
          ? <span className="text-xs text-emerald-600 font-medium">✓ Signée</span>
          : <span className="text-xs text-gray-400">Dessinez votre signature ci-dessus</span>}
        <button type="button" onClick={clear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Effacer</button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AccidentDeclarationPage() {
  const [step, setStep] = useState<MainStep>(1);
  const [constatStep, setConstatStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showTowingModal, setShowTowingModal] = useState(false);

  const [userContracts, setUserContracts] = useState<UserContract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [towingPartners, setTowingPartners] = useState<TowingPartner[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [caseNumber, setCaseNumber] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/contracts");
        if (!res.ok) return;
        const data = (await res.json()) as { contracts: UserContract[] };
        setUserContracts(data.contracts ?? []);
      } catch {
        // silently ignore — user can still fill manually
      } finally {
        setContractsLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/partners?type=towing");
        if (!res.ok) return;
        const data = (await res.json()) as { partners: TowingPartner[] };
        setTowingPartners(data.partners ?? []);
      } catch { /* ignore */ }
    };
    void load();
  }, []);

  const [form, setForm] = useState<AccidentForm>({
    date: "", time: "", location: "", wilaya: "", weather: "",
    description: "", needTowing: false, contractId: "", photos: [],

    otherPropertyDamage: "", witnessPresent: false,
    witnessName: "", witnessAddress: "", witnessVehicle: "",

    vaMarque: "", vaType: "", vaPlateNumber: "", vaProvenance: "", vaDestination: "",
    vaInsuredLastName: "", vaInsuredFirstName: "", vaInsuredAddress: "",
    vaInsuranceCompany: "", vaPolicyNumber: "", vaAttestationFrom: "", vaAttestationTo: "", vaAgency: "",
    vaDriverLastName: "", vaDriverFirstName: "", vaDriverAddress: "",
    vaLicenseNumber: "", vaLicenseDate: "", vaLicenseWilaya: "", vaLicenseCategory: "",
    vaPointOfImpact: "", vaApparentDamages: "", vaObservations: "",

    vbMarque: "", vbType: "", vbPlateNumber: "", vbProvenance: "", vbDestination: "",
    vbInsuredLastName: "", vbInsuredFirstName: "", vbInsuredAddress: "",
    vbInsuranceCompany: "", vbPolicyNumber: "", vbAttestationFrom: "", vbAttestationTo: "", vbAgency: "",
    vbDriverLastName: "", vbDriverFirstName: "", vbDriverAddress: "",
    vbLicenseNumber: "", vbLicenseDate: "", vbLicenseWilaya: "", vbLicenseCategory: "",
    vbPointOfImpact: "", vbApparentDamages: "", vbObservations: "",

    circumstancesA: {}, circumstancesB: {},
    sketchFiles: [],

    declaredName: "", declaredProfession: "", declaredPhone: "",
    pvGendarmerie: false, rapportPolice: false, brigadeName: "",
    isUsualDriver: null, residesWithInsured: null, driverBirthDate: "",

    garageLocation: "", tripReason: "", expertiseLocation: "", expertiseDate: "", contactPhone: "",
    vehicleStolen: false, serialNumber: "", vehiclePledged: false, creditOrganization: "",
    totalWeight: "", vehicleTowing: false, trailerPlate: "", trailerInsurance: "", trailerPolicy: "",

    injuries: [],
    signatureA: "", signatureB: "", signatureInsured: "",
    responsible: "",
    selectedTowingPartnerId: "",
  });

  const set = <K extends keyof AccidentForm>(f: K, v: AccidentForm[K]) =>
    setForm((p) => ({ ...p, [f]: v }));

  const handleContractChange = (contractId: string) => {
    const contract = userContracts.find((c) => c.id === contractId);
    const prefill = contract?.prefill ?? {};
    setForm((p) => ({ ...p, contractId, ...prefill }));
  };

  const inp = "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all";
  const sec = "text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 pb-1 border-b border-blue-100";

  const addBlessed = () =>
    setForm((p) => ({
      ...p,
      injuries: [...p.injuries, {
        id: uuidv4(), nom: "", prenom: "", age: "", adresse: "",
        profession: "", securiteSociale: "", natureBlessures: "",
        gravite: "", situation: "", soins: "",
      }],
    }));

  const updBlessed = (id: string, patch: Partial<BlessedItem>) =>
    setForm((p) => ({ ...p, injuries: p.injuries.map((b) => b.id === id ? { ...b, ...patch } : b) }));

  const delBlessed = (id: string) =>
    setForm((p) => ({ ...p, injuries: p.injuries.filter((b) => b.id !== id) }));

  const constatNext = () => constatStep < 9 ? setConstatStep((s) => s + 1) : setStep(4);
  const constatPrev = () => constatStep > 1 ? setConstatStep((s) => s - 1) : setStep(2);

  const handleAccidentSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Upload photos and sketch files to Cloudinary
      let photoUrls: string[] = [];
      let sketchUrls: string[] = [];

      if (form.photos.length > 0 || form.sketchFiles.length > 0) {
        const fd = new FormData();
        for (const f of form.photos) fd.append("files", f);
        for (const f of form.sketchFiles) fd.append("files", f);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = (await uploadRes.json()) as { urls?: string[]; error?: string };
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Photo upload failed");
        const urls = uploadData.urls ?? [];
        photoUrls = urls.slice(0, form.photos.length);
        sketchUrls = urls.slice(form.photos.length);
      }

      const { photos, sketchFiles, ...serialisableForm } = form;
      void photos; void sketchFiles;

      const res = await fetch("/api/accidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: form.contractId,
          accidentDate: form.date,
          accidentTime: form.time,
          location: form.location,
          wilaya: form.wilaya,
          weather: form.weather,
          description: form.description,
          vehiclePlate: form.vaPlateNumber || form.vaPolicyNumber,
          formData: serialisableForm,
          photoUrls,
          sketchUrls,
        }),
      });

      const data = (await res.json()) as { accident?: { caseNumber: string }; error?: string };
      if (!res.ok) { setSubmitError(data.error ?? "Submission failed."); return; }
      setCaseNumber(data.accident?.caseNumber ?? null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const impactBtn = (zone: string, field: "vaPointOfImpact" | "vbPointOfImpact") => (
    <button key={zone} type="button"
      onClick={() => set(field, form[field] === zone ? "" : zone)}
      className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
        form[field] === zone
          ? "border-blue-400 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
      }`}
    >{zone}</button>
  );

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
            A regional expert has been assigned to your case. You will receive a notification within 2 hours.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Numéro de dossier</p>
            <p className="text-base font-extrabold text-blue-600">{caseNumber ?? "—"}</p>
          </div>
          <Link href="/main" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
            Back to Dashboard <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-20 pb-28 px-3 sm:px-6 sm:pt-24 sm:pb-16">

      {/* ── Towing modal ────────────────────────────────────────────────────── */}
      {showTowingModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex justify-center pt-3 md:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <FaTruck className="text-amber-600 text-sm" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-800">Choisir un dépanneur</h2>
                  <p className="text-xs text-gray-400">Partenaires agréés Amaneka disponibles</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowTowingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <FaTimes />
              </button>
            </div>

            {/* Partner cards */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {towingPartners.map((p) => {
                const isSelected = form.selectedTowingPartnerId === p.id;
                return (
                  <div key={p.id}
                    className={`rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-amber-400 bg-amber-50"
                        : p.available
                          ? "border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                          : "border-gray-100 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-amber-200" : "bg-amber-100"}`}>
                        <FaTruck className="text-amber-600 text-sm" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-800">{p.name}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            p.available
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-400 border-gray-200"
                          }`}>
                            {p.available ? "● Disponible" : "○ Indisponible"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.5 mb-1.5">
                          <FaStar className="text-amber-400 text-[10px]" />
                          <span className="text-[10px] font-semibold text-gray-600">{p.rating}</span>
                          <span className="text-[10px] text-gray-400">· {p.wilaya}</span>
                          {p.eta && <span className="text-[10px] text-emerald-600 font-semibold ml-1">· ETA {p.eta}</span>}
                        </div>

                        <p className="text-xs text-gray-500 mb-1">{p.address}</p>

                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FaClock className="text-[10px]" />
                          <span>{p.hours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {p.available && (
                      <div className="flex gap-2 mt-3">
                        <a href={`tel:${p.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                          onClick={(e) => e.stopPropagation()}>
                          <FaPhone className="text-[10px]" /> {p.phone}
                        </a>
                        <button type="button"
                          onClick={() => {
                            set("selectedTowingPartnerId", p.id);
                            set("needTowing", true);
                            setShowTowingModal(false);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                        >
                          {isSelected ? "✓ Sélectionné" : "Choisir ce dépanneur"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-5 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-center text-gray-400">
                Le dépanneur sera notifié automatiquement dès la soumission de votre déclaration.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
              <FaCar className="text-sm text-rose-600" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-800 sm:text-2xl">Déclarer un accident</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Complétez les 4 étapes pour soumettre votre déclaration.</p>
            </div>
          </div>
        </div>

        {/* Main step indicator */}
        {/* Mobile: dot trail */}
        <div className="mb-5 sm:hidden flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-0">
            {MAIN_STEPS.map((s, i) => {
              const num = (i + 1) as MainStep;
              const done = step > num;
              const active = step === num;
              return (
                <div key={num} className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done ? "bg-emerald-500 text-white" : active ? "bg-rose-600 text-white scale-110 shadow-md shadow-rose-400/40" : "bg-gray-200 text-gray-400"
                  }`}>
                    {done ? "✓" : <s.icon className="text-xs" />}
                  </div>
                  {i < MAIN_STEPS.length - 1 && (
                    <div className={`h-[2px] w-8 rounded-full ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-gray-500">
            Étape {step} sur {MAIN_STEPS.length} : <span className="font-bold text-rose-600">{MAIN_STEPS[step - 1]?.label}</span>
          </p>
        </div>

        {/* Desktop: card grid */}
        <div className="hidden sm:grid grid-cols-4 gap-2 mb-8">
          {MAIN_STEPS.map((s, i) => {
            const num = (i + 1) as MainStep;
            const done = step > num;
            const active = step === num;
            return (
              <div key={num} className={`rounded-2xl border p-3 transition-all ${active ? "border-rose-300 bg-rose-50" : done ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${active ? "bg-rose-600" : done ? "bg-emerald-500" : "bg-gray-200"}`}>
                  {done ? <FaCheckCircle className="text-white text-xs" /> : <s.icon className={`text-xs ${active ? "text-white" : "text-gray-400"}`} />}
                </div>
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${active ? "text-rose-600" : done ? "text-emerald-600" : "text-gray-400"}`}>Step {num}</p>
                <p className={`text-xs font-bold leading-tight ${active ? "text-rose-800" : done ? "text-emerald-800" : "text-gray-500"}`}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Content card */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-4 sm:p-8 shadow-sm">

          {/* ── STEP 1: Incident Details ────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Towing card */}
              {(() => {
                const partner = towingPartners.find(p => p.id === form.selectedTowingPartnerId);
                return (
                  <div
                    onClick={() => setShowTowingModal(true)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.needTowing ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${form.needTowing ? "bg-amber-100" : "bg-white border border-gray-200"}`}>
                      <FaTruck className={`text-sm ${form.needTowing ? "text-amber-600" : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">I need a towing service</p>
                      {partner ? (
                        <div className="mt-1 space-y-0.5">
                          <p className="text-xs font-semibold text-amber-700">{partner.name}</p>
                          <p className="text-xs text-gray-500">{partner.address} · ETA {partner.eta}</p>
                          <p className="text-xs font-mono text-gray-500">{partner.phone}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-0.5">Cliquez pour choisir un prestataire de dépannage.</p>
                      )}
                    </div>
                    {partner && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); set("needTowing", false); set("selectedTowingPartnerId", ""); }}
                        className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </div>
                );
              })()}
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Incident Details</h2>
                <p className="text-sm text-gray-500">Provide the basic information about the accident.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Time *</label>
                  <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inp} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    <FaMapMarkerAlt className="inline mr-1 text-blue-500" /> Location / Address *
                  </label>
                  <input type="text" placeholder="e.g. RN3 near Blida, intersection..." value={form.location} onChange={(e) => set("location", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Wilaya</label>
                  <input type="text" placeholder="e.g. Alger" value={form.wilaya} onChange={(e) => set("wilaya", e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    <FaCloudSun className="inline mr-1 text-cyan-500" /> Weather
                  </label>
                  <select value={form.weather} onChange={(e) => set("weather", e.target.value)} className={inp}>
                    <option value="">Select weather...</option>
                    {WEATHER_OPTS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Insurance Contract</label>
                  <select value={form.contractId} onChange={(e) => handleContractChange(e.target.value)} className={inp} disabled={contractsLoading}>
                    <option value="">{contractsLoading ? "Loading contracts..." : "Select contract..."}</option>
                    {userContracts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.contractNumber} – {c.brand} {c.model} ({c.registration})
                      </option>
                    ))}
                  </select>
                  {form.contractId && (
                    <p className="text-xs text-emerald-600 font-medium mt-1.5">
                      ✓ Véhicule A pre-filled from contract {userContracts.find((c) => c.id === form.contractId)?.contractNumber ?? form.contractId}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Accident Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
                  placeholder="Describe what happened in detail..." className={inp} />
              </div>
              
            </div>
          )}

          {/* ── STEP 2: Photo Upload ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Upload Accident Photos</h2>
                <p className="text-sm text-gray-500">Photos are analyzed by our AI system for damage detection.</p>
              </div>
              {[
                { label: "Vehicle Damage Photos *", hint: "At least 4 photos showing all damaged areas", multiple: true },
                { label: "Accident Scene Photos", hint: "Show the road, positions of vehicles, signage", multiple: true },
                { label: "Other Driver's License & ID", hint: "Clear photo of documents", multiple: false },
                { label: "Police Report (if available)", hint: "PV or official report document", multiple: false },
              ].map((u) => (
                <div key={u.label} className="border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl p-6 text-center transition-all bg-gray-50 hover:bg-blue-50/30">
                  <FaCamera className="text-2xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700 mb-1">{u.label}</p>
                  <p className="text-xs text-gray-400 mb-3">{u.hint}</p>
                  <label className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <FaCamera className="text-xs" />
                    {u.multiple ? "Select Photos" : "Select File"}
                    <input type="file" className="hidden" accept="image/*" multiple={u.multiple}
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

          {/* ── STEP 3: Full Digital Constat (9 sub-steps) ─────────────────── */}
          {step === 3 && (
            <div>
              {/* Constat header + sub-step progress */}
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Digital Constat Form</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {constatStep} / 9 — <span className="font-semibold text-blue-600">{CONSTAT_LABELS[constatStep - 1]}</span>
                </p>
                <div className="flex gap-1">
                  {CONSTAT_LABELS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < constatStep ? "bg-blue-500" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>

              {/* ── Sub-step 1: Informations de l'accident ─────────────────── */}
              {constatStep === 1 && (
                <div className="space-y-5">
                

                  {/* Unique fields for this sub-step */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Dégâts matériels autres</label>
                    <textarea rows={3} placeholder="Dommages causés à d'autres biens (mobilier urbain, clôture, autre véhicule non impliqué…)" value={form.otherPropertyDamage} onChange={(e) => set("otherPropertyDamage", e.target.value)} className={inp} />
                  </div>

                  {/* Témoins */}
                  <div className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.witnessPresent ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                    onClick={() => set("witnessPresent", !form.witnessPresent)}>
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${form.witnessPresent ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                      {form.witnessPresent && <FaCheckCircle className="text-white text-xs" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Présence de témoins</p>
                      <p className="text-xs text-gray-500 mt-0.5">Cochez s'il y avait des témoins présents.</p>
                    </div>
                  </div>

                  {form.witnessPresent && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2 border-l-2 border-blue-200">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Nom du témoin</label>
                        <input type="text" value={form.witnessName} onChange={(e) => set("witnessName", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Adresse du témoin</label>
                        <input type="text" value={form.witnessAddress} onChange={(e) => set("witnessAddress", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Témoin du véhicule</label>
                        <select value={form.witnessVehicle} onChange={(e) => set("witnessVehicle", e.target.value as "A" | "B" | "")} className={inp}>
                          <option value="">— Sélectionner —</option>
                          <option value="A">Véhicule A</option>
                          <option value="B">Véhicule B</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Sub-step 2: Véhicule A (user) ─────────────────────────── */}
              {constatStep === 2 && (
                <div className="space-y-6">

                  {/* Read-only identity card from contract */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border-b border-emerald-100">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      <p className="text-xs font-bold text-emerald-700">
                        Véhicule A — vos données (contrat {form.contractId || "—"})
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-5 py-4 text-sm">
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Véhicule</span><span className="font-semibold text-gray-800">{[form.vaMarque, form.vaType].filter(Boolean).join(" · ") || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Plaque</span><span className="font-semibold text-gray-800 font-mono">{form.vaPlateNumber || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Assuré</span><span className="font-semibold text-gray-800">{[form.vaInsuredFirstName, form.vaInsuredLastName].filter(Boolean).join(" ") || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">N° Police</span><span className="font-semibold text-gray-800 font-mono">{form.vaPolicyNumber || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Société</span><span className="font-semibold text-gray-800">{form.vaInsuranceCompany || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Attestation</span><span className="font-semibold text-gray-800">{form.vaAttestationFrom && form.vaAttestationTo ? `${form.vaAttestationFrom} → ${form.vaAttestationTo}` : "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Conducteur</span><span className="font-semibold text-gray-800">{[form.vaDriverFirstName, form.vaDriverLastName].filter(Boolean).join(" ") || "—"}</span></div>
                      <div><span className="text-[10px] text-gray-400 uppercase tracking-wide block">Permis</span><span className="font-semibold text-gray-800 font-mono">{form.vaLicenseNumber || "—"} {form.vaLicenseCategory ? `(${form.vaLicenseCategory})` : ""}</span></div>
                    </div>
                  </div>

                  {/* Only fields unique to this accident */}
                  <div>
                    <h3 className={sec}>Trajet au moment de l'accident</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Provenance</label>
                        <input type="text" placeholder="Lieu de départ" value={form.vaProvenance} onChange={(e) => set("vaProvenance", e.target.value)} className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Destination</label>
                        <input type="text" placeholder="Lieu de destination" value={form.vaDestination} onChange={(e) => set("vaDestination", e.target.value)} className={inp} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Dégâts (A)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Point de choc initial</label>
                        <div className="grid grid-cols-3 gap-2">{IMPACT_ZONES.map((z) => impactBtn(z, "vaPointOfImpact"))}</div>
                      </div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Dégâts apparents</label><textarea rows={3} value={form.vaApparentDamages} onChange={(e) => set("vaApparentDamages", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Observations</label><textarea rows={3} value={form.vaObservations} onChange={(e) => set("vaObservations", e.target.value)} className={inp} /></div>
                    </div>
                  </div>
                </div>
              )}


              {/* ── Sub-step 3: Véhicule B ─────────────────────────────────── */}
              {constatStep === 3 && (
                <div className="space-y-7">
                  <div>
                    <h3 className={sec}>Informations véhicule B</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Marque</label><input type="text" placeholder="Ex: Toyota" value={form.vbMarque} onChange={(e) => set("vbMarque", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Type</label><input type="text" placeholder="Ex: Berline, SUV…" value={form.vbType} onChange={(e) => set("vbType", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Numéro d'immatriculation</label><input type="text" value={form.vbPlateNumber} onChange={(e) => set("vbPlateNumber", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Provenance</label><input type="text" value={form.vbProvenance} onChange={(e) => set("vbProvenance", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Destination</label><input type="text" value={form.vbDestination} onChange={(e) => set("vbDestination", e.target.value)} className={inp} /></div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Assuré (B)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Nom</label><input type="text" value={form.vbInsuredLastName} onChange={(e) => set("vbInsuredLastName", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Prénom</label><input type="text" value={form.vbInsuredFirstName} onChange={(e) => set("vbInsuredFirstName", e.target.value)} className={inp} /></div>
                      <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Adresse</label><input type="text" value={form.vbInsuredAddress} onChange={(e) => set("vbInsuredAddress", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Société d'assurance</label><input type="text" value={form.vbInsuranceCompany} onChange={(e) => set("vbInsuranceCompany", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">N° Police</label><input type="text" value={form.vbPolicyNumber} onChange={(e) => set("vbPolicyNumber", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Attestation valable du</label><input type="date" value={form.vbAttestationFrom} onChange={(e) => set("vbAttestationFrom", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Attestation valable au</label><input type="date" value={form.vbAttestationTo} onChange={(e) => set("vbAttestationTo", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Agence</label><input type="text" value={form.vbAgency} onChange={(e) => set("vbAgency", e.target.value)} className={inp} /></div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Conducteur (B)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Nom</label><input type="text" value={form.vbDriverLastName} onChange={(e) => set("vbDriverLastName", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Prénom</label><input type="text" value={form.vbDriverFirstName} onChange={(e) => set("vbDriverFirstName", e.target.value)} className={inp} /></div>
                      <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Adresse</label><input type="text" value={form.vbDriverAddress} onChange={(e) => set("vbDriverAddress", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">N° Permis</label><input type="text" value={form.vbLicenseNumber} onChange={(e) => set("vbLicenseNumber", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Date de délivrance</label><input type="date" value={form.vbLicenseDate} onChange={(e) => set("vbLicenseDate", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Wilaya de délivrance</label><input type="text" value={form.vbLicenseWilaya} onChange={(e) => set("vbLicenseWilaya", e.target.value)} className={inp} /></div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Catégorie permis</label>
                        <select value={form.vbLicenseCategory} onChange={(e) => set("vbLicenseCategory", e.target.value)} className={inp}>
                          <option value="">— Sélectionner —</option>
                          {LICENSE_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Dégâts (B)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Point de choc initial</label>
                        <div className="grid grid-cols-3 gap-2">{IMPACT_ZONES.map((z) => impactBtn(z, "vbPointOfImpact"))}</div>
                      </div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Dégâts apparents</label><textarea rows={3} value={form.vbApparentDamages} onChange={(e) => set("vbApparentDamages", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Observations</label><textarea rows={3} value={form.vbObservations} onChange={(e) => set("vbObservations", e.target.value)} className={inp} /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Sub-step 4: Circonstances ──────────────────────────────── */}
              {constatStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(["A", "B"] as const).map((side) => {
                      const field = side === "A" ? "circumstancesA" : "circumstancesB";
                      const checked = Object.values(form[field]).filter(Boolean).length;
                      return (
                        <div key={side}>
                          <h3 className={sec}>Situation — Véhicule {side} <span className="normal-case font-normal text-gray-400">({checked} coché{checked > 1 ? "s" : ""})</span></h3>
                          <div className="space-y-2">
                            {CIRCUMSTANCES.map((c) => (
                              <label key={c} className="flex items-start gap-3 cursor-pointer group">
                                <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${form[field][c] ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                                  onClick={() => setForm((p) => ({ ...p, [field]: { ...p[field], [c]: !p[field][c] } }))}>
                                  {form[field][c] && <FaCheckCircle className="text-white text-[8px]" />}
                                </div>
                                <span className="text-sm text-gray-700">{c}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Sub-step 5: Croquis ────────────────────────────────────── */}
              {constatStep === 5 && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-500">Téléchargez une photo du croquis de l'accident ou faites un schéma depuis votre appareil.</p>
                  <div className="border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl p-8 text-center transition-all bg-gray-50 hover:bg-blue-50/30">
                    <FaCamera className="text-3xl text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-700 mb-1">Croquis de l'accident</p>
                    <p className="text-xs text-gray-400 mb-4">Photo du dessin à main levée, schéma de la voirie, positions des véhicules…</p>
                    <label className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                      <FaCamera className="text-xs" /> Choisir un fichier
                      <input type="file" className="hidden" accept="image/*" multiple
                        onChange={(e) => { if (e.target.files) set("sketchFiles", [...form.sketchFiles, ...Array.from(e.target.files)]); }} />
                    </label>
                  </div>
                  {form.sketchFiles.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                      <p className="text-xs font-semibold text-emerald-700">{form.sketchFiles.length} fichier(s) sélectionné(s)</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Sub-step 6: Informations complémentaires ───────────────── */}
              {constatStep === 6 && (
                <div className="space-y-7">
                  <div>
                    <h3 className={sec}>Déclaration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Nom assuré</label><input type="text" value={form.declaredName} onChange={(e) => set("declaredName", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Profession</label><input type="text" value={form.declaredProfession} onChange={(e) => set("declaredProfession", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Téléphone</label><input type="tel" value={form.declaredPhone} onChange={(e) => set("declaredPhone", e.target.value)} className={inp} /></div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Procès verbal</h3>
                    <div className="space-y-3">
                      {[
                        { label: "PV Gendarmerie établi ?", field: "pvGendarmerie" as const },
                        { label: "Rapport Police établi ?", field: "rapportPolice" as const },
                      ].map(({ label, field }) => (
                        <div key={field} className={`flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all ${form[field] ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                          onClick={() => set(field, !form[field])}>
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${form[field] ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                            {form[field] && <FaCheckCircle className="text-white text-xs" />}
                          </div>
                          <p className="text-sm font-bold text-gray-800">{label}</p>
                        </div>
                      ))}
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Brigade / Commissariat</label><input type="text" value={form.brigadeName} onChange={(e) => set("brigadeName", e.target.value)} className={inp} /></div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Conducteur habituel</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Conducteur habituel ?</label>
                        <div className="flex gap-2">
                          {[{ v: true, l: "Oui" }, { v: false, l: "Non" }].map(({ v, l }) => (
                            <button key={l} type="button" onClick={() => set("isUsualDriver", v)}
                              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${form.isUsualDriver === v ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500"}`}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Réside chez l'assuré ?</label>
                        <div className="flex gap-2">
                          {[{ v: true, l: "Oui" }, { v: false, l: "Non" }].map(({ v, l }) => (
                            <button key={l} type="button" onClick={() => set("residesWithInsured", v)}
                              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${form.residesWithInsured === v ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500"}`}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Date de naissance</label><input type="date" value={form.driverBirthDate} onChange={(e) => set("driverBirthDate", e.target.value)} className={inp} /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Sub-step 7: Véhicule assuré ────────────────────────────── */}
              {constatStep === 7 && (
                <div className="space-y-7">
                  <div>
                    <h3 className={sec}>Informations du déplacement</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Lieu habituel de garage</label><input type="text" value={form.garageLocation} onChange={(e) => set("garageLocation", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Motif du déplacement</label><input type="text" value={form.tripReason} onChange={(e) => set("tripReason", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Lieu d'expertise</label><input type="text" value={form.expertiseLocation} onChange={(e) => set("expertiseLocation", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Date d'expertise</label><input type="date" value={form.expertiseDate} onChange={(e) => set("expertiseDate", e.target.value)} className={inp} /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Téléphone contact</label><input type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inp} /></div>
                    </div>
                  </div>

                  <div>
                    <h3 className={sec}>Informations supplémentaires</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Véhicule volé ?", field: "vehicleStolen" as const },
                        { label: "Véhicule gagé ?", field: "vehiclePledged" as const },
                        { label: "Véhicule attelé ?", field: "vehicleTowing" as const },
                      ].map(({ label, field }) => (
                        <div key={field} className={`flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all ${form[field] ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                          onClick={() => set(field, !form[field])}>
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${form[field] ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                            {form[field] && <FaCheckCircle className="text-white text-xs" />}
                          </div>
                          <p className="text-sm font-bold text-gray-800">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {form.vehicleStolen && <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Numéro de série</label><input type="text" value={form.serialNumber} onChange={(e) => set("serialNumber", e.target.value)} className={inp} /></div>}
                      {form.vehiclePledged && <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Organisme de crédit</label><input type="text" value={form.creditOrganization} onChange={(e) => set("creditOrganization", e.target.value)} className={inp} /></div>}
                      <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Poids total en charge (kg)</label><input type="text" value={form.totalWeight} onChange={(e) => set("totalWeight", e.target.value)} className={inp} /></div>
                      {form.vehicleTowing && (
                        <>
                          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Immatriculation remorque</label><input type="text" value={form.trailerPlate} onChange={(e) => set("trailerPlate", e.target.value)} className={inp} /></div>
                          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Assurance remorque</label><input type="text" value={form.trailerInsurance} onChange={(e) => set("trailerInsurance", e.target.value)} className={inp} /></div>
                          <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Police remorque</label><input type="text" value={form.trailerPolicy} onChange={(e) => set("trailerPolicy", e.target.value)} className={inp} /></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Sub-step 8: Blessés ────────────────────────────────────── */}
              {constatStep === 8 && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-500">Ajoutez les informations pour chaque personne blessée dans l'accident.</p>

                  {form.injuries.length === 0 && (
                    <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-400 mb-4">Aucun blessé déclaré</p>
                    </div>
                  )}

                  {form.injuries.map((b, idx) => (
                    <div key={b.id} className="rounded-2xl border border-gray-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-700">Blessé #{idx + 1}</h4>
                        <button type="button" onClick={() => delBlessed(b.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Nom</label><input type="text" value={b.nom} onChange={(e) => updBlessed(b.id, { nom: e.target.value })} className={inp} /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Prénom</label><input type="text" value={b.prenom} onChange={(e) => updBlessed(b.id, { prenom: e.target.value })} className={inp} /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Âge</label><input type="number" value={b.age} onChange={(e) => updBlessed(b.id, { age: e.target.value })} className={inp} /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Profession</label><input type="text" value={b.profession} onChange={(e) => updBlessed(b.id, { profession: e.target.value })} className={inp} /></div>
                        <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Adresse</label><input type="text" value={b.adresse} onChange={(e) => updBlessed(b.id, { adresse: e.target.value })} className={inp} /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Sécurité sociale</label><input type="text" value={b.securiteSociale} onChange={(e) => updBlessed(b.id, { securiteSociale: e.target.value })} className={inp} /></div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Situation</label>
                          <select value={b.situation} onChange={(e) => updBlessed(b.id, { situation: e.target.value as BlessedItem["situation"] })} className={inp}>
                            <option value="">— Sélectionner —</option>
                            <option value="Piéton">Piéton</option>
                            <option value="A">Véhicule A</option>
                            <option value="B">Véhicule B</option>
                          </select>
                        </div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Nature des blessures</label><input type="text" value={b.natureBlessures} onChange={(e) => updBlessed(b.id, { natureBlessures: e.target.value })} className={inp} /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Gravité</label><input type="text" placeholder="Légère, grave…" value={b.gravite} onChange={(e) => updBlessed(b.id, { gravite: e.target.value })} className={inp} /></div>
                        <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Soins / Hôpital</label><input type="text" value={b.soins} onChange={(e) => updBlessed(b.id, { soins: e.target.value })} className={inp} /></div>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addBlessed}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-all">
                    <FaPlus className="text-xs" /> Ajouter un blessé
                  </button>
                </div>
              )}

              {/* ── Sub-step 9: Signature électronique ────────────────────── */}
              {constatStep === 9 && (
                <div className="space-y-7">
                  <p className="text-sm text-gray-500">Chaque partie signe dans le cadre correspondant. Utilisez le doigt ou la souris.</p>
                  <SignatureCanvas label="Signature — Conducteur A" value={form.signatureA} onChange={(v) => set("signatureA", v)} />
                  <SignatureCanvas label="Signature — Conducteur B" value={form.signatureB} onChange={(v) => set("signatureB", v)} />
                  <SignatureCanvas label="Signature — Assuré" value={form.signatureInsured} onChange={(v) => set("signatureInsured", v)} />
                </div>
              )}

              {/* Constat navigation (desktop only — mobile uses sticky bar) */}
              <div className="hidden sm:flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={constatPrev}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  <FaArrowLeft className="text-xs" /> {constatStep === 1 ? "Photos" : "Retour"}
                </button>
                <button type="button" onClick={constatNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  {constatStep < 9 ? "Suivant" : "Terminer le Constat"} <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review & Submit ─────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800 mb-1">Review & Submit</h2>
                <p className="text-sm text-gray-500">Vérifiez votre déclaration avant de soumettre.</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Date & Time", value: `${form.date} at ${form.time}` },
                  { label: "Location", value: form.location || "—" },
                  { label: "Wilaya", value: form.wilaya || "—" },
                  { label: "Weather", value: form.weather || "—" },
                  { label: "Contract", value: form.contractId || "—" },
                  { label: "Towing Requested", value: form.needTowing ? "Yes" : "No" },
                  { label: "Véhicule A — Plaque", value: form.vaPlateNumber || "—" },
                  { label: "Véhicule A — Conducteur", value: [form.vaDriverLastName, form.vaDriverFirstName].filter(Boolean).join(" ") || "—" },
                  { label: "Véhicule A — Assurance", value: [form.vaInsuranceCompany, form.vaPolicyNumber].filter(Boolean).join(" / ") || "—" },
                  { label: "Véhicule B — Plaque", value: form.vbPlateNumber || "—" },
                  { label: "Véhicule B — Conducteur", value: [form.vbDriverLastName, form.vbDriverFirstName].filter(Boolean).join(" ") || "—" },
                  { label: "Véhicule B — Assurance", value: [form.vbInsuranceCompany, form.vbPolicyNumber].filter(Boolean).join(" / ") || "—" },
                  { label: "Circonstances A cochées", value: `${Object.values(form.circumstancesA).filter(Boolean).length}` },
                  { label: "Circonstances B cochées", value: `${Object.values(form.circumstancesB).filter(Boolean).length}` },
                  { label: "Blessés déclarés", value: `${form.injuries.length}` },
                  { label: "Photos", value: `${form.photos.length} photo(s)` },
                  { label: "Croquis", value: `${form.sketchFiles.length} fichier(s)` },
                  { label: "Signature A", value: form.signatureA ? "✓ Signée" : "Non signée" },
                  { label: "Signature B", value: form.signatureB ? "✓ Signée" : "Non signée" },
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
                En soumettant, vous confirmez que cette déclaration est exacte et complète.
              </div>
            </div>
          )}

          {/* Main navigation — steps 1, 2, 4 only (step 3 has its own nav) */}
          {step !== 3 && (
            <>
              {submitError ? (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{submitError}</p>
              ) : null}

              {/* Desktop nav */}
              <div className="hidden sm:flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1) as MainStep)}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <FaArrowLeft className="text-xs" /> Retour
              </button>
              {step < 4 ? (
                <button type="button"
                  onClick={() => { if (step === 2) setConstatStep(1); setStep((s) => Math.min(4, s + 1) as MainStep); }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Continuer <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleAccidentSubmit()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-sm font-bold shadow-md shadow-rose-500/25 hover:bg-rose-700 disabled:opacity-60 transition-all">
                  {submitting ? "Envoi en cours..." : <><FaCheckCircle className="text-xs" /> Submit Declaration</>}
                </button>
              )}
              </div>
            </>
          )}

          {/* Constat nav — hide on mobile (sticky bar handles it) */}
        </div>
      </div>

      {/* ── Mobile sticky bottom nav ─────────────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            type="button"
            disabled={step === 1 && constatStep === 1}
            onClick={() => {
              if (step === 3 && constatStep > 1) return setConstatStep((s) => s - 1);
              if (step === 3 && constatStep === 1) return setStep(2);
              setStep((s) => Math.max(1, s - 1) as MainStep);
            }}
            className="shrink-0 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 disabled:opacity-40 active:bg-gray-50"
          >
            Retour
          </button>

          {/* Forward button */}
          {step === 3 ? (
            <button
              type="button"
              onClick={constatNext}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-md active:opacity-90"
            >
              {constatStep < 9 ? "Suivant" : "Terminer"}
            </button>
          ) : step < 4 ? (
            <button
              type="button"
              onClick={() => { if (step === 2) setConstatStep(1); setStep((s) => Math.min(4, s + 1) as MainStep); }}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-md active:opacity-90"
            >
              Continuer
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleAccidentSubmit()}
              className="flex-1 rounded-2xl bg-rose-600 py-3 text-sm font-bold text-white shadow-md disabled:opacity-60 active:opacity-90"
            >
              {submitting ? "Envoi…" : "Soumettre la déclaration"}
            </button>
          )}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </div>
  );
}
