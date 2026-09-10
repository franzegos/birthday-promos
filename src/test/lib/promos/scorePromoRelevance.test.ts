import { describe, expect, it } from "vitest";
import { scorePromoRelevance } from "@/lib/promos/scorePromoRelevance";
import type { BirthdayPromo } from "@/lib/promos/promo.types";

const basePromo: BirthdayPromo = {
  brand: "Test Promo",
  category: "Food",
  niche: null,
  offer: "Lunch buffet",
  offerValuePhpEst: "~500",
  exactBirthday: "Yes",
  birthMonth: "Yes",
  otherValidityPeriod: null,
  requiredCompanions: null,
  minimumSpendPhp: null,
  membershipRequired: null,
  appRequired: null,
  cardRequired: null,
  idRequirement: null,
  reservationRequired: null,
  participatingBranches: "SM Megamall, Mandaluyong",
  locationRegion: "Metro Manila",
  blackoutDates: null,
  promoValidityEnd: null,
  officialSourceUrl: null,
  otherSources: null,
  sourceType: null,
  verificationStatus: "Verified Active",
  lastChecked: null,
  notes: "Lunch and dinner available",
};

describe("scorePromoRelevance", () => {
  it("scores nearby verified promos higher", () => {
    const regionCoordsByRegion = new Map([
      ["Metro Manila", [{ lat: 14.5995, lng: 121.0369 }]],
    ]);

    const makatiScore = scorePromoRelevance(
      basePromo,
      {
        placeLabel: "Makati",
        coords: { lat: 14.5547, lng: 121.0244 },
        visitDate: "2026-03-15",
        visitTime: "12:30",
      },
      { regionCoordsByRegion },
    );

    const davaoScore = scorePromoRelevance(
      basePromo,
      {
        placeLabel: "Davao City",
        coords: { lat: 7.1907, lng: 125.4553 },
        visitDate: "2026-03-15",
        visitTime: "12:30",
      },
      { regionCoordsByRegion },
    );

    expect(makatiScore).toBeGreaterThan(davaoScore);
  });
});
