"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaFileAlt, FaImage, FaMapMarkerAlt, FaPhone, FaSearch, FaShieldAlt,
  FaTimesCircle, FaUser,
} from "react-icons/fa";

type DemandStatus = "EN_ATTENTE" | "EN_REVUE" | "ACCEPTEE" | "REFUSEE";

type AccidentDemand = {
  id: string;
  caseNumber: string;
  status: DemandStatus;
  accidentDate: string;
  accidentTime: string;
  location: string;
  wilaya: string;
  weather: string;
  description: string;
  vehiclePlate: string;
  internalNotes: string[];
  photoUrls: string[];
  sketchUrls: string[];
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null } | null;
  contract: {
    contractNumber: string;
    assuranceType: string;
    brand: string;
    model: string;
    registration: string;
  };
};

const STATUS_META: Record<DemandStatus, { label: string; tone: string; description: string }> = {
  EN_ATTENTE: { label: "En attente", tone: "border-amber-300 bg-amber-50 text-amber-700", description: "En attente de première revue" },
  EN_REVUE:   { label: "En revue",   tone: "border-blue-300 bg-blue-50 text-blue-700",   description: "En cours d'analyse" },
  ACCEPTEE:   { label: "Acceptée",   tone: "border-emerald-300 bg-emerald-50 text-emerald-700", description: "Validée et prête au traitement" },
  REFUSEE:    { label: "Refusée",    tone: "border-rose-300 bg-rose-50 text-rose-700",   description: "Clôturée avec refus" },
};

const STATUS_ORDER: DemandStatus[] = ["EN_ATTENTE", "EN_REVUE", "ACCEPTEE", "REFUSEE"];

