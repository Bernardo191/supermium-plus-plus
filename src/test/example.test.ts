import { describe, it, expect } from "vitest";
import { autoSeparatorHsl } from "@/lib/chrome-colors";

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
