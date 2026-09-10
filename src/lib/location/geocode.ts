import type { Coordinates } from "./distance";

export type GeocodeResult = Coordinates & {
  displayName: string;
};

export type PlaceSuggestion = {
  id: string;
  label: string;
  subtitle: string;
  coords: Coordinates;
};

type NominatimSearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "BirthdayPromoDatabase/1.0";
const REGION_CACHE_STORAGE_KEY = "birthday-promo-region-geocode-cache";

const memoryCache = new Map<string, GeocodeResult | null>();
let lastRequestAt = 0;

function loadRegionCache(): Map<string, Coordinates[]> {
  if (typeof window === "undefined") return new Map();

  try {
    const raw = window.localStorage.getItem(REGION_CACHE_STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, Coordinates[]>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

const regionCoordsCache = loadRegionCache();

function persistRegionCache() {
  if (typeof window === "undefined") return;

  const payload = Object.fromEntries(regionCoordsCache.entries());
  window.localStorage.setItem(
    REGION_CACHE_STORAGE_KEY,
    JSON.stringify(payload),
  );
}

async function waitForRateLimit() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < 1100) {
    await new Promise((resolve) => setTimeout(resolve, 1100 - elapsed));
  }
  lastRequestAt = Date.now();
}

async function nominatimSearch(
  params: Record<string, string>,
): Promise<NominatimSearchResult[]> {
  await waitForRateLimit();

  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "ph");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) return [];

  return (await response.json()) as NominatimSearchResult[];
}

function toGeocodeResult(result: NominatimSearchResult): GeocodeResult {
  return {
    lat: Number(result.lat),
    lng: Number(result.lon),
    displayName: result.display_name,
  };
}

function formatPlaceSuggestion(result: NominatimSearchResult): PlaceSuggestion {
  const parts = result.display_name.split(",").map((part) => part.trim());
  const address = result.address ?? {};
  const label =
    address.city ??
    address.town ??
    address.municipality ??
    address.suburb ??
    address.village ??
    parts[0] ??
    result.display_name;

  const subtitle =
    [address.state, address.region, address.country]
      .filter(Boolean)
      .join(", ") ||
    parts.slice(1, 3).join(", ") ||
    "Philippines";

  return {
    id: String(result.place_id),
    label,
    subtitle,
    coords: {
      lat: Number(result.lat),
      lng: Number(result.lon),
    },
  };
}

export async function geocodeQuery(
  query: string,
): Promise<GeocodeResult | null> {
  const cacheKey = query.trim().toLowerCase();
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey) ?? null;
  }

  try {
    const results = await nominatimSearch({
      q: query,
      limit: "1",
    });

    const first = results[0];
    if (!first) {
      memoryCache.set(cacheKey, null);
      return null;
    }

    const result = toGeocodeResult(first);
    memoryCache.set(cacheKey, result);
    return result;
  } catch {
    memoryCache.set(cacheKey, null);
    return null;
  }
}

export async function searchPlaces(
  query: string,
  limit = 8,
): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const results = await nominatimSearch({
      q: `${trimmed}, Philippines`,
      limit: String(limit),
    });

    return results.map(formatPlaceSuggestion);
  } catch {
    return [];
  }
}

export function parseLocationRegionSegments(
  locationRegion: string | null,
): string[] {
  if (!locationRegion) return [];

  return locationRegion
    .split(/[/,]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function buildRegionGeocodeQuery(segment: string): string {
  const normalized = segment.toLowerCase();

  if (
    normalized === "nationwide" ||
    normalized === "philippines" ||
    normalized === "unknown"
  ) {
    return "Philippines";
  }

  return `${segment}, Philippines`;
}

async function geocodeRegionSegment(
  segment: string,
): Promise<Coordinates | null> {
  const geocoded = await geocodeQuery(buildRegionGeocodeQuery(segment));
  return geocoded ? { lat: geocoded.lat, lng: geocoded.lng } : null;
}

export async function getPromoRegionCoords(
  locationRegion: string | null,
): Promise<Coordinates[]> {
  if (!locationRegion) return [];

  if (regionCoordsCache.has(locationRegion)) {
    return regionCoordsCache.get(locationRegion) ?? [];
  }

  const segments = parseLocationRegionSegments(locationRegion);
  if (segments.length === 0) return [];

  const coords: Coordinates[] = [];
  for (const segment of segments) {
    const geocoded = await geocodeRegionSegment(segment);
    if (geocoded) coords.push(geocoded);
  }

  regionCoordsCache.set(locationRegion, coords);
  persistRegionCache();

  return coords;
}

export type GoogleMapsTravelMode =
  | "driving"
  | "walking"
  | "bicycling"
  | "transit"
  | "two_wheeler";

type GoogleMapsDirectionsParams = {
  destination: Coordinates | string;
  origin?: Coordinates | null;
  travelMode?: GoogleMapsTravelMode;
};

function formatDestination(destination: Coordinates | string): string {
  if (typeof destination === "string") return destination;
  return `${destination.lat},${destination.lng}`;
}

export function getGoogleMapsDirectionsUrl({
  destination,
  origin,
  travelMode = "driving",
}: GoogleMapsDirectionsParams): string {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", formatDestination(destination));

  if (origin) {
    url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
  }

  url.searchParams.set("travelmode", travelMode);
  return url.toString();
}

export function getGoogleMapsSearchUrl(query: string): string {
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);
  return url.toString();
}
