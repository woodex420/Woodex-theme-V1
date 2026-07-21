// Builder Panel - Complete Inspector with all requested controls
// Typography, Color, Layout, Border, Appearance, Shadow, Image, Motion, Alignment

import { useState, useRef, useCallback } from "react";
import {
  IconClose,
  IconPlus,
  IconMinus,
  IconDownload,
  IconUpload,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconCube,
} from "./Icons";
import {
  COLOR_PRESETS,
  DEFAULT_FONT_FAMILIES,
  FONT_SIZE_PRESETS,
  RADIUS_PRESETS,
  SHADOW_PRESETS,
} from "../lib/builderTypes";
import type { BuilderContext } from "../lib/builderStore";

import { exportOverrides, importOverrides, clearAllOverrides } from "../lib/builderStore";
import { cn } from "../utils/cn";

type Tab = "content" | "typography" | "color" | "layout" | "border" | "shadow" | "image" | "motion" | "settings";

const ALL_TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "content", label: "Content", icon: "✏️" },
  { id: "typography", label: "Type", icon: "🔤" },
  { id: "color", label: "Color", icon: "🎨" },
  { id: "layout", label: "Layout", icon: "📐" },
  { id: "border", label: "Border", icon: "📦" },
  { id: "shadow", label: "Shadow", icon: "✨" },
  { id: "image", label: "Image", icon: "🖼️" },
  { id: "motion", label: "Motion", icon: "🎬" },
  { id: "settings", label: "Page", icon: "⚙️" },
];

