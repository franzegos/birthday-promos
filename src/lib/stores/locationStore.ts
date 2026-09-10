import { create } from "zustand";
import type { Coordinates } from "@/lib/location/distance";

export type LocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unsupported";

type LocationStore = {
  status: LocationStatus;
  coords: Coordinates | null;
  requestLocation: () => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  status:
    typeof navigator !== "undefined" && "geolocation" in navigator
      ? "idle"
      : "unsupported",
  coords: null,
  requestLocation: () => {
    if (!("geolocation" in navigator)) {
      set({ status: "unsupported", coords: null });
      return;
    }

    set({ status: "requesting" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        set({
          status: "granted",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      () => {
        set({ status: "denied", coords: null });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  },
  clearLocation: () => {
    set({ status: "idle", coords: null });
  },
}));
