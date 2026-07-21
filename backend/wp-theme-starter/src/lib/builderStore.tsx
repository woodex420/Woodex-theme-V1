// Builder store using localStorage for persistence
// Allows drag-drop, style editing, and content editing
// Uses React Context so all components share the same state

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import {
  type SectionOverride,
  type PageOverrides,
  type BuilderState,
  type StyleOverrides,
  type ContentOverrides,
} from "./builderTypes";

const STORAGE_KEY = "wp-interior-builder-overrides";
const ADMIN_PASSWORD = "wpinterior2024"; // Demo password for admin access

type AllOverrides = Record<string, PageOverrides>;

function loadAll(): AllOverrides {
  try {
    if (typeof localStorage === "undefined") return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    // Sanitize: ensure each page has a sections array
    const result: AllOverrides = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const v = value as PageOverrides;
        result[key] = {
          pageName: v.pageName || key,
          sections: Array.isArray(v.sections) ? v.sections.filter((s) => s && typeof s === "object" && typeof (s as SectionOverride).path === "string") as SectionOverride[] : [],
          updatedAt: typeof v.updatedAt === "number" ? v.updatedAt : 0,
        };
      }
    }
    return result;
  } catch (e) {
    console.warn("[builderStore] loadAll failed", e);
    return {};
  }
}

function saveAll(data: AllOverrides) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.warn("Failed to save builder state", e);
  }
}

export function exportOverrides(): string {
  if (typeof localStorage === "undefined") return "{}";
  return localStorage.getItem(STORAGE_KEY) || "{}";
}

export function importOverrides(json: string) {
  try {
    const parsed = JSON.parse(json);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.location.reload();
  } catch (e) {
    alert("Invalid JSON");
  }
}

export function clearAllOverrides() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.location.reload();
}

// ============= CONTEXT =============

type BuilderCtx = {
  isAdmin: boolean;
  state: BuilderState;
  allOverrides: AllOverrides;
  currentPage: string;
  setCurrentPage: (p: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
  toggleBuilder: () => void;
  selectElement: (path: string | null) => void;
  setHovered: (path: string | null) => void;
  setDragged: (path: string | null) => void;
  setPanel: (panel: BuilderState["panel"]) => void;
  getOverrides: (pageName: string) => PageOverrides;
  getSectionOverride: (pageName: string, path: string) => SectionOverride | undefined;
  updateStyle: (pageName: string, path: string, style: Partial<StyleOverrides>) => void;
  updateContent: (pageName: string, path: string, content: Partial<ContentOverrides>) => void;
  hideSection: (pageName: string, path: string, hidden: boolean) => void;
  resetPage: (pageName: string) => void;
  reorderSection: (pageName: string, fromPath: string, toPath: string) => void;
};

const BuilderContext = createContext<BuilderCtx | null>(null);

export function useBuilder(): BuilderCtx {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    return useLocalBuilder();
  }
  return ctx;
}

// ============= PROVIDER =============

export function BuilderProvider({ children }: { children: ReactNode }) {
  return (
    <BuilderContext.Provider value={useLocalBuilder()}>
      {children}
    </BuilderContext.Provider>
  );
}

// ============= LOCAL HOOK =============

