"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaEdit,
  FaEnvelope,
  FaSearch,
  FaShieldAlt,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

type AdminUser = {
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
};

const badgeStyles: Record<AdminUser["accountStatus"], string> = {
  Actif: "border-emerald-300 bg-emerald-50 text-emerald-700",
  Partiel: "border-amber-300 bg-amber-50 text-amber-700",
  Administrateur: "border-blue-300 bg-blue-50 text-blue-700",
};

const roleStyles: Record<AdminUser["role"], string> = {
  ADMIN: "border-blue-300 bg-blue-50 text-blue-700",
  USER: "border-gray-300 bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load users");
        }

        if (!isCancelled) {
          setUsers(data.users ?? []);
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

    loadUsers();

    return () => {
      isCancelled = true;
    };
  }, [isAdmin, status]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter((user) => {
      const haystack = [
        user.name,
        user.email,
        user.phone,
        user.profession,
        user.wilaya,
        user.region,
        user.address,
        user.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [search, users]);

  const summary = useMemo(() => {
    const total = users.length;
    const admins = users.filter((user) => user.role === "ADMIN").length;
    const averageCompletion =
      total === 0
        ? 0
        : Math.round(users.reduce((sum, user) => sum + user.profileCompletion, 0) / total);

    return { total, admins, averageCompletion };
  }, [users]);

  const handleDelete = async (user: AdminUser) => {
    const confirmation = confirm(
      `Supprimer le compte ${user.name ?? user.email} ? Cette action est definitive.`
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : "Failed to delete user");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-7xl rounded-3xl border border-cyan-400/30 bg-white/80 p-8 shadow-xl">
        Chargement des utilisateurs...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-red-200 bg-white/90 p-8 text-red-700 shadow-xl">
        Acces refuse. Cette section est reservee aux administrateurs.
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
      <section
        className="rounded-3xl border border-cyan-500/30 p-6 text-white shadow-2xl md:p-8"
        style={{
          backgroundImage: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)",
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <FaUsers /> Gestion des utilisateurs
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Edition, suppression et suivi detaille des comptes clients.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              Consultez les informations personnelles, l&apos;historique des assurances et les
              demandes associees depuis une interface dynamique et centralisee.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <StatCard label="Comptes" value={summary.total.toString()} helper="Utilisateurs actifs" />
            <StatCard label="Admins" value={summary.admins.toString()} helper="Acces superviseurs" />
            <StatCard label="Profil moyen" value={`${summary.averageCompletion}%`} helper="Complétude moyenne" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Liste des comptes</h2>
            <p className="mt-1 text-sm text-slate-500">
              Cliquez sur un utilisateur pour ouvrir sa page detaillee.
            </p>
          </div>

          <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 shadow-sm transition focus-within:border-cyan-400 focus-within:bg-white">
            <FaSearch className="shrink-0 text-cyan-600" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom, email, wilaya, telephone..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-4">Utilisateur</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Infos</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-sm text-slate-500" colSpan={5}>
                    Aucun utilisateur ne correspond a votre recherche.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-cyan-50/50">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md"
                          style={{ backgroundImage: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)" }}
                        >
                          {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name ?? "Sans nom"}</p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <FaEnvelope className="text-cyan-600" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyles[user.accountStatus]}`}>
                          {user.accountStatus}
                        </span>
                        <p className="text-xs text-slate-500">
                          {user.profileCompletion}% du profil complete
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <FaShieldAlt className="text-cyan-600" />
                          {user.assuranceCount} assurances
                        </p>
                        <p className="flex items-center gap-2">
                          <FaCalendarAlt className="text-cyan-600" />
                          {user.demandCount} demandes
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                        >
                          Ouvrir <FaArrowRight />
                        </Link>
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FaEdit /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <FaTrash /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
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
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}


