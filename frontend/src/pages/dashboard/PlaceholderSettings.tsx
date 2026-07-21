import { useEffect, useState, useCallback } from 'react';
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Shield,
  MessageSquare,
  Clock,
  AlertTriangle,
  Download,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Palette,
  Search,
  Bot,
  UserCheck,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialInstagram: string;
  socialLinkedIn: string;
  socialPinterest: string;
  primaryColor: string;
  accentColor: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  whatsappAlertsEnabled: boolean;
  alertPhone: string;
  alertOnNewLead: boolean;
  alertOnNewConversation: boolean;
  alertOnUrgentPriority: boolean;
  autoAssignAgent: boolean;
  defaultAgentId: string | null;
  businessHoursStart: string;
  businessHoursEnd: string;
  outOfHoursMessage: string;
  llmAgentEnabled: boolean;
  llmAgentModel: string;
  seoTitleFormat?: string;
  seoMetaDesc?: string;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface LlmStatus {
  enabled: boolean;
  model: string;
  apiKeyConfigured: boolean;
}

/* ------------------------------------------------------------------ */
/*  Default settings (matches backend)                                 */
/* ------------------------------------------------------------------ */

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'WP Interior Studio',
  siteTagline: "Pakistan's award-winning interior design company",
  contactEmail: 'hello@wpinterior.com',
  contactPhone: '+92 300 1234567',
  address: '124-G, MM Alam Road, Gulberg III, Lahore 54000, Pakistan',
  socialInstagram: 'https://instagram.com/wpinterior',
  socialLinkedIn: 'https://linkedin.com/company/wpinterior',
  socialPinterest: 'https://pinterest.com/wpinterior',
  primaryColor: '#C6A15B',
  accentColor: '#211C18',
  maintenanceMode: false,
  allowRegistrations: false,
  emailNotifications: true,
  whatsappAlertsEnabled: true,
  alertPhone: '+92 300 9998877',
  alertOnNewLead: true,
  alertOnNewConversation: true,
  alertOnUrgentPriority: true,
  autoAssignAgent: true,
  defaultAgentId: null,
  businessHoursStart: '09:00',
  businessHoursEnd: '19:00',
  outOfHoursMessage:
    "Thanks for reaching out! Our team is currently offline. We'll respond to your message first thing in the morning. For urgent matters, please call +92 300 1234567.",
  llmAgentEnabled: false,
  llmAgentModel: 'gpt-4o-mini',
};

