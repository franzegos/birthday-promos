import { Gift } from "lucide-react";
import { CategoryBar } from "./CategoryBar";
import { LocationToggle } from "./LocationToggle";
import { PromoSortSelect } from "./PromoSortSelect";
import { useScrollHeaderVisible } from "@/lib/hooks/use-scroll-header";
import type { PromoSort } from "@/lib/promos/sortPromos";
import type { PromoFilters } from "@/lib/promos/promo.types";
import { cn } from "@/lib/utils";

type PromoSiteHeaderProps = {
  filters: PromoFilters;
  categories: string[];
  sort: PromoSort;
  resultCount: number;
  onFiltersChange: (filters: PromoFilters) => void;
  onSortChange: (sort: PromoSort) => void;
  className?: string;
};

export function PromoSiteHeader({
  filters,
  categories,
  sort,
  resultCount,
  onFiltersChange,
  onSortChange,
  className,
}: PromoSiteHeaderProps) {
  const isVisible = useScrollHeaderVisible(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/95 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur transition-transform duration-300 ease-in-out supports-[backdrop-filter]:bg-background/80",
        !isVisible && "-translate-y-full pointer-events-none",
        className,
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden
          >
            <Gift className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Birthday Promos
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Philippine birthday deals &amp; freebies
            </p>
          </div>
        </div>

        <div className="flex h-7 shrink-0 items-center justify-end gap-1.5 text-[11px] text-muted-foreground sm:justify-start">
          <span className="whitespace-nowrap">
            {resultCount} promo{resultCount === 1 ? "" : "s"}
          </span>
          <PromoSortSelect value={sort} onChange={onSortChange} />
          <span aria-hidden className="h-4 w-px bg-border" />
          <LocationToggle />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <CategoryBar
          categories={categories}
          activeCategory={filters.category}
          onChange={(category) => onFiltersChange({ ...filters, category })}
          compact
        />
      </div>
    </header>
  );
}
