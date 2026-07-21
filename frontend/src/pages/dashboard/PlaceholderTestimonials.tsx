import { useEffect, useState, useCallback } from 'react';
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Quote,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  status: 'published' | 'draft';
  image: string;
  createdAt: string;
}

interface TestimonialForm {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  status: 'published' | 'draft';
  image: string;
}

const EMPTY_FORM: TestimonialForm = {
  quote: '',
  name: '',
  role: '',
  company: '',
  rating: 5,
  status: 'published',
  image: '',
};

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'seed-1',
    quote: 'Woodex transformed our office into a workspace that truly reflects our brand.',
    name: 'Aaliya Khan',
    role: 'CEO',
    company: 'TechVentures',
    rating: 5,
    status: 'published',
    image: '',
    createdAt: '2025-11-15T10:30:00.000Z',
  },
  {
    id: 'seed-2',
    quote: 'The attention to detail in our restaurant design was incredible.',
    name: 'Hamza Sheikh',
    role: 'Owner',
    company: 'The Walnut House',
    rating: 5,
    status: 'published',
    image: '',
    createdAt: '2025-12-02T14:00:00.000Z',
  },
  {
    id: 'seed-3',
    quote: 'Professional, creative, and delivered beyond our expectations.',
    name: 'Fatima Ali',
    role: 'Director',
    company: 'Style Studio',
    rating: 4,
    status: 'published',
    image: '',
    createdAt: '2026-01-10T09:15:00.000Z',
  },
];

const STORAGE_KEY = 'woodex-testimonials';

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers                                                */
/* ------------------------------------------------------------------ */

function loadTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  // First load: seed and persist
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TESTIMONIALS));
  return SEED_TESTIMONIALS;
}

