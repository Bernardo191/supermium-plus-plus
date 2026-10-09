import { describe, it, expect } from "vitest";
import { autoSeparatorHsl, resolveSeparatorHsl } from "@/lib/chrome-colors";
import { loadSettings, usesAeroGlass, usesVistaControls } from "@/lib/settings-store";
import { shouldHideToolbarLeftFoot } from "@/components/browser/Toolbar";
import { logoForTheme } from "@/lib/theme-logo";
import glossyLogo from "@/assets/aether-logo-2010.png.asset.json";
import flatLogo from "@/assets/aether-logo-2016.png.asset.json";
import modernLogo from "@/assets/aether-logo.png.asset.json";

describe("theme logo selection", () => {
  it("uses the glossy upload for 2010", () => {
    expect(logoForTheme("legacy-2010")).toBe(glossyLogo.url);
  });
  it.each(["legacy-2016", "legacy-2018", "legacy-2021"] as const)("uses the second upload for %s", (theme) => {
    expect(logoForTheme(theme)).toBe(flatLogo.url);
  });
  it("preserves Modern's logo", () => {
    expect(logoForTheme("modern")).toBe(modernLogo.url);
  });
});

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("legacy Aero preferences", () => {
  it("persists a disabled Aero glass preference", () => {
    localStorage.setItem("ae_settings", JSON.stringify({ theme: "legacy-2010", aeroGlass: false }));
    expect(usesAeroGlass(loadSettings())).toBe(false);
    localStorage.removeItem("ae_settings");
  });
  it("applies enabled Aero only to 2010 and 2016", () => {
    const settings = loadSettings();
    expect(usesAeroGlass({ ...settings, theme: "legacy-2010", aeroGlass: true })).toBe(true);
    expect(usesAeroGlass({ ...settings, theme: "legacy-2016", aeroGlass: true })).toBe(true);
    expect(usesAeroGlass({ ...settings, theme: "modern", aeroGlass: true })).toBe(false);
  });
  it("uses Vista controls only for enabled Windows controls in 2010", () => {
    const settings = { ...loadSettings(), windowControls: true, windowControlsStyle: "windows" as const };
    expect(usesVistaControls({ ...settings, theme: "legacy-2010" })).toBe(true);
    expect(usesVistaControls({ ...settings, theme: "legacy-2016" })).toBe(false);
    expect(usesVistaControls({ ...settings, theme: "legacy-2010", windowControlsStyle: "macos" })).toBe(false);
    expect(usesVistaControls({ ...settings, theme: "legacy-2010", windowControls: false })).toBe(false);
  });
});

describe("automatic tab separator color", () => {
  it("enables automatic coloring by default", () => {
    localStorage.removeItem("ae_settings");
    localStorage.removeItem("nb_settings");
    expect(loadSettings().separatorAutoColor).toBe(true);
  });
  it("preserves an explicit choice to disable automatic coloring", () => {
    localStorage.setItem("ae_settings", JSON.stringify({ separatorAutoColor: false }));
    expect(loadSettings().separatorAutoColor).toBe(false);
    localStorage.removeItem("ae_settings");
  });

  it("uses the chosen color when automatic coloring is off", () => {
    expect(resolveSeparatorHsl("#ff0000", false, "0 0% 10%")).toBe("0 100% 50%");
  });

  it("uses automatic contrast instead of the custom color when enabled", () => {
    expect(resolveSeparatorHsl("#ff0000", true, "0 0% 10%")).toBe("0 0% 100%");
    expect(resolveSeparatorHsl("#ff0000", true, "0 0% 90%")).toBe("0 0% 0%");
  });

  it("preserves the theme default when no custom color or automatic mode is selected", () => {
    expect(resolveSeparatorHsl("", false, "0 0% 10%")).toBeNull();
  });
  it("uses a light separator on a dark tab strip", () => {
    expect(autoSeparatorHsl("#182033")).toBe("0 0% 100%");
  });

  it("uses a dark separator on a light tab strip", () => {
    expect(autoSeparatorHsl("#e4e7ec")).toBe("0 0% 0%");
  });
});

describe("Modern toolbar left foot", () => {
  it("keeps the left foot when a workspace button precedes the first tab", () => {
    expect(shouldHideToolbarLeftFoot("modern", "right", true)).toBe(false);
    expect(shouldHideToolbarLeftFoot("modern", "disabled", true)).toBe(false);
  });

  it("keeps the left foot when macOS window controls precede the first tab", () => {
    expect(shouldHideToolbarLeftFoot("modern", "right", true)).toBe(false);
  });

  it("hides the left foot when tab search is on the right", () => {
    expect(shouldHideToolbarLeftFoot("modern", "right")).toBe(true);
  });

  it("hides the left foot when tab search is disabled", () => {
    expect(shouldHideToolbarLeftFoot("modern", "disabled")).toBe(true);
  });

  it("keeps the left foot when tab search is on the left", () => {
    expect(shouldHideToolbarLeftFoot("modern", "left")).toBe(false);
  });
});
