import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  Save,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Layout,
  Link2,
  Globe,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowUpRight,
  Settings2,
  Image,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import MediaPicker from '@/components/dashboard/ui/MediaPicker';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavLink {
  id: string;
  label: string;
  page: string;
  visible: boolean;
  highlight: boolean;
  order: number;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
}

interface LegalLink {
  id: string;
  label: string;
  url: string;
}

interface ServicesDropdownItem {
  id: string;
  name: string;
  shortDescription: string;
  icon: string;
  link: string;
  visible: boolean;
}

interface HeaderFooterConfig {
  header: {
    logoText: string;
    logoTagline: string;
    logoImage: string;
    ctaButtonText: string;
    ctaButtonPage: string;
    ctaButtonVisible: boolean;
    transparentBackground: boolean;
    showOnScroll: boolean;
    navLinks: NavLink[];
  };
  footer: {
    brandDescription: string;
    newsletterTitle: string;
    newsletterDescription: string;
    socialLinks: SocialLink[];
    showNewsletter: boolean;
    showSocial: boolean;
    showAwards: boolean;
    copyrightText: string;
    legalLinks: LegalLink[];
    footerColumns: number;
    socialIconSize: 'small' | 'medium' | 'large';
    socialIconStyle: 'filled' | 'outline';
  };
  servicesDropdown: ServicesDropdownItem[];
}

type TabId = 'header' | 'services' | 'footer';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TABS: { id: TabId; label: string; icon: typeof Layout }[] = [
  { id: 'header', label: 'Header & Nav', icon: Layout },
  { id: 'services', label: 'Services Dropdown', icon: Settings2 },
  { id: 'footer', label: 'Footer', icon: Globe },
];

const PAGE_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'studio', label: '3D Studio' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'projects', label: 'Projects' },
  { value: 'blog', label: 'Journal / Blog' },
  { value: 'insights', label: 'Insights' },
  { value: 'contact', label: 'Contact' },
  { value: 'consultation', label: 'Consultation' },
];

const SOCIAL_PLATFORMS = [
  'Instagram',
  'LinkedIn',
  'Pinterest',
  'Facebook',
  'Twitter',
  'YouTube',
  'TikTok',
  'Behance',
  'Dribbble',
];

const ICON_OPTIONS = [
  'commercial',
  'hospitality',
  'residential',
  '3d',
  'office',
  'retail',
  'cafe',
  'restaurant',
  'renovation',
  'consultation',
];

const ICON_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

