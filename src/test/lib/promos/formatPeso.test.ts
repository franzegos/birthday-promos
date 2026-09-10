import { describe, expect, it } from "vitest";
import {
  formatPesoAmount,
  formatPesoEstimate,
  formatPromoSavingsLabel,
} from "@/lib/promos/formatPeso";

describe("formatPeso", () => {
  it("formats ranges with peso sign and commas", () => {
    expect(formatPesoAmount("~988-1500")).toBe("₱988 – ₱1,500");
    expect(formatPesoAmount("~1,500-2,000")).toBe("₱1,500 – ₱2,000");
  });

  it("formats single amounts with plus suffix", () => {
    expect(formatPesoAmount("~799+")).toBe("₱799+");
  });

  it("adds estimate prefix for detail highlights", () => {
    expect(formatPesoEstimate("~799+")).toBe("From ₱799+");
    expect(formatPesoEstimate("~988-1500")).toBe("₱988 – ₱1,500");
  });

  it("keeps percentage values out of peso formatting", () => {
    expect(formatPesoAmount("50% off")).toBe("50% off");
    expect(formatPesoAmount("30% off food")).toBe("30% off food");
    expect(formatPesoAmount("15-20%")).toBe("15% – 20%");
  });

  it("formats list savings labels with Save prefix", () => {
    expect(formatPromoSavingsLabel("50% off")).toBe("Save 50%");
    expect(formatPromoSavingsLabel("~150-250")).toBe("Save ₱150 – ₱250");
    expect(formatPromoSavingsLabel("Service value")).toBe("Service value");
  });
});
