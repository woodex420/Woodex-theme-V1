// Content data store for admin CRUD operations.
// All admin-managed data is stored in localStorage with sensible defaults
// from the existing static data files. This makes the site a "real" fullstack
// CMS-like experience without a backend.

import { portfolio, testimonials } from "../data/pages";
import { serviceList, blogPosts as seoBlogPosts } from "../data/seo";

const STORAGE_KEY = "wp-content-store-v1";

// ============= TYPES =============
export type Project = {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  client: string;
  location: string;
  year: string;
  image: string;
  description?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  status: "draft" | "published";
  createdAt: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  authorBio: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
};

export type Media = {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  price?: string;
  status: "draft" | "published";
  order: number;
};

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialInstagram: string;
  socialLinkedIn: string;
  socialPinterest: string;
  primaryColor: string;
  accentColor: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
};

export type ContentStore = {
  projects: Project[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  contacts: Contact[];
  media: Media[];
  services: Service[];
  settings: SiteSettings;
};

// ============= DEFAULTS =============
const defaultStore: ContentStore = {
  projects: portfolio.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    categorySlug: p.categorySlug,
    client: p.client,
    location: p.location,
    year: p.year,
    image: p.image,
    description: "",
    status: "published" as const,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  })),
  testimonials: testimonials.map((t, i) => ({
    id: `t-${i}`,
    quote: t.quote,
    name: t.name,
    role: t.role,
    rating: t.rating,
    status: "published" as const,
    createdAt: "2025-01-01",
  })),
  blogPosts: seoBlogPosts.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readTime: p.readTime,
    image: p.image,
    author: p.author,
    authorRole: p.authorRole,
    authorBio: p.authorBio,
    status: "published" as const,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  })),
  contacts: [
    {
      id: "c-1",
      name: "Aaliya Khan",
      email: "aaliya.khan@example.com",
      phone: "+92 300 1234567",
      service: "Office Interior Design",
      message: "Hi, I'm interested in office design for our 8,000 sq ft space in Gulberg. Could we schedule a consultation next week?",
      status: "new" as const,
      createdAt: "2025-03-18T09:30:00Z",
    },
    {
      id: "c-2",
      name: "Hamza Sheikh",
      email: "hamza@cafeblue.pk",
      phone: "+92 321 9876543",
      service: "Cafe Interior Design",
      message: "We are launching a specialty cafe in DHA Phase 5. Looking for a full design package. What are your rates?",
      status: "read" as const,
      createdAt: "2025-03-17T14:22:00Z",
    },
    {
      id: "c-3",
      name: "Sara Ahmed",
      email: "sara@archstudio.com",
      phone: "+92 333 1112233",
      service: "3D Visualization",
      message: "Need 4-5 high-quality renders of an upcoming residential project in Lahore. Can you share your portfolio and pricing?",
      status: "replied" as const,
      createdAt: "2025-03-15T11:45:00Z",
    },
    {
      id: "c-4",
      name: "Bilal Hussain",
      email: "bilal@digitalwave.pk",
      phone: "+92 345 5556677",
      service: "Software House Interior",
      message: "Our tech company is moving to a new 12,000 sq ft office. We want a modern, employee-friendly design with focus pods and collaboration zones.",
      status: "new" as const,
      createdAt: "2025-03-19T16:10:00Z",
    },
  ],
  media: [
    {
      id: "m-1",
      url: "/images/hero-main.jpg",
      name: "hero-main.jpg",
      size: 245000,
      type: "image/jpeg",
      uploadedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "m-2",
      url: "/images/hero-studio.jpg",
      name: "hero-studio.jpg",
      size: 198000,
      type: "image/jpeg",
      uploadedAt: "2025-01-15T10:05:00Z",
    },
    {
      id: "m-3",
      url: "/images/hero-3d.jpg",
      name: "hero-3d.jpg",
      size: 215000,
      type: "image/jpeg",
      uploadedAt: "2025-01-15T10:10:00Z",
    },
    {
      id: "m-4",
      url: "/images/services/office.jpg",
      name: "office.jpg",
      size: 187000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:30:00Z",
    },
    {
      id: "m-5",
      url: "/images/services/shops.jpg",
      name: "shops.jpg",
      size: 165000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:35:00Z",
    },
    {
      id: "m-6",
      url: "/images/services/pharmacy.jpg",
      name: "pharmacy.jpg",
      size: 142000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:40:00Z",
    },
    {
      id: "m-7",
      url: "/images/services/software.jpg",
      name: "software.jpg",
      size: 198000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:45:00Z",
    },
    {
      id: "m-8",
      url: "/images/services/furniture.jpg",
      name: "furniture.jpg",
      size: 175000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:50:00Z",
    },
    {
      id: "m-9",
      url: "/images/services/retail.jpg",
      name: "retail.jpg",
      size: 158000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T14:55:00Z",
    },
    {
      id: "m-10",
      url: "/images/services/renovation.jpg",
      name: "renovation.jpg",
      size: 188000,
      type: "image/jpeg",
      uploadedAt: "2025-01-20T15:00:00Z",
    },
  ],
  services: serviceList.map((s, i) => ({
    id: s.slug,
    name: s.name,
    slug: s.slug,
    description: s.intro,
    shortDescription: s.intro.split(". ")[0] + ".",
    icon: s.category,
    category: s.category,
    price: undefined,
    status: "published" as const,
    order: i,
  })),
  settings: {
    siteName: "WP Interior Studio",
    siteTagline: "Pakistan's award-winning interior design company",
    contactEmail: "hello@wpinterior.com",
    contactPhone: "+92 300 1234567",
    address: "124-G, MM Alam Road, Gulberg III, Lahore 54000, Pakistan",
    socialInstagram: "https://instagram.com/wpinterior",
    socialLinkedIn: "https://linkedin.com/company/wpinterior",
    socialPinterest: "https://pinterest.com/wpinterior",
    primaryColor: "#C6A15B",
    accentColor: "#211C18",
    maintenanceMode: false,
    allowRegistrations: false,
    emailNotifications: true,
  },
};

