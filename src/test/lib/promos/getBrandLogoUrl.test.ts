import { describe, expect, it } from "vitest";
import {
  extractDomainFromUrl,
  getBrandInitials,
  getBrandLogoCandidates,
} from "@/lib/promos/getBrandLogoUrl";

describe("getBrandLogoUrl", () => {
  it("extracts domain from official website URLs", () => {
    expect(extractDomainFromUrl("https://www.vikings.ph/vikingsph")).toBe(
      "vikings.ph",
    );
  });

  it("skips social media URLs", () => {
    expect(
      extractDomainFromUrl("https://www.facebook.com/niubyvikings"),
    ).toBeNull();
  });

  it("builds logo candidates from domain", () => {
    expect(
      getBrandLogoCandidates(
        "Vikings Luxury Buffet",
        "https://www.vikings.ph/vikingsph",
      ),
    ).toEqual(
      expect.arrayContaining([
        "https://www.vikings.ph/apple-touch-icon.png",
        "https://www.google.com/s2/favicons?domain=vikings.ph&sz=128",
      ]),
    );
  });

  it("uses brand overrides for SM promos", () => {
    expect(
      getBrandLogoCandidates(
        "Dohtonbori",
        "https://www.smsupermalls.com/promo",
      )[0],
    ).toContain("SM_Supermalls_Logo");
  });

  it("creates brand initials", () => {
    expect(getBrandInitials("Vikings Luxury Buffet")).toBe("VL");
  });

  it("uses website hints when the official URL is social-only", () => {
    expect(
      getBrandLogoCandidates(
        "Lan Hot Pot",
        "https://www.facebook.com/lanhotpot",
      ),
    ).toContain(
      "https://www.google.com/s2/favicons?domain=lanhotpot.ph&sz=128",
    );
  });
});
