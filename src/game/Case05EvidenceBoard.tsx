import { useState } from 'react';
import { GameButton } from '../components/GameButton';
import { Case05Visual } from './Case05Visual';
import helen from '../assets/team-lead.jpg';
import type { EvidenceCard } from './cases/types';
import { boardCategories, boardClaims, boardReady, placeOnBoard, reviewBoard, type EvidenceBoardDraft } from './cases/case05-board';
import './case-additions.css';

export function Case05EvidenceBoard({ draft, evidence, onChange }: { draft: EvidenceBoardDraft; evidence: EvidenceCard[]; onChange: (draft: EvidenceBoardDraft) => void }) {
  const [selectedId, setSelectedId] = useState(boardClaims[0]!.id);
  const claim = boardClaims.find(c => c.id === selectedId)!;
  const placement = draft.placements[claim.id] ?? {};
  const [sourceId, setSourceId] = useState('E5-A');
  const source = evidence.find(e => e.id === sourceId);
  const assigned = boardClaims.filter(c => draft.placements[c.id]?.category && draft.placements[c.id]?.evidenceId).length;
  return <div className="evidence-workbench">
    <h1 className="font-display text-3xl sm:text-4xl">Ο πίνακας των τεκμηρίων</h1>
    <p>Διάλεξε κάθε κάρτα, τοποθέτησέ την σε μία κατηγορία και σύνδεσέ την με το πιο άμεσο τεκμήριο. Μπορείς να αλλάζεις γνώμη πριν και μετά τον έλεγχο.</p>
    <p className="font-mono text-sm" role="status">{assigned} / {boardClaims.length} κάρτες συνδεδεμένες</p>
    <div className="board-workspace">
      <nav aria-label="Κάρτες προς ταξινόμηση" className="board-card-list">
        {boardClaims.map((c, i) => <button key={c.id} type="button" aria-pressed={c.id === selectedId} onClick={() => setSelectedId(c.id)} className="board-claim">
          <strong>ΚΑΡΤΑ {i + 1}</strong><span>{c.text}</span>
          <small>{boardCategories.find(b => b.id === draft.placements[c.id]?.category)?.label ?? 'Χωρίς κατηγορία'} · {draft.placements[c.id]?.evidenceId ?? 'Χωρίς τεκμήριο'}</small>
        </button>)}
      </nav>
      <section className="board-editor" aria-label="Τοποθέτηση κάρτας">
        <h2 className="font-display text-xl">{claim.text}</h2>
        <fieldset className="mt-4"><legend className="mb-2 font-bold">Σε ποια κατηγορία ανήκει;</legend>
          {boardCategories.map(b => <label className="board-category" key={b.id}><input type="radio" name="board-category" value={b.id} checked={placement.category === b.id} onChange={() => onChange(placeOnBoard(draft, claim.id, { category: b.id }))} /><span><strong>{b.label}</strong><small>{b.description}</small></span></label>)}
        </fieldset>
        <label className="mt-4 block font-bold" htmlFor="board-evidence">Με ποιο τεκμήριο τη συνδέεις;</label>
        <select id="board-evidence" className="board-select" value={placement.evidenceId ?? ''} onChange={e => onChange(placeOnBoard(draft, claim.id, { evidenceId: e.target.value }))}>
          <option value="" disabled>Διάλεξε τεκμήριο</option>{evidence.map(e => <option key={e.id} value={e.id}>{e.id} · {e.title}</option>)}
        </select>
        <details className="mt-5"><summary className="cursor-pointer py-3 font-bold">Ξαναδές τα στοιχεία</summary>
          <label htmlFor="board-source" className="text-sm">Άνοιγμα τεκμηρίου για ανάγνωση</label>
          <select id="board-source" className="board-select" value={sourceId} onChange={e => setSourceId(e.target.value)}>{evidence.map(e => <option key={e.id} value={e.id}>{e.id} · {e.title}</option>)}</select>
          {source && <div className="mt-3"><Case05Visual evidenceId={source.id} /><ul className="mt-3 space-y-2 text-sm">{source.lines.map(l => <li key={l}>{l}</li>)}</ul></div>}
        </details>
      </section>
    </div>
    <section aria-label="Σύνοψη πίνακα" className="board-summary">
      {boardCategories.map(b => <div key={b.id}><h2>{b.label}</h2><ul>{boardClaims.filter(c => draft.placements[c.id]?.category === b.id).map(c => <li key={c.id}>{c.text}<small>{draft.placements[c.id]?.evidenceId ?? 'Χωρίς τεκμήριο'}</small></li>)}</ul>{!boardClaims.some(c => draft.placements[c.id]?.category === b.id) && <p>Δεν έχει τοποθετηθεί κάρτα.</p>}</div>)}
    </section>
    <GameButton disabled={!boardReady(draft)} onClick={() => onChange({ ...draft, checked: true })}>Έλεγχος πίνακα</GameButton>
    {!boardReady(draft) && <p className="text-sm">Σύνδεσε και τις έξι κάρτες με κατηγορία και τεκμήριο για να ζητήσεις έλεγχο.</p>}
    {draft.checked && <section className="board-review" aria-label="Σχόλιο της Helen" aria-live="polite">
      <div className="flex items-center gap-3"><img src={helen} alt="" className="h-16 w-16 object-cover" /><h2 className="font-display text-xl">HELEN · Έλεγχος τεκμηρίωσης</h2></div>
      <p>Ας δούμε τι στηρίζεται και πού χρειάζεται πιο προσεκτική διατύπωση. Μπορείς να αναθεωρήσεις ή να συνεχίσεις στην αναφορά.</p>
      {reviewBoard(draft).map(r => <article key={r.id}><h3>{r.categoryCorrect && r.evidenceCorrect ? 'Τεκμηριωμένη σύνδεση' : 'Χρειάζεται αναθεώρηση'} · {r.text}</h3><p>{r.feedback}</p><p className="text-sm"><strong>Κατηγορία:</strong> {boardCategories.find(b => b.id === r.category)!.label} · <strong>Τεκμήριο:</strong> {r.evidenceId}</p></article>)}
    </section>}
  </div>;
}
