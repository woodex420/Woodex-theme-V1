// Enhanced Page Builder store with:
// - Multiple pages (Home, About, Services, etc.)
// - Section-level hide/show
// - Reorderable sections
// - Page-level settings
// - Templates
// - Export/Import per page

import { useEffect, useState, useCallback } from "react";

export type VisibilityRule = {
  type: "always" | "desktop-only" | "mobile-only" | "logged-in" | "logged-out" | "role";
  roles?: string[];
};

export type SectionBlock = {
  id: string;
  type:
    | "hero"
    | "text"
    | "image"
    | "features"
    | "testimonials"
    | "stats"
    | "cta"
    | "gallery"
    | "faq"
    | "logos"
    | "pricing"
    | "contact-form"
    | "video"
    | "spacer"
    | "custom-html";
  title: string;
  visible?: boolean;
  order: number;
  props?: Record<string, unknown>;
  styles?: {
    padding?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    textColor?: string;
    maxWidth?: string;
    textAlign?: "left" | "center" | "right";
  };
  visibility?: VisibilityRule;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isHome: boolean;
  isPublished: boolean;
  blocks: SectionBlock[];
  meta: {
    title: string;
    description: string;
    ogImage?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type SiteTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  blocks: Omit<SectionBlock, "id">[];
};

const STORAGE_KEY = "wp-pages-v1";
const TEMPLATES_KEY = "wp-templates-v1";

const defaultPages: Page[] = [
  // ==== MAIN PAGES ====
  {
    id: "p-home",
    slug: "home",
    title: "Home",
    description: "The main landing page of the studio.",
    isHome: true,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Interior Design Company Pakistan · WP Interior Studio",
      description:
        "Pakistan's award-winning interior design company. Residential, office, restaurant, cafe & retail design plus 3D visualization across Lahore, Karachi & Islamabad.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-about",
    slug: "about",
    title: "About",
    description: "Our story, team, and values.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "About WP Interior · Pakistan's Award-Winning Design Studio",
      description: "Founded 2010. WP Interior is one of Pakistan's leading design studios. Meet the team, our values, and the milestones that have shaped our practice.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-services",
    slug: "services",
    title: "Services",
    description: "All services offered by the studio.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Interior Design Services in Pakistan · WP Interior",
      description: "Full suite of interior design services in Pakistan: residential, office, restaurant, cafe, retail, renovation & 3D visualization. Compare packages & get a free quote.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-studio",
    slug: "studio",
    title: "3D Studio",
    description: "3D visualization and walkthroughs.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "3D Visualization Interior Design Pakistan · WP Interior",
      description: "Photorealistic 3D walkthroughs and visualization for interior design projects in Pakistan.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-portfolio",
    slug: "portfolio",
    title: "Portfolio",
    description: "Selected work and case studies.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Portfolio · WP Interior Design Studio Pakistan",
      description: "Explore our portfolio of residential, commercial and hospitality interior design projects.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-journal",
    slug: "blog",
    title: "Journal",
    description: "Articles, news, and design insights.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Journal · Interior Design Insights from WP Interior",
      description: "Long-form writing from our designers on the craft of interior design.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-contact",
    slug: "contact",
    title: "Contact",
    description: "Contact form and details.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Contact WP Interior · Free Design Consultation Pakistan",
      description: "Get in touch with WP Interior for a free interior design consultation.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-consultation",
    slug: "consultation",
    title: "Free Consultation",
    description: "Free 30-minute design consultation page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Free Design Consultation · WP Interior",
      description: "Book a free 30-minute consultation with a senior designer.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },

  // ==== INDIVIDUAL SERVICE PAGES ====
  {
    id: "p-svc-office",
    slug: "service/office-interior-design-lahore",
    title: "Office Interior Design",
    description: "Office interior design service page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Office Interior Design Lahore · WP Interior",
      description: "Premium office interior design in Lahore and across Pakistan.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-svc-restaurant",
    slug: "service/restaurant-interior-design-pakistan",
    title: "Restaurant Interior Design",
    description: "Restaurant interior design service page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Restaurant Interior Design Pakistan · WP Interior",
      description: "Restaurant interior design that boosts covers and brand.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-svc-cafe",
    slug: "service/cafe-interior-design-services",
    title: "Cafe Interior Design",
    description: "Cafe interior design service page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Cafe Interior Design Services · WP Interior",
      description: "Cafe interior design services for specialty coffee shops.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-svc-3d",
    slug: "service/3d-visualization-interior-design-pakistan",
    title: "3D Visualization",
    description: "3D visualization service page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "3D Visualization Interior Design Pakistan · WP Interior",
      description: "Photorealistic 3D visualization and walkthroughs.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-svc-renovation",
    slug: "service/renovation-services-pakistan",
    title: "Renovation Services",
    description: "Renovation services page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Renovation Services Pakistan · WP Interior",
      description: "End-to-end renovation services for homes, offices, and retail.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "p-svc-retail",
    slug: "service/retail-interior-design-pakistan",
    title: "Retail Interior Design",
    description: "Retail interior design service page.",
    isHome: false,
    isPublished: true,
    blocks: [],
    meta: {
      title: "Retail Interior Design Pakistan · WP Interior",
      description: "Retail interior design that converts browsers to buyers.",
    },
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];

const builtInTemplates: SiteTemplate[] = [
  {
    id: "t-landing",
    name: "Landing Page",
    description: "Single-page landing with hero, features, and CTA.",
    blocks: [
      { type: "hero", title: "Hero Section", visible: true, order: 0, props: { heading: "Welcome", subtitle: "Beautiful spaces" }, styles: {} },
      { type: "features", title: "Features", visible: true, order: 1, props: { items: [] }, styles: {} },
      { type: "cta", title: "Call to Action", visible: true, order: 2, props: { text: "Get Started" }, styles: {} },
    ],
  },
  {
    id: "t-about",
    name: "About Page",
    description: "Standard about page template with story and team.",
    blocks: [
      { type: "hero", title: "Page Hero", visible: true, order: 0, props: { title: "About Us" }, styles: {} },
      { type: "text", title: "Our Story", visible: true, order: 1, props: { content: "Tell your story..." }, styles: {} },
      { type: "gallery", title: "Team Gallery", visible: true, order: 2, props: {}, styles: {} },
      { type: "cta", title: "Join Us", visible: true, order: 3, props: { text: "Get in Touch" }, styles: {} },
    ],
  },
  {
    id: "t-blank",
    name: "Blank Page",
    description: "Start with a clean slate.",
    blocks: [],
  },
];

function loadPages(): Page[] {
  try {
    if (typeof localStorage === "undefined") return defaultPages;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPages));
      } catch {
        // ignore
      }
      return defaultPages;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPages;
    return parsed;
  } catch {
    return defaultPages;
  }
}

