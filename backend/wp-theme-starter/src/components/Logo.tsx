// Custom-designed WP Interior logo with monogram and wordmark.
// Designed for legibility on both light and dark backgrounds.

import { cn } from "../utils/cn";

export function Logo({
  variant = "default",
  size = "md",
  className,
  monochrome = false,
}: {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  monochrome?: boolean;
}) {
  const sizes = {
    sm: { monogram: 36, fontSize: "text-sm", sub: "text-[8px]", gap: "gap-2.5" },
    md: { monogram: 44, fontSize: "text-base", sub: "text-[9px]", gap: "gap-3" },
    lg: { monogram: 60, fontSize: "text-2xl", sub: "text-[10px]", gap: "gap-4" },
    xl: { monogram: 80, fontSize: "text-3xl", sub: "text-xs", gap: "gap-4" },
  } as const;
  const s = sizes[size];

  const textColor = variant === "light" ? "#F6F1E7" : "#2A241F";
  const subColor = variant === "light" ? "rgba(246,241,231,0.7)" : "#9A8F86";

  return (
    <div className={cn("flex items-center group", s.gap, className)}>
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-[8deg]"
        style={{
          width: s.monogram,
          height: s.monogram,
          background: variant === "light" && !monochrome
            ? `radial-gradient(circle at 30% 30%, #E8D4AC, #C6A15B 60%, #A8854A)`
            : variant === "dark" && !monochrome
            ? `radial-gradient(circle at 30% 30%, #3a302a, #211C18 60%, #1a1410)`
            : monochrome
            ? "transparent"
            : `radial-gradient(circle at 30% 30%, #2A241F, #211C18 60%, #1a1410)`,
          boxShadow:
            variant === "light" && !monochrome
              ? "0 4px 16px rgba(198,161,91,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
              : !monochrome
              ? "0 4px 16px rgba(33,28,24,0.18), inset 0 1px 0 rgba(198,161,91,0.15)"
              : "none",
          border: monochrome
            ? `2px solid ${variant === "light" ? "#F6F1E7" : "#211C18"}`
            : "none",
        }}
      >
        {/* Stylized monogram: W with crown dot */}
        <svg
          viewBox="0 0 64 64"
          className="w-[60%] h-[60%]"
          fill="none"
          stroke={monochrome ? (variant === "light" ? "#F6F1E7" : "#211C18") : variant === "light" ? "#211C18" : "#C6A15B"}
          strokeWidth="1.6"
        >
          <path
            d="M10 22 L18 46 L26 30 L32 46 L38 30 L46 46 L54 22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="16" r="2" fill={monochrome ? (variant === "light" ? "#F6F1E7" : "#211C18") : variant === "light" ? "#211C18" : "#C6A15B"} stroke="none" />
        </svg>
        {!monochrome && (
          <div
            className="absolute inset-0 rounded-full border transition-colors duration-500"
            style={{ borderColor: variant === "light" ? "rgba(33,28,24,0.2)" : "rgba(198,161,91,0.35)" }}
          />
        )}
      </div>
      <div className="leading-none">
        <div
          className={cn("font-serif font-medium tracking-tight", s.fontSize)}
          style={{ color: textColor }}
        >
          WP Interior
        </div>
        <div
          className={cn("tracking-[0.3em] uppercase mt-1.5 font-medium", s.sub)}
          style={{ color: subColor }}
        >
          Design Studio
        </div>
      </div>
    </div>
  );
}
