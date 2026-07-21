import { useState, useRef } from 'react';
import {
  ExternalLink,
  MousePointerClick,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Keyboard,
  MousePointer2,
  PanelLeftClose,
  Undo2,
  Redo2,
  X,
  Box,
  Pencil,
  Settings,
  FileJson,
  CheckCircle2,
} from 'lucide-react';
import { useBuilder } from '@/lib/builderStore';
import { PAGE_NAMES } from '@/lib/builderTypes';

/* ================================================================== */
/*  Route map — page key -> URL path                                   */
/* ================================================================== */

const PAGE_ROUTES: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  projects: '/projects',
  insights: '/insights',
  contact: '/contact',
};

/* ================================================================== */
/*  Keyboard shortcut data                                             */
/* ================================================================== */

const SHORTCUTS = [
  { keys: ['Cmd', 'Shift', 'B'], label: 'Toggle Builder', icon: Box },
  { keys: ['Cmd', 'Z'], label: 'Undo', icon: Undo2 },
  { keys: ['Cmd', 'Shift', 'Z'], label: 'Redo', icon: Redo2 },
  { keys: ['Esc'], label: 'Close Panel', icon: PanelLeftClose },
  { keys: ['DoubleClick'], label: 'Inline Edit', icon: MousePointer2 },
];

/* ================================================================== */
/*  Getting Started steps                                              */
/* ================================================================== */

