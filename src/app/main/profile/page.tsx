
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { setProfileStatusCache } from "@/app/lib/clientCache";

type ProfileForm = {
  name: string;
  email: string;
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

type ProfileApiUser = {
  name: string | null;
  email: string | null;
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
};

type AssuranceItem = {
  id: string;
  title: string;
  type: string;
  status: "En cours" | "Active" | "Expiree";
  premium: string;
  lastUpdate: string;
};

const initialForm: ProfileForm = {
  name: "",
  email: "",
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

const formatDateForInput = (date: string | null | undefined) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
};

const getAssuranceStatusClass = (status: AssuranceItem["status"]) => {
  if (status === "Active") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "En cours") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
};

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [forceCompletion, setForceCompletion] = useState(false);

  const isAuthenticated = status === "authenticated";

  const secondaryDriversArray = useMemo(
    () =>
      form.secondaryDrivers
        .split("\n")
        .map((driver) => driver.trim())
        .filter(Boolean),
    [form.secondaryDrivers]
  );

  const assurances: AssuranceItem[] = useMemo(
    () => [
      {
        id: "ASS-2026-001",
        title: "Assurance Auto - Peugeot 208",
        type: "Tous risques",
        status: "Active",
        premium: "18 500 DA / an",
        lastUpdate: "15/03/2026",
      },
      {
        id: "ASS-2026-014",
        title: "Assurance Agricole - Tracteur",
        type: "Materiel agricole",
        status: "En cours",
        premium: "12 000 DA / an",
        lastUpdate: "28/03/2026",
      },
      {
        id: "ASS-2025-091",
        title: "Assurance Habitation",
        type: "Multirisque habitation",
        status: "Expiree",
        premium: "9 900 DA / an",
        lastUpdate: "07/12/2025",
      },
    ],
    []
  );

  useEffect(() => {
    const completionFlag = globalThis.window?.location.search
      ? new URLSearchParams(globalThis.window.location.search).get("complete") === "1"
      : false;

    setForceCompletion(completionFlag);
  }, []);

  useEffect(() => {
    if (forceCompletion) {
      setIsEditing(true);
      setMessage("Veuillez completer votre profil avant de demander ou creer une assurance.");
    }
  }, [forceCompletion]);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = (await response.json()) as { user: ProfileApiUser; profileCompleted?: boolean };
        const user = data.user;

        setProfileStatusCache(Boolean(data.profileCompleted));

        setForm({
          name: user.name ?? "",
          email: user.email ?? session?.user?.email ?? "",
          dateOfBirth: formatDateForInput(user.dateOfBirth),
          gender: user.gender ?? "",
          phone: user.phone ?? "",
          profession: user.profession ?? "",
          wilaya: user.wilaya ?? "",
          region: user.region ?? "",
          address: user.address ?? "",
          licenseNumber: user.licenseNumber ?? "",
          licenseType: user.licenseType ?? "",
          licenseIssueDate: formatDateForInput(user.licenseIssueDate),
          secondaryDrivers: (user.secondaryDrivers ?? []).join("\n"),
        });
      } catch (error) {
        console.error(error);
        setMessage("Impossible de charger les informations du profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.email, status]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
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
          secondaryDrivers: secondaryDriversArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = (await response.json()) as { profileCompleted?: boolean };

      setProfileStatusCache(Boolean(data.profileCompleted));

      setMessage("Profil mis a jour avec succes.");
      setIsEditing(false);

      if (forceCompletion && data.profileCompleted) {
        router.push("/main");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la mise a jour du profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-2xl border border-cyan-400/40 bg-white/70 p-8 shadow-lg">
        Chargement du profil...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-2xl border border-red-300 bg-white/70 p-8 shadow-lg">
        Veuillez vous connecter pour acceder a votre profil.
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-2xl border border-cyan-500/60 bg-gray-50/90 p-6 shadow-xl md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-700 md:text-3xl">
            Mon Profil
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Consultez et modifiez vos informations personnelles.
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      {message ? (
        <p className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {message}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nom prenom"
          value={form.name}
          disabled={!isEditing}
          onChange={(value) => handleChange("name", value)}
        />
        <Field
          label="Email"
          value={form.email}
          disabled
          onChange={() => undefined}
          type="email"
        />
        <Field
          label="Date de naissance"
          value={form.dateOfBirth}
          disabled={!isEditing}
          onChange={(value) => handleChange("dateOfBirth", value)}
          type="date"
        />
        <SelectField
          label="Sexe"
          value={form.gender}
          disabled={!isEditing}
          onChange={(value) => handleChange("gender", value)}
          options={[
            { value: "", label: "Selectionner" },
            { value: "Homme", label: "Homme" },
            { value: "Femme", label: "Femme" },
          ]}
        />
        <Field
          label="Numero de telephone"
          value={form.phone}
          disabled={!isEditing}
          onChange={(value) => handleChange("phone", value)}
        />
        <Field
          label="Profession"
          value={form.profession}
          disabled={!isEditing}
          onChange={(value) => handleChange("profession", value)}
        />
        <Field
          label="Wilaya"
          value={form.wilaya}
          disabled={!isEditing}
          onChange={(value) => handleChange("wilaya", value)}
        />
        <Field
          label="Region"
          value={form.region}
          disabled={!isEditing}
          onChange={(value) => handleChange("region", value)}
        />
        <Field
          label="Adresse"
          value={form.address}
          disabled={!isEditing}
          onChange={(value) => handleChange("address", value)}
        />
        <Field
          label="Numero de permis"
          value={form.licenseNumber}
          disabled={!isEditing}
          onChange={(value) => handleChange("licenseNumber", value)}
        />
        <Field
          label="Type de permis"
          value={form.licenseType}
          disabled={!isEditing}
          onChange={(value) => handleChange("licenseType", value)}
        />
        <Field
          label="Date de delivrance"
          value={form.licenseIssueDate}
          disabled={!isEditing}
          onChange={(value) => handleChange("licenseIssueDate", value)}
          type="date"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="secondaryDrivers"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Conducteurs secondaires (un par ligne)
        </label>
        <textarea
          id="secondaryDrivers"
          value={form.secondaryDrivers}
          disabled={!isEditing}
          onChange={(e) => handleChange("secondaryDrivers", e.target.value)}
          placeholder="Ex: Ahmed Benali"
          className="min-h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">Mes Assurances</h2>
          <span className="rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            {assurances.length} contrats
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {assurances.map((assurance) => (
            <article
              key={assurance.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {assurance.title}
                  </p>
                  <p className="text-xs text-gray-500">{assurance.id}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getAssuranceStatusClass(assurance.status)}`}
                >
                  {assurance.status}
                </span>
              </div>

              <dl className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between gap-3">
                  <dt>Type</dt>
                  <dd className="font-medium text-gray-700">{assurance.type}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cotisation</dt>
                  <dd className="font-medium text-gray-700">{assurance.premium}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Derniere mise a jour</dt>
                  <dd className="font-medium text-gray-700">
                    {assurance.lastUpdate}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  type?: string;
};

function Field({
  label,
  value,
  disabled,
  onChange,
  type = "text",
}: Readonly<FieldProps>) {
  const fieldId = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
};

function SelectField({
  label,
  value,
  disabled,
  onChange,
  options,
}: Readonly<SelectFieldProps>) {
  const fieldId = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        {label}
      </label>
      <select
        id={fieldId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
