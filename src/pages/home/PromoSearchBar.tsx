import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PromoSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function PromoSearchBar({
  value,
  onChange,
  className,
}: PromoSearchBarProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-3xl items-center rounded-full border border-border bg-card shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <label className="flex min-w-0 flex-1 flex-col px-5 py-3">
        <span className="text-xs font-medium text-foreground">Search</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Brand, offer, or location"
          className="w-full border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Search promos"
        />
      </label>
      <Button
        type="button"
        size="icon"
        className="m-2 size-12 shrink-0 rounded-full"
        aria-label="Search"
        onClick={() => onChange(value)}
      >
        <Search className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
