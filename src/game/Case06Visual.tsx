import { useEffect, useId, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { GameButton } from "../components/GameButton";
import { briefIdentifier, clientName, companyName, residentAccounts, unresolvedAccounts, unresolvedPosts } from "./cases/account-fixture";

export function Case06Visual({ evidenceId }: { evidenceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState(0);
  const [account, setAccount] = useState(unresolvedAccounts[0]);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!expanded) return;
    const active = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); setExpanded(false); return; }
      if (e.key !== "Tab") return;
      const nodes = Array.from(close.current?.closest("[role=dialog]")?.querySelectorAll<HTMLElement>("button:not([disabled]), input, [tabindex='0']") ?? []);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", key, true);
    return () => { window.removeEventListener("keydown", key, true); document.body.style.overflow = overflow; active?.focus({ preventScroll: true }); };
  }, [expanded]);

  const sheet = () => <div className="case06-paper">
    <p className="case06-sim">ΕΚΠΑΙΔΕΥΤΙΚΗ ΦΑΝΤΑΣΤΙΚΗ ΠΡΟΣΟΜΟΙΩΣΗ · {evidenceId}</p>
    {evidenceId === "E6-A" && <>
      <figure className="case06-invoice"><figcaption>ΑΠΟΚΟΜΜΑ ΕΙΚΟΝΑΣ · ΦΕΡΟΜΕΝΟ «ΤΙΜΟΛΟΓΙΟ»</figcaption><h3>«ΞΕΝΟΣ ΧΡΗΜΑΤΟΔΟΤΗΣ»</h3><p>Περιγραφή στο απόκομμα: «Υποστήριξη επικοινωνίας»</p><p className="case06-redaction">[ΤΜΗΜΑ ΕΙΚΟΝΑΣ ΜΗ ΔΙΑΘΕΣΙΜΟ]</p><p>Φερόμενη συναλλαγή · όχι επαληθευμένη πληρωμή</p></figure>
      <dl><dt>Πρωτότυπο</dt><dd>Μη διαθέσιμο</dd><dt>Αλυσίδα προέλευσης</dt><dd>Δεν έχει επαληθευτεί</dd><dt>Υπογραφή / συναλλαγή</dt><dd>Δεν έχουν αυθεντικοποιηθεί</dd></dl>
    </>}
    {evidenceId === "E6-B" && <><h3>ΧΑΡΤΗΣ ΦΙΛΟΞΕΝΙΑΣ</h3><div className="case06-host-map">{[
      ["Παρατηρητήριο Αστικής Ροής", "urban-flow.example"], ["Λέσχη Βιβλίου", "books.example"], ["Κήπος Γειτονιάς", "garden.example"],
    ].map(([name, domain]) => <div key={domain} className="case06-host-edge"><span><strong>{name}</strong><small>{domain}</small></span><span className="case06-edge-verb">φιλοξενείται σε →</span><strong>Κοινό Νέφος<br /><small>hosting.example</small></strong></div>)}</div><p>Υπόμνημα: κάθε ακμή καταγράφει υπηρεσία φιλοξενίας, όχι ιδιοκτησία ή εντολή. Οι δύο άλλες σελίδες είναι άσχετες, αβλαβείς δραστηριότητες του σεναρίου.</p></>}
    {evidenceId === "E6-C" && <><h3>ΔΗΜΟΣΙΟ ΕΜΠΟΡΙΚΟ ΜΗΤΡΩΟ · ΑΠΟΣΠΑΣΜΑ</h3><dl><dt>Ανάδοχος</dt><dd>{companyName} · τοπική εταιρεία επικοινωνίας</dd><dt>Πελάτης</dt><dd>{clientName} · κατασκευαστής</dd><dt>Αντικείμενο</dt><dd>Δημόσια επικοινωνία</dd><dt>Έλεγχος προέλευσης</dt><dd>Επιβεβαιωμένο μητρώο του φανταστικού σεναρίου</dd></dl><p>Το απόσπασμα δεν περιγράφει συγκεκριμένες τακτικές ή έγκρισή τους.</p></>}
    {evidenceId === "E6-D" && <>
      <div className="case06-tabs" role="group" aria-label="Μέρη της αλυσίδας τεκμηρίων">{["Εντολή", "Επαλήθευση", "Αντιστοίχιση"].map((label, i) => <GameButton key={label} variant="secondary" aria-pressed={tab === i} onClick={() => setTab(i)}>{label}</GameButton>)}</div>
      {tab === 0 && <section><h3>ΠΡΩΤΟΤΥΠΟ BRIEF · {briefIdentifier}</h3><p><strong>Εκδότης:</strong> {companyName}</p><blockquote>«Οι εταιρικοί λογαριασμοί να παρουσιαστούν ως ανεξάρτητοι κάτοικοι. Η διακοπή της προηγούμενης εβδομάδας να παρουσιαστεί ως σημερινή.»</blockquote><p><strong>Πρόγραμμα λογαριασμών:</strong> {unresolvedAccounts.join(", ")}</p><p>Το πρωτότυπο παραδόθηκε εθελοντικά στο σενάριο. Η εφαρμογή εξετάζεται χωριστά στην «Αντιστοίχιση».</p></section>}
      {tab === 1 && <section><h3>ΕΛΕΓΧΟΣ ΑΥΘΕΝΤΙΚΟΤΗΤΑΣ</h3><dl><dt>Πρωτότυπο</dt><dd>{briefIdentifier}</dd><dt>Εταιρικό αρχείο</dt><dd>Ίδιο αναγνωριστικό: {briefIdentifier}</dd><dt>Ανεξάρτητο κανάλι</dt><dd>Γνωστή επίσημη επαφή, εντοπισμένη ανεξάρτητα από το brief</dd><dt>Υπεύθυνος υπογράφων</dt><dd>Επιβεβαίωσε την έκδοση και την εντολή του εγγράφου</dd></dl><p>Η αυθεντικοποίηση δείχνει ποιος εξέδωσε την εντολή. Δεν αποτελεί μόνη της καταγραφή εφαρμογής.</p></section>}
      {tab === 2 && <section><h3>ΕΞΑΓΩΓΗ ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΥ ↔ E2-C</h3><p>Επαληθευμένη εξαγωγή του σεναρίου. Οι ίδιοι πέντε προηγουμένως αταξινόμητοι λογαριασμοί, όχι αυθαίρετη επιλογή από 23.</p><div className="case06-accounts" role="group" aria-label="Πέντε αντιστοιχίσεις">{unresolvedAccounts.map((id) => <GameButton key={id} variant="secondary" aria-pressed={account === id} onClick={() => setAccount(id)}>{id}</GameButton>)}</div><p aria-live="polite"><strong>{account}</strong> → {unresolvedPosts.find((p) => p.account === account)?.post} → {briefIdentifier} · ίδιο ID στην εξαγωγή και στο E2-C</p><table><caption>Αντιστοιχίσεις εφαρμογής στο σενάριο</caption><thead><tr><th>Λογαριασμός E2-C</th><th>Ανάρτηση</th><th>Brief εξαγωγής</th></tr></thead><tbody>{unresolvedPosts.map((p) => <tr key={p.account}><td>{p.account}</td><td>{p.post}</td><td>{briefIdentifier}</td></tr>)}</tbody></table><p>Κείμενο αναρτήσεων: «Το φως έσβησε στις 22:14. Κανείς δεν μιλά.» Η εξαγωγή συνδέει τα IDs με την εντολή παρουσίασης της προηγούμενης διακοπής ως σημερινής.</p></section>}
      <div className="case06-groups"><section><h4>18 · ΔΗΜΟΣΙΟ ΚΑΛΕΣΜΑ</h4><p>{residentAccounts.join(" · ")}</p><p>Τεκμηριωμένη δημόσια συμμετοχή στο E2-C. Δεν έχει τεκμηριωθεί σύνδεση με αυτό το brief.</p></section><section><h4>5 · ΑΝΤΙΣΤΟΙΧΙΣΕΙΣ BRIEF</h4><p>{unresolvedAccounts.join(" · ")}</p><p>Οι ίδιοι πέντε αταξινόμητοι του E2-C. 18 + 5 = 23. Οι αντιστοιχίσεις δεν ορίζουν ανώτατο συνολικό εύρος.</p></section></div>
      <p className="case06-sim">IDs και κωδικός εγγράφου: συνταγμένες ετικέτες προσομοίωσης, όχι ανακτημένα πραγματικά δεδομένα.</p>
    </>}
    {evidenceId === "E6-E" && <><h3>ΣΧΕΤΙΚΗ ΣΕΙΡΑ · ΟΧΙ ΑΚΡΙΒΕΙΣ ΧΡΟΝΟΙ</h3><ol className="case06-timeline"><li>Αρχικές τοπικές αναρτήσεις</li><li>↓ Μεταγενέστερες ξενόγλωσσες αναδημοσιεύσεις</li></ol><table><caption>Έλεγχος ισχυρισμού ξένης σύνδεσης</caption><tbody>{["Εντολή", "Πληρωμή", "Έλεγχος"].map((field) => <tr key={field}><th>{field}</th><td>Δεν βρέθηκε αυθεντικοποιημένο τεκμήριο</td></tr>)}</tbody></table><p>Γλώσσα ≠ γεωγραφία / εθνικότητα. Δεν καταγράφεται σύνδεση χρηματοδότησης στη χρονογραμμή.</p></>}
    {evidenceId === "E6-F" && <><section className="case06-abuse"><h3>ΣΤΟΧΟΠΟΙΗΤΙΚΗ ΑΝΑΡΤΗΣΗ</h3><p>«Ο εθελοντής διαχειρίζεται και τους 23 λογαριασμούς.»</p><p className="case06-redaction">[ΔΙΕΥΘΥΝΣΗ ΑΦΑΙΡΕΘΗΚΕ]</p><p>Δεν παρατίθεται τεκμήριο για την κατηγορία. Δεν εμφανίζονται προσωπικά δεδομένα.</p></section><section className="case06-notice"><h3>ΧΩΡΙΣΤΗ ΕΙΔΟΠΟΙΗΣΗ ΣΥΝΤΗΡΗΣΗΣ</h3><p>«Προγραμματισμένη συντήρηση δικτύου · ενημέρωση κατοίκων.»</p><p>Ανεξάρτητα επαληθευμένη στο φανταστικό μητρώο συντήρησης. Δεν προέρχεται από τη στοχοποιητική ανάρτηση.</p></section></>}
  </div>;
  return <div className="case06-visual" data-evidence={evidenceId}>
    {sheet()}
    <GameButton ref={opener} variant="secondary" icon={<Maximize2 size={18} />} onClick={() => setExpanded(true)} aria-label={`Μεγέθυνση ${evidenceId}`}>Μεγέθυνση</GameButton>
    {expanded && <div className="case06-overlay" onMouseDown={(e) => { if (e.currentTarget === e.target) setExpanded(false); }}><section className="case06-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}><header><h2 id={titleId}>ΤΕΚΜΗΡΙΟ {evidenceId}</h2><GameButton ref={close} variant="secondary" icon={<X size={18} />} aria-label="Κλείσιμο μεγέθυνσης" onClick={() => setExpanded(false)}>Κλείσιμο</GameButton></header><div className="case06-dialog-scroll" tabIndex={0}>{sheet()}</div></section></div>}
  </div>;
}