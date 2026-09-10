import { useMemo, useState } from "react";
import { PromoCard } from "./PromoCard";
import { PromoDetailDialog } from "./PromoDetailDialog";
import { PromoSiteHeader } from "./PromoSiteHeader";
import { usePromoRegionCoords } from "@/lib/hooks/use-promo-region-coords";
import {
  allPromos,
  getUniqueCategories,
  promoMeta,
} from "@/lib/promos/promoData";
import { filterPromos } from "@/lib/promos/filterPromos";
import {
  getPromoDistanceKm,
  getPromoDistanceKey,
} from "@/lib/promos/getPromoDistance";
import { sortPromos, type PromoSort } from "@/lib/promos/sortPromos";
import type {
  BirthdayPromo,
  PromoFilters as PromoFiltersState,
} from "@/lib/promos/promo.types";
import { useTripContext } from "@/lib/stores/tripStore";

const defaultFilters: PromoFiltersState = {
  query: "",
  category: "",
  verificationStatus: "",
};

export function PromosSection() {
  const [filters, setFilters] = useState<PromoFiltersState>(defaultFilters);
  const [sortPreference, setSortPreference] = useState<{
    tripVersion: string;
    sort: PromoSort;
  } | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<BirthdayPromo | null>(
    null,
  );
  const trip = useTripContext();

  const categories = useMemo(() => getUniqueCategories(allPromos), []);

  const uniqueRegions = useMemo(
    () =>
      allPromos
        .map((promo) => promo.locationRegion)
        .filter((region): region is string => Boolean(region)),
    [],
  );

  const { regionCoordsByRegion, isLoading: isLoadingRegions } =
    usePromoRegionCoords(trip.coords ? uniqueRegions : []);

  const tripVersion = [trip.coords?.lat, trip.coords?.lng].join("|");

  const recommendedSort = useMemo((): PromoSort => {
    if (trip.coords) return "nearest";
    return "verified-first";
  }, [trip.coords]);

  const sort =
    sortPreference?.tripVersion === tripVersion
      ? sortPreference.sort
      : recommendedSort;

  const visiblePromos = useMemo(() => {
    const filtered = filterPromos(allPromos, filters);
    return sortPromos(filtered, sort, {
      trip,
      userCoords: trip.coords,
      regionCoordsByRegion,
    });
  }, [filters, sort, trip, regionCoordsByRegion]);

  const promoDistanceByKey = useMemo(() => {
    const map = new Map<string, number | null>();

    for (const promo of visiblePromos) {
      const key = getPromoDistanceKey(promo);
      map.set(
        key,
        trip.coords
          ? getPromoDistanceKm(promo, trip.coords, regionCoordsByRegion)
          : null,
      );
    }

    return map;
  }, [visiblePromos, trip.coords, regionCoordsByRegion]);

  return (
    <>
      <PromoSiteHeader
        filters={filters}
        categories={categories}
        sort={sort}
        resultCount={visiblePromos.length}
        onFiltersChange={setFilters}
        onSortChange={(nextSort) =>
          setSortPreference({ tripVersion, sort: nextSort })
        }
      />

      {trip.coords && isLoadingRegions ? (
        <p className="mx-auto max-w-4xl px-4 pt-3 text-sm text-muted-foreground sm:px-6">
          Loading location distances...
        </p>
      ) : null}

      <div className="mx-auto max-w-4xl px-0 py-2 sm:px-6 sm:py-3">
        {visiblePromos.length === 0 ? (
          <div className="mx-4 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center sm:mx-0">
            <h2 className="text-xl text-foreground">
              No promos match your search
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword or category to browse all{" "}
              {promoMeta.totalEntries} promos.
            </p>
          </div>
        ) : (
          <ul
            className="list-none divide-y divide-border overflow-hidden border-y border-border bg-card p-0 sm:rounded-3xl sm:border"
            aria-label="Birthday promos"
          >
            {visiblePromos.map((promo, index) => {
              const distanceKm =
                promoDistanceByKey.get(getPromoDistanceKey(promo)) ?? null;

              return (
                <li
                  key={`${promo.brand}-${promo.locationRegion ?? "unknown"}-${index}`}
                  className="min-w-0"
                >
                  <PromoCard
                    promo={promo}
                    distanceKm={distanceKm}
                    onSelect={() => setSelectedPromo(promo)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <PromoDetailDialog
        promo={selectedPromo}
        open={selectedPromo !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPromo(null);
        }}
      />
    </>
  );
}
