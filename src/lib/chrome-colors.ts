// Helpers for user-chosen toolbar / tab strip colors.

export const RAINBOW = "rainbow";

/** Convert a #rrggbb (or #rgb) hex color to a Tailwind-friendly "H S% L%" string. */
export const hexToHslVar = (hex: string): string | null => {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
  }
  return `${Math.round(hue)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

/** Perceived lightness of a hex color, 0..1. */
export const hexLuminance = (hex: string): number => {
  const hsl = hexToHslVar(hex);
  if (!hsl) return 1;
  return parseInt(hsl.split(" ")[2]) / 100;
};
