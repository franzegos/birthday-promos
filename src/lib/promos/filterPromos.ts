import type { BirthdayPromo, PromoFilters } from "./promo.types";

function matchesQuery(promo: BirthdayPromo, query: string): boolean {
  if (!query) return true;

  const haystack = [
    promo.brand,
    promo.category,
    promo.niche,
    promo.offer,
    promo.locationRegion,
    promo.participatingBranches,
    promo.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function filterPromos(
  promos: BirthdayPromo[],
  filters: PromoFilters,
): BirthdayPromo[] {
  return promos.filter((promo) => {
    if (filters.category && promo.category !== filters.category) return false;
    if (
      filters.verificationStatus &&
      promo.verificationStatus !== filters.verificationStatus
    ) {
      return false;
    }
    return matchesQuery(promo, filters.query);
  });
}
