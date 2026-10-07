export type ReportDraft = { selected: string[]; checked: boolean };
export const reportSentences = [
  { id: "company", supported: true, text: "Η τοπική εταιρεία οργάνωσε παραπλανητική ενίσχυση μέσω πέντε ταυτοποιημένων λογαριασμών.", feedback: "Χρειάζεται η τεκμηριωμένη απόδοση στην εταιρεία: εντολή, αυθεντικοποίηση και πέντε αντιστοιχίσεις." },
  { id: "all23", supported: false, text: "Και οι 23 λογαριασμοί αποδείχθηκε ότι ανήκουν στην εταιρεία.", feedback: "Το brief αντιστοιχίζεται σε πέντε, όχι σε όλους τους 23. Οι 18 έχουν δημόσια συμμετοχή στο κάλεσμα." },
  { id: "residents", supported: true, text: "Οι 18 συμμετείχαν δημόσια στο κάλεσμα κατοίκων· δεν τεκμηριώνεται σύνδεσή τους με αυτό το brief.", feedback: "Να διατηρηθεί το γνωστό εύρημα για τους 18, χωρίς συλλογική ενοχή ή καθολική αθώωση." },
  { id: "foreign", supported: true, text: "Ξένη εντολή, πληρωμή ή έλεγχος δεν έχουν επαληθευτεί· δεν αποκλείονται οριστικά.", feedback: "Χρειάζεται σαφές όριο: οι ξενόγλωσσες αναδημοσιεύσεις δεν επαληθεύουν ξένο έλεγχο." },
  { id: "sponsor", supported: false, text: "Οι ξενόγλωσσες αναδημοσιεύσεις αποδεικνύουν τον ξένο χρηματοδότη.", feedback: "Η γλώσσα δεν ταυτοποιεί χρηματοδότη, χώρα ή εντολέα. Δεν υπάρχει αυθεντικοποιημένη πληρωμή." },
  { id: "reach", supported: true, text: "Οι πέντε αντιστοιχίσεις είναι τεκμηριωμένες· το συνολικό εύρος της επιχείρησης παραμένει ανοιχτό.", feedback: "Πέντε αποδεδειγμένες αντιστοιχίσεις δεν σημαίνουν ανώτατο συνολικό μέγεθος πέντε." },
  { id: "nobody", supported: false, text: "Δεν μπορεί να αποδοθεί καμία ευθύνη σε κανέναν, ακόμη και μετά την επαλήθευση.", feedback: "Η ισχυρή αλυσίδα επιτρέπει συγκεκριμένη απόδοση. Η επιφύλαξη δεν ακυρώνει επαληθευμένα ευρήματα." },
  { id: "protect", supported: true, text: "Δεν αναπαράγουμε τη διεύθυνση· στηρίζουμε τον εθελοντή και διατηρούμε τη γνήσια ειδοποίηση συντήρησης.", feedback: "Να περιληφθεί προστασία του προσώπου χωρίς αναπαραγωγή δεδομένων ή απόρριψη της γνήσιας ειδοποίησης." },
  { id: "address", supported: false, text: "Δημοσιεύουμε τη διεύθυνση του εθελοντή για να δείξουμε την κακόβουλη ανάρτηση.", feedback: "Η αναδημοσίευση επαναλαμβάνει τη βλάβη. Αρκεί η καταγραφή ότι αφαιρέθηκαν προσωπικά στοιχεία." },
];
export function checkReport(selected: string[]) {
  const valid = reportSentences.filter((s) => selected.includes(s.id));
  const missing = reportSentences.filter((s) => s.supported && !selected.includes(s.id));
  const unsupported = valid.filter((s) => !s.supported);
  return { empty: valid.length === 0, missing, unsupported, accurate: valid.length > 0 && !missing.length && !unsupported.length };
}
export function editReport(selected: string[]): ReportDraft { return { selected: [...new Set(selected)].filter((id) => reportSentences.some((s) => s.id === id)), checked: false }; }
export function canFinishReport(draft: ReportDraft | undefined) { return Boolean(draft?.checked && !checkReport(draft.selected).empty); }
export function normalizeReport(value: unknown): ReportDraft {
  if (!value || typeof value !== "object") return editReport([]);
  const raw = value as { selected?: unknown; checked?: unknown };
  const selected = Array.isArray(raw.selected) ? raw.selected.filter((v): v is string => typeof v === "string") : [];
  const draft = editReport(selected);
  return { ...draft, checked: raw.checked === true && !checkReport(draft.selected).empty };
}