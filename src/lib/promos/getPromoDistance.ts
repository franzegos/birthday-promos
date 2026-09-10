import { getDistanceKm, type Coordinates } from "@/lib/location/distance";
import type { BirthdayPromo } from "./promo.types";

const NATIONWIDE_DISTANCE_KM = 250;

export function getPromoDistanceKm(
  promo: BirthdayPromo,
  userLocation: Coordinates,
  regionCoordsByRegion: Map<string, Coordinates[]> = new Map(),
): number {
  const regionKey = promo.locationRegion ?? "";
  const centroids = regionCoordsByRegion.get(regionKey) ?? [];

  if (centroids.length === 0) {
    return NATIONWIDE_DISTANCE_KM;
  }

  const regionText = promo.locationRegion?.toLowerCase() ?? "";
  const isNationwide =
    regionText.includes("nationwide") ||
    regionText.includes("philippines") ||
    regionText === "unknown";

  const distances = centroids.map((coords) =>
    getDistanceKm(userLocation, coords),
  );
  const minDistance = Math.min(...distances);

  if (isNationwide && centroids.length === 1) {
    return Math.max(minDistance, NATIONWIDE_DISTANCE_KM * 0.6);
  }

  return minDistance;
}

export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) return "< 1 km";
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`;
  return `${Math.round(distanceKm)} km`;
}

export function getPromoDistanceKey(promo: BirthdayPromo): string {
  return `${promo.brand}-${promo.locationRegion ?? ""}`;
}