/* ------------------------------------------------------------------ */
/*  Tiny sub-components                                                 */
/* ------------------------------------------------------------------ */

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
      <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)] flex items-center gap-3">
        <Icon size={18} className="text-[#C9A84C]" />
        <h2 className="font-display text-xl text-white">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-lux" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <div className="min-w-0">
        <span className="text-sm text-white block">{label}</span>
        {description && <span className="text-xs text-[#8A8073] font-light mt-0.5 block">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] ${
          checked ? 'bg-[#C9A84C]' : 'bg-[rgba(201,168,76,0.2)]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform bg-[#0A0A0A] transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Color picker component                                             */
/* ------------------------------------------------------------------ */

function ColorField({
  label,
  htmlFor,
  value,
  onChange,
  description,
}: {
  label: string;
  htmlFor: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}) {
  return (
    <div>
      <label className="label-lux" htmlFor={htmlFor}>
        {label}
      </label>
      {description && <span className="text-xs text-[#8A8073] font-light block mb-2">{description}</span>}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            id={`${htmlFor}-picker`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div
            className="w-10 h-10 border border-[rgba(201,168,76,0.3)] cursor-pointer transition-colors hover:border-[#C9A84C]"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          id={htmlFor}
          type="text"
          className="input-lux flex-1 font-mono text-sm"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v) || v === '') {
              onChange(v);
            }
          }}
          onBlur={(e) => {
            if (e.target.value === '') onChange('#000000');
          }}
          placeholder="#C9A84C"
          maxLength={7}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PlaceholderSettings() {
  const [settings, setSettings] = useState<SiteSettings>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  /* ---- New state for added sections ---- */
  const [agents, setAgents] = useState<Agent[]>([]);
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null);
  const [llmStatusLoading, setLlmStatusLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [exportingAll, setExportingAll] = useState(false);
  const [resettingTheme, setResettingTheme] = useState(false);

  /* ---- Load on mount ---- */
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await adminFetch<{ settings: Partial<SiteSettings> }>('/admin/settings');
      setSettings((prev) => ({ ...prev, ...res.settings }));
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLlmStatus = useCallback(async () => {
    try {
      setLlmStatusLoading(true);
      const res = await adminFetch<LlmStatus>('/admin/llm/status');
      setLlmStatus(res);
    } catch {
      setLlmStatus(null);
    } finally {
      setLlmStatusLoading(false);
    }
  }, []);

  const loadAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);
      const res = await adminFetch<{ agents: Agent[] }>('/admin/agents').catch(() => ({ agents: [] as Agent[] }));
      setAgents(res.agents || []);
    } catch {
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadLlmStatus();
    loadAgents();
  }, [loadSettings, loadLlmStatus, loadAgents]);

  /* ---- Persist helper ---- */
  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  /* ---- Save ---- */
  async function handleSave() {
    try {
      setSaving(true);
      setFeedback(null);
      const res = await adminFetch<{ settings: SiteSettings }>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      setSettings(res.settings);
      setFeedback({ type: 'success', message: 'Settings saved successfully' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  }

  /* ---- Export (settings only) ---- */
  function handleExport() {
    const blob = new Blob([JSON.stringify({ settings, exportedAt: new Date().toISOString() }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wp-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---- Export All Data (settings + theme + pages) ---- */
  async function handleExportAllData() {
    try {
      setExportingAll(true);
      setFeedback(null);

      const [settingsRes, themeRes, pagesRes] = await Promise.allSettled([
        adminFetch<{ settings: SiteSettings; exportedAt: string }>('/admin/settings/export'),
        adminFetch<{ theme: Record<string, unknown> }>('/admin/theme').catch(() => null),
        adminFetch<{ pages: unknown[] }>('/admin/pages').catch(() => null),
      ]);

      const combined = {
        settings: settingsRes.status === 'fulfilled' ? settingsRes.value?.settings : settings,
        theme: themeRes.status === 'fulfilled' && themeRes.value ? themeRes.value.theme : null,
        pages: pagesRes.status === 'fulfilled' && pagesRes.value ? pagesRes.value.pages : null,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0',
      };

      const blob = new Blob([JSON.stringify(combined, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `woodex-full-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setFeedback({ type: 'success', message: 'All data exported successfully' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Export failed' });
    } finally {
      setExportingAll(false);
    }
  }

  /* ---- Reset to defaults ---- */
  async function handleReset() {
    if (!window.confirm('Reset all settings to defaults? This cannot be undone.')) return;
    try {
      setResetting(true);
      setFeedback(null);
      const res = await adminFetch<{ settings: SiteSettings }>('/admin/settings/reset', {
        method: 'POST',
      });
      setSettings(res.settings);
      setFeedback({ type: 'success', message: 'Settings reset to defaults' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to reset settings' });
    } finally {
      setResetting(false);
    }
  }

  /* ---- Reset theme only ---- */
  async function handleResetTheme() {
    if (!window.confirm('Reset the theme to defaults? This cannot be undone.')) return;
    try {
      setResettingTheme(true);
      setFeedback(null);
      await adminFetch('/admin/theme/reset', { method: 'POST' });
      setFeedback({ type: 'success', message: 'Theme reset to defaults' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to reset theme' });
    } finally {
      setResettingTheme(false);
    }
  }

  /* ---- Loading skeleton ---- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="p-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Site Settings</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">Configure your studio's site-wide information</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
            <Download size={13} />
            Export All
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Feedback banner ────────────────────────────────────── */}
      {feedback && (
        <div
          className={`px-5 py-3 mb-8 flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.3)]'
              : 'bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={16} className="text-[#16A34A]" />
          ) : (
            <AlertCircle size={16} className="text-[#DC2626]" />
          )}
          <span className={`text-sm ${feedback.type === 'success' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {feedback.message}
          </span>
        </div>
      )}

      <div className="space-y-8">
        {/* ======================================================== */}
        {/*  1. GENERAL                                               */}
        {/* ======================================================== */}
        <SectionCard icon={Globe} title="General">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Site Name" htmlFor="siteName">
              <input
                id="siteName"
                className="input-lux"
                value={settings.siteName}
                onChange={(e) => update('siteName', e.target.value)}
                placeholder="Your studio name"
              />
            </Field>

            <Field label="Site Tagline" htmlFor="siteTagline">
              <input
                id="siteTagline"
                className="input-lux"
                value={settings.siteTagline}
                onChange={(e) => update('siteTagline', e.target.value)}
                placeholder="A short tagline"
              />
            </Field>

            <Field label="Contact Email" htmlFor="contactEmail">
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
                <input
                  id="contactEmail"
                  type="email"
                  className="input-lux pl-9"
                  value={settings.contactEmail}
                  onChange={(e) => update('contactEmail', e.target.value)}
                  placeholder="hello@studio.com"
                />
              </div>
            </Field>

            <Field label="Contact Phone" htmlFor="contactPhone">
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
                <input
                  id="contactPhone"
                  type="tel"
                  className="input-lux pl-9"
                  value={settings.contactPhone}
                  onChange={(e) => update('contactPhone', e.target.value)}
                  placeholder="+92 300 1234567"
                />
              </div>
            </Field>
          </div>

          <Field label="Address" htmlFor="address">
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3.5 text-[#8A8073]" />
              <textarea
                id="address"
                className="textarea-lux pl-9 min-h-[80px] resize-y"
                value={settings.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Studio address"
                rows={2}
              />
            </div>
          </Field>
        </SectionCard>

        {/* ======================================================== */}
        {/*  2. BRAND COLORS                                          */}
        {/* ======================================================== */}
        <SectionCard icon={Palette} title="Brand Colors">
          <p className="text-xs text-[#8A8073] font-light -mt-2 mb-1">
            Set your site's primary and accent colors. These are applied across the frontend theme.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ColorField
              label="Primary Color"
              htmlFor="primaryColor"
              value={settings.primaryColor}
              onChange={(v) => update('primaryColor', v)}
              description="Main brand color used for headings, buttons, and highlights"
            />

            <ColorField
              label="Accent Color"
              htmlFor="accentColor"
              value={settings.accentColor}
              onChange={(v) => update('accentColor', v)}
              description="Secondary color for backgrounds, borders, and subtle elements"
            />
          </div>

          {/* Live preview swatch */}
          <div className="flex items-center gap-4 pt-3">
            <span className="text-xs text-[#8A8073] font-light">Preview:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border border-[rgba(201,168,76,0.2)]"
                style={{ backgroundColor: settings.primaryColor }}
                title={`Primary: ${settings.primaryColor}`}
              />
              <div
                className="w-8 h-8 border border-[rgba(201,168,76,0.2)]"
                style={{ backgroundColor: settings.accentColor }}
                title={`Accent: ${settings.accentColor}`}
              />
              <div
                className="px-4 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: settings.primaryColor,
                  color: settings.accentColor,
                }}
              >
                Button
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ======================================================== */}
        {/*  3. SOCIAL MEDIA                                          */}
        {/* ======================================================== */}
        <SectionCard icon={Share2} title="Social Media">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Instagram URL" htmlFor="socialInstagram">
              <div className="relative">
                <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
                <input
                  id="socialInstagram"
                  className="input-lux pl-9"
                  value={settings.socialInstagram}
                  onChange={(e) => update('socialInstagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </Field>

            <Field label="LinkedIn URL" htmlFor="socialLinkedIn">
              <div className="relative">
                <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
                <input
                  id="socialLinkedIn"
                  className="input-lux pl-9"
                  value={settings.socialLinkedIn}
                  onChange={(e) => update('socialLinkedIn', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </Field>

            <Field label="Pinterest URL" htmlFor="socialPinterest">
              <div className="relative">
                <Share2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
                <input
                  id="socialPinterest"
                  className="input-lux pl-9"
                  value={settings.socialPinterest}
                  onChange={(e) => update('socialPinterest', e.target.value)}
                  placeholder="https://pinterest.com/..."
                />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* ======================================================== */}
        {/*  4. SEO DEFAULTS                                          */}
        {/* ======================================================== */}
        <SectionCard icon={Search} title="SEO Defaults">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Default Meta Title Format" htmlFor="seoTitleFormat">
              <input
                id="seoTitleFormat"
                className="input-lux"
                value={settings.seoTitleFormat || '{page} | Woodex Interior Lahore'}
                onChange={(e) => update('seoTitleFormat', e.target.value)}
                placeholder="{page} | Woodex Interior Lahore"
              />
              <p className="text-xs text-[#8A8073] font-light mt-1.5">
                Use {'{page}'} as a placeholder for the page name. This will be appended to every meta title.
              </p>
            </Field>

            <Field label="Default Meta Description" htmlFor="seoMetaDesc">
              <textarea
                id="seoMetaDesc"
                className="textarea-lux min-h-[80px] resize-y"
                value={settings.seoMetaDesc || ''}
                onChange={(e) => update('seoMetaDesc', e.target.value)}
                placeholder="Pakistan's leading interior design studio. Residential and commercial projects in Lahore."
                rows={3}
              />
              <p className="text-xs text-[#8A8073] font-light mt-1.5">
                Fallback meta description for pages that do not define their own.
              </p>
            </Field>
          </div>
        </SectionCard>

        {/* ======================================================== */}
        {/*  5. SITE BEHAVIOR                                         */}
        {/* ======================================================== */}
        <SectionCard icon={Shield} title="Site Behavior">
          <Toggle
            checked={settings.maintenanceMode}
            onChange={(v) => update('maintenanceMode', v)}
            label="Maintenance Mode"
            description="Show a maintenance page to visitors while you make changes"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Toggle
            checked={settings.allowRegistrations}
            onChange={(v) => update('allowRegistrations', v)}
            label="Allow Registrations"
            description="Let new users create accounts on the site"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Toggle
            checked={settings.emailNotifications}
            onChange={(v) => update('emailNotifications', v)}
            label="Email Notifications"
            description="Receive email alerts for new leads and activity"
          />
        </SectionCard>

        {/* ======================================================== */}
        {/*  6. WHATSAPP ALERTS                                       */}
        {/* ======================================================== */}
        <SectionCard icon={MessageSquare} title="WhatsApp Alerts">
          <Toggle
            checked={settings.whatsappAlertsEnabled}
            onChange={(v) => update('whatsappAlertsEnabled', v)}
            label="Enable WhatsApp Alerts"
            description="Send real-time WhatsApp notifications for important events"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Field label="Alert Phone Number" htmlFor="alertPhone">
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
              <input
                id="alertPhone"
                type="tel"
                className="input-lux pl-9"
                value={settings.alertPhone}
                onChange={(e) => update('alertPhone', e.target.value)}
                placeholder="+92 300 9998877"
                disabled={!settings.whatsappAlertsEnabled}
              />
            </div>
          </Field>

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Toggle
            checked={settings.alertOnNewLead}
            onChange={(v) => update('alertOnNewLead', v)}
            label="Alert on New Lead"
            description="Get notified when a new lead is submitted"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Toggle
            checked={settings.alertOnNewConversation}
            onChange={(v) => update('alertOnNewConversation', v)}
            label="Alert on New Conversation"
            description="Get notified when a new chat conversation starts"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Toggle
            checked={settings.alertOnUrgentPriority}
            onChange={(v) => update('alertOnUrgentPriority', v)}
            label="Alert on Urgent Priority"
            description="Get notified for messages marked as urgent"
          />
        </SectionCard>

        {/* ======================================================== */}
        {/*  7. AI / LLM AGENT                                        */}
        {/* ======================================================== */}
        <SectionCard icon={Bot} title="AI / LLM Agent">
          <Toggle
            checked={settings.llmAgentEnabled}
            onChange={(v) => update('llmAgentEnabled', v)}
            label="Enable LLM Agent"
            description="Allow the AI agent to handle conversations and auto-reply to visitors"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="LLM Model" htmlFor="llmAgentModel">
              <select
                id="llmAgentModel"
                className="input-lux"
                value={settings.llmAgentModel}
                onChange={(e) => update('llmAgentModel', e.target.value)}
                disabled={!settings.llmAgentEnabled}
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Fast, Cost-effective)</option>
                <option value="gpt-4o">GPT-4o (Most Capable)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
              </select>
            </Field>

            <div>
              <label className="label-lux">API Key Status</label>
              <div
                className={`flex items-center gap-3 px-4 py-2.5 border ${
                  llmStatus?.apiKeyConfigured
                    ? 'bg-[rgba(22,163,74,0.08)] border-[rgba(22,163,74,0.25)]'
                    : 'bg-[rgba(220,38,38,0.08)] border-[rgba(220,38,38,0.25)]'
                }`}
              >
                {llmStatusLoading ? (
                  <Loader2 size={14} className="text-[#8A8073] animate-spin" />
                ) : llmStatus?.apiKeyConfigured ? (
                  <>
                    <div className="w-2 h-2 bg-[#16A34A] rounded-full shrink-0" />
                    <span className="text-sm text-[#16A34A]">OpenAI API key configured</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-[#DC2626] rounded-full shrink-0" />
                    <span className="text-sm text-[#DC2626]">No API key found. Set OPENAI_API_KEY in your .env</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#8A8073] font-light mt-1.5">
                The API key is read from the server environment variable OPENAI_API_KEY.
              </p>
            </div>
          </div>

          {llmStatus && (
            <div className="flex items-center gap-2 text-xs text-[#8A8073]">
              <Zap size={12} className="text-[#C9A84C]" />
              <span>
                Current status: LLM agent is{' '}
                <span className={llmStatus.enabled ? 'text-[#16A34A]' : 'text-[#8A8073]'}>
                  {llmStatus.enabled ? 'enabled' : 'disabled'}
                </span>
                {' '}&middot; Model:{' '}
                <span className="text-white">{llmStatus.model}</span>
              </span>
            </div>
          )}
        </SectionCard>

        {/* ======================================================== */}
        {/*  8. DEFAULT AGENT                                          */}
        {/* ======================================================== */}
        <SectionCard icon={UserCheck} title="Default Agent">
          <Toggle
            checked={settings.autoAssignAgent}
            onChange={(v) => update('autoAssignAgent', v)}
            label="Auto-Assign Agent"
            description="Automatically assign incoming conversations to the default agent"
          />

          <div className="border-t border-[rgba(201,168,76,0.1)]" />

          <Field label="Default Agent" htmlFor="defaultAgentId">
            <select
              id="defaultAgentId"
              className="input-lux"
              value={settings.defaultAgentId || ''}
              onChange={(e) => update('defaultAgentId', e.target.value || null)}
              disabled={!settings.autoAssignAgent || agentsLoading}
            >
              <option value="">
                {agentsLoading ? 'Loading agents...' : 'No agent selected'}
              </option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent.role})
                </option>
              ))}
            </select>
          </Field>

          {!agentsLoading && agents.length === 0 && (
            <p className="text-xs text-[#8A8073] font-light">
              No agents found. Create agents in the{' '}
              <span className="text-[#C9A84C]">Support</span>{' '}
              section first.
            </p>
          )}

          {agents.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#8A8073]">
              <UserCheck size={12} className="text-[#C9A84C]" />
              <span>
                {agents.length} agent{agents.length !== 1 ? 's' : ''} available
                {settings.defaultAgentId && (
                  <span>
                    {' '}&middot; Assigned:{' '}
                    <span className="text-white">
                      {agents.find((a) => a._id === settings.defaultAgentId)?.name || 'Unknown'}
                    </span>
                  </span>
                )}
              </span>
            </div>
          )}
        </SectionCard>

        {/* ======================================================== */}
        {/*  9. BUSINESS HOURS                                        */}
        {/* ======================================================== */}
        <SectionCard icon={Clock} title="Business Hours">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Opening Time" htmlFor="businessHoursStart">
              <input
                id="businessHoursStart"
                type="time"
                className="input-lux"
                value={settings.businessHoursStart}
                onChange={(e) => update('businessHoursStart', e.target.value)}
              />
            </Field>

            <Field label="Closing Time" htmlFor="businessHoursEnd">
              <input
                id="businessHoursEnd"
                type="time"
                className="input-lux"
                value={settings.businessHoursEnd}
                onChange={(e) => update('businessHoursEnd', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Out-of-Hours Auto-Reply Message" htmlFor="outOfHoursMessage">
            <textarea
              id="outOfHoursMessage"
              className="textarea-lux min-h-[90px] resize-y"
              value={settings.outOfHoursMessage}
              onChange={(e) => update('outOfHoursMessage', e.target.value)}
              placeholder="Message sent outside business hours"
              rows={3}
            />
          </Field>
        </SectionCard>

        {/* ======================================================== */}
        {/*  10. DANGER ZONE                                          */}
        {/* ======================================================== */}
        <div className="bg-[#111110] border border-[rgba(220,38,38,0.3)]">
          <div className="px-6 py-5 border-b border-[rgba(220,38,38,0.15)] flex items-center gap-3">
            <AlertTriangle size={18} className="text-[#DC2626]" />
            <h2 className="font-display text-xl text-[#DC2626]">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Reset All Settings */}
            <div className="flex items-center justify-between gap-6 py-2">
              <div>
                <p className="text-sm text-white font-medium">Reset All Settings</p>
                <p className="text-xs text-[#8A8073] font-light mt-0.5">
                  Revert all settings back to their original defaults. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="btn-lux text-[0.6rem] py-2.5 px-5 bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.25)] transition-colors shrink-0"
              >
                {resetting ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                {resetting ? 'Resetting...' : 'Reset All'}
              </button>
            </div>

            <div className="border-t border-[rgba(220,38,38,0.15)]" />

            {/* Reset Theme Only */}
            <div className="flex items-center justify-between gap-6 py-2">
              <div>
                <p className="text-sm text-white font-medium">Reset Theme Only</p>
                <p className="text-xs text-[#8A8073] font-light mt-0.5">
                  Reset the visual theme (colors, fonts, layout) to defaults without affecting other settings.
                </p>
              </div>
              <button
                onClick={handleResetTheme}
                disabled={resettingTheme}
                className="btn-lux text-[0.6rem] py-2.5 px-5 bg-[rgba(220,38,38,0.12)] text-[#DC2626] border border-[rgba(220,38,38,0.3)] hover:bg-[rgba(220,38,38,0.25)] transition-colors shrink-0"
              >
                {resettingTheme ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                {resettingTheme ? 'Resetting...' : 'Reset Theme'}
              </button>
            </div>

            <div className="border-t border-[rgba(220,38,38,0.15)]" />

            {/* Export All Data */}
            <div className="flex items-center justify-between gap-6 py-2">
              <div>
                <p className="text-sm text-white font-medium">Export All Data</p>
                <p className="text-xs text-[#8A8073] font-light mt-0.5">
                  Download a complete backup combining settings, theme configuration, and page data into a single JSON file.
                </p>
              </div>
              <button
                onClick={handleExportAllData}
                disabled={exportingAll}
                className="btn-lux text-[0.6rem] py-2.5 px-5 bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.25)] transition-colors shrink-0"
              >
                {exportingAll ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ExternalLink size={13} />
                )}
                {exportingAll ? 'Exporting...' : 'Export All Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky save bar (bottom) ──────────────────────────── */}
      <div className="sticky bottom-0 mt-10 -mx-8 px-8 py-5 bg-[#0A0A0A] border-t border-[rgba(201,168,76,0.15)] flex items-center justify-end gap-3">
        <button onClick={handleExport} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
          <Download size={13} />
          Export All
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
