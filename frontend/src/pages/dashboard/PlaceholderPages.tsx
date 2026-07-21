import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Layers,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Download,
  Upload,
  Home,
  FileText,
  LayoutTemplate,
  Image,
  Quote,
  BarChart3,
  Zap,
  HelpCircle,
  Building2,
  CreditCard,
  Send,
  MonitorPlay,
  Minus,
  Code,
  Clock,
  Search,
  Grid3X3,
  Images,
  GripVertical,
  Settings,
  Save,
  X,
  BookOpen,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface PageMeta {
  title?: string;
  description?: string;
}

interface Page {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  isHome?: boolean;
  isPublished?: boolean;
  meta?: PageMeta;
  updatedAt?: string;
  createdAt?: string;
}

interface Block {
  _id: string;
  pageId: string;
  type: string;
  title?: string;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  visibility?: boolean | string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PageForm {
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

interface BlockForm {
  type: string;
  title: string;
}

/* ---- Section Library types ---- */

interface LibrarySection {
  id: string;
  name: string;
  type: string;
  props: Record<string, unknown>;
  styles?: Record<string, unknown>;
  createdAt: string;
}

/* ---- Block settings editor types ---- */

interface BlockSettings {
  backgroundColor: string;
  textColor: string;
  padding: string;
  textAlign: 'left' | 'center' | 'right';
  visibilityMode: 'always' | 'desktop-only' | 'mobile-only';
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const EMPTY_PAGE_FORM: PageForm = {
  title: '',
  slug: '',
  description: '',
  isPublished: true,
  metaTitle: '',
  metaDescription: '',
};

const EMPTY_BLOCK_FORM: BlockForm = {
  type: '',
  title: '',
};

const BLOCK_TYPES: {
  type: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { type: 'hero', label: 'Hero', icon: LayoutTemplate },
  { type: 'text', label: 'Text', icon: FileText },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'features', label: 'Features', icon: Grid3X3 },
  { type: 'testimonials', label: 'Testimonials', icon: Quote },
  { type: 'stats', label: 'Stats', icon: BarChart3 },
  { type: 'cta', label: 'CTA', icon: Zap },
  { type: 'gallery', label: 'Gallery', icon: Images },
  { type: 'faq', label: 'FAQ', icon: HelpCircle },
  { type: 'logos', label: 'Logos', icon: Building2 },
  { type: 'pricing', label: 'Pricing', icon: CreditCard },
  { type: 'contact-form', label: 'Contact Form', icon: Send },
  { type: 'video', label: 'Video', icon: MonitorPlay },
  { type: 'spacer', label: 'Spacer', icon: Minus },
  { type: 'custom-html', label: 'Custom HTML', icon: Code },
];

const BLOCK_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {};
BLOCK_TYPES.forEach((bt) => {
  BLOCK_ICON_MAP[bt.type] = bt.icon;
});

const LIBRARY_STORAGE_KEY = 'woodex-section-library';

/** Not yet wired to the builder. */

/* ================================================================== */
/*  Default Library Sections (pre-seeded on first load)                */
/* ================================================================== */

function getDefaultLibrarySections(): LibrarySection[] {
  return [
    {
      id: 'lib-woodex-hero',
      name: 'Woodex Hero',
      type: 'hero',
      props: {
        title: 'Welcome to Woodex Interior',
        subtitle:
          'Crafting bespoke interior design experiences that transform your space into a masterpiece of elegance and functionality.',
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-service-features',
      name: 'Service Features Grid',
      type: 'features',
      props: {
        heading: 'Our Services',
        features: [
          { title: 'Interior Design', description: 'Full-service interior design tailored to your vision' },
          { title: 'Space Planning', description: 'Optimized layouts for maximum functionality' },
          { title: 'Custom Furniture', description: 'Handcrafted pieces built to your specifications' },
          { title: 'Lighting Design', description: 'Ambient and task lighting solutions' },
          { title: 'Color Consulting', description: 'Expert color palettes for every room' },
          { title: 'Project Management', description: 'Seamless coordination from concept to completion' },
        ],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-testimonial-showcase',
      name: 'Testimonial Showcase',
      type: 'testimonials',
      props: {
        testimonials: [
          { name: 'Sarah Mitchell', role: 'Homeowner', quote: 'Woodex transformed our living space beyond our wildest dreams.' },
          { name: 'David Chen', role: 'CEO, Chen Corp', quote: 'Professional, creative, and incredibly attentive to detail.' },
          { name: 'Emma Rodriguez', role: 'Restaurant Owner', quote: 'Our restaurant has never looked better. Customers love the ambiance.' },
        ],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-stats-counter',
      name: 'Stats Counter',
      type: 'stats',
      props: {
        stats: [
          { value: '500+', label: 'Projects Completed' },
          { value: '98%', label: 'Client Satisfaction' },
          { value: '15+', label: 'Years Experience' },
          { value: '50+', label: 'Design Awards' },
        ],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-cta-strip',
      name: 'CTA Strip',
      type: 'cta',
      props: {
        heading: 'Ready to Transform Your Space?',
        subheading: 'Schedule a free consultation with our design team today.',
        buttonText: 'Get Started',
        buttonLink: '/contact',
      },
      styles: { backgroundColor: '#0A0A0A' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-contact-form',
      name: 'Contact Form',
      type: 'contact-form',
      props: {
        heading: 'Get in Touch',
        subheading: 'We would love to hear from you.',
        fields: ['name', 'email', 'phone', 'message'],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-faq-accordion',
      name: 'FAQ Accordion',
      type: 'faq',
      props: {
        heading: 'Frequently Asked Questions',
        items: [
          { question: 'How long does a typical project take?', answer: 'Most projects are completed within 4-12 weeks depending on scope.' },
          { question: 'Do you offer free consultations?', answer: 'Yes, we offer a complimentary initial consultation for all new clients.' },
          { question: 'Can I see samples before committing?', answer: 'Absolutely. We provide material boards and 3D renders before any work begins.' },
        ],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lib-gallery-grid',
      name: 'Gallery Grid',
      type: 'gallery',
      props: {
        heading: 'Our Portfolio',
        images: [
          { src: '/images/portfolio/1.jpg', alt: 'Living room design' },
          { src: '/images/portfolio/2.jpg', alt: 'Kitchen renovation' },
          { src: '/images/portfolio/3.jpg', alt: 'Bedroom styling' },
          { src: '/images/portfolio/4.jpg', alt: 'Office interior' },
          { src: '/images/portfolio/5.jpg', alt: 'Dining room' },
          { src: '/images/portfolio/6.jpg', alt: 'Bathroom design' },
        ],
      },
      styles: {},
      createdAt: new Date().toISOString(),
    },
  ];
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function generateLibId(): string {
  return `lib-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getVisibilityMode(block: Block): string {
  const vis = block.visibility;
  if (vis === 'desktop-only' || vis === 'mobile-only') return vis;
  if (vis === false) return 'desktop-only';
  return 'always';
}

/* ================================================================== */
/*  Library localStorage helpers                                       */
/* ================================================================== */

function loadLibrary(): LibrarySection[] {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through */
  }
  return [];
}

function saveLibrary(sections: LibrarySection[]): void {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(sections));
}

function ensureDefaultLibrary(): LibrarySection[] {
  let existing = loadLibrary();
  if (existing.length === 0) {
    existing = getDefaultLibrarySections();
    saveLibrary(existing);
  }
  return existing;
}

/* ================================================================== */
/*  Toast                                                              */
/* ================================================================== */

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

/* ================================================================== */
/*  Inline Block Settings Panel                                        */
/* ================================================================== */

function BlockSettingsPanel({
  block,
  onSave,
  onClose,
  saving,
}: {
  block: Block;
  onSave: (settings: BlockSettings) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [settings, setSettings] = useState<BlockSettings>(() => {
    const styles = (block.styles || {}) as Record<string, unknown>;
    return {
      backgroundColor: (styles.backgroundColor as string) || '',
      textColor: (styles.textColor as string) || '',
      padding: (styles.padding as string) || '',
      textAlign: (styles.textAlign as 'left' | 'center' | 'right') || 'left',
      visibilityMode: getVisibilityMode(block) as 'always' | 'desktop-only' | 'mobile-only',
    };
  });

  function update(key: keyof BlockSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="border-t border-[rgba(201,168,76,0.15)] mt-3 pt-3 space-y-4 animate-in fade-in slide-in-from-top-1">
      {/* Row 1: Colors + Padding */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label-lux mb-1.5 block">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.backgroundColor || '#111110'}
              onChange={(e) => update('backgroundColor', e.target.value)}
              className="w-8 h-8 border border-[rgba(201,168,76,0.2)] bg-transparent cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => update('backgroundColor', e.target.value)}
              placeholder="#000000"
              className="input-lux w-full text-xs"
            />
          </div>
        </div>
        <div>
          <label className="label-lux mb-1.5 block">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.textColor || '#FFFFFF'}
              onChange={(e) => update('textColor', e.target.value)}
              className="w-8 h-8 border border-[rgba(201,168,76,0.2)] bg-transparent cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={settings.textColor}
              onChange={(e) => update('textColor', e.target.value)}
              placeholder="#FFFFFF"
              className="input-lux w-full text-xs"
            />
          </div>
        </div>
        <div>
          <AdminFormField label="Padding" htmlFor={`pad-${block._id}`} hint='e.g. "60px 20px"'>
            <input
              id={`pad-${block._id}`}
              type="text"
              value={settings.padding}
              onChange={(e) => update('padding', e.target.value)}
              placeholder="60px 20px"
              className="input-lux w-full text-xs"
            />
          </AdminFormField>
        </div>
      </div>

      {/* Row 2: Text Align + Visibility */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-lux mb-1.5 block">Text Alignment</label>
          <div className="flex gap-0">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => update('textAlign', align)}
                className={`px-4 py-2 text-[0.5rem] tracking-[0.2em] uppercase font-semibold border transition-colors ${
                  settings.textAlign === align
                    ? 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border-[rgba(201,168,76,0.5)]'
                    : 'bg-[#0A0A0A] text-[#8A8073] border-[rgba(201,168,76,0.15)] hover:text-[#D4C5A9]'
                } ${align === 'left' ? 'border-r-0' : align === 'center' ? 'border-r-0' : ''}`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <AdminFormField label="Visibility" htmlFor={`vis-${block._id}`}>
            <select
              id={`vis-${block._id}`}
              value={settings.visibilityMode}
              onChange={(e) => update('visibilityMode', e.target.value as BlockSettings['visibilityMode'])}
              className="input-lux w-full text-xs"
            >
              <option value="always">Always Visible</option>
              <option value="desktop-only">Desktop Only</option>
              <option value="mobile-only">Mobile Only</option>
            </select>
          </AdminFormField>
        </div>
      </div>

      {/* Save / Cancel */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="btn-lux btn-outline text-[0.5rem] py-1.5 px-3 inline-flex items-center gap-1"
        >
          <X size={10} />
          Cancel
        </button>
        <button
          onClick={() => onSave(settings)}
          disabled={saving}
          className="btn-lux btn-gold text-[0.5rem] py-1.5 px-3 inline-flex items-center gap-1 disabled:opacity-50"
        >
          {saving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function PlaceholderPages() {
  /* ---- data state ---- */
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /* ---- page modal ---- */
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState<PageForm>({ ...EMPTY_PAGE_FORM });
  const [pageSaving, setPageSaving] = useState(false);
  const [slugManualEdit, setSlugManualEdit] = useState(false);

  /* ---- block modal ---- */
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState<BlockForm>({ ...EMPTY_BLOCK_FORM });
  const [blockSaving, setBlockSaving] = useState(false);

  /* ---- import/export ---- */
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [exportJson, setExportJson] = useState('');
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);

  /* ---- delete confirmations ---- */
  const [deletePageTarget, setDeletePageTarget] = useState<Page | null>(null);
  const [deletingPage, setDeletingPage] = useState(false);
  const [deleteBlockTarget, setDeleteBlockTarget] = useState<Block | null>(null);
  const [deletingBlock, setDeletingBlock] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  /* ---- section library ---- */
  const [librarySections, setLibrarySections] = useState<LibrarySection[]>([]);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [saveToLibraryTarget, setSaveToLibraryTarget] = useState<Block | null>(null);
  const [librarySaveName, setLibrarySaveName] = useState('');

  /* ---- block settings editor ---- */
  const [settingsEditorBlockId, setSettingsEditorBlockId] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);

  /* ---- inline title editing ---- */
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockTitle, setEditingBlockTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  /* ---- drag and drop ---- */
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  /* ---- ref for search ---- */
  const searchRef = useRef<HTMLInputElement>(null);

  /* ================================================================= */
  /*  Derived data                                                      */
  /* ================================================================= */

  const selectedPage = pages.find((p) => p._id === selectedPageId) || null;

  const filteredPages = pages.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const filteredLibrarySections = librarySections.filter((s) => {
    if (!librarySearch.trim()) return true;
    const q = librarySearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q)
    );
  });

  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  /* ================================================================= */
  /*  Library init                                                      */
  /* ================================================================= */

  useEffect(() => {
    const sections = ensureDefaultLibrary();
    setLibrarySections(sections);
  }, []);

  /* ================================================================= */
  /*  Data fetching                                                     */
  /* ================================================================= */

  const loadPages = useCallback(async () => {
    try {
      setLoadingPages(true);
      setError('');
      const res = await adminFetch<{ pages: Page[] }>('/admin/pages');
      setPages(res.pages || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoadingPages(false);
    }
  }, []);

  const loadBlocks = useCallback(async (pageId: string) => {
    try {
      setLoadingBlocks(true);
      const res = await adminFetch<{ blocks: Block[] }>(
        `/admin/blocks?pageId=${pageId}`
      );
      setBlocks(res.blocks || []);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load sections',
      });
    } finally {
      setLoadingBlocks(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (selectedPageId) {
      loadBlocks(selectedPageId);
      setSettingsEditorBlockId(null);
    } else {
      setBlocks([]);
    }
  }, [selectedPageId, loadBlocks]);

  /* ================================================================= */
  /*  Page modal helpers                                                */
  /* ================================================================= */

  function openCreatePage() {
    setEditingPage(null);
    setPageForm({ ...EMPTY_PAGE_FORM });
    setSlugManualEdit(false);
    setPageModalOpen(true);
  }

  function openEditPage(page: Page) {
    setEditingPage(page);
    setPageForm({
      title: page.title || '',
      slug: page.slug || '',
      description: page.description || '',
      isPublished: page.isPublished ?? true,
      metaTitle: page.meta?.title || '',
      metaDescription: page.meta?.description || '',
    });
    setSlugManualEdit(true);
    setPageModalOpen(true);
  }

  function closePageModal() {
    setPageModalOpen(false);
    setEditingPage(null);
    setPageForm({ ...EMPTY_PAGE_FORM });
    setSlugManualEdit(false);
  }

  function handlePageFieldChange(field: keyof PageForm, value: string | boolean) {
    setPageForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManualEdit && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handlePageSlugChange(value: string) {
    setSlugManualEdit(true);
    setPageForm((prev) => ({ ...prev, slug: slugify(value) }));
  }

  /* ================================================================= */
  /*  Save Page                                                         */
  /* ================================================================= */

  async function handleSavePage() {
    if (!pageForm.title.trim()) return;
    setPageSaving(true);

    try {
      const payload = {
        title: pageForm.title.trim(),
        slug: pageForm.slug.trim() || slugify(pageForm.title.trim()),
        description: pageForm.description.trim(),
        isPublished: pageForm.isPublished,
        meta: {
          title: pageForm.metaTitle.trim(),
          description: pageForm.metaDescription.trim(),
        },
      };

      if (editingPage) {
        await adminFetch(`/admin/pages/${editingPage._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToast({ type: 'success', message: 'Page updated successfully.' });
      } else {
        const res = await adminFetch<{ page: Page }>('/admin/pages', {
          method: 'POST',
          body: JSON.stringify({ ...payload, isHome: false }),
        });
        setToast({ type: 'success', message: 'Page created successfully.' });
        if (res.page?._id) {
          setSelectedPageId(res.page._id);
        }
      }

      closePageModal();
      await loadPages();
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save page',
      });
    } finally {
      setPageSaving(false);
    }
  }

  /* ================================================================= */
  /*  Delete Page                                                       */
  /* ================================================================= */

  async function handleDeletePage() {
    if (!deletePageTarget) return;
    setDeletingPage(true);

    try {
      await adminFetch(`/admin/pages/${deletePageTarget._id}`, {
        method: 'DELETE',
      });
      setToast({
        type: 'success',
        message: `"${deletePageTarget.title}" deleted.`,
      });

      if (selectedPageId === deletePageTarget._id) {
        setSelectedPageId(null);
        setBlocks([]);
      }

      setDeletePageTarget(null);
      await loadPages();
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete page',
      });
    } finally {
      setDeletingPage(false);
    }
  }

  /* ================================================================= */
  /*  Duplicate Page                                                    */
  /* ================================================================= */

  async function handleDuplicatePage(page: Page) {
    try {
      await adminFetch(`/admin/pages/${page._id}/duplicate`, {
        method: 'POST',
      });
      setToast({
        type: 'success',
        message: `"${page.title}" duplicated.`,
      });
      await loadPages();
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to duplicate page',
      });
    }
  }

  /* ================================================================= */
  /*  Block CRUD                                                        */
  /* ================================================================= */

  function openAddBlock() {
    setBlockForm({ ...EMPTY_BLOCK_FORM });
    setBlockModalOpen(true);
  }

  function closeBlockModal() {
    setBlockModalOpen(false);
    setBlockForm({ ...EMPTY_BLOCK_FORM });
  }

  async function handleAddBlock() {
    if (!blockForm.type || !selectedPageId) return;
    setBlockSaving(true);

    try {
      await adminFetch('/admin/blocks', {
        method: 'POST',
        body: JSON.stringify({
          pageId: selectedPageId,
          type: blockForm.type,
          title: blockForm.title.trim() || blockForm.type,
          props: {},
          styles: {},
          visibility: true,
        }),
      });
      setToast({ type: 'success', message: 'Section added.' });
      closeBlockModal();
      await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to add section',
      });
    } finally {
      setBlockSaving(false);
    }
  }

