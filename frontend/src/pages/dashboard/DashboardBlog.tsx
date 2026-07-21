import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FileText,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Copy,
  LayoutTemplate,
  Image,
  X,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import RichTextEditor from '@/components/dashboard/ui/RichTextEditor';
import MediaPicker from '@/components/dashboard/ui/MediaPicker';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Article {
  _id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  authorBio: string;
  status: string;
  faqs: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  authorBio: string;
  status: string;
  faqs: { question: string; answer: string }[];
}

interface BlogTemplate {
  id: string;
  label: string;
  description: string;
  formValues: Partial<ArticleForm>;
}

const EMPTY_FORM: ArticleForm = {
  title: '',
  slug: '',
  metaTitle: '',
  metaDescription: '',
  excerpt: '',
  content: '',
  category: 'General',
  date: '',
  readTime: '',
  image: '',
  author: '',
  authorRole: '',
  authorBio: '',
  status: 'draft',
  faqs: [],
};

const CATEGORIES = ['All', 'Cost Guides', 'Workspace', 'Retail', 'Turnkey', 'General'] as const;

const TEMPLATES_STORAGE_KEY = 'woodex-blog-templates';

/* ------------------------------------------------------------------ */
/*  Built-in templates                                                 */
/* ------------------------------------------------------------------ */

const BUILTIN_TEMPLATES: BlogTemplate[] = [
  {
    id: 'cost-guide',
    label: 'Cost Guide',
    description: 'Pricing and cost breakdown articles for interior design services.',
    formValues: {
      title: `Interior Design Cost in Lahore — ${new Date().getFullYear()} Guide`,
      category: 'Cost Guides',
      metaTitle: `Interior Design Cost in Lahore ${new Date().getFullYear()} | Woodex Interiors`,
      metaDescription: `Discover updated interior design costs in Lahore for ${new Date().getFullYear()}. Detailed pricing breakdowns for homes, offices, and commercial spaces.`,
      excerpt: `A comprehensive guide to interior design costs in Lahore for ${new Date().getFullYear()}, covering residential, commercial, and turnkey projects.`,
      content: `## Interior Design Cost in Lahore — ${new Date().getFullYear()} Guide\n\nPlanning an interior design project in Lahore? Understanding the costs involved helps you budget effectively and avoid surprises.\n\n### Factors That Affect Interior Design Cost\n\n- **Project size** — Total square footage directly impacts material and labour costs.\n- **Design complexity** — Custom millwork and bespoke features cost more than standard finishes.\n- **Material quality** — Premium imported materials vs locally sourced alternatives.\n- **Scope of work** — Full turnkey vs partial renovation.\n\n### Average Cost Ranges\n\n| Project Type | Budget Range (PKR) |\n|---|---|\n| 5 Marla Home | 800,000 – 2,500,000 |\n| 10 Marla Home | 1,500,000 – 5,000,000 |\n| 1 Kanal Home | 3,000,000 – 10,000,000 |\n| Office Space | 500,000 – 3,000,000 |\n\n### How to Get an Accurate Quote\n\n1. Schedule a consultation with a professional interior designer.\n2. Share your floor plan and design preferences.\n3. Request a detailed breakdown of costs.\n\n---\n\n*Contact Woodex Interiors for a free consultation and customized quote for your project.*`,
      faqs: [
        { question: 'How much does interior design cost in Lahore?', answer: 'Interior design costs in Lahore vary based on project size, material selection, and scope. A 5 marla home typically ranges from PKR 800,000 to 2,500,000.' },
        { question: 'What is included in a turnkey interior design package?', answer: 'A turnkey package includes design consultation, 3D renders, material sourcing,施工 (construction), furniture, fixtures, and final styling — everything from concept to move-in.' },
      ],
    },
  },
  {
    id: 'how-to-guide',
    label: 'How-To Guide',
    description: 'Step-by-step instructional content for design and renovation topics.',
    formValues: {
      title: 'How to {topic}',
      category: 'General',
      metaTitle: '',
      metaDescription: '',
      excerpt: '',
      content: `## How to {topic}\n\n### Introduction\n\nProvide context on why this topic matters to your audience.\n\n### Step 1: Getting Started\n\nDescribe the first step in detail.\n\n### Step 2: Planning\n\nDescribe the planning phase.\n\n### Step 3: Execution\n\nDescribe the execution phase.\n\n### Step 4: Final Touches\n\nDescribe finishing and reviewing the work.\n\n---\n\n### Conclusion\n\nSummarize the key takeaways and invite readers to contact Woodex Interiors for professional help.`,
      faqs: [],
    },
  },
  {
    id: 'industry-news',
    label: 'Industry News',
    description: 'News and trend articles about the interior design industry.',
    formValues: {
      title: '',
      category: 'General',
      metaTitle: '',
      metaDescription: '',
      excerpt: '',
      content: `## {Headline}\n\n**Published:** ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n### Overview\n\nSummarize the news or trend in 2-3 sentences.\n\n### Key Points\n\n- Point one\n- Point two\n- Point three\n\n### What This Means for Interior Design\n\nExplain the implications for homeowners and businesses.\n\n---\n\n*Stay updated with the latest interior design trends. Follow Woodex Interiors for expert insights.*`,
      faqs: [],
    },
  },
  {
    id: 'blank',
    label: 'Blank Post',
    description: 'Start with a clean slate — no pre-filled content.',
    formValues: {
      title: '',
      category: 'General',
      metaTitle: '',
      metaDescription: '',
      excerpt: '',
      content: '',
      faqs: [],
    },
  },
];

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

