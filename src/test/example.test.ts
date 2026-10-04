import { describe, it, expect } from "vitest";
import { autoSeparatorHsl } from "@/lib/chrome-colors";
import { shouldHideToolbarLeftFoot } from "@/components/browser/Toolbar";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("automatic tab separator color", () => {
  it("uses a light separator on a dark tab strip", () => {
    expect(autoSeparatorHsl("#182033")).toBe("0 0% 100%");
  });

  it("uses a dark separator on a light tab strip", () => {
    expect(autoSeparatorHsl("#e4e7ec")).toBe("0 0% 0%");
  });
});

describe("Modern toolbar left foot", () => {
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
