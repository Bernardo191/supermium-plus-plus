import { describe, it, expect } from "vitest";
import { autoSeparatorHsl, resolveSeparatorHsl } from "@/lib/chrome-colors";
import { loadSettings } from "@/lib/settings-store";
import { shouldHideToolbarLeftFoot } from "@/components/browser/Toolbar";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("automatic tab separator color", () => {
  it("disables automatic coloring by default", () => {
    localStorage.removeItem("ae_settings");
    localStorage.removeItem("nb_settings");
    expect(loadSettings().separatorAutoColor).toBe(false);
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