function useLocalBuilder(): BuilderCtx {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      if (typeof sessionStorage === "undefined") return false;
      return sessionStorage.getItem("wp-builder-admin") === "true";
    } catch {
      return false;
    }
  });
  const [state, setState] = useState<BuilderState>({
    isActive: false,
    selectedPath: null,
    hoveredPath: null,
    draggedPath: null,
    panel: null,
  });
  const [allOverrides, setAllOverrides] = useState<AllOverrides>(() => loadAll());
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Sync from sessionStorage on every mount
  useEffect(() => {
    try {
      if (typeof sessionStorage === "undefined") return;
      const v = sessionStorage.getItem("wp-builder-admin") === "true";
      if (v !== isAdmin) setIsAdmin(v);
    } catch {
      // ignore
    }
  }, [isAdmin]);

  useEffect(() => {
    setAllOverrides(loadAll());
  }, []);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("wp-builder-admin", "true");
        }
      } catch (e) {
        console.warn("[builderStore] sessionStorage write failed", e);
      }
      setIsAdmin(true);
      if (typeof window !== "undefined" && (window as unknown as { __WPI_DEBUG__?: boolean }).__WPI_DEBUG__) {
        console.log("[builderStore] login OK, isAdmin=true, sessionStorage set");
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem("wp-builder-admin");
      }
    } catch {
      // ignore
    }
    setIsAdmin(false);
    setState((s) => ({ ...s, isActive: false }));
  }, []);

  const toggleBuilder = useCallback(() => {
    setState((s) => ({ ...s, isActive: !s.isActive, selectedPath: null, panel: null }));
  }, []);

  const selectElement = useCallback((path: string | null) => {
    setState((s) => ({ ...s, selectedPath: path, panel: path ? "style" : null }));
  }, []);

  const setHovered = useCallback((path: string | null) => {
    setState((s) => ({ ...s, hoveredPath: path }));
  }, []);

  const setDragged = useCallback((path: string | null) => {
    setState((s) => ({ ...s, draggedPath: path }));
  }, []);

  const setPanel = useCallback((panel: BuilderState["panel"]) => {
    setState((s) => ({ ...s, panel }));
  }, []);

  const getOverrides = useCallback(
    (pageName: string): PageOverrides => {
      const p = allOverrides[pageName];
      if (p && Array.isArray(p.sections)) return p;
      return { pageName, sections: [], updatedAt: 0 };
    },
    [allOverrides]
  );

  const getSectionOverride = useCallback(
    (pageName: string, path: string): SectionOverride | undefined => {
      const page = allOverrides[pageName];
      if (!page || !Array.isArray(page.sections)) return undefined;
      return page.sections.find((s: SectionOverride) => s && s.path === path);
    },
    [allOverrides]
  );

  const updateStyle = useCallback(
    (pageName: string, path: string, style: Partial<StyleOverrides>) => {
      setAllOverrides((prev) => {
        const page = prev[pageName] || { pageName, sections: [], updatedAt: 0 };
        const safeSections = Array.isArray(page.sections) ? page.sections : [];
        const existingIdx = safeSections.findIndex((s: SectionOverride) => s && s.path === path);
        const existing = safeSections[existingIdx];
        const updated: SectionOverride = {
          id: existing?.id || `${pageName}-${path}-${Date.now()}`,
          type: existing?.type || "section-block",
          path,
          style: { ...(existing?.style || {}), ...style },
          content: existing?.content,
          hidden: existing?.hidden,
          order: existing?.order,
        };
        const sections = [...safeSections];
        if (existingIdx >= 0) sections[existingIdx] = updated;
        else sections.push(updated);
        const next = {
          ...prev,
          [pageName]: { ...page, sections, updatedAt: Date.now() },
        };
        saveAll(next);
        return next;
      });
    },
    []
  );

  const updateContent = useCallback(
    (pageName: string, path: string, content: Partial<ContentOverrides>) => {
      setAllOverrides((prev) => {
        const page = prev[pageName] || { pageName, sections: [], updatedAt: 0 };
        const safeSections = Array.isArray(page.sections) ? page.sections : [];
        const existingIdx = safeSections.findIndex((s: SectionOverride) => s && s.path === path);
        const existing = safeSections[existingIdx];
        const updated: SectionOverride = {
          id: existing?.id || `${pageName}-${path}-${Date.now()}`,
          type: existing?.type || "section-block",
          path,
          style: existing?.style,
          content: { ...(existing?.content || {}), ...content },
          hidden: existing?.hidden,
          order: existing?.order,
        };
        const sections = [...safeSections];
        if (existingIdx >= 0) sections[existingIdx] = updated;
        else sections.push(updated);
        const next = {
          ...prev,
          [pageName]: { ...page, sections, updatedAt: Date.now() },
        };
        saveAll(next);
        return next;
      });
    },
    []
  );

  const resetPage = useCallback((pageName: string) => {
    setAllOverrides((prev) => {
      const next = { ...prev };
      delete next[pageName];
      saveAll(next);
      return next;
    });
  }, []);

  const reorderSection = useCallback((pageName: string, fromPath: string, toPath: string) => {
    setAllOverrides((prev) => {
      const page = prev[pageName] || { pageName, sections: [], updatedAt: 0 };
      const sections = Array.isArray(page.sections) ? [...page.sections] : [];
      const fromIdx = sections.findIndex((s: SectionOverride) => s && s.path === fromPath);
      const toIdx = sections.findIndex((s: SectionOverride) => s && s.path === toPath);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = sections.splice(fromIdx, 1);
      sections.splice(toIdx, 0, moved);
      const next = {
        ...prev,
        [pageName]: { ...page, sections, updatedAt: Date.now() },
      };
      saveAll(next);
      return next;
    });
  }, []);

  const hideSection = useCallback((pageName: string, path: string, hidden: boolean) => {
    setAllOverrides((prev) => {
      const page = prev[pageName] || { pageName, sections: [], updatedAt: 0 };
      const safeSections = Array.isArray(page.sections) ? page.sections : [];
      const existingIdx = safeSections.findIndex((s: SectionOverride) => s && s.path === path);
      const existing = safeSections[existingIdx];
      const updated: SectionOverride = {
        id: existing?.id || `${pageName}-${path}-${Date.now()}`,
        type: existing?.type || "section-block",
        path,
        style: existing?.style,
        content: existing?.content,
        hidden,
        order: existing?.order,
      };
      const sections = [...safeSections];
      if (existingIdx >= 0) sections[existingIdx] = updated;
      else sections.push(updated);
      const next = {
        ...prev,
        [pageName]: { ...page, sections, updatedAt: Date.now() },
      };
      saveAll(next);
      return next;
    });
  }, []);

  return {
    isAdmin,
    state,
    allOverrides,
    currentPage,
    setCurrentPage,
    login,
    logout,
    toggleBuilder,
    selectElement,
    setHovered,
    setDragged,
    setPanel,
    getOverrides,
    getSectionOverride,
    updateStyle,
    updateContent,
    resetPage,
    reorderSection,
    hideSection,
  };
}

export type BuilderContext = BuilderCtx;
