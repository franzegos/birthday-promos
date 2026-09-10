import { BadgeCheck } from "lucide-react";
import {
  formatLastChecked,
  formatVerificationLabel,
  getPromoVerificationBadge,
} from "@/lib/promos/formatPromoDetails";
import { cn } from "@/lib/utils";

type VerificationBadgeProps = {
  status: string | null;
  lastChecked: string | null;
  className?: string;
  iconClassName?: string;
  verifiedOnly?: boolean;
  showTooltip?: boolean;
};

const VERIFIED_ICON_CLASS =
  "shrink-0 [&>path:first-child]:stroke-none [&>path:last-child]:stroke-[2.5]";

export function VerificationBadge({
  status,
  lastChecked,
  className,
  iconClassName,
  verifiedOnly = false,
  showTooltip = true,
}: VerificationBadgeProps) {
  const badge = getPromoVerificationBadge(status);
  if (!badge || (verifiedOnly && badge.variant !== "verified")) return null;

  const tooltip = showTooltip
    ? [formatVerificationLabel(status), formatLastChecked(lastChecked)]
        .filter(Boolean)
        .join(" · ")
    : "";

  const label = badge.variant === "verified" ? "Verified" : badge.label;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center",
        showTooltip && "group/badge",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <span className="inline-flex items-center" aria-label={label}>
        <BadgeCheck
          className={cn(
            VERIFIED_ICON_CLASS,
            badge.variant === "verified"
              ? "fill-emerald-500 text-white"
              : "fill-muted-foreground/40 text-white",
            iconClassName ?? "size-3.5",
          )}
          aria-hidden
        />
      </span>
      {tooltip ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-64 -translate-x-1/2 rounded-lg bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-sm group-hover/badge:block"
        >
          {tooltip}
        </span>
      ) : null}
    </span>
  );
}
