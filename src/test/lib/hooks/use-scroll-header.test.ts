import { describe, expect, it } from "vitest";
import { getHeaderVisibility } from "@/lib/hooks/use-scroll-header";

describe("getHeaderVisibility", () => {
  it("stays visible near the top of the page", () => {
    expect(getHeaderVisibility(0, 0, true)).toBe(true);
    expect(getHeaderVisibility(12, 8, false)).toBe(true);
  });

  it("hides when scrolling down", () => {
    expect(getHeaderVisibility(120, 100, true)).toBe(false);
  });

  it("shows again when scrolling up", () => {
    expect(getHeaderVisibility(180, 200, false)).toBe(true);
  });

  it("keeps the current state for small scroll deltas", () => {
    expect(getHeaderVisibility(100, 102, true)).toBe(true);
    expect(getHeaderVisibility(100, 98, false)).toBe(false);
  });
});
