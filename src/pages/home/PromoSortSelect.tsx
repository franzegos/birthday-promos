import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPromoSortOptions, type PromoSort } from "@/lib/promos/sortPromos";
import { useTripCoords } from "@/lib/stores/tripStore";

type PromoSortSelectProps = {
  value: PromoSort;
  onChange: (sort: PromoSort) => void;
};

export function PromoSortSelect({ value, onChange }: PromoSortSelectProps) {
  const coords = useTripCoords();
  const sortOptions = getPromoSortOptions(Boolean(coords));

  return (
    <Select value={value} onValueChange={(next) => onChange(next as PromoSort)}>
      <SelectTrigger
        size="sm"
        aria-label="Sort promos"
        className="h-7 max-w-[6.75rem] min-w-0 gap-1 rounded-full border-border bg-card px-2 py-0 text-[11px] leading-none shadow-none data-[size=sm]:h-7 sm:max-w-none sm:px-2.5 [&_svg]:size-3"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent
        align="end"
        position="popper"
        sideOffset={4}
        className="min-w-36"
      >
        <SelectGroup>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
