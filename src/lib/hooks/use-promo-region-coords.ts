import { useEffect, useMemo, useState } from "react";
import type { Coordinates } from "@/lib/location/distance";
import { getPromoRegionCoords } from "@/lib/location/geocode";

export function usePromoRegionCoords(regions: string[]) {
  const regionKey = useMemo(
    () => [...new Set(regions.filter(Boolean))].sort().join("|"),
    [regions],
  );

  const [loaded, setLoaded] = useState<{
    key: string;
    coords: Map<string, Coordinates[]>;
  }>({
    key: "",
    coords: new Map(),
  });

  useEffect(() => {
    if (!regionKey) return;

    let cancelled = false;

    void (async () => {
      const uniqueRegions = regionKey.split("|");
      const next = new Map<string, Coordinates[]>();

      for (const region of uniqueRegions) {
        if (cancelled) return;
        next.set(region, await getPromoRegionCoords(region));
      }

      if (!cancelled) {
        setLoaded({ key: regionKey, coords: next });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [regionKey]);

  const regionCoordsByRegion =
    regionKey && loaded.key === regionKey ? loaded.coords : new Map();

  return {
    regionCoordsByRegion,
    isLoading: Boolean(regionKey) && loaded.key !== regionKey,
  };
}
