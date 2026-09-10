import { describe, expect, it } from "vitest";
import { filterPromos } from "@/lib/promos/filterPromos";
import type { BirthdayPromo } from "@/lib/promos/promo.types";

const samplePromos: BirthdayPromo[] = [
  {
    brand: "Vikings Luxury Buffet",
    category: "Food",
    niche: "Buffet",
    offer: "Free luxury buffet for celebrant",
    offerValuePhpEst: "~988-1500",
    exactBirthday: "Yes",
    birthMonth: "Yes",
    otherValidityPeriod: null,
    requiredCompanions: "1",
    minimumSpendPhp: null,
    membershipRequired: "No",
    appRequired: "No",
    cardRequired: "No",
    idRequirement: null,
    reservationRequired: "No",
    participatingBranches: null,
    locationRegion: "Nationwide",
    blackoutDates: null,
    promoValidityEnd: "2026-12-31",
    officialSourceUrl: "https://example.com",
    otherSources: null,
    sourceType: "Official",
    verificationStatus: "Verified Active",
    lastChecked: "2026-09-10",
    notes: null,
  },
  {
    brand: "Theme Park",
    category: "Activities",
    niche: "Theme Park",
    offer: "Free entry",
    offerValuePhpEst: null,
    exactBirthday: "Yes",
    birthMonth: "No",
    otherValidityPeriod: null,
    requiredCompanions: null,
    minimumSpendPhp: null,
    membershipRequired: "No",
    appRequired: "No",
    cardRequired: "No",
    idRequirement: null,
    reservationRequired: "No",
    participatingBranches: null,
    locationRegion: "Laguna",
    blackoutDates: null,
    promoValidityEnd: null,
    officialSourceUrl: null,
    otherSources: null,
    sourceType: null,
    verificationStatus: "Needs Verify",
    lastChecked: null,
    notes: null,
  },
];

describe("filterPromos", () => {
  it("returns all promos with empty filters", () => {
    expect(
      filterPromos(samplePromos, {
        query: "",
        category: "",
        verificationStatus: "",
      }),
    ).toHaveLength(2);
  });

  it("filters by category and query", () => {
    const result = filterPromos(samplePromos, {
      query: "vikings",
      category: "Food",
      verificationStatus: "",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.brand).toBe("Vikings Luxury Buffet");
  });

  it("filters by verification status", () => {
    const result = filterPromos(samplePromos, {
      query: "",
      category: "",
      verificationStatus: "Needs Verify",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.brand).toBe("Theme Park");
  });
});
