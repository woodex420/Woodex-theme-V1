// Admin Dashboard layout with sidebar navigation and top bar

import { useState, useEffect } from "react";
import {
  IconArrowRight,
  IconClose,
  IconChevronRight,
} from "../Icons";
import { getCurrentSession, logout, type LoginSession } from "../../lib/auth";
import { cn } from "../../utils/cn";

export type AdminPage =
  | "dashboard"
  | "pages"
  | "header-footer"
  | "theme"
  | "builder"
  | "support"
  | "projects"
  | "services"
  | "blog"
  | "testimonials"
  | "contacts"
  | "media"
  | "users"
  | "settings"
  | "social"
  | "qa"
  | "profile";

export type NavItem = {
  id: AdminPage;
  label: string;
  icon: string; // emoji or svg id
  description?: string;
  badge?: string | number;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊", description: "Overview & analytics" },
  { id: "pages", label: "Pages", icon: "📄", description: "Manage pages & section blocks" },
  { id: "header-footer", label: "Header & Footer", icon: "🔝", description: "Nav links, dropdown, footer" },
  { id: "theme", label: "Theme Manager", icon: "🎭", description: "Master theme controls" },
  { id: "builder", label: "Live Builder", icon: "🎨", description: "Drag-and-drop editor" },
  { id: "projects", label: "Projects", icon: "📁", description: "Portfolio & case studies" },
  { id: "services", label: "Services", icon: "⚡", description: "Service offerings" },
  { id: "blog", label: "Blog Posts", icon: "📝", description: "Articles & content" },
  { id: "testimonials", label: "Testimonials", icon: "⭐", description: "Client reviews" },
  { id: "support", label: "Live Support", icon: "💬", description: "WhatsApp, agents, templates" },
  { id: "contacts", label: "Contact Leads", icon: "📧", description: "Form submissions" },
  { id: "media", label: "Media Library", icon: "🖼️", description: "Images & files" },
  { id: "users", label: "Users", icon: "👥", description: "Team management" },
  { id: "social", label: "Social Media", icon: "📱", description: "Accounts, posts, analytics" },
  { id: "settings", label: "Settings", icon: "⚙️", description: "Site configuration" },
  { id: "qa", label: "QA Tests", icon: "✅", description: "Run automated tests" },
];

export function AdminLayout({
  children,
  page,
  onPageChange,
  onExit,
}: {
  children: React.ReactNode;
  page: AdminPage;
  onPageChange: (p: AdminPage) => void;
  onExit: () => void;
}) {
  const [session, setSession] = useState<LoginSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setSession(getCurrentSession());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!session) return null;

  const user = session.user;

  const handleLogout = () => {
    if (confirm("Log out of the admin dashboard?")) {
      logout();
      window.location.hash = "/";
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-espresso text-cream-100 flex flex-col transition-transform duration-300",
          !sidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-espresso font-serif text-lg font-semibold">W</span>
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-serif text-base text-white leading-tight">WP Interior</div>
                <div className="text-[10px] text-cream-100/60 uppercase tracking-widest">Admin</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-7 h-7 rounded-md hover:bg-white/10 text-cream-100/60 hover:text-white flex items-center justify-center lg:hidden"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full mb-1 px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all text-left",
                page === item.id
                  ? "bg-gold text-espresso shadow-md"
                  : "text-cream-100/80 hover:bg-white/8 hover:text-white"
              )}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium leading-tight", page === item.id ? "text-espresso" : "")}>{item.label}</div>
                  {item.description && (
                    <div className={cn("text-[10px] truncate", page === item.id ? "text-espresso/70" : "text-cream-100/50")}>{item.description}</div>
                  )}
                </div>
              )}
              {sidebarOpen && item.badge !== undefined && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  page === item.id ? "bg-espresso text-gold" : "bg-gold/20 text-gold"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        {sidebarOpen && (
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={() => onPageChange("profile")}
              className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-espresso font-serif text-sm font-semibold flex-shrink-0">
                {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{user.fullName}</div>
                <div className="text-[10px] text-cream-100/60 uppercase tracking-widest">{user.role}</div>
              </div>
              <IconChevronRight className="w-4 h-4 text-cream-100/40" />
            </button>
            <div className="flex gap-2 mt-2">
              <button
                onClick={onExit}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cream-100/80 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <IconArrowRight className="w-3 h-3" />
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-200 text-xs flex items-center justify-center transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile sidebar toggle */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed bottom-6 left-6 z-40 lg:hidden w-10 h-10 rounded-full bg-espresso text-white shadow-2xl flex items-center justify-center"
        >
          <IconClose className="w-4 h-4" />
        </button>
      )}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-espresso text-white shadow-2xl flex items-center justify-center flex-shrink-0"
        >
          <IconArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-heading">
              {NAV_ITEMS.find((n) => n.id === page)?.label || "Admin"}
            </h1>
            <p className="text-[11px] text-text-gray hidden sm:block">
              {NAV_ITEMS.find((n) => n.id === page)?.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-xs text-text-gray">
                {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
              <div className="text-[10px] text-text-gray/60">
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <button
              onClick={onExit}
              className="px-3 py-2 rounded-lg border border-border text-xs text-espresso hover:border-gold hover:bg-gold/5 flex items-center gap-1.5 transition-colors"
            >
              <IconArrowRight className="w-3.5 h-3.5" />
              View Site
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

// ============= UI HELPERS =============
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-serif text-2xl text-heading">{title}</h2>
        {description && <p className="text-sm text-text-gray mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  color = "gold",
}: {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: string;
  color?: "gold" | "espresso" | "emerald" | "blue";
}) {
  const colors = {
    gold: "from-gold/15 to-gold/5 text-gold",
    espresso: "from-espresso/10 to-espresso/5 text-espresso",
    emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    blue: "from-blue-500/15 to-blue-500/5 text-blue-600",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="font-serif text-3xl text-heading font-semibold">{value}</div>
      <div className="text-[11px] text-text-gray mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" | "archived" | "new" | "read" | "replied" }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-stone-100 text-stone-600 border-stone-200",
    new: "bg-blue-50 text-blue-700 border-blue-200",
    read: "bg-stone-100 text-stone-600 border-stone-200",
    replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border", styles[status])}>
      {status}
    </span>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <h3 className="font-serif text-xl text-heading mb-2">{title}</h3>
      <p className="text-sm text-text-gray mb-4 max-w-md mx-auto">{message}</p>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };
  return (
    <div
      className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className={cn("bg-white rounded-card shadow-elevated w-full max-h-[90vh] overflow-hidden flex flex-col", sizes[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="font-serif text-lg text-heading">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest text-text-gray font-semibold mb-1.5 block">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-text-gray mt-1">{hint}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
    />
  );
}

export function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors resize-y"
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const variants = {
    primary: "bg-gold text-espresso hover:bg-gold-300",
    secondary: "bg-espresso text-white hover:bg-espresso-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-espresso hover:bg-gold/10 border border-border",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </button>
  );
}
