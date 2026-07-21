// Pages Admin — full CRUD for site pages with hide/show blocks

import { useState } from "react";
import {
  PageHeader,
  Button,
  Modal,
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  EmptyState,
} from "./AdminLayout";
import { usePageBuilder, type Page, type SectionBlock } from "../../lib/pageBuilderStore";
import {
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconCheck,
  IconDownload,
  IconUpload,
  IconEye,
  IconEyeOff,
  IconCopy,
} from "../Icons";
import { cn } from "../../utils/cn";

export function PagesAdmin() {
  const api = usePageBuilder();
  const { pages, templates, activePageId, setActivePageId } = api;
  const [editing, setEditing] = useState<Page | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<SectionBlock | null>(null);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const sortedBlocks = activePage ? [...activePage.blocks].sort((a, b) => a.order - b.order) : [];

  const handleSavePage = (data: Partial<Page>) => {
    if (editing) {
      api.updatePage(editing.id, data);
    } else {
      api.createPage(data as { title: string });
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleSaveBlock = (data: Partial<SectionBlock>) => {
    if (editingBlock && activePage) {
      api.updateBlock(activePage.id, editingBlock.id, data);
    } else if (activePage && data.type) {
      api.addBlock(activePage.id, {
        type: data.type,
        title: data.title || "New Block",
        visible: true,
        order: 0,
        props: data.props || {},
        styles: data.styles || {},
        visibility: data.visibility,
      });
    }
    setShowBlockForm(false);
    setEditingBlock(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages & Sections"
        description="Manage all pages and the section blocks within them. Drag to reorder, click the eye to hide, click the gear to edit."
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowImportExport(true)}>
              <IconDownload className="w-3.5 h-3.5" />
              Import / Export
            </Button>
            <Button onClick={() => { setEditing(null); setShowForm(true); }}>
              <IconPlus className="w-3.5 h-3.5" />
              New Page
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Page list */}
        <aside className="lg:col-span-3">
          <div className="card p-3">
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <h3 className="text-[10px] uppercase tracking-widest text-text-gray font-bold">Pages</h3>
              <span className="text-[10px] text-text-gray">{pages.length}</span>
            </div>
            <div className="space-y-1">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageId(p.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg flex items-center gap-2 transition-all",
                    activePageId === p.id ? "bg-gold/10 border border-gold/30" : "hover:bg-cream-50 border border-transparent"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-heading truncate">{p.title}</span>
                      {p.isHome && <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-bold">HOME</span>}
                    </div>
                    <div className="text-[10px] text-text-gray font-mono truncate">/{p.slug}</div>
                  </div>
                  {!p.isPublished && <span className="text-amber-500 text-xs" title="Draft">●</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          {activePage && sortedBlocks.length === 0 && (
            <div className="card p-4 mt-4">
              <h4 className="font-serif text-base text-heading mb-2">Empty page?</h4>
              <p className="text-xs text-text-gray mb-3">Start with a template to save time.</p>
              <div className="space-y-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (confirm(`Apply "${t.name}" template? This will add ${t.blocks.length} section blocks.`)) {
                        t.blocks.forEach((b) => {
                          api.addBlock(activePage.id, { ...b, visible: true, order: 0 });
                        });
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-md bg-cream-50 hover:bg-gold/10 border border-border hover:border-gold transition-colors"
                  >
                    <div className="text-sm font-medium text-heading">{t.name}</div>
                    <div className="text-[10px] text-text-gray">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Page content editor */}
        <div className="lg:col-span-9 space-y-4">
          {activePage ? (
            <>
              {/* Page header */}
              <div className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="font-serif text-2xl text-heading">{activePage.title}</h2>
                      {activePage.isHome && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold/20 text-gold font-bold uppercase tracking-widest">
                          Home page
                        </span>
                      )}
                      {!activePage.isPublished && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold uppercase tracking-widest">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-gray">/{activePage.slug}</p>
                    <p className="text-xs text-text-gray mt-2">
                      Last updated {new Date(activePage.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(activePage); setShowForm(true); }}>
                      Edit Page
                    </Button>
                    {!activePage.isHome && (
                      <Button size="sm" variant="ghost" onClick={() => api.duplicatePage(activePage.id)}>
                        <IconCopy className="w-3.5 h-3.5" />
                        Duplicate
                      </Button>
                    )}
                    {!activePage.isHome && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (confirm(`Delete page "${activePage.title}"?`)) {
                            api.deletePage(activePage.id);
                            setActivePageId(pages.find((p) => p.isHome)?.id || pages[0]?.id);
                          }
                        }}
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                {activePage.meta && (
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-text-gray font-bold">SEO Title</div>
                      <div className="text-heading mt-1">{activePage.meta.title}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-text-gray font-bold">SEO Description</div>
                      <div className="text-heading mt-1 line-clamp-2">{activePage.meta.description}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Block list */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-heading flex items-center gap-2">
                    Section Blocks
                    <span className="text-xs font-sans text-text-gray">({sortedBlocks.length})</span>
                  </h3>
                  <Button size="sm" onClick={() => { setEditingBlock(null); setShowBlockForm(true); }}>
                    <IconPlus className="w-3.5 h-3.5" />
                    Add Section
                  </Button>
                </div>

                {sortedBlocks.length === 0 ? (
                  <EmptyState
                    title="No sections yet"
                    message="Add your first section block to start building this page."
                    action={
                      <Button onClick={() => { setEditingBlock(null); setShowBlockForm(true); }}>
                        <IconPlus className="w-3.5 h-3.5" />
                        Add Section
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {sortedBlocks.map((block, idx) => (
                      <BlockItem
                        key={block.id}
                        block={block}
                        index={idx}
                        total={sortedBlocks.length}
                        onToggleVisibility={() => api.toggleBlockVisibility(activePage.id, block.id)}
                        onMoveUp={() => api.moveBlockUp(activePage.id, block.id)}
                        onMoveDown={() => api.moveBlockDown(activePage.id, block.id)}
                        onEdit={() => { setEditingBlock(block); setShowBlockForm(true); }}
                        onDuplicate={() => api.duplicateBlock(activePage.id, block.id)}
                        onDelete={() => {
                          if (confirm(`Delete "${block.title}"?`)) api.deleteBlock(activePage.id, block.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState title="No page selected" message="Select a page from the sidebar." />
          )}
        </div>
      </div>

      {/* Page form modal */}
      {showForm && (
        <PageForm
          page={editing}
          templates={templates}
          onSave={handleSavePage}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Block form modal */}
      {showBlockForm && (
        <BlockForm
          block={editingBlock}
          onSave={handleSaveBlock}
          onClose={() => { setShowBlockForm(false); setEditingBlock(null); }}
        />
      )}

      {/* Import/Export modal */}
      {showImportExport && (
        <ImportExportModal
          api={api}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </div>
  );
}

function BlockItem({
  block,
  index,
  total,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  block: SectionBlock;
  index: number;
  total: number;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 flex items-center gap-3 transition-all",
        block.visible
          ? "bg-white border-border hover:border-gold/50"
          : "bg-stone-50 border-stone-200 opacity-60"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IconArrowUp className="w-3 h-3" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IconArrowDown className="w-3 h-3" />
        </button>
      </div>

      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center text-lg flex-shrink-0">
        {BLOCK_ICONS[block.type] || "📦"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-heading truncate">{block.title}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-text-gray uppercase tracking-widest font-bold">
            {block.type}
          </span>
          {!block.visible && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase tracking-widest font-bold">
              Hidden
            </span>
          )}
        </div>
        <div className="text-[10px] text-text-gray mt-0.5">
          Order: {index + 1} / {total} · ID: {block.id}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleVisibility}
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
            block.visible
              ? "text-emerald-600 hover:bg-emerald-50"
              : "text-text-gray hover:bg-stone-100"
          )}
          title={block.visible ? "Hide section" : "Show section"}
        >
          {block.visible ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-espresso transition-colors"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={onDuplicate}
          className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-espresso transition-colors"
          title="Duplicate"
        >
          <IconCopy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <IconTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

const BLOCK_ICONS: Record<string, string> = {
  hero: "🎯",
  text: "📝",
  image: "🖼️",
  features: "⭐",
  testimonials: "💬",
  stats: "📊",
  cta: "📣",
  gallery: "🖼️",
  faq: "❓",
  logos: "🏢",
  pricing: "💎",
  "contact-form": "✉️",
  video: "🎬",
  spacer: "➖",
  "custom-html": "🧩",
};

const BLOCK_TYPES = [
  { value: "hero", label: "Hero Section", desc: "Large banner with heading and CTA" },
  { value: "text", label: "Text Block", desc: "Heading + paragraph text" },
  { value: "image", label: "Image", desc: "Single image with optional caption" },
  { value: "features", label: "Features Grid", desc: "Grid of feature cards" },
  { value: "testimonials", label: "Testimonials", desc: "Client reviews slider" },
  { value: "stats", label: "Stats Counter", desc: "Animated number stats" },
  { value: "cta", label: "Call to Action", desc: "Conversion section" },
  { value: "gallery", label: "Image Gallery", desc: "Grid of images" },
  { value: "faq", label: "FAQ", desc: "Expandable questions" },
  { value: "logos", label: "Client Logos", desc: "Trust badges / logos" },
  { value: "pricing", label: "Pricing Table", desc: "Tier comparison" },
  { value: "contact-form", label: "Contact Form", desc: "Lead capture form" },
  { value: "video", label: "Video", desc: "Video player" },
  { value: "spacer", label: "Spacer", desc: "Empty vertical space" },
  { value: "custom-html", label: "Custom HTML", desc: "Custom code block" },
];

function PageForm({
  page,
  onSave,
  onClose,
}: {
  page: Page | null;
  templates?: { id: string; name: string; description: string }[];
  onSave: (p: Partial<Page>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    description: page?.description || "",
    isPublished: page?.isPublished !== false,
    meta: {
      title: page?.meta.title || "",
      description: page?.meta.description || "",
    },
  });

  return (
    <Modal open onClose={onClose} title={page ? "Edit Page" : "New Page"} size="lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...form,
            slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          });
        }}
        className="space-y-4"
      >
        <FormField label="Page Title" required>
          <TextInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Landing Page" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="URL Slug" hint="Lowercase, hyphens only">
            <TextInput
              value={form.slug}
              onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              placeholder="my-page"
            />
          </FormField>
          <FormField label="Status">
            <SelectInput
              value={form.isPublished ? "published" : "draft"}
              onChange={(v) => setForm({ ...form, isPublished: v === "published" })}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </FormField>
        </div>
        <FormField label="Description" hint="Internal note about the page purpose.">
          <TextareaInput value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border">
          <FormField label="SEO Title" hint="50-60 characters">
            <TextInput value={form.meta.title} onChange={(v) => setForm({ ...form, meta: { ...form.meta, title: v } })} />
          </FormField>
          <FormField label="SEO Description" hint="150-160 characters">
            <TextareaInput
              value={form.meta.description}
              onChange={(v) => setForm({ ...form, meta: { ...form.meta, description: v } })}
              rows={2}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {page ? "Save Changes" : "Create Page"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function BlockForm({
  block,
  onSave,
  onClose,
}: {
  block: SectionBlock | null;
  onSave: (b: Partial<SectionBlock>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<SectionBlock>>({
    type: block?.type || "text",
    title: block?.title || "",
    visible: block?.visible !== false,
    props: block?.props || {},
    styles: block?.styles || {},
  });
  void block;

  return (
    <Modal open onClose={onClose} title={block ? "Edit Section" : "Add Section"} size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <FormField label="Section Type" required>
          <SelectInput
            value={form.type || "text"}
            onChange={(v) => setForm({ ...form, type: v as SectionBlock["type"] })}
            options={BLOCK_TYPES.map((t) => ({ value: t.value, label: `${t.label} — ${t.desc}` }))}
          />
        </FormField>
        <FormField label="Section Title" required hint="Internal name (not shown on the site)">
          <TextInput value={form.title || ""} onChange={(v) => setForm({ ...form, title: v })} placeholder="Hero Section" />
        </FormField>
        <FormField label="Visibility">
          <SelectInput
            value={form.visible !== false ? "visible" : "hidden"}
            onChange={(v) => setForm({ ...form, visible: v === "visible" })}
            options={[
              { value: "visible", label: "Visible on site" },
              { value: "hidden", label: "Hidden (only admins can preview)" },
            ]}
          />
        </FormField>
        <div className="border-t border-border pt-4">
          <h4 className="font-serif text-base text-heading mb-3">Styling</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Background Color">
              <input
                type="color"
                value={form.styles?.backgroundColor || "#ffffff"}
                onChange={(e) => setForm({ ...form, styles: { ...form.styles, backgroundColor: e.target.value } })}
                className="w-full h-10 rounded border border-border"
              />
            </FormField>
            <FormField label="Text Color">
              <input
                type="color"
                value={form.styles?.textColor || "#211C18"}
                onChange={(e) => setForm({ ...form, styles: { ...form.styles, textColor: e.target.value } })}
                className="w-full h-10 rounded border border-border"
              />
            </FormField>
          </div>
          <FormField label="Padding" hint="e.g. 60px 20px or 4rem 0">
            <TextInput
              value={form.styles?.padding || ""}
              onChange={(v) => setForm({ ...form, styles: { ...form.styles, padding: v } })}
              placeholder="60px 20px"
            />
          </FormField>
          <FormField label="Text Alignment">
            <SelectInput
              value={form.styles?.textAlign || "left"}
              onChange={(v) => setForm({ ...form, styles: { ...form.styles, textAlign: v as "left" | "center" | "right" } })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {block ? "Save Section" : "Add Section"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ImportExportModal({ api, onClose }: { api: ReturnType<typeof usePageBuilder>; onClose: () => void }) {
  const [importText, setImportText] = useState("");

  return (
    <Modal open onClose={onClose} title="Import / Export Pages" size="md">
      <div className="space-y-4">
        <div>
          <h4 className="font-serif text-base text-heading mb-2">Export</h4>
          <p className="text-xs text-text-gray mb-3">Download a JSON backup of all your pages and templates.</p>
          <Button
            variant="primary"
            onClick={() => {
              const data = api.exportAll();
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `wp-pages-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <IconDownload className="w-3.5 h-3.5" />
            Download Pages JSON
          </Button>
        </div>
        <div className="pt-4 border-t border-border">
          <h4 className="font-serif text-base text-heading mb-2">Import</h4>
          <p className="text-xs text-text-gray mb-3">Paste exported JSON below to restore pages and templates.</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"pages": [...], "templates": [...]}'
            rows={5}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          <div className="mt-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (confirm("This will replace all current pages. Continue?")) {
                  api.importAll(importText);
                  setImportText("");
                  onClose();
                }
              }}
            >
              <IconUpload className="w-3.5 h-3.5" />
              Import JSON
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
