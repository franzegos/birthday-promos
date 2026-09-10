import { ChevronRight, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatDistanceKm } from "@/lib/promos/getPromoDistance";
import { formatPromoSavingsLabel } from "@/lib/promos/formatPeso";
import type { BirthdayPromo } from "@/lib/promos/promo.types";
import { cn } from "@/lib/utils";

type PromoCardProps = {
  promo: BirthdayPromo;
  distanceKm?: number | null;
  onSelect: () => void;
};

export function PromoCard({
  promo,
  distanceKm = null,
  onSelect,
}: PromoCardProps) {
  const valueLabel = formatPromoSavingsLabel(promo.offerValuePhpEst);
  const locationLabel = [
    promo.locationRegion ?? promo.category,
    distanceKm != null ? formatDistanceKm(distanceKm) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full items-start gap-2.5 px-3 py-2.5 text-left outline-none transition-colors sm:items-center sm:py-2",
        "hover:bg-muted/50 focus-visible:bg-muted/50",
      )}
    >
      <BrandLogo
        brand={promo.brand}
        officialSourceUrl={promo.officialSourceUrl}
        size="list"
        className="shrink-0 [&>div]:size-9 sm:[&>div]:size-10"
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <h3 className="min-w-0 text-[13px] leading-tight font-medium text-foreground">
            <span className="line-clamp-2 sm:truncate">{promo.brand}</span>
          </h3>
          <VerificationBadge
            status={promo.verificationStatus}
            lastChecked={promo.lastChecked}
            verifiedOnly
            showTooltip={false}
            iconClassName="size-3"
          />
        </div>

        {promo.offer ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground sm:line-clamp-1">
            {promo.offer}
          </p>
        ) : null}

        <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-0.5 text-[11px] leading-none text-muted-foreground">
            <MapPin className="size-2.5 shrink-0" aria-hidden />
            <span className="truncate">{locationLabel}</span>
          </div>
          {valueLabel ? (
            <span className="shrink-0 text-[11px] leading-none font-medium text-foreground sm:hidden">
              {valueLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-1 self-stretch sm:flex">
        {valueLabel ? (
          <span className="text-[11px] leading-none font-medium text-foreground">
            {valueLabel}
          </span>
        ) : null}
        <ChevronRight
          className="size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </div>
    </button>
  );
}