function formatDate(iso: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Strip markdown formatting for plain-text previews. */
function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/[-*]\s/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

/** Load custom templates from localStorage, merged with built-in ones. */
function loadTemplates(): BlogTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      const custom: BlogTemplate[] = JSON.parse(stored);
      return [...BUILTIN_TEMPLATES, ...custom];
    }
  } catch {
    // ignore malformed data
  }
  return [...BUILTIN_TEMPLATES];
}

/** Save custom templates to localStorage. */
function saveCustomTemplates(templates: BlogTemplate[]) {
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
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
/*  SEO Preview                                                        */
/* ------------------------------------------------------------------ */

function SeoPreview({ metaTitle, metaDescription, slug, title, excerpt }: {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  title: string;
  excerpt: string;
}) {
  const displayTitle = (metaTitle || title || 'Page Title').slice(0, 60);
  const description = (metaDescription || excerpt || 'No description provided.')
    .replace(/[#*_`]/g, '')
    .slice(0, 155);
  const displaySlug = slug || 'page-slug';

  return (
    <div className="bg-white p-4 mt-2 border border-[#e2e2e2]">
      <p className="text-[#1a0dab] text-base leading-snug truncate">
        {displayTitle || 'Page Title'}
      </p>
      <p className="text-[#006621] text-xs mt-0.5 truncate">
        woodexinteriors.com/insights/{displaySlug}
      </p>
      <p className="text-[#545454] text-xs mt-0.5 leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template Picker Modal                                              */
/* ------------------------------------------------------------------ */

function TemplatePicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (template: BlogTemplate) => void;
}) {
  const [templates, setTemplates] = useState<BlogTemplate[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  useEffect(() => {
    if (open) {
      setTemplates(loadTemplates());
      setShowCustomForm(false);
      setCustomName('');
      setCustomDesc('');
    }
  }, [open]);

  function handleSaveCurrentAsTemplate() {
    if (!customName.trim()) return;
    const newTemplate: BlogTemplate = {
      id: `custom-${Date.now()}`,
      label: customName.trim(),
      description: customDesc.trim() || 'Custom saved template',
      formValues: {}, // saved templates from localStorage store empty values; the user saves from context
    };
    const existing: BlogTemplate[] = JSON.parse(
      localStorage.getItem(TEMPLATES_STORAGE_KEY) || '[]'
    );
    existing.push(newTemplate);
    saveCustomTemplates(existing);
    setTemplates([...BUILTIN_TEMPLATES, ...existing]);
    setShowCustomForm(false);
    setCustomName('');
    setCustomDesc('');
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Choose a Template"
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
        >
          Cancel
        </button>
      }
    >
      <p className="text-sm text-[#8A8073] font-light mb-5">
        Pick a template to pre-fill your new post, or start blank.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              onSelect(t);
              onClose();
            }}
            className="group text-left p-4 border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.03)] hover:bg-[rgba(201,168,76,0.06)] transition-all"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <LayoutTemplate size={14} className="text-[#C9A84C] shrink-0" />
              <span className="font-display text-sm text-white group-hover:text-[#C9A84C] transition-colors">
                {t.label}
              </span>
            </div>
            <p className="text-[0.65rem] text-[#8A8073] font-light leading-relaxed">
              {t.description}
            </p>
          </button>
        ))}
      </div>

      {/* Save as custom template */}
      <div className="mt-5 pt-4 border-t border-[rgba(201,168,76,0.12)]">
        {!showCustomForm ? (
          <button
            onClick={() => setShowCustomForm(true)}
            className="text-[0.6rem] tracking-[0.18em] uppercase text-[#C9A84C] hover:text-[#D4C5A9] transition-colors inline-flex items-center gap-1.5"
          >
            <Plus size={12} />
            Save Current as Template
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Template name"
              className="input-lux w-full"
              autoFocus
            />
            <input
              type="text"
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder="Short description (optional)"
              className="input-lux w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveCurrentAsTemplate}
                disabled={!customName.trim()}
                className="btn-lux btn-gold text-[0.6rem] py-2 px-4 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setShowCustomForm(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardBlog() {
  /* ---- data state ---- */
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---- filter ---- */
  const [activeCategory, setActiveCategory] = useState<string>('All');

  /* ---- modal / form state ---- */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  /* ---- template picker ---- */
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  /* ---- media picker ---- */
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'image' | null>(null);

  /* ---- delete state ---- */
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Data fetching                                                    */
  /* ---------------------------------------------------------------- */

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ articles: Article[] }>('/admin/articles');
      setArticles(res.articles || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------------------------------------------------------- */
  /*  Filtered articles                                                */
  /* ---------------------------------------------------------------- */

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  /* ---------------------------------------------------------------- */
  /*  Word count & read time from content                              */
  /* ---------------------------------------------------------------- */

  const contentStats = useMemo(() => {
    const words = form.content.trim()
      ? form.content.trim().split(/\s+/).length
      : 0;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, readMin };
  }, [form.content]);

  /* ---------------------------------------------------------------- */
  /*  Open helpers                                                     */
  /* ---------------------------------------------------------------- */

  function openCreate() {
    setTemplatePickerOpen(true);
  }

  function openCreateWithTemplate(template: BlogTemplate) {
    const year = new Date().getFullYear();
    const resolved: Partial<ArticleForm> = {};
    for (const [k, v] of Object.entries(template.formValues)) {
      if (typeof v === 'string') {
        (resolved as Record<string, string>)[k] = (v as string)
          .replace('{year}', String(year))
          .replace('{topic}', 'Design Your Space')
          .replace('{Headline}', 'Latest Design Trends');
      } else {
        (resolved as Record<string, unknown>)[k] = v;
      }
    }

    setEditing(null);
    setForm({ ...EMPTY_FORM, ...resolved });
    setSlugManuallyEdited(false);
    setModalOpen(true);
  }

  function openEdit(article: Article) {
    setEditing(article);
    setForm({
      title: article.title || '',
      slug: article.slug || '',
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'General',
      date: article.date ? article.date.substring(0, 10) : '',
      readTime: article.readTime || '',
      image: article.image || '',
      author: article.author || '',
      authorRole: article.authorRole || '',
      authorBio: article.authorBio || '',
      status: article.status || 'draft',
      faqs: article.faqs || [],
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

  function handleFieldChange(field: keyof ArticleForm, value: string | { question: string; answer: string }[]) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManuallyEdited && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  }

  /* ---------------------------------------------------------------- */
  /*  FAQ handlers                                                     */
  /* ---------------------------------------------------------------- */

  function addFaq() {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  }

  function updateFaq(index: number, field: 'question' | 'answer', value: string) {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  }

  function removeFaq(index: number) {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }

  /* ---------------------------------------------------------------- */
  /*  Media picker handler                                             */
  /* ---------------------------------------------------------------- */

  function handleMediaSelect(url: string) {
    if (mediaPickerTarget === 'image') {
      handleFieldChange('image', url);
    }
    setMediaPickerTarget(null);
  }

  /* ---------------------------------------------------------------- */
  /*  Save (Create / Update)                                           */
  /* ---------------------------------------------------------------- */

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title.trim()),
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category.trim(),
        date: form.date || new Date().toISOString(),
        readTime: `${contentStats.readMin} min read`,
        image: form.image.trim(),
        author: form.author.trim(),
        authorRole: form.authorRole.trim(),
        authorBio: form.authorBio.trim(),
        status: form.status,
        faqs: form.faqs.filter(
          (faq) => faq.question.trim() || faq.answer.trim()
        ),
      };

      if (editing) {
        /* ---- UPDATE ---- */
        await adminFetch(`/admin/articles/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToast({ type: 'success', message: 'Article updated successfully.' });
      } else {
        /* ---- CREATE ---- */
        await adminFetch('/admin/articles', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToast({ type: 'success', message: 'Article created successfully.' });
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
  /*  Duplicate                                                        */
  /* ---------------------------------------------------------------- */

  async function handleDuplicate(article: Article) {
    try {
      await adminFetch('/admin/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: `${article.title} (Copy)`,
          slug: `${article.slug}-copy`,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          date: new Date().toISOString(),
          readTime: article.readTime,
          image: article.image,
          author: article.author,
          authorRole: article.authorRole,
          authorBio: article.authorBio,
          status: 'draft',
          faqs: article.faqs || [],
        }),
      });
      setToast({ type: 'success', message: `"${article.title}" duplicated as draft.` });
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Duplicate failed';
      setToast({ type: 'error', message: msg });
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Delete                                                           */
  /* ---------------------------------------------------------------- */

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await adminFetch(`/admin/articles/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      setToast({ type: 'success', message: `"${deleteTarget.title}" deleted.` });
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
          <h1 className="font-display text-3xl text-white">Blog Posts</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Articles & content
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
            New Post
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

      {/* ---- Category Filter ---- */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Filter size={14} className="text-[#8A8073] mr-1" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[0.55rem] tracking-[0.18em] uppercase font-semibold px-4 py-2 transition-colors ${
              activeCategory === cat
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-[#D4C5A9] hover:bg-[rgba(201,168,76,0.15)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---- Content ---- */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <FileText size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">
            {activeCategory === 'All' ? 'No articles yet' : `No articles in "${activeCategory}"`}
          </p>
          <button
            onClick={openCreate}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Create your first post
          </button>
        </div>
      ) : (
        <>
          {/* ---- Table ---- */}
          <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_140px_120px_120px_100px_180px] gap-4 px-5 py-3 border-b border-[rgba(201,168,76,0.15)]">
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold">
                Title
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold">
                Category
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold">
                Author
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold">
                Date
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold">
                Status
              </span>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold text-right">
                Actions
              </span>
            </div>

            {/* Table rows */}
            {filtered.map((article) => (
              <div
                key={article._id}
                className="grid grid-cols-[1fr_140px_120px_120px_100px_180px] gap-4 px-5 py-4 items-center border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.03)] transition-colors"
              >
                {/* Title + excerpt */}
                <div className="min-w-0">
                  <p className="font-display text-sm text-white truncate leading-snug">
                    {article.title}
                  </p>
                  {article.excerpt && (
                    <p className="text-xs text-[#8A8073] font-light truncate mt-1">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                {/* Category */}
                <span className="text-xs text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-2 py-1 self-start truncate">
                  {article.category || '---'}
                </span>

                {/* Author */}
                <span className="text-xs text-[#D4C5A9] font-light truncate">
                  {article.author || '---'}
                </span>

                {/* Date */}
                <span className="text-xs text-[#D4C5A9] font-light truncate">
                  {formatDate(article.date || article.createdAt)}
                </span>

                {/* Status */}
                <StatusBadge status={article.status || 'draft'} />

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(article)}
                    className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(article)}
                    title="Duplicate as draft"
                    className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-3 py-2 bg-[rgba(201,168,76,0.08)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.18)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Copy size={11} />
                    Copy
                  </button>
                  <button
                    onClick={() => setDeleteTarget(article)}
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
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` in "${activeCategory}"`}
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
        title={editing ? 'Edit Article' : 'New Article'}
        size="lg"
        footer={
          <>
            <span className="text-[0.55rem] text-[#8A8073] mr-auto hidden sm:inline">
              {contentStats.words} words &middot; {contentStats.readMin} min read
            </span>
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
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Article'}
            </button>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-x-6">
          {/* Title (required) */}
          <div className="md:col-span-2">
            <AdminFormField label="Title" htmlFor="art-title" required>
              <input
                id="art-title"
                type="text"
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. How Much Does Interior Design Cost?"
                className="input-lux w-full"
              />
            </AdminFormField>
          </div>

          {/* Slug */}
          <AdminFormField label="Slug" htmlFor="art-slug" hint="Auto-generated from title. Edit to override.">
            <input
              id="art-slug"
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="how-much-does-interior-design-cost"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Category */}
          <AdminFormField label="Category" htmlFor="art-category">
            <select
              id="art-category"
              value={form.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="input-lux w-full"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </AdminFormField>

          {/* Excerpt */}
          <div className="md:col-span-2">
            <AdminFormField label="Excerpt" htmlFor="art-excerpt">
              <input
                id="art-excerpt"
                type="text"
                value={form.excerpt}
                onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                placeholder="Brief summary of the article"
                className="input-lux w-full"
              />
            </AdminFormField>
          </div>

          {/* Content — RichTextEditor */}
          <div className="md:col-span-2">
            <RichTextEditor
              value={form.content}
              onChange={(v) => handleFieldChange('content', v)}
              rows={12}
              label="Content"
            />
          </div>

          {/* Author */}
          <AdminFormField label="Author" htmlFor="art-author">
            <input
              id="art-author"
              type="text"
              value={form.author}
              onChange={(e) => handleFieldChange('author', e.target.value)}
              placeholder="e.g. John Doe"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Author Role */}
          <AdminFormField label="Author Role" htmlFor="art-authorRole">
            <input
              id="art-authorRole"
              type="text"
              value={form.authorRole}
              onChange={(e) => handleFieldChange('authorRole', e.target.value)}
              placeholder="e.g. Lead Designer"
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Image URL with MediaPicker */}
          <AdminFormField label="Image URL" htmlFor="art-image" hint="Featured image for the article.">
            <div className="flex gap-2">
              <input
                id="art-image"
                type="text"
                value={form.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-lux flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setMediaPickerTarget('image');
                  setMediaPickerOpen(true);
                }}
                className="btn-lux btn-outline text-[0.55rem] py-2 px-3 shrink-0 inline-flex items-center gap-1.5"
              >
                <Image size={11} />
                Library
              </button>
            </div>
          </AdminFormField>

          {/* Read Time — auto-calculated */}
          <AdminFormField label="Read Time" htmlFor="art-readTime" hint="Automatically estimated from content word count.">
            <input
              id="art-readTime"
              type="text"
              value={`${contentStats.readMin} min read`}
              readOnly
              className="input-lux w-full bg-[rgba(201,168,76,0.03)] cursor-not-allowed"
            />
          </AdminFormField>

          {/* Date */}
          <AdminFormField label="Date" htmlFor="art-date" hint="Publication date. Defaults to today.">
            <input
              id="art-date"
              type="date"
              value={form.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="input-lux w-full"
            />
          </AdminFormField>

          {/* Status */}
          <AdminFormField label="Status" htmlFor="art-status">
            <select
              id="art-status"
              value={form.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="input-lux w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </AdminFormField>

          {/* ---- SEO Section ---- */}
          <div className="md:col-span-2 mt-2">
            <div className="border-t border-[rgba(201,168,76,0.12)] pt-5">
              <h3 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                SEO Settings
              </h3>
            </div>
          </div>

          {/* Meta Title */}
          <div className="md:col-span-2">
            <AdminFormField label="Meta Title" htmlFor="art-metaTitle" hint="SEO title tag. Falls back to Title if empty.">
              <input
                id="art-metaTitle"
                type="text"
                value={form.metaTitle}
                onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                placeholder="SEO optimized page title"
                className="input-lux w-full"
              />
            </AdminFormField>
          </div>

          {/* Meta Description */}
          <div className="md:col-span-2">
            <AdminFormField label="Meta Description" htmlFor="art-metaDesc" hint="SEO meta description for search results.">
              <textarea
                id="art-metaDesc"
                value={form.metaDescription}
                onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                placeholder="Brief SEO description (150-160 chars recommended)"
                rows={2}
                className="input-lux w-full resize-y"
              />
            </AdminFormField>
          </div>

          {/* SEO Preview */}
          <div className="md:col-span-2">
            <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] font-semibold mb-2">
              Google SERP Preview
            </p>
            <SeoPreview
              metaTitle={form.metaTitle}
              metaDescription={form.metaDescription}
              slug={form.slug}
              title={form.title}
              excerpt={form.excerpt}
            />
          </div>

          {/* Author Bio */}
          <div className="md:col-span-2">
            <AdminFormField label="Author Bio" htmlFor="art-authorBio">
              <textarea
                id="art-authorBio"
                value={form.authorBio}
                onChange={(e) => handleFieldChange('authorBio', e.target.value)}
                placeholder="Short author biography"
                rows={2}
                className="input-lux w-full resize-y"
              />
            </AdminFormField>
          </div>

          {/* ---- FAQ Section ---- */}
          <div className="md:col-span-2 mt-2">
            <div className="border-t border-[rgba(201,168,76,0.12)] pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">
                  FAQs ({form.faqs.length})
                </h3>
                <button
                  type="button"
                  onClick={addFaq}
                  className="btn-lux btn-outline text-[0.55rem] py-1.5 px-3 inline-flex items-center gap-1.5"
                >
                  <Plus size={11} />
                  Add FAQ
                </button>
              </div>

              {form.faqs.length === 0 && (
                <p className="text-[0.65rem] text-[#6B6355] font-light mb-4">
                  No FAQs added yet. Click "Add FAQ" to create question-answer pairs.
                </p>
              )}

              <div className="space-y-4">
                {form.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.02)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A8073] font-semibold">
                        FAQ #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="text-[#DC2626] hover:text-[#EF4444] transition-colors p-0.5"
                        title="Remove FAQ"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                      placeholder="Question"
                      className="input-lux w-full mb-2"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                      placeholder="Answer"
                      rows={2}
                      className="input-lux w-full resize-y"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  Template Picker                                             */}
      {/* ============================================================ */}
      <TemplatePicker
        open={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onSelect={(t) => openCreateWithTemplate(t)}
      />

      {/* ============================================================ */}
      {/*  Media Picker                                                */}
      {/* ============================================================ */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerTarget(null);
        }}
        onSelect={handleMediaSelect}
      />

      {/* ============================================================ */}
      {/*  Delete Confirmation                                         */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
