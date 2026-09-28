import { strings } from "./strings";

export type SkillKey = "source" | "network" | "evidence" | "uncertainty" | "response";

export type Choice = {
  id: string;
  label: string;
  correct?: boolean;
  delta: Partial<Record<SkillKey, number>>;
};

export type Decision = {
  id: string;
  act: number;
  eyebrow: string;
  title: string;
  prompt: string;
  hint: string;
  choices: Choice[];
  best: string;
  evidence: string;
  cannot: string;
  principle: string;
  why: string;
  critical?: boolean;
};

export const skillLabels: Record<SkillKey, string> = strings.skills;

type DecisionKey = keyof typeof strings.decisions;
type Logic = { id: DecisionKey; act: number; critical?: boolean; choices: { id: string; correct?: boolean; delta: Choice["delta"] }[] };

// Λογική παιχνιδιού (σειρά, σωστές απαντήσεις, βαθμολογία). Τα κείμενα βρίσκονται στο strings.ts.
const logic: Logic[] = [
  { id: "classification", act: 1, critical: true, choices: [
    { id: "disinfo", delta: { evidence: -8, uncertainty: -6 } },
    { id: "unverified", correct: true, delta: { evidence: 10, uncertainty: 10 } },
    { id: "coord", delta: { network: -8, evidence: -5 } },
    { id: "fimi", delta: { uncertainty: -10, evidence: -8 } },
  ] },
  { id: "sourceLab", act: 2, critical: true, choices: [
    { id: "provenance", correct: true, delta: { source: 12, evidence: 5 } },
    { id: "nationality", delta: { source: -7, uncertainty: -4 } },
    { id: "comments", delta: { evidence: -5 } },
    { id: "emotion", delta: { source: -3 } },
  ] },
  { id: "proven", act: 4, critical: true, choices: [
    { id: "fake", delta: { source: -4, evidence: -5 } },
    { id: "miscontext", correct: true, delta: { source: 10, evidence: 12 } },
    { id: "intent", delta: { evidence: -9, uncertainty: -5 } },
    { id: "insufficient", delta: { uncertainty: 4, evidence: 2 } },
  ] },
  { id: "spike", act: 6, critical: true, choices: [
    { id: "influencer", correct: true, delta: { network: 12, uncertainty: 6 } },
    { id: "coord", delta: { network: -10, evidence: -5 } },
    { id: "bots", delta: { network: -9 } },
    { id: "unknown", delta: { uncertainty: 5, network: 2 } },
  ] },
  { id: "network", act: 7, critical: true, choices: [
    { id: "cluster", delta: { network: -6 } },
    { id: "botnet", delta: { network: -9 } },
    { id: "broadcast", correct: true, delta: { network: 14, evidence: 4 } },
    { id: "command", delta: { network: -10, evidence: -5 } },
  ] },
  { id: "foreign", act: 8, critical: true, choices: [
    { id: "operation", delta: { uncertainty: -10, evidence: -7 } },
    { id: "amplification", correct: true, delta: { uncertainty: 10, evidence: 8 } },
    { id: "origin", delta: { source: -7 } },
    { id: "irrelevant", delta: { evidence: -3 } },
  ] },
  { id: "direction", act: 9, critical: true, choices: [
    { id: "follows", correct: true, delta: { network: 10, source: 5 } },
    { id: "originates", delta: { source: -8, network: -6 } },
    { id: "controls", delta: { evidence: -9 } },
    { id: "insufficient", delta: { uncertainty: 4 } },
  ] },
  { id: "response", act: 10, critical: true, choices: [
    { id: "accuse", delta: { response: -12, evidence: -6 } },
    { id: "correct", correct: true, delta: { response: 15, uncertainty: 8 } },
    { id: "silent", delta: { response: -7 } },
    { id: "remove", delta: { response: -10 } },
  ] },
  { id: "final", act: 11, critical: true, choices: [
    { id: "organic", delta: { evidence: 2, uncertainty: -2 } },
    { id: "domestic", delta: { network: -8 } },
    { id: "foreignlinked", delta: { uncertainty: -7 } },
    { id: "fimi", delta: { evidence: -10 } },
    { id: "insufficient", correct: true, delta: { evidence: 12, uncertainty: 12 } },
  ] },
  { id: "confidence", act: 12, choices: [
    { id: "low", delta: { uncertainty: 1 } },
    { id: "medium", correct: true, delta: { uncertainty: 12, evidence: 5 } },
    { id: "high", delta: { uncertainty: -7 } },
  ] },
  { id: "lesson", act: 13, choices: [
    { id: "viral", correct: true, delta: { network: 10, evidence: 8 } },
    { id: "foreign", delta: { uncertainty: -8 } },
    { id: "false", delta: { evidence: -8 } },
    { id: "patterns", delta: { network: -8 } },
  ] },
];

export const decisions: Decision[] = logic.map(({ id, act, critical, choices }) => {
  const text = strings.decisions[id];
  const labels = text.choices as Record<string, string>;
  const { choices: _labels, ...rest } = text;
  return {
    id, act, ...rest,
    ...(critical ? { critical } : {}),
    choices: choices.map((choice) => ({ ...choice, label: labels[choice.id] ?? choice.id })),
  };
});

export const decisionByAct = Object.fromEntries(decisions.map((decision) => [decision.act, decision]));
