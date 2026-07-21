// Convert style overrides into inline CSS object

import type { StyleOverrides } from "./builderTypes";

const FONT_FAMILY_MAP: Record<string, string> = {
  serif: '"Playfair Display", "Cormorant Garamond", serif',
  sans: '"Poppins", system-ui, sans-serif',
  mono: '"JetBrains Mono", monospace',
};

export function styleToCss(style: StyleOverrides | undefined): React.CSSProperties {
  if (!style) return {};
  const css: React.CSSProperties = {};

  if (style.fontFamily && FONT_FAMILY_MAP[style.fontFamily]) {
    css.fontFamily = FONT_FAMILY_MAP[style.fontFamily];
  }
  if (style.fontSize) {
    // Strip tailwind prefix and convert to px
    const m = style.fontSize.match(/text-(\w+)/);
    if (m) {
      const sizeMap: Record<string, number> = {
        xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30,
        "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128,
      };
      if (sizeMap[m[1]]) css.fontSize = `${sizeMap[m[1]]}px`;
    } else {
      css.fontSize = style.fontSize;
    }
  }
  if (style.fontWeight) {
    const w = style.fontWeight.replace("font-", "");
    css.fontWeight = w;
  }
  if (style.fontStyle) css.fontStyle = style.fontStyle;
  if (style.letterSpacing) css.letterSpacing = style.letterSpacing;
  if (style.lineHeight) css.lineHeight = style.lineHeight;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.textTransform && style.textTransform !== "none") css.textTransform = style.textTransform;

  if (style.color) css.color = style.color;
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.backgroundImage) {
    css.backgroundImage = `url(${style.backgroundImage})`;
    css.backgroundSize = "cover";
    css.backgroundPosition = "center";
  }

  if (style.padding) css.padding = style.padding;
  if (style.paddingX) {
    css.paddingLeft = style.paddingX;
    css.paddingRight = style.paddingX;
  }
  if (style.paddingY) {
    css.paddingTop = style.paddingY;
    css.paddingBottom = style.paddingY;
  }
  if (style.margin) css.margin = style.margin;
  if (style.marginTop) css.marginTop = style.marginTop;
  if (style.marginBottom) css.marginBottom = style.marginBottom;

  if (style.borderRadius) css.borderRadius = style.borderRadius;
  if (style.borderWidth) css.borderWidth = style.borderWidth;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.borderStyle) css.borderStyle = style.borderStyle;

  if (style.boxShadow && style.boxShadow !== "none") css.boxShadow = style.boxShadow;

  if (style.width) css.width = style.width;
  if (style.height) css.height = style.height;
  if (style.maxWidth) css.maxWidth = style.maxWidth;
  if (style.minHeight) css.minHeight = style.minHeight;

  if (style.opacity) css.opacity = parseFloat(style.opacity);
  if (style.filter) css.filter = style.filter;

  return css;
}

export function classToFontClass(className: string | undefined): string {
  if (!className) return "serif";
  if (className.includes("font-mono")) return "mono";
  if (className.includes("font-sans")) return "sans";
  if (className.includes("font-serif")) return "serif";
  return "serif";
}

export function classToFontSizeClass(className: string | undefined): string {
  if (!className) return "text-base";
  const m = className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/);
  return m ? `text-${m[1]}` : "text-base";
}
