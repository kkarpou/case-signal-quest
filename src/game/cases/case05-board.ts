export const boardCategories = [
  { id: 'supported', label: 'Τεκμηριωμένο', description: 'Ο ισχυρισμός στηρίζεται στα διαθέσιμα στοιχεία.' },
  { id: 'unsupported', label: 'Δεν τεκμηριώνεται', description: 'Ο ισχυρισμός προχωρά πέρα από τα στοιχεία.' },
  { id: 'open', label: 'Χρειάζεται έλεγχο', description: 'Το ερώτημα παραμένει ανοιχτό.' },
] as const;
export type BoardCategory = typeof boardCategories[number]['id'];
export const boardClaims: { id: string; text: string; category: BoardCategory; evidenceId: string; feedback: string }[] = [
  { id: 'change', text: 'Από 2% σε 3%: αύξηση κατά 1 ποσοστιαία μονάδα και κατά 50% σε σχετικούς όρους.', category: 'supported', evidenceId: 'E5-A', feedback: 'Η διαφορά είναι 3 − 2 = 1 ποσοστιαία μονάδα. Η σχετική αύξηση είναι (3 − 2) / 2 = 50%. Μετράμε παράπονα καθυστέρησης, όχι κίνδυνο.' },
  { id: 'axis', text: 'Το γράφημα με την κομμένη βάση αποδεικνύει ότι οι αριθμοί είναι πλαστοί.', category: 'unsupported', evidenceId: 'E5-B', feedback: 'Και τα δύο γραφήματα δείχνουν 2% και 3%. Αλλάζει η οπτική ένταση, όχι οι τιμές. Δεν γνωρίζουμε την πρόθεση του δημιουργού.' },
  { id: 'sample', text: '780 από τους 1.000 απαντήσαντες στην ανοιχτή ψηφοφορία τάχθηκαν υπέρ του κλεισίματος.', category: 'supported', evidenceId: 'E5-C', feedback: 'Αυτό ισχύει για όσους απάντησαν. Το αυτοεπιλεγμένο δείγμα δεν τεκμηριώνει ότι το 78% όλης της πόλης συμφωνεί.' },
  { id: 'majority', text: 'Το 51% με αναφερόμενο περιθώριο ±4 αποδεικνύει σαφή πλειοψηφία στον πληθυσμό.', category: 'unsupported', evidenceId: 'E5-D', feedback: 'Το αναφερόμενο εύρος 47–55% περιλαμβάνει το 50%. Δεν δηλώνεται επίπεδο εμπιστοσύνης και δεν τεκμηριώνεται σαφής πλειοψηφία.' },
  { id: 'cause', text: 'Ποια είναι η αιτία που η περιοχή Β έχει περισσότερα παράπονα ανά 1.000 κατοίκους;', category: 'open', evidenceId: 'E5-E', feedback: 'Οι ρυθμοί είναι 1 ανά 1.000 στην Α και 2 ανά 1.000 στη Β. Οι αριθμοί περιγράφουν τη διαφορά· δεν εξηγούν την αιτία της.' },
  { id: 'wait', text: 'Στους πέντε καταγεγραμμένους χρόνους αναμονής, ο μέσος είναι 6 λεπτά και η διάμεσος 2.', category: 'supported', evidenceId: 'E5-F', feedback: 'Το άθροισμα είναι 30 και 30 / 5 = 6. Η μεσαία τιμή είναι 2. Αυτές οι πέντε παρατηρήσεις δεν περιγράφουν όλο το σύστημα.' },
];
export type BoardPlacement = { category?: BoardCategory; evidenceId?: string };
export type EvidenceBoardDraft = { placements: Record<string, BoardPlacement>; checked: boolean };
export function boardReady(draft: EvidenceBoardDraft) {
  return boardClaims.every(c => boardCategories.some(b => b.id === draft.placements[c.id]?.category) && boardClaims.some(b => b.evidenceId === draft.placements[c.id]?.evidenceId));
}
export function normalizeBoard(value: unknown): EvidenceBoardDraft {
  const draft: EvidenceBoardDraft = { placements: {}, checked: false };
  if (!value || typeof value !== 'object') return draft;
  const raw = value as { placements?: Record<string, unknown>; checked?: unknown };
  for (const claim of boardClaims) {
    const p = raw.placements?.[claim.id];
    if (!p || typeof p !== 'object') continue;
    const r = p as BoardPlacement;
    const placement: BoardPlacement = {};
    if (boardCategories.some(b => b.id === r.category)) placement.category = r.category!;
    if (boardClaims.some(b => b.evidenceId === r.evidenceId)) placement.evidenceId = r.evidenceId!;
    draft.placements[claim.id] = placement;
  }
  draft.checked = raw.checked === true && boardReady(draft);
  return draft;
}
export function placeOnBoard(draft: EvidenceBoardDraft, id: string, patch: BoardPlacement): EvidenceBoardDraft {
  return normalizeBoard({ placements: { ...draft.placements, [id]: { ...draft.placements[id], ...patch } }, checked: false });
}
export function reviewBoard(draft: EvidenceBoardDraft) {
  return boardClaims.map(claim => ({ ...claim, categoryCorrect: draft.placements[claim.id]?.category === claim.category, evidenceCorrect: draft.placements[claim.id]?.evidenceId === claim.evidenceId }));
}
