import { describe, expect, it } from "vitest";
import {
  getGoogleMapsDirectionsUrl,
  getGoogleMapsSearchUrl,
  parseLocationRegionSegments,
} from "@/lib/location/geocode";

describe("google maps urls", () => {
  it("builds directions from user location to coordinates", () => {
    const url = getGoogleMapsDirectionsUrl({
      destination: { lat: 14.65, lng: 121.03 },
      origin: { lat: 14.59, lng: 120.98 },
    });

    expect(url).toContain("google.com/maps/dir/");
    expect(url).toContain("destination=14.65%2C121.03");
    expect(url).toContain("origin=14.59%2C120.98");
    expect(url).toContain("travelmode=driving");
  });

  it("builds directions to an address without origin", () => {
    const url = getGoogleMapsDirectionsUrl({
      destination: "Cabalen SM City Grand Central, Philippines",
    });

    expect(url).toContain(
      "destination=Cabalen+SM+City+Grand+Central%2C+Philippines",
    );
    expect(url).not.toContain("origin=");
  });

  it("builds a maps search url", () => {
    expect(getGoogleMapsSearchUrl("Cabalen Philippines")).toContain(
      "google.com/maps/search/",
    );
  });
});

describe("parseLocationRegionSegments", () => {
  it("splits multi-region promo locations", () => {
    expect(parseLocationRegionSegments("Metro Manila / Pampanga")).toEqual([
      "Metro Manila",
      "Pampanga",
    ]);
  });
});
