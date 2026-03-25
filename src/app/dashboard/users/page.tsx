"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaTrash, FaShieldAlt, FaUser, FaUsers, FaChevronDown } from 'react-icons/fa';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleRoleToggle = async (user: UserRow) => {
    const newRole = user.role === 'USER' ? 'ADMIN' : 'USER';
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.filter((u) => u.role === 'USER').length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-full mb-3">
          Administration
        </div>
        <h1 className="text-2xl font-extrabold text-gray-500">
          Gestion des{' '}
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text">utilisateurs</span>
        </h1>
        <p className="text-gray-500/40 text-sm mt-1">Gérez les comptes et les rôles des membres.</p>
      </div>

      {/* Stat pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm">
          <FaUsers className="text-blue-500 text-xs" />
          <span className="text-gray-500/70">{users.length} total</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm">
          <FaShieldAlt className="text-amber-400 text-xs" />
          <span className="text-gray-500/70">{adminCount} admin</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm">
          <FaUser className="text-cyan-400 text-xs" />
          <span className="text-gray-500/70">{userCount} utilisateurs</span>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500/25 text-xs" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-500 placeholder:text-gray-500/25 focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/40 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | 'USER' | 'ADMIN')}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-500/70 focus:outline-none focus:ring-1 focus:ring-blue-600/50 cursor-pointer"
            >
              <option value="ALL" className="bg-[#0d0d18]">Tous les rôles</option>
              <option value="USER" className="bg-[#0d0d18]">Utilisateur</option>
              <option value="ADMIN" className="bg-[#0d0d18]">Admin</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500/30 text-[10px] pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-gray-500/35 font-semibold text-xs uppercase tracking-wide">Utilisateur</th>
                <th className="text-left px-5 py-3 text-gray-500/35 font-semibold text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-gray-500/35 font-semibold text-xs uppercase tracking-wide">Rôle</th>
                <th className="text-left px-5 py-3 text-gray-500/35 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Inscrit le</th>
                <th className="text-right px-5 py-3 text-gray-500/35 font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-5 py-4"><div className="h-3 w-32 rounded bg-white/10 animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-48 rounded bg-white/10 animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-white/10 animate-pulse" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-3 w-24 rounded bg-white/10 animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-6 w-16 rounded bg-white/10 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500/30 text-sm">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    {/* Name + avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500/70 shrink-0">
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </div>
                        <span className="text-gray-500/80 font-medium">{user.name ?? '—'}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-500/50">{user.email}</td>
                    {/* Role badge */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        disabled={updatingId === user.id}
                        title="Cliquer pour changer le rôle"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
                          user.role === 'ADMIN'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/25 hover:bg-amber-500/25'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20'
                        } ${updatingId === user.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                      >
                        {user.role === 'ADMIN' ? <FaShieldAlt className="text-[10px]" /> : <FaUser className="text-[10px]" />}
                        {updatingId === user.id ? '...' : user.role}
                      </button>
                    </td>
                    {/* Date */}
                    <td className="px-5 py-3.5 text-gray-500/35 text-xs hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      {confirmDelete === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-500/40 text-xs">Confirmer ?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all disabled:opacity-50"
                          >
                            {deletingId === user.id ? '...' : 'Oui'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-500/50 text-xs hover:bg-white/10 transition-all"
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-500/35 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                          title="Supprimer l'utilisateur"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/10">
            <span className="text-gray-500/25 text-xs">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

