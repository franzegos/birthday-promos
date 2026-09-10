import { LocateFixed } from "lucide-react";
import { useTripStore } from "@/lib/stores/tripStore";
import { cn } from "@/lib/utils";

export function LocationToggle() {
  const place = useTripStore((state) => state.place);
  const isApplied = useTripStore((state) => state.isApplied);
  const gpsStatus = useTripStore((state) => state.gpsStatus);
  const requestGpsLocation = useTripStore((state) => state.requestGpsLocation);
  const clearTrip = useTripStore((state) => state.clearTrip);

  const enabled = isApplied && Boolean(place?.coords);
  const isLoading = gpsStatus === "requesting";
  const label = isLoading
    ? "Locating"
    : enabled
      ? "Location on"
      : "Location off";

  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={label}
      disabled={isLoading}
      onClick={() => {
        if (enabled) {
          clearTrip();
          return;
        }
        requestGpsLocation();
      }}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[11px] font-medium leading-none transition-colors sm:px-2.5",
        enabled
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      <LocateFixed className="size-3 shrink-0" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
