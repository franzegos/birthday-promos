import { describe, expect, it } from "vitest";
import {
  hasOnlyVagueBranches,
  parseBranches,
} from "@/lib/location/parseBranches";

describe("parseBranches", () => {
  it("parses named mall branches", () => {
    expect(
      parseBranches(
        "BGC, UP Town Center, Ayala Manila Bay, Fairview, Cloverleaf",
        "The Alley by Vikings",
      ).map((branch) => branch.label),
    ).toEqual([
      "BGC",
      "UP Town Center",
      "Ayala Manila Bay",
      "Fairview",
      "Cloverleaf",
    ]);
  });

  it("keeps a single street address", () => {
    expect(
      parseBranches("197 D. Tuazon, Quezon City", "Example Brand"),
    ).toEqual([
      {
        label: "197 D. Tuazon, Quezon City",
        query: "197 D. Tuazon, Quezon City, Philippines",
        kind: "address",
      },
    ]);
  });

  it("treats vague branch lists as unavailable", () => {
    expect(hasOnlyVagueBranches("SM branches and standalone locations")).toBe(
      true,
    );
  });
});