function savePages(pages: Page[]) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    }
  } catch (e) {
    console.warn("Failed to save pages", e);
  }
}

function loadTemplates(): SiteTemplate[] {
  try {
    if (typeof localStorage === "undefined") return builtInTemplates;
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return builtInTemplates;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return builtInTemplates;
    return [...builtInTemplates, ...parsed];
  } catch {
    return builtInTemplates;
  }
}

export function usePageBuilder() {
  const [pages, setPages] = useState<Page[]>(() => loadPages());
  const [templates, setTemplates] = useState<SiteTemplate[]>(() => loadTemplates());
  const [activePageId, setActivePageId] = useState<string>(() => {
    return loadPages().find((p) => p.isHome)?.id || loadPages()[0]?.id || "p-home";
  });

  useEffect(() => {
    setPages(loadPages());
    setTemplates(loadTemplates());
  }, []);

  const update = useCallback((updater: (p: Page[]) => Page[]) => {
    setPages((prev) => {
      const next = updater(prev);
      savePages(next);
      return next;
    });
  }, []);

  // ==== PAGES ====
  const createPage = useCallback((data: { title: string; slug?: string; templateId?: string }) => {
    const id = `p-${Date.now()}`;
    const slug = (data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
    const template = data.templateId ? templates.find((t) => t.id === data.templateId) : null;
    const newPage: Page = {
      id,
      slug,
      title: data.title,
      description: "",
      isHome: false,
      isPublished: true,
      blocks: template ? template.blocks.map((b, i) => ({ ...b, id: `b-${id}-${i}`, order: i, visible: b.visible ?? true } as SectionBlock)) : [],
      meta: { title: data.title, description: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    update((p) => [...p, newPage]);
    return id;
  }, [templates, update]);

  const updatePage = useCallback((id: string, patch: Partial<Page>) => {
    update((p) =>
      p.map((pg) => (pg.id === id ? { ...pg, ...patch, updatedAt: new Date().toISOString() } : pg))
    );
  }, [update]);

  const deletePage = useCallback((id: string) => {
    update((p) => p.filter((pg) => pg.id !== id && !pg.isHome));
  }, [update]);

  const duplicatePage = useCallback((id: string) => {
    const original = pages.find((p) => p.id === id);
    if (!original) return;
    const newId = `p-${Date.now()}`;
    const newPage: Page = {
      ...original,
      id: newId,
      slug: `${original.slug}-copy`,
      title: `${original.title} (Copy)`,
      isHome: false,
      blocks: original.blocks.map((b) => ({ ...b, id: `b-${newId}-${Math.random().toString(36).slice(2, 8)}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    update((p) => [...p, newPage]);
  }, [pages, update]);

  const setHomePage = useCallback((id: string) => {
    update((p) => p.map((pg) => ({ ...pg, isHome: pg.id === id })));
  }, [update]);

  // ==== BLOCKS ====
  const addBlock = useCallback((pageId: string, block: Partial<Omit<SectionBlock, "id">> & { type: SectionBlock["type"]; title: string }) => {
    const id = `b-${Date.now()}`;
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        const order = Math.max(0, ...pg.blocks.map((b) => b.order)) + 1;
        return { ...pg, blocks: [...pg.blocks, { ...block, id, order }], updatedAt: new Date().toISOString() };
      })
    );
    return id;
  }, [update]);

  const updateBlock = useCallback((pageId: string, blockId: string, patch: Partial<SectionBlock>) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        return {
          ...pg,
          blocks: pg.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [update]);

  const deleteBlock = useCallback((pageId: string, blockId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        return { ...pg, blocks: pg.blocks.filter((b) => b.id !== blockId), updatedAt: new Date().toISOString() };
      })
    );
  }, [update]);

  const duplicateBlock = useCallback((pageId: string, blockId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        const original = pg.blocks.find((b) => b.id === blockId);
        if (!original) return pg;
        const newId = `b-${Date.now()}`;
        const newOrder = original.order + 0.5;
        const newBlock: SectionBlock = { ...original, id: newId, order: newOrder, title: `${original.title} (Copy)` };
        const newBlocks = [...pg.blocks, newBlock].sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }));
        return { ...pg, blocks: newBlocks, updatedAt: new Date().toISOString() };
      })
    );
  }, [update]);

  const toggleBlockVisibility = useCallback((pageId: string, blockId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        return {
          ...pg,
          blocks: pg.blocks.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [update]);

  const reorderBlocks = useCallback((pageId: string, fromId: string, toId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        const blocks = [...pg.blocks].sort((a, b) => a.order - b.order);
        const fromIdx = blocks.findIndex((b) => b.id === fromId);
        const toIdx = blocks.findIndex((b) => b.id === toId);
        if (fromIdx < 0 || toIdx < 0) return pg;
        const [moved] = blocks.splice(fromIdx, 1);
        blocks.splice(toIdx, 0, moved);
        const reordered = blocks.map((b, i) => ({ ...b, order: i }));
        return { ...pg, blocks: reordered, updatedAt: new Date().toISOString() };
      })
    );
  }, [update]);

  const moveBlockUp = useCallback((pageId: string, blockId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        const blocks = [...pg.blocks].sort((a, b) => a.order - b.order);
        const idx = blocks.findIndex((b) => b.id === blockId);
        if (idx <= 0) return pg;
        [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
        return { ...pg, blocks: blocks.map((b, i) => ({ ...b, order: i })), updatedAt: new Date().toISOString() };
      })
    );
  }, [update]);

  const moveBlockDown = useCallback((pageId: string, blockId: string) => {
    update((p) =>
      p.map((pg) => {
        if (pg.id !== pageId) return pg;
        const blocks = [...pg.blocks].sort((a, b) => a.order - b.order);
        const idx = blocks.findIndex((b) => b.id === blockId);
        if (idx < 0 || idx >= blocks.length - 1) return pg;
        [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
        return { ...pg, blocks: blocks.map((b, i) => ({ ...b, order: i })), updatedAt: new Date().toISOString() };
      })
    );
  }, [update]);

  // ==== EXPORT / IMPORT ====
  const exportAll = useCallback(() => {
    return JSON.stringify({ pages, templates: templates.filter((t) => !builtInTemplates.find((b) => b.id === t.id)) }, null, 2);
  }, [pages, templates]);

  const importAll = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data.pages)) {
        savePages(data.pages);
        setPages(data.pages);
      }
      if (Array.isArray(data.templates)) {
        try {
          const customTemplates = data.templates.filter((t: SiteTemplate) => !builtInTemplates.find((b) => b.id === t.id));
          localStorage.setItem(TEMPLATES_KEY, JSON.stringify(customTemplates));
        } catch {
          // ignore
        }
        setTemplates([...builtInTemplates, ...data.templates]);
      }
    } catch (e) {
      alert("Invalid JSON");
    }
  }, []);

  return {
    pages,
    templates,
    activePageId,
    setActivePageId,
    createPage,
    updatePage,
    deletePage,
    duplicatePage,
    setHomePage,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    toggleBlockVisibility,
    reorderBlocks,
    moveBlockUp,
    moveBlockDown,
    exportAll,
    importAll,
  };
}

export type PageBuilderApi = ReturnType<typeof usePageBuilder>;
