"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { setProfileStatusCache } from "@/app/lib/clientCache";
import { FaUser, FaCar, FaIdCard, FaEdit, FaSave, FaTimes, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

type ProfileForm = {
  name: string; email: string; dateOfBirth: string; gender: string;
  phone: string; profession: string; wilaya: string; region: string;
  address: string; licenseNumber: string; licenseType: string;
  licenseIssueDate: string; secondaryDrivers: string;
};

type ProfileApiUser = {
  name: string | null; email: string | null; dateOfBirth: string | null;
  gender: string | null; phone: string | null; profession: string | null;
  wilaya: string | null; region: string | null; address: string | null;
  licenseNumber: string | null; licenseType: string | null;
  licenseIssueDate: string | null; secondaryDrivers: string[];
};

type ContractItem = {
  id: string; vehicle: string; coverage: string; status: "Active" | "Pending" | "Expired"; premium: string; expires: string;
};

const initialForm: ProfileForm = {
  name: "", email: "", dateOfBirth: "", gender: "", phone: "",
  profession: "", wilaya: "", region: "", address: "",
  licenseNumber: "", licenseType: "", licenseIssueDate: "", secondaryDrivers: "",
};

const formatDate = (date: string | null | undefined) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

const statusClass = (s: string) => ({
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Expired: "bg-gray-100 text-gray-500 border border-gray-200",
}[s] ?? "bg-gray-100 text-gray-500");

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [forceCompletion, setForceCompletion] = useState(false);
  const isAuthenticated = status === "authenticated";

  const secondaryDriversArray = useMemo(
    () => form.secondaryDrivers.split("\n").map((d) => d.trim()).filter(Boolean),
    [form.secondaryDrivers]
  );

  const contracts: ContractItem[] = [
    { id: "AMT-2026-001", vehicle: "Peugeot 208 – 2021", coverage: "Full Coverage", status: "Active", premium: "18 500 DA/yr", expires: "2027-03-15" },
    { id: "AMT-2026-047", vehicle: "Renault Symbol – 2019", coverage: "Third-Party", status: "Pending", premium: "9 200 DA/yr", expires: "2027-06-01" },
  ];

  useEffect(() => {
    const flag = globalThis.window?.location.search
      ? new URLSearchParams(globalThis.window.location.search).get("complete") === "1"
      : false;
    setForceCompletion(flag);
  }, []);

  useEffect(() => {
    if (forceCompletion) {
      setIsEditing(true);
      setMessage({ type: "error", text: "Please complete your profile before subscribing to insurance." });
    }
  }, [forceCompletion]);

  useEffect(() => {
    if (status !== "authenticated") { setIsLoading(false); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json() as { user: ProfileApiUser; profileCompleted?: boolean };
        setProfileStatusCache(Boolean(data.profileCompleted));
        const u = data.user;
        setForm({
          name: u.name ?? "", email: u.email ?? session?.user?.email ?? "",
          dateOfBirth: formatDate(u.dateOfBirth), gender: u.gender ?? "",
          phone: u.phone ?? "", profession: u.profession ?? "",
          wilaya: u.wilaya ?? "", region: u.region ?? "", address: u.address ?? "",
          licenseNumber: u.licenseNumber ?? "", licenseType: u.licenseType ?? "",
          licenseIssueDate: formatDate(u.licenseIssueDate),
          secondaryDrivers: (u.secondaryDrivers ?? []).join("\n"),
        });
      } catch { setMessage({ type: "error", text: "Could not load profile data." }); }
      finally { setIsLoading(false); }
    };
    fetchProfile();
  }, [session?.user?.email, status]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, dateOfBirth: form.dateOfBirth || null, gender: form.gender,
          phone: form.phone, profession: form.profession, wilaya: form.wilaya,
          region: form.region, address: form.address, licenseNumber: form.licenseNumber,
          licenseType: form.licenseType, licenseIssueDate: form.licenseIssueDate || null,
          secondaryDrivers: secondaryDriversArray,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json() as { profileCompleted?: boolean };
      setProfileStatusCache(Boolean(data.profileCompleted));
      setMessage({ type: "success", text: "Profile updated successfully." });
      setIsEditing(false);
      if (forceCompletion && data.profileCompleted) router.push("/main");
    } catch { setMessage({ type: "error", text: "Failed to update profile." }); }
    finally { setIsSaving(false); }
  };

  const set = (field: keyof ProfileForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-8 text-sm text-gray-500 shadow-sm">Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4">
        <div className="bg-white border border-red-100 rounded-3xl p-8 text-sm text-red-600 shadow-sm max-w-sm text-center">
          Please <Link href="/login" className="font-bold underline">sign in</Link> to access your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Customer Space</p>
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
              My Profile
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setMessage(null); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <FaTimes className="text-xs" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60 transition-all"
                >
                  <FaSave className="text-xs" /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                <FaEdit className="text-xs" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-2xl border text-sm font-medium ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
            {message.text}
          </div>
        )}

        {/* Personal Info */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-5">
            <FaUser className="text-blue-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.name} disabled={!isEditing} onChange={set("name")} />
            <Field label="Email" value={form.email} disabled onChange={() => undefined} type="email" />
            <Field label="Date of Birth" value={form.dateOfBirth} disabled={!isEditing} onChange={set("dateOfBirth")} type="date" />
            <SelectField label="Gender" value={form.gender} disabled={!isEditing} onChange={set("gender")}
              options={[{ value: "", label: "Select gender" }, { value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
            <Field label="Phone Number" value={form.phone} disabled={!isEditing} onChange={set("phone")} />
            <Field label="Profession" value={form.profession} disabled={!isEditing} onChange={set("profession")} />
            <Field label="Wilaya" value={form.wilaya} disabled={!isEditing} onChange={set("wilaya")} />
            <Field label="Region" value={form.region} disabled={!isEditing} onChange={set("region")} />
            <div className="sm:col-span-2">
              <Field label="Address" value={form.address} disabled={!isEditing} onChange={set("address")} />
            </div>
          </div>
        </div>

        {/* License Info */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-5">
            <FaIdCard className="text-cyan-500" /> Driver&apos;s License
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="License Number" value={form.licenseNumber} disabled={!isEditing} onChange={set("licenseNumber")} />
            <Field label="License Type" value={form.licenseType} disabled={!isEditing} onChange={set("licenseType")} />
            <Field label="Issue Date" value={form.licenseIssueDate} disabled={!isEditing} onChange={set("licenseIssueDate")} type="date" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Secondary Drivers (one per line)
            </label>
            <textarea
              value={form.secondaryDrivers}
              disabled={!isEditing}
              onChange={(e) => set("secondaryDrivers")(e.target.value)}
              placeholder="e.g. Ahmed Benali"
              className="min-h-20 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Contracts */}
        <div className="bg-white/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
              <FaShieldAlt className="text-blue-500" /> My Insurance Contracts
              <span className="bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">{contracts.length}</span>
            </h2>
            <Link href="/main/newassurance" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              + New Contract
            </Link>
          </div>
          <div className="space-y-3">
            {contracts.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <FaCar className="text-blue-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{c.vehicle}</p>
                    <p className="text-xs text-gray-500">{c.id} · {c.coverage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-gray-600">{c.premium}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass(c.status)}`}>{c.status}</span>
                  <span className="text-xs text-gray-400">Exp: {c.expires}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

type FieldProps = { label: string; value: string; disabled: boolean; onChange: (v: string) => void; type?: string; };
function Field({ label, value, disabled, onChange, type = "text" }: Readonly<FieldProps>) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{label}</label>
      <input
        type={type} value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

type SelectFieldProps = { label: string; value: string; disabled: boolean; onChange: (v: string) => void; options: { value: string; label: string }[]; };
function SelectField({ label, value, disabled, onChange, options }: Readonly<SelectFieldProps>) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{label}</label>
      <select
        value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
