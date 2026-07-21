// Core types for the no-code page builder
// Extended with animation, transition, and advanced styling

export type ElementType =
  | "section"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "card"
  | "eyebrow"
  | "icon"
  | "stat"
  | "list"
  | "video";

export type StyleOverrides = {
  // Typography
  fontFamily?: "serif" | "sans" | "mono";
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: "normal" | "italic";
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";

  // Color
  color?: string;
  headingColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  backgroundRepeat?: string;

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
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";

  // Shadow
  boxShadow?: string;

  // Size
  width?: string;
  height?: string;
  maxWidth?: string;
  minHeight?: string;

  // Effects
  opacity?: string;
  filter?: string;
  backdropFilter?: string;

  // Motion/Animation
  animation?: string;
  animationDuration?: string;
  animationDelay?: string;
  animationIterationCount?: string;
  transition?: string;
  transform?: string;
  transformOrigin?: string;

  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;

  // Misc
  cursor?: string;
  overflow?: string;
  zIndex?: string;
};

export type ContentOverrides = {
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
  number?: string;
  label?: string;
};

export type SectionOverride = {
  id: string;
  type: ElementType | "section-block";
  path: string;
  content?: ContentOverrides;
  style?: StyleOverrides;
  hidden?: boolean;
  order?: number;
  children?: SectionOverride[];
};

export type PageOverrides = {
  pageName: string;
  sections: SectionOverride[];
  updatedAt: number;
};

export type BuilderState = {
  isActive: boolean;
  selectedPath: string | null;
  hoveredPath: string | null;
  draggedPath: string | null;
  panel: "style" | "content" | "settings" | null;
};

export const DEFAULT_FONT_FAMILIES = [
  { value: "serif", label: "Playfair Display (Serif)" },
  { value: "sans", label: "Poppins (Sans)" },
  { value: "mono", label: "JetBrains Mono" },
  { value: "Inter", label: "Inter" },
  { value: "Manrope", label: "Manrope" },
];

export const FONT_SIZE_PRESETS = [
  { value: "xs", label: "12px" },
  { value: "sm", label: "14px" },
  { value: "base", label: "16px" },
  { value: "lg", label: "18px" },
  { value: "xl", label: "20px" },
  { value: "2xl", label: "24px" },
  { value: "3xl", label: "30px" },
  { value: "4xl", label: "36px" },
  { value: "5xl", label: "48px" },
  { value: "6xl", label: "60px" },
  { value: "7xl", label: "72px" },
  { value: "8xl", label: "96px" },
];

export const COLOR_PRESETS = [
  { name: "Cream", value: "#F6F1E7" },
  { name: "Espresso", value: "#211C18" },
  { name: "Gold", value: "#C6A15B" },
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Heading", value: "#2A241F" },
  { name: "Text Gray", value: "#6E6660" },
  { name: "Light Text", value: "#9A8F86" },
  { name: "Border", value: "#E5E0D8" },
  { name: "Success", value: "#16A34A" },
  { name: "Danger", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
];

export const RADIUS_PRESETS = [
  { name: "None", value: "0" },
  { name: "Small", value: "4px" },
  { name: "Default", value: "8px" },
  { name: "Card", value: "16px" },
  { name: "Large", value: "24px" },
  { name: "Pill", value: "9999px" },
];

export const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Subtle", value: "0 1px 3px rgba(0,0,0,0.1)" },
  { name: "Soft", value: "0 2px 8px rgba(0,0,0,0.08)" },
  { name: "Card", value: "0 4px 24px rgba(0, 0, 0, 0.06)" },
  { name: "Card Hover", value: "0 8px 32px rgba(0, 0, 0, 0.12)" },
  { name: "Elevated", value: "0 20px 60px rgba(33, 28, 24, 0.15)" },
  { name: "Glow", value: "0 0 20px rgba(198, 161, 91, 0.3)" },
  { name: "Sharp", value: "8px 8px 0 #C6A15B" },
];
