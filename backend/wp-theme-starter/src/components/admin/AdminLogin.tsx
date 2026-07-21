// Admin Login Page

import { useState } from "react";
import { login, type LoginSession } from "../../lib/auth";
import { IconArrowRight, IconCheck } from "../Icons";

export function AdminLogin({ onSuccess }: { onSuccess: (s: LoginSession) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (result.ok && result.session) {
        onSuccess(result.session);
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    }, 400); // small delay for UX
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-espresso font-serif text-3xl font-semibold">W</span>
          </div>
          <h1 className="font-serif text-3xl text-white mb-2">WP Interior Admin</h1>
          <p className="text-cream-100/70 text-sm">Sign in to manage your studio's content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-card shadow-elevated p-8"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-text-gray font-semibold mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-text-gray font-semibold mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 btn btn-gold justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-espresso border-t-transparent animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4" />
                SIGN IN
                <IconArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] text-text-gray hover:text-gold uppercase tracking-widest font-semibold"
            >
              {showHint ? "Hide demo credentials" : "Show demo credentials"}
            </button>
            {showHint && (
              <div className="mt-3 space-y-2 text-left">
                {[
                  { u: "admin", p: "wpinterior2024", r: "Admin (full access)" },
                  { u: "editor", p: "editor2025", r: "Editor (content only)" },
                  { u: "demo", p: "demo123", r: "Viewer (read only)" },
                ].map((c) => (
                  <button
                    key={c.u}
                    type="button"
                    onClick={() => fillDemo(c.u, c.p)}
                    className="w-full p-2.5 rounded-md bg-cream-50 hover:bg-gold/10 border border-border text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-heading">
                          {c.u} / {c.p}
                        </div>
                        <div className="text-[10px] text-text-gray mt-0.5">{c.r}</div>
                      </div>
                      <span className="text-[10px] text-gold uppercase tracking-widest font-bold">Use</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="text-center mt-6">
          <a
            href="#/"
            className="text-cream-100/60 hover:text-gold text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <IconArrowRight className="w-3 h-3 rotate-180" />
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
