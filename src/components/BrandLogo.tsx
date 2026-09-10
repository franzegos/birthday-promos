import { useMemo, useState } from "react";
import {
  getBrandInitials,
  getBrandLogoCandidates,
} from "@/lib/promos/getBrandLogoUrl";
import { cn } from "@/lib/utils";

type BrandLogoSize = "card" | "dialog" | "list";

const sizeClasses: Record<
  BrandLogoSize,
  { image: string; initials: string; text: string; wrapper?: string }
> = {
  card: {
    image: "h-24 w-24 max-h-[45%] max-w-[45%] p-2",
    initials: "h-24 w-24 max-h-[45%] max-w-[45%]",
    text: "text-3xl",
  },
  dialog: {
    image: "size-full",
    initials: "size-full",
    text: "text-lg",
    wrapper:
      "size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted/30",
  },
  list: {
    image: "size-full",
    initials: "size-full",
    text: "text-xs",
    wrapper:
      "size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted/30",
  },
};

type BrandLogoProps = {
  brand: string;
  officialSourceUrl: string | null;
  size?: BrandLogoSize;
  className?: string;
};

export function BrandLogo({
  brand,
  officialSourceUrl,
  size = "card",
  className,
}: BrandLogoProps) {
  const candidates = useMemo(
    () => getBrandLogoCandidates(brand, officialSourceUrl),
    [brand, officialSourceUrl],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const logoUrl = candidates[candidateIndex];
  const showFallback = !logoUrl;
  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        size === "list" || size === "dialog" ? styles.wrapper : "size-full",
        className,
      )}
    >
      {showFallback ? (
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-muted font-medium text-primary",
            styles.initials,
            styles.text,
          )}
          aria-hidden
        >
          {getBrandInitials(brand)}
        </span>
      ) : (
        <img
          src={logoUrl}
          alt=""
          className={cn(
            size === "list" || size === "dialog"
              ? "size-full rounded-full object-cover"
              : "rounded-2xl bg-white object-contain shadow-sm",
            styles.image,
          )}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (candidateIndex < candidates.length - 1) {
              setCandidateIndex((current) => current + 1);
            } else {
              setCandidateIndex(candidates.length);
            }
          }}
        />
      )}
    </div>
  );
}
