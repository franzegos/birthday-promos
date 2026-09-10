import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { Coordinates } from "@/lib/location/distance";
import { geocodeQuery, type PlaceSuggestion } from "@/lib/location/geocode";

export type LocationSource = "gps" | "manual";

export type TripPlace = {
  label: string;
  coords: Coordinates;
  source: LocationSource;
};

export type LocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unsupported";

type TripStore = {
  place: TripPlace | null;
  visitDate: string | null;
  visitTime: string | null;
  gpsStatus: LocationStatus;
  isApplied: boolean;
  setVisitDate: (visitDate: string | null) => void;
  setVisitTime: (visitTime: string | null) => void;
  setPlaceFromSuggestion: (place: PlaceSuggestion) => void;
  setPlaceFromGeocode: (label: string, coords: Coordinates) => void;
  requestGpsLocation: () => void;
  searchAndSetPlace: (query: string) => Promise<boolean>;
  applyTrip: () => void;
  clearTrip: () => void;
};

const STORAGE_KEY = "birthday-promo-trip";

type PersistedTrip = {
  place: TripPlace | null;
  visitDate: string | null;
  visitTime: string | null;
  isApplied: boolean;
};

function loadPersistedTrip(): PersistedTrip | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedTrip;
  } catch {
    return null;
  }
}

function persistTrip(state: TripStore) {
  if (typeof window === "undefined") return;

  const payload: PersistedTrip = {
    place: state.place,
    visitDate: state.visitDate,
    visitTime: state.visitTime,
    isApplied: state.isApplied,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

const persisted = loadPersistedTrip();

export const useTripStore = create<TripStore>((set, get) => ({
  place: persisted?.place ?? null,
  visitDate: persisted?.visitDate ?? null,
  visitTime: persisted?.visitTime ?? null,
  gpsStatus:
    typeof navigator !== "undefined" && "geolocation" in navigator
      ? "idle"
      : "unsupported",
  isApplied: persisted?.isApplied ?? Boolean(persisted?.place),

  setVisitDate: (visitDate) => {
    set({ visitDate });
    persistTrip(get());
  },

  setVisitTime: (visitTime) => {
    set({ visitTime });
    persistTrip(get());
  },

  setPlaceFromSuggestion: (place) => {
    set({
      place: {
        label: place.label,
        coords: place.coords,
        source: "manual",
      },
      isApplied: true,
    });
    persistTrip(get());
  },

  setPlaceFromGeocode: (label, coords) => {
    set({
      place: {
        label,
        coords,
        source: "manual",
      },
      isApplied: true,
    });
    persistTrip(get());
  },

  requestGpsLocation: () => {
    if (!("geolocation" in navigator)) {
      set({ gpsStatus: "unsupported" });
      return;
    }

    set({ gpsStatus: "requesting" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          place: {
            label: "Your location",
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            source: "gps" as const,
          },
          gpsStatus: "granted" as const,
          isApplied: true,
        };
        set(next);
        persistTrip(get());
      },
      () => {
        set({ gpsStatus: "denied" });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  },

  searchAndSetPlace: async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return false;

    const geocoded = await geocodeQuery(`${trimmed}, Philippines`);
    if (!geocoded) return false;

    const label = geocoded.displayName.split(",").slice(0, 2).join(",").trim();
    get().setPlaceFromGeocode(label || trimmed, {
      lat: geocoded.lat,
      lng: geocoded.lng,
    });
    return true;
  },

  applyTrip: () => {
    set({ isApplied: true });
    persistTrip(get());
  },

  clearTrip: () => {
    set({
      place: null,
      visitDate: null,
      visitTime: null,
      gpsStatus:
        typeof navigator !== "undefined" && "geolocation" in navigator
          ? "idle"
          : "unsupported",
      isApplied: false,
    });
    persistTrip(get());
  },
}));

export function useTripCoords() {
  return useTripStore((state) =>
    state.isApplied ? (state.place?.coords ?? null) : null,
  );
}

export function useTripContext() {
  return useTripStore(
    useShallow((state) => ({
      placeLabel: state.isApplied ? (state.place?.label ?? null) : null,
      coords: state.isApplied ? (state.place?.coords ?? null) : null,
      visitDate: state.isApplied ? state.visitDate : null,
      visitTime: state.isApplied ? state.visitTime : null,
    })),
  );
}
