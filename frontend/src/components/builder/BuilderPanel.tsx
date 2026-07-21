import { useState, useCallback, useRef, useEffect } from 'react';
import { useBuilder } from '@/lib/builderStore';
import {
  FONT_FAMILIES,
  FONT_SIZE_PRESETS,
  COLOR_PRESETS,
  RADIUS_PRESETS,
  SHADOW_PRESETS,
} from '@/lib/builderTypes';
import type { StyleOverrides } from '@/lib/builderTypes';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type TabKey = 'content' | 'style' | 'settings';

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ================================================================== */
/*  Small reusable controls                                            */
/* ================================================================== */

/** Label above controls */
function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8073] mb-1.5', className)}>
      {children}
    </label>
  );
}

/** Standard styled text input */
function TextInput({
  value,
  onChange,
  placeholder,
  suffix,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-sm px-3 py-2 text-[#D4C5A9] rounded focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
      />
      {suffix && (
        <span className="absolute right-3 text-xs text-[#8A8073] pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

/** Collapsible section wrapper */
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[rgba(201,168,76,0.1)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(201,168,76,0.03)] transition-colors"
      >
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A84C]">
          {title}
        </span>
        <svg
          className={cn('w-4 h-4 text-[#8A8073] transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

/** Preset grid button (color swatch, radius, shadow, etc.) */
function SwatchButton({
  value,
  active,
  onClick,
  label,
  style,
  className,
}: {
  value: string;
  active: boolean;
  onClick: () => void;
  label: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'w-7 h-7 rounded border-2 transition-all flex items-center justify-center text-[0.5rem] font-bold',
        active
          ? 'border-[#C9A84C] shadow-[0_0_6px_rgba(201,168,76,0.4)]'
          : 'border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]',
        className
      )}
      style={style}
    >
      {active && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

/** Toggle button group (e.g. font family, alignment) */
function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; icon?: React.ReactNode }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          title={opt.label}
          onClick={() => onChange(opt.key)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-medium transition-all',
            value === opt.key
              ? 'bg-[#C9A84C] text-[#0A0A0A]'
              : 'bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
          )}
        >
          {opt.icon || opt.label}
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  SVG Icons for alignment                                            */
/* ================================================================== */

const AlignLeft = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M3 6h18M3 12h12M3 18h16" />
  </svg>
);
const AlignCenter = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M3 6h18M6 12h12M4 18h16" />
  </svg>
);
const AlignRight = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M3 6h18M9 12h12M5 18h16" />
  </svg>
);
const AlignJustify = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

/* ================================================================== */
/*  Content Tab                                                        */
/* ================================================================== */

function ContentTab() {
  const { state, currentPage, getOverride, updateContent, hideSection, resetElement } = useBuilder();
  const override = state.selectedPath
    ? getOverride(currentPage, state.selectedPath)
    : undefined;

  if (!state.selectedPath) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-[#C9A84C]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
          </svg>
        </div>
        <p className="text-sm text-[#8A8073] leading-relaxed">
          Select an element on the page to edit its content and style.
        </p>
      </div>
    );
  }

  const content = override?.content || {};
  const path = state.selectedPath;

  return (
    <div className="space-y-4 p-4">
      {/* Text Content */}
      <div>
        <FieldLabel>Text Content</FieldLabel>
        <textarea
          value={content.text || ''}
          onChange={(e) => updateContent(currentPage, path, { text: e.target.value })}
          placeholder="Enter text content..."
          rows={4}
          className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-sm px-3 py-2 text-[#D4C5A9] rounded focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-y"
        />
      </div>

      {/* Image URL */}
      <div>
        <FieldLabel>Image URL</FieldLabel>
        <div className="flex gap-2">
          <input
            type="text"
            value={content.src || ''}
            onChange={(e) => updateContent(currentPage, path, { src: e.target.value })}
            placeholder="https://..."
            className="flex-1 bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-sm px-3 py-2 text-[#D4C5A9] rounded focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
          <button
            type="button"
            className="px-3 py-2 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] text-[#C9A84C] text-xs font-medium rounded hover:bg-[rgba(201,168,76,0.2)] transition-colors"
          >
            Browse
          </button>
        </div>
      </div>

      {/* Alt Text */}
      <div>
        <FieldLabel>Alt Text</FieldLabel>
        <TextInput
          value={content.alt || ''}
          onChange={(v) => updateContent(currentPage, path, { alt: v })}
          placeholder="Describe the image..."
        />
      </div>

      {/* Link URL */}
      <div>
        <FieldLabel>Link URL</FieldLabel>
        <TextInput
          value={content.href || ''}
          onChange={(v) => updateContent(currentPage, path, { href: v })}
          placeholder="https://..."
        />
      </div>

      {/* Visibility Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => hideSection(currentPage, path, !override?.hidden)}
          className={cn(
            'w-full py-2.5 rounded text-sm font-medium transition-all',
            override?.hidden
              ? 'bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.3)] text-[#16A34A] hover:bg-[rgba(22,163,74,0.25)]'
              : 'bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.15)]'
          )}
        >
          {override?.hidden ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Show Element
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              Hide Element
            </span>
          )}
        </button>
      </div>

      {/* Reset Element */}
      {override && (
        <div>
          <button
            type="button"
            onClick={() => resetElement(currentPage, path)}
            className="w-full py-2.5 rounded text-sm font-medium bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.15)] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Reset Element
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Style Tab                                                          */
/* ================================================================== */

function StyleTab() {
  const { state, currentPage, getOverride, updateStyle } = useBuilder();
  const override = state.selectedPath
    ? getOverride(currentPage, state.selectedPath)
    : undefined;
  const style: StyleOverrides = override?.style || {};

  const path = state.selectedPath;
  const patch = useCallback(
    (partial: StyleOverrides) => {
      if (path) updateStyle(currentPage, path, partial);
    },
    [currentPage, path, updateStyle]
  );

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-[#C9A84C]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
        </div>
        <p className="text-sm text-[#8A8073] leading-relaxed">
          Select an element to edit its style properties.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y-0">
      {/* ── Typography ── */}
      <Section title="Typography">
        {/* Font Family */}
        <div>
          <FieldLabel>Font Family</FieldLabel>
          <div className="flex gap-1">
            {FONT_FAMILIES.map((f) => (
              <button
                key={f.key}
                type="button"
                title={f.label}
                onClick={() => patch({ fontFamily: f.key as StyleOverrides['fontFamily'] })}
                className={cn(
                  'flex-1 py-1.5 px-1 rounded text-[0.65rem] font-medium transition-all text-center truncate',
                  style.fontFamily === f.key
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
                )}
                style={{ fontFamily: f.value }}
              >
                {f.key === 'serif' ? 'Serif' : f.key === 'sans' ? 'Sans' : 'Mono'}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Presets */}
        <div>
          <FieldLabel>Font Size</FieldLabel>
          <div className="grid grid-cols-6 gap-1">
            {FONT_SIZE_PRESETS.map((fs) => (
              <button
                key={fs.key}
                type="button"
                onClick={() => patch({ fontSize: fs.value })}
                className={cn(
                  'py-1 rounded text-[0.6rem] font-medium transition-all',
                  style.fontSize === fs.value
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
                )}
              >
                {fs.label}
              </button>
            ))}
          </div>
          <TextInput
            value={style.fontSize || ''}
            onChange={(v) => patch({ fontSize: v })}
            placeholder="e.g. 24px"
            suffix="px"
            className="mt-2"
          />
        </div>

        {/* Font Weight */}
        <div>
          <FieldLabel>Font Weight</FieldLabel>
          <select
            value={style.fontWeight || ''}
            onChange={(e) => patch({ fontWeight: e.target.value })}
            className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-sm px-3 py-2 text-[#D4C5A9] rounded focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          >
            <option value="">Default</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra-bold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div>
          <FieldLabel>Text Align</FieldLabel>
          <ToggleGroup
            options={[
              { key: 'left', label: 'Left', icon: AlignLeft },
              { key: 'center', label: 'Center', icon: AlignCenter },
              { key: 'right', label: 'Right', icon: AlignRight },
              { key: 'justify', label: 'Justify', icon: AlignJustify },
            ]}
            value={style.textAlign}
            onChange={(v) => patch({ textAlign: v })}
          />
        </div>

        {/* Text Transform */}
        <div>
          <FieldLabel>Text Transform</FieldLabel>
          <select
            value={style.textTransform || ''}
            onChange={(e) => patch({ textTransform: e.target.value as StyleOverrides['textTransform'] })}
            className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-sm px-3 py-2 text-[#D4C5A9] rounded focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          >
            <option value="">None</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>

        {/* Line Height & Letter Spacing */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel>Line Height</FieldLabel>
            <TextInput
              value={style.lineHeight || ''}
              onChange={(v) => patch({ lineHeight: v })}
              placeholder="1.5"
            />
          </div>
          <div>
            <FieldLabel>Letter Spacing</FieldLabel>
            <TextInput
              value={style.letterSpacing || ''}
              onChange={(v) => patch({ letterSpacing: v })}
              placeholder="0.05em"
              suffix="em"
            />
          </div>
        </div>
      </Section>

      {/* ── Colors ── */}
      <Section title="Colors">
        {/* Text Color */}
        <div>
          <FieldLabel>Text Color</FieldLabel>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={style.color || '#FFFFFF'}
              onChange={(e) => patch({ color: e.target.value })}
              className="w-8 h-8 rounded border border-[rgba(201,168,76,0.25)] cursor-pointer bg-transparent"
            />
            <TextInput
              value={style.color || ''}
              onChange={(v) => patch({ color: v })}
              placeholder="#FFFFFF"
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <SwatchButton
                key={c.key}
                value={c.value}
                label={c.label}
                active={(style.color || '').toUpperCase() === c.value.toUpperCase()}
                onClick={() => patch({ color: c.value })}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <FieldLabel>Background Color</FieldLabel>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={style.backgroundColor || '#000000'}
              onChange={(e) => patch({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded border border-[rgba(201,168,76,0.25)] cursor-pointer bg-transparent"
            />
            <TextInput
              value={style.backgroundColor || ''}
              onChange={(v) => patch({ backgroundColor: v })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <SwatchButton
                key={c.key}
                value={c.value}
                label={c.label}
                active={(style.backgroundColor || '').toUpperCase() === c.value.toUpperCase()}
                onClick={() => patch({ backgroundColor: c.value })}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Spacing ── */}
      <Section title="Spacing" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel>Padding</FieldLabel>
            <TextInput
              value={style.padding || ''}
              onChange={(v) => patch({ padding: v })}
              placeholder="16px"
              suffix="px"
            />
          </div>
          <div>
            <FieldLabel>Margin Top</FieldLabel>
            <TextInput
              value={style.marginTop || ''}
              onChange={(v) => patch({ marginTop: v })}
              placeholder="0"
              suffix="px"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Margin Bottom</FieldLabel>
          <TextInput
            value={style.marginBottom || ''}
            onChange={(v) => patch({ marginBottom: v })}
            placeholder="0"
            suffix="px"
          />
        </div>
      </Section>

      {/* ── Border ── */}
      <Section title="Border" defaultOpen={false}>
        {/* Border Radius Presets */}
        <div>
          <FieldLabel>Border Radius</FieldLabel>
          <div className="flex gap-1">
            {RADIUS_PRESETS.map((r) => (
              <button
                key={r.key}
                type="button"
                title={r.label}
                onClick={() => patch({ borderRadius: r.value + (r.value !== '0' && r.value !== '9999px' ? '' : '') })}
                className={cn(
                  'flex-1 py-1.5 rounded text-[0.6rem] font-medium transition-all',
                  style.borderRadius === r.value || style.borderRadius === r.value + 'px'
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <FieldLabel>Border Width</FieldLabel>
            <TextInput
              value={style.borderWidth || ''}
              onChange={(v) => patch({ borderWidth: v })}
              placeholder="1px"
              suffix="px"
            />
          </div>
          <div>
            <FieldLabel>Border Color</FieldLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.borderColor || '#C9A84C'}
                onChange={(e) => patch({ borderColor: e.target.value })}
                className="w-8 h-8 rounded border border-[rgba(201,168,76,0.25)] cursor-pointer bg-transparent"
              />
              <TextInput
                value={style.borderColor || ''}
                onChange={(v) => patch({ borderColor: v })}
                placeholder="#C9A84C"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Background ── */}
      <Section title="Background" defaultOpen={false}>
        {/* Background Color */}
        <div>
          <FieldLabel>Background Color</FieldLabel>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={style.backgroundColor || '#000000'}
              onChange={(e) => patch({ backgroundColor: e.target.value })}
              className="w-9 h-9 p-0.5 border border-[rgba(201,168,76,0.3)] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.backgroundColor || ''}
              onChange={(e) => patch({ backgroundColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.2)] px-2.5 py-1.5 text-xs outline-none font-mono"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((c) => (
              <SwatchButton
                key={c.key}
                active={style.backgroundColor === c.value}
                color={c.value}
                label={c.label}
                onClick={() => patch({ backgroundColor: c.value })}
              />
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div className="mt-4">
          <FieldLabel>Background Image URL</FieldLabel>
          <TextInput
            value={style.backgroundImage || ''}
            onChange={(v) => patch({ backgroundImage: v })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Background Repeat */}
        {style.backgroundImage && (
          <div className="mt-3">
            <FieldLabel>Repeat</FieldLabel>
            <select
              value={style.backgroundRepeat || 'no-repeat'}
              onChange={(e) => patch({ backgroundRepeat: e.target.value as StyleOverrides['backgroundRepeat'] })}
              className="w-full bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.2)] px-3 py-2 text-xs outline-none"
            >
              <option value="no-repeat">No Repeat</option>
              <option value="repeat">Repeat</option>
              <option value="repeat-x">Repeat X</option>
              <option value="repeat-y">Repeat Y</option>
            </select>
          </div>
        )}

        {/* Background Size */}
        {style.backgroundImage && (
          <div className="mt-3">
            <FieldLabel>Size</FieldLabel>
            <select
              value={style.backgroundSize || 'cover'}
              onChange={(e) => patch({ backgroundSize: e.target.value as StyleOverrides['backgroundSize'] })}
              className="w-full bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.2)] px-3 py-2 text-xs outline-none"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        )}

        {/* Background Position */}
        {style.backgroundImage && (
          <div className="mt-3">
            <FieldLabel>Position</FieldLabel>
            <TextInput
              value={style.backgroundPosition || ''}
              onChange={(v) => patch({ backgroundPosition: v })}
              placeholder="center"
              suffix=""
            />
          </div>
        )}
      </Section>

      {/* ── Effects ── */}
      <Section title="Effects" defaultOpen={false}>
        {/* Opacity */}
        <div>
          <FieldLabel>Opacity</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={style.opacity || '1'}
              onChange={(e) => patch({ opacity: e.target.value })}
              className="flex-1 h-1 bg-[#0A0A0A] rounded-full appearance-none cursor-pointer accent-[#C9A84C]"
            />
            <span className="text-xs text-[#D4C5A9] w-10 text-right font-mono">
              {style.opacity || '1'}
            </span>
          </div>
        </div>

        {/* Box Shadow Presets */}
        <div>
          <FieldLabel>Box Shadow</FieldLabel>
          <div className="grid grid-cols-4 gap-1">
            {SHADOW_PRESETS.map((s) => (
              <button
                key={s.key}
                type="button"
                title={s.label}
                onClick={() => patch({ boxShadow: s.value })}
                className={cn(
                  'py-2 rounded text-[0.55rem] font-medium transition-all',
                  style.boxShadow === s.value
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#0A0A0A] text-[#D4C5A9] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ================================================================== */
/*  Settings Tab                                                       */
/* ================================================================== */

function SettingsTab() {
  const {
    state,
    currentPage,
    getOverride,
    resetElement,
    resetPage,
    exportOverrides,
    importOverrides,
    clearAll,
  } = useBuilder();

  const override = state.selectedPath
    ? getOverride(currentPage, state.selectedPath)
    : undefined;

  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rawJson = override ? JSON.stringify(override, null, 2) : '{}';

  const handleExport = useCallback(() => {
    const json = exportOverrides();
    navigator.clipboard.writeText(json).then(() => {
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    }).catch(() => {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    });
  }, [exportOverrides]);

  const handleImport = useCallback(() => {
    if (importJson.trim()) {
      importOverrides(importJson);
      setImportJson('');
      setShowImport(false);
    }
  }, [importJson, importOverrides]);

  return (
    <div className="space-y-4 p-4">
      {/* Page & Path Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLabel>Current Page</FieldLabel>
          <span className="text-xs text-[#D4C5A9] font-medium">{currentPage}</span>
        </div>
        {state.selectedPath && (
          <div className="flex items-center justify-between">
            <FieldLabel>Element Path</FieldLabel>
            <span className="text-xs text-[#C9A84C] font-mono truncate max-w-[240px]" title={state.selectedPath}>
              {state.selectedPath}
            </span>
          </div>
        )}
      </div>

      {/* Raw JSON */}
      <div>
        <FieldLabel>Override Data (readonly)</FieldLabel>
        <textarea
          ref={textareaRef}
          value={rawJson}
          readOnly
          rows={10}
          className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] text-[0.7rem] font-mono px-3 py-2 text-[#8A8073] rounded resize-y focus:outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => state.selectedPath && resetElement(currentPage, state.selectedPath)}
            disabled={!state.selectedPath}
            className="py-2 rounded text-xs font-medium bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.15)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Reset Element
          </button>
          <button
            type="button"
            onClick={() => resetPage(currentPage)}
            className="py-2 rounded text-xs font-medium bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.15)] transition-all"
          >
            Reset Page
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="py-2 rounded text-xs font-medium bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.2)] transition-all"
          >
            {copyFeedback || 'Export All'}
          </button>
          <button
            type="button"
            onClick={() => setShowImport(!showImport)}
            className="py-2 rounded text-xs font-medium bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] text-[#D4C5A9] hover:border-[rgba(201,168,76,0.4)] transition-all"
          >
            Import
          </button>
        </div>

        {showImport && (
          <div className="space-y-2">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON overrides here..."
              rows={4}
              className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.25)] text-xs font-mono px-3 py-2 text-[#D4C5A9] rounded resize-y focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleImport}
                className="flex-1 py-2 rounded text-xs font-medium bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E2C97E] transition-all"
              >
                Apply Import
              </button>
              <button
                type="button"
                onClick={() => { setShowImport(false); setImportJson(''); }}
                className="px-3 py-2 rounded text-xs font-medium bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] text-[#8A8073] hover:text-[#D4C5A9] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (window.confirm('This will erase ALL overrides across all pages. Are you sure?')) {
              clearAll();
            }
          }}
          className="w-full py-2 rounded text-xs font-medium bg-[rgba(220,38,38,0.05)] border border-[rgba(220,38,38,0.15)] text-[#DC2626]/70 hover:bg-[rgba(220,38,38,0.1)] hover:text-[#DC2626] transition-all"
        >
          Clear All Overrides
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <FieldLabel className="mb-2">Keyboard Shortcuts</FieldLabel>
        <div className="space-y-1.5">
          {[
            { keys: ['Cmd', 'Shift', 'B'], desc: 'Toggle builder' },
            { keys: ['Cmd', 'Z'], desc: 'Undo' },
            { keys: ['Cmd', 'Shift', 'Z'], desc: 'Redo' },
            { keys: ['Esc'], desc: 'Close panel' },
          ].map((shortcut) => (
            <div key={shortcut.desc} className="flex items-center justify-between">
              <span className="text-xs text-[#8A8073]">{shortcut.desc}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-1.5 py-0.5 bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] rounded text-[0.6rem] text-[#C9A84C] font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Panel                                                         */
/* ================================================================== */

export default function BuilderPanel() {
  const { state, setPanel, selectElement } = useBuilder();
  const [activeTab, setActiveTab] = useState<TabKey>(
    state.panel === 'content' ? 'content' : state.panel === 'style' ? 'style' : 'style'
  );

  // Sync panel state from builder store
  useEffect(() => {
    if (state.panel === 'content') setActiveTab('content');
    else if (state.panel === 'style') setActiveTab('style');
  }, [state.panel]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.selectedPath) {
        selectElement(null);
        setPanel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedPath, selectElement, setPanel]);

  const handleClose = useCallback(() => {
    selectElement(null);
    setPanel(null);
  }, [selectElement, setPanel]);

  const handleTabChange = useCallback(
    (tab: TabKey) => {
      setActiveTab(tab);
      setPanel(tab === 'settings' ? null : tab);
    },
    [setPanel]
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'content', label: 'Content' },
    { key: 'style', label: 'Style' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div
      className="fixed top-0 right-0 h-full w-[420px] bg-[#111110] border-l border-[rgba(201,168,76,0.2)] z-50 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.5)]"
      style={{ willChange: 'transform' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(201,168,76,0.15)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Inspector
          </h2>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="w-7 h-7 rounded flex items-center justify-center text-[#8A8073] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
          title="Close panel (Esc)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[rgba(201,168,76,0.1)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              'flex-1 py-2.5 text-xs font-medium tracking-wider uppercase transition-all relative',
              activeTab === tab.key
                ? 'text-[#C9A84C]'
                : 'text-[#8A8073] hover:text-[#D4C5A9]'
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#C9A84C] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'style' && <StyleTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* ── Footer ── */}
      {state.selectedPath && (
        <div className="px-4 py-2.5 border-t border-[rgba(201,168,76,0.1)] bg-[rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            <span className="text-[0.65rem] text-[#8A8073] truncate" title={state.selectedPath}>
              {state.selectedPath}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
