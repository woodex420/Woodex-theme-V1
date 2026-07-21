// Theme Admin - Master control for site-wide theme (fonts, colors, sizes, effects)

import { useState, useRef } from "react";
import {
  PageHeader,
  Button,
  FormField,
  SelectInput,
  Modal,
} from "./AdminLayout";
import { useTheme } from "../../lib/themeManager";
import {
  IconCheck,
  IconDownload,
  IconUpload,
} from "../Icons";
import { cn } from "../../utils/cn";

export function ThemeAdmin() {
  const { theme, setTheme, resetTheme, exportTheme, importTheme, FONT_OPTIONS } = useTheme();
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"fonts" | "colors" | "sizes" | "effects">("fonts");

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Theme Manager"
        description="Master control for site-wide fonts, colors, sizes, and effects. Changes apply live across the site."
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
              <IconUpload className="w-3.5 h-3.5" />
              Import
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => setImportText(ev.target?.result as string);
              reader.readAsText(file);
            }} />
            <Button variant="ghost" onClick={() => {
              const data = exportTheme();
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `wp-theme-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
              markSaved();
            }}>
              <IconDownload className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button onClick={() => { if (confirm("Reset all theme settings to defaults?")) resetTheme(); }}>
              Reset
            </Button>
          </div>
        }
      />

      <div className="card p-1.5 flex gap-1 max-w-2xl">
        {[
          { id: "fonts", label: "Fonts", icon: "🔤" },
          { id: "colors", label: "Colors", icon: "🎨" },
          { id: "sizes", label: "Sizes & Spacing", icon: "📏" },
          { id: "effects", label: "Effects", icon: "✨" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as never)}
            className={cn(
              "flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2",
              tab === t.id ? "bg-espresso text-white shadow-md" : "text-text-gray hover:bg-cream-50"
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="card p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <IconCheck className="w-4 h-4" />
          Theme saved and applied to the live site
        </div>
      )}

      {tab === "fonts" && (
        <div className="card p-6 space-y-6">
          <h3 className="font-serif text-xl text-heading">Typography</h3>
          <p className="text-xs text-text-gray">Choose the fonts used across the site. Changes apply immediately.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Heading Font" hint="Used for h1-h6, hero text, and section titles.">
              <SelectInput
                value={theme.fontHeading}
                onChange={(v) => setTheme((t) => ({ ...t, fontHeading: v }))}
                options={FONT_OPTIONS.filter((f) => !f.value.includes("Mono"))}
              />
            </FormField>
            <FormField label="Body Font" hint="Used for paragraphs, buttons, and labels.">
              <SelectInput
                value={theme.fontBody}
                onChange={(v) => setTheme((t) => ({ ...t, fontBody: v }))}
                options={FONT_OPTIONS.filter((f) => !f.value.includes("Display") && !f.value.includes("Garamond") && !f.value.includes("Lora") && !f.value.includes("Merriweather"))}
              />
            </FormField>
            <FormField label="Monospace Font" hint="Used for code, technical content.">
              <SelectInput
                value={theme.fontMono}
                onChange={(v) => setTheme((t) => ({ ...t, fontMono: v }))}
                options={FONT_OPTIONS.filter((f) => f.value.includes("Mono"))}
              />
            </FormField>
          </div>

          {/* Live font preview */}
          <div className="mt-6 p-6 rounded-card border-2 border-dashed border-border bg-cream-50/30">
            <p className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-3">Live Preview</p>
            <h2 style={{ fontFamily: `'${theme.fontHeading}', serif` }} className="text-3xl text-heading mb-2">
              Crafting Timeless Interior Spaces
            </h2>
            <p style={{ fontFamily: `'${theme.fontBody}', sans-serif` }} className="text-text-gray mb-2">
              We design spaces where vision meets craftsmanship. Every detail tells a story.
            </p>
            <code style={{ fontFamily: `'${theme.fontMono}', monospace` }} className="text-xs text-gold">
              font-family: {theme.fontHeading};
            </code>
          </div>
        </div>
      )}

      {tab === "colors" && (
        <div className="card p-6 space-y-6">
          <h3 className="font-serif text-xl text-heading">Color Palette</h3>
          <p className="text-xs text-text-gray">Master control for all theme colors. Changes apply immediately across the site.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ColorField label="Cream (Background)" value={theme.colorCream} onChange={(v) => setTheme((t) => ({ ...t, colorCream: v }))} />
            <ColorField label="Espresso (Text/Dark)" value={theme.colorEspresso} onChange={(v) => setTheme((t) => ({ ...t, colorEspresso: v }))} />
            <ColorField label="Gold (Accent)" value={theme.colorGold} onChange={(v) => setTheme((t) => ({ ...t, colorGold: v }))} />
            <ColorField label="Gold Hover" value={theme.colorGoldHover} onChange={(v) => setTheme((t) => ({ ...t, colorGoldHover: v }))} />
            <ColorField label="Heading" value={theme.colorHeading} onChange={(v) => setTheme((t) => ({ ...t, colorHeading: v }))} />
            <ColorField label="Body Text" value={theme.colorText} onChange={(v) => setTheme((t) => ({ ...t, colorText: v }))} />
            <ColorField label="Border" value={theme.colorBorder} onChange={(v) => setTheme((t) => ({ ...t, colorBorder: v }))} />
            <ColorField label="Success" value={theme.colorSuccess} onChange={(v) => setTheme((t) => ({ ...t, colorSuccess: v }))} />
            <ColorField label="Danger" value={theme.colorDanger} onChange={(v) => setTheme((t) => ({ ...t, colorDanger: v }))} />
            <ColorField label="White" value={theme.colorWhite} onChange={(v) => setTheme((t) => ({ ...t, colorWhite: v }))} />
          </div>

          {/* Color palette preview */}
          <div className="mt-6 p-6 rounded-card border-2 border-dashed border-border">
            <p className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-3">Palette Preview</p>
            <div className="grid grid-cols-5 gap-2">
              {[
                { name: "Cream", color: theme.colorCream },
                { name: "Espresso", color: theme.colorEspresso },
                { name: "Gold", color: theme.colorGold },
                { name: "Heading", color: theme.colorHeading },
                { name: "Text", color: theme.colorText },
              ].map((c) => (
                <div key={c.name} className="text-center">
                  <div className="w-full h-16 rounded mb-1" style={{ backgroundColor: c.color }} />
                  <div className="text-[10px] text-text-gray">{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "sizes" && (
        <div className="card p-6 space-y-6">
          <h3 className="font-serif text-xl text-heading">Sizes & Spacing</h3>
          <p className="text-xs text-text-gray">Master control for component sizes, spacing, and corners.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Hero Section Size">
              <SelectInput
                value={theme.heroHeight}
                onChange={(v) => setTheme((t) => ({ ...t, heroHeight: v as "sm" | "md" | "lg" | "xl" }))}
                options={[
                  { value: "sm", label: "Small (compact)" },
                  { value: "md", label: "Medium (default)" },
                  { value: "lg", label: "Large" },
                  { value: "xl", label: "Extra Large" },
                ]}
              />
            </FormField>
            <FormField label="Section Spacing">
              <SelectInput
                value={theme.sectionSpacing}
                onChange={(v) => setTheme((t) => ({ ...t, sectionSpacing: v as "sm" | "md" | "lg" | "xl" }))}
                options={[
                  { value: "sm", label: "Small" },
                  { value: "md", label: "Medium" },
                  { value: "lg", label: "Large (default)" },
                  { value: "xl", label: "Extra Large" },
                ]}
              />
            </FormField>
            <FormField label="Base Font Size">
              <SelectInput
                value={theme.baseFontSize}
                onChange={(v) => setTheme((t) => ({ ...t, baseFontSize: v as "sm" | "base" | "lg" }))}
                options={[
                  { value: "sm", label: "Small (14px)" },
                  { value: "base", label: "Medium (16px)" },
                  { value: "lg", label: "Large (18px)" },
                ]}
              />
            </FormField>
            <FormField label="Card Border Radius">
              <input
                type="text"
                value={theme.cardRadius}
                onChange={(e) => setTheme((t) => ({ ...t, cardRadius: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="16px"
              />
            </FormField>
            <FormField label="Button Border Radius">
              <input
                type="text"
                value={theme.buttonRadius}
                onChange={(e) => setTheme((t) => ({ ...t, buttonRadius: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="9999px"
              />
            </FormField>
          </div>

          {/* Preview */}
          <div className="mt-6 p-6 rounded-card border-2 border-dashed border-border">
            <p className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-3">Preview</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-border text-center" style={{ borderRadius: theme.cardRadius }}>
                <div className="font-serif text-heading mb-2">Card</div>
                <button className="bg-gold text-espresso px-4 py-2 text-xs" style={{ borderRadius: theme.buttonRadius }}>
                  Button
                </button>
              </div>
              <div className="p-4 bg-white border border-border text-center" style={{ borderRadius: theme.cardRadius }}>
                <div className="font-serif text-heading mb-2">Sample</div>
                <button className="bg-gold text-espresso px-4 py-2 text-xs" style={{ borderRadius: theme.buttonRadius }}>
                  Action
                </button>
              </div>
              <div className="p-4 bg-white border border-border text-center" style={{ borderRadius: theme.cardRadius }}>
                <div className="font-serif text-heading mb-2">Demo</div>
                <button className="bg-gold text-espresso px-4 py-2 text-xs" style={{ borderRadius: theme.buttonRadius }}>
                  Click
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "effects" && (
        <div className="card p-6 space-y-6">
          <h3 className="font-serif text-xl text-heading">Effects & Animations</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={theme.enableShadows}
                onChange={(e) => setTheme((t) => ({ ...t, enableShadows: e.target.checked }))}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Enable Shadows</div>
                <div className="text-[11px] text-text-gray">Card shadows, button shadows, etc.</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={theme.enableAnimations}
                onChange={(e) => setTheme((t) => ({ ...t, enableAnimations: e.target.checked }))}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Enable Animations</div>
                <div className="text-[11px] text-text-gray">Hover effects, transitions, animations.</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={theme.darkMode}
                onChange={(e) => setTheme((t) => ({ ...t, darkMode: e.target.checked }))}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <div>
                <div className="text-sm font-medium text-heading">Dark Mode (Experimental)</div>
                <div className="text-[11px] text-text-gray">Apply dark color scheme to site.</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {showImport && (
        <Modal open onClose={() => setShowImport(false)} title="Import Theme" size="md">
          <p className="text-sm text-text-gray mb-3">Paste the theme JSON below.</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border bg-cream-50/50 mb-3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button onClick={() => { importTheme(importText); setShowImport(false); markSaved(); }} variant="primary">
              <IconCheck className="w-3.5 h-3.5" />
              Import Theme
            </Button>
          </div>
        </Modal>
      )}

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button onClick={markSaved} variant="primary" size="lg">
          <IconCheck className="w-4 h-4" />
          Apply Theme Live
        </Button>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-9 rounded border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs font-mono rounded border border-border"
        />
      </div>
    </div>
  );
}
