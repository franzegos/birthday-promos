import { getDistanceKm, type Coordinates } from "./distance";
import { geocodeQuery } from "./geocode";
import { parseBranches } from "./parseBranches";

export type ResolvedBranch = {
  label: string;
  address: string;
  coords: Coordinates;
  distanceKm: number;
};

export async function findNearestBranch({
  brand,
  participatingBranches,
  userLocation,
}: {
  brand: string;
  participatingBranches: string | null;
  userLocation: Coordinates;
}): Promise<ResolvedBranch | null> {
  const branches = parseBranches(participatingBranches, brand);
  if (branches.length === 0) return null;

  const candidates = await Promise.all(
    branches.slice(0, 6).map(async (branch) => {
      const geocoded = await geocodeQuery(branch.query);
      if (!geocoded) return null;

      return {
        label: branch.label,
        address: geocoded.displayName,
        coords: { lat: geocoded.lat, lng: geocoded.lng },
        distanceKm: getDistanceKm(userLocation, geocoded),
      };
    }),
  );

  const resolved = candidates
    .filter((candidate): candidate is ResolvedBranch => candidate !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return resolved[0] ?? null;
}
