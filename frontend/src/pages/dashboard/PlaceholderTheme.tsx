import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Type,
  Palette,
  Ruler,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
  Save,
  Eye,
  AlertCircle,
  Download,
  Upload,
  Copy,
  Clock,
  Undo2,
  FileJson,
  X,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';

/* ─────────────────────────────────────────────
   Types & defaults
   ───────────────────────────────────────────── */

interface ThemeData {
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  colorCream: string;
  colorEspresso: string;
  colorGold: string;
  colorGoldHover: string;
  colorWhite: string;
  colorText: string;
  colorHeading: string;
  colorBorder: string;
  colorSuccess: string;
  colorDanger: string;
  heroHeight: string;
  sectionSpacing: string;
  cardRadius: string;
  buttonRadius: string;
  baseFontSize: string;
  enableShadows: boolean;
  enableAnimations: boolean;
  darkMode: boolean;
}

const DEFAULT_THEME: ThemeData = {
  fontHeading: 'Cormorant Garamond',
  fontBody: 'Montserrat',
  fontMono: 'JetBrains Mono',
  colorCream: '#FAF7F2',
  colorEspresso: '#1A1410',
  colorGold: '#C9A84C',
  colorGoldHover: '#E2C97E',
  colorWhite: '#FFFFFF',
  colorText: '#D4C5A9',
  colorHeading: '#FFFFFF',
  colorBorder: 'rgba(201,168,76,0.2)',
  colorSuccess: '#16A34A',
  colorDanger: '#DC2626',
  heroHeight: '100vh',
  sectionSpacing: '6rem',
  cardRadius: '0px',
  buttonRadius: '0px',
  baseFontSize: '16px',
  enableShadows: true,
  enableAnimations: true,
  darkMode: true,
};

/* ── Theme presets ── */

const THEME_PRESETS: { id: string; name: string; description: string; theme: ThemeData }[] = [
  {
    id: 'woodex-dark',
    name: 'Woodex Dark',
    description: 'Gold on black — the signature Woodex look',
    theme: { ...DEFAULT_THEME },
  },
  {
    id: 'woodex-light',
    name: 'Woodex Light',
    description: 'Gold accents on a warm cream canvas',
    theme: {
      ...DEFAULT_THEME,
      colorCream: '#FAF7F2',
      colorEspresso: '#1A1410',
      colorGold: '#C9A84C',
      colorGoldHover: '#B8973F',
      colorWhite: '#FFFFFF',
      colorText: '#4A4236',
      colorHeading: '#1A1410',
      colorBorder: 'rgba(26,20,16,0.15)',
      colorSuccess: '#16A34A',
      colorDanger: '#DC2626',
      enableShadows: false,
      enableAnimations: true,
      darkMode: false,
    },
  },
  {
    id: 'classic-luxury',
    name: 'Classic Luxury',
    description: 'Deep navy with burnished gold',
    theme: {
      ...DEFAULT_THEME,
      fontHeading: 'Playfair Display',
      fontBody: 'Lato',
      fontMono: 'Fira Code',
      colorCream: '#F0EDE6',
      colorEspresso: '#1A1A2E',
      colorGold: '#D4AF37',
      colorGoldHover: '#E6C84C',
      colorWhite: '#FFFFFF',
      colorText: '#B8B5C8',
      colorHeading: '#FFFFFF',
      colorBorder: 'rgba(212,175,55,0.2)',
      colorSuccess: '#27AE60',
      colorDanger: '#C0392B',
      cardRadius: '4px',
      buttonRadius: '4px',
      enableShadows: true,
      enableAnimations: true,
      darkMode: true,
    },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean white with charcoal and subtle gold',
    theme: {
      ...DEFAULT_THEME,
      fontHeading: 'Inter',
      fontBody: 'Inter',
      fontMono: 'JetBrains Mono',
      colorCream: '#F9F9F9',
      colorEspresso: '#111111',
      colorGold: '#C9A84C',
      colorGoldHover: '#B8973F',
      colorWhite: '#FFFFFF',
      colorText: '#666666',
      colorHeading: '#333333',
      colorBorder: 'rgba(51,51,51,0.15)',
      colorSuccess: '#10B981',
      colorDanger: '#EF4444',
      cardRadius: '12px',
      buttonRadius: '8px',
      baseFontSize: '16px',
      enableShadows: false,
      enableAnimations: true,
      darkMode: false,
    },
  },
];

/* ── Theme history ── */

interface ThemeHistoryEntry {
  timestamp: number;
  theme: ThemeData;
  label?: string;
}

const HISTORY_KEY = 'woodex-theme-history';
const MAX_HISTORY = 5;