export function BuilderPanel({
  ctx,
  onClose,
}: {
  ctx: BuilderContext;
  onClose: () => void;
}) {
  const {
    state,
    currentPage,
    selectElement,
    updateStyle,
    updateContent,
    hideSection,
    getSectionOverride,
    getOverrides,
    resetPage,
  } = ctx;

  const [tab, setTab] = useState<Tab>("content");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    typography: true,
    textColor: true,
    background: false,
    margin: false,
    padding: false,
    border: true,
    shadow: true,
    opacity: false,
    motion: true,
    size: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPath = state.selectedPath;
  const override = selectedPath ? getSectionOverride(currentPage, selectedPath) : undefined;
  const pageOverrides = getOverrides(currentPage);
  const sectionCount = (pageOverrides?.sections || []).length;

  const apply = useCallback(
    (patch: Parameters<typeof updateStyle>[2]) => {
      if (selectedPath) updateStyle(currentPage, selectedPath, patch);
    },
    [selectedPath, currentPage, updateStyle]
  );

  const applyContent = useCallback(
    (patch: Parameters<typeof updateContent>[2]) => {
      if (selectedPath) updateContent(currentPage, selectedPath, patch);
    },
    [selectedPath, currentPage, updateContent]
  );

  const handleToggleVisibility = useCallback(() => {
    if (selectedPath) hideSection(currentPage, selectedPath, !override?.hidden);
  }, [selectedPath, currentPage, hideSection, override?.hidden]);

  // Export
  const exportJson = () => {
    const data = exportOverrides();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wp-interior-overrides-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)] z-[91] flex flex-col">
      {/* ============ HEADER ============ */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-gradient-to-r from-gold/10 to-cream-50 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
            <IconCube className="w-3.5 h-3.5 text-espresso" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-serif text-sm text-heading font-semibold truncate">Inspector</div>
            <div className="text-[9px] text-text-gray truncate">
              {selectedPath ? `${sectionCount} sections · ${currentPage}` : "No selection"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {selectedPath && (
            <button
              onClick={handleToggleVisibility}
              className="w-7 h-7 rounded-md hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center"
              title={override?.hidden ? "Show" : "Hide"}
            >
              {override?.hidden ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
            </button>
          )}
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center" title="Close">
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============ TABS ============ */}
      <div className="flex overflow-x-auto border-b border-stone-200 bg-cream-50/50 flex-shrink-0">
        {ALL_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1 transition-colors",
              tab === t.id
                ? "text-espresso border-b-2 border-gold bg-white"
                : "text-text-gray hover:text-espresso hover:bg-white/80"
            )}
          >
            <span className="text-xs">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ============ BODY ============ */}
      <div className="flex-1 overflow-y-auto">
        {!selectedPath ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-3">
              <IconCube className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-base text-heading mb-2">Select an element</h3>
            <p className="text-xs text-text-gray leading-relaxed">
              Click any element on the page to inspect and edit its content, style, layout, and more.
            </p>
            <div className="mt-6 bg-cream-50 rounded-lg p-4 text-left text-[10px] space-y-1.5 text-text-gray">
              <p className="font-semibold text-heading text-[10px] uppercase tracking-widest mb-2">Quick Tips</p>
              <p>• <strong>Click</strong> an element to select it</p>
              <p>• <strong>Double-click</strong> text to edit inline</p>
              <p>• Scroll through inspector tabs for all controls</p>
              <p>• All changes save automatically</p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3 pb-24">
            {/* ============ ELEMENT INFO ============ */}
            <div className="bg-gradient-to-r from-gold/5 to-amber-50 rounded-lg p-3 border border-gold/20">
              <div className="text-[9px] uppercase tracking-widest text-gold font-bold mb-1">Selected</div>
              <div className="font-mono text-[10px] text-heading break-all">{selectedPath}</div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleToggleVisibility}
                  className={cn(
                    "text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors",
                    override?.hidden
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {override?.hidden ? <IconEyeOff className="w-3 h-3" /> : <IconEye className="w-3 h-3" />}
                  {override?.hidden ? "Hidden" : "Visible"}
                </button>
                <button
                  onClick={() => selectElement(null)}
                  className="text-[9px] uppercase tracking-widest text-text-gray hover:text-gold font-bold ml-auto"
                >
                  Deselect
                </button>
              </div>
            </div>

            {/* ============ CONTENT TAB ============ */}
            {tab === "content" && <ContentEditor override={override} onUpdate={applyContent} />}

            {/* ============ TYPOGRAPHY TAB ============ */}
            {tab === "typography" && <TypographyEditor currentStyle={override?.style || {}} onUpdate={apply} expanded={expanded} setExpanded={(e) => setExpanded({ ...expanded, ...e })} />}

            {/* ============ COLOR TAB ============ */}
            {tab === "color" && <ColorEditor currentStyle={override?.style || {}} onUpdate={apply} expanded={expanded} setExpanded={(e) => setExpanded({ ...expanded, ...e })} />}

            {/* ============ LAYOUT TAB ============ */}
            {tab === "layout" && <LayoutEditor currentStyle={override?.style || {}} onUpdate={apply} expanded={expanded} setExpanded={(e) => setExpanded({ ...expanded, ...e })} />}

            {/* ============ BORDER TAB ============ */}
            {tab === "border" && <BorderEditor currentStyle={override?.style || {}} onUpdate={apply} />}

            {/* ============ SHADOW TAB ============ */}
            {tab === "shadow" && <ShadowEditor currentStyle={override?.style || {}} onUpdate={apply} />}

            {/* ============ IMAGE TAB ============ */}
            {tab === "image" && (
              <ImageEditor
                currentStyle={override?.style || {}}
                currentContent={override?.content || {}}
                onUpdate={apply}
                onContentUpdate={applyContent}
              />
            )}

            {/* ============ MOTION TAB ============ */}
            {tab === "motion" && <MotionEditor currentStyle={override?.style || {}} onUpdate={apply} />}

            {/* ============ SETTINGS / PAGE TAB ============ */}
            {tab === "settings" && (
              <SettingsEditor
                pageOverrides={pageOverrides}
                selectedPath={selectedPath}
                currentStyle={override?.style || {}}
                onUpdate={apply}
                onReset={() => { if (confirm("Reset all changes on this page?")) resetPage(currentPage); }}
                onExport={exportJson}
                onImport={() => fileInputRef.current?.click()}
                itemCount={sectionCount}
              />
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const text = ev.target?.result as string;
            if (confirm("This will replace all current overrides. Continue?")) {
              try {
                importOverrides(text);
              } catch {
                alert("Invalid JSON file");
              }
            }
          };
          reader.readAsText(file);
        }}
      />
    </div>
  );
}

