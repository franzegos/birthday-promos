import { describe, expect, it } from "vitest";
import {
  formatBranchList,
  formatEstimatedValue,
  formatRequirementItems,
  formatTimingSummary,
  formatWhatYoullGetItems,
  getPromoDetailSections,
} from "@/lib/promos/formatPromoDetails";
import { allPromos } from "@/lib/promos/promoData";
import type { BirthdayPromo } from "@/lib/promos/promo.types";

const bakebePromo: BirthdayPromo = {
  brand: "Bakebe PH",
  category: "Food",
  niche: "Bakery/Experience",
  offer: "Free DIY co-baking session for celebrant",
  offerValuePhpEst: "~799+",
  exactBirthday: "No",
  birthMonth: "Yes",
  otherValidityPeriod: "Birth month; not valid weekends/holidays",
  requiredCompanions: "1 paying companion (covers full project fee)",
  minimumSpendPhp: "Companion pays project fee",
  membershipRequired: "No",
  appRequired: "Yes (Bakebe app)",
  cardRequired: "No",
  idRequirement: "Valid ID with birthdate",
  reservationRequired: "Yes",
  participatingBranches: "SM Aura Taguig; S Maison Pasay",
  locationRegion: "Metro Manila",
  blackoutDates: "Weekends and holidays excluded",
  promoValidityEnd: "Ongoing",
  officialSourceUrl: "https://www.facebook.com/bakebe_ph",
  otherSources: "Over Here Manila; The Smart Local (2024)",
  sourceType: "Official + Editorial",
  verificationStatus: "Verified Active",
  lastChecked: "2026-09-10",
  notes: "Celebrant fee waived; companion pays. One shared project.",
};