// ============= STORE =============
function load(): ContentStore {
  try {
    if (typeof localStorage === "undefined") return defaultStore;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
      } catch {
        // ignore quota errors
      }
      return defaultStore;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaultStore;
    }
    // Merge to add new fields from defaultStore with strict array checks
    return {
      ...defaultStore,
      ...parsed,
      projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : defaultStore.projects,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultStore.testimonials,
      blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : defaultStore.blogPosts,
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : defaultStore.contacts,
      media: Array.isArray(parsed.media) ? parsed.media : defaultStore.media,
      services: Array.isArray(parsed.services) ? parsed.services : defaultStore.services,
      settings: { ...defaultStore.settings, ...(parsed.settings && typeof parsed.settings === "object" ? parsed.settings : {}) },
    };
  } catch (e) {
    console.warn("Failed to load content store, using defaults", e);
    return defaultStore;
  }
}

function save(store: ContentStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn("Failed to save content store", e);
  }
}

// ============= HOOK =============
import { useEffect, useState, useCallback } from "react";

export function useContentStore() {
  const [store, setStore] = useState<ContentStore>(() => load());

  useEffect(() => {
    setStore(load());
  }, []);

  const update = useCallback((updater: (s: ContentStore) => ContentStore) => {
    setStore((prev) => {
      try {
        const next = updater(prev);
        // Ensure all array fields are arrays before saving
        const safe: ContentStore = {
          ...next,
          projects: Array.isArray(next.projects) ? next.projects : [],
          testimonials: Array.isArray(next.testimonials) ? next.testimonials : [],
          blogPosts: Array.isArray(next.blogPosts) ? next.blogPosts : [],
          contacts: Array.isArray(next.contacts) ? next.contacts : [],
          media: Array.isArray(next.media) ? next.media : [],
          services: Array.isArray(next.services) ? next.services : [],
        };
        save(safe);
        return safe;
      } catch (e) {
        console.warn("Update failed", e);
        return prev;
      }
    });
  }, []);

  // ====== PROJECTS ======
  const addProject = useCallback((p: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const id = Math.max(0, ...store.projects.map((p) => p.id)) + 1;
    const now = new Date().toISOString();
    update((s) => ({
      ...s,
      projects: [...s.projects, { ...p, id, createdAt: now, updatedAt: now }],
    }));
    return id;
  }, [store.projects, update]);

  const updateProject = useCallback((id: number, patch: Partial<Project>) => {
    update((s) => ({
      ...s,
      projects: s.projects.map((p) => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p),
    }));
  }, [update]);

  const deleteProject = useCallback((id: number) => {
    update((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
  }, [update]);

  // ====== TESTIMONIALS ======
  const addTestimonial = useCallback((t: Omit<Testimonial, "id" | "createdAt">) => {
    const id = `t-${Date.now()}`;
    update((s) => ({ ...s, testimonials: [...s.testimonials, { ...t, id, createdAt: new Date().toISOString() }] }));
    return id;
  }, [update]);

  const updateTestimonial = useCallback((id: string, patch: Partial<Testimonial>) => {
    update((s) => ({
      ...s,
      testimonials: s.testimonials.map((t) => t.id === id ? { ...t, ...patch } : t),
    }));
  }, [update]);

  const deleteTestimonial = useCallback((id: string) => {
    update((s) => ({ ...s, testimonials: s.testimonials.filter((t) => t.id !== id) }));
  }, [update]);

  // ====== BLOG POSTS ======
  const addBlogPost = useCallback((p: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    const id = `post-${Date.now()}`;
    const now = new Date().toISOString();
    update((s) => ({ ...s, blogPosts: [...s.blogPosts, { ...p, id, createdAt: now, updatedAt: now }] }));
    return id;
  }, [update]);

  const updateBlogPost = useCallback((id: string, patch: Partial<BlogPost>) => {
    update((s) => ({
      ...s,
      blogPosts: s.blogPosts.map((p) => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p),
    }));
  }, [update]);

  const deleteBlogPost = useCallback((id: string) => {
    update((s) => ({ ...s, blogPosts: s.blogPosts.filter((p) => p.id !== id) }));
  }, [update]);

  // ====== CONTACTS ======
  const addContact = useCallback((c: Omit<Contact, "id" | "createdAt" | "status">) => {
    const id = `c-${Date.now()}`;
    update((s) => ({ ...s, contacts: [{ ...c, id, status: "new", createdAt: new Date().toISOString() }, ...s.contacts] }));
    return id;
  }, [update]);

  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    update((s) => ({
      ...s,
      contacts: s.contacts.map((c) => c.id === id ? { ...c, ...patch } : c),
    }));
  }, [update]);

  const deleteContact = useCallback((id: string) => {
    update((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) }));
  }, [update]);

  // ====== MEDIA ======
  const addMedia = useCallback((m: Omit<Media, "id" | "uploadedAt">) => {
    const id = `m-${Date.now()}`;
    update((s) => ({ ...s, media: [{ ...m, id, uploadedAt: new Date().toISOString() }, ...s.media] }));
    return id;
  }, [update]);

  const deleteMedia = useCallback((id: string) => {
    update((s) => ({ ...s, media: s.media.filter((m) => m.id !== id) }));
  }, [update]);

  // ====== SERVICES ======
  const addService = useCallback((sv: Omit<Service, "id" | "order">) => {
    const id = `svc-${Date.now()}`;
    const order = Math.max(0, ...store.services.map((s) => s.order)) + 1;
    update((s) => ({ ...s, services: [...s.services, { ...sv, id, order }] }));
    return id;
  }, [store.services, update]);

  const updateService = useCallback((id: string, patch: Partial<Service>) => {
    update((s) => ({
      ...s,
      services: s.services.map((sv) => sv.id === id ? { ...sv, ...patch } : sv),
    }));
  }, [update]);

  const deleteService = useCallback((id: string) => {
    update((s) => ({ ...s, services: s.services.filter((sv) => sv.id !== id) }));
  }, [update]);

  // ====== SETTINGS ======
  const updateSettings = useCallback((patch: Partial<SiteSettings>) => {
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, [update]);

  // ====== RESET ======
  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStore(defaultStore);
  }, []);

  return {
    store,
    addProject, updateProject, deleteProject,
    addTestimonial, updateTestimonial, deleteTestimonial,
    addBlogPost, updateBlogPost, deleteBlogPost,
    addContact, updateContact, deleteContact,
    addMedia, deleteMedia,
    addService, updateService, deleteService,
    updateSettings,
    resetAll,
  };
}

export type ContentStoreApi = ReturnType<typeof useContentStore>;