function loadThemeHistory(): ThemeHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveThemeHistory(entries: ThemeHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

function addToHistory(theme: ThemeData, label?: string) {
  const history = loadThemeHistory();
  const entry: ThemeHistoryEntry = { timestamp: Date.now(), theme: { ...theme }, label };
  history.unshift(entry);
  saveThemeHistory(history.slice(0, MAX_HISTORY));
}

/* ── Theme field keys for validation ── */

const THEME_KEYS: (keyof ThemeData)[] = [
  'fontHeading', 'fontBody', 'fontMono',
  'colorCream', 'colorEspresso', 'colorGold', 'colorGoldHover',
  'colorWhite', 'colorText', 'colorHeading', 'colorBorder',
  'colorSuccess', 'colorDanger',
  'heroHeight', 'sectionSpacing', 'cardRadius', 'buttonRadius', 'baseFontSize',
  'enableShadows', 'enableAnimations', 'darkMode',
];

function isValidThemeData(obj: unknown): obj is Partial<ThemeData> {
  if (typeof obj !== 'object' || obj === null) return false;
  const keys = Object.keys(obj);
  // Must have at least half the keys to be considered a valid theme import
  return keys.length >= Math.ceil(THEME_KEYS.length / 2);
}

/* ── CSS variable generation ── */

function generateCSSVariables(theme: ThemeData): string {
  const lines = [
    ':root {',
    `  /* Woodex Interior — Generated Theme */`,
    '',
    '  /* Fonts */',
    `  --font-heading: '${theme.fontHeading}';`,
    `  --font-body: '${theme.fontBody}';`,
    `  --font-mono: '${theme.fontMono}';`,
    '',
    '  /* Colors */',
    `  --color-cream: ${theme.colorCream};`,
    `  --color-espresso: ${theme.colorEspresso};`,
    `  --color-gold: ${theme.colorGold};`,
    `  --color-gold-hover: ${theme.colorGoldHover};`,
    `  --color-white: ${theme.colorWhite};`,
    `  --color-text: ${theme.colorText};`,
    `  --color-heading: ${theme.colorHeading};`,
    `  --color-border: ${theme.colorBorder};`,
    `  --color-success: ${theme.colorSuccess};`,
    `  --color-danger: ${theme.colorDanger};`,
    '',
    '  /* Sizing */',
    `  --hero-height: ${theme.heroHeight};`,
    `  --section-spacing: ${theme.sectionSpacing};`,
    `  --card-radius: ${theme.cardRadius};`,
    `  --button-radius: ${theme.buttonRadius};`,
    `  --base-font-size: ${theme.baseFontSize};`,
    '}',
  ];
  return lines.join('\n');
}

/* ── Font options (luxury-appropriate) ── */

const HEADING_FONTS = [
  'Cormorant Garamond',
  'Playfair Display',
  'Cinzel',
  'Libre Baskerville',
  'Lora',
  'Merriweather',
  'Bodoni Moda',
  'DM Serif Display',
  'Instrument Serif',
  'EB Garamond',
  'Spectral',
  'Crimson Text',
];

const BODY_FONTS = [
  'Montserrat',
  'Inter',
  'Raleway',
  'Open Sans',
  'Lato',
  'Poppins',
  'Nunito Sans',
  'Work Sans',
  'DM Sans',
  'Outfit',
  'Manrope',
  'Figtree',
];

const MONO_FONTS = [
  'JetBrains Mono',
  'Fira Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'Space Mono',
  'Inconsolata',
  'Courier Prime',
  'Roboto Mono',
  'PT Mono',
  'Red Hat Mono',
];

/* ─────────────────────────────────────────────
   Color field definitions
   ───────────────────────────────────────────── */

const COLOR_FIELDS: { key: keyof ThemeData; label: string; hint: string }[] = [
  { key: 'colorCream', label: 'Cream / Background', hint: 'Light background accents' },
  { key: 'colorEspresso', label: 'Espresso / Dark', hint: 'Dark surfaces & text' },
  { key: 'colorGold', label: 'Gold / Primary', hint: 'Brand accent color' },
  { key: 'colorGoldHover', label: 'Gold Hover', hint: 'Gold hover / active state' },
  { key: 'colorWhite', label: 'White', hint: 'Primary headings & text' },
  { key: 'colorText', label: 'Body Text', hint: 'Paragraph & body copy' },
  { key: 'colorHeading', label: 'Heading Color', hint: 'Section headings' },
  { key: 'colorBorder', label: 'Border', hint: 'Borders & dividers' },
  { key: 'colorSuccess', label: 'Success', hint: 'Success indicators' },
  { key: 'colorDanger', label: 'Danger', hint: 'Error & delete actions' },
];

/* ─────────────────────────────────────────────
   Size & spacing fields
   ───────────────────────────────────────────── */

const SIZE_FIELDS: {
  key: keyof ThemeData;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: 'heroHeight', label: 'Hero Height', min: 40, max: 100, step: 1, unit: 'vh' },
  { key: 'sectionSpacing', label: 'Section Spacing', min: 2, max: 12, step: 0.5, unit: 'rem' },
  { key: 'cardRadius', label: 'Card Radius', min: 0, max: 24, step: 1, unit: 'px' },
  { key: 'buttonRadius', label: 'Button Radius', min: 0, max: 24, step: 1, unit: 'px' },
  { key: 'baseFontSize', label: 'Base Font Size', min: 12, max: 22, step: 0.5, unit: 'px' },
];

/* ─────────────────────────────────────────────
   Google Fonts loader
   ───────────────────────────────────────────── */

const loadedFonts = new Set<string>();

