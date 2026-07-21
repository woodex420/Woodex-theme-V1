import { useEffect, useState, useCallback } from 'react';
import {
  ShoppingBag,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Home,
  Building2,
  Store,
  Box,
  Armchair,
  HardHat,
  Wrench,
  Hammer,
  Sparkles,
  Trees,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import MediaPicker from '@/components/dashboard/ui/MediaPicker';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Service {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  category: string;
  price: string;
  status: string;
  order: number;
  image: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
}

interface ServiceForm {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  status: string;
  order: number;
  image: string;
  price: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  icon: string;
}

const EMPTY_FORM: ServiceForm = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: '',
  status: 'published',
  order: 0,
  image: '',
  price: '',
  metaTitle: '',
  metaDescription: '',
  h1: '',
  icon: 'package',
};

/* ------------------------------------------------------------------ */
/*  Icon definitions                                                   */
/* ------------------------------------------------------------------ */

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const ICON_OPTIONS: { key: string; label: string; Icon: IconComponent }[] = [
  { key: 'interior-design', label: 'Interior Design', Icon: Sparkles },
  { key: 'residential', label: 'Residential', Icon: Home },
  { key: 'office', label: 'Office', Icon: Building2 },
  { key: 'commercial', label: 'Commercial', Icon: Store },
  { key: 'retail', label: 'Retail', Icon: ShoppingBag },
  { key: '3d', label: '3D Design', Icon: Box },
  { key: 'custom-furniture', label: 'Custom Furniture', Icon: Armchair },
  { key: 'office-furniture', label: 'Office Furniture', Icon: Armchair },
  { key: 'carpenter', label: 'Carpenter', Icon: Hammer },
  { key: 'turnkey', label: 'Turnkey', Icon: HardHat },
  { key: 'renovation', label: 'Renovation', Icon: Wrench },
  { key: 'exterior', label: 'Exterior', Icon: Trees },
];

function resolveIcon(name: string | undefined, className = ''): React.ReactNode {
  const found = ICON_OPTIONS.find((i) => i.key === name);
  const Icon = found?.Icon || Package;
  return <Icon size={22} className={`text-[#C9A84C] ${className}`} />;
}

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
/*  Collapsible section helper                                         */
/* ------------------------------------------------------------------ */

function FormSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[rgba(201,168,76,0.15)] mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.08)] transition-colors"
      >
        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#C9A84C] font-semibold">
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-[#8A8073]" />
        ) : (
          <ChevronDown size={14} className="text-[#8A8073]" />
        )}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
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
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardServices() {
  /* ---- data state ---- */
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---- modal / form state ---- */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  /* ---- delete state ---- */
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ---- media picker ---- */
  const [mediaOpen, setMediaOpen] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Data fetching                                                    */
  /* ---------------------------------------------------------------- */

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ services: Service[] }>('/admin/services');
      setServices(res.services || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------------------------------------------------------- */
  /*  Open helpers                                                     */
  /* ---------------------------------------------------------------- */

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: services.length });
    setSlugManuallyEdited(false);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      name: service.name || '',
      slug: service.slug || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      category: service.category || '',
      status: service.status || 'published',
      order: service.order ?? 0,
      image: service.image || '',
      price: service.price || '',
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
      h1: service.h1 || '',
      icon: service.icon || 'package',
    });
    setSlugManuallyEdited(true);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setSlugManuallyEdited(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Form handlers                                                    */
  /* ---------------------------------------------------------------- */

  function handleFieldChange(field: keyof ServiceForm, value: string | number) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !slugManuallyEdited) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  }

  /* ---------------------------------------------------------------- */
  /*  Save (Create / Update)                                           */
  /* ---------------------------------------------------------------- */

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name.trim()),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      status: form.status,
      order: form.order,
      image: form.image.trim(),
      price: form.price.trim(),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      h1: form.h1.trim(),
      icon: form.icon,
    };

    try {
      if (editing) {
        await adminFetch(`/admin/services/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToast({ type: 'success', message: 'Service updated successfully.' });
      } else {
        await adminFetch('/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToast({ type: 'success', message: 'Service created successfully.' });
      }

      closeModal();
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Delete                                                           */
  /* ---------------------------------------------------------------- */

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await adminFetch(`/admin/services/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      setToast({ type: 'success', message: `"${deleteTarget.name}" deleted.` });
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setDeleting(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="p-8">
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
          <h1 className="font-display text-3xl text-white">Services</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Manage your service offerings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
          >
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            New Service
          </button>
        </div>
      </div>

      {/* ---- Error banner ---- */}
      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-3">
          <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* ---- Content ---- */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <ShoppingBag size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">No services yet</p>
          <button
            onClick={openCreate}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Create your first service
          </button>
        </div>
      ) : (
        <>
          {/* ---- Card grid ---- */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-[#111110] border border-[rgba(201,168,76,0.2)] flex flex-col hover:border-[rgba(201,168,76,0.4)] transition-colors overflow-hidden"
              >
                {/* Hero image thumbnail */}
                {service.image && (
                  <div className="h-36 bg-[#0A0A0A] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Card top: icon + status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-[rgba(201,168,76,0.08)] flex items-center justify-center">
                      {resolveIcon(service.icon)}
                    </div>
                    <StatusBadge status={service.status || 'draft'} />
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-lg text-white mb-1.5 leading-snug">
                    {service.name}
                  </h3>

                  {/* Price */}
                  {service.price && (
                    <p className="text-sm text-[#C9A84C] font-light mb-2">
                      {service.price}
                    </p>
                  )}

                  {/* Short description */}
                  {service.shortDescription && (
                    <p className="text-sm text-[#D4C5A9] font-light leading-relaxed mb-3 line-clamp-2">
                      {service.shortDescription}
                    </p>
                  )}

                  {/* Slug */}
                  <code className="text-xs text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-2 py-1 self-start mb-4">
                    /{service.slug}
                  </code>

                  {/* Spacer pushes buttons to bottom */}
                  <div className="mt-auto pt-4 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(service)}
                      className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(service)}
                      className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-3.5 py-2 bg-[rgba(220,38,38,0.1)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Footer count ---- */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
              {services.length} service{services.length !== 1 ? 's' : ''}
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
        title={editing ? 'Edit Service' : 'New Service'}
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
              disabled={saving || !form.name.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Service'}
            </button>
          </>
        }
      >
        {/* ---- Basic Info ---- */}
        <FormSection title="Basic Info" defaultOpen={true}>
          <div className="grid md:grid-cols-2 gap-x-6">
            <AdminFormField label="Name" htmlFor="svc-name" required>
              <input
                id="svc-name"
                type="text"
                value={form.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. Interior Design"
                className="input-lux w-full"
              />
            </AdminFormField>

            <AdminFormField label="Slug" htmlFor="svc-slug" hint="Auto-generated from name. Edit to override.">
              <input
                id="svc-slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="interior-design"
                className="input-lux w-full"
              />
            </AdminFormField>

            <AdminFormField label="Category" htmlFor="svc-category">
              <input
                id="svc-category"
                type="text"
                value={form.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                placeholder="e.g. residential, commercial"
                className="input-lux w-full"
              />
            </AdminFormField>

            <AdminFormField label="Status" htmlFor="svc-status">
              <select
                id="svc-status"
                value={form.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="input-lux w-full"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </AdminFormField>

            <AdminFormField label="Order" htmlFor="svc-order" hint="Controls display order on the public site.">
              <input
                id="svc-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => handleFieldChange('order', parseInt(e.target.value, 10) || 0)}
                className="input-lux w-full"
              />
            </AdminFormField>
          </div>
        </FormSection>

        {/* ---- Icon Picker ---- */}
        <FormSection title="Service Icon" defaultOpen={true}>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ICON_OPTIONS.map((opt) => {
              const active = form.icon === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleFieldChange('icon', opt.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 border transition-colors ${
                    active
                      ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)]'
                      : 'border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] bg-transparent'
                  }`}
                >
                  <opt.Icon size={20} className={active ? 'text-[#C9A84C]' : 'text-[#8A8073]'} />
                  <span
                    className={`text-[0.5rem] tracking-wider uppercase text-center leading-tight ${
                      active ? 'text-[#C9A84C]' : 'text-[#8A8073]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* ---- Description ---- */}
        <FormSection title="Description" defaultOpen={true}>
          <div className="grid md:grid-cols-2 gap-x-6">
            <AdminFormField label="H1 Heading" htmlFor="svc-h1" hint="Page heading shown on the public service page.">
              <input
                id="svc-h1"
                type="text"
                value={form.h1}
                onChange={(e) => handleFieldChange('h1', e.target.value)}
                placeholder="e.g. Premium Interior Design Services"
                className="input-lux w-full"
              />
            </AdminFormField>

            <div className="md:col-span-2">
              <AdminFormField label="Short Description" htmlFor="svc-short">
                <input
                  id="svc-short"
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  placeholder="Brief one-liner about this service"
                  className="input-lux w-full"
                />
              </AdminFormField>
            </div>

            <div className="md:col-span-2">
              <AdminFormField label="Full Description" htmlFor="svc-desc">
                <textarea
                  id="svc-desc"
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Full service description..."
                  rows={5}
                  className="input-lux w-full resize-y"
                />
              </AdminFormField>
            </div>
          </div>
        </FormSection>

        {/* ---- Media ---- */}
        <FormSection title="Media" defaultOpen={true}>
          <AdminFormField label="Hero Image URL" htmlFor="svc-image" hint="Paste a URL or use the media picker.">
            <div className="flex gap-2">
              <input
                id="svc-image"
                type="text"
                value={form.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://... or /uploads/..."
                className="input-lux flex-1"
              />
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-4 inline-flex items-center gap-1.5 shrink-0"
              >
                <ImageIcon size={13} />
                Pick
              </button>
            </div>
          </AdminFormField>
          {form.image && (
            <div className="mt-2 relative w-full h-36 bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] overflow-hidden">
              <img
                src={form.image}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleFieldChange('image', '')}
                className="absolute top-2 right-2 w-6 h-6 bg-[rgba(0,0,0,0.7)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#DC2626] hover:bg-[rgba(220,38,38,0.3)] transition-colors text-xs"
              >
                x
              </button>
            </div>
          )}
        </FormSection>

        {/* ---- Pricing ---- */}
        <FormSection title="Pricing" defaultOpen={true}>
          <AdminFormField label="Price" htmlFor="svc-price" hint="Text field, e.g. 'Starting from PKR 50,000'. Leave blank if not applicable.">
            <input
              id="svc-price"
              type="text"
              value={form.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              placeholder="e.g. Starting from PKR 50,000"
              className="input-lux w-full"
            />
          </AdminFormField>
        </FormSection>

        {/* ---- SEO ---- */}
        <FormSection title="SEO" defaultOpen={false}>
          <div className="grid md:grid-cols-2 gap-x-6">
            <AdminFormField label="Meta Title" htmlFor="svc-meta-title" hint="Used in the browser tab and search results.">
              <input
                id="svc-meta-title"
                type="text"
                value={form.metaTitle}
                onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                placeholder="e.g. Interior Design Services | Woodex"
                className="input-lux w-full"
              />
            </AdminFormField>

            <div className="md:col-span-2">
              <AdminFormField label="Meta Description" htmlFor="svc-meta-desc" hint="Shown in search engine results. Aim for 150-160 characters.">
                <textarea
                  id="svc-meta-desc"
                  value={form.metaDescription}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  placeholder="Brief description for search engines..."
                  rows={3}
                  className="input-lux w-full resize-y"
                />
              </AdminFormField>
            </div>
          </div>
        </FormSection>
      </AdminModal>

      {/* ============================================================ */}
      {/*  Media Picker                                                */}
      {/* ============================================================ */}
      <MediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => handleFieldChange('image', url)}
      />

      {/* ============================================================ */}
      {/*  Delete Confirmation                                         */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
