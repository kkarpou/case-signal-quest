// @ts-nocheck -- Executed by bunx vitest; Vitest is intentionally not an app dependency.
import { describe, expect, it } from "vitest";
import { case04 } from "./case04";

describe("Case 04 learning-flow rules", () => {
  const decisions = case04.scenes.flatMap((scene) => scene.kind === "decision" ? [scene.decision] : []);

  it("preserves the storage key and five decision identifiers in order", () => {
    expect(case04.storageKey).toBe("the-signal-files-case-04-v1");
    expect(decisions.map((item) => item.id)).toEqual(["hold", "context", "claim", "synthetic", "voice"]);
  });

  it("uses the required deterministic choice order", () => {
    expect(decisions.map((item) => item.choices.map((choice) => choice.id))).toEqual([
      ["leap", "bounded", "dismiss"], ["dismiss", "leap", "bounded"], ["bounded", "dismiss", "leap"],
      ["leap", "bounded", "dismiss"], ["dismiss", "leap", "bounded"],
    ]);
  });

  it("keeps the pre-answer voice evidence neutral", () => {
    const voice = case04.evidence.find((card) => card.id === "E4-E");
    const preAnswer = [voice?.kicker, voice?.title, ...(voice?.lines ?? [])].join(" ");
    expect(preAnswer).not.toContain("διαψεύδει");
    expect(preAnswer).not.toContain("δεν το ζήτησε");
    expect(preAnswer).not.toMatch(/deepfake|κλωνοποίηση|πλαστοπροσωπία/i);
  });

  it("keeps the exact 12 plus 8 equals 20 timing", () => {
    const context = case04.evidence.find((card) => card.id === "E4-B");
    expect([context?.kicker, ...(context?.lines ?? [])].join(" ")).toContain("12″ + 8″ = 20″");
  });
});