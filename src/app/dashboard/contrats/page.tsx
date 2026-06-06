"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type ContractStatus = "EN_ATTENTE" | "APPROUVE" | "REFUSE" | "EXPIRE";

type Contract = {
  id: string;
  contractNumber: string;
  status: ContractStatus;
  assuranceType: string;
  brand: string;
  model: string;
  registration: string;
  totalCost: number;
  basePrice: number;
  optionsTotal: number;
  paymentMethod: string;
  adminNotes: string[];
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null } | null;
};

const STATUS_META: Record<ContractStatus, { label: string; tone: string }> = {
  EN_ATTENTE: { label: "En attente", tone: "border-amber-300 bg-amber-50 text-amber-700" },
  APPROUVE:   { label: "Approuvé",   tone: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  REFUSE:     { label: "Refusé",     tone: "border-rose-300 bg-rose-50 text-rose-700" },
  EXPIRE:     { label: "Expiré",     tone: "border-slate-300 bg-slate-100 text-slate-600" },
};

const STATUS_ORDER: ContractStatus[] = ["EN_ATTENTE", "APPROUVE", "REFUSE", "EXPIRE"];

export default function Page() {
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "ALL">("ALL");
  const [noteText, setNoteText] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/contracts?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur lors du chargement.");
      const data = (await res.json()) as { contracts: Contract[] };
      const list = data.contracts ?? [];
      setContracts(list);
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, selectedId]);

  useEffect(() => { void load(); }, [load]);

  const selectedContract = useMemo(
    () => contracts.find((c) => c.id === selectedId) ?? contracts[0] ?? null,
    [contracts, selectedId]
  );

  const summary = useMemo(() => ({
    total: contracts.length,
    waiting: contracts.filter((c) => c.status === "EN_ATTENTE").length,
    approved: contracts.filter((c) => c.status === "APPROUVE").length,
    refused: contracts.filter((c) => c.status === "REFUSE" || c.status === "EXPIRE").length,
  }), [contracts]);

  const updateStatus = async (nextStatus: ContractStatus, note?: string) => {
    if (!selectedContract || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/contracts/${selectedContract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, adminNote: note }),
      });
      if (!res.ok) throw new Error("Mise à jour échouée.");
      setContracts((prev) =>
        prev.map((c) =>
          c.id === selectedContract.id
            ? { ...c, status: nextStatus, adminNotes: note ? [note, ...c.adminNotes] : c.adminNotes, updatedAt: new Date().toISOString() }
            : c
        )
      );
      setActionMsg(`Contrat ${STATUS_META[nextStatus].label.toLowerCase()}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  const addNote = async () => {
    if (!selectedContract || !noteText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/contracts/${selectedContract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: noteText.trim() }),
      });
      if (!res.ok) throw new Error("Échec de l'ajout de note.");
      setContracts((prev) =>
        prev.map((c) =>
          c.id === selectedContract.id
            ? { ...c, adminNotes: [noteText.trim(), ...c.adminNotes] }
            : c
        )
      );
      setActionMsg("Note ajoutée.");
      setNoteText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-8 text-sm text-gray-500">Chargement des contrats...</div>;
  }

  if (!isAdmin) {
    return <div className="p-8 text-sm text-red-600">Accès refusé — administrateurs uniquement.</div>;
  }

  return (
    <div className="mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
      {/* Header */}
      <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-6 text-white shadow-2xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">Admin</p>
            <h1 className="text-3xl font-black text-white md:text-4xl">Gestion des contrats</h1>
            <p className="mt-2 text-sm text-blue-200">Approuvez, refusez et annotez les demandes de souscription.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
            {[
              { label: "Total", value: summary.total, sub: "Contrats" },
              { label: "Attente", value: summary.waiting, sub: "À traiter" },
              { label: "Approuvés", value: summary.approved, sub: "Actifs" },
              { label: "Refusés", value: summary.refused, sub: "Clôturés" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-xs uppercase tracking-widest text-blue-300">{s.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-blue-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {actionMsg && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMsg}</p>
      )}
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {contracts.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-xl">
          Aucun contrat trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Sidebar list */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contrats</h2>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par numéro, véhicule..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />

              <div className="flex flex-wrap gap-2">
                {(["ALL", ...STATUS_ORDER] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      statusFilter === s ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {s === "ALL" ? "Tous" : STATUS_META[s].label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {contracts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      c.id === selectedContract?.id
                        ? "border-blue-400 bg-blue-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{c.contractNumber}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{c.user?.name ?? c.user?.email ?? "—"}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_META[c.status].tone}`}>
                        {STATUS_META[c.status].label}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600">{c.brand} {c.model} — {c.registration}</p>
                    <p className="mt-1 text-xs font-semibold text-blue-600">{c.totalCost.toLocaleString()} DA</p>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Detail */}
          {selectedContract && (
            <main className="space-y-6">
              {/* Header card */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{selectedContract.contractNumber}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_META[selectedContract.status].tone}`}>
                        {STATUS_META[selectedContract.status].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Soumis le {new Date(selectedContract.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void updateStatus("APPROUVE", "Contrat approuvé après vérification.")}
                      className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      ✓ Approuver
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void updateStatus("REFUSE", "Contrat refusé après vérification.")}
                      className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                    >
                      ✕ Refuser
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void updateStatus("EXPIRE")}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Expirer
                    </button>
                  </div>
                </div>
              </section>

              {/* Contract info grid */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-base font-bold text-slate-900">Informations du contrat</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[
                    { label: "Type", value: selectedContract.assuranceType },
                    { label: "Véhicule", value: `${selectedContract.brand} ${selectedContract.model}` },
                    { label: "Immatriculation", value: selectedContract.registration },
                    { label: "Base", value: `${selectedContract.basePrice.toLocaleString()} DA` },
                    { label: "Options", value: `${selectedContract.optionsTotal.toLocaleString()} DA` },
                    { label: "Total", value: `${selectedContract.totalCost.toLocaleString()} DA` },
                    { label: "Paiement", value: selectedContract.paymentMethod },
                    { label: "Client", value: selectedContract.user?.name ?? "—" },
                    { label: "Email", value: selectedContract.user?.email ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Admin notes */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-base font-bold text-slate-900">Notes administratives</h3>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note interne..."
                  className="min-h-24 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={submitting || !noteText.trim()}
                    onClick={() => void addNote()}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    Enregistrer la note
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedContract.adminNotes.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune note pour ce contrat.</p>
                  ) : (
                    selectedContract.adminNotes.map((note, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{note}</div>
                    ))
                  )}
                </div>
              </section>
            </main>
          )}
        </div>
      )}
    </div>
  );
}
