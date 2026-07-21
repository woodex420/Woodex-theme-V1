// Projects Admin - Full CRUD with image gallery and project details

import { useState, useMemo, useRef } from "react";
import { RichTextEditor } from "../RichTextEditor";
import {
  PageHeader,
  Button,
  Modal,
  FormField,
  TextInput,
  SelectInput,
  EmptyState,
  StatusBadge,
} from "./AdminLayout";
import { useContentStore, type Project } from "../../lib/contentStore";
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconUpload,
  IconArrowRight,
  IconArrowUp,
  IconArrowDown,
  IconCopy,
  IconEye,
} from "../Icons";
import { cn } from "../../utils/cn";

export function ProjectsAdmin() {
  const { addProject, updateProject, deleteProject } = useContentStore();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Project | null>(null);
  const [showGallery, setShowGallery] = useState<Project | null>(null);

  const { store } = useContentStore();
  const filtered = useMemo(() => {
    return store.projects.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (search && !`${p.title} ${p.client} ${p.location}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [store.projects, filter, search]);

  const handleSave = (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (editing && editing.id) {
      updateProject(editing.id, data);
    } else {
      addProject(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio with full image galleries and project details."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New Project
          </Button>
        }
      />

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <div className="flex gap-1">
          {["all", "published", "draft", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-widest rounded-md",
                filter === f ? "bg-espresso text-white" : "bg-cream-50 text-text-gray hover:bg-gold/10"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <EmptyState title="No projects" message="Create your first project." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() => { setEditing(p); setShowForm(true); }}
              onView={() => setViewing(p)}
              onGallery={() => setShowGallery(p)}
              onDuplicate={() => {
                addProject({
                  title: `${p.title} (Copy)`,
                  category: p.category,
                  categorySlug: p.categorySlug,
                  client: p.client,
                  location: p.location,
                  year: p.year,
                  image: p.image,
                  description: p.description,
                  status: "draft",
                });
              }}
              onDelete={() => { if (confirm(`Delete "${p.title}"?`)) deleteProject(p.id); }}
            />
          ))}
        </div>
      )}

      {/* Project form modal */}
      {showForm && (
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* View modal */}
      {viewing && <ProjectView project={viewing} onClose={() => setViewing(null)} />}

      {/* Gallery modal */}
      {showGallery && <ProjectGallery project={showGallery} onClose={() => setShowGallery(null)} />}
    </div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onView,
  onGallery,
  onDuplicate,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onView: () => void;
  onGallery: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="card overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-50">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <StatusBadge status={project.status} />
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-gold text-espresso">
            {project.category}
          </span>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onView}
            className="w-10 h-10 rounded-full bg-white/95 hover:bg-gold text-espresso flex items-center justify-center transition-colors"
            title="View details"
          >
            <IconEye className="w-4 h-4" />
          </button>
          <button
            onClick={onGallery}
            className="w-10 h-10 rounded-full bg-white/95 hover:bg-gold text-espresso flex items-center justify-center transition-colors"
            title="Manage gallery"
          >
            <IconUpload className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-full bg-white/95 hover:bg-gold text-espresso flex items-center justify-center transition-colors"
            title="Edit"
          >
            ✏️
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-heading line-clamp-1">{project.title}</h3>
        <p className="text-xs text-text-gray mt-1">{project.client} · {project.location}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-[10px] text-text-gray">{project.year}</span>
          <div className="flex gap-1">
            <button onClick={onDuplicate} className="w-7 h-7 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center" title="Duplicate">
              <IconCopy className="w-3 h-3" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 rounded hover:bg-red-50 text-text-gray hover:text-red-600 flex items-center justify-center" title="Delete">
              <IconTrash className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectForm({ project, onSave, onClose }: { project: Project | null; onSave: (p: Omit<Project, "id" | "createdAt" | "updatedAt">) => void; onClose: () => void }) {
  const { addMedia } = useContentStore();
  const [form, setForm] = useState<Omit<Project, "id" | "createdAt" | "updatedAt">>({
    title: project?.title || "",
    category: project?.category || "Residential",
    categorySlug: project?.categorySlug || "residential",
    client: project?.client || "",
    location: project?.location || "",
    year: project?.year || new Date().getFullYear().toString(),
    image: project?.image || "",
    description: project?.description || "",
    status: project?.status || "draft",
  });
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    addMedia({ url: dataUrl, name: file.name, size: file.size, type: file.type });
    setForm({ ...form, image: dataUrl });
  };

  return (
    <>
      <Modal open onClose={onClose} title={project ? "Edit Project" : "New Project"} size="lg">
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="space-y-4"
        >
          <FormField label="Project Title" required>
            <TextInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <SelectInput
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v, categorySlug: v.toLowerCase() })}
                options={[
                  { value: "Residential", label: "Residential" },
                  { value: "Commercial", label: "Commercial" },
                  { value: "Hospitality", label: "Hospitality" },
                  { value: "3D", label: "3D Visualization" },
                ]}
              />
            </FormField>
            <FormField label="Status">
              <SelectInput
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v as "draft" | "published" | "archived" })}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Client">
              <TextInput value={form.client} onChange={(v) => setForm({ ...form, client: v })} />
            </FormField>
            <FormField label="Location">
              <TextInput value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Year">
              <TextInput value={form.year} onChange={(v) => setForm({ ...form, year: v })} />
            </FormField>
            <FormField label="Main Image" hint="Click to upload or select from library">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Image URL or upload below"
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-md bg-cream-50 border border-border text-text-gray hover:border-gold"
                  title="Upload"
                >
                  <IconUpload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="px-3 py-2 rounded-md bg-cream-50 border border-border text-text-gray hover:border-gold text-xs"
                >
                  Library
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </div>
            </FormField>
          </div>
          {form.image && (
            <div className="border border-border rounded-lg p-2">
              <img src={form.image} alt={form.title} className="w-full h-48 object-cover rounded-md" />
            </div>
          )}
          <FormField label="Description" hint="Shown on the project detail page. Use the toolbar for formatting, links, and images.">
            <RichTextEditor value={form.description || ""} onChange={(v) => setForm({ ...form, description: v })} rows={6} />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
            <Button type="submit" variant="primary">
              <IconCheck className="w-3.5 h-3.5" />
              {project ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => { setForm({ ...form, image: url }); setShowMediaPicker(false); }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}

function MediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const { store, addMedia, deleteMedia } = useContentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    addMedia({ url: dataUrl, name: file.name, size: file.size, type: file.type });
  };

  return (
    <Modal open onClose={onClose} title="Select Image" size="lg">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
          >
            <IconUpload className="w-3.5 h-3.5" />
            Upload New
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
          {store.media.map((m) => (
            <div key={m.id} className="group relative cursor-pointer">
              <button
                type="button"
                onClick={() => onSelect(m.url)}
                className="w-full aspect-square rounded overflow-hidden border-2 border-transparent hover:border-gold"
              >
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => { if (confirm(`Delete ${m.name}?`)) deleteMedia(m.id); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <IconTrash className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ProjectView({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title={project.title} size="lg">
      <div className="space-y-5">
        <div className="aspect-[16/9] rounded-lg overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Client</div>
            <div className="text-sm text-heading">{project.client}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Location</div>
            <div className="text-sm text-heading">{project.location}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Year</div>
            <div className="text-sm text-heading">{project.year}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Category</div>
            <div className="text-sm text-heading">{project.category}</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-2">Description</div>
          <p className="text-sm text-heading leading-relaxed">{project.description || "No description provided."}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <StatusBadge status={project.status} />
          <a
            href={`#/${project.categorySlug === "residential" ? "portfolio" : "portfolio"}`}
            className="text-xs text-gold font-semibold uppercase tracking-widest flex items-center gap-1"
          >
            View on Site
            <IconArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
}

function ProjectGallery({ project, onClose }: { project: Project; onClose: () => void }) {
  const STORAGE_KEY = `wp-project-gallery-${project.id}`;
  const [images, setImages] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [project.image];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveImages = (newImages: string[]) => {
    setImages(newImages);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
    } catch {
      // ignore
    }
  };

  const handleUpload = async (files: FileList) => {
    const newImages = [...images];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      newImages.push(dataUrl);
    }
    saveImages(newImages);
  };

  const moveImage = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImages = [...images];
    [newImages[idx], newImages[newIdx]] = [newImages[newIdx], newImages[idx]];
    saveImages(newImages);
  };

  const removeImage = (idx: number) => {
    if (!confirm("Remove this image?")) return;
    saveImages(images.filter((_, i) => i !== idx));
  };

  return (
    <Modal open onClose={onClose} title={`Gallery · ${project.title}`} size="xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-gray">{images.length} images in gallery. Drag to reorder. First image is the main cover.</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
          >
            <IconUpload className="w-3.5 h-3.5" />
            Add Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files);
            }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="group relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border">
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-gold text-espresso font-bold uppercase">
                  Main
                </span>
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && (
                  <button
                    onClick={() => moveImage(idx, -1)}
                    className="w-7 h-7 rounded-full bg-white/95 hover:bg-gold text-espresso flex items-center justify-center"
                  >
                    <IconArrowUp className="w-3 h-3" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    onClick={() => moveImage(idx, 1)}
                    className="w-7 h-7 rounded-full bg-white/95 hover:bg-gold text-espresso flex items-center justify-center"
                  >
                    <IconArrowDown className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(idx)}
                  className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <IconTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <EmptyState title="No images" message="Upload your first gallery image." />
        )}
      </div>
    </Modal>
  );
}
