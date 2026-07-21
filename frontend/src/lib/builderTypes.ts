/* ================================================================== */
/*  Woodex Live Builder — Type Definitions                             */
/* ================================================================== */

/** Element types that can be edited in the builder */
export type ElementType = 'section' | 'heading' | 'text' | 'button' | 'image' | 'card' | 'eyebrow' | 'stat' | 'list';

/** Style overrides for any editable element — subset of CSS properties */
export interface StyleOverrides {
  // Typography
  fontFamily?: 'serif' | 'sans' | 'mono';
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  lineHeight?: string;
  letterSpacing?: string;

  // Colors
  color?: string;
  headingColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;

  // Background
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  backgroundPosition?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';

  // Spacing
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;

  // Border
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

  // Effects
  boxShadow?: string;
  opacity?: string;

  // Size
  width?: string;
  maxWidth?: string;
  minHeight?: string;
}

/** Content overrides for editable text/images/links */
export interface ContentOverrides {
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
  number?: string;
}

/** Per-element override */
export interface SectionOverride {
  id: string;
  type: ElementType;
  path: string;
  content?: ContentOverrides;
  style?: StyleOverrides;
  hidden?: boolean;
  order?: number;
}

/** Per-page overrides */
export interface PageOverrides {
  pageName: string;
  sections: SectionOverride[];
  updatedAt: number;
}

/** Builder UI state */
export interface BuilderState {
  isActive: boolean;
  selectedPath: string | null;
  hoveredPath: string | null;
  panel: 'style' | 'content' | null;
}

/** All overrides across all pages */
export type AllOverrides = Record<string, PageOverrides>;

/* ================================================================== */
/*  Preset Constants                                                   */
/* ================================================================== */

export const FONT_FAMILIES = [
  { key: 'serif', label: 'Cormorant Garamond', value: "'Cormorant Garamond', Georgia, serif" },
  { key: 'sans', label: 'Montserrat', value: "'Montserrat', system-ui, sans-serif" },
  { key: 'mono', label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
];

export const FONT_SIZE_PRESETS = [
  { key: 'xs', label: 'XS', value: '12px' },
  { key: 'sm', label: 'SM', value: '14px' },
  { key: 'base', label: 'Base', value: '16px' },
  { key: 'lg', label: 'LG', value: '18px' },
  { key: 'xl', label: 'XL', value: '20px' },
  { key: '2xl', label: '2XL', value: '24px' },
  { key: '3xl', label: '3XL', value: '30px' },
  { key: '4xl', label: '4XL', value: '36px' },
  { key: '5xl', label: '5XL', value: '48px' },
  { key: '6xl', label: '6XL', value: '60px' },
  { key: '7xl', label: '7XL', value: '72px' },
  { key: '8xl', label: '8XL', value: '96px' },
];

export const COLOR_PRESETS = [
  { key: 'white', label: 'White', value: '#FFFFFF' },
  { key: 'gold', label: 'Gold', value: '#C9A84C' },
  { key: 'gold-light', label: 'Gold Light', value: '#E2C97E' },
  { key: 'cream', label: 'Cream', value: '#FAF7F2' },
  { key: 'espresso', label: 'Espresso', value: '#0A0A0A' },
  { key: 'body', label: 'Body Text', value: '#D4C5A9' },
  { key: 'muted', label: 'Muted', value: '#8A8073' },
  { key: 'border', label: 'Border', value: '#E5E0D8' },
  { key: 'success', label: 'Success', value: '#16A34A' },
  { key: 'danger', label: 'Danger', value: '#DC2626' },
  { key: 'blue', label: 'Blue', value: '#2563EB' },
  { key: 'purple', label: 'Purple', value: '#7C3AED' },
];

export const RADIUS_PRESETS = [
  { key: 'none', label: 'None', value: '0' },
  { key: 'sm', label: 'SM', value: '4px' },
  { key: 'md', label: 'MD', value: '8px' },
  { key: 'lg', label: 'LG', value: '16px' },
  { key: 'xl', label: 'XL', value: '24px' },
  { key: 'pill', label: 'Pill', value: '9999px' },
];

export const SHADOW_PRESETS = [
  { key: 'none', label: 'None', value: 'none' },
  { key: 'sm', label: 'Small', value: '0 1px 2px rgba(0,0,0,0.1)' },
  { key: 'md', label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
  { key: 'lg', label: 'Large', value: '0 10px 25px rgba(0,0,0,0.15)' },
  { key: 'xl', label: 'XL', value: '0 20px 40px rgba(0,0,0,0.2)' },
  { key: 'gold', label: 'Gold Glow', value: '0 4px 20px rgba(201,168,76,0.3)' },
  { key: 'inner', label: 'Inner', value: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
];

export const PAGE_NAMES: Record<string, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  projects: 'Projects',
  insights: 'Insights',
  contact: 'Contact',
};
