import type { Analyst, CaseDecision, EvidenceCard, ObjectiveTag } from "./types";

export function decision(config: {
  id: string; n: number; title: string; prompt: string; hint: string; analyst: Analyst;
  evidence: EvidenceCard; correct: string; wrong: [string, string]; finding: string;
  cannot: string; principle: string; tags?: ObjectiveTag[];
}): CaseDecision {
  return {
    id: config.id, eyebrow: `ΑΠΟΦΑΣΗ ${String(config.n).padStart(2, "0")}`, title: config.title,
    prompt: config.prompt, hint: config.hint, analyst: config.analyst, evidenceIds: [config.evidence.id],
    choices: [
      { id: "bounded", label: config.correct, feedback: "Ακριβής και αναλογική κρίση: λες όσα στηρίζονται και κρατάς ορατό το όριο.", correct: true, delta: { evidence: 10, uncertainty: 7, source: 5 }, ...(config.tags ? { tags: config.tags } : {}) },
      { id: "leap", label: config.wrong[0], feedback: "Το συμπέρασμα προχωρά πιο μακριά από το διαθέσιμο τεκμήριο.", misconception: "inference-leap", delta: { evidence: -8, uncertainty: -6 } },
      { id: "dismiss", label: config.wrong[1], feedback: "Η επιφύλαξη δεν σημαίνει ότι αγνοούμε όσα ήδη επαληθεύονται.", misconception: "over-caution", delta: { evidence: -4, uncertainty: -5 } },
    ],
    best: "bounded", evidence: config.finding, cannot: config.cannot, principle: config.principle,
    why: "Η ισχυρή ανάλυση χωρίζει την παρατήρηση, την ερμηνεία και την απόδοση ευθύνης.", critical: true, ...(config.tags ? { tags: config.tags } : {}),
  };
}