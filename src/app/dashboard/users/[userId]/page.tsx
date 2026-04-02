"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaInfoCircle,
  FaPhone,
  FaShieldAlt,
  FaTrash,
  FaUser,
} from "react-icons/fa";

type UserDetail = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
  dateOfBirth: string | null;
  gender: string | null;
  phone: string | null;
  profession: string | null;
  wilaya: string | null;
  region: string | null;
  address: string | null;
  licenseNumber: string | null;
  licenseType: string | null;
  licenseIssueDate: string | null;
  secondaryDrivers: string[];
  profileCompletion: number;
  accountStatus: "Actif" | "Partiel" | "Administrateur";
  assuranceCount: number;
  demandCount: number;
  assurances: Array<{
    id: string;
    title: string;
    category: string;
    status: "Active" | "En cours" | "Expiree";
    premium: string;
    lastUpdate: string;
    reference: string;
  }>;
  demands: Array<{
    id: string;
    title: string;
    status: "En attente" | "Traitee" | "Approuvee";
    submittedAt: string;
    channel: string;
    notes: string;
  }>;
};

type UserApiResponse = {
  user: UserDetail;
};

type UserFormState = {
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  dateOfBirth: string;
  gender: string;
  phone: string;
  profession: string;
  wilaya: string;
  region: string;
  address: string;
  licenseNumber: string;
  licenseType: string;
  licenseIssueDate: string;
  secondaryDrivers: string;
};

const initialFormState: UserFormState = {
  email: "",
  name: "",
  role: "USER",
  dateOfBirth: "",
  gender: "",
  phone: "",
  profession: "",
  wilaya: "",
  region: "",
  address: "",
  licenseNumber: "",
  licenseType: "",
  licenseIssueDate: "",
  secondaryDrivers: "",
};

const statusStyles: Record<UserDetail["accountStatus"], string> = {
  Actif: "border-emerald-300 bg-emerald-50 text-emerald-700",
  Partiel: "border-amber-300 bg-amber-50 text-amber-700",
  Administrateur: "border-blue-300 bg-blue-50 text-blue-700",
};

const roleStyles: Record<UserDetail["role"], string> = {
  ADMIN: "border-blue-300 bg-blue-50 text-blue-700",
  USER: "border-slate-300 bg-slate-100 text-slate-700",
};

const assuranceStatusStyles: Record<UserDetail["assurances"][number]["status"], string> = {
  Active: "border-emerald-300 bg-emerald-50 text-emerald-700",
  "En cours": "border-amber-300 bg-amber-50 text-amber-700",
  Expiree: "border-rose-300 bg-rose-50 text-rose-700",
};

