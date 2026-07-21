import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Loader2,
  MapPin,
  Ruler,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  GripVertical,
  Image as ImageIcon,
  ChevronRight,
  Star,
  Briefcase,
  Layers,
  FileText,
  Search,
  ImagePlus,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import MediaPicker from '@/components/dashboard/ui/MediaPicker';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Project {
  _id: string;
  slug: string;
  title: string;
  category: string;
  client?: string;
  location: string;
  year?: string;
  image?: string;
  description?: string;
  area?: string;
  status: string;
  brief?: string;
  challenge?: string;
  solution?: string;
  excerpt?: string;
  featured?: boolean;
  materials?: string[];
  services?: string[];
  gallery?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FormState {
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  location: string;
  area: string;
  year: string;
  client: string;
  excerpt: string;
  brief: string;
  challenge: string;
  solution: string;
  materials: string[];
  services: string[];
  image: string;
  gallery: string[];
  metaTitle: string;
  metaDescription: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  category: 'residential',
  status: 'draft',
  featured: false,
  location: '',
  area: '',
  year: '',
  client: '',
  excerpt: '',
  brief: '',
  challenge: '',
  solution: '',
  materials: [],
  services: [],
  image: '',
  gallery: [],
  metaTitle: '',
  metaDescription: '',
};

const CATEGORIES = ['residential', 'office', 'retail', 'commercial'] as const;
const STATUS_OPTIONS = ['draft', 'published', 'archived'] as const;

const CATEGORY_FILTERS = [
  'All',
  'Residential',
  'Office',
  'Retail',
  'Commercial',
] as const;

const TAB_LIST = [
  { key: 'basic', label: 'Basic Info', icon: Layers },
  { key: 'details', label: 'Details', icon: FileText },
  { key: 'case-study', label: 'Case Study', icon: Briefcase },
  { key: 'media', label: 'Media', icon: ImageIcon },
  { key: 'seo', label: 'SEO', icon: Search },
] as const;

type TabKey = (typeof TAB_LIST)[number]['key'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({
  message,
  type,
  onDone,
}: {
  message: string;
  type: 'success' | 'error';
  onDone: () => void;
}) {
  useEffect(() => {
    const id = setTimeout(onDone, 4000);
    return () => clearTimeout(id);
  }, [onDone]);

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
/*  Tag Input Component                                                */
/* ------------------------------------------------------------------ */

function TagInput({
  tags,
  onChange,
  placeholder,
  suggestions,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions =
    suggestions?.filter(
      (s) =>
        s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    ) || [];

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="relative">
      <div className="input-lux flex flex-wrap items-center gap-1.5 min-h-[42px] cursor-text p-2"
        onClick={(e) => {
          (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus();
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs px-2 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-[#8A8073] hover:text-[#DC2626] transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent outline-none text-sm text-[#D4C5A9] placeholder-[#8A8073] min-w-[80px]"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1a1918] border border-[rgba(201,168,76,0.2)] max-h-40 overflow-y-auto">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              className="w-full text-left text-sm text-[#D4C5A9] px-3 py-2 hover:bg-[rgba(201,168,76,0.1)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardProjects() {
  /* --- state --- */
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('All');

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // delete
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // media picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | number>('hero');

  /* --- data --- */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminFetch<{ projects: Project[] }>('/admin/projects');
      setProjects(res.projects || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* --- filtered list --- */
  const filtered =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.category === filter.toLowerCase());

  /* --- form helpers --- */
  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setActiveTab('basic');
    setSlugManuallyEdited(false);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'residential',
      status: p.status || 'draft',
      featured: p.featured || false,
      location: p.location || '',
      area: p.area || '',
      year: p.year || '',
      client: p.client || '',
      excerpt: p.excerpt || '',
      brief: p.brief || '',
      challenge: p.challenge || '',
      solution: p.solution || '',
      materials: p.materials || [],
      services: p.services || [],
      image: p.image || '',
      gallery: p.gallery || [],
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
    });
    setActiveTab('basic');
    setSlugManuallyEdited(true);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setActiveTab('basic');
    setSlugManuallyEdited(false);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'title' && !slugManuallyEdited) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setForm((f) => ({ ...f, slug: slugify(value) }));
  }

  /* --- gallery helpers --- */
  function addGalleryImage(url: string) {
    setForm((f) => ({ ...f, gallery: [...f.gallery, url] }));
  }

  function removeGalleryImage(index: number) {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.filter((_, i) => i !== index),
    }));
  }

  /* --- media picker --- */
  function openMediaPicker(target: 'hero' | number) {
    setMediaPickerTarget(target);
    setMediaPickerOpen(true);
  }

  function handleMediaSelect(url: string) {
    if (mediaPickerTarget === 'hero') {
      updateField('image', url);
    } else {
      setForm((f) => {
        const gallery = [...f.gallery];
        gallery[mediaPickerTarget as number] = url;
        return { ...f, gallery };
      });
    }
  }

  /* --- save (create / update) --- */
  async function handleSave() {
    if (!form.title.trim()) return;

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title.trim()),
        category: form.category,
        status: form.status,
        featured: form.featured,
        location: form.location.trim(),
        area: form.area.trim(),
        year: form.year.trim(),
        client: form.client.trim(),
        excerpt: form.excerpt.trim(),
        brief: form.brief.trim(),
        challenge: form.challenge.trim(),
        solution: form.solution.trim(),
        materials: form.materials,
        services: form.services,
        image: form.image.trim(),
        gallery: form.gallery.filter((g) => g.trim()),
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
      };

      if (editing) {
        await adminFetch(`/admin/projects/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToast({ message: 'Project updated', type: 'success' });
      } else {
        await adminFetch('/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToast({ message: 'Project created', type: 'success' });
      }
      closeModal();
      await load();
    } catch (err: unknown) {
      setToast({
        message: err instanceof Error ? err.message : 'Save failed',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  /* --- delete --- */
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminFetch(`/admin/projects/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      setDeleteTarget(null);
      setToast({ message: 'Project deleted', type: 'success' });
      await load();
    } catch (err: unknown) {
      setToast({
        message: err instanceof Error ? err.message : 'Delete failed',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Projects</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Portfolio & case studies
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
        >
          <Plus size={13} />
          New Project
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-2">
          <AlertCircle size={14} className="text-[#DC2626]" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-[0.55rem] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
              filter === cat
                ? 'bg-[rgba(201,168,76,0.15)] border-[rgba(201,168,76,0.4)] text-[#C9A84C] font-semibold'
                : 'border-[rgba(201,168,76,0.15)] text-[#8A8073] hover:border-[rgba(201,168,76,0.3)] hover:text-[#D4C5A9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-14 h-14 bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-5">
            <Plus size={24} className="text-[#C9A84C]" />
          </div>
          <p className="text-[#8A8073] text-sm font-light">
            {filter === 'All'
              ? 'No projects yet. Create your first one.'
              : `No ${filter.toLowerCase()} projects found.`}
          </p>
          {filter === 'All' && (
            <button
              onClick={openAdd}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2 mt-5"
            >
              <Plus size={13} />
              New Project
            </button>
          )}
        </div>
      ) : (
        /* Card grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 hover:border-[rgba(201,168,76,0.4)] transition-colors flex flex-col"
            >
              {/* Card header: category + status + featured */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2 py-0.5 font-semibold">
                  {p.category}
                </span>
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <Star size={12} className="text-[#C9A84C] fill-[#C9A84C]" />
                  )}
                  <StatusBadge status={p.status} />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg text-white mb-2">{p.title}</h3>

              {/* Excerpt */}
              {p.excerpt && (
                <p className="text-sm text-[#D4C5A9] font-light leading-relaxed mb-3 line-clamp-2">
                  {p.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-[#8A8073] mb-4">
                {p.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {p.location}
                  </span>
                )}
                {p.area && (
                  <span className="flex items-center gap-1">
                    <Ruler size={10} />
                    {p.area}
                  </span>
                )}
              </div>

              {/* Tags preview */}
              {p.materials && p.materials.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.materials.slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="text-[0.5rem] text-[#C9A84C] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] px-1.5 py-0.5"
                    >
                      {m}
                    </span>
                  ))}
                  {p.materials.length > 3 && (
                    <span className="text-[0.5rem] text-[#8A8073] px-1.5 py-0.5">
                      +{p.materials.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Spacer to push actions to bottom */}
              <div className="mt-auto pt-3 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-end gap-3">
                <button
                  onClick={() => openEdit(p)}
                  className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count footer */}
      {!loading && projects.length > 0 && (
        <div className="mt-8">
          <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
            {filtered.length}
            {filter !== 'All' && ` of ${projects.length}`} project{filtered.length !== 1 && 's'}
          </span>
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/*  Add / Edit Modal                                               */}
      {/* --------------------------------------------------------------- */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Project' : 'New Project'}
        size="xl"
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
              disabled={saving || !form.title.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        {/* --- Tab navigation --- */}
        <div className="flex items-center gap-1 mb-6 border-b border-[rgba(201,168,76,0.15)] -mx-6 px-6">
          {TAB_LIST.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[0.6rem] tracking-[0.15em] uppercase border-b-2 transition-colors -mb-px ${
                  activeTab === tab.key
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-[#8A8073] hover:text-[#D4C5A9]'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- Tab: Basic Info --- */}
        {activeTab === 'basic' && (
          <div className="space-y-1">
            {/* Title (required) */}
            <AdminFormField label="Title" htmlFor="proj-title" required>
              <input
                id="proj-title"
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="input-lux w-full"
                placeholder="Project title"
              />
            </AdminFormField>

            {/* Slug */}
            <AdminFormField
              label="Slug"
              htmlFor="proj-slug"
              hint="Auto-generated from title. Edit to override."
            >
              <input
                id="proj-slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="input-lux w-full"
                placeholder="project-title-slug"
              />
            </AdminFormField>

            <div className="grid grid-cols-2 gap-x-5">
              {/* Category */}
              <AdminFormField label="Category" htmlFor="proj-category">
                <select
                  id="proj-category"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="input-lux w-full"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </AdminFormField>

              {/* Status */}
              <AdminFormField label="Status" htmlFor="proj-status">
                <select
                  id="proj-status"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="input-lux w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </AdminFormField>
            </div>

            {/* Featured toggle */}
            <div className="mb-5">
              <label className="label-lux block mb-1.5">Featured</label>
              <button
                type="button"
                onClick={() => updateField('featured', !form.featured)}
                className={`flex items-center gap-2 px-4 py-2 text-[0.6rem] tracking-[0.15em] uppercase border transition-colors ${
                  form.featured
                    ? 'bg-[rgba(201,168,76,0.15)] border-[rgba(201,168,76,0.4)] text-[#C9A84C]'
                    : 'border-[rgba(201,168,76,0.15)] text-[#8A8073] hover:border-[rgba(201,168,76,0.3)] hover:text-[#D4C5A9]'
                }`}
              >
                <Star size={13} className={form.featured ? 'fill-[#C9A84C]' : ''} />
                {form.featured ? 'Featured Project' : 'Mark as Featured'}
              </button>
            </div>
          </div>
        )}

        {/* --- Tab: Details --- */}
        {activeTab === 'details' && (
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-x-5">
              {/* Client */}
              <AdminFormField label="Client" htmlFor="proj-client">
                <input
                  id="proj-client"
                  type="text"
                  value={form.client}
                  onChange={(e) => updateField('client', e.target.value)}
                  className="input-lux w-full"
                  placeholder="Client name"
                />
              </AdminFormField>

              {/* Location */}
              <AdminFormField label="Location" htmlFor="proj-location">
                <input
                  id="proj-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="input-lux w-full"
                  placeholder="City, Country"
                />
              </AdminFormField>

              {/* Year */}
              <AdminFormField label="Year" htmlFor="proj-year">
                <input
                  id="proj-year"
                  type="text"
                  value={form.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  className="input-lux w-full"
                  placeholder="2024"
                />
              </AdminFormField>

              {/* Area */}
              <AdminFormField
                label="Area"
                htmlFor="proj-area"
                hint="e.g. 350 sq.m, 3,800 sq.ft"
              >
                <input
                  id="proj-area"
                  type="text"
                  value={form.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  className="input-lux w-full"
                  placeholder="e.g. 350 sq.m"
                />
              </AdminFormField>
            </div>

            {/* Excerpt */}
            <AdminFormField
              label="Excerpt"
              htmlFor="proj-excerpt"
              hint="Short description shown in project cards and listings."
            >
              <textarea
                id="proj-excerpt"
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                className="input-lux w-full min-h-[80px] resize-y"
                placeholder="A brief summary of this project..."
                rows={3}
              />
            </AdminFormField>
          </div>
        )}

        {/* --- Tab: Case Study --- */}
        {activeTab === 'case-study' && (
          <div className="space-y-1">
            {/* Client Brief */}
            <AdminFormField
              label="Client Brief"
              htmlFor="proj-brief"
              hint="The client's original requirements and goals."
            >
              <textarea
                id="proj-brief"
                value={form.brief}
                onChange={(e) => updateField('brief', e.target.value)}
                className="input-lux w-full min-h-[100px] resize-y"
                placeholder="Describe what the client was looking for..."
                rows={4}
              />
            </AdminFormField>

            {/* Challenge */}
            <AdminFormField
              label="The Challenge"
              htmlFor="proj-challenge"
              hint="What problem were we solving?"
            >
              <textarea
                id="proj-challenge"
                value={form.challenge}
                onChange={(e) => updateField('challenge', e.target.value)}
                className="input-lux w-full min-h-[100px] resize-y"
                placeholder="What were the key challenges of this project..."
                rows={4}
              />
            </AdminFormField>

            {/* Solution */}
            <AdminFormField
              label="Woodex Solution"
              htmlFor="proj-solution"
              hint="How we addressed the challenge."
            >
              <textarea
                id="proj-solution"
                value={form.solution}
                onChange={(e) => updateField('solution', e.target.value)}
                className="input-lux w-full min-h-[100px] resize-y"
                placeholder="Describe the approach and solution delivered..."
                rows={4}
              />
            </AdminFormField>

            {/* Materials & Finishes */}
            <AdminFormField
              label="Materials & Finishes"
              htmlFor="proj-materials"
              hint="Press Enter or comma to add a material. Click X to remove."
            >
              <TagInput
                tags={form.materials}
                onChange={(materials) => updateField('materials', materials)}
                placeholder="Add a material..."
                suggestions={[
                  'Walnut Wood',
                  'Italian Marble',
                  'Brass Fixtures',
                  'Custom Steel',
                  'Oak Veneer',
                  'Natural Stone',
                  'Bespoke Lighting',
                  'Leather Accents',
                  'Copper Details',
                  'Limestone',
                  'Teak Wood',
                  'Terrazzo',
                  'Glass Partitions',
                  'Woven Textiles',
                  'Ceramic Tiles',
                ]}
              />
            </AdminFormField>

            {/* Services Delivered */}
            <AdminFormField
              label="Services Delivered"
              htmlFor="proj-services"
              hint="Press Enter or comma to add a service. Click X to remove."
            >
              <TagInput
                tags={form.services}
                onChange={(services) => updateField('services', services)}
                placeholder="Add a service..."
                suggestions={[
                  'Interior Design',
                  'Space Planning',
                  'Furniture Design',
                  'Lighting Design',
                  'Material Sourcing',
                  'Project Management',
                  '3D Visualization',
                  'Custom Joinery',
                  'Color Consulting',
                  'FF&E Procurement',
                ]}
              />
            </AdminFormField>
          </div>
        )}

        {/* --- Tab: Media --- */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Hero Image */}
            <div>
              <AdminFormField
                label="Hero Image"
                htmlFor="proj-hero-image"
                hint="Main image shown in project listings and header."
              >
                <div className="flex gap-3">
                  <input
                    id="proj-hero-image"
                    type="text"
                    value={form.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    className="input-lux flex-1"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker('hero')}
                    className="btn-lux btn-outline text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <ImagePlus size={12} />
                    Library
                  </button>
                </div>
              </AdminFormField>
              {form.image && (
                <div className="mt-2 w-full max-w-xs aspect-video border border-[rgba(201,168,76,0.2)] overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={form.image}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="label-lux block mb-3">
                Gallery Images
                <span className="text-[#8A8073] font-light text-[0.6rem] ml-2">
                  {form.gallery.length} image{form.gallery.length !== 1 ? 's' : ''}
                </span>
              </label>

              {/* Gallery image list */}
              <div className="space-y-2 mb-4">
                {form.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.12)]"
                  >
                    <GripVertical size={14} className="text-[#8A8073] shrink-0 cursor-grab" />
                    {url && (
                      <div className="w-12 h-12 shrink-0 overflow-hidden border border-[rgba(201,168,76,0.15)]">
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const gallery = [...form.gallery];
                        gallery[idx] = e.target.value;
                        updateField('gallery', gallery);
                      }}
                      className="input-lux flex-1 text-xs"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker(idx)}
                      className="text-[#8A8073] hover:text-[#C9A84C] transition-colors p-1"
                      title="Choose from library"
                    >
                      <ImagePlus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="text-[#8A8073] hover:text-[#DC2626] transition-colors p-1"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add gallery image button */}
              <button
                type="button"
                onClick={() => addGalleryImage('')}
                className="flex items-center gap-2 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] border border-dashed border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)] px-4 py-3 w-full justify-center transition-colors"
              >
                <Plus size={13} />
                Add Gallery Image
              </button>

              {/* Gallery preview grid */}
              {form.gallery.filter((g) => g.trim()).length > 0 && (
                <div className="mt-4">
                  <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8073] mb-3">
                    Preview
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {form.gallery
                      .filter((g) => g.trim())
                      .map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-[rgba(201,168,76,0.2)] overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt={`Gallery preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                const realIdx = form.gallery.indexOf(url);
                                if (realIdx !== -1) removeGalleryImage(realIdx);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(220,38,38,0.8)] text-white p-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-black/60 text-[0.5rem] text-[#D4C5A9] px-1.5 py-0.5 max-w-[80%] truncate">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab: SEO --- */}
        {activeTab === 'seo' && (
          <div className="space-y-1">
            <AdminFormField
              label="Meta Title"
              htmlFor="proj-meta-title"
              hint="Title tag for search engines. Falls back to project title if empty."
            >
              <input
                id="proj-meta-title"
                type="text"
                value={form.metaTitle}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                className="input-lux w-full"
                placeholder={form.title || 'Project meta title'}
              />
            </AdminFormField>

            <AdminFormField
              label="Meta Description"
              htmlFor="proj-meta-desc"
              hint="Description shown in search engine results."
            >
              <textarea
                id="proj-meta-desc"
                value={form.metaDescription}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                className="input-lux w-full min-h-[100px] resize-y"
                placeholder="Brief description for search engines..."
                rows={4}
              />
            </AdminFormField>

            {/* SEO Preview */}
            {(form.metaTitle || form.title) && (
              <div className="mt-6 p-4 bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.12)]">
                <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8073] mb-3">
                  Search Preview
                </p>
                <p className="text-[#8AB4F8] text-sm mb-0.5 truncate">
                  {form.metaTitle || form.title}
                </p>
                <p className="text-[#8A8073] text-xs mb-1 truncate">
                  woodexinterior.com / projects / {form.slug || slugify(form.title)}
                </p>
                <p className="text-[#D4C5A9] text-xs line-clamp-2">
                  {form.metaDescription || form.excerpt || 'No description available.'}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      {/* --------------------------------------------------------------- */}
      {/*  Media Picker                                                    */}
      {/* --------------------------------------------------------------- */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />

      {/* --------------------------------------------------------------- */}
      {/*  Delete Confirmation                                             */}
      {/* --------------------------------------------------------------- */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}
