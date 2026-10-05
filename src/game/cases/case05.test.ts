// @ts-nocheck -- Executed by bunx vitest; Vitest is intentionally not an app dependency.
import { describe, expect, it } from "vitest";
import { case05 } from "./case05";

describe("Case 05 evidence rules", () => {
  it("preserves the storage key and six decision identifiers in order", () => {
    expect(case05.storageKey).toBe("the-signal-files-case-05-v1");
    expect(case05.scenes.flatMap((scene) => scene.kind === "decision" ? [scene.decision.id] : [])).toEqual([
      "measure", "chart", "poll", "survey", "denominator", "average",
    ]);
  });

  it("keeps the exact source data in accessible tables", () => {
    expect(case05.evidence.find((card) => card.id === "E5-C")?.table?.rows).toEqual([["1000", "780", "220", "78%"]]);
    expect(case05.evidence.find((card) => card.id === "E5-D")?.table?.rows).toEqual([["600", "51%", "49%", "47–55%"]]);
    expect(case05.evidence.find((card) => card.id === "E5-E")?.table?.rows).toEqual([
      ["Α", "120", "120.000", "1"], ["Β", "60", "30.000", "2"],
    ]);
    expect(case05.evidence.find((card) => card.id === "E5-F")?.table?.rows).toEqual([["1", "2", "2", "3", "22"]]);
  });

  it("explains that the support interval includes 50", () => {
    const survey = case05.scenes.find((scene) => scene.kind === "decision" && scene.decision.id === "survey");
    expect(survey?.kind === "decision" ? survey.decision.evidence : "").toContain("περιλαμβάνει το 50%");
  });
});