export default function Page() {
  const { data: session, status } = useSession();
  const [demands, setDemands] = useState<AccidentDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DemandStatus | "ALL">("ALL");
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/accidents?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur lors du chargement.");
      const data = (await res.json()) as { accidents: AccidentDemand[] };
      const list = data.accidents ?? [];
      setDemands(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, selectedId]);

  useEffect(() => { void load(); }, [load]);

  const filteredDemands = useMemo(() => demands, [demands]);
  const selectedDemand = useMemo(
    () => filteredDemands.find((d) => d.id === selectedId) ?? filteredDemands[0] ?? null,
    [filteredDemands, selectedId]
  );

  const summary = useMemo(() => ({
    total: demands.length,
    waiting: demands.filter((d) => d.status === "EN_ATTENTE").length,
    inReview: demands.filter((d) => d.status === "EN_REVUE").length,
    processed: demands.filter((d) => d.status === "ACCEPTEE" || d.status === "REFUSEE").length,
  }), [demands]);

  const updateStatus = async (nextStatus: DemandStatus, note: string) => {
    if (!selectedDemand || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/accidents/${selectedDemand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, internalNote: note }),
      });
      if (!res.ok) throw new Error("Mise à jour échouée.");
      setDemands((prev) =>
        prev.map((d) =>
          d.id === selectedDemand.id
            ? { ...d, status: nextStatus, internalNotes: note ? [note, ...d.internalNotes] : d.internalNotes, updatedAt: new Date().toISOString() }
            : d
        )
      );
      setActionMsg(note || `Statut mis à jour : ${STATUS_META[nextStatus].label}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const addNote = async () => {
    if (!selectedDemand || !noteText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/accidents/${selectedDemand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNote: noteText.trim() }),
      });
      if (!res.ok) throw new Error("Échec de l'ajout de note.");
      setDemands((prev) =>
        prev.map((d) =>
          d.id === selectedDemand.id
            ? { ...d, internalNotes: [noteText.trim(), ...d.internalNotes], updatedAt: new Date().toISOString() }
            : d
        )
      );
      setActionMsg("Note interne ajoutée.");
      setNoteText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-8 text-sm text-gray-500">Chargement des demandes...</div>;
  }

  if (!isAdmin) {
    return <div className="p-8 text-sm text-red-600">Accès refusé — administrateurs uniquement.</div>;
  }

  return (
    <div className="relative z-10 mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
      {/* Header */}
      <section
        className="rounded-3xl border border-cyan-500/30 p-6 text-white shadow-2xl md:p-8"
        style={{ backgroundImage: "linear-gradient(135deg,#020617 0%,#0f172a 55%,#1e293b 100%)" }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <FaShieldAlt /> Gestion des demandes
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Déclarations d'accident
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Consultez, analysez et traitez chaque déclaration depuis cet écran.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur md:grid-cols-4">
            <StatCard label="Total" value={String(summary.total)} helper="Reçues" />
            <StatCard label="Attente" value={String(summary.waiting)} helper="À traiter" />
            <StatCard label="Revue" value={String(summary.inReview)} helper="En cours" />
            <StatCard label="Traitées" value={String(summary.processed)} helper="Finalisées" />
          </div>
        </div>
      </section>

      {actionMsg && (
        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">{actionMsg}</p>
      )}
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {filteredDemands.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 text-center text-sm text-slate-500 shadow-xl">
          Aucune déclaration trouvée.
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">File des demandes</h2>
                <p className="mt-1 text-sm text-slate-500">Filtrez et ouvrez un dossier.</p>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 shadow-sm focus-within:border-cyan-400 focus-within:bg-white">
                <FaSearch className="shrink-0 text-cyan-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <FilterButton label="Toutes" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
                {STATUS_ORDER.map((s) => (
                  <FilterButton key={s} label={STATUS_META[s].label} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
                ))}
              </div>

              <div className="space-y-3">
                {filteredDemands.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedId(d.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      d.id === selectedDemand?.id
                        ? "border-cyan-400 bg-cyan-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{d.caseNumber}</p>
                        <p className="mt-1 text-xs text-slate-500">{d.user?.name ?? d.user?.email ?? "—"}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[d.status].tone}`}>
                        {STATUS_META[d.status].label}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-600" />{d.accidentDate} {d.accidentTime}</p>
                      <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-cyan-600" />{d.location}</p>
                      <p className="flex items-center gap-2"><FaUser className="text-cyan-600" />{d.contract.contractNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Detail panel */}
          {selectedDemand && (
            <main className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{selectedDemand.caseNumber}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_META[selectedDemand.status].tone}`}>
                        {STATUS_META[selectedDemand.status].label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {STATUS_META[selectedDemand.status].description} — mis à jour le {new Date(selectedDemand.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => void updateStatus("EN_REVUE", "Demande placée en revue.")} tone="outline" disabled={submitting}>
                      Mettre en revue
                    </ActionButton>
                    <ActionButton onClick={() => void updateStatus("ACCEPTEE", "Demande acceptée.")} tone="success" disabled={submitting}>
                      <FaCheckCircle /> Accepter
                    </ActionButton>
                    <ActionButton onClick={() => void updateStatus("REFUSEE", "Demande refusée.")} tone="danger" disabled={submitting}>
                      <FaTimesCircle /> Refuser
                    </ActionButton>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoTile label="Demandeur" value={selectedDemand.user?.name ?? "—"} icon={<FaUser />} />
                  <InfoTile label="Téléphone" value={selectedDemand.user?.phone ?? "—"} icon={<FaPhone />} />
                  <InfoTile label="Contrat" value={selectedDemand.contract.contractNumber} icon={<FaFileAlt />} />
                  <InfoTile label="Véhicule" value={`${selectedDemand.contract.brand} ${selectedDemand.contract.model}`} icon={<FaShieldAlt />} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700"><FaExclamationTriangle /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Détails de l'accident</h3>
                    <p className="text-sm text-slate-500">Informations déclarées pour l'analyse du sinistre.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DetailRow label="Date" value={`${selectedDemand.accidentDate} ${selectedDemand.accidentTime}`} />
                  <DetailRow label="Lieu" value={selectedDemand.location} />
                  <DetailRow label="Wilaya" value={selectedDemand.wilaya} />
                  <DetailRow label="Météo" value={selectedDemand.weather} />
                  <DetailRow label="Plaque" value={selectedDemand.vehiclePlate} />
                  <DetailRow label="Description" value={selectedDemand.description} />
                </div>
              </section>

              {(selectedDemand.photoUrls?.length > 0 || selectedDemand.sketchUrls?.length > 0) && (
                <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700"><FaImage /></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Photos & documents</h3>
                      <p className="text-sm text-slate-500">Pièces jointes soumises par l'assuré.</p>
                    </div>
                  </div>

                  {selectedDemand.photoUrls?.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Photos de l'accident ({selectedDemand.photoUrls.length})
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {selectedDemand.photoUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 aspect-video">
                            <img
                              src={url}
                              alt={`Photo accident ${i + 1}`}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDemand.sketchUrls?.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Croquis ({selectedDemand.sketchUrls.length})
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {selectedDemand.sketchUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 aspect-video">
                            <img
                              src={url}
                              alt={`Croquis ${i + 1}`}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700"><FaClock /></div>
                  <h3 className="text-lg font-bold text-slate-900">Notes internes</h3>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Ajouter une note interne..."
                    className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => void addNote()}
                      disabled={submitting || !noteText.trim()}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Enregistrer la note
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedDemand.internalNotes.length === 0 ? (
                      <p className="text-sm text-slate-400">Aucune note pour ce dossier.</p>
                    ) : (
                      selectedDemand.internalNotes.map((note, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">{note}</div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </main>
          )}
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, helper }: Readonly<{ label: string; value: string; helper: string }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }: Readonly<{ label: string; active: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${active ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
    >
      {label}
    </button>
  );
}

function ActionButton({ children, onClick, tone, disabled }: Readonly<{ children: React.ReactNode; onClick: () => void; tone: "outline" | "success" | "danger"; disabled?: boolean }>) {
  const cls = tone === "success"
    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
    : tone === "danger"
      ? "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${cls}`}>
      {children}
    </button>
  );
}

function InfoTile({ label, value, icon }: Readonly<{ label: string; value: string; icon: React.ReactNode }>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{icon}{label}</div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value || "—"}</p>
    </div>
  );
}
