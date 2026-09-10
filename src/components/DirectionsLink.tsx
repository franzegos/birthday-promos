import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getGoogleMapsDirectionsUrl,
  type GoogleMapsTravelMode,
} from "@/lib/location/geocode";
import type { Coordinates } from "@/lib/location/distance";
import { cn } from "@/lib/utils";

type DirectionsLinkProps = {
  destination: Coordinates | string;
  origin?: Coordinates | null;
  label?: string;
  travelMode?: GoogleMapsTravelMode;
  className?: string;
  variant?: "default" | "outline" | "link";
  size?: "default" | "sm";
};

export function DirectionsLink({
  destination,
  origin,
  label = "Get directions",
  travelMode = "driving",
  className,
  variant = "outline",
  size = "sm",
}: DirectionsLinkProps) {
  const href = getGoogleMapsDirectionsUrl({
    destination,
    origin,
    travelMode,
  });

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn("w-full sm:w-auto", className)}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
        <Navigation className="size-4" aria-hidden />
      </a>
    </Button>
  );
}
