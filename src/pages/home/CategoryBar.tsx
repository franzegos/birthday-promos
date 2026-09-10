import { Gift } from "lucide-react";
import { getCategoryMeta } from "@/lib/promos/categoryMeta";
import { cn } from "@/lib/utils";

type CategoryBarProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  compact?: boolean;
  className?: string;
};

export function CategoryBar({
  categories,
  activeCategory,
  onChange,
  compact = false,
  className,
}: CategoryBarProps) {
  const items = ["", ...categories];

  return (
    <div
      className={cn(
        "flex gap-0.5 overflow-x-auto border-b border-border/50 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="tablist"
      aria-label="Promo categories"
    >
      {items.map((category) => {
        const meta = category ? getCategoryMeta(category) : null;
        const Icon = meta?.icon ?? Gift;
        const label = category || "All";
        const active = activeCategory === category;

        return (
          <button
            key={category || "all"}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(category)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 font-medium transition-colors -mb-px",
              compact ? "py-1.5 text-xs" : "py-2 text-sm",
              active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={"size-3.5"} aria-hidden />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