const STEPS = [
  {
    num: 1,
    icon: Box,
    title: 'Enter Builder Mode',
    description: 'Click the gold cube icon on any page to activate the live builder overlay.',
  },
  {
    num: 2,
    icon: MousePointerClick,
    title: 'Select an Element',
    description: 'Click any element on the page to select it. The inspector panel opens on the right.',
  },
  {
    num: 3,
    icon: Settings,
    title: 'Edit & Save',
    description: 'Change content, styles, and layout. All changes save automatically to the builder store.',
  },
];

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function PlaceholderBuilder() {
  const {
    builderEnabled,
    enableBuilder,
    disableBuilder,
    allOverrides,
    resetPage,
    clearAll,
    exportOverrides,
    importOverrides,
  } = useBuilder();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ────────────────────────────────────────────── */

  const pageKeys = Object.keys(PAGE_NAMES);

  function getPageOverrideCount(pageKey: string): number {
    return allOverrides[pageKey]?.sections?.length ?? 0;
  }

  function formatTimestamp(ts: number): string {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── actions ───────────────────────────────────────────── */

  function handleExport() {
    const json = exportOverrides();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `woodex-overrides-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Overrides exported successfully');
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
      applyImport(text);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function applyImport(text: string) {
    setImportError('');
    setImportSuccess(false);
    if (!text.trim()) {
      setImportError('Please provide JSON data to import.');
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setImportError('Invalid format. Expected a JSON object of page overrides.');
        return;
      }
      importOverrides(text);
      setImportSuccess(true);
      showToast('success', 'Overrides imported successfully');
    } catch {
      setImportError('Invalid JSON. Please check the syntax and try again.');
    }
  }

  function handleClearAll() {
    clearAll();
    setShowClearConfirm(false);
    showToast('success', 'All overrides cleared');
  }

  function handleResetPage(pageKey: string) {
    resetPage(pageKey);
    setShowResetConfirm(null);
    showToast('success', `${PAGE_NAMES[pageKey]} overrides reset`);
  }

  /* ── derived data ──────────────────────────────────────── */

  const pagesWithOverrides = Object.entries(allOverrides)
    .filter(([key, val]) => PAGE_NAMES[key] && val.sections?.length > 0)
    .sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0));

  const totalOverrides = pagesWithOverrides.reduce(
    (sum, [, val]) => sum + val.sections.length,
    0,
  );

  return (
    <div className="p-8">
      {/* ================================================================ */}
      {/*  Toast                                                           */}
      {/* ================================================================ */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 shadow-lg transition-all ${
            toast.type === 'error'
              ? 'bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)]'
              : 'bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.4)]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle size={16} className="text-[#DC2626] shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
          )}
          <span
            className={`text-sm font-light ${
              toast.type === 'error' ? 'text-[#DC2626]' : 'text-[#16A34A]'
            }`}
          >
            {toast.message}
          </span>
        </div>
      )}

      {/* ================================================================ */}
      {/*  Header                                                          */}
      {/* ================================================================ */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Live Builder</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Visual page editor
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
        >
          <ExternalLink size={12} />
          Open Live Builder
        </a>
      </div>

      {/* ================================================================ */}
      {/*  Builder Enable/Disable Toggle                                    */}
      {/* ================================================================ */}
      <div className="mb-10">
        <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-5">
          Builder Status
        </h2>
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm text-white font-medium mb-1">
              Enable Live Builder on Site
            </h3>
            <p className="text-xs text-[#8A8073] font-light">
              When enabled, the gold cube icon appears on public pages for editing.
            </p>
          </div>
          <button
            onClick={builderEnabled ? disableBuilder : enableBuilder}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              builderEnabled
                ? 'bg-[#C9A84C]'
                : 'bg-[rgba(255,255,255,0.15)]'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                builderEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Quick Actions — Edit Any Page                                   */}
      {/* ================================================================ */}
      <div className="mb-10">
        <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pageKeys.map((key) => {
            const count = getPageOverrideCount(key);
            return (
              <div
                key={key}
                className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 flex flex-col justify-between hover:border-[rgba(201,168,76,0.4)] transition-colors"
              >
                <div className="mb-4">
                  <h3 className="text-sm text-white font-medium mb-1.5">
                    {PAGE_NAMES[key]}
                  </h3>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073]">
                    {count} override{count !== 1 ? 's' : ''}
                  </span>
                </div>
                <a
                  href={PAGE_ROUTES[key] || '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-lux btn-outline text-[0.55rem] py-2 px-3 w-full flex items-center justify-center gap-1.5"
                >
                  <Pencil size={10} />
                  Edit
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Override Status                                                 */}
      {/* ================================================================ */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">
            Override Status
          </h2>
          {pagesWithOverrides.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[0.55rem] tracking-[0.15em] uppercase text-[#DC2626] hover:text-[#ff4444] transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 size={10} />
              Clear All Overrides
            </button>
          )}
        </div>

        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
          {pagesWithOverrides.length === 0 ? (
            <div className="text-center py-16">
              <Box size={32} className="mx-auto mb-4 text-[#8A8073] opacity-40" />
              <p className="text-[#8A8073] font-light">
                No overrides yet. Open a page and start editing to see changes here.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] border-b border-[rgba(201,168,76,0.1)]">
                      <th className="px-6 py-4 font-medium">Page Name</th>
                      <th className="px-6 py-4 font-medium">Elements Modified</th>
                      <th className="px-6 py-4 font-medium hidden md:table-cell">Last Updated</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagesWithOverrides.map(([key, pageData]) => (
                      <tr
                        key={key}
                        className="border-b border-[rgba(201,168,76,0.06)] hover:bg-[rgba(201,168,76,0.03)] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-white font-medium">
                              {PAGE_NAMES[key]}
                            </span>
                            <span className="text-[0.5rem] tracking-[0.15em] uppercase text-[#8A8073]">
                              /{key}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#D4C5A9]">
                            {pageData.sections.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-[#8A8073]">
                            {formatTimestamp(pageData.updatedAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {showResetConfirm === key ? (
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-xs text-[#DC2626] font-light">
                                Reset all?
                              </span>
                              <button
                                onClick={() => handleResetPage(key)}
                                className="text-[0.55rem] tracking-[0.15em] uppercase text-[#DC2626] font-semibold hover:text-[#ff4444] transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setShowResetConfirm(null)}
                                className="text-[0.55rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowResetConfirm(key)}
                              className="inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                            >
                              <RotateCcw size={10} />
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Footer summary */}
              <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.1)]">
                <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
                  {pagesWithOverrides.length} page{pagesWithOverrides.length !== 1 ? 's' : ''} &middot; {totalOverrides} element{totalOverrides !== 1 ? 's' : ''} modified
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Import / Export                                                 */}
      {/* ================================================================ */}
      <div className="mb-10">
        <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-5">
          Import & Export
        </h2>
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Download size={14} className="text-[#C9A84C]" />
                <h3 className="text-sm text-white font-medium">Export Overrides</h3>
              </div>
              <p className="text-xs text-[#8A8073] font-light mb-4 leading-relaxed">
                Download all page overrides as a JSON file. Use this to back up your changes or
                transfer them to another environment.
              </p>
              <button
                onClick={handleExport}
                className="btn-lux btn-gold text-[0.55rem] py-2.5 px-5 inline-flex items-center gap-2"
              >
                <Download size={10} />
                Export JSON
              </button>
            </div>

            {/* Import */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Upload size={14} className="text-[#C9A84C]" />
                <h3 className="text-sm text-white font-medium">Import Overrides</h3>
              </div>
              <p className="text-xs text-[#8A8073] font-light mb-4 leading-relaxed">
                Import overrides from a JSON file or paste JSON data directly. This will merge
                with or replace your current overrides.
              </p>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-lux btn-outline text-[0.55rem] py-2.5 px-5 inline-flex items-center gap-2"
                >
                  <FileJson size={10} />
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <span className="text-[0.5rem] tracking-[0.15em] uppercase text-[#8A8073]">
                  or paste below
                </span>
              </div>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"home":{"pageName":"home","sections":[...],...}}'
                className="input-lux w-full h-28 px-4 py-3 text-xs font-mono resize-none mb-3"
              />
              {importError && (
                <div className="bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.25)] px-4 py-2.5 mb-3">
                  <span className="text-xs text-[#DC2626]">{importError}</span>
                </div>
              )}
              {importSuccess && (
                <div className="bg-[rgba(22,163,74,0.1)] border border-[rgba(22,163,74,0.25)] px-4 py-2.5 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-[#16A34A] shrink-0" />
                  <span className="text-xs text-[#16A34A]">Import successful</span>
                </div>
              )}
              <button
                onClick={() => applyImport(importText)}
                disabled={!importText.trim()}
                className="btn-lux btn-gold text-[0.55rem] py-2.5 px-5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Upload size={10} />
                Apply Import
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(201,168,76,0.1)] mt-6 pt-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-white font-medium mb-1">Danger Zone</h3>
              <p className="text-xs text-[#8A8073] font-light">
                Permanently remove all overrides across every page. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn-lux text-[0.55rem] py-2.5 px-5 inline-flex items-center gap-2 bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors"
            >
              <Trash2 size={10} />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Keyboard Shortcuts                                              */}
      {/* ================================================================ */}
      <div className="mb-10">
        <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-5">
          <span className="flex items-center gap-2">
            <Keyboard size={12} />
            Keyboard Shortcuts
          </span>
        </h2>
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
          {SHORTCUTS.map((shortcut, idx) => (
            <div
              key={shortcut.label}
              className={`flex items-center justify-between px-6 py-4 ${
                idx < SHORTCUTS.length - 1
                  ? 'border-b border-[rgba(201,168,76,0.06)]'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <shortcut.icon size={14} className="text-[#8A8073]" />
                <span className="text-sm text-[#D4C5A9] font-light">
                  {shortcut.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {shortcut.keys.map((key, kIdx) => (
                  <span key={kIdx}>
                    <kbd className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] text-[0.6rem] font-medium px-2.5 py-1 tracking-wider uppercase">
                      {key}
                    </kbd>
                    {kIdx < shortcut.keys.length - 1 && (
                      <span className="text-[#8A8073] text-xs mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Getting Started                                                 */}
      {/* ================================================================ */}
      <div className="mb-10">
        <h2 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-5">
          Getting Started
        </h2>
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                {/* Step number circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center">
                    <step.icon size={24} className="text-[#C9A84C]" />
                  </div>
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-[#C9A84C] text-[#0A0A0A] text-[0.6rem] font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm text-white font-medium mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#8A8073] font-light leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Clear All Confirmation Dialog                                   */}
      {/* ================================================================ */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowClearConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative bg-[#111110] border border-[rgba(220,38,38,0.3)] w-full max-w-md mx-4 p-8">
            {/* Close */}
            <button
              onClick={() => setShowClearConfirm(false)}
              className="absolute top-4 right-4 text-[#8A8073] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[rgba(220,38,38,0.12)] flex items-center justify-center">
                <AlertTriangle size={20} className="text-[#DC2626]" />
              </div>
              <h3 className="font-display text-xl text-white">Clear All Overrides</h3>
            </div>

            <p className="text-sm text-[#D4C5A9] font-light leading-relaxed mb-2">
              This will permanently remove <strong className="text-white">{totalOverrides} element override{totalOverrides !== 1 ? 's' : ''}</strong> across{' '}
              <strong className="text-white">{pagesWithOverrides.length} page{pagesWithOverrides.length !== 1 ? 's' : ''}</strong>.
            </p>
            <p className="text-xs text-[#8A8073] font-light mb-8">
              This action cannot be undone. Consider exporting your overrides first as a backup.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="btn-lux text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2 bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.25)] transition-colors"
              >
                <Trash2 size={10} />
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