function saveTestimonials(list: Testimonial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({
  type,
  message,
  onDismiss,
}: {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isError = type === 'error';
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 shadow-lg transition-all ${
        isError
          ? 'bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)]'
          : 'bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.4)]'
      }`}
    >
      {isError ? (
        <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
      )}
      <span
        className={`text-sm font-light ${
          isError ? 'text-[#DC2626]' : 'text-[#16A34A]'
        }`}
      >
        {message}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating Display (read-only, for cards)                          */
/* ------------------------------------------------------------------ */

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#3A3530]'}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Star Rating Selector (clickable, for form)                          */
/* ------------------------------------------------------------------ */

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-colors"
        >
          <Star
            size={22}
            className={
              i <= (hover || value)
                ? 'text-[#C9A84C] fill-[#C9A84C]'
                : 'text-[#3A3530]'
            }
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-[#8A8073]">{value}/5</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PlaceholderTestimonials() {
  /* ---- data state ---- */
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);

  /* ---- modal / form state ---- */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* ---- delete state ---- */
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Data loading (localStorage)                                      */
  /* ---------------------------------------------------------------- */

  const load = useCallback(() => {
    setLoading(true);
    const data = loadTestimonials();
    setTestimonials(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------------------------------------------------------- */
  /*  Open helpers                                                     */
  /* ---------------------------------------------------------------- */

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      quote: t.quote,
      name: t.name,
      role: t.role,
      company: t.company,
      rating: t.rating,
      status: t.status,
      image: t.image,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  /* ---------------------------------------------------------------- */
  /*  Save (Create / Update)                                           */
  /* ---------------------------------------------------------------- */

  function handleSave() {
    if (!form.quote.trim() || !form.name.trim()) return;
    setSaving(true);

    try {
      let updated: Testimonial[];

      if (editing) {
        updated = testimonials.map((t) =>
          t.id === editing.id
            ? {
                ...t,
                quote: form.quote.trim(),
                name: form.name.trim(),
                role: form.role.trim(),
                company: form.company.trim(),
                rating: form.rating,
                status: form.status,
                image: form.image.trim(),
              }
            : t
        );
        setToast({ type: 'success', message: 'Testimonial updated successfully.' });
      } else {
        const newTestimonial: Testimonial = {
          id: uid(),
          quote: form.quote.trim(),
          name: form.name.trim(),
          role: form.role.trim(),
          company: form.company.trim(),
          rating: form.rating,
          status: form.status,
          image: form.image.trim(),
          createdAt: new Date().toISOString(),
        };
        updated = [newTestimonial, ...testimonials];
        setToast({ type: 'success', message: 'Testimonial created successfully.' });
      }

      saveTestimonials(updated);
      setTestimonials(updated);
      closeModal();
    } catch {
      setToast({ type: 'error', message: 'Failed to save testimonial.' });
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Delete                                                           */
  /* ---------------------------------------------------------------- */

  function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const updated = testimonials.filter((t) => t.id !== deleteTarget.id);
      saveTestimonials(updated);
      setTestimonials(updated);
      setToast({ type: 'success', message: `"${deleteTarget.name}" deleted.` });
      setDeleteTarget(null);
    } catch {
      setToast({ type: 'error', message: 'Failed to delete testimonial.' });
    } finally {
      setDeleting(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Derived data                                                     */
  /* ---------------------------------------------------------------- */

  const filtered = filter === 'all' ? testimonials : testimonials.filter((t) => t.status === filter);
  const publishedCount = testimonials.filter((t) => t.status === 'published').length;
  const draftCount = testimonials.filter((t) => t.status === 'draft').length;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="p-8">
      {/* ---- Backend note banner ---- */}
      <div className="bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] px-5 py-3 mb-8 flex items-center gap-3">
        <AlertCircle size={16} className="text-[#C9A84C] shrink-0" />
        <span className="text-sm text-[#D4C5A9] font-light">
          Testimonials are stored locally. Backend CRUD endpoints coming soon.
        </span>
      </div>

      {/* ---- Toast ---- */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Testimonials</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Client reviews
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
        >
          <Plus size={13} />
          New Testimonial
        </button>
      </div>

      {/* ---- Filter tabs ---- */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { key: 'all' as const, label: 'All' },
          { key: 'published' as const, label: 'Published' },
          { key: 'draft' as const, label: 'Draft' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`text-[0.55rem] tracking-[0.25em] uppercase font-semibold px-3.5 py-2 transition-colors ${
              filter === s.key
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
            }`}
          >
            {s.label}
            {s.key === 'all' && ` (${testimonials.length})`}
            {s.key === 'published' && ` (${publishedCount})`}
            {s.key === 'draft' && ` (${draftCount})`}
          </button>
        ))}
      </div>

      {/* ---- Content ---- */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <Quote size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">
            No testimonials {filter !== 'all' ? `with status "${filter}"` : 'yet'}
          </p>
          <button
            onClick={openCreate}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Add your first testimonial
          </button>
        </div>
      ) : (
        <>
          {/* ---- Card grid ---- */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 flex flex-col hover:border-[rgba(201,168,76,0.4)] transition-colors"
              >
                {/* Star rating + status */}
                <div className="flex items-start justify-between mb-4">
                  <StarDisplay rating={testimonial.rating} />
                  <StatusBadge status={testimonial.status} />
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-[#D4C5A9] font-light leading-relaxed italic mb-4 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border border-[rgba(201,168,76,0.3)]"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[rgba(201,168,76,0.12)] flex items-center justify-center text-[#C9A84C] font-display text-sm shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[#8A8073] font-light truncate">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(' at ')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(testimonial)}
                    className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(testimonial)}
                    className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-3.5 py-2 bg-[rgba(220,38,38,0.1)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Footer count ---- */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
              {filtered.length} testimonial{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/*  Add / Edit Modal                                            */}
      {/* ============================================================ */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Testimonial' : 'New Testimonial'}
        size="lg"
        footer={
          <>
            <button
              onClick={closeModal}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.quote.trim() || !form.name.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Testimonial'}
            </button>
          </>
        }
      >
        <div className="space-y-1">
          {/* Quote (required) */}
          <AdminFormField label="Quote" htmlFor="t-quote" required>
            <textarea
              id="t-quote"
              value={form.quote}
              onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
              placeholder="What did the client say?"
              rows={4}
              className="input-lux w-full resize-y"
            />
          </AdminFormField>

          <div className="grid md:grid-cols-2 gap-x-6">
            {/* Author Name (required) */}
            <AdminFormField label="Author Name" htmlFor="t-name" required>
              <input
                id="t-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Aaliya Khan"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Role / Title */}
            <AdminFormField label="Role / Title" htmlFor="t-role">
              <input
                id="t-role"
                type="text"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="e.g. CEO, Director"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Company */}
            <AdminFormField label="Company" htmlFor="t-company">
              <input
                id="t-company"
                type="text"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                placeholder="e.g. TechVentures"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Image URL */}
            <AdminFormField label="Image URL" htmlFor="t-image" hint="Optional profile image">
              <input
                id="t-image"
                type="text"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Rating */}
            <AdminFormField label="Rating" htmlFor="t-rating">
              <StarSelector
                value={form.rating}
                onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
              />
            </AdminFormField>

            {/* Status */}
            <AdminFormField label="Status" htmlFor="t-status">
              <select
                id="t-status"
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as 'published' | 'draft',
                  }))
                }
                className="input-lux w-full"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </AdminFormField>
          </div>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  Delete Confirmation                                         */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