  async function handleMoveBlock(block: Block, direction: 'up' | 'down') {
    try {
      await adminFetch(`/admin/blocks/${block._id}/move`, {
        method: 'POST',
        body: JSON.stringify({ direction }),
      });
      if (selectedPageId) await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to reorder',
      });
    }
  }

  async function handleToggleBlockVisibility(block: Block) {
    try {
      await adminFetch(`/admin/blocks/${block._id}/toggle-visibility`, {
        method: 'POST',
      });
      if (selectedPageId) await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to toggle visibility',
      });
    }
  }

  async function handleDuplicateBlock(block: Block) {
    try {
      await adminFetch(`/admin/blocks/${block._id}/duplicate`, {
        method: 'POST',
      });
      setToast({ type: 'success', message: 'Section duplicated.' });
      if (selectedPageId) await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to duplicate section',
      });
    }
  }

  async function handleDeleteBlock() {
    if (!deleteBlockTarget) return;
    setDeletingBlock(true);

    try {
      await adminFetch(`/admin/blocks/${deleteBlockTarget._id}`, {
        method: 'DELETE',
      });
      setToast({ type: 'success', message: 'Section deleted.' });
      if (settingsEditorBlockId === deleteBlockTarget._id) {
        setSettingsEditorBlockId(null);
      }
      setDeleteBlockTarget(null);
      if (selectedPageId) await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete section',
      });
    } finally {
      setDeletingBlock(false);
    }
  }

  /* ================================================================= */
  /*  Block Settings Save                                               */
  /* ================================================================= */

  async function handleSaveBlockSettings(
    block: Block,
    settings: BlockSettings
  ) {
    if (!selectedPageId) return;
    setSettingsSaving(true);

    try {
      const visibilityValue =
        settings.visibilityMode === 'always'
          ? true
          : settings.visibilityMode;

      await adminFetch(`/admin/blocks/${block._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          styles: {
            backgroundColor: settings.backgroundColor || undefined,
            textColor: settings.textColor || undefined,
            padding: settings.padding || undefined,
            textAlign: settings.textAlign || undefined,
          },
          visibility: visibilityValue,
        }),
      });
      setToast({ type: 'success', message: 'Block settings saved.' });
      setSettingsEditorBlockId(null);
      await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save settings',
      });
    } finally {
      setSettingsSaving(false);
    }
  }

  /* ================================================================= */
  /*  Inline Title Editing                                              */
  /* ================================================================= */

  function startEditBlockTitle(block: Block) {
    setEditingBlockId(block._id);
    setEditingBlockTitle(block.title || block.type);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  }

  async function saveBlockTitle(block: Block) {
    if (!selectedPageId) return;
    const newTitle = editingBlockTitle.trim();
    if (!newTitle || newTitle === (block.title || block.type)) {
      setEditingBlockId(null);
      return;
    }

    try {
      await adminFetch(`/admin/blocks/${block._id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: newTitle }),
      });
      setEditingBlockId(null);
      await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to rename',
      });
    }
  }

  /* ================================================================= */
  /*  Section Library                                                   */
  /* ================================================================= */

  function addFromLibrary(section: LibrarySection) {
    if (!selectedPageId) return;

    (async () => {
      try {
        await adminFetch('/admin/blocks', {
          method: 'POST',
          body: JSON.stringify({
            pageId: selectedPageId,
            type: section.type,
            title: section.name,
            props: JSON.parse(JSON.stringify(section.props || {})),
            styles: JSON.parse(JSON.stringify(section.styles || {})),
            visibility: true,
          }),
        });
        setToast({
          type: 'success',
          message: `"${section.name}" added from library.`,
        });
        setLibraryModalOpen(false);
        await loadBlocks(selectedPageId);
      } catch (err: unknown) {
        setToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to add from library',
        });
      }
    })();
  }

  function openSaveToLibrary(block: Block) {
    setSaveToLibraryTarget(block);
    setLibrarySaveName(block.title || block.type);
  }

  function handleSaveToLibrary() {
    if (!saveToLibraryTarget || !librarySaveName.trim()) return;

    const newSection: LibrarySection = {
      id: generateLibId(),
      name: librarySaveName.trim(),
      type: saveToLibraryTarget.type,
      props: JSON.parse(
        JSON.stringify(saveToLibraryTarget.props || {})
      ),
      styles: JSON.parse(
        JSON.stringify(saveToLibraryTarget.styles || {})
      ),
      createdAt: new Date().toISOString(),
    };

    const updated = [...librarySections, newSection];
    saveLibrary(updated);
    setLibrarySections(updated);
    setSaveToLibraryTarget(null);
    setLibrarySaveName('');
    setToast({
      type: 'success',
      message: `"${newSection.name}" saved to library.`,
    });
  }

  function handleDeleteFromLibrary(sectionId: string) {
    const updated = librarySections.filter((s) => s.id !== sectionId);
    saveLibrary(updated);
    setLibrarySections(updated);
  }

  /* ================================================================= */
  /*  Drag and Drop                                                     */
  /* ================================================================= */

  function handleDragStart(blockId: string, e: React.DragEvent) {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId);
  }

  function handleDragOver(blockId: string, e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(blockId);
  }

  function handleDragLeave() {
    setDropTargetId(null);
  }

  async function handleDrop(targetBlockId: string, e: React.DragEvent) {
    e.preventDefault();
    setDropTargetId(null);

    const sourceBlockId = e.dataTransfer.getData('text/plain') || draggedBlockId;
    setDraggedBlockId(null);

    if (!sourceBlockId || sourceBlockId === targetBlockId || !selectedPageId) return;

    // Build the new order
    const currentSorted = [...sortedBlocks];
    const sourceIdx = currentSorted.findIndex((b) => b._id === sourceBlockId);
    const targetIdx = currentSorted.findIndex((b) => b._id === targetBlockId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    // Reorder locally first for immediate UI feedback
    const reordered = [...currentSorted];
    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    // Assign order values
    const newOrder = reordered.map((b, i) => ({
      id: b._id,
      order: i,
    }));

    // Optimistic update
    setBlocks((prev) =>
      prev.map((b) => {
        const found = newOrder.find((o) => o.id === b._id);
        return found ? { ...b, order: found.order } : b;
      })
    );

    try {
      await adminFetch(`/admin/pages/${selectedPageId}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ order: newOrder }),
      });
      await loadBlocks(selectedPageId);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to reorder',
      });
      await loadBlocks(selectedPageId);
    }
  }

  function handleDragEnd() {
    setDraggedBlockId(null);
    setDropTargetId(null);
  }

  /* ================================================================= */
  /*  Import / Export                                                   */
  /* ================================================================= */

  function openImportExport() {
    if (selectedPage) {
      const exportData = {
        page: {
          title: selectedPage.title,
          slug: selectedPage.slug,
          description: selectedPage.description,
          isHome: selectedPage.isHome,
          isPublished: selectedPage.isPublished,
          meta: selectedPage.meta,
        },
        blocks: sortedBlocks.map((b) => ({
          type: b.type,
          title: b.title,
          props: b.props,
          styles: b.styles,
          visibility: b.visibility,
        })),
      };
      setExportJson(JSON.stringify(exportData, null, 2));
    } else {
      const exportData = {
        pages: pages.map((p) => ({
          title: p.title,
          slug: p.slug,
          description: p.description,
          isHome: p.isHome,
          isPublished: p.isPublished,
          meta: p.meta,
        })),
      };
      setExportJson(JSON.stringify(exportData, null, 2));
    }
    setImportJson('');
    setImportExportOpen(true);
  }

  function handleExportDownload() {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `woodex-${selectedPage ? selectedPage.slug : 'pages'}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleImport() {
    if (!importJson.trim()) return;
    setImporting(true);

    try {
      const data = JSON.parse(importJson);

      if (data.page && selectedPageId) {
        await adminFetch(`/admin/pages/${selectedPageId}`, {
          method: 'PUT',
          body: JSON.stringify(data.page),
        });

        if (Array.isArray(data.blocks)) {
          for (const block of data.blocks) {
            await adminFetch('/admin/blocks', {
              method: 'POST',
              body: JSON.stringify({
                pageId: selectedPageId,
                type: block.type,
                title: block.title,
                props: block.props || {},
                styles: block.styles || {},
                visibility: block.visibility ?? true,
              }),
            });
          }
          await loadBlocks(selectedPageId);
        }
      } else if (data.pages) {
        for (const page of data.pages) {
          await adminFetch('/admin/pages', {
            method: 'POST',
            body: JSON.stringify({
              ...page,
              isHome: page.isHome ?? false,
            }),
          });
        }
      } else {
        setToast({
          type: 'error',
          message: 'Invalid import format. Expected { page, blocks } or { pages }.',
        });
        setImporting(false);
        return;
      }

      setToast({ type: 'success', message: 'Import completed successfully.' });
      setImportExportOpen(false);
      await loadPages();
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setToast({
          type: 'error',
          message: 'Invalid JSON. Please check the format.',
        });
      } else {
        setToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Import failed',
        });
      }
    } finally {
      setImporting(false);
    }
  }

  /* ================================================================= */
  /*  Block type icon resolver                                          */
  /* ================================================================= */

  function getBlockIcon(type: string): React.ReactNode {
    const Icon = BLOCK_ICON_MAP[type] || Layers;
    return <Icon size={14} className="text-[#C9A84C]" />;
  }

  /* ================================================================= */
  /*  Render                                                            */
  /* ================================================================= */

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-[#0A0A0A]">
      {/* ---- Toast ---- */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* ============================================================ */}
      {/*  LEFT SIDEBAR -- Page List                                    */}
      {/* ============================================================ */}
      <aside className="w-72 shrink-0 bg-[#111110] border-r border-[rgba(201,168,76,0.15)] flex flex-col h-full">
        {/* Sidebar header */}
        <div className="px-5 py-5 border-b border-[rgba(201,168,76,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base text-white">Pages</h2>
              <p className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] mt-0.5">
                {pages.length} page{pages.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={openCreatePage}
              className="btn-lux btn-gold text-[0.5rem] py-1.5 px-3 inline-flex items-center gap-1.5"
            >
              <Plus size={11} />
              New Page
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]"
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="input-lux w-full pl-8 pr-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Page list */}
        <div className="flex-1 overflow-y-auto scrollbar-lux">
          {loadingPages ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="text-[#C9A84C] animate-spin" />
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Layers
                size={28}
                className="mx-auto mb-3 text-[#8A8073] opacity-40"
              />
              <p className="text-xs text-[#8A8073] font-light">
                {searchQuery
                  ? 'No pages match your search'
                  : 'No pages yet'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredPages.map((page) => (
                <button
                  key={page._id}
                  onClick={() => setSelectedPageId(page._id)}
                  className={`w-full text-left px-4 py-3 transition-colors group ${
                    selectedPageId === page._id
                      ? 'bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.4)]'
                      : 'border border-transparent hover:bg-[rgba(201,168,76,0.04)] hover:border-[rgba(201,168,76,0.1)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-white font-medium truncate">
                      {page.title}
                    </span>
                    {page.isHome && (
                      <span className="inline-flex items-center gap-1 text-[0.4rem] tracking-[0.2em] uppercase font-semibold text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-1.5 py-0.5 shrink-0">
                        <Home size={8} />
                        Home
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-[0.6rem] text-[#8A8073]">
                      /{page.slug}
                    </code>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        page.isPublished ? 'bg-[#16A34A]' : 'bg-[#8A8073]'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="px-5 py-4 border-t border-[rgba(201,168,76,0.12)]">
          <button
            onClick={openImportExport}
            className="btn-lux btn-outline text-[0.5rem] py-2 px-3 w-full inline-flex items-center justify-center gap-1.5"
          >
            <Download size={11} />
            Import / Export
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/*  RIGHT MAIN AREA -- Selected Page                             */}
      {/* ============================================================ */}
      <main className="flex-1 overflow-y-auto scrollbar-lux">
        {!selectedPage ? (
          /* ---- Empty state: no page selected ---- */
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center mx-auto mb-6">
                <Layers size={32} className="text-[#C9A84C] opacity-40" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">
                Pages & Sections
              </h3>
              <p className="text-sm text-[#8A8073] font-light max-w-sm leading-relaxed">
                Select a page from the sidebar to manage its sections, or
                create a new page to get started.
              </p>
              <button
                onClick={openCreatePage}
                className="btn-lux btn-gold text-[0.6rem] py-2.5 px-6 mt-8 inline-flex items-center gap-2"
              >
                <Plus size={13} />
                Create Your First Page
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-5xl">
            {/* ---- Error banner ---- */}
            {error && (
              <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-3">
                <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
                <span className="text-sm text-[#DC2626]">{error}</span>
              </div>
            )}

            {/* ====================================================== */}
            {/*  Page Header                                           */}
            {/* ====================================================== */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-3xl text-white">
                    {selectedPage.title}
                  </h1>
                  {selectedPage.isHome && (
                    <span className="inline-flex items-center gap-1 text-[0.45rem] tracking-[0.2em] uppercase font-semibold text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2 py-1">
                      <Home size={9} />
                      Home Page
                    </span>
                  )}
                  <StatusBadge
                    status={selectedPage.isPublished ? 'published' : 'draft'}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-[#8A8073]">
                  <code className="bg-[rgba(201,168,76,0.08)] text-[#C9A84C] px-2 py-0.5">
                    /{selectedPage.slug}
                  </code>
                  {selectedPage.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      Updated {timeAgo(selectedPage.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openImportExport}
                  className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Upload size={11} />
                  Import/Export
                </button>
                <button
                  onClick={() => openEditPage(selectedPage)}
                  className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Pencil size={11} />
                  Edit Page
                </button>
                <button
                  onClick={() => handleDuplicatePage(selectedPage)}
                  className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                >
                  <Copy size={11} />
                  Duplicate
                </button>
                {!selectedPage.isHome && (
                  <button
                    onClick={() => setDeletePageTarget(selectedPage)}
                    className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-3.5 py-2 bg-[rgba(220,38,38,0.1)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* ====================================================== */}
            {/*  SEO Section                                           */}
            {/* ====================================================== */}
            <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6 mb-8">
              <h3 className="font-display text-sm text-white mb-4 flex items-center gap-2">
                <FileText size={14} className="text-[#C9A84C]" />
                SEO Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] font-semibold">
                    Meta Title
                  </span>
                  <p className="text-sm text-[#D4C5A9] font-light mt-1">
                    {selectedPage.meta?.title || (
                      <span className="text-[#6B6355] italic">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] font-semibold">
                    Meta Description
                  </span>
                  <p className="text-sm text-[#D4C5A9] font-light mt-1 leading-relaxed">
                    {selectedPage.meta?.description || (
                      <span className="text-[#6B6355] italic">Not set</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ====================================================== */}
            {/*  Section Blocks                                        */}
            {/* ====================================================== */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-white flex items-center gap-2">
                  <Layers size={16} className="text-[#C9A84C]" />
                  Sections
                  <span className="text-xs text-[#8A8073] font-light font-sans ml-1">
                    ({sortedBlocks.length})
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  {/* Add from Library */}
                  <button
                    onClick={() => setLibraryModalOpen(true)}
                    className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                  >
                    <BookOpen size={12} />
                    Add from Library
                  </button>
                  {/* Add blank section */}
                  <button
                    onClick={openAddBlock}
                    className="btn-lux btn-gold text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Section
                  </button>
                </div>
              </div>

              {loadingBlocks ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2
                    size={24}
                    className="text-[#C9A84C] animate-spin"
                  />
                </div>
              ) : sortedBlocks.length === 0 ? (
                /* ---- Empty state: no blocks ---- */
                <div className="bg-[#111110] border border-dashed border-[rgba(201,168,76,0.2)] text-center py-16">
                  <Layers
                    size={36}
                    className="mx-auto mb-4 text-[#8A8073] opacity-40"
                  />
                  <p className="text-white font-display text-base mb-1">
                    No sections yet
                  </p>
                  <p className="text-sm text-[#8A8073] font-light mb-6">
                    Add your first section block to start building this page.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setLibraryModalOpen(true)}
                      className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
                    >
                      <BookOpen size={13} />
                      Add from Library
                    </button>
                    <button
                      onClick={openAddBlock}
                      className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
                    >
                      <Plus size={13} />
                      Add Your First Section
                    </button>
                  </div>
                </div>
              ) : (
                /* ---- Block list with drag-and-drop ---- */
                <div className="space-y-3">
                  {sortedBlocks.map((block, index) => {
                    const isDragged = draggedBlockId === block._id;
                    const isDropTarget = dropTargetId === block._id;
                    const isSettingsOpen =
                      settingsEditorBlockId === block._id;

                    return (
                      <div key={block._id}>
                        {/* Block row */}
                        <div
                          draggable="true"
                          onDragStart={(e) =>
                            handleDragStart(block._id, e)
                          }
                          onDragOver={(e) =>
                            handleDragOver(block._id, e)
                          }
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(block._id, e)}
                          onDragEnd={handleDragEnd}
                          className={`bg-[#111110] border p-4 flex items-center gap-4 transition-all ${
                            isDragged ? 'opacity-40' : ''
                          } ${
                            isDropTarget
                              ? 'border-[#C9A84C] border-solid'
                              : 'border-[rgba(201,168,76,0.2)]'
                          } ${
                            block.visibility === false
                              ? 'opacity-50'
                              : ''
                          } ${
                            !isDragged && !isDropTarget
                              ? 'hover:border-[rgba(201,168,76,0.35)]'
                              : ''
                          }`}
                        >
                          {/* Drag handle */}
                          <div
                            className="w-6 h-8 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] cursor-grab active:cursor-grabbing shrink-0 transition-colors"
                            title="Drag to reorder"
                          >
                            <GripVertical size={16} />
                          </div>

                          {/* Order number */}
                          <div className="w-7 h-7 bg-[rgba(201,168,76,0.08)] flex items-center justify-center text-[0.5rem] text-[#8A8073] font-semibold shrink-0">
                            {index + 1}
                          </div>

                          {/* Type icon + badge */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            {getBlockIcon(block.type)}
                            <span className="text-[0.45rem] tracking-[0.2em] uppercase font-semibold text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2 py-0.5">
                              {block.type}
                            </span>
                          </div>

                          {/* Title (click to edit inline, or display) */}
                          <div className="flex-1 min-w-0">
                            {editingBlockId === block._id ? (
                              <input
                                ref={titleInputRef}
                                type="text"
                                value={editingBlockTitle}
                                onChange={(e) =>
                                  setEditingBlockTitle(e.target.value)
                                }
                                onBlur={() => saveBlockTitle(block)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveBlockTitle(block);
                                  if (e.key === 'Escape') {
                                    setEditingBlockId(null);
                                  }
                                }}
                                className="input-lux w-full text-sm py-1 px-2"
                                autoFocus
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  startEditBlockTitle(block)
                                }
                                className="text-sm text-white truncate hover:text-[#C9A84C] transition-colors text-left cursor-pointer"
                                title="Click to rename"
                              >
                                {block.title || block.type}
                              </button>
                            )}
                          </div>

                          {/* Visibility badge */}
                          <div
                            className="shrink-0"
                            title={
                              block.visibility === false
                                ? 'Hidden'
                                : 'Visible'
                            }
                          >
                            {block.visibility === false ? (
                              <span className="inline-flex items-center gap-1 text-[0.4rem] tracking-[0.15em] uppercase font-semibold text-[#8A8073] bg-[rgba(138,128,115,0.12)] px-1.5 py-0.5">
                                <EyeOff size={8} />
                                Hidden
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[0.4rem] tracking-[0.15em] uppercase font-semibold text-[#16A34A] bg-[rgba(22,163,74,0.12)] px-1.5 py-0.5">
                                <Eye size={8} />
                                Visible
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Move Up (fallback for accessibility) */}
                            <button
                              onClick={() => handleMoveBlock(block, 'up')}
                              disabled={index === 0}
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-white disabled:opacity-30 disabled:hover:text-[#8A8073] transition-colors"
                              title="Move up"
                            >
                              <ChevronUp size={14} />
                            </button>

                            {/* Move Down (fallback for accessibility) */}
                            <button
                              onClick={() => handleMoveBlock(block, 'down')}
                              disabled={
                                index === sortedBlocks.length - 1
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-white disabled:opacity-30 disabled:hover:text-[#8A8073] transition-colors"
                              title="Move down"
                            >
                              <ChevronDown size={14} />
                            </button>

                            {/* Toggle visibility */}
                            <button
                              onClick={() =>
                                handleToggleBlockVisibility(block)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-white transition-colors"
                              title={
                                block.visibility === false
                                  ? 'Show section'
                                  : 'Hide section'
                              }
                            >
                              {block.visibility === false ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </button>

                            {/* Settings */}
                            <button
                              onClick={() =>
                                setSettingsEditorBlockId(
                                  isSettingsOpen ? null : block._id
                                )
                              }
                              className={`w-7 h-7 flex items-center justify-center transition-colors ${
                                isSettingsOpen
                                  ? 'text-[#C9A84C]'
                                  : 'text-[#8A8073] hover:text-[#C9A84C]'
                              }`}
                              title="Block settings"
                            >
                              <Settings size={13} />
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicateBlock(block)}
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                              title="Duplicate section"
                            >
                              <Copy size={13} />
                            </button>

                            {/* Save to Library */}
                            <button
                              onClick={() => openSaveToLibrary(block)}
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                              title="Save to library"
                            >
                              <BookOpen size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteBlockTarget(block)}
                              className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#DC2626] transition-colors"
                              title="Delete section"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Inline Settings Panel */}
                        {isSettingsOpen && (
                          <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] border-t-0 p-4 -mt-3">
                            <BlockSettingsPanel
                              block={block}
                              onSave={(settings) =>
                                handleSaveBlockSettings(block, settings)
                              }
                              onClose={() =>
                                setSettingsEditorBlockId(null)
                              }
                              saving={settingsSaving}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/*  PAGE CREATE / EDIT MODAL                                    */}
      {/* ============================================================ */}
      <AdminModal
        open={pageModalOpen}
        onClose={closePageModal}
        title={editingPage ? 'Edit Page' : 'New Page'}
        size="lg"
        footer={
          <>
            <button
              onClick={closePageModal}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePage}
              disabled={pageSaving || !pageForm.title.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {pageSaving
                ? 'Saving...'
                : editingPage
                  ? 'Save Changes'
                  : 'Create Page'}
            </button>
          </>
        }
      >
        <div className="space-y-0">
          {/* Title */}
          <AdminFormField label="Page Title" htmlFor="pg-title" required>
            <input
              id="pg-title"
              type="text"
              value={pageForm.title}
              onChange={(e) =>
                handlePageFieldChange('title', e.target.value)
              }
              placeholder="e.g. About Us, Services, Contact"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Slug */}
          <AdminFormField
            label="Slug"
            htmlFor="pg-slug"
            hint="Auto-generated from title. Edit to override."
          >
            <input
              id="pg-slug"
              type="text"
              value={pageForm.slug}
              onChange={(e) => handlePageSlugChange(e.target.value)}
              placeholder="about-us"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Description */}
          <AdminFormField label="Description" htmlFor="pg-desc">
            <textarea
              id="pg-desc"
              value={pageForm.description}
              onChange={(e) =>
                handlePageFieldChange('description', e.target.value)
              }
              placeholder="Brief description of this page..."
              rows={3}
              className="input-lux w-full resize-y"
            />
          </AdminFormField>

          {/* Status toggle */}
          <AdminFormField label="Status" htmlFor="pg-status">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  handlePageFieldChange('isPublished', true)
                }
                className={`text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-4 py-2 transition-colors ${
                  pageForm.isPublished
                    ? 'bg-[rgba(22,163,74,0.15)] text-[#16A34A] border border-[rgba(22,163,74,0.3)]'
                    : 'bg-[rgba(138,128,115,0.08)] text-[#8A8073] border border-[rgba(138,128,115,0.15)]'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePageFieldChange('isPublished', false)
                }
                className={`text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-4 py-2 transition-colors ${
                  !pageForm.isPublished
                    ? 'bg-[rgba(138,128,115,0.15)] text-[#D4C5A9] border border-[rgba(138,128,115,0.3)]'
                    : 'bg-[rgba(138,128,115,0.08)] text-[#8A8073] border border-[rgba(138,128,115,0.15)]'
                }`}
              >
                Draft
              </button>
            </div>
          </AdminFormField>

          {/* Divider */}
          <div className="border-t border-[rgba(201,168,76,0.12)] my-6" />

          {/* SEO Section */}
          <h4 className="font-display text-sm text-white mb-4 flex items-center gap-2">
            <FileText size={13} className="text-[#C9A84C]" />
            SEO
          </h4>

          {/* Meta Title */}
          <AdminFormField
            label="SEO Title"
            htmlFor="pg-meta-title"
            hint="Overrides the page title in browser tab and search results."
          >
            <input
              id="pg-meta-title"
              type="text"
              value={pageForm.metaTitle}
              onChange={(e) =>
                handlePageFieldChange('metaTitle', e.target.value)
              }
              placeholder="Page title for search engines"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Meta Description */}
          <AdminFormField
            label="SEO Description"
            htmlFor="pg-meta-desc"
            hint="Shown in search engine results below the title."
          >
            <textarea
              id="pg-meta-desc"
              value={pageForm.metaDescription}
              onChange={(e) =>
                handlePageFieldChange('metaDescription', e.target.value)
              }
              placeholder="Brief description for search engines (150-160 characters recommended)"
              rows={3}
              className="input-lux w-full resize-y"
            />
          </AdminFormField>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  ADD SECTION MODAL                                           */}
      {/* ============================================================ */}
      <AdminModal
        open={blockModalOpen}
        onClose={closeBlockModal}
        title="Add Section"
        size="lg"
        footer={
          <>
            <button
              onClick={closeBlockModal}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBlock}
              disabled={blockSaving || !blockForm.type}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {blockSaving ? 'Adding...' : 'Add Section'}
            </button>
          </>
        }
      >
        <div>
          {/* Block Type Grid */}
          <AdminFormField label="Section Type" required>
            <div className="grid grid-cols-3 gap-2.5 mt-1">
              {BLOCK_TYPES.map((bt) => {
                const isActive = blockForm.type === bt.type;
                const IconComp = bt.icon;
                return (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() =>
                      setBlockForm((prev) => ({
                        ...prev,
                        type: bt.type,
                      }))
                    }
                    className={`flex flex-col items-center gap-2 py-4 px-3 border transition-all ${
                      isActive
                        ? 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.5)] text-white'
                        : 'bg-[#0A0A0A] border-[rgba(201,168,76,0.1)] text-[#8A8073] hover:border-[rgba(201,168,76,0.25)] hover:text-[#D4C5A9]'
                    }`}
                  >
                    <IconComp
                      size={20}
                      className={
                        isActive ? 'text-[#C9A84C]' : 'text-[#8A8073]'
                      }
                    />
                    <span className="text-[0.5rem] tracking-[0.15em] uppercase font-semibold">
                      {bt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </AdminFormField>

          {/* Block Title */}
          <AdminFormField
            label="Section Title"
            htmlFor="blk-title"
            hint="Optional label for internal reference. Defaults to the section type."
          >
            <input
              id="blk-title"
              type="text"
              value={blockForm.title}
              onChange={(e) =>
                setBlockForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="e.g. Hero Section, About Us Features"
              className="input-lux w-full"
            />
          </AdminFormField>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  SECTION LIBRARY MODAL                                       */}
      {/* ============================================================ */}
      <AdminModal
        open={libraryModalOpen}
        onClose={() => {
          setLibraryModalOpen(false);
          setLibrarySearch('');
        }}
        title="Section Library"
        size="xl"
        footer={
          <>
            <button
              onClick={() => {
                setLibraryModalOpen(false);
                setLibrarySearch('');
              }}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Close
            </button>
          </>
        }
      >
        {/* Library search */}
        <div className="mb-4">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]"
            />
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search library sections..."
              className="input-lux w-full pl-8 pr-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Library grid */}
        {filteredLibrarySections.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen
              size={32}
              className="mx-auto mb-3 text-[#8A8073] opacity-40"
            />
            <p className="text-sm text-[#8A8073] font-light">
              {librarySearch
                ? 'No sections match your search'
                : 'Library is empty. Save blocks to the library from the section list.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto scrollbar-lux pr-1">
            {filteredLibrarySections.map((section) => {
              const Icon = BLOCK_ICON_MAP[section.type] || Layers;
              return (
                <div
                  key={section.id}
                  className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] p-4 hover:border-[rgba(201,168,76,0.4)] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-[#C9A84C]" />
                      <div>
                        <p className="text-sm text-white font-medium">
                          {section.name}
                        </p>
                        <span className="text-[0.4rem] tracking-[0.15em] uppercase text-[#8A8073]">
                          {section.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFromLibrary(section.id)}
                      className="w-6 h-6 flex items-center justify-center text-[#8A8073] hover:text-[#DC2626] opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove from library"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <button
                    onClick={() => addFromLibrary(section)}
                    className="btn-lux btn-gold text-[0.5rem] py-1.5 px-3 w-full inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus size={10} />
                    Add to Page
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </AdminModal>

      {/* ============================================================ */}
      {/*  SAVE TO LIBRARY MODAL                                       */}
      {/* ============================================================ */}
      <AdminModal
        open={!!saveToLibraryTarget}
        onClose={() => {
          setSaveToLibraryTarget(null);
          setLibrarySaveName('');
        }}
        title="Save to Library"
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setSaveToLibraryTarget(null);
                setLibrarySaveName('');
              }}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveToLibrary}
              disabled={!librarySaveName.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              Save to Library
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)]">
            {saveToLibraryTarget &&
              getBlockIcon(saveToLibraryTarget.type)}
            <div>
              <p className="text-sm text-white">
                {saveToLibraryTarget?.title ||
                  saveToLibraryTarget?.type}
              </p>
              <span className="text-[0.4rem] tracking-[0.15em] uppercase text-[#8A8073]">
                Type: {saveToLibraryTarget?.type}
              </span>
            </div>
          </div>
          <AdminFormField
            label="Library Name"
            htmlFor="lib-save-name"
            hint="A descriptive name to identify this section in the library."
            required
          >
            <input
              id="lib-save-name"
              type="text"
              value={librarySaveName}
              onChange={(e) => setLibrarySaveName(e.target.value)}
              placeholder="e.g. Homepage Hero, About Features"
              className="input-lux w-full"
              autoFocus
            />
          </AdminFormField>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  IMPORT / EXPORT MODAL                                       */}
      {/* ============================================================ */}
      <AdminModal
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        title="Import / Export"
        size="xl"
        footer={
          <>
            <button
              onClick={() => setImportExportOpen(false)}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Close
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Export Column */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-sm text-white flex items-center gap-2">
                <Download size={13} className="text-[#C9A84C]" />
                Export
              </h4>
              <button
                onClick={handleExportDownload}
                className="btn-lux btn-gold text-[0.5rem] py-1.5 px-3 inline-flex items-center gap-1.5"
                disabled={!exportJson}
              >
                <Download size={10} />
                Download JSON
              </button>
            </div>
            <textarea
              readOnly
              value={exportJson}
              className="input-lux w-full h-64 resize-none text-xs font-mono scrollbar-lux"
              placeholder="Select a page to export its data..."
            />
          </div>

          {/* Import Column */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-sm text-white flex items-center gap-2">
                <Upload size={13} className="text-[#C9A84C]" />
                Import
              </h4>
              <button
                onClick={handleImport}
                disabled={importing || !importJson.trim()}
                className="btn-lux btn-gold text-[0.5rem] py-1.5 px-3 inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={10} />
                    Import
                  </>
                )}
              </button>
            </div>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="input-lux w-full h-64 resize-none text-xs font-mono scrollbar-lux"
              placeholder={`Paste JSON here...\n\nFormat for single page:\n${JSON.stringify(
                {
                  page: { title: '...', slug: '...' },
                  blocks: [{ type: 'hero', title: '...' }],
                },
                null,
                2
              )
                .split('\n')
                .slice(0, 5)
                .join('\n')}...`}
            />
          </div>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  DELETE PAGE CONFIRMATION                                    */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deletePageTarget}
        onClose={() => setDeletePageTarget(null)}
        onConfirm={handleDeletePage}
        title="Delete Page"
        message={`Are you sure you want to delete "${deletePageTarget?.title}" and all its sections? This action cannot be undone.`}
        confirmLabel="Delete Page"
        danger
        loading={deletingPage}
      />

      {/* ============================================================ */}
      {/*  DELETE BLOCK CONFIRMATION                                   */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deleteBlockTarget}
        onClose={() => setDeleteBlockTarget(null)}
        onConfirm={handleDeleteBlock}
        title="Delete Section"
        message={`Are you sure you want to delete the "${deleteBlockTarget?.title || deleteBlockTarget?.type}" section? This action cannot be undone.`}
        confirmLabel="Delete Section"
        danger
        loading={deletingBlock}
      />
    </div>
  );
}
