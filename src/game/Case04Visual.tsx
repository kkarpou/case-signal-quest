import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Eye, Maximize2, X } from "lucide-react";
import { GameButton } from "../components/GameButton";
import { strings as S } from "./strings";

type Case04VisualId = "E4-A" | "E4-B" | "E4-C" | "E4-D" | "E4-E";

type VisualDefinition = {
  src: string;
  alt: string;
  transcript: ReactNode;
};

const visualSources: Record<Case04VisualId, Pick<VisualDefinition, "src" | "alt">> = {
  "E4-A": { src: "/visuals/case04/a-social-clip.svg", alt: S.case04Visuals.alt.clip },
  "E4-B": { src: "/visuals/case04/b-full-context.svg", alt: S.case04Visuals.alt.context },
  "E4-C": { src: "/visuals/case04/c-source-note.svg", alt: S.case04Visuals.alt.source },
  "E4-D": { src: "/visuals/case04/d-disclosed-avatar.svg", alt: S.case04Visuals.alt.avatar },
  "E4-E": { src: "/visuals/case04/e-unverified-message.svg", alt: S.case04Visuals.alt.message },
};

function isCase04VisualId(id: string): id is Case04VisualId {
  return id in visualSources;
}

function TranscriptBlock({ label, children, tone = "neutral" }: { label: string; children: ReactNode; tone?: "neutral" | "caption" | "verified" }) {
  return <section className="case04-transcript-block" data-tone={tone}>
    <h3>{label}</h3>
    <div>{children}</div>
  </section>;
}

function Transcript({ evidenceId, sourceOpen, sourceSelected, onSelectSource }: {
  evidenceId: Case04VisualId;
  sourceOpen: boolean;
  sourceSelected: boolean;
  onSelectSource: () => void;
}) {
  if (evidenceId === "E4-A") return <div className="case04-transcript">
    <TranscriptBlock label={S.case04Visuals.speaker}><p>«Δεν μπορούμε να εγγυηθούμε ότι δεν υπάρχει κίνδυνος.»</p></TranscriptBlock>
    <TranscriptBlock label={S.case04Visuals.postCaption} tone="caption"><p>«Ομολογία άμεσου κινδύνου κατάρρευσης!»</p></TranscriptBlock>
    <p className="case04-caveat">Δεν περιλαμβάνεται η προηγούμενη ερώτηση ή το επόμενο τμήμα.</p>
  </div>;
  if (evidenceId === "E4-B") return <div className="case04-transcript">
    <TranscriptBlock label={S.case04Visuals.previousTwelve} tone="verified"><p><strong>Ερώτηση:</strong> «Κατάρρευση ή μικροκαθυστερήσεις κατά τις εργασίες;»</p><p><strong>Απάντηση:</strong> «Για μικροκαθυστερήσεις. Δεν υπάρχει μηδενικό ρίσκο καθυστέρησης.»</p></TranscriptBlock>
    <TranscriptBlock label={S.case04Visuals.finalEight}><p>«Δεν μπορούμε να εγγυηθούμε ότι δεν υπάρχει κίνδυνος.»</p></TranscriptBlock>
    <p className="case04-caveat">12″ + 8″ = 20″. Οι επιμέρους χρόνοι ομιλίας δεν είναι μετρημένοι.</p>
  </div>;
  if (evidenceId === "E4-C") return <div className="case04-transcript">
    <TranscriptBlock label={S.case04Visuals.primarySource} tone="verified">
      <button type="button" className="case04-source-sentence" aria-pressed={sourceSelected} onClick={onSelectSource}>Οι εργασίες μπορεί να προκαλέσουν καθυστερήσεις.</button>
    </TranscriptBlock>
    <p className="case04-caveat">Πρωτογενής πηγή σεναρίου · επαληθευμένη στο σενάριο. Δεν αποτελεί συνολική τεχνική πιστοποίηση ασφάλειας.</p>
  </div>;
  if (evidenceId === "E4-D") return <div className="case04-transcript">
    <TranscriptBlock label={S.case04Visuals.disclosure}><p>ΣΥΝΘΕΤΙΚΟΣ ΠΑΡΟΥΣΙΑΣΤΗΣ · ΔΕΝ ΕΙΝΑΙ ΠΡΟΣΩΠΟ</p></TranscriptBlock>
    <TranscriptBlock label={S.case04Visuals.avatarText}><p>«Οι εργασίες μπορεί να προκαλέσουν καθυστερήσεις.»</p></TranscriptBlock>
    {sourceOpen && <TranscriptBlock label={S.case04Visuals.comparisonSource} tone="verified"><p>Τεχνικό σημείωμα E4-C: «Οι εργασίες μπορεί να προκαλέσουν καθυστερήσεις.»</p></TranscriptBlock>}
  </div>;
  return <div className="case04-transcript">
    <TranscriptBlock label={S.case04Visuals.displayedName}><p>KATE · Η ταυτότητα αποστολέα δεν έχει επαληθευτεί.</p></TranscriptBlock>
    <TranscriptBlock label={S.case04Visuals.messageTranscript} tone="caption"><p>«Επείγον. Ανεβάστε τις ταυτότητες των κατοίκων στον σύνδεσμο για να προχωρήσουμε.»</p><p className="case04-inert-link">[Σύνδεσμος μεταφόρτωσης ταυτοτήτων]</p></TranscriptBlock>
    <p className="case04-caveat">Στο σενάριο η φωνή μοιάζει με της KATE. Δεν υπάρχει ακόμη επιβεβαίωση από γνωστό κανάλι.</p>
  </div>;
}