describe("formatPromoDetails", () => {
  it("formats timing in plain language", () => {
    expect(formatTimingSummary(bakebePromo)).toEqual([
      "Any day during your birth month",
      "Not valid weekends/holidays",
      "No published end date",
    ]);
  });

  it("formats requirements without empty no-values", () => {
    const items = formatRequirementItems(bakebePromo);
    expect(items).toContain(
      "Bring 1 paying companion (covers full project fee)",
    );
    expect(items).toContain("Bakebe app required");
    expect(items).not.toContain("Membership required");
  });

  it("formats branch lists into separate locations", () => {
    expect(formatBranchList(bakebePromo.participatingBranches)).toEqual([
      "SM Aura Taguig",
      "S Maison Pasay",
    ]);
  });

  it("formats estimated value with peso formatting", () => {
    expect(formatEstimatedValue("~799+")).toBe("From ₱799+");
  });

  it("builds user-facing sections without raw field labels", () => {
    const sections = getPromoDetailSections(bakebePromo);

    expect(sections.map((section) => section.title)).toEqual([
      "What you'll get",
      "When you can use this",
      "Requirements",
      "Where to redeem",
    ]);
    expect(
      sections.find((section) => section.id === "benefits")?.items,
    ).toEqual([
      "Free DIY co-baking session for celebrant",
      "Worth ₱799+",
      "Celebrant fee waived",
    ]);
  });

  it("moves card lists from notes into requirements", () => {
    const promo: BirthdayPromo = {
      ...bakebePromo,
      cardRequired: "Yes",
      notes: "Cards: World Elite, Platinum, HOPE, Gold Mastercard.",
    };

    const requirements = formatRequirementItems(promo);
    expect(requirements).toContain(
      "Eligible cards: World Elite, Platinum, HOPE, Gold Mastercard",
    );
    expect(requirements).not.toContain("Card: Yes");

    const sections = getPromoDetailSections(promo);
    const benefits =
      sections.find((section) => section.id === "benefits")?.items ?? [];
    expect(benefits.some((item) => /eligible cards/i.test(item))).toBe(false);
  });

  it("drops source-attribution and redundant timing notes", () => {
    const mistoPromo: BirthdayPromo = {
      ...bakebePromo,
      brand: "Misto at Seda Vertis North",
      otherValidityPeriod: "Birth month; lunch 12-2:30PM, dinner 6-10PM",
      blackoutDates: "Unknown",
      promoValidityEnd: "2026-09-30",
      notes: "Promo until Sep 30, 2026 — confirm if extended.",
    };

    expect(formatTimingSummary(mistoPromo)).toEqual([
      "Any day during your birth month",
      "Lunch 12 PM – 2:30 PM, dinner 6 PM – 10 PM",
      "Until September 30, 2026",
    ]);
    const mistoBenefits = getPromoDetailSections(mistoPromo).find(
      (s) => s.id === "benefits",
    )?.items;
    expect(mistoBenefits?.[0]).toBe("Free DIY co-baking session for celebrant");
    expect(mistoBenefits).not.toContain(
      "Promo until Sep 30, 2026 — confirm if extended",
    );

    const redditPromo: BirthdayPromo = {
      ...bakebePromo,
      notes: "From u/ME_KoreanVisa Reddit Excel sheet transcription.",
    };
    expect(
      getPromoDetailSections(redditPromo).find((s) => s.id === "benefits")
        ?.items,
    ).toEqual(["Free DIY co-baking session for celebrant", "Worth ₱799+"]);

    const ekPromo: BirthdayPromo = {
      ...bakebePromo,
      brand: "Enchanted Kingdom",
      offer: "Free regular day pass",
      offerValuePhpEst: "1100",
      otherValidityPeriod: "Walk-in ticket booth only; Sta. Rosa Laguna",
      participatingBranches: "Sta. Rosa, Laguna ticket booths",
      notes:
        "Companions get 10% off Regular Day Pass (up to 10). Not for Junior/Senior/PWD/EKspress. 5% food discount at Amazon Grill and Launch Time.",
    };

    const ekSections = getPromoDetailSections(ekPromo);
    expect(formatTimingSummary(ekPromo)).toEqual([
      "Any day during your birth month",
      "Not available: Weekends and holidays excluded",
      "No published end date",
    ]);
    expect(formatBranchList(ekPromo.participatingBranches)).toEqual([
      "Sta. Rosa, Laguna ticket booths",
    ]);
    expect(
      ekSections.find((section) => section.id === "requirements")?.items,
    ).toContain("Walk-in ticket booth only");
    expect(
      ekSections.find((section) => section.id === "benefits")?.items,
    ).toEqual([
      "Free regular day pass",
      "Worth ₱1,100",
      "Companions get 10% off Regular Day Pass (up to 10)",
      "Not for Junior/Senior/PWD/EKspress",
      "5% food discount at Amazon Grill and Launch Time",
    ]);

    const companionPromo: BirthdayPromo = {
      ...bakebePromo,
      requiredCompanions: "4 paying guests at P1588 nett each",
    };
    expect(formatRequirementItems(companionPromo)).toContain(
      "Bring 4 paying guests at ₱1,588 net each",
    );

    const cafeFrancePromo: BirthdayPromo = {
      ...bakebePromo,
      brand: "Cafe France",
      offer: "1 FREE Cake Solo of the Day",
      offerValuePhpEst: "~150-250",
      otherValidityPeriod: "On birthday or anytime during birth month",
      exactBirthday: "Yes",
      blackoutDates: "Unknown",
      minimumSpendPhp: "800",
      participatingBranches: "Multiple branches",
      locationRegion: "Nationwide",
      notes:
        "Min P800 single receipt. Some sources cite P300 GC — verify in-store.",
    };

    expect(formatTimingSummary(cafeFrancePromo)).toEqual([
      "On your exact birthday, or any day during your birth month",
      "No published end date",
    ]);
    expect(
      getPromoDetailSections(cafeFrancePromo).find((s) => s.id === "benefits")
        ?.items,
    ).toEqual(["1 FREE Cake Solo of the Day", "Worth ₱150 – ₱250"]);
    expect(formatRequirementItems(cafeFrancePromo)).toContain(
      "Spend note: ₱800",
    );
  });

  it("avoids redundant exact-birthday and end-date timing lines", () => {
    const barenaked = allPromos.find((promo) => promo.brand === "Barenaked");
    const mitchSalon = allPromos.find((promo) => promo.brand === "Mitch Salon");

    expect(formatTimingSummary(barenaked!)).toEqual([
      "On your exact birthday only",
      "No published end date",
    ]);
    expect(formatTimingSummary(mitchSalon!)).toEqual([
      "On your exact birthday only",
      "Until September 15, 2026",
    ]);
  });

  it("keeps distinct timing bullets across all promos", () => {
    for (const promo of allPromos) {
      const items = formatTimingSummary(promo);
      const lower = items.map((item) => item.toLowerCase());

      expect(new Set(lower).size).toBe(lower.length);

      if (lower.some((item) => /on your exact birthday/i.test(item))) {
        expect(lower.filter((item) => item === "exact birthday")).toHaveLength(
          0,
        );
      }

      const untilLines = items.filter((item) => /^until /i.test(item));
      expect(untilLines.length).toBeLessThanOrEqual(1);

      const endDateMentions = items.filter((item) =>
        /promo (?:posted through|end)\b/i.test(item),
      );
      if (untilLines.length === 1) {
        expect(endDateMentions).toHaveLength(0);
      }
    }
  });

  it("avoids redundant percentage and worth lines in benefits", () => {
    const barenaked = allPromos.find((promo) => promo.brand === "Barenaked");
    const dermcare = allPromos.find((promo) => promo.brand === "Dermcare");
    const layBare = allPromos.find(
      (promo) => promo.brand === "Lay Bare (Laybare)",
    );

    expect(formatWhatYoullGetItems(barenaked!)).toEqual([
      "50% off birthday promo",
    ]);
    expect(formatWhatYoullGetItems(dermcare!)).toEqual([
      "30% off birthday promo",
    ]);
    expect(formatWhatYoullGetItems(layBare!)).toEqual([
      "15% off birthday promo",
    ]);
  });

  it("rewrites companion-heavy offers into celebrant-focused benefits", () => {
    const mitchSalon = allPromos.find((promo) => promo.brand === "Mitch Salon");
    const tala = allPromos.find((promo) =>
      promo.brand.startsWith("Tala by Kyla"),
    );
    const greenhills = allPromos.find(
      (promo) => promo.brand === "Greenhills Wellness",
    );

    expect(formatWhatYoullGetItems(mitchSalon!)).toEqual([
      "Free service for the birthday celebrant",
    ]);
    expect(formatWhatYoullGetItems(tala!)).toEqual(["Birthday gift"]);
    expect(formatWhatYoullGetItems(greenhills!)).toEqual([
      "Free service upgrade",
    ]);
  });

  it("keeps distinct benefit bullets across all promos", () => {
    for (const promo of allPromos) {
      const items = formatWhatYoullGetItems(promo);
      const normalized = items.map((item) => item.toLowerCase());

      expect(new Set(normalized).size).toBe(normalized.length);

      const percentOnly = items.filter((item) =>
        /^\d+%\s*off$/i.test(item.replace(/^worth\s+/i, "")),
      );
      const percentOffers = items.filter((item) => /%/.test(item));
      if (percentOffers.length > 0) {
        expect(percentOnly).toHaveLength(0);
        expect(items.some((item) => /^worth\s+\d+%/i.test(item))).toBe(false);
      }
    }
  });
});
