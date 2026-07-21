// Enhanced Live Builder - Actually works on the live site
// Provides inline editing, drag-drop, style panel, and persistent storage

import { useState, useEffect } from "react";
import { useBuilder } from "../lib/builderStore.tsx";
import { BuilderPanel } from "./BuilderPanel";
import { BuilderGuide } from "./BuilderGuide";
import {
  IconCube,
  IconClose,
  IconCheck,
} from "./Icons";
import { cn } from "../utils/cn";

export function EnhancedBuilderWrapper({ children }: { children: React.ReactNode }) {
  const ctx = useBuilder();
  const { isAdmin, state, login, logout, toggleBuilder, setCurrentPage } = ctx;
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  // Track current page
  useEffect(() => {
    const updatePage = () => {
      const path = window.location.hash.replace(/^#\/?/, "").split("/")[0] || "home";
      setCurrentPage(path);
    };
    updatePage();
    window.addEventListener("hashchange", updatePage);
    return () => window.removeEventListener("hashchange", updatePage);
  }, [setCurrentPage]);

  // Keyboard shortcut: Cmd/Ctrl+Shift+B
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "B") {
        e.preventDefault();
        if (isAdmin) toggleBuilder();
      }
      if (e.key === "Escape" && state.isActive) {
        toggleBuilder();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin, state.isActive, toggleBuilder]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setShowLogin(false);
      setPassword("");
      setError("");
      setTimeout(() => toggleBuilder(), 100);
    } else {
      setError("Incorrect password");
    }
  };

  const closeGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem("wp-builder-guide-seen", "true");
  };

  return (
    <>
      {children}

      {/* BUILDER MODE: visual indicators when active */}
      {isAdmin && state.isActive && (
        <>
          {/* Top bar with current page */}
          <div className="fixed top-0 left-0 right-0 z-[95] bg-espresso text-white py-2.5 px-4 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
                <IconCube className="w-4 h-4 text-espresso" />
              </div>
              <div>
                <div className="font-serif text-sm">Live Builder Active</div>
                <div className="text-[10px] text-cream-100/60">
                  Editing: {ctx.currentPage} · Click any element to select
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm("Exit builder mode? Your changes are saved.")) {
                    toggleBuilder();
                  }
                }}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1.5"
              >
                <IconClose className="w-3 h-3" />
                Exit Builder
              </button>
            </div>
          </div>

          {/* Builder mode styles - injected globally */}
          <style>{`
            .wpi-editable {
              cursor: pointer !important;
              transition: outline 0.15s ease;
              outline: 2px solid transparent;
              outline-offset: 4px;
              position: relative;
            }
            .wpi-editable:hover {
              outline: 2px solid #C6A15B !important;
              outline-offset: 2px;
            }
            .wpi-editable.wpi-selected {
              outline: 2px solid #C6A15B !important;
              outline-offset: 4px;
            }
            .wpi-editable.wpi-section {
              outline: 2px dashed transparent;
              outline-offset: -2px;
            }
            .wpi-editable.wpi-section:hover {
              outline: 2px dashed #C6A15B !important;
            }
            .wpi-editable.wpi-section.wpi-selected {
              outline: 2px dashed #C6A15B !important;
            }
          `}</style>
        </>
      )}

      {/* Floating builder button (admin only) */}
      {isAdmin && (
        <button
          onClick={toggleBuilder}
          className={cn(
            "fixed bottom-6 left-6 z-[90] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
            state.isActive
              ? "bg-espresso text-white scale-110"
              : "bg-gold text-espresso hover:scale-110"
          )}
          title="Toggle Live Builder (Cmd+Shift+B)"
        >
          {state.isActive ? (
            <IconClose className="w-6 h-6" />
          ) : (
            <IconCube className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Builder panel */}
      {isAdmin && state.isActive && <BuilderPanel ctx={ctx} onClose={toggleBuilder} />}

      {/* First-time guide */}
      {isAdmin && state.isActive && showGuide && <BuilderGuide onClose={closeGuide} />}

      {/* Admin login modal */}
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
              <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                <IconCube className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-serif text-2xl text-heading mb-2">Live Builder Access</h2>
              <p className="text-sm text-text-gray">Enter the admin password to access the live drag-and-drop page builder.</p>
              <p className="text-[10px] text-gold mt-2 font-mono">Demo: wpinterior2024</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors mb-2"
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
                ACCESS BUILDER
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin status badge */}
      {isAdmin && !state.isActive && (
        <div className="fixed top-24 left-6 z-[80] bg-espresso/90 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 shadow-lg backdrop-blur">
          <IconCube className="w-3 h-3" />
          Builder Active
          <button onClick={logout} className="ml-2 hover:text-gold">
            <IconClose className="w-3 h-3" />
          </button>
        </div>
      )}
    </>
  );
}
