import type { StyleOverrides } from './builderTypes';

const FONT_FAMILY_MAP: Record<string, string> = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Montserrat', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const FONT_SIZE_MAP: Record<string, string> = {
  xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px',
  '2xl': '24px', '3xl': '30px', '4xl': '36px', '5xl': '48px',
  '6xl': '60px', '7xl': '72px', '8xl': '96px',
};

/**
 * Convert StyleOverrides to React.CSSProperties for inline styling.
 */
export function styleToCss(style: StyleOverrides | undefined): React.CSSProperties {
  if (!style) return {};
  const css: React.CSSProperties = {};

  // Typography
  if (style.fontFamily) css.fontFamily = FONT_FAMILY_MAP[style.fontFamily] || style.fontFamily;
  if (style.fontSize) css.fontSize = FONT_SIZE_MAP[style.fontSize] || style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight.replace('font-', '') as React.CSSProperties['fontWeight'];
  if (style.fontStyle) css.fontStyle = style.fontStyle;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.textTransform) css.textTransform = style.textTransform;
  if (style.textDecoration) css.textDecoration = style.textDecoration;
  if (style.lineHeight) css.lineHeight = style.lineHeight;
  if (style.letterSpacing) css.letterSpacing = style.letterSpacing;

  // Colors
  if (style.color) css.color = style.color;
  if (style.headingColor) css.color = style.headingColor; // headingColor overrides color
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.backgroundImage) {
    const url = style.backgroundImage.startsWith('url(') ? style.backgroundImage : `url(${style.backgroundImage})`;
    css.backgroundImage = url;
    // Only apply defaults when explicit background fields aren't set
    if (!style.backgroundSize) css.backgroundSize = 'cover';
    if (!style.backgroundPosition) css.backgroundPosition = 'center';
  }
  if (style.backgroundRepeat) css.backgroundRepeat = style.backgroundRepeat;
  if (style.backgroundPosition) css.backgroundPosition = style.backgroundPosition;
  if (style.backgroundSize) css.backgroundSize = style.backgroundSize;

  // Spacing
  if (style.padding) css.padding = style.padding;
  if (style.paddingX) { css.paddingLeft = style.paddingX; css.paddingRight = style.paddingX; }
  if (style.paddingY) { css.paddingTop = style.paddingY; css.paddingBottom = style.paddingY; }
  if (style.margin) css.margin = style.margin;
  if (style.marginTop) css.marginTop = style.marginTop;
  if (style.marginBottom) css.marginBottom = style.marginBottom;

  // Border
  if (style.borderRadius) css.borderRadius = style.borderRadius;
  if (style.borderWidth) css.borderWidth = style.borderWidth;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.borderStyle) css.borderStyle = style.borderStyle;

  // Effects
  if (style.boxShadow && style.boxShadow !== 'none') css.boxShadow = style.boxShadow;
  if (style.opacity !== undefined) css.opacity = parseFloat(style.opacity) as number;

  // Size
  if (style.width) css.width = style.width;
  if (style.maxWidth) css.maxWidth = style.maxWidth;
  if (style.minHeight) css.minHeight = style.minHeight;

  return css;
}
