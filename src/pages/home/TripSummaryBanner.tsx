import { Sparkles } from "lucide-react";
import { useTripContext } from "@/lib/stores/tripStore";
import { hasTripContext } from "@/lib/promos/scorePromoRelevance";

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TripSummaryBanner() {
  const trip = useTripContext();

  if (!hasTripContext(trip)) return null;

  const parts = [
    trip.placeLabel,
    trip.visitDate ? formatDate(trip.visitDate) : null,
    trip.visitTime ? formatTime(trip.visitTime) : null,
  ].filter(Boolean);

  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3"
      role="status"
    >
      <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          Personalized suggestions
        </p>
        <p className="text-sm text-muted-foreground">
          Showing promos for {parts.join(" · ")}
        </p>
      </div>
    </div>
  );
}
