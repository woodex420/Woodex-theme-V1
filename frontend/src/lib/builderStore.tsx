import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { AllOverrides, BuilderState, PageOverrides, SectionOverride, StyleOverrides, ContentOverrides } from './builderTypes';

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const STORAGE_KEY = 'woodex-builder-overrides';
const BUILDER_PASSWORD = 'woodex2024';
const SESSION_KEY = 'woodex-builder-admin';
const BUILDER_ENABLED_KEY = 'woodex-builder-enabled';

/* ================================================================== */
/*  Persistence Helpers                                                */
/* ================================================================== */

function loadAll(): AllOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    // Sanitize: ensure each page has valid sections array
    const clean: AllOverrides = {};
    for (const [key, val] of Object.entries(parsed)) {
      const page = val as PageOverrides;
      if (page?.pageName && Array.isArray(page.sections)) {
        clean[key] = page;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

function saveAll(data: AllOverrides): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded — silently fail
  }
}

function uid(): string {
  return `ov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ================================================================== */
/*  Context Types                                                      */
/* ================================================================== */

interface BuilderCtx {
  isAdmin: boolean;
  builderEnabled: boolean;
  state: BuilderState;
  allOverrides: AllOverrides;
  currentPage: string;
  // Auth
  login: (password: string) => boolean;
  logout: () => void;
  // Builder enable/disable (dashboard toggle)
  enableBuilder: () => void;
  disableBuilder: () => void;
  // Builder control
  toggleBuilder: () => void;
  setCurrentPage: (page: string) => void;
  // Element interaction
  selectElement: (path: string | null) => void;
  setHovered: (path: string | null) => void;
  setPanel: (panel: 'style' | 'content' | null) => void;
  // Override CRUD
  getOverride: (page: string, path: string) => SectionOverride | undefined;
  getPageOverrides: (page: string) => PageOverrides;
  updateStyle: (page: string, path: string, partial: StyleOverrides) => void;
  updateContent: (page: string, path: string, partial: ContentOverrides) => void;
  hideSection: (page: string, path: string, hidden: boolean) => void;
  reorderSection: (page: string, sourcePath: string, targetPath: string) => void;
  resetElement: (page: string, path: string) => void;
  resetPage: (page: string) => void;
  clearAll: () => void;
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  // Import/Export
  exportOverrides: () => string;
  importOverrides: (json: string) => void;
}

const BuilderContext = createContext<BuilderCtx | null>(null);

/* ================================================================== */
/*  Provider                                                           */
/* ================================================================== */

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [builderEnabled, setBuilderEnabled] = useState(() => localStorage.getItem(BUILDER_ENABLED_KEY) === 'true');
  const [state, setState] = useState<BuilderState>({
    isActive: false,
    selectedPath: null,
    hoveredPath: null,
    panel: null,
  });
  const [allOverrides, setAllOverrides] = useState<AllOverrides>(() => loadAll());
  const [currentPage, setCurrentPage] = useState('home');
  const [undoStack, setUndoStack] = useState<AllOverrides[]>([]);
  const [redoStack, setRedoStack] = useState<AllOverrides[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_HISTORY = 50;

  // Push current state to undo stack before mutations
  const withHistory = useCallback((mutator: (prev: AllOverrides) => AllOverrides) => {
    setAllOverrides((prev) => {
      // Save previous state to undo stack
      setUndoStack((stack) => [...stack.slice(-(MAX_HISTORY - 1)), prev]);
      // Clear redo stack on new action
      setRedoStack([]);
      // Apply mutation
      return mutator(prev);
    });
  }, []);

  // Undo/Redo
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((stack) => [...stack, allOverrides]);
    setUndoStack((stack) => stack.slice(0, -1));
    setAllOverrides(prev);
  }, [undoStack, allOverrides]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((stack) => [...stack, allOverrides]);
    setRedoStack((stack) => stack.slice(0, -1));
    setAllOverrides(next);
  }, [redoStack, allOverrides]);

  // Debounced save
  const debouncedSave = useCallback((data: AllOverrides) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveAll(data), 300);
  }, []);

  // Auto-save when overrides change
  useEffect(() => {
    debouncedSave(allOverrides);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [allOverrides, debouncedSave]);

  // ─── Auth ──────────────────────────────────────────────
  const login = useCallback((password: string): boolean => {
    if (password === BUILDER_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem(SESSION_KEY);
    setState((s) => ({ ...s, isActive: false, selectedPath: null, panel: null }));
  }, []);

  // ─── Builder Enable/Disable (dashboard control) ──────────
  const enableBuilder = useCallback(() => {
    setBuilderEnabled(true);
    localStorage.setItem(BUILDER_ENABLED_KEY, 'true');
  }, []);

  const disableBuilder = useCallback(() => {
    setBuilderEnabled(false);
    localStorage.setItem(BUILDER_ENABLED_KEY, 'false');
    // Also deactivate builder if active
    setState((s) => ({ ...s, isActive: false, selectedPath: null, panel: null }));
  }, []);

  // ─── Builder Control ───────────────────────────────────
  const toggleBuilder = useCallback(() => {
    setState((s) => ({
      ...s,
      isActive: !s.isActive,
      selectedPath: null,
      panel: null,
    }));
  }, []);

  // ─── Element Interaction ───────────────────────────────
  const selectElement = useCallback((path: string | null) => {
    setState((s) => ({
      ...s,
      selectedPath: path,
      panel: path ? (s.panel || 'style') : null,
    }));
  }, []);

  const setHovered = useCallback((path: string | null) => {
    setState((s) => ({ ...s, hoveredPath: path }));
  }, []);

  const setPanel = useCallback((panel: 'style' | 'content' | null) => {
    setState((s) => ({ ...s, panel }));
  }, []);

  // ─── Override CRUD ─────────────────────────────────────
  const getOrCreatePage = useCallback((data: AllOverrides, page: string): PageOverrides => {
    if (!data[page]) {
      data[page] = { pageName: page, sections: [], updatedAt: Date.now() };
    }
    return data[page];
  }, []);

  const getOverride = useCallback((page: string, path: string): SectionOverride | undefined => {
    const pageData = allOverrides[page];
    return pageData?.sections.find((s) => s.path === path);
  }, [allOverrides]);

  const getPageOverrides = useCallback((page: string): PageOverrides => {
    return allOverrides[page] || { pageName: page, sections: [], updatedAt: 0 };
  }, [allOverrides]);

  const updateStyle = useCallback((page: string, path: string, partial: StyleOverrides) => {
    withHistory((prev) => {
      const next = { ...prev };
      const pageData = getOrCreatePage(next, page);
      const existing = pageData.sections.find((s) => s.path === path);
      if (existing) {
        existing.style = { ...existing.style, ...partial };
        existing.updatedAt = Date.now();
      } else {
        pageData.sections.push({
          id: uid(),
          type: 'text',
          path,
          style: partial,
          updatedAt: Date.now(),
        } as SectionOverride);
      }
      pageData.updatedAt = Date.now();
      return next;
    });
  }, [withHistory, getOrCreatePage]);

  const updateContent = useCallback((page: string, path: string, partial: ContentOverrides) => {
    withHistory((prev) => {
      const next = { ...prev };
      const pageData = getOrCreatePage(next, page);
      const existing = pageData.sections.find((s) => s.path === path);
      if (existing) {
        existing.content = { ...existing.content, ...partial };
      } else {
        pageData.sections.push({
          id: uid(),
          type: 'text',
          path,
          content: partial,
        } as SectionOverride);
      }
      pageData.updatedAt = Date.now();
      return next;
    });
  }, [withHistory, getOrCreatePage]);

  const hideSection = useCallback((page: string, path: string, hidden: boolean) => {
    withHistory((prev) => {
      const next = { ...prev };
      const pageData = getOrCreatePage(next, page);
      const existing = pageData.sections.find((s) => s.path === path);
      if (existing) {
        existing.hidden = hidden;
      } else {
        pageData.sections.push({
          id: uid(),
          type: 'section',
          path,
          hidden,
        } as SectionOverride);
      }
      pageData.updatedAt = Date.now();
      return next;
    });
  }, [withHistory, getOrCreatePage]);

  const reorderSection = useCallback((page: string, sourcePath: string, targetPath: string) => {
    withHistory((prev) => {
      const next = { ...prev };
      const pageData = getOrCreatePage(next, page);
      const sections = pageData.sections;
      const sourceIdx = sections.findIndex((s) => s.path === sourcePath);
      const targetIdx = sections.findIndex((s) => s.path === targetPath);
      if (sourceIdx === -1 || targetIdx === -1 || sourceIdx === targetIdx) return prev;
      const [moved] = sections.splice(sourceIdx, 1);
      sections.splice(targetIdx, 0, moved);
      sections.forEach((s, i) => { s.order = i; });
      pageData.updatedAt = Date.now();
      return next;
    });
  }, [withHistory, getOrCreatePage]);

  const resetElement = useCallback((page: string, path: string) => {
    withHistory((prev) => {
      const next = { ...prev };
      if (next[page]) {
        next[page].sections = next[page].sections.filter((s) => s.path !== path);
        next[page].updatedAt = Date.now();
      }
      return next;
    });
    setState((s) => ({ ...s, selectedPath: null, panel: null }));
  }, [withHistory]);

  const resetPage = useCallback((page: string) => {
    withHistory((prev) => {
      const next = { ...prev };
      delete next[page];
      return next;
    });
    setState((s) => ({ ...s, selectedPath: null, panel: null }));
  }, [withHistory]);

  const clearAll = useCallback(() => {
    withHistory(() => ({}));
    localStorage.removeItem(STORAGE_KEY);
    setState((s) => ({ ...s, selectedPath: null, panel: null }));
  }, [withHistory]);

  // ─── Import/Export ─────────────────────────────────────
  const exportOverridesJSON = useCallback((): string => {
    return JSON.stringify(allOverrides, null, 2);
  }, [allOverrides]);

  const importOverridesJSON = useCallback((json: string) => {
    try {
      const data = JSON.parse(json) as AllOverrides;
      if (typeof data === 'object' && data !== null) {
        withHistory(() => data);
      }
    } catch {
      // Invalid JSON — ignore
    }
  }, [withHistory]);

  // ─── Value ─────────────────────────────────────────────
  const value: BuilderCtx = {
    isAdmin,
    builderEnabled,
    state,
    allOverrides,
    currentPage,
    login,
    logout,
    enableBuilder,
    disableBuilder,
    toggleBuilder,
    setCurrentPage,
    selectElement,
    setHovered,
    setPanel,
    getOverride,
    getPageOverrides,
    updateStyle,
    updateContent,
    hideSection,
    reorderSection,
    resetElement,
    resetPage,
    clearAll,
    undo,
    redo,
    exportOverrides: exportOverridesJSON,
    importOverrides: importOverridesJSON,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

/* ================================================================== */
/*  Hook                                                               */
/* ================================================================== */

export function useBuilder(): BuilderCtx {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider');
  return ctx;
}
