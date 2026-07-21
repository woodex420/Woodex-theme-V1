import { useState, useCallback } from 'react';
import { Shield, Plus, Pencil, Trash2, Loader2, Crown, UserCircle, Clock, Info } from 'lucide-react';
import { getUser } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UserRow {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Hardcoded demo users (no backend CRUD yet)                         */
/* ------------------------------------------------------------------ */

const DEMO_USERS: UserRow[] = [
  {
    _id: 'demo-admin',
    username: 'admin',
    email: 'admin@woodex.com',
    fullName: 'Admin User',
    role: 'admin',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: 'demo-editor',
    username: 'editor',
    email: 'editor@woodex.com',
    fullName: 'Editor User',
    role: 'editor',
    lastLogin: '2026-07-18T14:30:00Z',
    createdAt: '2024-03-22T10:00:00Z',
  },
  {
    _id: 'demo-viewer',
    username: 'demo',
    email: 'demo@woodex.com',
    fullName: 'Demo Viewer',
    role: 'viewer',
    lastLogin: '2026-07-10T09:15:00Z',
    createdAt: '2024-06-01T10:00:00Z',
  },
];

/* ------------------------------------------------------------------ */
/*  Empty form state                                                   */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = { username: '', email: '', fullName: '', password: '', role: 'viewer' as string };

/* ------------------------------------------------------------------ */
/*  Toast helper                                                       */
/* ------------------------------------------------------------------ */

function showComingSoonToast(action: string) {
  const id = 'stage2b-toast';
  // Remove any existing toast
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = id;
  toast.style.cssText =
    'position:fixed;bottom:24px;right:24px;z-index:9999;padding:14px 24px;' +
    'background:#111110;border:1px solid rgba(201,168,76,0.3);color:#C9A84C;' +
    'font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;' +
    'display:flex;align-items:center;gap:10px;animation:fadeIn .2s ease';
  toast.innerHTML =
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` +
    `${action} — Coming in Stage 2b`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ------------------------------------------------------------------ */
/*  Avatar helper                                                      */
/* ------------------------------------------------------------------ */

function AvatarInitial({ name, gold }: { name: string; gold?: boolean }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <div
      className={`w-9 h-9 flex items-center justify-center shrink-0 font-display text-sm ${
        gold
          ? 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C] border border-[rgba(201,168,76,0.35)]'
          : 'bg-[rgba(138,128,115,0.12)] text-[#8A8073] border border-[rgba(138,128,115,0.2)]'
      }`}
    >
      {initial}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PlaceholderUsers() {
  const currentUser = getUser();

  const [users] = useState<UserRow[]>(() => {
    // Merge the logged-in user data with demo list (avoid duplicates by username)
    const authUser = getUser();
    if (!authUser) return DEMO_USERS;
    const merged = DEMO_USERS.map((u) =>
      u.username === authUser.username
        ? { ...u, ...authUser, role: authUser.role as UserRow['role'], _id: u._id, lastLogin: u.lastLogin, createdAt: u.createdAt }
        : u,
    );
    // If current user not in demo list, prepend
    if (!merged.find((u) => u.username === authUser.username)) {
      merged.unshift({
        _id: 'current-user',
        ...authUser,
        role: authUser.role as UserRow['role'],
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }
    return merged;
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);

  /* ---------- helpers ---------- */

  const isCurrentUser = useCallback(
    (u: UserRow) => currentUser?.username === u.username,
    [currentUser],
  );

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const roleCounts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  /* ---------- handlers ---------- */

  function openAdd() {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(u: UserRow) {
    setEditingUser(u);
    setForm({ username: u.username, email: u.email, fullName: u.fullName, password: '', role: u.role });
    setModalOpen(true);
  }

  function handleSave() {
    setSaving(true);
    // Simulate save delay then show toast
    setTimeout(() => {
      setSaving(false);
      setModalOpen(false);
      showComingSoonToast(editingUser ? 'Edit user' : 'Add user');
    }, 400);
  }

  function handleDelete() {
    if (!confirmDelete) return;
    setConfirmDelete(null);
    showComingSoonToast('Delete user');
  }

  /* ---------- role filter tabs ---------- */

  const roleTabs = [
    { key: 'all', label: 'All Users' },
    { key: 'admin', label: 'Admins' },
    { key: 'editor', label: 'Editors' },
    { key: 'viewer', label: 'Viewers' },
  ];

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="p-8">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Users</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">Team management</p>
        </div>
        <button onClick={openAdd} className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 flex items-center gap-2">
          <Plus size={14} />
          Add User
        </button>
      </div>

      {/* ---- Coming soon info banner ---- */}
      <div className="bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.18)] px-5 py-3.5 mb-8 flex items-center gap-3">
        <Info size={15} className="text-[#C9A84C] shrink-0" />
        <span className="text-xs text-[#D4C5A9] font-light">
          User CRUD (add, edit, delete) will be available in <span className="text-[#C9A84C] font-medium">Stage 2b</span>.
          Currently displaying known demo accounts.
        </span>
      </div>

      {/* ---- Search bar ---- */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-lux w-full max-w-sm text-sm py-2.5 px-4"
        />
      </div>

      {/* ---- Role filter tabs ---- */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {roleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setRoleFilter(t.key)}
            className={`text-[0.55rem] tracking-[0.25em] uppercase font-semibold px-3.5 py-2 transition-colors ${
              roleFilter === t.key
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
            }`}
          >
            {t.label}
            {t.key === 'all'
              ? ` (${users.length})`
              : roleCounts[t.key]
              ? ` (${roleCounts[t.key]})`
              : ''}
          </button>
        ))}
      </div>

      {/* ---- Users table ---- */}
      <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_120px_160px_100px] gap-4 px-6 py-3.5 border-b border-[rgba(201,168,76,0.12)] text-[0.5rem] tracking-[0.25em] uppercase font-semibold text-[#8A8073]">
          <span>User</span>
          <span>Role</span>
          <span>Last Login</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#8A8073] font-light">
            <UserCircle size={32} className="mx-auto mb-4 opacity-50" />
            <p>No users match your search</p>
          </div>
        ) : (
          filtered.map((u) => {
            const current = isCurrentUser(u);
            return (
              <div
                key={u._id}
                className={`grid grid-cols-[1fr_120px_160px_100px] gap-4 items-center px-6 py-4 border-b border-[rgba(201,168,76,0.08)] transition-colors ${
                  current
                    ? 'bg-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.07)]'
                    : 'hover:bg-[rgba(201,168,76,0.03)]'
                }`}
              >
                {/* User cell */}
                <div className="flex items-center gap-3 min-w-0">
                  <AvatarInitial name={u.fullName || u.username} gold={current} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate">{u.fullName || u.username}</span>
                      {current && (
                        <span className="inline-flex items-center gap-1 text-[0.45rem] tracking-[0.2em] uppercase font-semibold px-1.5 py-0.5 bg-[rgba(201,168,76,0.12)] text-[#C9A84C]">
                          <Crown size={8} />
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8A8073] truncate block">{u.email}</span>
                  </div>
                </div>

                {/* Role cell */}
                <StatusBadge status={u.role} />

                {/* Last login cell */}
                <div className="flex items-center gap-1.5 text-xs text-[#8A8073]">
                  <Clock size={10} />
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'Never'}
                </div>

                {/* Actions cell */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="w-8 h-8 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                    title="Edit user"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (isCurrentUser(u)) {
                        showComingSoonToast("Can't delete yourself");
                        return;
                      }
                      setConfirmDelete(u);
                    }}
                    className={`w-8 h-8 flex items-center justify-center transition-colors ${
                      isCurrentUser(u)
                        ? 'text-[rgba(138,128,115,0.3)] cursor-not-allowed'
                        : 'text-[#8A8073] hover:text-[#DC2626]'
                    }`}
                    title={isCurrentUser(u) ? "Can't delete yourself" : 'Delete user'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ---- Summary footer ---- */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-[#8A8073] font-light">
          Showing {filtered.length} of {users.length} users
        </span>
        <span className="text-xs text-[#8A8073] font-light">
          <Shield size={10} className="inline mr-1" />
          Full user management coming in Stage 2b
        </span>
      </div>

      {/* ============================================================ */}
      {/*  ADD / EDIT MODAL                                            */}
      {/* ============================================================ */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add User'}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.username || !form.email}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : null}
              {editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="label-lux">Username</label>
            <input
              type="text"
              className="input-lux w-full"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. john"
              disabled={!!editingUser}
            />
          </div>

          {/* Email */}
          <div>
            <label className="label-lux">Email</label>
            <input
              type="email"
              className="input-lux w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@woodex.com"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="label-lux">Full Name</label>
            <input
              type="text"
              className="input-lux w-full"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          {/* Password */}
          <div>
            <label className="label-lux">
              Password {editingUser && <span className="text-[#8A8073] font-light">(leave blank to keep)</span>}
            </label>
            <input
              type="password"
              className="input-lux w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingUser ? '********' : 'Enter password'}
            />
          </div>

          {/* Role */}
          <div>
            <label className="label-lux">Role</label>
            <select
              className="input-lux w-full"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  DELETE CONFIRMATION                                         */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={
          confirmDelete
            ? `Are you sure you want to delete "${confirmDelete.fullName || confirmDelete.username}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
