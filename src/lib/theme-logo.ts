import modernLogo from "@/assets/aether-logo.png.asset.json";
import glossyLogo from "@/assets/aether-logo-2010.png.asset.json";
import flatLogo from "@/assets/aether-logo-2016.png.asset.json";
import type { ChromeTheme } from "./settings-store";

export const logoForTheme = (theme: ChromeTheme): string => {
  if (theme === "legacy-2010") return glossyLogo.url;
  if (theme !== "modern") return flatLogo.url;
  return modernLogo.url;
};