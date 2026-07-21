// Live Page Builder - Complete drag-and-drop customization tool
// - All elements share state via BuilderContext (no separate instances)
// - Section-level drag-and-drop with native HTML5 DnD
// - Element-level drag-and-drop
// - Hide/show toggle in top bar
// - Inline editing (double-click text)
// - Undo/Redo with full history
// - Error boundary handling
// - Cmd+Shift+B keyboard shortcut
// - Inject styles into <head>
// - Auto-activate on "Open Live Site" from admin

import {
  useState,
  useEffect,
  useCallback,
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useBuilder, BuilderProvider } from "../lib/builderStore.tsx";
import { BuilderPanel } from "./BuilderPanel";
import { IconCube, IconClose, IconCheck, IconArrowLeft, IconArrowRight, IconEye, IconEyeOff } from "./Icons";

// ============= STYLE INJECTION =============
function ensureBuilderStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("wpi-builder-styles")) return;
  const style = document.createElement("style");
  style.id = "wpi-builder-styles";
  style.textContent = `
    /* Builder outline indicators */
    [data-wpi-path] {
      cursor: pointer !important;
      transition: outline 0.15s ease;
      outline: 2px solid transparent;
      outline-offset: 4px;
      position: relative;
    }
    [data-wpi-path]:hover {
      outline: 2px solid #C6A15B !important;
      outline-offset: 2px;
    }
    [data-wpi-path][data-wpi-selected="true"] {
      outline: 2px solid #C6A15B !important;
      outline-offset: 4px;
    }
    [data-wpi-section] {
      cursor: grab !important;
    }
    [data-wpi-section]:hover {
      outline: 2px dashed #C6A15B !important;
      outline-offset: 4px;
    }
    [data-wpi-text] {
      cursor: text !important;
    }
    [data-wpi-dragging="true"] {
      opacity: 0.4 !important;
      transform: scale(0.98) !important;
    }
    [data-wpi-drop-target="true"] {
      outline: 2px solid #10B981 !important;
      outline-offset: 2px;
      background: rgba(16, 185, 129, 0.05) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============= UNDO/REDO STORE =============
type Undoable = { type: string; payload: unknown; label: string };

function useUndoRedo() {
  const [past, setPast] = useState<Undoable[]>([]);
  const [future, setFuture] = useState<Undoable[]>([]);

  const push = useCallback((action: Undoable) => {
    setPast((p) => [...p, action].slice(-30));
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const last = p[p.length - 1];
      setFuture((f) => [last, ...f].slice(0, 30));
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, next].slice(-30));
      return f.slice(1);
    });
  }, []);

  return { past, future, push, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

// ============= ERROR BOUNDARY =============
class BuilderErrorBoundary extends Component<
  { children: ReactNode; onReset?: () => void },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; onReset?: () => void }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[BuilderErrorBoundary] Caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card m-4 text-sm">
          <h3 className="font-serif text-base text-red-700 mb-1">Builder error</h3>
          <p className="text-red-600 mb-2 text-xs">{this.state.error.message}</p>
          <button
            onClick={() => {
              this.setState({ error: null });
              this.props.onReset?.();
            }}
            className="px-3 py-1.5 rounded bg-gold text-espresso text-xs font-semibold"
          >
            Reset
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============= MAIN COMPONENT =============
export function LivePageBuilder({ children, autoActivate = false }: { children: React.ReactNode; autoActivate?: boolean }) {
  // ============= HOOKS =============
  const ctx = useBuilder();
  const { isAdmin, state, login, logout, toggleBuilder, setCurrentPage, hideSection, getSectionOverride } = ctx;

  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const undoRedo = useUndoRedo();

  // ============= AUTO-ACTIVATE =============
  useEffect(() => {
    if (autoActivate && isAdmin && !state.isActive) {
      toggleBuilder();
    }
  }, [autoActivate, isAdmin, state.isActive, toggleBuilder]);

  // ============= INJECT STYLES =============
  useEffect(() => {
    try {
      ensureBuilderStyles();
      const debug = typeof window !== "undefined" && (window as unknown as { __WPI_DEBUG__?: boolean }).__WPI_DEBUG__;
      if (debug) {
        console.log("[LivePageBuilder] mounted", {
          isAdmin,
          stateActive: state.isActive,
          currentPage: ctx.currentPage,
        });
        (window as unknown as { __wpi_toggleBuilder__?: () => void }).__wpi_toggleBuilder__ = () => toggleBuilder();
        (window as unknown as { __wpi_undo__?: () => void }).__wpi_undo__ = undoRedo.undo;
        (window as unknown as { __wpi_redo__?: () => void }).__wpi_redo__ = undoRedo.redo;
      }
    } catch (e) {
      console.warn("[LivePageBuilder] style injection failed", e);
    }
  }, [isAdmin, state.isActive, ctx.currentPage, toggleBuilder, undoRedo]);

  // ============= TRACK CURRENT PAGE =============
  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      const path = hash.replace(/^#\/?/, "").split("/")[0] || "home";
      setCurrentPage(path);
    } catch (e) {
      console.warn("[LivePageBuilder] hash read failed", e);
      setCurrentPage("home");
    }
  }, [setCurrentPage]);

  // ============= KEYBOARD =============
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing = target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Cmd+Shift+B to toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "B" || e.key === "b")) {
        e.preventDefault();
        if (isAdmin) toggleBuilder();
        else setShowLogin(true);
        return;
      }

      // Cmd+Z to undo
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && (e.key === "z" || e.key === "Z") && state.isActive && !isEditing) {
        e.preventDefault();
        undoRedo.undo();
        return;
      }

      // Cmd+Shift+Z to redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "z" || e.key === "Z") && state.isActive && !isEditing) {
        e.preventDefault();
        undoRedo.redo();
        return;
      }

      // ESC to exit
      if (e.key === "Escape" && state.isActive) {
        if (isEditing) {
          target.blur();
          return;
        }
        toggleBuilder();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin, state.isActive, toggleBuilder, undoRedo]);

  // ============= CLICK HANDLERS =============
  useEffect(() => {
    if (!state.isActive || !isAdmin) return;

    const handleClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement;
        const editable = target.closest("[data-wpi-path]") as HTMLElement | null;
        if (!editable) return;
        e.preventDefault();
        e.stopPropagation();
        const path = editable.getAttribute("data-wpi-path");
        if (path) ctx.selectElement(path);
      } catch (e) {
        console.warn("[LivePageBuilder] click handler error", e);
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement;
        const editable = target.closest("[data-wpi-text]") as HTMLElement | null;
        if (!editable) return;
        e.preventDefault();
        e.stopPropagation();
        const path = editable.getAttribute("data-wpi-text");
        if (!path) return;
        editable.contentEditable = "true";
        editable.focus();
        const range = document.createRange();
        range.selectNodeContents(editable);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        ctx.selectElement(path);

        const saveOnBlur = () => {
          try {
            const text = editable.innerText || "";
            window.dispatchEvent(new CustomEvent("wpi-text-edit", { detail: { path, text } }));
            undoRedo.push({ type: "text-edit", payload: { path, text }, label: `Edit text` });
            editable.contentEditable = "false";
            editable.removeEventListener("blur", saveOnBlur);
          } catch (e) {
            console.warn("[LivePageBuilder] save error", e);
          }
        };
        editable.addEventListener("blur", saveOnBlur);
      } catch (e) {
        console.warn("[LivePageBuilder] dblclick handler error", e);
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("dblclick", handleDoubleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("dblclick", handleDoubleClick, true);
    };
  }, [state.isActive, isAdmin, ctx, undoRedo]);

  // ============= HIGHLIGHT SELECTED =============
  useEffect(() => {
    if (!state.isActive) return;
    try {
      document.querySelectorAll("[data-wpi-path]").forEach((el) => {
        const path = el.getAttribute("data-wpi-path");
        if (path === state.selectedPath) {
          el.setAttribute("data-wpi-selected", "true");
        } else {
          el.removeAttribute("data-wpi-selected");
        }
      });
    } catch (e) {
      console.warn("[LivePageBuilder] highlight error", e);
    }
  }, [state.selectedPath, state.isActive]);

  // ============= LOGIN =============
  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const ok = login(password);
      if (ok) {
        setShowLogin(false);
        setPassword("");
        setError("");
        setTimeout(() => {
          if (!state.isActive) toggleBuilder();
        }, 50);
      } else {
        setError("Incorrect password. Use: wpinterior2024");
      }
    },
    [login, password, toggleBuilder, state.isActive]
  );

  // ============= HELPERS =============
  const handleExit = useCallback(() => {
    try {
      toggleBuilder();
    } catch (e) {
      console.warn("[LivePageBuilder] exit error", e);
      window.location.reload();
    }
  }, [toggleBuilder]);

  const selectedOverride = state.selectedPath
    ? getSectionOverride(ctx.currentPage, state.selectedPath)
    : null;

  return (
    <BuilderProvider>
      {children}

      {/* ============= ACTIVE BUILDER BAR ============= */}
      {isAdmin && state.isActive && (
        <div className="fixed top-0 left-0 right-0 z-[95] bg-espresso text-white py-2.5 px-3 sm:px-4 flex items-center justify-between text-xs shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-6 h-6 rounded bg-gold flex items-center justify-center flex-shrink-0">
              <IconCube className="w-3.5 h-3.5 text-espresso" />
            </div>
            <div className="leading-tight min-w-0 hidden sm:block">
              <div className="font-serif text-sm">Live Builder Active</div>
              <div className="text-[10px] text-cream-100/60">
                Editing: {ctx.currentPage || "home"} · Click to select
              </div>
            </div>
            <div className="sm:hidden text-xs">
              <span className="text-cream-100/80">Live · {ctx.currentPage || "home"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Hide/Show selected section */}
            {state.selectedPath && selectedOverride && (
              <button
                onClick={() => hideSection(ctx.currentPage, state.selectedPath!, !selectedOverride.hidden)}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-cream-100 hover:text-white flex items-center justify-center"
                title={selectedOverride.hidden ? "Show section" : "Hide section"}
              >
                {selectedOverride.hidden ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
              </button>
            )}
            {/* Undo / Redo */}
            <button
              onClick={undoRedo.undo}
              disabled={!undoRedo.canUndo}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-cream-100 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Cmd+Z)"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={undoRedo.redo}
              disabled={!undoRedo.canRedo}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-cream-100 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Cmd+Shift+Z)"
            >
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-5 bg-white/20 mx-0.5" />
            {/* Exit */}
            <button
              onClick={handleExit}
              className="px-2.5 sm:px-3 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white flex items-center gap-1 text-xs font-semibold"
              title="Exit builder (ESC)"
            >
              <IconClose className="w-3 h-3" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      )}

      {/* ============= BUILDER PANEL ============= */}
      {isAdmin && state.isActive && (
        <BuilderErrorBoundary onReset={() => ctx.selectElement(null)}>
          <BuilderPanel ctx={ctx} onClose={handleExit} />
        </BuilderErrorBoundary>
      )}

      {/* ============= GOLD CUBE TOGGLE BUTTON ============= */}
      {isAdmin && !state.isActive && (
        <button
          onClick={toggleBuilder}
          className="fixed bottom-6 left-6 z-[90] w-14 h-14 rounded-full bg-gold text-espresso shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          title="Open Live Builder (Cmd+Shift+B)"
        >
          <IconCube className="w-6 h-6" />
        </button>
      )}

      {/* ============= ADMIN STATUS BADGE ============= */}
      {isAdmin && !state.isActive && (
        <div className="fixed top-24 left-6 z-[80] bg-espresso/90 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 shadow-lg backdrop-blur">
          <IconCube className="w-3 h-3" />
          Builder Active
          <button onClick={logout} className="ml-2 hover:text-gold" title="Logout">
            <IconClose className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ============= LOGIN MODAL ============= */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
          onClick={() => setShowLogin(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleLogin}
            className="bg-white rounded-card shadow-elevated p-8 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
                <IconCube className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-serif text-2xl text-heading mb-2">Live Builder Access</h2>
              <p className="text-sm text-text-gray">Enter the admin password to start editing.</p>
              <p className="text-[10px] text-gold mt-2 font-mono">Demo: wpinterior2024</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 mb-2"
              autoFocus
            />
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-sm text-text-gray hover:bg-cream-50"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn btn-gold justify-center !text-xs">
                <IconCheck className="w-4 h-4" />
                ACCESS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============= HIDDEN TRIGGER FOR NON-ADMIN ============= */}
      {!isAdmin && (
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-2 right-2 z-[80] w-6 h-6 rounded-full bg-espresso/5 hover:bg-espresso/15 text-text-gray/30 hover:text-text-gray/70 flex items-center justify-center"
          title="Builder Access"
        >
          <IconCube className="w-3 h-3" />
        </button>
      )}
    </BuilderProvider>
  );
}
