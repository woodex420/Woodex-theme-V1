// Main Admin Application - ties together login, layout, and all admin pages

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useState, useEffect } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout, type AdminPage } from "./AdminLayout";

// Admin error boundary to gracefully handle any errors
class AdminErrorBoundary extends Component<{ children: ReactNode; onHome: () => void }, { error: Error | null }> {
  constructor(props: { children: ReactNode; onHome: () => void }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Admin error:", error, info);
    // Try to recover by clearing localStorage if it's a data error
    try {
      const key = Object.keys(localStorage).find((k) => k.includes("wp-content-store"));
      if (key) {
        console.warn("Clearing potentially corrupt content store");
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-card shadow-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="font-serif text-2xl text-heading mb-2">Something went wrong</h1>
            <p className="text-sm text-text-gray mb-1">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <p className="text-xs text-text-gray/70 mb-4">
              The page data has been reset. Please try again.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  this.setState({ error: null });
                  window.location.reload();
                }}
                className="flex-1 btn btn-gold justify-center !text-xs"
              >
                Reload
              </button>
              <button onClick={this.props.onHome} className="flex-1 btn btn-outline justify-center !text-xs">
                Go Home
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-text-gray cursor-pointer">Details</summary>
                <pre className="mt-2 p-3 bg-cream-50 rounded text-[9px] text-text-gray overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useContentStore } from "../../lib/contentStore";
import { getCurrentSession, type LoginSession } from "../../lib/auth";
import {
  DashboardPage,
  ServicesPage,
  BlogPage,
  TestimonialsPage,
  ContactsPage,
  MediaPage,
  UsersPage,
  SettingsPage,
  ProfilePage,
  BuilderAdminPage,
} from "./AdminPages";
import { PagesAdmin } from "./PagesAdmin";
import { HeaderFooterAdmin } from "./HeaderFooterAdmin";
import { SupportAdmin } from "./SupportAdmin";
import { ProjectsAdmin } from "./ProjectsAdmin";
import { QAPanel } from "./QAPanel";
import { SocialAdmin } from "./SocialAdmin";
import { ThemeAdmin } from "./ThemeAdmin";

export function AdminApp() {
  // Initialize session from storage synchronously so we don't flash the login form
  const [session, setSession] = useState<LoginSession | null>(() => {
    try {
      return getCurrentSession();
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState<AdminPage>("dashboard");
  // Note: PagesAdmin, HeaderFooterAdmin are loaded directly (not lazy) since they are commonly used
  const api = useContentStore();

  // Re-check session on focus (in case logged in from another tab)
  useEffect(() => {
    const onFocus = () => setSession(getCurrentSession());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Handle hash-based admin routing
  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("admin")) {
      const sub = hash.replace("admin", "").replace(/^\//, "").split("/")[0];
      if (sub) {
        const valid: AdminPage[] = ["dashboard", "projects", "services", "blog", "testimonials", "contacts", "media", "users", "settings", "profile", "builder"];
        if (valid.includes(sub as AdminPage)) {
          setPage(sub as AdminPage);
        }
      }
    }
  }, []);

  const handleNavigate = (p: AdminPage) => {
    setPage(p);
    window.location.hash = p === "dashboard" ? "#/admin" : `#/admin/${p}`;
  };

  const handleLogin = (s: LoginSession) => {
    setSession(s);
    window.location.hash = "#/admin";
  };

  const handleLogout = () => {
    window.location.hash = "#/";
    window.location.reload();
  };

  if (!session) {
    return <AdminLogin onSuccess={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage api={api} onNavigate={(p) => handleNavigate(p as AdminPage)} />;
      case "projects":
        return <ProjectsAdmin />;
      case "services":
        return <ServicesPage api={api} />;
      case "blog":
        return <BlogPage api={api} />;
      case "testimonials":
        return <TestimonialsPage api={api} />;
      case "support":
        return <SupportAdmin />;
      case "contacts":
        return <ContactsPage api={api} />;
      case "media":
        return <MediaPage api={api} />;
      case "users":
        return <UsersPage />;
      case "settings":
        return <SettingsPage api={api} />;
      case "social":
        return <SocialAdmin />;
      case "qa":
        return <QAPanel />;
      case "profile":
        return <ProfilePage session={session} onLogout={handleLogout} />;
      case ("pages" as never):
        return <PagesAdmin />;
      case ("header-footer" as never):
        return <HeaderFooterAdmin />;
      case ("theme" as never):
        return <ThemeAdmin />;
      case "builder":
        return <BuilderAdminPage />;
      default:
        return <DashboardPage api={api} onNavigate={(p) => handleNavigate(p as AdminPage)} />;
    }
  };

  return (
    <AdminErrorBoundary onHome={() => { window.location.hash = "#/"; window.location.reload(); }}>
      <AdminLayout
        page={page}
        onPageChange={handleNavigate}
        onExit={handleLogout}
      >
        {renderPage()}
      </AdminLayout>
    </AdminErrorBoundary>
  );
}
