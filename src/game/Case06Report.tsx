import { GameButton } from "../components/GameButton";
import { canFinishReport, checkReport, editReport, reportSentences, type ReportDraft } from "./cases/case06-report";

export function Case06Report({ draft, completed, onChange, onFinish }: { draft: ReportDraft; completed: boolean; onChange: (draft: ReportDraft) => void; onFinish: () => void }) {
  const result = checkReport(draft.selected);
  return <section className="case06-composer">
    <h1 className="font-display text-2xl">ΑΝΑΚΟΙΝΩΣΗ ΠΡΟΣ ΤΗΝ ΚΟΙΝΟΤΗΤΑ</h1><p className="mt-3">Επίλεξε τις προτάσεις που στηρίζονται στα τεκμήρια και έλεγξε το προσχέδιό σου. Η άσκηση δεν δημοσιεύει πραγματική ανακοίνωση.</p>
    <div className="case06-sentence-list">{reportSentences.map((sentence) => <label key={sentence.id}><input type="checkbox" checked={draft.selected.includes(sentence.id)} onChange={(e) => onChange(editReport(e.target.checked ? [...draft.selected, sentence.id] : draft.selected.filter((id) => id !== sentence.id)))} /><span>{sentence.text}</span></label>)}</div>
    <GameButton onClick={() => onChange({ ...draft, checked: !result.empty })}>Έλεγχος ανακοίνωσης</GameButton>
    {result.empty && <p className="case06-draft-note" role="status">Δεν υπάρχει ακόμη ανακοίνωση προς έλεγχο.</p>}
    {draft.checked && <section className="case06-draft-note" aria-live="polite"><h2>{result.accurate ? "Τεκμηριωμένη σύνθεση με σαφή όρια" : "Η σύνθεση χρειάζεται διορθώσεις"}</h2><ul>{result.unsupported.map((s) => <li key={s.id}><strong>Μη στηριζόμενος ισχυρισμός:</strong> {s.feedback}</li>)}{result.missing.map((s) => <li key={s.id}><strong>Απαραίτητο στοιχείο που λείπει:</strong> {s.feedback}</li>)}</ul>{!result.accurate && <p>Μπορείς να αναθεωρήσεις ή να ολοκληρώσεις διατηρώντας ορατές τις επιφυλάξεις της ομάδας.</p>}<h3>Το κείμενό σου μετά τον έλεγχο</h3><ul>{reportSentences.filter((s) => draft.selected.includes(s.id)).map((s) => <li key={s.id}>{s.text}</li>)}</ul></section>}
    <GameButton disabled={!completed && !canFinishReport(draft)} onClick={onFinish}>Ολοκλήρωση φακέλου</GameButton>
  </section>;
}