export function Case04Visual({ evidenceId }: { evidenceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [shortView, setShortView] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceSelected, setSourceSelected] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setExpanded(false);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = closeRef.current?.closest<HTMLElement>("[role='dialog']");
      const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])") ?? []);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  if (!isCase04VisualId(evidenceId)) return null;
  const shownId: Case04VisualId = evidenceId === "E4-B" && shortView ? "E4-A" : evidenceId;
  const visual = visualSources[shownId];

  const controls = <div className="case04-visual-controls">
    {evidenceId === "E4-B" && <div className="case04-segmented" role="group" aria-label={S.case04Visuals.durationMode}>
      <GameButton variant="secondary" aria-pressed={shortView} onClick={() => setShortView(true)}>{S.case04Visuals.short}</GameButton>
      <GameButton variant="secondary" aria-pressed={!shortView} onClick={() => setShortView(false)}>{S.case04Visuals.full}</GameButton>
    </div>}
    {evidenceId === "E4-D" && <GameButton variant="secondary" aria-expanded={sourceOpen} onClick={() => setSourceOpen((value) => !value)} icon={<Eye size={18} />}>{sourceOpen ? S.case04Visuals.hideSource : S.case04Visuals.compareSource}</GameButton>}
    <GameButton ref={openerRef} variant="secondary" onClick={() => setExpanded(true)} icon={<Maximize2 size={18} />} aria-label={`${S.case04Visuals.enlarge}: ${visual.alt}`}>{S.case04Visuals.enlarge}</GameButton>
  </div>;

  const body = <div className="case04-visual-pair">
    <figure className="case04-figure"><img src={visual.src} alt={visual.alt} width={800} height={960} /><figcaption className="sr-only">{visual.alt}</figcaption></figure>
    <Transcript evidenceId={shownId} sourceOpen={sourceOpen} sourceSelected={sourceSelected} onSelectSource={() => setSourceSelected((value) => !value)} />
  </div>;

  return <>
    <div className="case04-visual-block"><p className="case04-simulation-label">{S.case04Visuals.simulationLabel}</p>{body}{controls}</div>
    {expanded && <div className="case04-visual-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <section className="case04-visual-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="case04-visual-dialog-head"><div><span className="kicker">{S.case04Visuals.fullscreenLabel}</span><h2 id={titleId} className="font-display text-xl font-black">{evidenceId}</h2></div><GameButton ref={closeRef} variant="secondary" className="dialog-close" onClick={() => setExpanded(false)} icon={<X size={20} />} aria-label={S.case04Visuals.close}>{S.case04Visuals.close}</GameButton></header>
        <div className="case04-visual-dialog-scroll"><p className="case04-simulation-label">{S.case04Visuals.simulationLabel}</p>{body}{controls}</div>
      </section>
    </div>}
  </>;
}

export function Case04VerificationReveal({ playerVerified }: { playerVerified: boolean }) {
  const alt = playerVerified ? S.case04Visuals.alt.verificationPlayer : S.case04Visuals.alt.verificationTeam;
  return <section className="case04-verification" aria-live="polite">
    <span className="stamp">{playerVerified ? S.case04Visuals.playerVerification : S.case04Visuals.teamVerification}</span>
    <div className="case04-verification-grid">
      <img src="/visuals/case04/e-verification-reveal.svg" alt={alt} width={800} height={960} />
      <div><h3>{S.case04Visuals.knownChannel}</h3><p><strong>ΕΣΥ:</strong> «Kate, ζήτησες να ανεβάσουμε ταυτότητες κατοίκων;»</p><p><strong>KATE · ΓΝΩΣΤΟ ΚΑΝΑΛΙ:</strong> «Όχι. Δεν έστειλα αυτό το αίτημα.»</p><p className="case04-caveat">Το αίτημα δεν προέρχεται από την KATE. Παραμένει άγνωστο πώς παράχθηκε ο ήχος.</p></div>
    </div>
  </section>;
}