// ===================== TAB EDITORS =====================

// ===== CONTENT =====
function ContentEditor({ override, onUpdate }: any) {
  const content = override?.content || {};
  return (
    <Section title="Content" expanded={true} onToggle={() => {}}>
      <Field label="Text Content">
        <textarea
          value={content.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter text..."
          rows={5}
          className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white resize-y focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
      <Field label="Image URL">
        <input
          type="text"
          value={content.src || ""}
          onChange={(e) => onUpdate({ src: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
      {content.src && (
        <img src={content.src} alt="" className="w-full h-32 object-cover rounded-lg border border-stone-200" />
      )}
      <Field label="Alt Text">
        <input
          type="text"
          value={content.alt || ""}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          placeholder="Image description"
          className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
      <Field label="Link URL">
        <input
          type="text"
          value={content.href || ""}
          onChange={(e) => onUpdate({ href: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
    </Section>
  );
}

// ===== TYPOGRAPHY =====
function TypographyEditor({ currentStyle, onUpdate, expanded, setExpanded }: any) {
  return (
    <div className="space-y-3">
      <Section title="Typography" expanded={expanded.typography} onToggle={() => setExpanded({ typography: !expanded.typography })}>
        <Field label="Font Family">
          <select
            value={currentStyle.fontFamily || "serif"}
            onChange={(e) => onUpdate({ fontFamily: e.target.value as "serif" | "sans" | "mono" })}
            className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {DEFAULT_FONT_FAMILIES.map((f: any) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Size">
          <select
            value={currentStyle.fontSize || "base"}
            onChange={(e) => onUpdate({ fontSize: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {FONT_SIZE_PRESETS.map((s: any) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Weight">
          <div className="grid grid-cols-5 gap-1">
            {["thin", "light", "normal", "medium", "semibold", "bold"].map((w) => (
              <button
                key={w}
                onClick={() => onUpdate({ fontWeight: w })}
                className={cn(
                  "px-2 py-1.5 text-[9px] uppercase tracking-wider rounded border transition-colors",
                  currentStyle.fontWeight === w
                    ? "bg-gold text-espresso border-gold"
                    : "border-stone-200 text-text-gray hover:border-gold"
                )}
                style={{ fontWeight: w === "thin" ? 100 : w === "light" ? 300 : w === "normal" ? 400 : w === "medium" ? 500 : w === "semibold" ? 600 : 700 }}
              >
                {w}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Style">
            <select
              value={currentStyle.fontStyle || "normal"}
              onChange={(e) => onUpdate({ fontStyle: e.target.value })}
              className="w-full px-2 py-2 text-xs rounded-md border border-stone-200 bg-white"
            >
              <option value="normal">Normal</option>
              <option value="italic">Italic</option>
            </select>
          </Field>
          <Field label="Transform">
            <select
              value={currentStyle.textTransform || "none"}
              onChange={(e) => onUpdate({ textTransform: e.target.value })}
              className="w-full px-2 py-2 text-xs rounded-md border border-stone-200 bg-white"
            >
              <option value="none">None</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Line Height">
            <input
              type="text"
              value={currentStyle.lineHeight || ""}
              onChange={(e) => onUpdate({ lineHeight: e.target.value })}
              placeholder="1.5"
              className="w-full px-2 py-2 text-xs rounded-md border border-stone-200 bg-white"
            />
          </Field>
          <Field label="Letter Spacing">
            <input
              type="text"
              value={currentStyle.letterSpacing || ""}
              onChange={(e) => onUpdate({ letterSpacing: e.target.value })}
              placeholder="0.05em"
              className="w-full px-2 py-2 text-xs rounded-md border border-stone-200 bg-white"
            />
          </Field>
        </div>
        <Field label="Alignment">
          <div className="grid grid-cols-4 gap-1">
            {[
              { value: "left", label: "L" },
              { value: "center", label: "C" },
              { value: "right", label: "R" },
              { value: "justify", label: "J" },
            ].map((a) => (
              <button
                key={a.value}
                onClick={() => onUpdate({ textAlign: a.value as "left" | "center" | "right" | "justify" })}
                className={cn(
                  "px-2 py-2 text-xs rounded border transition-colors",
                  currentStyle.textAlign === a.value
                    ? "bg-gold text-espresso border-gold"
                    : "border-stone-200 text-text-gray hover:border-gold"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Field>
      </Section>
    </div>
  );
}

// ===== COLOR =====
function ColorEditor({ currentStyle, onUpdate, expanded, setExpanded }: any) {
  return (
    <div className="space-y-3">
      <Section title="Text Color" expanded={expanded.textColor} onToggle={() => setExpanded({ textColor: !expanded.textColor })}>
        <ColorField
          label="Text"
          value={currentStyle.color || ""}
          onChange={(v) => onUpdate({ color: v || undefined })}
        />
        <ColorField
          label="Heading"
          value={currentStyle.headingColor || ""}
          onChange={(v) => onUpdate({ headingColor: v || undefined })}
        />
      </Section>

      <Section title="Background" expanded={expanded.background} onToggle={() => setExpanded({ background: !expanded.background })}>
        <ColorField
          label="Background Color"
          value={currentStyle.backgroundColor || ""}
          onChange={(v) => onUpdate({ backgroundColor: v || undefined })}
        />
        <Field label="Background Image URL">
          <input
            type="text"
            value={currentStyle.backgroundImage?.replace(/^url\((.*)\)$/, "$1") || ""}
            onChange={(e) => onUpdate({ backgroundImage: e.target.value ? `url(${e.target.value})` : undefined })}
            placeholder="https://..."
            className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </Field>
        {currentStyle.backgroundImage && (
          <div
            className="w-full h-16 rounded-lg border border-stone-200 bg-cover bg-center"
            style={{ backgroundImage: currentStyle.backgroundImage }}
          />
        )}
      </Section>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded border border-stone-200 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="None"
          className="flex-1 px-2 py-1.5 text-xs font-mono rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>
      <div className="grid grid-cols-6 gap-1 mt-1.5">
        {COLOR_PRESETS.map((c: any) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.name}
            className="aspect-square rounded border border-stone-200 hover:scale-110 transition-transform"
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </Field>
  );
}

// ===== LAYOUT =====
function LayoutEditor({ currentStyle, onUpdate, expanded, setExpanded }: any) {
  return (
    <div className="space-y-3">
      <Section title="Size" expanded={expanded.size} onToggle={() => setExpanded({ size: !expanded.size })}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Width">
            <input value={currentStyle.width || ""} onChange={(e) => onUpdate({ width: e.target.value })} placeholder="auto" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
          </Field>
          <Field label="Height">
            <input value={currentStyle.height || ""} onChange={(e) => onUpdate({ height: e.target.value })} placeholder="auto" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
          </Field>
        </div>
        <Field label="Max Width">
          <input value={currentStyle.maxWidth || ""} onChange={(e) => onUpdate({ maxWidth: e.target.value })} placeholder="e.g. 1200px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
        </Field>
        <Field label="Text Alignment">
          <div className="grid grid-cols-4 gap-1">
            {[
              { value: "left", label: "L" },
              { value: "center", label: "C" },
              { value: "right", label: "R" },
              { value: "justify", label: "J" },
            ].map((a) => (
              <button
                key={a.value}
                onClick={() => onUpdate({ textAlign: a.value })}
                className={cn(
                  "px-2 py-2 text-xs rounded border transition-colors",
                  currentStyle.textAlign === a.value
                    ? "bg-gold text-espresso border-gold"
                    : "border-stone-200 text-text-gray hover:border-gold"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Padding" expanded={expanded.padding} onToggle={() => setExpanded({ padding: !expanded.padding })}>
        <Field label="All">
          <input value={currentStyle.padding || ""} onChange={(e) => onUpdate({ padding: e.target.value })} placeholder="e.g. 20px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Top / Bottom (Y)">
            <input value={currentStyle.paddingY || ""} onChange={(e) => onUpdate({ paddingY: e.target.value })} placeholder="e.g. 40px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
          </Field>
          <Field label="Left / Right (X)">
            <input value={currentStyle.paddingX || ""} onChange={(e) => onUpdate({ paddingX: e.target.value })} placeholder="e.g. 24px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
          </Field>
        </div>
      </Section>

      <Section title="Margin" expanded={expanded.margin} onToggle={() => setExpanded({ margin: !expanded.margin })}>
        <Field label="Top">
          <input value={currentStyle.marginTop || ""} onChange={(e) => onUpdate({ marginTop: e.target.value })} placeholder="e.g. 20px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
        </Field>
        <Field label="Bottom">
          <input value={currentStyle.marginBottom || ""} onChange={(e) => onUpdate({ marginBottom: e.target.value })} placeholder="e.g. 20px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
        </Field>
      </Section>
    </div>
  );
}

// ===== BORDER =====
function BorderEditor({ currentStyle, onUpdate }: any) {
  return (
    <Section title="Border" expanded={true} onToggle={() => {}}>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Field label="Style">
          <select
            value={currentStyle.borderStyle || "none"}
            onChange={(e) => onUpdate({ borderStyle: e.target.value === "none" ? undefined : e.target.value })}
            className="w-full px-2 py-2 text-xs rounded border border-stone-200 bg-white"
          >
            {["none", "solid", "dashed", "dotted", "double"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Width">
          <input type="text" value={currentStyle.borderWidth || ""} onChange={(e) => onUpdate({ borderWidth: e.target.value })} placeholder="1px" className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white" />
        </Field>
      </div>
      <ColorField
        label="Color"
        value={currentStyle.borderColor || ""}
        onChange={(v) => onUpdate({ borderColor: v || undefined })}
      />
      <Field label="Radius">
        <div className="grid grid-cols-3 gap-1">
          {RADIUS_PRESETS.map((r: any) => (
            <button
              key={r.value}
              onClick={() => onUpdate({ borderRadius: r.value })}
              className={cn(
                "px-2 py-1.5 text-[10px] rounded border transition-colors",
                currentStyle.borderRadius === r.value
                  ? "bg-gold text-espresso border-gold"
                  : "border-stone-200 text-text-gray hover:border-gold"
              )}
            >
              {r.name}
            </button>
          ))}
        </div>
      </Field>
    </Section>
  );
}

// ===== SHADOW =====
function ShadowEditor({ currentStyle, onUpdate }: any) {
  return (
    <Section title="Box Shadow" expanded={true} onToggle={() => {}}>
      <div className="space-y-1">
        {SHADOW_PRESETS.map((s: any) => (
          <button
            key={s.value}
            onClick={() => onUpdate({ boxShadow: s.value === "none" ? undefined : s.value })}
            className={cn(
              "w-full text-left px-3 py-2 text-[10px] rounded border transition-colors",
              currentStyle.boxShadow === s.value
                ? "bg-gold text-espresso border-gold"
                : "border-stone-200 text-text-gray hover:border-gold"
            )}
          >
            <span className="font-semibold">{s.name}</span>
          </button>
        ))}
      </div>
      <Field label="Custom Shadow Value">
        <input
          type="text"
          value={currentStyle.boxShadow && !SHADOW_PRESETS.find((sp: any) => sp.value === currentStyle.boxShadow) ? currentStyle.boxShadow : ""}
          onChange={(e) => onUpdate({ boxShadow: e.target.value || undefined })}
          placeholder="0 4px 24px rgba(0,0,0,0.06)"
          className="w-full px-3 py-2 text-xs font-mono rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
    </Section>
  );
}

// ===== IMAGE =====
function ImageEditor({ currentStyle, currentContent, onUpdate: _onUpdate, onContentUpdate }: any) {
  const onUpdate = _onUpdate;
  return (
    <Section title="Image" expanded={true} onToggle={() => {}}>
      <Field label="Source URL">
        <input
          type="text"
          value={currentContent.src || currentStyle.backgroundImage?.replace(/^url\((.*)\)$/, "$1") || ""}
          onChange={(e) => {
            const url = e.target.value;
            onContentUpdate({ src: url });
            if (url) onUpdate({ backgroundImage: `url(${url})` });
          }}
          placeholder="https://..."
          className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </Field>
      {(currentContent.src || currentStyle.backgroundImage) && (
        <div className="border border-stone-200 rounded-lg overflow-hidden mb-2">
          <img
            src={currentContent.src || currentStyle.backgroundImage?.replace(/^url\((.*)\)$/, "$1")}
            alt=""
            className="w-full h-40 object-cover"
          />
        </div>
      )}
      <Field label="Background Size">
        <select
          value={currentStyle.backgroundSize || "cover"}
          onChange={(e) => onUpdate({ backgroundSize: e.target.value })}
          className="w-full px-2 py-2 text-xs rounded border border-stone-200 bg-white"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="auto">Auto</option>
        </select>
      </Field>
      <Field label="Background Position">
        <div className="grid grid-cols-3 gap-1">
          {[["top left", "top center", "top right"], ["center left", "center", "center right"], ["bottom left", "bottom center", "bottom right"]].flat().map((p) => (
            <button
              key={p}
              onClick={() => onUpdate({ backgroundPosition: p.replace(" ", " ") })}
              className={cn(
                "px-1 py-1 text-[9px] rounded border transition-colors",
                currentStyle.backgroundPosition === p || (!currentStyle.backgroundPosition && p === "center")
                  ? "bg-gold text-espresso border-gold"
                  : "border-stone-200 text-text-gray hover:border-gold"
              )}
            >
              {p === "center" ? "C" : p.split(" ").map((s: string) => s[0].toUpperCase()).join("")}
            </button>
          ))}
        </div>
      </Field>
    </Section>
  );
}

// ===== MOTION =====
function MotionEditor({ currentStyle, onUpdate }: any) {
  return (
    <div className="space-y-3">
      <Section title="Opacity" expanded={currentStyle.opacity !== undefined} onToggle={() => {}}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={currentStyle.opacity || "1"}
          onChange={(e) => onUpdate({ opacity: e.target.value === "1" ? undefined : e.target.value })}
          className="w-full"
        />
        <div className="text-[10px] text-text-gray text-center">
          {Math.round(parseFloat(currentStyle.opacity || "1") * 100)}%
        </div>
      </Section>

      <Section title="Animation" expanded={true} onToggle={() => {}}>
        <Field label="Animation Type">
          <select
            value={currentStyle.animation || "none"}
            onChange={(e) => onUpdate({ animation: e.target.value === "none" ? undefined : e.target.value })}
            className="w-full px-2 py-2 text-xs rounded border border-stone-200 bg-white"
          >
            <option value="none">None</option>
            <option value="fadeIn">Fade In</option>
            <option value="slideUp">Slide Up</option>
            <option value="slideDown">Slide Down</option>
            <option value="slideLeft">Slide Left</option>
            <option value="slideRight">Slide Right</option>
            <option value="scaleUp">Scale Up</option>
            <option value="bounceIn">Bounce In</option>
            <option value="rotate">Rotate</option>
          </select>
        </Field>
        <Field label="Duration">
          <select
            value={currentStyle.duration || "300"}
            onChange={(e) => onUpdate({ duration: e.target.value })}
            className="w-full px-2 py-2 text-xs rounded border border-stone-200 bg-white"
          >
            <option value="150">150ms (Very Fast)</option>
            <option value="300">300ms (Fast)</option>
            <option value="500">500ms (Normal)</option>
            <option value="800">800ms (Slow)</option>
            <option value="1200">1200ms (Very Slow)</option>
          </select>
        </Field>
        <Field label="Transition" hint="CSS transition property">
          <input
            type="text"
            value={currentStyle.transition || ""}
            onChange={(e) => onUpdate({ transition: e.target.value })}
            placeholder="all 0.3s ease"
            className="w-full px-3 py-2 text-xs rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </Field>
      </Section>
    </div>
  );
}

// ===== SETTINGS =====
function SettingsEditor({ pageOverrides, selectedPath, currentStyle, onUpdate: _unused_onUpdate, onReset, onExport, onImport, itemCount }: any) {
  return (
    <div className="space-y-4">
      <Section title="Page Info" expanded={true} onToggle={() => {}}>
        <div className="bg-cream-50 rounded-lg p-3 space-y-1 text-[10px]">
          <div className="flex justify-between"><span className="text-text-gray">Page</span><span className="text-heading font-medium">{pageOverrides.pageName}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">Overrides</span><span className="text-heading font-medium">{itemCount}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">Selected</span><span className="text-heading font-medium truncate ml-2">{selectedPath}</span></div>
          <div className="flex justify-between"><span className="text-text-gray">Updated</span><span className="text-heading font-medium">{new Date(pageOverrides.updatedAt || Date.now()).toLocaleString()}</span></div>
        </div>
      </Section>

      <Section title="Selected Element Style" expanded={true} onToggle={() => {}}>
        <div className="text-[9px] font-mono bg-stone-900 text-green-300 rounded-lg p-3 max-h-48 overflow-auto break-all">
          {Object.keys(currentStyle).length === 0 ? (
            <span className="text-gray-500">No custom styles</span>
          ) : (
            JSON.stringify(currentStyle, null, 2)
          )}
        </div>
      </Section>

      <div className="space-y-2">
        <button
          onClick={onReset}
          className="w-full px-4 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-red-100"
        >
          <IconTrash className="w-3.5 h-3.5 inline-block mr-1" />
          Reset all changes (this page)
        </button>
        <button
          onClick={onExport}
          className="w-full px-4 py-2.5 rounded-lg bg-cream-50 text-espresso border border-stone-200 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-gold/15"
        >
          <IconDownload className="w-3.5 h-3.5 inline-block mr-1" />
          Export overrides as JSON
        </button>
        <button
          onClick={onImport}
          className="w-full px-4 py-2.5 rounded-lg bg-cream-50 text-espresso border border-stone-200 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-gold/15"
        >
          <IconUpload className="w-3.5 h-3.5 inline-block mr-1" />
          Import overrides from JSON
        </button>
        <button
          onClick={() => {
            if (confirm("This will clear ALL overrides across ALL pages. Continue?")) {
              clearAllOverrides();
            }
          }}
          className="w-full px-4 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-red-100"
        >
          <IconTrash className="w-3.5 h-3.5 inline-block mr-1" />
          Clear ALL overrides (all pages)
        </button>
      </div>
    </div>
  );
}

// ===================== UTILITY COMPONENTS =====================

function Section({ title, children, expanded, onToggle }: { title: string; children: React.ReactNode; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between text-[9px] uppercase tracking-widest text-gold font-bold bg-gradient-to-r from-gold/5 to-transparent hover:from-gold/10 transition-colors"
      >
        <span>{title}</span>
        {expanded ? <IconMinus className="w-3 h-3" /> : <IconPlus className="w-3 h-3" />}
      </button>
      {expanded && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-widest text-text-gray font-semibold mb-1 block">{label}</label>
      {children}
      {hint && <p className="text-[9px] text-text-gray mt-0.5">{hint}</p>}
    </div>
  );
}
