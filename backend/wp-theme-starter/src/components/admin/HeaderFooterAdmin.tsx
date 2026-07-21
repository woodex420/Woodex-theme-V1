// Admin page for customizing Header, Footer, and Navigation

import { useState } from "react";
import {
  PageHeader,
  Button,
  Modal,
  FormField,
  TextInput,
  SelectInput,
  EmptyState,
} from "./AdminLayout";
import {
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconCopy,
} from "../Icons";
import { cn } from "../../utils/cn";

// ============= TYPES =============
export type NavLink = {
  id: string;
  label: string;
  page: string;
  slug?: string;
  visible: boolean;
  highlight?: boolean;
  order: number;
  children?: NavLink[];
};

export type HeaderConfig = {
  logoText: string;
  logoTagline: string;
  ctaButtonText: string;
  ctaButtonPage: string;
  ctaButtonVisible: boolean;
  transparentBackground: boolean;
  showOnScroll: boolean;
  navLinks: NavLink[];
};

export type FooterConfig = {
  brandDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
  socialLinks: { id: string; platform: string; url: string; visible: boolean }[];
  showNewsletter: boolean;
  showSocial: boolean;
  showAwards: boolean;
  copyrightText: string;
  legalLinks: { id: string; label: string; url: string }[];
};

const STORAGE_KEY = "wp-site-chrome-v1";

const defaultHeader: HeaderConfig = {
  logoText: "WP Interior",
  logoTagline: "Design Studio",
  ctaButtonText: "Free Consultation",
  ctaButtonPage: "consultation",
  ctaButtonVisible: true,
  transparentBackground: true,
  showOnScroll: true,
  navLinks: [
    { id: "n-1", label: "Home", page: "home", visible: true, order: 0 },
    { id: "n-2", label: "About", page: "about", visible: true, order: 1 },
    { id: "n-3", label: "Services", page: "services", visible: true, order: 2 },
    { id: "n-4", label: "3D Studio", page: "studio", visible: true, order: 3 },
    { id: "n-5", label: "Portfolio", page: "portfolio", visible: true, order: 4 },
    { id: "n-6", label: "Journal", page: "blog", visible: true, order: 5 },
    { id: "n-7", label: "Contact", page: "contact", visible: true, order: 6 },
  ],
};

const defaultFooter: FooterConfig = {
  brandDescription: "Pakistan's award-winning interior design company. Crafting timeless spaces where vision meets craftsmanship.",
  newsletterTitle: "The Journal · Monthly",
  newsletterDescription: "Design notes, delivered monthly. Get our best writing on materials, lighting, and 3D visualization.",
  socialLinks: [
    { id: "s-1", platform: "Instagram", url: "https://instagram.com/wpinterior", visible: true },
    { id: "s-2", platform: "LinkedIn", url: "https://linkedin.com/company/wpinterior", visible: true },
    { id: "s-3", platform: "Pinterest", url: "https://pinterest.com/wpinterior", visible: true },
  ],
  showNewsletter: true,
  showSocial: true,
  showAwards: false,
  copyrightText: "© 2025 WP Interior Studio. All rights reserved.",
  legalLinks: [
    { id: "l-1", label: "Privacy", url: "#" },
    { id: "l-2", label: "Terms", url: "#" },
    { id: "l-3", label: "Cookies", url: "#" },
    { id: "l-4", label: "Sitemap", url: "#" },
  ],
};

