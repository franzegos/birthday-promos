import type { Coordinates } from "@/lib/location/distance";
import { getPromoDistanceKm } from "./getPromoDistance";
import { scorePromoRelevance, type TripContext } from "./scorePromoRelevance";
import type { BirthdayPromo } from "./promo.types";

export type PromoSort =
  | "brand-asc"
  | "brand-desc"
  | "value-desc"
  | "category-asc"
  | "verified-first"
  | "nearest"
  | "suggested";

function parseEstimatedValue(value: string | null): number {
  if (!value) return 0;
  const match = value.replace(/,/g, "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function isVerified(promo: BirthdayPromo): boolean {
  return promo.verificationStatus?.toLowerCase().includes("verified") ?? false;
}

type SortContext = {
  userCoords?: Coordinates | null;
  trip?: TripContext | null;
  regionCoordsByRegion?: Map<string, Coordinates[]>;
};

export function sortPromos(
  promos: BirthdayPromo[],
  sort: PromoSort,
  context: SortContext = {},
): BirthdayPromo[] {
  const next = [...promos];
  const userCoords = context.userCoords ?? context.trip?.coords ?? null;

  switch (sort) {
    case "brand-asc":
      return next.sort((a, b) => a.brand.localeCompare(b.brand));
    case "brand-desc":
      return next.sort((a, b) => b.brand.localeCompare(a.brand));
    case "value-desc":
      return next.sort(
        (a, b) =>
          parseEstimatedValue(b.offerValuePhpEst) -
          parseEstimatedValue(a.offerValuePhpEst),
      );
    case "category-asc":
      return next.sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        return categoryCompare !== 0
          ? categoryCompare
          : a.brand.localeCompare(b.brand);
      });
    case "verified-first":
      return next.sort((a, b) => {
        const verifiedCompare = Number(isVerified(b)) - Number(isVerified(a));
        return verifiedCompare !== 0
          ? verifiedCompare
          : a.brand.localeCompare(b.brand);
      });
    case "nearest":
      if (!userCoords) return next;
      return next.sort((a, b) => {
        const distanceCompare =
          getPromoDistanceKm(a, userCoords, context.regionCoordsByRegion) -
          getPromoDistanceKm(b, userCoords, context.regionCoordsByRegion);
        return distanceCompare !== 0
          ? distanceCompare
          : a.brand.localeCompare(b.brand);
      });
    case "suggested":
      if (!context.trip) return next;
      return next.sort((a, b) => {
        const scoreCompare =
          scorePromoRelevance(b, context.trip!, {
            regionCoordsByRegion: context.regionCoordsByRegion,
          }) -
          scorePromoRelevance(a, context.trip!, {
            regionCoordsByRegion: context.regionCoordsByRegion,
          });
        return scoreCompare !== 0
          ? scoreCompare
          : a.brand.localeCompare(b.brand);
      });
    default:
      return next;
  }
}

export function getPromoSortOptions(
  hasLocation: boolean,
): Array<{ value: PromoSort; label: string }> {
  const options: Array<{ value: PromoSort; label: string }> = [];

  if (hasLocation) {
    options.push({ value: "nearest", label: "Nearest" });
  }

  options.push(
    { value: "verified-first", label: "Verified first" },
    { value: "brand-asc", label: "Brand A–Z" },
    { value: "brand-desc", label: "Brand Z–A" },
    { value: "value-desc", label: "Highest value" },
    { value: "category-asc", label: "Category" },
  );

  return options;
}

export const promoSortOptions: Array<{ value: PromoSort; label: string }> =
  getPromoSortOptions(false);
