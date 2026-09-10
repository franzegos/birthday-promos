import promosDatabase from "@/data/birthday-promos.json";
import type { BirthdayPromo, BirthdayPromosDatabase } from "./promo.types";

const database = promosDatabase as BirthdayPromosDatabase;

export const promoMeta = database.meta;
export const allPromos: BirthdayPromo[] = database.promos;

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ].sort();
}

const CATEGORY_ORDER = [
  "Food",
  "Activities",
  "Beauty",
  "Financial",
  "Shopping",
  "Travel",
  "Wellness",
  "Pets",
  "Other",
];

export function getUniqueCategories(promos: BirthdayPromo[]): string[] {
  const categories = uniqueNonEmpty(promos.map((promo) => promo.category));

  return categories.sort((left, right) => {
    const leftIndex = CATEGORY_ORDER.indexOf(left);
    const rightIndex = CATEGORY_ORDER.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
}

export function getUniqueVerificationStatuses(
  promos: BirthdayPromo[],
): string[] {
  return uniqueNonEmpty(promos.map((promo) => promo.verificationStatus));
}
