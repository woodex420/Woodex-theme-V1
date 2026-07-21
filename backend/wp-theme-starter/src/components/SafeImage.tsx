// SafeImage - Renders an image with graceful fallback if missing
// Uses SVG placeholders for known service images and a generic placeholder for others

import { useState, useEffect } from "react";
import { cn } from "../utils/cn";

const FALLBACK_MAP: Record<string, string> = {
  "/images/services/cafe.jpg": "/images/services/cafe.svg",
  "/images/services/restaurant.jpg": "/images/services/restaurant.svg",
  "/images/services/3d.jpg": "/images/services/3d.svg",
  "/images/services/residential.jpg": "/images/services/residential.svg",
  "/images/services/commercial.jpg": "/images/services/commercial.svg",
  "/images/services/hospitality.jpg": "/images/services/hospitality.svg",
  "/images/team/elena.jpg": "/images/team/elena.svg",
};

function generatePlaceholder(label: string): string {
  const colors: Record<string, [string, string]> = {
    cafe: ["#3a2a1a", "#c6a15b"],
    restaurant: ["#211C18", "#c6a15b"],
    "3d": ["#1a1612", "#c6a15b"],
    residential: ["#f6f1e7", "#211C18"],
    commercial: ["#e8e0d0", "#c6a15b"],
    hospitality: ["#f6f1e7", "#211C18"],
    default: ["#211C18", "#c6a15b"],
  };
  const key = Object.keys(colors).find((k) => label.toLowerCase().includes(k)) || "default";
  const [bg, accent] = colors[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="${bg}" stop-opacity="0.7"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    <text x="400" y="320" text-anchor="middle" font-family="serif" font-size="48" fill="${accent}" opacity="0.5">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function SafeImage({
  src,
  alt,
  className,
  label,
  ...rest
}: {
  src: string;
  alt?: string;
  className?: string;
  label?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">) {
  const [actualSrc, setActualSrc] = useState(src);
  const [errored, setErrored] = useState(false);
  const [attemptedFallbacks, setAttemptedFallbacks] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActualSrc(src);
    setErrored(false);
    setAttemptedFallbacks(new Set());
  }, [src]);

  const handleError = () => {
    if (errored) {
      // Final fallback: generated placeholder
      setActualSrc(generatePlaceholder(label || alt || "Image"));
      return;
    }
    // Try mapped fallback (e.g. jpg → svg)
    const mapped = FALLBACK_MAP[src];
    if (mapped && !attemptedFallbacks.has(mapped)) {
      const newSet = new Set(attemptedFallbacks);
      newSet.add(mapped);
      setAttemptedFallbacks(newSet);
      setActualSrc(mapped);
      return;
    }
    setErrored(true);
    setActualSrc(generatePlaceholder(label || alt || "Image"));
  };

  return (
    <img
      src={actualSrc}
      alt={alt || ""}
      className={cn("object-cover bg-stone-100", className)}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
}