function loadConfig<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`);
    if (!raw) {
      try {
        localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(fallback));
      } catch {
        // ignore
      }
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveConfig(key: string, value: unknown) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(value));
    }
  } catch {
    // ignore
  }
}

// ============= HEADER EDITOR =============
function HeaderEditor() {
  const [config, setConfig] = useState<HeaderConfig>(() => loadConfig("header", defaultHeader));
  const [saved, setSaved] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const save = () => {
    saveConfig("header", config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateLink = (id: string, patch: Partial<NavLink>) => {
    setConfig({ ...config, navLinks: config.navLinks.map((l) => l.id === id ? { ...l, ...patch } : l) });
  };
  const moveLink = (id: string, direction: -1 | 1) => {
    const sorted = [...config.navLinks].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((l) => l.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    [sorted[idx], sorted[newIdx]] = [sorted[newIdx], sorted[idx]];
    setConfig({ ...config, navLinks: sorted.map((l, i) => ({ ...l, order: i })) });
  };
  const deleteLink = (id: string) => {
    if (!confirm("Delete this navigation link?")) return;
    setConfig({ ...config, navLinks: config.navLinks.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })) });
  };
  const addLink = (data: Omit<NavLink, "id" | "order">) => {
    const id = `n-${Date.now()}`;
    const order = Math.max(0, ...config.navLinks.map((l) => l.order)) + 1;
    setConfig({ ...config, navLinks: [...config.navLinks, { ...data, id, order }] });
  };
  const duplicateLink = (id: string) => {
    const original = config.navLinks.find((l) => l.id === id);
    if (!original) return;
    const newId = `n-${Date.now()}`;
    setConfig({ ...config, navLinks: [...config.navLinks, { ...original, id: newId, label: `${original.label} (copy)` }] });
  };

  return (
    <div className="space-y-4">
      {/* Brand & CTA */}
      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">Brand & CTA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Logo Text">
            <TextInput value={config.logoText} onChange={(v) => setConfig({ ...config, logoText: v })} />
          </FormField>
          <FormField label="Logo Tagline">
            <TextInput value={config.logoTagline} onChange={(v) => setConfig({ ...config, logoTagline: v })} />
          </FormField>
          <FormField label="CTA Button Text">
            <TextInput value={config.ctaButtonText} onChange={(v) => setConfig({ ...config, ctaButtonText: v })} />
          </FormField>
          <FormField label="CTA Button Destination">
            <SelectInput
              value={config.ctaButtonPage}
              onChange={(v) => setConfig({ ...config, ctaButtonPage: v })}
              options={[
                { value: "consultation", label: "Free Consultation" },
                { value: "contact", label: "Contact Page" },
                { value: "services", label: "Services" },
                { value: "portfolio", label: "Portfolio" },
              ]}
            />
          </FormField>
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={config.ctaButtonVisible}
              onChange={(e) => setConfig({ ...config, ctaButtonVisible: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
            />
            <div>
              <div className="text-sm font-medium text-heading">Show CTA Button</div>
              <div className="text-[11px] text-text-gray">Display the "Free Consultation" button in the header</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={config.transparentBackground}
              onChange={(e) => setConfig({ ...config, transparentBackground: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
            />
            <div>
              <div className="text-sm font-medium text-heading">Transparent on Hero</div>
              <div className="text-[11px] text-text-gray">Header has no background until you scroll</div>
            </div>
          </label>
        </div>
      </div>

      {/* Navigation links */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-heading">Navigation Links</h3>
          <Button
            size="sm"
            onClick={() => {
              setEditingLink({ id: "", label: "", page: "home", visible: true, order: 0 });
              setShowLinkForm(true);
            }}
          >
            <IconPlus className="w-3.5 h-3.5" />
            Add Link
          </Button>
        </div>

        {config.navLinks.length === 0 ? (
          <EmptyState title="No navigation links" message="Add your first navigation link." />
        ) : (
          <div className="space-y-2">
            {[...config.navLinks].sort((a, b) => a.order - b.order).map((link, idx, arr) => (
              <div
                key={link.id}
                className={cn(
                  "rounded-lg border p-3 flex items-center gap-3 transition-all",
                  link.visible ? "bg-white border-border hover:border-gold/50" : "bg-stone-50 border-stone-200 opacity-60"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveLink(link.id, -1)}
                    disabled={idx === 0}
                    className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30"
                  >
                    <IconArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveLink(link.id, 1)}
                    disabled={idx === arr.length - 1}
                    className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30"
                  >
                    <IconArrowDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-heading">{link.label}</span>
                    {link.highlight && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-bold uppercase tracking-widest">New</span>
                    )}
                    {!link.visible && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold uppercase tracking-widest">Hidden</span>
                    )}
                  </div>
                  <div className="text-[10px] text-text-gray font-mono">/{link.page}{link.slug ? `/${link.slug}` : ""}</div>
                </div>
                <button
                  onClick={() => updateLink(link.id, { visible: !link.visible })}
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                    link.visible ? "text-emerald-600 hover:bg-emerald-50" : "text-text-gray hover:bg-stone-100"
                  )}
                  title={link.visible ? "Hide" : "Show"}
                >
                  {link.visible ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditingLink(link); setShowLinkForm(true); }}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-espresso"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => duplicateLink(link.id)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-espresso"
                  title="Duplicate"
                >
                  <IconCopy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button variant="primary" onClick={save} size="lg">
          <IconCheck className="w-4 h-4" />
          {saved ? "Saved!" : "Save Header Changes"}
        </Button>
      </div>

      {showLinkForm && editingLink && (
        <NavLinkForm
          link={editingLink}
          onSave={(data) => {
            if (editingLink.id) {
              updateLink(editingLink.id, data);
            } else {
              addLink(data);
            }
            setShowLinkForm(false);
            setEditingLink(null);
          }}
          onClose={() => { setShowLinkForm(false); setEditingLink(null); }}
        />
      )}
    </div>
  );
}

function NavLinkForm({ link, onSave, onClose }: { link: NavLink; onSave: (l: Omit<NavLink, "id" | "order">) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<NavLink, "id" | "order">>({
    label: link.label,
    page: link.page,
    slug: link.slug,
    visible: link.visible,
    highlight: link.highlight,
  });
  return (
    <Modal open onClose={onClose} title={link.id ? "Edit Nav Link" : "Add Nav Link"}>
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="space-y-4"
      >
        <FormField label="Label" required>
          <TextInput value={form.label} onChange={(v) => setForm({ ...form, label: v })} placeholder="Home" />
        </FormField>
        <FormField label="Page" required>
          <SelectInput
            value={form.page}
            onChange={(v) => setForm({ ...form, page: v })}
            options={[
              { value: "home", label: "Home" },
              { value: "about", label: "About" },
              { value: "services", label: "Services" },
              { value: "service", label: "Specific Service" },
              { value: "studio", label: "3D Studio" },
              { value: "portfolio", label: "Portfolio" },
              { value: "blog", label: "Blog / Journal" },
              { value: "post", label: "Blog Post" },
              { value: "contact", label: "Contact" },
              { value: "consultation", label: "Free Consultation" },
            ]}
          />
        </FormField>
        {form.page === "service" && (
          <FormField label="Service Slug" hint="e.g. office-interior-design-lahore">
            <TextInput value={form.slug || ""} onChange={(v) => setForm({ ...form, slug: v })} />
          </FormField>
        )}
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Visible</div>
            <div className="text-[11px] text-text-gray">Show this link in the navigation</div>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.highlight}
            onChange={(e) => setForm({ ...form, highlight: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Highlight</div>
            <div className="text-[11px] text-text-gray">Add a "New" badge to this link</div>
          </div>
        </label>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            Save Link
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= FOOTER EDITOR =============
function FooterEditor() {
  const [config, setConfig] = useState<FooterConfig>(() => loadConfig("footer", defaultFooter));
  const [saved, setSaved] = useState(false);

  const save = () => {
    saveConfig("footer", config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSocial = () => {
    const id = `s-${Date.now()}`;
    setConfig({ ...config, socialLinks: [...config.socialLinks, { id, platform: "Twitter", url: "", visible: true }] });
  };
  const updateSocial = (id: string, patch: Partial<FooterConfig["socialLinks"][number]>) => {
    setConfig({ ...config, socialLinks: config.socialLinks.map((s) => s.id === id ? { ...s, ...patch } : s) });
  };
  const deleteSocial = (id: string) => {
    setConfig({ ...config, socialLinks: config.socialLinks.filter((s) => s.id !== id) });
  };

  const addLegal = () => {
    const id = `l-${Date.now()}`;
    setConfig({ ...config, legalLinks: [...config.legalLinks, { id, label: "New Link", url: "#" }] });
  };
  const updateLegal = (id: string, patch: Partial<FooterConfig["legalLinks"][number]>) => {
    setConfig({ ...config, legalLinks: config.legalLinks.map((s) => s.id === id ? { ...s, ...patch } : s) });
  };
  const deleteLegal = (id: string) => {
    setConfig({ ...config, legalLinks: config.legalLinks.filter((s) => s.id !== id) });
  };

  return (
    <div className="space-y-4">
      {/* Brand */}
      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">Brand Description</h3>
        <FormField label="Footer description (shown next to logo)">
          <textarea
            value={config.brandDescription}
            onChange={(e) => setConfig({ ...config, brandDescription: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </FormField>
      </div>

      {/* Newsletter */}
      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">Newsletter Signup</h3>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={config.showNewsletter}
            onChange={(e) => setConfig({ ...config, showNewsletter: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Show Newsletter Section</div>
            <div className="text-[11px] text-text-gray">Display the email signup form at the top of the footer</div>
          </div>
        </label>
        {config.showNewsletter && (
          <div className="space-y-3 pl-7">
            <FormField label="Newsletter Title">
              <TextInput value={config.newsletterTitle} onChange={(v) => setConfig({ ...config, newsletterTitle: v })} />
            </FormField>
            <FormField label="Newsletter Description">
              <textarea
                value={config.newsletterDescription}
                onChange={(e) => setConfig({ ...config, newsletterDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Social */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-heading">Social Links</h3>
          <Button size="sm" onClick={addSocial}>
            <IconPlus className="w-3.5 h-3.5" />
            Add Social
          </Button>
        </div>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={config.showSocial}
            onChange={(e) => setConfig({ ...config, showSocial: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Show Social Icons</div>
            <div className="text-[11px] text-text-gray">Display social media icons in the footer</div>
          </div>
        </label>
        <div className="space-y-2">
          {config.socialLinks.map((s) => (
            <div key={s.id} className="flex items-center gap-2 p-3 rounded-lg border border-border">
              <select
                value={s.platform}
                onChange={(e) => updateSocial(s.id, { platform: e.target.value })}
                className="px-2 py-1.5 text-xs rounded-md border border-border bg-white"
              >
                {["Instagram", "LinkedIn", "Pinterest", "Facebook", "Twitter", "YouTube", "TikTok"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="url"
                value={s.url}
                onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-border bg-white"
              />
              <button
                onClick={() => updateSocial(s.id, { visible: !s.visible })}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  s.visible ? "text-emerald-600 hover:bg-emerald-50" : "text-text-gray hover:bg-stone-100"
                )}
              >
                {s.visible ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteSocial(s.id)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-red-50 hover:text-red-600"
              >
                <IconTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-heading">Legal & Bottom Bar</h3>
          <Button size="sm" onClick={addLegal}>
            <IconPlus className="w-3.5 h-3.5" />
            Add Link
          </Button>
        </div>
        <FormField label="Copyright Text">
          <TextInput value={config.copyrightText} onChange={(v) => setConfig({ ...config, copyrightText: v })} />
        </FormField>
        <div className="mt-3 space-y-2">
          {config.legalLinks.map((l) => (
            <div key={l.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-border">
              <input
                type="text"
                value={l.label}
                onChange={(e) => updateLegal(l.id, { label: e.target.value })}
                placeholder="Link label"
                className="w-32 px-2 py-1.5 text-xs rounded-md border border-border bg-white"
              />
              <input
                type="url"
                value={l.url}
                onChange={(e) => updateLegal(l.id, { url: e.target.value })}
                placeholder="URL or #"
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-border bg-white"
              />
              <button
                onClick={() => deleteLegal(l.id)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-red-50 hover:text-red-600"
              >
                <IconTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button variant="primary" onClick={save} size="lg">
          <IconCheck className="w-4 h-4" />
          {saved ? "Saved!" : "Save Footer Changes"}
        </Button>
      </div>
    </div>
  );
}

// ============= SERVICES DROPDOWN EDITOR =============
function ServicesDropdownEditor() {
  const [services, setServices] = useState(() => {
    try {
      const stored = localStorage.getItem("wp-services-dropdown");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return defaultServicesDropdown();
  });
  const [saved, setSaved] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const save = () => {
    try {
      localStorage.setItem("wp-services-dropdown", JSON.stringify(services));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
  };

  const moveService = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= services.length) return;
    const newServices = [...services];
    [newServices[idx], newServices[newIdx]] = [newServices[newIdx], newServices[idx]];
    setServices(newServices);
  };
  const toggleVisibility = (id: string) => {
    setServices(services.map((s: any) => s.id === id ? { ...s, visible: !s.visible } : s));
  };
  const removeService = (id: string) => {
    if (!confirm("Remove this service from the dropdown?")) return;
    setServices(services.filter((s: any) => s.id !== id));
  };
  const addService = (data: any) => {
    const id = `svc-${Date.now()}`;
    setServices([...services, { ...data, id, visible: true }]);
  };
  const updateService = (id: string, data: any) => {
    setServices(services.map((s: any) => s.id === id ? { ...s, ...data } : s));
  };

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg text-heading">Services Mega-Menu</h3>
            <p className="text-xs text-text-gray mt-1">These items appear in the Services dropdown when users hover over "Services" in the navigation.</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingService({ name: "", shortDescription: "", icon: "residential", link: "" });
              setShowForm(true);
            }}
          >
            <IconPlus className="w-3.5 h-3.5" />
            Add Item
          </Button>
        </div>

        {services.length === 0 ? (
          <EmptyState title="No dropdown items" message="Add the services that should appear in the mega menu." />
        ) : (
          <div className="space-y-2">
            {services.map((s: any, idx: number, arr: any[]) => (
              <div
                key={s.id}
                className={cn(
                  "rounded-lg border p-3 flex items-center gap-3 transition-all",
                  s.visible ? "bg-white border-border hover:border-gold/50" : "bg-stone-50 border-stone-200 opacity-60"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveService(idx, -1)}
                    disabled={idx === 0}
                    className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30"
                  >
                    <IconArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveService(idx, 1)}
                    disabled={idx === arr.length - 1}
                    className="w-6 h-5 rounded flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-gold disabled:opacity-30"
                  >
                    <IconArrowDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-base flex-shrink-0">
                  {s.icon === "residential" ? "🏠" : s.icon === "commercial" ? "🏢" : s.icon === "3d" ? "🎬" : s.icon === "hospitality" ? "🍽️" : "⚡"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-heading">{s.name}</div>
                  <div className="text-[10px] text-text-gray line-clamp-1">{s.shortDescription}</div>
                </div>
                <button
                  onClick={() => toggleVisibility(s.id)}
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    s.visible ? "text-emerald-600 hover:bg-emerald-50" : "text-text-gray hover:bg-stone-100"
                  )}
                >
                  {s.visible ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditingService(s); setShowForm(true); }}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-gold/15 hover:text-espresso"
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeService(s.id)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-gray hover:bg-red-50 hover:text-red-600"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button variant="primary" onClick={save} size="lg">
          <IconCheck className="w-4 h-4" />
          {saved ? "Saved!" : "Save Dropdown Changes"}
        </Button>
      </div>

      {showForm && editingService && (
        <ServiceDropdownForm
          service={editingService}
          onSave={(data: any) => {
            if (editingService.id) {
              updateService(editingService.id, data);
            } else {
              addService(data);
            }
            setShowForm(false);
            setEditingService(null);
          }}
          onClose={() => { setShowForm(false); setEditingService(null); }}
        />
      )}
    </div>
  );
}

function defaultServicesDropdown() {
  return [
    { id: "svc-1", name: "Office Interior", shortDescription: "Workplaces that boost productivity & brand.", icon: "commercial", link: "office-interior-design-lahore", visible: true },
    { id: "svc-2", name: "Restaurant Design", shortDescription: "Atmospheres guests remember and share.", icon: "hospitality", link: "restaurant-interior-design-pakistan", visible: true },
    { id: "svc-3", name: "Cafe Design", shortDescription: "Spaces for laptops, dates and group hangs.", icon: "hospitality", link: "cafe-interior-design-services", visible: true },
    { id: "svc-4", name: "3D Visualization", shortDescription: "See it before it's built.", icon: "3d", link: "3d-visualization-interior-design-pakistan", visible: true },
    { id: "svc-5", name: "Renovation", shortDescription: "End-to-end renovation services.", icon: "residential", link: "renovation-services-pakistan", visible: true },
    { id: "svc-6", name: "Retail Design", shortDescription: "Stores that convert browsers to buyers.", icon: "commercial", link: "retail-interior-design-pakistan", visible: true },
  ];
}

function ServiceDropdownForm({ service, onSave, onClose }: { service: any; onSave: (s: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: service.name || "",
    shortDescription: service.shortDescription || "",
    icon: service.icon || "residential",
    link: service.link || "",
  });
  return (
    <Modal open onClose={onClose} title={service.id ? "Edit Service Item" : "Add Service Item"}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
        <FormField label="Service Name" required>
          <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        </FormField>
        <FormField label="Short Description" hint="One sentence shown in the dropdown">
          <textarea
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </FormField>
        <FormField label="Icon">
          <SelectInput
            value={form.icon}
            onChange={(v) => setForm({ ...form, icon: v })}
            options={[
              { value: "residential", label: "🏠 Residential" },
              { value: "commercial", label: "🏢 Commercial" },
              { value: "hospitality", label: "🍽️ Hospitality" },
              { value: "3d", label: "🎬 3D Studio" },
            ]}
          />
        </FormField>
        <FormField label="Link / Slug" hint="Where users go when they click this item">
          <TextInput value={form.link} onChange={(v) => setForm({ ...form, link: v })} placeholder="office-interior-design-lahore" />
        </FormField>
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

// ============= MAIN COMPONENT =============
export function HeaderFooterAdmin() {
  const [tab, setTab] = useState<"header" | "footer" | "services-dropdown">("header");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Header, Footer & Navigation"
        description="Customize the global site chrome — header logo, nav links, CTA, footer, and the services mega-menu."
      />

      <div className="card p-1.5 flex gap-1 max-w-xl">
        {[
          { id: "header", label: "Header & Nav", icon: "🔝" },
          { id: "services-dropdown", label: "Services Dropdown", icon: "📋" },
          { id: "footer", label: "Footer", icon: "🔻" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as never)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2",
              tab === t.id ? "bg-espresso text-white shadow-md" : "text-text-gray hover:bg-cream-50"
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "header" && <HeaderEditor />}
      {tab === "footer" && <FooterEditor />}
      {tab === "services-dropdown" && <ServicesDropdownEditor />}
    </div>
  );
}
