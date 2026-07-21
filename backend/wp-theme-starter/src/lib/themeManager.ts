// Theme Manager - Master control for site-wide theme (fonts, colors, sizes)
// Persisted to localStorage. Live CSS variables can be applied via themeManager.applyTheme()

const STORAGE_KEY = "wp-master-theme-v1";

export type ThemeConfig = {
  // Fonts
  fontHeading: string; // e.g., "Playfair Display"
  fontBody: string;    // e.g., "Poppins"
  fontMono: string;    // e.g., "JetBrains Mono"

  // Colors
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

  // Sizes
  heroHeight: "sm" | "md" | "lg" | "xl";
  sectionSpacing: "sm" | "md" | "lg" | "xl";
  cardRadius: string;
  buttonRadius: string;
  baseFontSize: "sm" | "base" | "lg";

  // Effects
  enableShadows: boolean;
  enableAnimations: boolean;
  darkMode: boolean;
};

const defaultTheme: ThemeConfig = {
  fontHeading: "Playfair Display",
  fontBody: "Poppins",
  fontMono: "JetBrains Mono",
  colorCream: "#F6F1E7",
  colorEspresso: "#211C18",
  colorGold: "#C6A15B",
  colorGoldHover: "#B89048",
  colorWhite: "#FFFFFF",
  colorText: "#6E6660",
  colorHeading: "#2A241F",
  colorBorder: "#E5E0D8",
  colorSuccess: "#16A34A",
  colorDanger: "#DC2626",
  heroHeight: "md",
  sectionSpacing: "lg",
  cardRadius: "16px",
  buttonRadius: "9999px",
  baseFontSize: "base",
  enableShadows: true,
  enableAnimations: true,
  darkMode: false,
};

const FONT_OPTIONS = [
  { value: "Playfair Display", label: "Playfair Display (Serif, Default)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Inter", label: "Inter (Sans)" },
  { value: "Poppins", label: "Poppins (Default)" },
  { value: "Manrope", label: "Manrope" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Roboto Mono", label: "Roboto Mono" },
];

function load(): ThemeConfig {
  try {
    if (typeof localStorage === "undefined") return defaultTheme;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTheme));
      } catch {
        // ignore
      }
      return defaultTheme;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return defaultTheme;
    return { ...defaultTheme, ...parsed };
  } catch {
    return defaultTheme;
  }
}

function save(theme: ThemeConfig) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    }
  } catch {
    // ignore
  }
}

import { useEffect, useState, useCallback } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(() => load());

  useEffect(() => {
    setTheme(load());
  }, []);

  const update = useCallback((updater: (t: ThemeConfig) => ThemeConfig) => {
    setTheme((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--color-cream", theme.colorCream);
    root.style.setProperty("--color-espresso", theme.colorEspresso);
    root.style.setProperty("--color-gold", theme.colorGold);
    root.style.setProperty("--color-gold-300", theme.colorGoldHover);
    root.style.setProperty("--color-heading", theme.colorHeading);
    root.style.setProperty("--color-text-gray", theme.colorText);
    root.style.setProperty("--color-border", theme.colorBorder);
    root.style.setProperty("--radius-card", theme.cardRadius);
    root.style.setProperty("--radius-pill", theme.buttonRadius);
    // Fonts
    root.style.setProperty("--font-heading", `'${theme.fontHeading}', 'Cormorant Garamond', serif`);
    root.style.setProperty("--font-body", `'${theme.fontBody}', system-ui, sans-serif`);
    root.style.setProperty("--font-mono", `'${theme.fontMono}', monospace`);
    // Dark mode
    if (theme.darkMode) {
      root.classList.add("wp-dark-mode");
    } else {
      root.classList.remove("wp-dark-mode");
    }
  }, [theme]);

  return {
    theme,
    setTheme: update,
    resetTheme: () => {
      localStorage.removeItem(STORAGE_KEY);
      setTheme(defaultTheme);
    },
    exportTheme: () => JSON.stringify(theme, null, 2),
    importTheme: (json: string) => {
      try {
        const parsed = JSON.parse(json);
        save(parsed);
        setTheme(parsed);
      } catch (e) {
        alert("Invalid JSON");
      }
    },
    FONT_OPTIONS,
    defaultTheme,
  };
}

export type ThemeApi = ReturnType<typeof useTheme>;