function loadGoogleFont(fontFamily: string) {
  if (loadedFonts.has(fontFamily)) return;
  const slug = fontFamily.replace(/ /g, '+');
  const id = `gfont-${slug}`;
  if (document.getElementById(id)) {
    loadedFonts.add(fontFamily);
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}

/* ─────────────────────────────────────────────
   Reset field groups
   ───────────────────────────────────────────── */

const FONT_KEYS: (keyof ThemeData)[] = ['fontHeading', 'fontBody', 'fontMono'];
const COLOR_KEYS: (keyof ThemeData)[] = [
  'colorCream', 'colorEspresso', 'colorGold', 'colorGoldHover',
  'colorWhite', 'colorText', 'colorHeading', 'colorBorder',
  'colorSuccess', 'colorDanger',
];
const LAYOUT_KEYS: (keyof ThemeData)[] = [
  'heroHeight', 'sectionSpacing', 'cardRadius', 'buttonRadius', 'baseFontSize',
];

/* ─────────────────────────────────────────────
   Tab definitions
   ───────────────────────────────────────────── */

const TABS = [
  { id: 'fonts', label: 'Fonts', icon: Type },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'sizes', label: 'Sizes & Spacing', icon: Ruler },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'import-export', label: 'Import / Export', icon: Download },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export default function PlaceholderTheme() {
  const [theme, setTheme] = useState<ThemeData>({ ...DEFAULT_THEME });
  const [savedTheme, setSavedTheme] = useState<ThemeData>({ ...DEFAULT_THEME });
  const [activeTab, setActiveTab] = useState<TabId>('fonts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Reset category confirm dialog ── */
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetCategory, setResetCategory] = useState<string>('');

  /* ── Theme history ── */
  const [history, setHistory] = useState<ThemeHistoryEntry[]>([]);

  /* ── Load theme on mount ── */
  useEffect(() => {
    fetchTheme();
    setHistory(loadThemeHistory());
  }, []);

  async function fetchTheme() {
    setLoading(true);
    try {
      const res = await adminFetch<{ theme: ThemeData }>('/admin/theme');
      const data = { ...DEFAULT_THEME, ...(res.theme || {}) };
      setTheme(data);
      setSavedTheme(data);
      loadAllFonts(data);
    } catch {
      setToast({ type: 'error', message: 'Failed to load theme settings' });
    } finally {
      setLoading(false);
    }
  }

  function loadAllFonts(t: ThemeData) {
    loadGoogleFont(t.fontHeading);
    loadGoogleFont(t.fontBody);
    loadGoogleFont(t.fontMono);
  }

  /* ── Show toast ── */
  function showToast(type: 'success' | 'error', message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  /* ── Change handler ── */
  const update = useCallback(<K extends keyof ThemeData>(key: K, value: ThemeData[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── Apply a full theme (from presets, import, history) ── */
  function applyTheme(newTheme: ThemeData, label?: string) {
    loadAllFonts(newTheme);
    setTheme(newTheme);
    addToHistory(newTheme, label);
    setHistory(loadThemeHistory());
  }

  /* ── Save ── */
  async function handleSave() {
    setSaving(true);
    try {
      await adminFetch('/admin/theme', {
        method: 'PUT',
        body: JSON.stringify(theme),
      });
      setSavedTheme({ ...theme });
      addToHistory(theme, 'Saved');
      setHistory(loadThemeHistory());
      showToast('success', 'Theme saved successfully');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  }

  /* ── Reset ── */
  function openResetDialog(category: string) {
    setResetCategory(category);
    setResetDialogOpen(true);
  }

  async function handleResetCategory() {
    setResetting(true);
    setResetDialogOpen(false);
    try {
      if (resetCategory === 'all') {
        await adminFetch('/admin/theme/reset', { method: 'POST' });
        const resetTheme = { ...DEFAULT_THEME };
        setTheme(resetTheme);
        setSavedTheme(resetTheme);
        loadAllFonts(resetTheme);
        addToHistory(resetTheme, 'Reset All');
      } else {
        let keys: (keyof ThemeData)[] = [];
        if (resetCategory === 'fonts') keys = FONT_KEYS;
        else if (resetCategory === 'colors') keys = COLOR_KEYS;
        else if (resetCategory === 'layout') keys = LAYOUT_KEYS;

        setTheme((prev) => {
          const next = { ...prev };
          keys.forEach((k) => {
            (next as Record<string, unknown>)[k] = (DEFAULT_THEME as Record<string, unknown>)[k];
          });
          loadAllFonts(next);
          addToHistory(next, `Reset ${resetCategory}`);
          return next;
        });
      }
      setHistory(loadThemeHistory());
      showToast('success', `Reset ${resetCategory === 'all' ? 'all settings' : resetCategory + ' only'}`);
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to reset');
    } finally {
      setResetting(false);
    }
  }

  /* ── Derived: dirty check ── */
  const isDirty = JSON.stringify(theme) !== JSON.stringify(savedTheme);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div className="p-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Theme Manager</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Colors, fonts, spacing & brand tokens
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewModal(true)}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 gap-1.5"
          >
            <Eye size={13} />
            Preview
          </button>
          <button
            onClick={() => openResetDialog('all')}
            disabled={resetting}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 gap-1.5"
          >
            {resetting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RotateCcw size={13} />
            )}
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Unsaved indicator ── */}
      {isDirty && (
        <div className="mb-6 flex items-center gap-2 text-[0.7rem] tracking-wide text-[#C9A84C] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] px-4 py-2.5">
          <AlertCircle size={13} />
          <span className="font-medium">Unsaved changes &mdash; click &ldquo;Save Changes&rdquo; to apply</span>
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 mb-8 border-b border-[rgba(201,168,76,0.15)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-[0.62rem] tracking-[0.2em] uppercase font-semibold transition-all relative ${
                isActive
                  ? 'text-[#C9A84C]'
                  : 'text-[#8A8073] hover:text-[#D4C5A9]'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ── */}
      <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
        {activeTab === 'fonts' && (
          <FontsTab theme={theme} update={update} />
        )}
        {activeTab === 'colors' && (
          <ColorsTab theme={theme} update={update} />
        )}
        {activeTab === 'sizes' && (
          <SizesTab theme={theme} update={update} />
        )}
        {activeTab === 'effects' && (
          <EffectsTab
            theme={theme}
            update={update}
            onResetFonts={() => openResetDialog('fonts')}
            onResetColors={() => openResetDialog('colors')}
            onResetLayout={() => openResetDialog('layout')}
          />
        )}
        {activeTab === 'import-export' && (
          <ImportExportTab
            theme={theme}
            applyTheme={applyTheme}
            showToast={showToast}
          />
        )}
      </div>

      {/* ── Theme History (below tabs, always visible) ── */}
      {history.length > 0 && (
        <ThemeHistory
          history={history}
          onRestore={(entry) => {
            applyTheme(entry.theme, 'Restored from history');
            showToast('success', 'Theme restored from history');
          }}
          onClear={() => {
            localStorage.removeItem(HISTORY_KEY);
            setHistory([]);
            showToast('success', 'History cleared');
          }}
        />
      )}

      {/* ── Live preview card (always visible below tabs) ── */}
      <LivePreviewCard theme={theme} />

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 text-sm font-medium border ${
            toast.type === 'success'
              ? 'bg-[rgba(22,163,74,0.12)] border-[rgba(22,163,74,0.3)] text-[#16A34A]'
              : 'bg-[rgba(220,38,38,0.12)] border-[rgba(220,38,38,0.3)] text-[#DC2626]'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* ── Preview Modal ── */}
      <AdminModal
        open={previewModal}
        onClose={() => setPreviewModal(false)}
        title="Theme Preview"
        size="lg"
      >
        <PreviewModalContent theme={theme} />
      </AdminModal>

      {/* ── Reset Category Confirm Dialog ── */}
      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetCategory}
        title={`Reset ${resetCategory === 'all' ? 'All Settings' : resetCategory.charAt(0).toUpperCase() + resetCategory.slice(1) + ' Only'}`}
        message={
          resetCategory === 'all'
            ? 'This will reset all theme settings to factory defaults and save to the server. This cannot be undone.'
            : `This will reset only ${resetCategory} settings to defaults. Other settings will remain unchanged.`
        }
        confirmLabel={resetCategory === 'all' ? 'Reset All' : 'Reset'}
        loading={resetting}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: FONTS
   ═══════════════════════════════════════════════ */

function FontsTab({
  theme,
  update,
}: {
  theme: ThemeData;
  update: <K extends keyof ThemeData>(key: K, value: ThemeData[K]) => void;
}) {
  const fontSelectors: {
    key: 'fontHeading' | 'fontBody' | 'fontMono';
    label: string;
    desc: string;
    options: string[];
    previewText: string;
    previewSize: string;
  }[] = [
    {
      key: 'fontHeading',
      label: 'Heading Font',
      desc: 'Used for page titles, section headings, and display text',
      options: HEADING_FONTS,
      previewText: 'The Art of Interior Design',
      previewSize: 'text-3xl',
    },
    {
      key: 'fontBody',
      label: 'Body Font',
      desc: 'Used for paragraphs, labels, and general UI text',
      options: BODY_FONTS,
      previewText: 'Luxury interior spaces crafted with precision and timeless elegance for discerning clients.',
      previewSize: 'text-base',
    },
    {
      key: 'fontMono',
      label: 'Monospace Font',
      desc: 'Used for code blocks, technical content, and accent typography',
      options: MONO_FONTS,
      previewText: '0123456789 & $ # {} () => function()',
      previewSize: 'text-sm',
    },
  ];

  return (
    <div className="space-y-8">
      {fontSelectors.map((f) => {
        const fontFamily = `'${theme[f.key]}', sans-serif`;
        loadGoogleFont(theme[f.key]);
        return (
          <div key={f.key}>
            <label className="label-lux">{f.label}</label>
            <p className="text-[0.72rem] text-[#8A8073] mb-3">{f.desc}</p>
            <select
              value={theme[f.key]}
              onChange={(e) => update(f.key, e.target.value as string)}
              className="select-lux mb-4"
            >
              {f.options.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <div
              className={`bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] px-6 py-5 ${f.previewSize}`}
              style={{ fontFamily }}
            >
              <p className="text-[#D4C5A9] leading-relaxed whitespace-pre-wrap">
                {f.previewText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: COLORS
   ═══════════════════════════════════════════════ */

function ColorsTab({
  theme,
  update,
}: {
  theme: ThemeData;
  update: <K extends keyof ThemeData>(key: K, value: ThemeData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Palette preview grid */}
      <div>
        <label className="label-lux mb-3 block">Palette Preview</label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {COLOR_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col items-center gap-1.5">
              <div
                className="w-full aspect-square border border-[rgba(201,168,76,0.15)]"
                style={{ backgroundColor: theme[f.key] as string }}
              />
              <span className="text-[0.5rem] text-[#8A8073] tracking-wider uppercase text-center leading-tight">
                {f.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {COLOR_FIELDS.map((f) => (
          <ColorPicker
            key={f.key}
            label={f.label}
            hint={f.hint}
            value={theme[f.key] as string}
            onChange={(val) => update(f.key, val as ThemeData[typeof f.key])}
          />
        ))}
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [hexInput, setHexInput] = useState(value);
  const isRgb = value.startsWith('rgb');

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  function handleHexCommit() {
    const v = hexInput.trim();
    if (v === '') return;
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(v)) {
      onChange(v);
    }
  }

  const nativeColor = isRgb ? '#000000' : value;

  return (
    <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] px-4 py-3">
      <div className="relative flex-shrink-0">
        <input
          type="color"
          value={nativeColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 cursor-pointer border border-[rgba(201,168,76,0.15)] bg-transparent p-0"
          style={{ appearance: 'none', WebkitAppearance: 'none' }}
        />
        <div
          className="absolute inset-0 pointer-events-none border border-[rgba(201,168,76,0.15)]"
          style={{ backgroundColor: value }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-[#D4C5A9]">
          {label}
        </div>
        <div className="text-[0.6rem] text-[#8A8073] mt-0.5">{hint}</div>
      </div>

      <input
        type="text"
        value={hexInput}
        onChange={(e) => setHexInput(e.target.value)}
        onBlur={handleHexCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleHexCommit();
        }}
        className="input-lux w-[9rem] text-xs py-2 text-center flex-shrink-0"
        spellCheck={false}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: SIZES & SPACING
   ═══════════════════════════════════════════════ */

function SizesTab({
  theme,
  update,
}: {
  theme: ThemeData;
  update: <K extends keyof ThemeData>(key: K, value: ThemeData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      {SIZE_FIELDS.map((f) => {
        const numericValue = parseFloat(theme[f.key] as string) || 0;
        return (
          <div key={f.key}>
            <div className="flex items-center justify-between mb-2">
              <label className="label-lux mb-0">{f.label}</label>
              <span className="text-[0.7rem] font-mono text-[#C9A84C] font-semibold">
                {theme[f.key]}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={numericValue}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  const isInt = f.step >= 1;
                  const display = isInt ? `${Math.round(v)}${f.unit}` : `${v}${f.unit}`;
                  update(f.key, display as ThemeData[typeof f.key]);
                }}
                className="flex-1 h-[2px] appearance-none bg-[rgba(201,168,76,0.3)] rounded-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-[#C9A84C] [&::-webkit-slider-thumb]:rounded-none
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(201,168,76,0.4)]
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:bg-[#C9A84C] [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:cursor-pointer"
              />
              <span className="text-[0.6rem] text-[#8A8073] w-16 text-right">{f.min}{f.unit}</span>
              <span className="text-[0.6rem] text-[#8A8073] w-16">{f.max}{f.unit}</span>
            </div>
            <div className="mt-2 h-[3px] bg-[rgba(201,168,76,0.08)] relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#C9A84C] transition-all duration-200"
                style={{
                  width: `${((numericValue - f.min) / (f.max - f.min)) * 100}%`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Size preview */}
      <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.1)]">
        <label className="label-lux mb-4 block">Sizing Preview</label>
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-6">
          <div
            className="border border-[rgba(201,168,76,0.2)] bg-[#161613] p-4 mb-4"
            style={{ borderRadius: theme.cardRadius }}
          >
            <p className="text-[#D4C5A9] text-sm mb-2">Card with {theme.cardRadius} radius</p>
            <button
              className="bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold uppercase tracking-widest px-5 py-2.5"
              style={{ borderRadius: theme.buttonRadius }}
            >
              Button ({theme.buttonRadius})
            </button>
          </div>
          <p className="text-[0.65rem] text-[#8A8073]">
            Base font: {theme.baseFontSize} | Section spacing: {theme.sectionSpacing} | Hero: {theme.heroHeight}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB: EFFECTS (with reset category buttons)
   ═══════════════════════════════════════════════ */

function EffectsTab({
  theme,
  update,
  onResetFonts,
  onResetColors,
  onResetLayout,
}: {
  theme: ThemeData;
  update: <K extends keyof ThemeData>(key: K, value: ThemeData[K]) => void;
  onResetFonts: () => void;
  onResetColors: () => void;
  onResetLayout: () => void;
}) {
  const toggles: {
    key: 'enableShadows' | 'enableAnimations' | 'darkMode';
    label: string;
    desc: string;
  }[] = [
    {
      key: 'enableShadows',
      label: 'Enable Shadows',
      desc: 'Gold-accented card and element shadows for depth and luxury feel',
    },
    {
      key: 'enableAnimations',
      label: 'Enable Animations',
      desc: 'Scroll reveals, hover transitions, and floating decorative elements',
    },
    {
      key: 'darkMode',
      label: 'Dark Mode',
      desc: 'Dark background theme with light text. Disable to switch to light backgrounds',
    },
  ];

  const resetCategories = [
    { label: 'Reset Fonts Only', desc: 'Restore fontHeading, fontBody, fontMono', onClick: onResetFonts },
    { label: 'Reset Colors Only', desc: 'Restore all color fields', onClick: onResetColors },
    { label: 'Reset Layout Only', desc: 'Restore sizes, spacing, radius, font size', onClick: onResetLayout },
  ];

  return (
    <div className="space-y-6">
      {toggles.map((t) => (
        <div
          key={t.key}
          className="flex items-center justify-between bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] px-5 py-4"
        >
          <div className="flex-1 mr-6">
            <div className="text-[0.72rem] font-semibold tracking-wider uppercase text-[#D4C5A9]">
              {t.label}
            </div>
            <div className="text-[0.65rem] text-[#8A8073] mt-1">{t.desc}</div>
          </div>
          <Toggle
            checked={theme[t.key] as boolean}
            onChange={(val) => update(t.key, val as ThemeData[typeof t.key])}
          />
        </div>
      ))}

      {/* Effects preview */}
      <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.1)]">
        <label className="label-lux mb-4 block">Effects Preview</label>
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-6">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-[#161613] border border-[rgba(201,168,76,0.15)] p-5 text-center"
              style={{
                boxShadow: theme.enableShadows
                  ? '0 8px 40px rgba(201,168,76,0.25)'
                  : 'none',
                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <p className="text-[0.65rem] text-[#8A8073] uppercase tracking-widest mb-2">Shadow</p>
              <p className="text-white text-sm">{theme.enableShadows ? 'On' : 'Off'}</p>
            </div>
            <div
              className="bg-[#161613] border border-[rgba(201,168,76,0.15)] p-5 text-center"
              style={{
                transition: theme.enableAnimations
                  ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s'
                  : 'none',
                transform: theme.enableAnimations ? 'translateY(-4px)' : 'none',
                boxShadow: theme.enableAnimations && theme.enableShadows
                  ? '0 12px 30px rgba(201,168,76,0.15)'
                  : 'none',
              }}
            >
              <p className="text-[0.65rem] text-[#8A8073] uppercase tracking-widest mb-2">Animation</p>
              <p className="text-white text-sm">{theme.enableAnimations ? 'Floating' : 'Static'}</p>
            </div>
          </div>
          <div
            className="mt-4 border border-[rgba(201,168,76,0.15)] p-5 flex items-center gap-4"
            style={{
              backgroundColor: theme.darkMode ? '#0A0A0A' : '#FAF7F2',
              transition: 'background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center text-xs font-semibold"
              style={{
                backgroundColor: theme.colorGold,
                color: '#0A0A0A',
                borderRadius: theme.buttonRadius,
              }}
            >
              Aa
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: theme.darkMode ? '#FFFFFF' : '#1A1410' }}
              >
                {theme.darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </p>
              <p
                className="text-xs"
                style={{ color: theme.darkMode ? '#D4C5A9' : '#8A8073' }}
              >
                This is how your content will appear
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Category Buttons */}
      <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.1)]">
        <label className="label-lux mb-4 block">Reset Categories</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {resetCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={cat.onClick}
              className="flex items-center gap-3 bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] px-4 py-3 text-left hover:border-[rgba(201,168,76,0.4)] transition-colors group"
            >
              <RotateCcw size={14} className="text-[#8A8073] group-hover:text-[#C9A84C] transition-colors flex-shrink-0" />
              <div>
                <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-[#D4C5A9] group-hover:text-[#C9A84C] transition-colors">
                  {cat.label}
                </div>
                <div className="text-[0.55rem] text-[#8A8073] mt-0.5">{cat.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 flex-shrink-0 transition-colors duration-300 ${
        checked ? 'bg-[#C9A84C]' : 'bg-[rgba(201,168,76,0.2)]'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 transition-all duration-300 ${
          checked ? 'left-[calc(100%-1.3rem)] bg-[#0A0A0A]' : 'left-0.5 bg-[#8A8073]'
        }`}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════════
   TAB: IMPORT / EXPORT
   ═══════════════════════════════════════════════ */

function ImportExportTab({
  theme,
  applyTheme,
  showToast,
}: {
  theme: ThemeData;
  applyTheme: (t: ThemeData, label?: string) => void;
  showToast: (type: 'success' | 'error', msg: string) => void;
}) {
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState<ThemeData | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Export ── */
  function handleExport() {
    const json = JSON.stringify(theme, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `woodex-theme-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Theme exported successfully');
  }

  /* ── Copy CSS Variables ── */
  async function handleCopyCSS() {
    const css = generateCSSVariables(theme);
    try {
      await navigator.clipboard.writeText(css);
      showToast('success', 'CSS variables copied to clipboard');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = css;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('success', 'CSS variables copied to clipboard');
    }
  }

  /* ── Import validation ── */
  function validateImport(raw: string): { valid: boolean; data?: ThemeData; error?: string } {
    try {
      const parsed = JSON.parse(raw);
      if (!isValidThemeData(parsed)) {
        return { valid: false, error: 'Invalid theme structure — must contain at least half of the expected fields' };
      }
      // Merge with defaults to fill missing fields
      const merged = { ...DEFAULT_THEME, ...parsed };
      return { valid: true, data: merged };
    } catch {
      return { valid: false, error: 'Invalid JSON — could not parse the input' };
    }
  }

  function handleImportTextChange(value: string) {
    setImportText(value);
    if (!value.trim()) {
      setImportPreview(null);
      setImportError('');
      return;
    }
    const result = validateImport(value);
    if (result.valid && result.data) {
      setImportPreview(result.data);
      setImportError('');
    } else {
      setImportPreview(null);
      setImportError(result.error || 'Invalid JSON');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
      handleImportTextChange(text);
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleImport() {
    if (!importPreview) return;
    applyTheme(importPreview, 'Imported');
    setImportText('');
    setImportPreview(null);
    showToast('success', 'Theme imported successfully');
  }

  /* ── Compute diff ── */
  function getImportDiff(original: ThemeData, incoming: ThemeData) {
    const changes: { field: string; from: string; to: string }[] = [];
    THEME_KEYS.forEach((key) => {
      const a = String((original as Record<string, unknown>)[key]);
      const b = String((incoming as Record<string, unknown>)[key]);
      if (a !== b) {
        changes.push({ field: key, from: a, to: b });
      }
    });
    return changes;
  }

  const diffChanges = importPreview ? getImportDiff(theme, importPreview) : [];

  return (
    <div className="space-y-8">
      {/* ── Export Section ── */}
      <div>
        <label className="label-lux mb-3 block">Export Current Theme</label>
        <p className="text-[0.72rem] text-[#8A8073] mb-4">
          Download the current theme configuration as a JSON file for backup or sharing.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 gap-1.5"
          >
            <Download size={13} />
            Export Theme JSON
          </button>
          <button
            onClick={handleCopyCSS}
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 gap-1.5"
          >
            <Copy size={13} />
            Copy CSS Variables
          </button>
        </div>

        {/* CSS Preview */}
        <div className="mt-4 bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-4 max-h-48 overflow-auto">
          <pre className="text-[0.6rem] text-[#8A8073] font-mono whitespace-pre leading-relaxed">
            {generateCSSVariables(theme)}
          </pre>
        </div>
      </div>

      {/* ── Import Section ── */}
      <div className="pt-6 border-t border-[rgba(201,168,76,0.1)]">
        <label className="label-lux mb-3 block">Import Theme</label>
        <p className="text-[0.72rem] text-[#8A8073] mb-4">
          Upload a .json theme file or paste theme data below. The import will be validated before applying.
        </p>

        {/* File picker */}
        <div className="flex items-center gap-3 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
            id="theme-file-input"
          />
          <label
            htmlFor="theme-file-input"
            className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 gap-1.5 cursor-pointer inline-flex items-center"
          >
            <FileJson size={13} />
            Choose JSON File
          </label>
        </div>

        {/* Paste textarea */}
        <textarea
          value={importText}
          onChange={(e) => handleImportTextChange(e.target.value)}
          placeholder="Or paste your theme JSON here..."
          className="input-lux w-full h-32 resize-none text-xs font-mono"
          spellCheck={false}
        />

        {/* Validation error */}
        {importError && (
          <div className="mt-3 flex items-center gap-2 text-[0.65rem] text-[#DC2626] bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] px-4 py-2.5">
            <AlertCircle size={13} />
            {importError}
          </div>
        )}

        {/* Import preview & diff */}
        {importPreview && (
          <div className="mt-4">
            <label className="label-lux mb-3 block">Preview — What Will Change</label>
            {diffChanges.length === 0 ? (
              <div className="flex items-center gap-2 text-[0.65rem] text-[#8A8073] bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] px-4 py-3">
                <Check size={13} className="text-[#16A34A]" />
                Imported theme is identical to current — no changes
              </div>
            ) : (
              <div className="space-y-1 max-h-52 overflow-auto">
                {diffChanges.map((c) => (
                  <div
                    key={c.field}
                    className="flex items-center gap-3 bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] px-4 py-2 text-[0.6rem]"
                  >
                    <span className="text-[#C9A84C] font-semibold w-36 flex-shrink-0">{c.field}</span>
                    <span className="text-[#8A8073] truncate flex-1">{c.from}</span>
                    <span className="text-[#8A8073]">&rarr;</span>
                    <span className="text-[#D4C5A9] truncate flex-1">{c.to}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleImport}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 gap-1.5 mt-4"
            >
              <Upload size={13} />
              Apply Imported Theme
            </button>
          </div>
        )}
      </div>

      {/* ── Theme Presets ── */}
      <div className="pt-6 border-t border-[rgba(201,168,76,0.1)]">
        <label className="label-lux mb-3 block">Theme Presets</label>
        <p className="text-[0.72rem] text-[#8A8073] mb-4">
          Quick-start with a curated preset. Clicking a preset applies it immediately.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEME_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isCurrent={JSON.stringify(theme) === JSON.stringify(preset.theme)}
              onApply={() => {
                applyTheme(preset.theme, `Preset: ${preset.name}`);
                showToast('success', `Applied "${preset.name}" preset`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Preset card component ── */

function PresetCard({
  preset,
  isCurrent,
  onApply,
}: {
  preset: (typeof THEME_PRESETS)[number];
  isCurrent: boolean;
  onApply: () => void;
}) {
  loadGoogleFont(preset.theme.fontHeading);
  loadGoogleFont(preset.theme.fontBody);

  const swatches = [
    preset.theme.colorGold,
    preset.theme.colorCream,
    preset.theme.colorEspresso,
    preset.theme.colorWhite,
  ];

  return (
    <button
      onClick={onApply}
      className={`text-left bg-[#0A0A0A] border px-5 py-4 transition-all group hover:border-[rgba(201,168,76,0.5)] ${
        isCurrent
          ? 'border-[rgba(201,168,76,0.5)] ring-1 ring-[rgba(201,168,76,0.3)]'
          : 'border-[rgba(201,168,76,0.1)]'
      }`}
    >
      {/* Color swatches */}
      <div className="flex items-center gap-2 mb-3">
        {swatches.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 border border-[rgba(201,168,76,0.15)]"
            style={{ backgroundColor: color }}
          />
        ))}
        {isCurrent && (
          <span className="ml-auto text-[0.5rem] text-[#C9A84C] font-semibold uppercase tracking-widest flex items-center gap-1">
            <Check size={10} />
            Current
          </span>
        )}
      </div>

      {/* Name */}
      <div className="text-[0.72rem] font-semibold tracking-wider uppercase text-[#D4C5A9] group-hover:text-[#C9A84C] transition-colors">
        {preset.name}
      </div>

      {/* Description */}
      <div className="text-[0.6rem] text-[#8A8073] mt-1">{preset.description}</div>

      {/* Font preview */}
      <div className="mt-3 flex items-center gap-3">
        <span
          className="text-[0.65rem]"
          style={{ fontFamily: `'${preset.theme.fontHeading}', serif`, color: '#D4C5A9' }}
        >
          {preset.theme.fontHeading}
        </span>
        <span className="text-[0.5rem] text-[#8A8073]">/</span>
        <span
          className="text-[0.65rem]"
          style={{ fontFamily: `'${preset.theme.fontBody}', sans-serif`, color: '#8A8073' }}
        >
          {preset.theme.fontBody}
        </span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   THEME HISTORY
   ═══════════════════════════════════════════════ */

function ThemeHistory({
  history,
  onRestore,
  onClear,
}: {
  history: ThemeHistoryEntry[];
  onRestore: (entry: ThemeHistoryEntry) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#C9A84C]" />
          <span className="label-lux mb-0">Theme History</span>
          <span className="text-[0.55rem] text-[#8A8073] tracking-wider uppercase">({history.length})</span>
        </div>
        <button
          onClick={onClear}
          className="text-[0.55rem] text-[#8A8073] hover:text-[#DC2626] transition-colors tracking-wider uppercase flex items-center gap-1"
        >
          <X size={10} />
          Clear
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {history.map((entry, i) => {
          const date = new Date(entry.timestamp);
          const timeStr = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const swatches = [
            entry.theme.colorGold,
            entry.theme.colorCream,
            entry.theme.colorEspresso,
            entry.theme.colorText,
          ];

          return (
            <button
              key={entry.timestamp}
              onClick={() => onRestore(entry)}
              className="flex-shrink-0 bg-[#111110] border border-[rgba(201,168,76,0.15)] px-4 py-3 text-left hover:border-[rgba(201,168,76,0.4)] transition-colors group min-w-[160px]"
            >
              {/* Mini swatches */}
              <div className="flex items-center gap-1 mb-2">
                {swatches.map((c, j) => (
                  <div
                    key={j}
                    className="w-3.5 h-3.5 border border-[rgba(201,168,76,0.1)]"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Label or timestamp */}
              <div className="text-[0.6rem] font-semibold text-[#D4C5A9] group-hover:text-[#C9A84C] transition-colors truncate">
                {entry.label || 'Theme state'}
              </div>
              <div className="text-[0.5rem] text-[#8A8073] mt-0.5">{timeStr}</div>

              {/* Restore hint */}
              <div className="text-[0.45rem] text-[#8A8073] mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Undo2 size={8} />
                Click to restore
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LIVE PREVIEW CARD (below tabs)
   ═══════════════════════════════════════════════ */

function LivePreviewCard({ theme }: { theme: ThemeData }) {
  loadGoogleFont(theme.fontHeading);
  loadGoogleFont(theme.fontBody);
  loadGoogleFont(theme.fontMono);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Eye size={14} className="text-[#C9A84C]" />
        <span className="label-lux mb-0">Live Preview</span>
      </div>
      <div
        className="border border-[rgba(201,168,76,0.2)] overflow-hidden"
        style={{
          backgroundColor: theme.darkMode ? '#0A0A0A' : '#FAF7F2',
          borderRadius: theme.cardRadius,
          boxShadow: theme.enableShadows
            ? '0 8px 40px rgba(201,168,76,0.2)'
            : 'none',
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Hero section */}
        <div
          className="relative px-8 py-12 flex items-end overflow-hidden"
          style={{
            height: '220px',
            backgroundColor: theme.darkMode ? '#111110' : '#F8F5EF',
          }}
        >
          <div className="relative z-10">
            <p
              className="text-[0.55rem] tracking-[0.3em] uppercase font-medium mb-2"
              style={{ color: theme.colorGold, fontFamily: `'${theme.fontBody}', sans-serif` }}
            >
              Woodex Interior
            </p>
            <h2
              className="text-2xl mb-2 leading-tight"
              style={{
                color: theme.darkMode ? '#FFFFFF' : '#1A1410',
                fontFamily: `'${theme.fontHeading}', serif`,
                fontWeight: 400,
              }}
            >
              Crafting Timeless Spaces
            </h2>
            <p
              className="text-sm max-w-md"
              style={{
                color: theme.darkMode ? '#D4C5A9' : '#8A8073',
                fontFamily: `'${theme.fontBody}', sans-serif`,
                fontWeight: 300,
              }}
            >
              Every detail reflects sophistication, from bespoke furniture to curated palettes.
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="px-8 py-6" style={{ padding: `${theme.sectionSpacing} ${theme.sectionSpacing}` }}>
          <div className="grid grid-cols-3 gap-4">
            {/* Mini card 1 */}
            <div
              className="border p-4"
              style={{
                borderColor: theme.colorBorder,
                borderRadius: theme.cardRadius,
              }}
            >
              <div
                className="w-full h-16 mb-3"
                style={{ backgroundColor: theme.darkMode ? '#161613' : '#F0EDE6' }}
              />
              <h3
                className="text-sm mb-1"
                style={{
                  color: theme.darkMode ? '#FFFFFF' : '#1A1410',
                  fontFamily: `'${theme.fontHeading}', serif`,
                }}
              >
                Living Rooms
              </h3>
              <p
                className="text-xs"
                style={{
                  color: theme.darkMode ? '#8A8073' : '#8A8073',
                  fontFamily: `'${theme.fontBody}', sans-serif`,
                }}
              >
                Elegant comfort
              </p>
            </div>
            {/* Mini card 2 */}
            <div
              className="border p-4"
              style={{
                borderColor: theme.colorBorder,
                borderRadius: theme.cardRadius,
              }}
            >
              <div
                className="w-full h-16 mb-3"
                style={{ backgroundColor: theme.darkMode ? '#161613' : '#F0EDE6' }}
              />
              <h3
                className="text-sm mb-1"
                style={{
                  color: theme.darkMode ? '#FFFFFF' : '#1A1410',
                  fontFamily: `'${theme.fontHeading}', serif`,
                }}
              >
                Kitchens
              </h3>
              <p
                className="text-xs"
                style={{ color: '#8A8073', fontFamily: `'${theme.fontBody}', sans-serif` }}
              >
                Modern precision
              </p>
            </div>
            {/* Mini card 3 */}
            <div
              className="border p-4"
              style={{
                borderColor: theme.colorBorder,
                borderRadius: theme.cardRadius,
              }}
            >
              <div
                className="w-full h-16 mb-3"
                style={{ backgroundColor: theme.darkMode ? '#161613' : '#F0EDE6' }}
              />
              <h3
                className="text-sm mb-1"
                style={{
                  color: theme.darkMode ? '#FFFFFF' : '#1A1410',
                  fontFamily: `'${theme.fontHeading}', serif`,
                }}
              >
                Bedrooms
              </h3>
              <p
                className="text-xs"
                style={{ color: '#8A8073', fontFamily: `'${theme.fontBody}', sans-serif` }}
              >
                Restful retreats
              </p>
            </div>
          </div>

          {/* Buttons preview */}
          <div className="flex items-center gap-3 mt-6">
            <button
              className="text-xs font-semibold uppercase tracking-widest px-5 py-2.5"
              style={{
                backgroundColor: theme.colorGold,
                color: '#0A0A0A',
                borderRadius: theme.buttonRadius,
              }}
            >
              Explore
            </button>
            <button
              className="text-xs font-semibold uppercase tracking-widest px-5 py-2.5 border"
              style={{
                borderColor: theme.colorGold,
                color: theme.colorGold,
                borderRadius: theme.buttonRadius,
              }}
            >
              Contact
            </button>
          </div>

          {/* Code/mono preview */}
          <div
            className="mt-6 px-4 py-3 text-xs border"
            style={{
              fontFamily: `'${theme.fontMono}', monospace`,
              color: '#8A8073',
              borderColor: theme.colorBorder,
              backgroundColor: theme.darkMode ? '#0A0A0A' : '#F0EDE6',
            }}
          >
            font-family: {theme.fontMono}; /* monospace preview */
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PREVIEW MODAL CONTENT
   ═══════════════════════════════════════════════ */

function PreviewModalContent({ theme }: { theme: ThemeData }) {
  loadGoogleFont(theme.fontHeading);
  loadGoogleFont(theme.fontBody);
  loadGoogleFont(theme.fontMono);

  return (
    <div className="space-y-6">
      {/* Token summary */}
      <div className="grid grid-cols-2 gap-4 text-[0.65rem]">
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-4 space-y-2">
          <span className="label-lux">Fonts</span>
          <div className="text-[#D4C5A9] space-y-1">
            <p>Heading: {theme.fontHeading}</p>
            <p>Body: {theme.fontBody}</p>
            <p>Mono: {theme.fontMono}</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-4 space-y-2">
          <span className="label-lux">Sizes</span>
          <div className="text-[#D4C5A9] space-y-1">
            <p>Hero: {theme.heroHeight}</p>
            <p>Spacing: {theme.sectionSpacing}</p>
            <p>Card Radius: {theme.cardRadius}</p>
            <p>Button Radius: {theme.buttonRadius}</p>
            <p>Base Font: {theme.baseFontSize}</p>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-4 space-y-2">
          <span className="label-lux">Colors</span>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 flex-shrink-0 border border-[rgba(201,168,76,0.15)]"
                  style={{ backgroundColor: theme[f.key] as string }}
                />
                <span className="text-[#8A8073] truncate">{f.label.split('/')[0].trim()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-4 space-y-2">
          <span className="label-lux">Effects</span>
          <div className="text-[#D4C5A9] space-y-1">
            <p>Shadows: {theme.enableShadows ? 'On' : 'Off'}</p>
            <p>Animations: {theme.enableAnimations ? 'On' : 'Off'}</p>
            <p>Dark Mode: {theme.darkMode ? 'On' : 'Off'}</p>
          </div>
        </div>
      </div>

      {/* Full preview card */}
      <LivePreviewCard theme={theme} />
    </div>
  );
}
