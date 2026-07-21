// All admin pages in one file for efficiency
// Each page is a complete CRUD interface for a content type

import { useState, useMemo, useRef } from "react";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  EmptyState,
  Modal,
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  Button,
} from "./AdminLayout";
import type { ContentStoreApi, Project, Testimonial, BlogPost, Contact, Service, SiteSettings } from "../../lib/contentStore";
import { formatDistanceToNow } from "../../lib/dateUtils";
import {
  IconPlus,
  IconTrash,
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconUpload,
} from "../Icons";
import { cn } from "../../utils/cn";
import { useContentStore } from "../../lib/contentStore";
import { RichTextEditor } from "../RichTextEditor";

// ============= DASHBOARD =============
export function DashboardPage({ api, onNavigate }: { api: ContentStoreApi; onNavigate: (p: string) => void }) {
  const { store } = api;
  const newContacts = store.contacts.filter((c) => c.status === "new").length;
  const publishedPosts = store.blogPosts.filter((p) => p.status === "published").length;
  const draftPosts = store.blogPosts.filter((p) => p.status === "draft").length;
  const totalProjects = store.projects.length;
  const totalMedia = store.media.length;
  const totalStorage = (store.media.reduce((s, m) => s + m.size, 0) / 1024 / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Elena 👋"
        description="Here's what's happening with your studio today."
        action={
          <Button onClick={() => onNavigate("contacts")} variant="primary">
            <IconArrowRight className="w-3.5 h-3.5" />
            View Inbox
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={totalProjects} icon="📁" trend={{ value: "12%", positive: true }} />
        <StatCard label="New Leads" value={newContacts} icon="📧" color="emerald" trend={{ value: "4", positive: true }} />
        <StatCard label="Blog Posts" value={`${publishedPosts}`} icon="📝" color="blue" />
        <StatCard label="Media Files" value={`${totalMedia} (${totalStorage}MB)`} icon="🖼️" color="espresso" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent contacts */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-heading">Recent Leads</h3>
            <button onClick={() => onNavigate("contacts")} className="text-xs text-gold font-semibold uppercase tracking-widest">
              View all →
            </button>
          </div>
          {store.contacts.length === 0 ? (
            <EmptyState title="No leads yet" message="When visitors submit the contact form, they'll appear here." />
          ) : (
            <div className="space-y-3">
              {store.contacts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-cream-50/50 hover:bg-cream-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-heading text-sm">{c.name}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-text-gray line-clamp-1">{c.message}</p>
                    <div className="text-[10px] text-text-gray/60 mt-1">
                      {c.service && `${c.service} · `}
                      {formatDistanceToNow(c.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-serif text-lg text-heading mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { id: "builder", label: "Open Page Builder", icon: "🎨" },
                { id: "projects", label: "Add Project", icon: "📁" },
                { id: "blog", label: "Write Blog Post", icon: "📝" },
                { id: "contacts", label: "View Inbox", icon: "📧" },
                { id: "media", label: "Upload Media", icon: "🖼️" },
              ].map((a) => (
                <button
                  key={a.id}
                  onClick={() => onNavigate(a.id)}
                  className="w-full p-3 rounded-lg bg-cream-50 hover:bg-gold/10 border border-border hover:border-gold flex items-center gap-3 transition-all group"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-sm text-heading font-medium flex-1 text-left">{a.label}</span>
                  <IconArrowRight className="w-3.5 h-3.5 text-text-gray group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-serif text-lg text-heading mb-3">Storage</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-gray">Media files</span>
                <span className="text-heading font-semibold">{totalMedia}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Total size</span>
                <span className="text-heading font-semibold">{totalStorage} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Draft posts</span>
                <span className="text-heading font-semibold">{draftPosts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity timeline */}
      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">Recent Projects</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {store.projects.slice(0, 4).map((p) => (
            <div key={p.id} className="group cursor-pointer" onClick={() => onNavigate("projects")}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-cream-100">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="text-xs text-gold font-semibold uppercase tracking-widest">{p.category}</div>
              <div className="font-serif text-base text-heading line-clamp-1">{p.title}</div>
              <div className="text-[10px] text-text-gray">{p.location} · {p.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============= PROJECTS =============
export function ProjectsPage({ api }: { api: ContentStoreApi }) {
  const { store, addProject, updateProject, deleteProject } = api;
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

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
        description="Manage your portfolio of completed work."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New Project
          </Button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
        />
        <div className="flex gap-1">
          {["all", "published", "draft", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-2 text-xs font-semibold uppercase tracking-widest rounded-md transition-colors",
                filter === f ? "bg-espresso text-white" : "bg-cream-50 text-text-gray hover:bg-gold/10"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          message="Try changing your filters or create a new project."
          action={<Button onClick={() => setShowForm(true)}><IconPlus className="w-3.5 h-3.5" /> New Project</Button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Project</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Client</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Year</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-cream-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                          <div className="font-serif text-heading">{p.title}</div>
                          <div className="text-[10px] text-text-gray">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.client}</td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.year}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="w-8 h-8 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center" title="Edit">
                          ✏️
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${p.title}"?`)) deleteProject(p.id); }}
                          className="w-8 h-8 rounded hover:bg-red-50 text-text-gray hover:text-red-600 flex items-center justify-center"
                          title="Delete"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ProjectForm
          project={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ProjectForm({ project, onSave, onClose }: { project: Project | null; onSave: (p: Omit<Project, "id" | "createdAt" | "updatedAt">) => void; onClose: () => void }) {
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

  return (
    <Modal open onClose={onClose} title={project ? "Edit Project" : "New Project"} size="lg">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Project Title" required>
            <TextInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Linen & Stone Residence" />
          </FormField>
          <FormField label="Image URL" required>
            <TextInput value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />
          </FormField>
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
          <FormField label="Client">
            <TextInput value={form.client} onChange={(v) => setForm({ ...form, client: v })} placeholder="Private Client" />
          </FormField>
          <FormField label="Location">
            <TextInput value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Lahore, Pakistan" />
          </FormField>
          <FormField label="Year">
            <TextInput value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2025" />
          </FormField>
        </div>
        <FormField label="Description" hint="A short description shown on the project detail page.">
          <TextareaInput value={form.description || ""} onChange={(v) => setForm({ ...form, description: v })} />
        </FormField>
        {form.image && (
          <div className="border border-border rounded-lg p-2">
            <img src={form.image} alt={form.title} className="w-full h-48 object-cover rounded-md" />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {project ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= TESTIMONIALS =============
export function TestimonialsPage({ api }: { api: ContentStoreApi }) {
  const { store, addTestimonial, updateTestimonial, deleteTestimonial } = api;
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Omit<Testimonial, "id" | "createdAt">) => {
    if (editing) {
      updateTestimonial(editing.id, data);
    } else {
      addTestimonial(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client reviews and ratings."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New Testimonial
          </Button>
        }
      />

      {store.testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" message="Add your first client testimonial." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {store.testimonials.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-heading">{t.name}</div>
                    <div className="text-[10px] text-text-gray">{t.role}</div>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm text-text-gray italic line-clamp-3 mb-3">"{t.quote}"</p>
              <div className="text-gold text-xs">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setShowForm(true); }}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this testimonial?")) deleteTestimonial(t.id); }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TestimonialForm
          testimonial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function TestimonialForm({ testimonial, onSave, onClose }: { testimonial: Testimonial | null; onSave: (t: Omit<Testimonial, "id" | "createdAt">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Testimonial, "id" | "createdAt">>({
    quote: testimonial?.quote || "",
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    rating: testimonial?.rating || 5,
    status: testimonial?.status || "draft",
  });
  return (
    <Modal open onClose={onClose} title={testimonial ? "Edit Testimonial" : "New Testimonial"}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <FormField label="Quote" required>
          <TextareaInput value={form.quote} onChange={(v) => setForm({ ...form, quote: v })} rows={4} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" required>
            <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          </FormField>
          <FormField label="Role / Company">
            <TextInput value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Rating">
            <SelectInput
              value={String(form.rating)}
              onChange={(v) => setForm({ ...form, rating: parseInt(v) })}
              options={[
                { value: "5", label: "5 stars" },
                { value: "4", label: "4 stars" },
                { value: "3", label: "3 stars" },
              ]}
            />
          </FormField>
          <FormField label="Status">
            <SelectInput
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as "draft" | "published" })}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= BLOG POSTS =============
export function BlogPage({ api }: { api: ContentStoreApi }) {
  const { store, addBlogPost, updateBlogPost, deleteBlogPost } = api;
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    if (editing) {
      updateBlogPost(editing.id, data);
    } else {
      addBlogPost(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Articles, insights, and company news."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New Post
          </Button>
        }
      />

      {store.blogPosts.length === 0 ? (
        <EmptyState title="No blog posts" message="Write your first article." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Post</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Author</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Date</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {store.blogPosts.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-cream-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-md object-cover" />
                        <div>
                          <div className="font-serif text-heading line-clamp-1 max-w-md">{p.title}</div>
                          <div className="text-[10px] text-text-gray">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.author}</td>
                    <td className="px-4 py-3 text-text-gray text-xs">{p.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => { setEditing(p); setShowForm(true); }} className="w-8 h-8 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center">✏️</button>
                        <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) deleteBlogPost(p.id); }} className="w-8 h-8 rounded hover:bg-red-50 text-text-gray hover:text-red-600 flex items-center justify-center">
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <BlogPostForm
          post={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function BlogPostForm({ post, onSave, onClose }: { post: BlogPost | null; onSave: (p: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>({
    slug: post?.slug || "",
    title: post?.title || "",
    metaTitle: post?.metaTitle || "",
    metaDescription: post?.metaDescription || "",
    excerpt: post?.excerpt || "",
    category: post?.category || "Office Design",
    date: post?.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: post?.readTime || "5 min",
    image: post?.image || "",
    author: post?.author || "Hassan Raza",
    authorRole: post?.authorRole || "Senior Designer",
    authorBio: post?.authorBio || "",
    status: post?.status || "draft",
  });
  const { addMedia } = useContentStore();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState<string>(post?.excerpt || "");

  const handleImageUpload = async (file: File) => {
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
    <Modal open onClose={onClose} title={post ? "Edit Post" : "New Blog Post"} size="xl">
      <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, excerpt: body || form.excerpt }); }} className="space-y-4">
        <FormField label="Title" required>
          <TextInput value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Your article title..." />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="URL Slug" required hint="Lowercase, hyphens only">
            <TextInput value={form.slug} onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="my-article-title" />
          </FormField>
          <FormField label="Category">
            <SelectInput
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={[
                { value: "Office Design", label: "Office Design" },
                { value: "Restaurant Design", label: "Restaurant Design" },
                { value: "Cafe Design", label: "Cafe Design" },
                { value: "3D Studio", label: "3D Studio" },
                { value: "Trends", label: "Trends" },
                { value: "Behind the Studio", label: "Behind the Studio" },
              ]}
            />
          </FormField>
        </div>
        <FormField label="Featured Image" required hint="Upload or select from library">
          <div className="space-y-2">
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
                Upload
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
                  if (file) handleImageUpload(file);
                }}
              />
            </div>
            {form.image && (
              <div className="border border-border rounded-lg p-2">
                <img src={form.image} alt={form.title} className="w-full h-32 object-cover rounded-md" />
              </div>
            )}
          </div>
        </FormField>
        <FormField label="Body Content" hint="Write your article. Use the toolbar to format text, add links, or insert images.">
          <RichTextEditor value={body} onChange={setBody} rows={10} />
        </FormField>
        <FormField label="Excerpt" hint="A 1-2 sentence summary that appears in article lists.">
          <TextareaInput value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="SEO Title" hint="50-60 characters">
            <TextInput value={form.metaTitle} onChange={(v) => setForm({ ...form, metaTitle: v })} />
          </FormField>
          <FormField label="SEO Description" hint="150-160 characters">
            <TextInput value={form.metaDescription} onChange={(v) => setForm({ ...form, metaDescription: v })} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status">
            <SelectInput
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as "draft" | "published" })}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </FormField>
          <FormField label="Read Time">
            <TextInput value={form.readTime} onChange={(v) => setForm({ ...form, readTime: v })} placeholder="5 min" />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            Save Post
          </Button>
        </div>
      </form>
      {showMediaPicker && (
        <BlogMediaPicker
          onSelect={(url) => { setForm({ ...form, image: url }); setShowMediaPicker(false); }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </Modal>
  );
}

function BlogMediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const { store, deleteMedia } = useContentStore();
  return (
    <Modal open onClose={onClose} title="Select Image" size="lg">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
        {store.media.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.url)}
            className="group relative aspect-square rounded overflow-hidden border-2 border-transparent hover:border-gold"
          >
            <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${m.name}?`)) deleteMedia(m.id); }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ============= CONTACTS =============
export function ContactsPage({ api }: { api: ContentStoreApi }) {
  const { store, updateContact, deleteContact } = api;
  const [filter, setFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    return store.contacts.filter((c) => filter === "all" || c.status === filter);
  }, [store.contacts, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Leads"
        description="Form submissions from your website."
      />

      <div className="flex gap-1 flex-wrap">
        {[
          { id: "all", label: "All", count: store.contacts.length },
          { id: "new", label: "New", count: store.contacts.filter((c) => c.status === "new").length },
          { id: "read", label: "Read", count: store.contacts.filter((c) => c.status === "read").length },
          { id: "replied", label: "Replied", count: store.contacts.filter((c) => c.status === "replied").length },
          { id: "archived", label: "Archived", count: store.contacts.filter((c) => c.status === "archived").length },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-3 py-2 text-xs font-semibold uppercase tracking-widest rounded-md transition-colors flex items-center gap-2",
              filter === f.id ? "bg-espresso text-white" : "bg-cream-50 text-text-gray hover:bg-gold/10"
            )}
          >
            {f.label}
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", filter === f.id ? "bg-gold/30 text-gold" : "bg-white")}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No leads in this view" message="Try changing your filter." />
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "p-4 hover:bg-cream-50/50 cursor-pointer transition-colors flex items-start gap-4",
                  c.status === "new" && "bg-blue-50/30"
                )}
                onClick={() => setViewing(c)}
              >
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-heading text-sm">{c.name}</span>
                    <span className="text-xs text-text-gray">·</span>
                    <span className="text-xs text-text-gray">{c.email}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm text-text-gray line-clamp-2">{c.message}</p>
                  <div className="text-[10px] text-text-gray/60 mt-1 flex items-center gap-3">
                    {c.service && <span>📋 {c.service}</span>}
                    {c.phone && <span>📞 {c.phone}</span>}
                    <span>🕐 {formatDistanceToNow(c.createdAt)}</span>
                  </div>
                </div>
                <IconArrowRight className="w-4 h-4 text-text-gray/40" />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <Modal open onClose={() => setViewing(null)} title="Lead Details" size="md">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                {viewing.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="font-serif text-xl text-heading">{viewing.name}</h3>
                <p className="text-sm text-text-gray">{viewing.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-cream-50">
                <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold">Phone</div>
                <div className="text-heading mt-1">{viewing.phone || "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-cream-50">
                <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold">Service</div>
                <div className="text-heading mt-1">{viewing.service || "—"}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Message</div>
              <div className="p-4 rounded-lg bg-cream-50 text-sm text-heading leading-relaxed">{viewing.message}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-2">Status</div>
              <div className="flex gap-1 flex-wrap">
                {["new", "read", "replied", "archived"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { updateContact(viewing.id, { status: s as Contact["status"] }); setViewing({ ...viewing, status: s as Contact["status"] }); }}
                    className={cn(
                      "px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-full border font-semibold",
                      viewing.status === s ? "bg-espresso text-white border-espresso" : "border-border text-text-gray hover:border-gold"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="danger" size="sm" onClick={() => { if (confirm("Delete this lead?")) { deleteContact(viewing.id); setViewing(null); } }}>
                <IconTrash className="w-3.5 h-3.5" />
                Delete
              </Button>
              <Button variant="primary" size="sm" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= MEDIA =============
export function MediaPage({ api }: { api: ContentStoreApi }) {
  const { store, addMedia, deleteMedia } = api;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return store.media.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [store.media, search]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        alert(`Skipped ${file.name}: Only image files are supported.`);
        continue;
      }
      // Read as data URL for local storage
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      addMedia({
        url: dataUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Images and files for your content. Drag & drop or click to upload."
        action={
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <IconUpload className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="card p-4 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <div className="flex gap-1">
          <button onClick={() => setView("grid")} className={cn("px-3 py-1.5 text-xs rounded-md", view === "grid" ? "bg-espresso text-white" : "bg-cream-50 text-text-gray")}>Grid</button>
          <button onClick={() => setView("list")} className={cn("px-3 py-1.5 text-xs rounded-md", view === "list" ? "bg-espresso text-white" : "bg-cream-50 text-text-gray")}>List</button>
        </div>
      </div>

      {/* Drag-drop area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "card p-8 text-center cursor-pointer border-2 border-dashed transition-all",
          dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
        )}
      >
        <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-3">
          <IconUpload className="w-5 h-5 text-gold" />
        </div>
        <p className="text-sm font-medium text-heading mb-1">
          {dragOver ? "Drop your files here" : "Drag & drop images here"}
        </p>
        <p className="text-xs text-text-gray">or click to browse · JPG, PNG, WebP, GIF up to 5MB</p>
        {uploading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gold">
            <span className="w-3 h-3 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="group relative card overflow-hidden">
              <div className="aspect-square bg-cream-50">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <div className="text-[10px] text-heading truncate" title={m.name}>{m.name}</div>
                <div className="text-[9px] text-text-gray">{(m.size / 1024).toFixed(0)} KB</div>
              </div>
              <button
                onClick={() => { if (confirm(`Delete ${m.name}?`)) deleteMedia(m.id); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <IconTrash className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">File</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Size</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Uploaded</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border hover:bg-cream-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={m.url} className="w-10 h-10 rounded object-cover" alt="" />
                      <span className="text-heading text-sm">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-gray text-xs">{(m.size / 1024).toFixed(0)} KB</td>
                  <td className="px-4 py-3 text-text-gray text-xs">{m.type}</td>
                  <td className="px-4 py-3 text-text-gray text-xs">{formatDistanceToNow(m.uploadedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete ${m.name}?`)) deleteMedia(m.id); }}>
                      <IconTrash className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============= SERVICES =============
export function ServicesPage({ api }: { api: ContentStoreApi }) {
  const { store, addService, updateService, deleteService } = api;
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Omit<Service, "id" | "order">) => {
    if (editing) {
      updateService(editing.id, data);
    } else {
      addService(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage your service offerings."
        action={
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New Service
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.services.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-lg">
                {s.icon === "residential" ? "🏠" : s.icon === "commercial" ? "🏢" : s.icon === "3d" ? "🎬" : s.icon === "hospitality" ? "🍽️" : "⚡"}
              </div>
              <StatusBadge status={s.status} />
            </div>
            <h3 className="font-serif text-lg text-heading mb-2">{s.name}</h3>
            <p className="text-xs text-text-gray line-clamp-3 mb-3">{s.shortDescription}</p>
            <div className="text-[10px] text-text-gray mb-3">/{s.slug}</div>
            <div className="flex gap-1 pt-3 border-t border-border">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(s); setShowForm(true); }}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${s.name}"?`)) deleteService(s.id); }}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ServiceForm
          service={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ServiceForm({ service, onSave, onClose }: { service: Service | null; onSave: (s: Omit<Service, "id" | "order">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Service, "id" | "order">>({
    name: service?.name || "",
    slug: service?.slug || "",
    description: service?.description || "",
    shortDescription: service?.shortDescription || "",
    icon: service?.icon || "residential",
    category: service?.category || "residential",
    price: service?.price || "",
    status: service?.status || "draft",
  });
  return (
    <Modal open onClose={onClose} title={service ? "Edit Service" : "New Service"} size="lg">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Service Name" required>
            <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Office Interior Design" />
          </FormField>
          <FormField label="URL Slug" required hint="Lowercase, hyphens only">
            <TextInput value={form.slug} onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="office-interior-design-lahore" />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Category">
            <SelectInput
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={[
                { value: "residential", label: "Residential" },
                { value: "commercial", label: "Commercial" },
                { value: "hospitality", label: "Hospitality" },
                { value: "3d", label: "3D Studio" },
                { value: "renovation", label: "Renovation" },
              ]}
            />
          </FormField>
          <FormField label="Status">
            <SelectInput
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as "draft" | "published" })}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </FormField>
        </div>
        <FormField label="Short Description" hint="Shown in service cards and dropdown menus.">
          <TextareaInput value={form.shortDescription} onChange={(v) => setForm({ ...form, shortDescription: v })} rows={2} />
        </FormField>
        <FormField label="Full Description" hint="Shown on the service detail page.">
          <TextareaInput value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={4} />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Starting Price (optional)">
            <TextInput value={form.price || ""} onChange={(v) => setForm({ ...form, price: v })} placeholder="PKR 1.5M" />
          </FormField>
          <FormField label="Icon" hint="Emoji or symbol used in the cards.">
            <TextInput value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} placeholder="🏢" />
          </FormField>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {service ? "Save Changes" : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= USERS =============
import {
  getAllUsers as _getAllUsers,
  createUser as _createUser,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
  getCurrentSession as _getCurrentSession,
} from "../../lib/auth";

export function UsersPage() {
  return <UsersPageInner />;
}

function UsersPageInner() {
  const [users, setUsers] = useState(_getAllUsers());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; username: string; email: string; fullName: string; role: "admin" | "editor" | "viewer"; password?: string } | null>(null);
  const session = _getCurrentSession();

  const refresh = () => setUsers(_getAllUsers());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Team members with admin access."
        action={
          <Button onClick={() => { setEditing({ username: "", email: "", fullName: "", role: "editor" }); setShowForm(true); }}>
            <IconPlus className="w-3.5 h-3.5" />
            New User
          </Button>
        }
      />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">User</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Email</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Role</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Last Login</th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border hover:bg-cream-50/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                      {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-heading text-sm">{u.fullName}</div>
                      <div className="text-[10px] text-text-gray">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-gray text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border",
                    u.role === "admin" ? "bg-gold/15 text-gold border-gold/30" :
                    u.role === "editor" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-stone-100 text-stone-700 border-stone-200"
                  )}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-text-gray text-xs">{u.lastLogin ? formatDistanceToNow(u.lastLogin) : "Never"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => { setEditing({ ...u, password: "" }); setShowForm(true); }} className="w-8 h-8 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center">✏️</button>
                    {u.id !== session?.user.id && (
                      <button onClick={() => { if (confirm(`Delete user ${u.username}?`)) { _deleteUser(u.id); refresh(); } }} className="w-8 h-8 rounded hover:bg-red-50 text-text-gray hover:text-red-600 flex items-center justify-center">
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <Modal open onClose={() => { setShowForm(false); setEditing(null); }} title={editing.id ? "Edit User" : "New User"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editing.id) {
                _updateUser(editing.id, {
                  username: editing.username,
                  email: editing.email,
                  fullName: editing.fullName,
                  role: editing.role,
                  ...(editing.password ? { password: editing.password } : {}),
                });
              } else {
                if (!editing.password) {
                  alert("Password is required for new users");
                  return;
                }
                _createUser({
                  id: "",
                  username: editing.username,
                  email: editing.email,
                  fullName: editing.fullName,
                  role: editing.role,
                  password: editing.password,
                  createdAt: "",
                });
              }
              setShowForm(false);
              setEditing(null);
              refresh();
            }}
            className="space-y-4"
          >
            <FormField label="Full Name" required>
              <TextInput value={editing.fullName} onChange={(v) => setEditing({ ...editing, fullName: v })} />
            </FormField>
            <FormField label="Username" required>
              <TextInput value={editing.username} onChange={(v) => setEditing({ ...editing, username: v.toLowerCase() })} />
            </FormField>
            <FormField label="Email" required>
              <TextInput type="email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} />
            </FormField>
            <FormField label="Role" required>
              <SelectInput
                value={editing.role}
                onChange={(v) => setEditing({ ...editing, role: v as "admin" | "editor" | "viewer" })}
                options={[
                  { value: "admin", label: "Admin (full access)" },
                  { value: "editor", label: "Editor (content only)" },
                  { value: "viewer", label: "Viewer (read only)" },
                ]}
              />
            </FormField>
            <FormField label={editing.id ? "New Password (leave blank to keep)" : "Password"} required={!editing.id}>
              <TextInput type="password" value={editing.password || ""} onChange={(v) => setEditing({ ...editing, password: v })} placeholder="••••••••" />
            </FormField>
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" onClick={() => { setShowForm(false); setEditing(null); }} variant="ghost">Cancel</Button>
              <Button type="submit" variant="primary">
                <IconCheck className="w-3.5 h-3.5" />
                {editing.id ? "Save" : "Create User"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ============= SETTINGS =============
export function SettingsPage({ api }: { api: ContentStoreApi }) {
  const { store, updateSettings, resetAll } = api;
  const [settings, setSettings] = useState<SiteSettings>(store.settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportAll = () => {
    const data = {
      ...store,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wp-content-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        description="Configure your studio's site-wide information."
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={exportAll}>
              <IconDownload className="w-3.5 h-3.5" />
              Export All
            </Button>
            <Button onClick={save}>
              <IconCheck className="w-3.5 h-3.5" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-serif text-lg text-heading mb-4">General</h3>
          <div className="space-y-4">
            <FormField label="Site Name">
              <TextInput value={settings.siteName} onChange={(v) => setSettings({ ...settings, siteName: v })} />
            </FormField>
            <FormField label="Site Tagline">
              <TextInput value={settings.siteTagline} onChange={(v) => setSettings({ ...settings, siteTagline: v })} />
            </FormField>
            <FormField label="Contact Email">
              <TextInput type="email" value={settings.contactEmail} onChange={(v) => setSettings({ ...settings, contactEmail: v })} />
            </FormField>
            <FormField label="Contact Phone">
              <TextInput value={settings.contactPhone} onChange={(v) => setSettings({ ...settings, contactPhone: v })} />
            </FormField>
            <FormField label="Address">
              <TextareaInput value={settings.address} onChange={(v) => setSettings({ ...settings, address: v })} rows={2} />
            </FormField>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-lg text-heading mb-4">Social Media</h3>
          <div className="space-y-4">
            <FormField label="Instagram URL">
              <TextInput value={settings.socialInstagram} onChange={(v) => setSettings({ ...settings, socialInstagram: v })} />
            </FormField>
            <FormField label="LinkedIn URL">
              <TextInput value={settings.socialLinkedIn} onChange={(v) => setSettings({ ...settings, socialLinkedIn: v })} />
            </FormField>
            <FormField label="Pinterest URL">
              <TextInput value={settings.socialPinterest} onChange={(v) => setSettings({ ...settings, socialPinterest: v })} />
            </FormField>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-lg text-heading mb-4">Site Behavior</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Maintenance Mode</div>
                <div className="text-[11px] text-text-gray">Show a maintenance page to visitors</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistrations}
                onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
                className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Allow Registrations</div>
                <div className="text-[11px] text-text-gray">Allow new users to register</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Email Notifications</div>
                <div className="text-[11px] text-text-gray">Receive email when new leads come in</div>
              </div>
            </label>
          </div>
        </div>

        <div className="card p-6 border-red-200 bg-red-50/30">
          <h3 className="font-serif text-lg text-red-700 mb-2">Danger Zone</h3>
          <p className="text-xs text-text-gray mb-4">These actions cannot be undone.</p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm("This will reset ALL content to defaults. Continue?")) {
                resetAll();
              }
            }}
          >
            <IconTrash className="w-3.5 h-3.5" />
            Reset All Content to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============= PROFILE =============
import { changeOwnPassword as _changeOwnPassword } from "../../lib/auth";

export function ProfilePage({ session: _session, onLogout }: { session: { user: { id: string; username: string; email: string; fullName: string; role: string; lastLogin?: string; createdAt: string } }; onLogout: () => void }) {
  const session = _session;
  const user = session.user;
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPw !== confirmPw) {
      setMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    const result = _changeOwnPassword(currentPw, newPw);
    if (result.ok) {
      setMsg({ type: "success", text: "Password changed successfully" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } else {
      setMsg({ type: "error", text: result.error || "Failed to change password" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and password."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center text-espresso font-serif text-3xl font-semibold mx-auto mb-4">
              {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="font-serif text-xl text-heading">{user.fullName}</h3>
            <p className="text-sm text-text-gray">@{user.username}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-gold/15 text-gold border border-gold/30">
              {user.role}
            </span>
            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-text-gray">Email</span>
                <span className="text-heading text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Last login</span>
                <span className="text-heading text-xs">{user.lastLogin ? formatDistanceToNow(user.lastLogin) : "Never"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-gray">Member since</span>
                <span className="text-heading text-xs">{user.createdAt?.split("T")[0] || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          <h3 className="font-serif text-lg text-heading mb-4">Change Password</h3>
          {msg && (
            <div className={cn(
              "mb-4 p-3 rounded-lg text-sm",
              msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            )}>
              {msg.text}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <FormField label="Current Password" required>
              <TextInput type="password" value={currentPw} onChange={setCurrentPw} />
            </FormField>
            <FormField label="New Password" required hint="Minimum 6 characters">
              <TextInput type="password" value={newPw} onChange={setNewPw} />
            </FormField>
            <FormField label="Confirm New Password" required>
              <TextInput type="password" value={confirmPw} onChange={setConfirmPw} />
            </FormField>
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                <IconCheck className="w-3.5 h-3.5" />
                Update Password
              </Button>
            </div>
          </form>
          <div className="mt-8 pt-6 border-t border-border">
            <Button variant="danger" size="sm" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= BUILDER PLACEHOLDER =============
export function BuilderAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Page Builder"
        description="Live drag-and-drop editor for the entire website."
      />
      <div className="card p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎨</span>
        </div>
        <h3 className="font-serif text-2xl text-heading mb-2">Live Page Builder</h3>
        <p className="text-sm text-text-gray mb-6 max-w-md mx-auto">
          Exit the admin to use the live drag-and-drop builder. Click the gold cube in the bottom-left corner on any page to start editing inline.
        </p>
        <a href="#/" className="btn btn-gold">
          <IconArrowRight className="w-3.5 h-3.5" />
          Open Live Site
        </a>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          {[
            { icon: "✏️", title: "Edit content inline", text: "Double-click any text to edit. Click images to replace them." },
            { icon: "🎨", title: "Style everything", text: "Change fonts, colors, spacing, borders from the side panel." },
            { icon: "↕️", title: "Drag to reorder", text: "Drag sections to reorder. Hide what you don't need." },
          ].map((f) => (
            <div key={f.title} className="p-4 rounded-lg bg-cream-50">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-medium text-heading text-sm mb-1">{f.title}</div>
              <div className="text-xs text-text-gray">{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
