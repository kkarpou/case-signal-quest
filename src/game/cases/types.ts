// ============================================================
// ΤΥΠΟΙ ΔΕΔΟΜΕΝΩΝ ΓΙΑ ΤΙΣ ΥΠΟΘΕΣΕΙΣ 02–06
// Το περιεχόμενο κάθε υπόθεσης βρίσκεται στο case0X.ts.
// Προδιαγραφή: docs/season-01-scenarios.md
// ============================================================

import type { SkillKey } from "../game-data";

export type Analyst = "lead" | "mara" | "leo" | "noor";

/** Θεματικές ετικέτες για την αναλυτική αναφορά (δεν αλλάζουν τις 5 μπάρες). */
export type ObjectiveTag =
  | "lateral-reading"
  | "data-literacy"
  | "provenance"
  | "coordination"
  | "privacy"
  | "impersonation"
  | "proportionality"
  | "helping"
  | "transfer"
  | "true-item";

export type EvidenceCard = {
  id: string;
  kicker: string;
  title: string;
  lines: string[];
  /** Προαιρετικός πίνακας με προσβάσιμα δεδομένα (ΥΠΟΘΕΣΗ 05). */
  table?: { head: string[]; rows: string[][] };
  note?: string;
};

export type CaseChoice = {
  id: string;
  label: string;
  /** Ανατροφοδότηση ειδική για αυτή την επιλογή. */
  feedback: string;
  correct?: boolean;
  /** Κωδικός παρανόησης για την αναλυτική αναφορά. */
  misconception?: string;
  delta: Partial<Record<SkillKey, number>>;
  tags?: ObjectiveTag[];
};

export type CaseDecision = {
  id: string;
  eyebrow: string;
  title: string;
  prompt: string;
  hint: string;
  analyst: Analyst;
  /** Ποια τεκμήρια είναι ήδη διαθέσιμα σε αυτό το σημείο. */
  evidenceIds: string[];
  choices: CaseChoice[];
  best: string;
  evidence: string;
  cannot: string;
  principle: string;
  why: string;
  critical?: boolean;
  transfer?: boolean;
  tags?: ObjectiveTag[];
};

export type Scene =
  | { kind: "briefing"; title: string; kicker: string; lines: { who: Analyst; text: string }[] }
  | { kind: "evidence"; evidenceId: string; kicker: string; intro: string }
  | { kind: "decision"; decision: CaseDecision }
  | { kind: "checkpoint"; known: string[]; suspected: string[]; unknown: string[] }
  | { kind: "report" }
  | { kind: "handoff"; kicker: string; title: string; lines: string[]; nextLabel: string };

export type CaseDef = {
  id: string;
  storageKey: string;
  number: string;
  title: string;
  greekTitle: string;
  subtitle: string;
  question: string;
  duration: string;
  evidence: EvidenceCard[];
  scenes: Scene[];
  report: {
    verdictKicker: string;
    verdict: string;
    lines: string[];
    teamSummary: { who: string; text: string }[];
  };
};

export function decisionsOf(def: CaseDef): CaseDecision[] {
  return def.scenes.flatMap((scene) => (scene.kind === "decision" ? [scene.decision] : []));
}