const ICON_STYLE_OPTIONS = [
  { value: 'filled', label: 'Filled' },
  { value: 'outline', label: 'Outline' },
] as const;

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function getDefaultConfig(): HeaderFooterConfig {
  return {
    header: {
      logoText: '',
      logoTagline: '',
      logoImage: '',
      ctaButtonText: '',
      ctaButtonPage: 'contact',
      ctaButtonVisible: true,
      transparentBackground: true,
      showOnScroll: true,
      navLinks: [],
    },
    footer: {
      brandDescription: '',
      newsletterTitle: '',
      newsletterDescription: '',
      socialLinks: [],
      showNewsletter: true,
      showSocial: true,
      showAwards: false,
      copyrightText: '',
      legalLinks: [],
      footerColumns: 3,
      socialIconSize: 'medium',
      socialIconStyle: 'filled',
    },
    servicesDropdown: [],
  };
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({
  type,
  message,
  onDismiss,
}: {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isError = type === 'error';
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 shadow-lg transition-all ${
        isError
          ? 'bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)]'
          : 'bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.4)]'
      }`}
    >
      {isError ? (
        <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
      )}
      <span
        className={`text-sm font-light ${
          isError ? 'text-[#DC2626]' : 'text-[#16A34A]'
        }`}
      >
        {message}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#C9A84C]' : 'bg-[rgba(138,128,115,0.3)]'
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </button>
      {label && (
        <span className="text-sm text-[#D4C5A9] font-light group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Live Header Preview                                                */
/* ------------------------------------------------------------------ */

function HeaderPreview({ config }: { config: HeaderFooterConfig }) {
  const { header } = config;
  const visibleLinks = header.navLinks.filter((l) => l.visible);

  return (
    <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
      <h2 className="font-display text-lg text-white mb-1">Live Preview</h2>
      <p className="text-[#8A8073] text-xs font-light mb-5">
        Real-time preview of how the header will appear
      </p>

      <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] overflow-hidden">
        {/* Mock header bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 ${
            header.transparentBackground
              ? 'bg-transparent'
              : 'bg-[#111110]'
          }`}
        >
          {/* Logo area */}
          <div className="flex items-center gap-3">
            {header.logoImage ? (
              <img
                src={header.logoImage.startsWith('http') ? header.logoImage : `${API_BASE}${header.logoImage}`}
                alt={header.logoText || 'Logo'}
                className="h-8 w-auto object-contain"
              />
            ) : header.logoText ? (
              <div className="flex flex-col">
                <span className="font-display text-base text-[#C9A84C] leading-tight">
                  {header.logoText}
                </span>
                {header.logoTagline && (
                  <span className="text-[0.55rem] text-[#8A8073] font-light leading-tight">
                    {header.logoTagline}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-[#8A8073] font-light italic">Logo</span>
            )}
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-5">
            {visibleLinks.length > 0 ? (
              visibleLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-1.5">
                  <span className="text-xs text-[#D4C5A9] font-light">
                    {link.label}
                  </span>
                  {link.highlight && (
                    <span className="text-[0.45rem] tracking-[0.1em] uppercase px-1.5 py-0.5 bg-[#C9A84C] text-[#0A0A0A] font-semibold leading-none">
                      New
                    </span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-[0.65rem] text-[#8A8073] font-light italic">
                No visible links
              </span>
            )}
          </div>

          {/* CTA button */}
          <div>
            {header.ctaButtonVisible && header.ctaButtonText ? (
              <span className="text-[0.6rem] tracking-[0.12em] uppercase px-4 py-2 bg-[#C9A84C] text-[#0A0A0A] font-semibold">
                {header.ctaButtonText}
              </span>
            ) : (
              <span className="text-[0.55rem] text-[#8A8073] font-light italic">
                CTA hidden
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PlaceholderHeaderFooter() {
  /* ---- data ---- */
  const [config, setConfig] = useState<HeaderFooterConfig>(getDefaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  /* ---- tab ---- */
  const [activeTab, setActiveTab] = useState<TabId>('header');

  /* ---- editing nav link modal ---- */
  const [navLinkModal, setNavLinkModal] = useState(false);
  const [navLinkEdit, setNavLinkEdit] = useState<NavLink | null>(null);
  const [navLinkForm, setNavLinkForm] = useState({ label: '', page: 'home', highlight: false });

  /* ---- editing service item modal ---- */
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceEdit, setServiceEdit] = useState<ServicesDropdownItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    shortDescription: '',
    icon: 'commercial',
    link: '',
  });

  /* ---- editing social link modal ---- */
  const [socialModal, setSocialModal] = useState(false);
  const [socialEdit, setSocialEdit] = useState<SocialLink | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: 'Instagram', url: '' });

  /* ---- editing legal link modal ---- */
  const [legalModal, setLegalModal] = useState(false);
  const [legalEdit, setLegalEdit] = useState<LegalLink | null>(null);
  const [legalForm, setLegalForm] = useState({ label: '', url: '' });

  /* ---- media picker for logo ---- */
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ================================================================== */
  /*  Data fetching                                                      */
  /* ================================================================== */

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ config: HeaderFooterConfig }>('/admin/header-footer');
      if (res.config) {
        setConfig(res.config);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load header/footer config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ================================================================== */
  /*  Save                                                               */
  /* ================================================================== */

  async function handleSave() {
    setSaving(true);
    try {
      await adminFetch('/admin/header-footer', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      setToast({ type: 'success', message: 'Header & Footer config saved successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      const res = await adminFetch<{ config: HeaderFooterConfig }>('/admin/header-footer/reset', {
        method: 'POST',
      });
      if (res.config) {
        setConfig(res.config);
      }
      setToast({ type: 'success', message: 'Reset to defaults successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  }

  /* ================================================================== */
  /*  Header helpers                                                     */
  /* ================================================================== */

  function updateHeaderField<K extends keyof HeaderFooterConfig['header']>(
    field: K,
    value: HeaderFooterConfig['header'][K],
  ) {
    setConfig((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }

  /* ---- Nav links ---- */

  function addNavLink() {
    setNavLinkEdit(null);
    setNavLinkForm({ label: '', page: 'home', highlight: false });
    setNavLinkModal(true);
  }

  function editNavLink(link: NavLink) {
    setNavLinkEdit(link);
    setNavLinkForm({ label: link.label, page: link.page, highlight: link.highlight || false });
    setNavLinkModal(true);
  }

  function saveNavLink() {
    if (!navLinkForm.label.trim()) return;
    setConfig((prev) => {
      const links = [...prev.header.navLinks];
      if (navLinkEdit) {
        const idx = links.findIndex((l) => l.id === navLinkEdit.id);
        if (idx !== -1) {
          links[idx] = {
            ...links[idx],
            label: navLinkForm.label.trim(),
            page: navLinkForm.page,
            highlight: navLinkForm.highlight,
          };
        }
      } else {
        links.push({
          id: uid('n'),
          label: navLinkForm.label.trim(),
          page: navLinkForm.page,
          visible: true,
          highlight: navLinkForm.highlight,
          order: links.length,
        });
      }
      return { ...prev, header: { ...prev.header, navLinks: links } };
    });
    setNavLinkModal(false);
  }

  function deleteNavLink(id: string) {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.filter((l) => l.id !== id),
      },
    }));
  }

  function toggleNavLinkVisible(id: string) {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l,
        ),
      },
    }));
  }

  function toggleNavLinkHighlight(id: string) {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.map((l) =>
          l.id === id ? { ...l, highlight: !l.highlight } : l,
        ),
      },
    }));
  }

  function moveNavLink(id: string, dir: -1 | 1) {
    setConfig((prev) => {
      const links = [...prev.header.navLinks];
      const idx = links.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= links.length) return prev;
      [links[idx], links[newIdx]] = [links[newIdx], links[idx]];
      links.forEach((l, i) => (l.order = i));
      return { ...prev, header: { ...prev.header, navLinks: links } };
    });
  }

  /* ================================================================== */
  /*  Services helpers                                                   */
  /* ================================================================== */

  function addServiceItem() {
    setServiceEdit(null);
    setServiceForm({ name: '', shortDescription: '', icon: 'commercial', link: '' });
    setServiceModal(true);
  }

  function editServiceItem(item: ServicesDropdownItem) {
    setServiceEdit(item);
    setServiceForm({
      name: item.name,
      shortDescription: item.shortDescription,
      icon: item.icon,
      link: item.link,
    });
    setServiceModal(true);
  }

  function saveServiceItem() {
    if (!serviceForm.name.trim()) return;
    setConfig((prev) => {
      const items = [...prev.servicesDropdown];
      if (serviceEdit) {
        const idx = items.findIndex((s) => s.id === serviceEdit.id);
        if (idx !== -1) {
          items[idx] = {
            ...items[idx],
            name: serviceForm.name.trim(),
            shortDescription: serviceForm.shortDescription.trim(),
            icon: serviceForm.icon,
            link: serviceForm.link.trim(),
          };
        }
      } else {
        items.push({
          id: uid('svc'),
          name: serviceForm.name.trim(),
          shortDescription: serviceForm.shortDescription.trim(),
          icon: serviceForm.icon,
          link: serviceForm.link.trim(),
          visible: true,
        });
      }
      return { ...prev, servicesDropdown: items };
    });
    setServiceModal(false);
  }

  function deleteServiceItem(id: string) {
    setConfig((prev) => ({
      ...prev,
      servicesDropdown: prev.servicesDropdown.filter((s) => s.id !== id),
    }));
  }

  function moveServiceItem(id: string, dir: -1 | 1) {
    setConfig((prev) => {
      const items = [...prev.servicesDropdown];
      const idx = items.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= items.length) return prev;
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      return { ...prev, servicesDropdown: items };
    });
  }

  /* ================================================================== */
  /*  Footer helpers                                                     */
  /* ================================================================== */

  function updateFooterField<K extends keyof HeaderFooterConfig['footer']>(
    field: K,
    value: HeaderFooterConfig['footer'][K],
  ) {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, [field]: value },
    }));
  }

  /* ---- Social links ---- */

  function addSocialLink() {
    setSocialEdit(null);
    setSocialForm({ platform: 'Instagram', url: '' });
    setSocialModal(true);
  }

  function editSocialLink(link: SocialLink) {
    setSocialEdit(link);
    setSocialForm({ platform: link.platform, url: link.url });
    setSocialModal(true);
  }

  function saveSocialLink() {
    if (!socialForm.url.trim()) return;
    setConfig((prev) => {
      const links = [...prev.footer.socialLinks];
      if (socialEdit) {
        const idx = links.findIndex((l) => l.id === socialEdit.id);
        if (idx !== -1) {
          links[idx] = {
            ...links[idx],
            platform: socialForm.platform,
            url: socialForm.url.trim(),
          };
        }
      } else {
        links.push({
          id: uid('s'),
          platform: socialForm.platform,
          url: socialForm.url.trim(),
          visible: true,
        });
      }
      return { ...prev, footer: { ...prev.footer, socialLinks: links } };
    });
    setSocialModal(false);
  }

  function deleteSocialLink(id: string) {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer.socialLinks.filter((l) => l.id !== id),
      },
    }));
  }

  function toggleSocialVisible(id: string) {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer.socialLinks.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l,
        ),
      },
    }));
  }

  /* ---- Legal links ---- */

  function addLegalLink() {
    setLegalEdit(null);
    setLegalForm({ label: '', url: '' });
    setLegalModal(true);
  }

  function editLegalLink(link: LegalLink) {
    setLegalEdit(link);
    setLegalForm({ label: link.label, url: link.url });
    setLegalModal(true);
  }

  function saveLegalLink() {
    if (!legalForm.label.trim()) return;
    setConfig((prev) => {
      const links = [...prev.footer.legalLinks];
      if (legalEdit) {
        const idx = links.findIndex((l) => l.id === legalEdit.id);
        if (idx !== -1) {
          links[idx] = {
            ...links[idx],
            label: legalForm.label.trim(),
            url: legalForm.url.trim(),
          };
        }
      } else {
        links.push({
          id: uid('l'),
          label: legalForm.label.trim(),
          url: legalForm.url.trim(),
        });
      }
      return { ...prev, footer: { ...prev.footer, legalLinks: links } };
    });
    setLegalModal(false);
  }

  function deleteLegalLink(id: string) {
    setConfig((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        legalLinks: prev.footer.legalLinks.filter((l) => l.id !== id),
      },
    }));
  }

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */

  return (
    <div className="p-8">
      {/* ---- Toast ---- */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* ============================================================ */}
      {/*  Page Header                                                  */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Header & Footer</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Navigation, brand elements, footer & services menu
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
            title="Reset to defaults"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={load}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
          >
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ---- Error banner ---- */}
      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-3">
          <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Loading state                                                */}
      {/* ============================================================ */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : (
        <>
          {/* ====================================================== */}
          {/*  Tab navigation                                         */}
          {/* ====================================================== */}
          <div className="flex items-center gap-1 mb-8 border-b border-[rgba(201,168,76,0.15)]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm font-light transition-colors ${
                    active
                      ? 'text-[#C9A84C]'
                      : 'text-[#8A8073] hover:text-[#D4C5A9]'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ====================================================== */}
          {/*  TAB: Header & Nav                                      */}
          {/* ====================================================== */}
          {activeTab === 'header' && (
            <div className="space-y-8">
              {/* ---- Live Preview ---- */}
              <HeaderPreview config={config} />

              {/* ---- Brand & CTA Section ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <h2 className="font-display text-lg text-white mb-1">
                  Brand & CTA
                </h2>
                <p className="text-[#8A8073] text-xs font-light mb-6">
                  Logo text, tagline and call-to-action button
                </p>

                <div className="grid md:grid-cols-2 gap-x-6">
                  <AdminFormField label="Logo Text" htmlFor="hdr-logo">
                    <input
                      id="hdr-logo"
                      type="text"
                      value={config.header.logoText}
                      onChange={(e) => updateHeaderField('logoText', e.target.value)}
                      placeholder="e.g. Woodex Interior"
                      className="input-lux w-full"
                    />
                  </AdminFormField>

                  <AdminFormField label="Logo Tagline" htmlFor="hdr-tagline">
                    <input
                      id="hdr-tagline"
                      type="text"
                      value={config.header.logoTagline}
                      onChange={(e) => updateHeaderField('logoTagline', e.target.value)}
                      placeholder="e.g. Interior Design Studio"
                      className="input-lux w-full"
                    />
                  </AdminFormField>

                  <AdminFormField label="CTA Button Text" htmlFor="hdr-cta-text">
                    <input
                      id="hdr-cta-text"
                      type="text"
                      value={config.header.ctaButtonText}
                      onChange={(e) => updateHeaderField('ctaButtonText', e.target.value)}
                      placeholder="e.g. Free Consultation"
                      className="input-lux w-full"
                    />
                  </AdminFormField>

                  <AdminFormField
                    label="CTA Button Destination"
                    htmlFor="hdr-cta-page"
                    hint="Which page does the CTA link to"
                  >
                    <select
                      id="hdr-cta-page"
                      value={config.header.ctaButtonPage}
                      onChange={(e) => updateHeaderField('ctaButtonPage', e.target.value)}
                      className="input-lux w-full"
                    >
                      {PAGE_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </AdminFormField>
                </div>

                <div className="flex items-center gap-8 mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
                  <Toggle
                    checked={config.header.ctaButtonVisible}
                    onChange={(v) => updateHeaderField('ctaButtonVisible', v)}
                    label="Show CTA Button"
                  />
                  <Toggle
                    checked={config.header.transparentBackground}
                    onChange={(v) => updateHeaderField('transparentBackground', v)}
                    label="Transparent on Hero"
                  />
                </div>
              </div>

              {/* ---- Logo Image Section ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <h2 className="font-display text-lg text-white mb-1">Logo Image</h2>
                <p className="text-[#8A8073] text-xs font-light mb-6">
                  Upload a logo image. When set, this takes precedence over the text logo above.
                </p>

                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <AdminFormField label="Logo Image URL" htmlFor="hdr-logo-image">
                      <input
                        id="hdr-logo-image"
                        type="text"
                        value={config.header.logoImage}
                        onChange={(e) => updateHeaderField('logoImage', e.target.value)}
                        placeholder="https://example.com/logo.png or /uploads/logo.png"
                        className="input-lux w-full"
                      />
                    </AdminFormField>
                    <button
                      onClick={() => setLogoPickerOpen(true)}
                      className="btn-lux btn-outline text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5 mt-2"
                    >
                      <Image size={12} />
                      Choose from Library
                    </button>
                    {config.header.logoImage && (
                      <button
                        onClick={() => updateHeaderField('logoImage', '')}
                        className="text-[0.55rem] text-[#DC2626] hover:underline ml-3 mt-2 inline-flex items-center gap-1"
                      >
                        <Trash2 size={10} />
                        Remove image
                      </button>
                    )}
                  </div>

                  {/* Thumbnail preview */}
                  <div className="w-32 h-20 border border-[rgba(201,168,76,0.15)] bg-[#0A0A0A] flex items-center justify-center shrink-0 overflow-hidden">
                    {config.header.logoImage ? (
                      <img
                        src={
                          config.header.logoImage.startsWith('http')
                            ? config.header.logoImage
                            : `${API_BASE}${config.header.logoImage}`
                        }
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-[0.55rem] text-[#8A8073] font-light">No image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ---- Navigation Links Section ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-lg text-white">Navigation Links</h2>
                  <button
                    onClick={addNavLink}
                    className="btn-lux btn-gold text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Link
                  </button>
                </div>
                <p className="text-[#8A8073] text-xs font-light mb-5">
                  Manage the main navigation menu items
                </p>

                {config.header.navLinks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[rgba(201,168,76,0.15)]">
                    <Link2 size={24} className="mx-auto mb-3 text-[#8A8073] opacity-40" />
                    <p className="text-[#8A8073] text-sm font-light">No navigation links yet</p>
                    <button
                      onClick={addNavLink}
                      className="text-[#C9A84C] text-xs mt-2 hover:underline"
                    >
                      + Add your first link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {config.header.navLinks.map((link, idx) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-4 bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] px-4 py-3 hover:border-[rgba(201,168,76,0.25)] transition-colors"
                      >
                        {/* Order buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveNavLink(link.id, -1)}
                            disabled={idx === 0}
                            className="text-[#8A8073] hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveNavLink(link.id, 1)}
                            disabled={idx === config.header.navLinks.length - 1}
                            className="text-[#8A8073] hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="text-sm text-white font-medium">{link.label}</span>
                          <span className="text-[0.6rem] text-[#C9A84C] font-mono">
                            /{link.page}
                          </span>
                          {link.highlight && (
                            <span className="text-[0.5rem] tracking-[0.12em] uppercase px-2 py-0.5 bg-[#C9A84C] text-[#0A0A0A] font-semibold">
                              New
                            </span>
                          )}
                        </div>

                        {/* Highlight / "New" badge toggle */}
                        <button
                          onClick={() => toggleNavLinkHighlight(link.id)}
                          className={`flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors ${
                            link.highlight
                              ? 'text-[#0A0A0A] bg-[#C9A84C]'
                              : 'text-[#8A8073] bg-[rgba(138,128,115,0.1)]'
                          }`}
                          title="Toggle 'New' badge"
                        >
                          {link.highlight ? 'Badge On' : 'Badge Off'}
                        </button>

                        {/* Visibility */}
                        <button
                          onClick={() => toggleNavLinkVisible(link.id)}
                          className={`flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors ${
                            link.visible
                              ? 'text-[#16A34A] bg-[rgba(22,163,74,0.1)]'
                              : 'text-[#8A8073] bg-[rgba(138,128,115,0.1)]'
                          }`}
                        >
                          {link.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                          {link.visible ? 'Visible' : 'Hidden'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => editNavLink(link)}
                          className="text-[#8A8073] hover:text-[#C9A84C] transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteNavLink(link.id)}
                          className="text-[#8A8073] hover:text-[#DC2626] transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/*  TAB: Services Dropdown                                 */}
          {/* ====================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-lg text-white">Services Mega-Menu</h2>
                  <button
                    onClick={addServiceItem}
                    className="btn-lux btn-gold text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Item
                  </button>
                </div>
                <p className="text-[#8A8073] text-xs font-light mb-5">
                  Items shown in the Services dropdown on the live site
                </p>

                {config.servicesDropdown.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[rgba(201,168,76,0.15)]">
                    <Settings2 size={24} className="mx-auto mb-3 text-[#8A8073] opacity-40" />
                    <p className="text-[#8A8073] text-sm font-light">No service items in dropdown</p>
                    <button
                      onClick={addServiceItem}
                      className="text-[#C9A84C] text-xs mt-2 hover:underline"
                    >
                      + Add your first item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {config.servicesDropdown.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] px-4 py-3 hover:border-[rgba(201,168,76,0.25)] transition-colors"
                      >
                        {/* Order buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveServiceItem(item.id, -1)}
                            disabled={idx === 0}
                            className="text-[#8A8073] hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveServiceItem(item.id, 1)}
                            disabled={idx === config.servicesDropdown.length - 1}
                            className="text-[#8A8073] hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        {/* Icon badge */}
                        <div className="w-9 h-9 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
                          <span className="text-[0.5rem] text-[#C9A84C] uppercase font-semibold tracking-wider">
                            {item.icon.slice(0, 3)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium">{item.name}</div>
                          {item.shortDescription && (
                            <div className="text-[0.65rem] text-[#8A8073] mt-0.5 truncate">
                              {item.shortDescription}
                            </div>
                          )}
                          <span className="text-[0.55rem] text-[#C9A84C] font-mono">
                            /{item.link}
                          </span>
                        </div>

                        {/* Edit */}
                        <button
                          onClick={() => editServiceItem(item)}
                          className="text-[#8A8073] hover:text-[#C9A84C] transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteServiceItem(item.id)}
                          className="text-[#8A8073] hover:text-[#DC2626] transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/*  TAB: Footer                                             */}
          {/* ====================================================== */}
          {activeTab === 'footer' && (
            <div className="space-y-8">
              {/* ---- Brand Description ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <h2 className="font-display text-lg text-white mb-1">Footer Brand</h2>
                <p className="text-[#8A8073] text-xs font-light mb-5">
                  Brand description and copyright text
                </p>

                <AdminFormField label="Brand Description" htmlFor="ftr-brand">
                  <textarea
                    id="ftr-brand"
                    value={config.footer.brandDescription}
                    onChange={(e) => updateFooterField('brandDescription', e.target.value)}
                    placeholder="Short description about the company..."
                    rows={3}
                    className="input-lux w-full resize-y"
                  />
                </AdminFormField>

                <div className="grid md:grid-cols-2 gap-x-6">
                  <AdminFormField label="Copyright Text" htmlFor="ftr-copyright">
                    <input
                      id="ftr-copyright"
                      type="text"
                      value={config.footer.copyrightText}
                      onChange={(e) => updateFooterField('copyrightText', e.target.value)}
                      placeholder="e.g. (c) 2025 Company. All rights reserved."
                      className="input-lux w-full"
                    />
                  </AdminFormField>
                </div>

                <div className="flex items-center gap-8 mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
                  <Toggle
                    checked={config.footer.showNewsletter}
                    onChange={(v) => updateFooterField('showNewsletter', v)}
                    label="Show Newsletter"
                  />
                  <Toggle
                    checked={config.footer.showSocial}
                    onChange={(v) => updateFooterField('showSocial', v)}
                    label="Show Social Links"
                  />
                  <Toggle
                    checked={config.footer.showAwards}
                    onChange={(v) => updateFooterField('showAwards', v)}
                    label="Show Awards"
                  />
                </div>
              </div>

              {/* ---- Footer Layout ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <h2 className="font-display text-lg text-white mb-1">Layout</h2>
                <p className="text-[#8A8073] text-xs font-light mb-6">
                  Configure the footer column layout
                </p>

                <AdminFormField label="Footer Columns" htmlFor="ftr-columns" hint="Number of content columns in the footer">
                  <div className="flex items-center gap-3">
                    {[2, 3, 4].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => updateFooterField('footerColumns', col)}
                        className={`w-16 h-10 flex items-center justify-center text-sm font-light border transition-colors ${
                          config.footer.footerColumns === col
                            ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]'
                            : 'bg-transparent text-[#D4C5A9] border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.5)]'
                        }`}
                      >
                        {col} Col
                      </button>
                    ))}
                  </div>
                </AdminFormField>
              </div>

              {/* ---- Social Links ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-lg text-white">Social Links</h2>
                  <button
                    onClick={addSocialLink}
                    className="btn-lux btn-gold text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Link
                  </button>
                </div>
                <p className="text-[#8A8073] text-xs font-light mb-5">
                  Social media links shown in the footer
                </p>

                {config.footer.socialLinks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[rgba(201,168,76,0.15)]">
                    <Globe size={24} className="mx-auto mb-3 text-[#8A8073] opacity-40" />
                    <p className="text-[#8A8073] text-sm font-light">No social links</p>
                    <button
                      onClick={addSocialLink}
                      className="text-[#C9A84C] text-xs mt-2 hover:underline"
                    >
                      + Add your first social link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {config.footer.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-4 bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] px-4 py-3 hover:border-[rgba(201,168,76,0.25)] transition-colors"
                      >
                        {/* Platform badge */}
                        <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2.5 py-1 font-semibold shrink-0">
                          {link.platform}
                        </span>

                        {/* URL */}
                        <span className="flex-1 text-sm text-[#D4C5A9] font-light truncate">
                          {link.url}
                        </span>

                        {/* Visibility */}
                        <button
                          onClick={() => toggleSocialVisible(link.id)}
                          className={`flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors ${
                            link.visible
                              ? 'text-[#16A34A] bg-[rgba(22,163,74,0.1)]'
                              : 'text-[#8A8073] bg-[rgba(138,128,115,0.1)]'
                          }`}
                        >
                          {link.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                          {link.visible ? 'Visible' : 'Hidden'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => editSocialLink(link)}
                          className="text-[#8A8073] hover:text-[#C9A84C] transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteSocialLink(link.id)}
                          className="text-[#8A8073] hover:text-[#DC2626] transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ---- Social Icon Style ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <h2 className="font-display text-lg text-white mb-1">Icon Style</h2>
                <p className="text-[#8A8073] text-xs font-light mb-6">
                  Customize the appearance of social media icons in the footer
                </p>

                <div className="grid md:grid-cols-2 gap-x-6">
                  <AdminFormField label="Icon Size" htmlFor="ftr-icon-size">
                    <div className="flex items-center gap-2">
                      {ICON_SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateFooterField('socialIconSize', opt.value)}
                          className={`px-4 py-2 text-[0.6rem] tracking-[0.1em] uppercase border transition-colors ${
                            config.footer.socialIconSize === opt.value
                              ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]'
                              : 'bg-transparent text-[#D4C5A9] border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.5)]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </AdminFormField>

                  <AdminFormField label="Icon Style" htmlFor="ftr-icon-style">
                    <div className="flex items-center gap-2">
                      {ICON_STYLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateFooterField('socialIconStyle', opt.value)}
                          className={`px-4 py-2 text-[0.6rem] tracking-[0.1em] uppercase border transition-colors ${
                            config.footer.socialIconStyle === opt.value
                              ? 'bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]'
                              : 'bg-transparent text-[#D4C5A9] border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.5)]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </AdminFormField>
                </div>
              </div>

              {/* ---- Legal Links ---- */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-display text-lg text-white">Legal Links</h2>
                  <button
                    onClick={addLegalLink}
                    className="btn-lux btn-gold text-[0.55rem] py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Add Link
                  </button>
                </div>
                <p className="text-[#8A8073] text-xs font-light mb-5">
                  Legal / utility links in the footer
                </p>

                {config.footer.legalLinks.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[rgba(201,168,76,0.15)]">
                    <ArrowUpRight size={24} className="mx-auto mb-3 text-[#8A8073] opacity-40" />
                    <p className="text-[#8A8073] text-sm font-light">No legal links</p>
                    <button
                      onClick={addLegalLink}
                      className="text-[#C9A84C] text-xs mt-2 hover:underline"
                    >
                      + Add your first legal link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {config.footer.legalLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-4 bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] px-4 py-3 hover:border-[rgba(201,168,76,0.25)] transition-colors"
                      >
                        <span className="text-sm text-white font-medium min-w-[80px]">
                          {link.label}
                        </span>
                        <span className="flex-1 text-sm text-[#8A8073] font-light truncate">
                          {link.url}
                        </span>

                        <button
                          onClick={() => editLegalLink(link)}
                          className="text-[#8A8073] hover:text-[#C9A84C] transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteLegalLink(link.id)}
                          className="text-[#8A8073] hover:text-[#DC2626] transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/*  Media Picker (Logo)                                          */}
      {/* ============================================================ */}
      <MediaPicker
        open={logoPickerOpen}
        onClose={() => setLogoPickerOpen(false)}
        onSelect={(url) => updateHeaderField('logoImage', url)}
      />

      {/* ============================================================ */}
      {/*  Nav Link Modal                                              */}
      {/* ============================================================ */}
      {navLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setNavLinkModal(false)} />
          <div className="relative bg-[#111110] border border-[rgba(201,168,76,0.3)] w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
              <h2 className="font-display text-lg text-white">
                {navLinkEdit ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h2>
              <button
                onClick={() => setNavLinkModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[#8A8073] hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-lux">
              <AdminFormField label="Label" htmlFor="nl-label" required>
                <input
                  id="nl-label"
                  type="text"
                  value={navLinkForm.label}
                  onChange={(e) => setNavLinkForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. About"
                  className="input-lux w-full"
                />
              </AdminFormField>
              <AdminFormField label="Page Path" htmlFor="nl-page">
                <select
                  id="nl-page"
                  value={navLinkForm.page}
                  onChange={(e) => setNavLinkForm((p) => ({ ...p, page: e.target.value }))}
                  className="input-lux w-full"
                >
                  {PAGE_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      /{p.value} — {p.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
                <Toggle
                  checked={navLinkForm.highlight}
                  onChange={(v) => setNavLinkForm((p) => ({ ...p, highlight: v }))}
                  label='Show "New" badge on this link'
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(201,168,76,0.15)]">
              <button
                onClick={() => setNavLinkModal(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                onClick={saveNavLink}
                disabled={!navLinkForm.label.trim()}
                className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
              >
                {navLinkEdit ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Service Item Modal                                          */}
      {/* ============================================================ */}
      {serviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setServiceModal(false)} />
          <div className="relative bg-[#111110] border border-[rgba(201,168,76,0.3)] w-full max-w-lg max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
              <h2 className="font-display text-lg text-white">
                {serviceEdit ? 'Edit Service Dropdown Item' : 'Add Service Dropdown Item'}
              </h2>
              <button
                onClick={() => setServiceModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[#8A8073] hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-lux">
              <div className="grid md:grid-cols-2 gap-x-6">
                <AdminFormField label="Name" htmlFor="svc-dd-name" required>
                  <input
                    id="svc-dd-name"
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Office Interior"
                    className="input-lux w-full"
                  />
                </AdminFormField>

                <AdminFormField label="Icon" htmlFor="svc-dd-icon">
                  <select
                    id="svc-dd-icon"
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm((p) => ({ ...p, icon: e.target.value }))}
                    className="input-lux w-full"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </AdminFormField>
              </div>

              <AdminFormField
                label="Short Description"
                htmlFor="svc-dd-desc"
                hint="Brief one-liner shown in the dropdown"
              >
                <input
                  id="svc-dd-desc"
                  type="text"
                  value={serviceForm.shortDescription}
                  onChange={(e) =>
                    setServiceForm((p) => ({ ...p, shortDescription: e.target.value }))
                  }
                  placeholder="e.g. Workplaces that boost productivity"
                  className="input-lux w-full"
                />
              </AdminFormField>

              <AdminFormField
                label="Link (page slug)"
                htmlFor="svc-dd-link"
                hint="URL path after the domain"
              >
                <input
                  id="svc-dd-link"
                  type="text"
                  value={serviceForm.link}
                  onChange={(e) => setServiceForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="e.g. office-interior-design-lahore"
                  className="input-lux w-full"
                />
              </AdminFormField>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(201,168,76,0.15)]">
              <button
                onClick={() => setServiceModal(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                onClick={saveServiceItem}
                disabled={!serviceForm.name.trim()}
                className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
              >
                {serviceEdit ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Social Link Modal                                           */}
      {/* ============================================================ */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSocialModal(false)} />
          <div className="relative bg-[#111110] border border-[rgba(201,168,76,0.3)] w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
              <h2 className="font-display text-lg text-white">
                {socialEdit ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <button
                onClick={() => setSocialModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[#8A8073] hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-lux">
              <AdminFormField label="Platform" htmlFor="soc-platform">
                <select
                  id="soc-platform"
                  value={socialForm.platform}
                  onChange={(e) => setSocialForm((p) => ({ ...p, platform: e.target.value }))}
                  className="input-lux w-full"
                >
                  {SOCIAL_PLATFORMS.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField label="URL" htmlFor="soc-url" required>
                <input
                  id="soc-url"
                  type="url"
                  value={socialForm.url}
                  onChange={(e) => setSocialForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://instagram.com/yourprofile"
                  className="input-lux w-full"
                />
              </AdminFormField>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(201,168,76,0.15)]">
              <button
                onClick={() => setSocialModal(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                onClick={saveSocialLink}
                disabled={!socialForm.url.trim()}
                className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
              >
                {socialEdit ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Legal Link Modal                                            */}
      {/* ============================================================ */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setLegalModal(false)} />
          <div className="relative bg-[#111110] border border-[rgba(201,168,76,0.3)] w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
              <h2 className="font-display text-lg text-white">
                {legalEdit ? 'Edit Legal Link' : 'Add Legal Link'}
              </h2>
              <button
                onClick={() => setLegalModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[#8A8073] hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-lux">
              <AdminFormField label="Label" htmlFor="leg-label" required>
                <input
                  id="leg-label"
                  type="text"
                  value={legalForm.label}
                  onChange={(e) => setLegalForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Privacy Policy"
                  className="input-lux w-full"
                />
              </AdminFormField>
              <AdminFormField label="URL" htmlFor="leg-url" required>
                <input
                  id="leg-url"
                  type="url"
                  value={legalForm.url}
                  onChange={(e) => setLegalForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="e.g. /privacy"
                  className="input-lux w-full"
                />
              </AdminFormField>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(201,168,76,0.15)]">
              <button
                onClick={() => setLegalModal(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                onClick={saveLegalLink}
                disabled={!legalForm.label.trim()}
                className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
              >
                {legalEdit ? 'Save Changes' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
