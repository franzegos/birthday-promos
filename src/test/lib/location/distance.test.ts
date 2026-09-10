import { describe, expect, it } from "vitest";
import { formatDistanceKm, getDistanceKm } from "@/lib/location/distance";

describe("distance", () => {
  it("calculates distance between two points", () => {
    const manila = { lat: 14.5995, lng: 120.9842 };
    const quezonCity = { lat: 14.676, lng: 121.0437 };
    const distance = getDistanceKm(manila, quezonCity);

    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(20);
  });

  it("formats short distances in meters", () => {
    expect(formatDistanceKm(0.42)).toBe("420 m");
  });
});