const demandStatusStyles: Record<UserDetail["demands"][number]["status"], string> = {
  "En attente": "border-amber-300 bg-amber-50 text-amber-700",
  Traitee: "border-blue-300 bg-blue-50 text-blue-700",
  Approuvee: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

function formatInputDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatNullable(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "-";
}

export default function UserDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [form, setForm] = useState<UserFormState>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        const data = (await response.json()) as Partial<UserApiResponse> & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load user");
        }

        if (!isCancelled && data.user) {
          setUser(data.user);
          setForm({
            email: data.user.email,
            name: data.user.name ?? "",
            role: data.user.role,
            dateOfBirth: formatInputDate(data.user.dateOfBirth),
            gender: data.user.gender ?? "",
            phone: data.user.phone ?? "",
            profession: data.user.profession ?? "",
            wilaya: data.user.wilaya ?? "",
            region: data.user.region ?? "",
            address: data.user.address ?? "",
            licenseNumber: data.user.licenseNumber ?? "",
            licenseType: data.user.licenseType ?? "",
            licenseIssueDate: formatInputDate(data.user.licenseIssueDate),
            secondaryDrivers: data.user.secondaryDrivers.join("\n"),
          });
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unexpected error");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isCancelled = true;
    };
  }, [isAdmin, status, userId]);

  const secondaryDrivers = useMemo(
    () =>
      form.secondaryDrivers
        .split("\n")
        .map((driver) => driver.trim())
        .filter(Boolean),
    [form.secondaryDrivers]
  );

  const handleChange = (field: keyof UserFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          role: form.role,
          dateOfBirth: form.dateOfBirth || null,
          gender: form.gender,
          phone: form.phone,
          profession: form.profession,
          wilaya: form.wilaya,
          region: form.region,
          address: form.address,
          licenseNumber: form.licenseNumber,
          licenseType: form.licenseType,
          licenseIssueDate: form.licenseIssueDate || null,
          secondaryDrivers,
        }),
      });

      const data = (await response.json()) as Partial<UserApiResponse> & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to update user");
      }

      if (data.user) {
        setUser(data.user);
        setForm({
          email: data.user.email,
          name: data.user.name ?? "",
          role: data.user.role,
          dateOfBirth: formatInputDate(data.user.dateOfBirth),
          gender: data.user.gender ?? "",
          phone: data.user.phone ?? "",
          profession: data.user.profession ?? "",
          wilaya: data.user.wilaya ?? "",
          region: data.user.region ?? "",
          address: data.user.address ?? "",
          licenseNumber: data.user.licenseNumber ?? "",
          licenseType: data.user.licenseType ?? "",
          licenseIssueDate: formatInputDate(data.user.licenseIssueDate),
          secondaryDrivers: data.user.secondaryDrivers.join("\n"),
        });
      }

      setMessage("Utilisateur mis a jour avec succes.");
      setIsEditing(false);
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Erreur lors de la mise a jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      return;
    }

    if (!globalThis.confirm("Supprimer ce compte utilisateur ? Cette action est definitive.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete user");
      }

      router.push("/dashboard/users");
    } catch (deleteError) {
      setMessage(deleteError instanceof Error ? deleteError.message : "Erreur lors de la suppression");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-6xl rounded-3xl border border-cyan-400/30 bg-white/80 p-8 shadow-xl">
        Chargement du dossier utilisateur...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-red-200 bg-white/90 p-8 text-red-700 shadow-xl">
        Acces refuse. Cette page est reservee aux administrateurs.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-slate-700 shadow-xl">
        Utilisateur introuvable.
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <FaArrowLeft /> Retour a la liste
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            {isEditing ? "Fermer l'edition" : "Modifier le compte"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>

      <section className="rounded-3xl border border-cyan-500/30 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <FaUser /> Dossier utilisateur
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              {user.name ?? "Utilisateur sans nom"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Page detaillee regroupant le statut, les informations personnelles, les assurances
              et les demandes liees a ce compte.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[user.accountStatus]}`}>
                {user.accountStatus}
              </span>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
                {user.role}
              </span>
              <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                Profil complété a {user.profileCompletion}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <MiniStat label="Assurances" value={user.assuranceCount.toString()} helper="Historique associe" />
            <MiniStat label="Demandes" value={user.demandCount.toString()} helper="Trajets enregistrés" />
            <MiniStat label="Mise a jour" value={user.updatedAt} helper="Derniere modification" />
          </div>
        </div>
      </section>

      {message ? (
        <p className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Informations personnelles</h2>
              <p className="mt-1 text-sm text-slate-500">Edition du dossier principal.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <FaInfoCircle /> ID {user.id.slice(0, 8)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Email" value={form.email} onChange={(value) => handleChange("email", value)} disabled={!isEditing} icon={<FaEnvelope />} />
            <Field label="Nom complet" value={form.name} onChange={(value) => handleChange("name", value)} disabled={!isEditing} icon={<FaUser />} />
            <SelectField
              label="Role"
              value={form.role}
              onChange={(value) => handleChange("role", value)}
              disabled={!isEditing}
              options={[
                { value: "USER", label: "USER" },
                { value: "ADMIN", label: "ADMIN" },
              ]}
            />
            <Field label="Date de naissance" value={form.dateOfBirth} onChange={(value) => handleChange("dateOfBirth", value)} disabled={!isEditing} type="date" icon={<FaCalendarAlt />} />
            <Field label="Sexe" value={form.gender} onChange={(value) => handleChange("gender", value)} disabled={!isEditing} icon={<FaCheckCircle />} />
            <Field label="Telephone" value={form.phone} onChange={(value) => handleChange("phone", value)} disabled={!isEditing} icon={<FaPhone />} />
            <Field label="Profession" value={form.profession} onChange={(value) => handleChange("profession", value)} disabled={!isEditing} />
            <Field label="Wilaya" value={form.wilaya} onChange={(value) => handleChange("wilaya", value)} disabled={!isEditing} />
            <Field label="Region" value={form.region} onChange={(value) => handleChange("region", value)} disabled={!isEditing} />
            <Field label="Adresse" value={form.address} onChange={(value) => handleChange("address", value)} disabled={!isEditing} />
            <Field label="Numero de permis" value={form.licenseNumber} onChange={(value) => handleChange("licenseNumber", value)} disabled={!isEditing} icon={<FaShieldAlt />} />
            <Field label="Type de permis" value={form.licenseType} onChange={(value) => handleChange("licenseType", value)} disabled={!isEditing} icon={<FaShieldAlt />} />
            <Field label="Date de delivrance" value={form.licenseIssueDate} onChange={(value) => handleChange("licenseIssueDate", value)} disabled={!isEditing} type="date" />
          </div>

          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Conducteurs secondaires
            </div>
            <textarea
              id="secondary-drivers"
              value={form.secondaryDrivers}
              disabled={!isEditing}
              onChange={(event) => handleChange("secondaryDrivers", event.target.value)}
              placeholder="Un conducteur par ligne"
              className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {isEditing ? (
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
            <h3 className="text-lg font-bold text-slate-900">Vue d'ensemble</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Telephone" value={formatNullable(user.phone)} />
              <InfoRow label="Profession" value={formatNullable(user.profession)} />
              <InfoRow label="Date de naissance" value={formatNullable(user.dateOfBirth)} />
              <InfoRow label="Wilaya / Region" value={`${formatNullable(user.wilaya)} / ${formatNullable(user.region)}`} />
              <InfoRow label="Adresse" value={formatNullable(user.address)} />
              <InfoRow label="Permis" value={formatNullable(user.licenseNumber)} />
              <InfoRow label="Conducteurs secondaires" value={String(user.secondaryDrivers.length)} />
            </dl>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
            <h3 className="text-lg font-bold text-slate-900">Activite du compte</h3>
            <div className="mt-4 space-y-3">
              <TimelineItem title="Compte cree" value={user.createdAt} />
              <TimelineItem title="Derniere modification" value={user.updatedAt} />
              <TimelineItem title="Role courant" value={user.role} />
            </div>
          </section>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HistoryCard
          title="Historique des assurances"
          subtitle="Apercu dynamique des contrats associes au client."
          icon={<FaShieldAlt />}
          emptyLabel="Aucune assurance disponible pour ce dossier."
          items={user.assurances}
          renderItem={(item) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.reference}</p>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${assuranceStatusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-2">
                <InfoRow label="Categorie" value={item.category} compact />
                <InfoRow label="Prime" value={item.premium} compact />
                <InfoRow label="Derniere mise a jour" value={item.lastUpdate} compact />
                <InfoRow label="Identifiant" value={item.id} compact />
              </dl>
            </div>
          )}
        />

        <HistoryCard
          title="Historique des demandes"
          subtitle="Suivi des demandes et actions associees au client."
          icon={<FaCheckCircle />}
          emptyLabel="Aucune demande disponible pour ce dossier."
          items={user.demands}
          renderItem={(item) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.channel}</p>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${demandStatusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <InfoRow label="Date d'envoi" value={item.submittedAt} compact />
                <InfoRow label="Reference" value={item.id} compact />
                <p className="text-sm text-slate-500">{item.notes}</p>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  icon,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
  icon?: ReactNode;
}>) {
  return (
    <label className="space-y-1">
      <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {icon}
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  options,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  options: Array<{ label: string; value: string }>;
}>) {
  return (
    <label className="space-y-1">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniStat({
  label,
  value,
  helper,
}: Readonly<{
  label: string;
  value: string;
  helper: string;
}>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  compact = false,
}: Readonly<{
  label: string;
  value: string;
  compact?: boolean;
}>) {
  return (
    <div className={compact ? "space-y-1" : "flex items-start justify-between gap-4"}>
      <dt className="text-slate-500">{label}</dt>
      <dd className={`font-medium text-slate-800 ${compact ? "" : "text-right"}`}>{value}</dd>
    </div>
  );
}

function TimelineItem({
  title,
  value,
}: Readonly<{
  title: string;
  value: string;
}>) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function HistoryCard<T extends { id: string }>({
  title,
  subtitle,
  icon,
  items,
  emptyLabel,
  renderItem,
}: Readonly<{
  title: string;
  subtitle: string;
  icon: ReactNode;
  items: T[];
  emptyLabel: string;
  renderItem: (item: T) => ReactNode;
}>) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 rounded-2xl bg-cyan-50 p-3 text-cyan-700">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-4">{items.map((item) => <div key={item.id}>{renderItem(item)}</div>)}</div>
      )}
    </section>
  );
}
