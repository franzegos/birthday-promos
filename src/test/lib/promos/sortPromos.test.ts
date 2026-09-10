import { describe, expect, it } from "vitest";
import { sortPromos } from "@/lib/promos/sortPromos";
import type { BirthdayPromo } from "@/lib/promos/promo.types";

const promos: BirthdayPromo[] = [
  {
    brand: "Zeta Cafe",
    category: "Food",
    niche: null,
    offer: null,
    offerValuePhpEst: "~500",
    exactBirthday: null,
    birthMonth: null,
    otherValidityPeriod: null,
    requiredCompanions: null,
    minimumSpendPhp: null,
    membershipRequired: null,
    appRequired: null,
    cardRequired: null,
    idRequirement: null,
    reservationRequired: null,
    participatingBranches: null,
    locationRegion: null,
    blackoutDates: null,
    promoValidityEnd: null,
    officialSourceUrl: null,
    otherSources: null,
    sourceType: null,
    verificationStatus: "Needs Verify",
    lastChecked: null,
    notes: null,
  },
  {
    brand: "Alpha Buffet",
    category: "Food",
    niche: null,
    offer: null,
    offerValuePhpEst: "~1500",
    exactBirthday: null,
    birthMonth: null,
    otherValidityPeriod: null,
    requiredCompanions: null,
    minimumSpendPhp: null,
    membershipRequired: null,
    appRequired: null,
    cardRequired: null,
    idRequirement: null,
    reservationRequired: null,
    participatingBranches: null,
    locationRegion: null,
    blackoutDates: null,
    promoValidityEnd: null,
    officialSourceUrl: null,
    otherSources: null,
    sourceType: null,
    verificationStatus: "Verified Active",
    lastChecked: null,
    notes: null,
  },
];

describe("sortPromos", () => {
  it("sorts by brand ascending", () => {
    expect(sortPromos(promos, "brand-asc").map((promo) => promo.brand)).toEqual(
      ["Alpha Buffet", "Zeta Cafe"],
    );
  });

  it("sorts by estimated value descending", () => {
    expect(
      sortPromos(promos, "value-desc").map((promo) => promo.brand),
    ).toEqual(["Alpha Buffet", "Zeta Cafe"]);
  });

  it("sorts verified promos first", () => {
    expect(
      sortPromos(promos, "verified-first").map((promo) => promo.brand),
    ).toEqual(["Alpha Buffet", "Zeta Cafe"]);
  });
});
