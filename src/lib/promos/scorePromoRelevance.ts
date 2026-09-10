import type { Coordinates } from "@/lib/location/distance";
import { getPromoDistanceKm } from "./getPromoDistance";
import type { BirthdayPromo } from "./promo.types";

type ScoreOptions = {
  regionCoordsByRegion?: Map<string, Coordinates[]>;
};

export type TripContext = {
  placeLabel: string | null;
  coords: Coordinates | null;
  visitDate: string | null;
  visitTime: string | null;
};

function isVerified(promo: BirthdayPromo): boolean {
  return promo.verificationStatus?.toLowerCase().includes("verified") ?? false;
}

function matchesPlace(promo: BirthdayPromo, placeLabel: string): boolean {
  const haystack = [
    promo.locationRegion,
    promo.participatingBranches,
    promo.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const normalizedPlace = placeLabel.toLowerCase();
  if (haystack.includes(normalizedPlace)) return true;

  const placeTokens = normalizedPlace
    .split(/[\s,]+/)
    .filter((token) => token.length > 3);
  return placeTokens.some((token) => haystack.includes(token));
}

function scoreDateFit(promo: BirthdayPromo, visitDate: string): number {
  const date = new Date(`${visitDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return 0;

  const exactBirthday = promo.exactBirthday?.toLowerCase() === "yes";
  const birthMonth = promo.birthMonth?.toLowerCase() === "yes";

  if (exactBirthday) return 40;
  if (birthMonth) return 28;
  if (promo.otherValidityPeriod?.toLowerCase().includes("birth")) return 16;
  return 4;
}

function scoreTimeFit(promo: BirthdayPromo, visitTime: string): number {
  const [hours] = visitTime.split(":").map(Number);
  if (Number.isNaN(hours)) return 0;

  const notes = [promo.notes, promo.otherValidityPeriod, promo.offer]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isLunchWindow = hours >= 10 && hours < 15;
  const isDinnerWindow = hours >= 17 && hours < 22;

  if (isLunchWindow && notes.includes("lunch")) return 12;
  if (isDinnerWindow && notes.includes("dinner")) return 12;
  if (notes.includes("lunch") || notes.includes("dinner")) return 4;
  return 2;
}

export function scorePromoRelevance(
  promo: BirthdayPromo,
  trip: TripContext,
  options: ScoreOptions = {},
): number {
  let score = 0;

  if (trip.coords) {
    const distanceKm = getPromoDistanceKm(
      promo,
      trip.coords,
      options.regionCoordsByRegion,
    );
    score += Math.max(0, 80 - distanceKm * 0.8);
  }

  if (trip.placeLabel && matchesPlace(promo, trip.placeLabel)) {
    score += 35;
  }

  if (trip.visitDate) {
    score += scoreDateFit(promo, trip.visitDate);
  }

  if (trip.visitTime) {
    score += scoreTimeFit(promo, trip.visitTime);
  }

  if (isVerified(promo)) {
    score += 8;
  }

  return score;
}

export function hasTripContext(trip: TripContext): boolean {
  return Boolean(trip.coords || trip.visitDate || trip.visitTime);
}
