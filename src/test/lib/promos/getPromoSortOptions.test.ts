import { describe, expect, it } from "vitest";
import { getPromoSortOptions } from "@/lib/promos/sortPromos";

describe("getPromoSortOptions", () => {
  it("includes nearest when location is available", () => {
    const options = getPromoSortOptions(true);
    expect(options.some((option) => option.value === "nearest")).toBe(true);
  });

  it("does not include suggested sort", () => {
    const options = getPromoSortOptions(true);
    expect(options.some((option) => option.value === "suggested")).toBe(false);
  });
});
