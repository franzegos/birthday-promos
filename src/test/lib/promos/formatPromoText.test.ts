import { describe, expect, it } from "vitest";
import { formatReadablePromoText } from "@/lib/promos/formatPromoText";

describe("formatReadablePromoText", () => {
  it("does not split Sta. Rosa on the abbreviation period", () => {
    expect(
      formatReadablePromoText("Walk-in ticket booth only; Sta. Rosa Laguna"),
    ).toEqual(["Walk-in ticket booth only", "Sta. Rosa Laguna"]);
  });

  it("formats schedule notes into readable lines", () => {
    expect(
      formatReadablePromoText(
        "Valid 1 Feb-30 Dec 2026. Lunch daily 12-3PM; dinner Fri-Sun 6-10:30PM.",
      ),
    ).toEqual([
      "Valid from 1 Feb – 30 Dec 2026",
      "Lunch daily 12 PM – 3 PM",
      "Dinner Fri-Sun 6 PM – 10:30 PM",
    ]);
  });
});
