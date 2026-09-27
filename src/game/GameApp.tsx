import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, ChevronDown, CircleHelp, FileSearch, Fingerprint, Globe2, LockKeyhole, Moon, Network, Play, Radio, RotateCcw, Search, ShieldCheck, Sun, TimerReset, TriangleAlert } from "lucide-react";
import { GameButton } from "../components/GameButton";
import keyArt from "../assets/signal-files-keyart.jpg";
import teamArt from "../assets/signal-team.jpg";
import { decisionByAct, decisions, skillLabels, type Decision, type SkillKey } from "./game-data";

const STORAGE_KEY = "the-signal-files-case-01";
const THEME_KEY = "the-signal-files-theme";
const TOTAL_ACTS = 16;

type GameState = {
  sourceVerified: boolean;
  contentMiscontextualized: boolean;
  coordinationEvidence: "none" | "insufficient";
  foreignAmplification: boolean;
  attributionConfidence: "unset" | "low" | "medium" | "high";
  responseChoice: string | null;
  decisions: Record<string, string>;
  revisedDecisions: string[];
  skillScores: Record<SkillKey, number>;
  currentAct: number;
  completed: boolean;
};

const initialState: GameState = {
  sourceVerified: false,
  contentMiscontextualized: false,
  coordinationEvidence: "none",
  foreignAmplification: false,
  attributionConfidence: "unset",
  responseChoice: null,
  decisions: {},
  revisedDecisions: [],
  skillScores: { source: 54, network: 50, evidence: 52, uncertainty: 50, response: 52 },
  currentAct: 0,
  completed: false,
};

const team = {
  lead: { name: "UNIT LEAD", role: "Επικεφαλής μονάδας", initials: "UL", tone: "bg-signal text-signal-foreground" },
  mara: { name: "MARA", role: "Ανάλυση πηγών & περιεχομένου", initials: "MA", tone: "bg-warning text-warning-foreground" },
  leo: { name: "LEO", role: "Ανάλυση δικτύων", initials: "LE", tone: "bg-primary text-primary-foreground" },
  noor: { name: "NOOR", role: "Κοινωνία πολιτών & απόκριση", initials: "NO", tone: "bg-alert text-alert-foreground" },
};

function clamp(value: number) { return Math.max(0, Math.min(100, value)); }

export function GameApp() {
  const [view, setView] = useState<"hub" | "case">("hub");
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selected, setSelected] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revising, setRevising] = useState(false);
  const choiceRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (stored) {
      try { setState({ ...initialState, ...JSON.parse(stored) }); } catch { window.localStorage.removeItem(STORAGE_KEY); }
    }
    if (storedTheme === "light") setTheme("light");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    if (hydrated) window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const activeDecision = decisionByAct[state.currentAct] as Decision | undefined;

  useEffect(() => {
    setSelected(activeDecision ? state.decisions[activeDecision.id] ?? null : null);
    setShowWhy(false);
    setShowHint(false);
    setRevising(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.currentAct, activeDecision, state.decisions]);

  useEffect(() => {
    if (view !== "case") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h" && activeDecision && !selected) {
        event.preventDefault(); setShowHint((value) => !value);
      }
      if (event.key === "Escape") {
        if (selected) { setSelected(null); setRevising(true); }
        else setView("hub");
      }
      if ((event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowLeft") && activeDecision && !selected) {
        const buttons = Array.from(choiceRegionRef.current?.querySelectorAll<HTMLButtonElement>("button[data-choice]") ?? []);
        if (!buttons.length) return;
        event.preventDefault();
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        buttons[(current + step + buttons.length) % buttons.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, activeDecision, selected]);

  const choose = (decision: Decision, choiceId: string) => {
    const previous = state.decisions[decision.id];
    const choice = decision.choices.find((item) => item.id === choiceId);
    if (!choice) return;
    setState((current) => {
      const scores = { ...current.skillScores };
      Object.entries(choice.delta).forEach(([key, value]) => { scores[key as SkillKey] = clamp(scores[key as SkillKey] + value); });
      return {
        ...current,
        sourceVerified: decision.id === "sourceLab" && choiceId === "provenance" ? true : current.sourceVerified,
        contentMiscontextualized: decision.id === "proven" && choiceId === "miscontext" ? true : current.contentMiscontextualized,
        coordinationEvidence: decision.id === "final" ? "insufficient" : current.coordinationEvidence,
        foreignAmplification: decision.id === "foreign" ? true : current.foreignAmplification,
        attributionConfidence: decision.id === "confidence" ? choiceId as GameState["attributionConfidence"] : current.attributionConfidence,
        responseChoice: decision.id === "response" ? choiceId : current.responseChoice,
        decisions: { ...current.decisions, [decision.id]: choiceId },
        revisedDecisions: previous && previous !== choiceId && !current.revisedDecisions.includes(decision.id)
          ? [...current.revisedDecisions, decision.id] : current.revisedDecisions,
        skillScores: scores,
      };
    });
    setSelected(choiceId);
    setRevising(false);
  };

  const next = () => {
    setState((current) => ({ ...current, currentAct: Math.min(TOTAL_ACTS - 1, current.currentAct + 1), completed: current.currentAct >= 14 || current.completed }));
  };

  const reset = () => {
    if (!window.confirm("Να διαγραφεί όλη η πρόοδος του CASE 01;")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState); setView("hub");
  };

  if (!hydrated) return <div className="grid min-h-screen place-items-center bg-background"><span className="stamp">ΦΟΡΤΩΣΗ ΑΡΧΕΙΩΝ…</span></div>;

  return (
    <div className={view === "case" ? "h-svh overflow-hidden bg-background text-foreground" : "min-h-screen bg-background text-foreground"}>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setView("hub")} className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring" aria-label="Επιστροφή στο Season Hub">
            <span className="block truncate font-display text-lg font-black uppercase sm:text-xl">THE SIGNAL FILES</span>
            <span className="block truncate text-[10px] font-bold uppercase text-muted-foreground">ΜΟΝΑΔΑ ΑΚΕΡΑΙΟΤΗΤΑΣ ΠΛΗΡΟΦΟΡΙΑΣ</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            {view === "case" && <span className="hidden border-r border-border pr-3 text-xs font-black text-signal sm:block">{String(state.currentAct + 1).padStart(2, "0")} / {TOTAL_ACTS}</span>}
            <GameButton variant="ghost" className="min-h-11 min-w-11 px-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Ενεργοποίηση φωτεινού θέματος" : "Ενεργοποίηση σκοτεινού θέματος"}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </GameButton>
          </div>
        </div>
        {view === "case" && <div className="h-1 bg-muted"><div className="h-full bg-signal transition-all" style={{ width: `${((state.currentAct + 1) / TOTAL_ACTS) * 100}%` }} /></div>}
      </header>

      <main className={view === "case" ? "h-[calc(100svh-4.25rem)] overflow-hidden" : ""}>
        {view === "hub" ? (
          <Hub state={state} onPlay={() => setView("case")} onReset={reset} />
        ) : (
          <CaseScreen
            state={state} decision={activeDecision} selected={selected} showWhy={showWhy} showHint={showHint} revising={revising}
            choiceRegionRef={choiceRegionRef} onChoose={choose} onNext={next} onWhy={() => setShowWhy((value) => !value)}
            onHint={() => setShowHint((value) => !value)} onRevise={() => { setSelected(null); setRevising(true); setShowWhy(false); }}
            onHub={() => setView("hub")}
          />
        )}
      </main>
    </div>
  );
}

function Hub({ state, onPlay, onReset }: { state: GameState; onPlay: () => void; onReset: () => void }) {
  const hasProgress = state.currentAct > 0 || Object.keys(state.decisions).length > 0;
  const futureCases = [
    ["CASE 02", "THE ECHO", "23 λογαριασμοί. Ένα κείμενο. Λίγα δευτερόλεπτα."],
    ["CASE 03", "THE SOURCE", "Η πηγή φαίνεται αξιόπιστη. Μέχρι να κοιτάξεις πιο κοντά."],
    ["CASE 04", "THE CUT", "Τι αλλάζει όταν λείπουν δώδεκα κρίσιμα δευτερόλεπτα;"],
    ["CASE 05", "THE CROWD", "Η πλειοψηφία μιλά. Είναι όμως πραγματική;"],
    ["CASE 06", "THE ATTRIBUTION", "Το δυσκολότερο ερώτημα: ποιος ευθύνεται;"],
  ];
  return (
    <div className="pb-20">
      <section className="relative min-h-[72svh] overflow-hidden border-b-2 border-border">
        <img src={keyArt} alt="Εικονογραφημένος φάκελος έρευνας με σταθμό, κινητό και δίκτυο διάδοσης" width={1536} height={1024} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 lg:pb-14">
          <span className="stamp w-fit">SEASON 01 · ΦΑΚΕΛΟΙ ΠΛΗΡΟΦΟΡΙΑΣ</span>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] text-hero-foreground sm:text-7xl lg:text-8xl">THE SIGNAL<br />FILES</h1>
          <p className="mt-5 max-w-xl text-base font-semibold text-hero-muted sm:text-lg">Ερεύνησε το περιεχόμενο. Χαρτογράφησε τη διάδοση. Μίλα μόνο μέχρι εκεί που φτάνουν τα στοιχεία.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <GameButton onClick={onPlay} icon={hasProgress ? <ArrowRight size={18} /> : <Play size={18} />}>
              {state.completed ? "ΞΑΝΑΔΕΣ ΤΗΝ ΑΝΑΦΟΡΑ" : hasProgress ? "ΣΥΝΕΧΙΣΗ ΥΠΟΘΕΣΗΣ" : "ΑΝΟΙΓΜΑ ΦΑΚΕΛΟΥ"}
            </GameButton>
            {hasProgress && <GameButton variant="secondary" onClick={onReset} icon={<RotateCcw size={18} />}>ΕΠΑΝΑΦΟΡΑ</GameButton>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b-2 border-border pb-4">
          <div className="min-w-0"><span className="kicker">SEASON HUB</span><h2 className="mt-1 font-display text-3xl font-black uppercase">ΕΝΕΡΓΕΣ ΥΠΟΘΕΣΕΙΣ</h2></div>
          <span className="shrink-0 text-xs font-black text-muted-foreground">01 / 06</span>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="case-card border-signal bg-card p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><span className="stamp">ΔΙΑΘΕΣΙΜΟ</span><Radio className="text-signal" aria-hidden="true" /></div>
            <p className="mt-8 text-sm font-black text-signal">CASE 01</p>
            <h3 className="mt-1 font-display text-4xl font-black uppercase">THE VIRAL LIE</h3>
            <p className="mt-3 max-w-lg text-muted-foreground">Μια ψευδής ιστορία εξαπλώνεται. Είναι όμως εκστρατεία;</p>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs font-bold"><span>{state.completed ? "ΟΛΟΚΛΗΡΩΘΗΚΕ" : hasProgress ? `ΠΡΑΞΗ ${state.currentAct + 1} ΑΠΟ ${TOTAL_ACTS}` : "~15 ΛΕΠΤΑ"}</span><ArrowRight className="text-signal" /></div>
          </article>
          {futureCases.map(([number, title, subtitle], index) => (
            <article key={number} className="case-card relative overflow-hidden border-border bg-muted/30 p-5 opacity-75 sm:p-7">
              <div className="flex items-start justify-between gap-4"><span className="stamp-muted">ΚΛΕΙΔΩΜΕΝΟ</span><LockKeyhole aria-hidden="true" /></div>
              <p className="mt-8 text-sm font-black text-muted-foreground">{number}</p><h3 className="mt-1 font-display text-3xl font-black uppercase">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
              {index === 0 && <div className="mt-6 border-l-4 border-alert pl-3 text-xs font-black text-alert">ΕΠΟΜΕΝΟΣ ΦΑΚΕΛΟΣ</div>}
            </article>
          ))}
        </div>
      </section>
      <section className="border-y-2 border-border bg-card"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <img src={teamArt} loading="lazy" alt="Εικονογραφημένη ομάδα τεσσάρων αναλυτών" width={1536} height={1024} className="aspect-[3/2] w-full object-cover" />
        <div><span className="kicker">Η ΟΜΑΔΑ ΣΟΥ</span><h2 className="mt-2 font-display text-3xl font-black uppercase">Τέσσερις οπτικές. Ένα όριο: τα στοιχεία.</h2><p className="mt-4 text-muted-foreground">Η MARA ελέγχει την προέλευση. Ο LEO διαβάζει τα δίκτυα. Η NOOR ζυγίζει την απόκριση. Η Unit Lead ζητά συμπεράσματα που μπορούν να υπερασπιστούν.</p></div>
      </div></section>
    </div>
  );
}

function CaseScreen(props: {
  state: GameState; decision?: Decision; selected: string | null; showWhy: boolean; showHint: boolean; revising: boolean;
  choiceRegionRef: RefObject<HTMLDivElement | null>; onChoose: (decision: Decision, choiceId: string) => void; onNext: () => void;
  onWhy: () => void; onHint: () => void; onRevise: () => void; onHub: () => void;
}) {
  const { state, decision, selected } = props;
  const act = state.currentAct;
  if (decision) return <DecisionScreen {...props} decision={decision} />;
  if (act === 0) return <ColdOpen onNext={props.onNext} />;
  if (act === 3) return <EvidenceReveal onNext={props.onNext} />;
  if (act === 5) return <Checkpoint onNext={props.onNext} />;
  if (act === 14) return <Report state={state} onNext={props.onNext} />;
  return <Cliffhanger onHub={props.onHub} />;
}

function ScreenFrame({ children, label }: { children: ReactNode; label: string }) {
  return <section className="game-screen mx-auto h-full max-w-6xl overflow-hidden px-4 pb-20 pt-5 sm:px-6 sm:pb-20 sm:pt-6"><span className="kicker">{label}</span>{children}</section>;
}

function Dialogue({ who, children }: { who: keyof typeof team; children: ReactNode }) {
  const member = team[who];
  return <div className="dialogue mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-3"><div className={`grid size-12 shrink-0 place-items-center rounded-full border-2 border-foreground font-black ${member.tone}`}>{member.initials}</div><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2"><strong className="text-sm">{member.name}</strong><span className="text-[10px] font-bold uppercase text-muted-foreground">{member.role}</span></div><p className="mt-2 text-sm leading-relaxed sm:text-base">{children}</p></div></div>;
}

function BottomActions({ children }: { children: ReactNode }) {
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background/95 p-3 backdrop-blur"><div className="mx-auto flex max-w-4xl flex-wrap justify-end gap-2">{children}</div></div>;
}

function ColdOpen({ onNext }: { onNext: () => void }) {
  const [count, setCount] = useState(14823);
  useEffect(() => { const timer = window.setInterval(() => setCount((value) => value + Math.floor(Math.random() * 47) + 18), 900); return () => window.clearInterval(timer); }, []);
  return <ScreenFrame label="CASE 01 · COLD OPEN">
    <div className="mt-3 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div><h1 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">THE VIRAL LIE</h1><p className="mt-4 max-w-xl text-lg font-semibold">19 δευτερόλεπτα. Ένας φωτισμένος σταθμός. Μια λεζάντα που ουρλιάζει «ΕΚΡΗΞΗ ΤΩΡΑ».</p><Dialogue who="lead">Έχουμε αναφορές πανικού στον Κεντρικό Σταθμό της Νεάπολης. Οι υπηρεσίες δεν επιβεβαιώνουν έκρηξη. Θέλω συμπέρασμα που να αντέχει — όχι το γρηγορότερο.</Dialogue></div>
      <article className="rotate-paper border-2 border-border bg-card p-4 shadow-editorial"><div className="flex items-center gap-3 border-b border-border pb-3"><div className="grid size-10 place-items-center rounded-full bg-alert font-black text-alert-foreground">!</div><div><strong>@citywire_now</strong><p className="text-xs text-muted-foreground">μόλις τώρα · Νεάπολη</p></div></div><div className="relative mt-4 aspect-video overflow-hidden bg-foreground"><img src={keyArt} alt="Καρέ viral βίντεο από σταθμό" width={1536} height={1024} className="size-full object-cover opacity-80" /><div className="absolute inset-0 grid place-items-center"><div className="grid size-16 place-items-center rounded-full border-4 border-hero-foreground bg-alert text-alert-foreground"><Play fill="currentColor" /></div></div><span className="absolute bottom-2 right-2 bg-foreground px-2 py-1 text-xs font-black text-background">0:19</span></div><p className="mt-4 text-xl font-black">ΕΚΡΗΞΗ ΣΤΟΝ ΚΕΝΤΡΙΚΟ ΣΤΑΘΜΟ — ΜΕΙΝΕΤΕ ΜΑΚΡΙΑ</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-black"><span>ΑΝΑΔΗΜΟΣΙΕΥΣΕΙΣ</span><span className="text-2xl text-alert tabular-nums">{count.toLocaleString("el-GR")}</span></div></article>
    </div><BottomActions><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>ΑΝΑΛΗΨΗ ΥΠΟΘΕΣΗΣ</GameButton></BottomActions>
  </ScreenFrame>;
}

function DecisionScreen({ decision, selected, showWhy, showHint, revising, choiceRegionRef, onChoose, onNext, onWhy, onHint, onRevise }: {
  decision: Decision; selected: string | null; showWhy: boolean; showHint: boolean; revising: boolean; choiceRegionRef: RefObject<HTMLDivElement | null>;
  onChoose: (decision: Decision, choiceId: string) => void; onNext: () => void; onWhy: () => void; onHint: () => void; onRevise: () => void;
}) {
  const choice = decision.choices.find((item) => item.id === selected);
  return <ScreenFrame label={decision.eyebrow}>
    <div className="decision-layout mt-2 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
      <div><h1 className="screen-title font-display text-3xl font-black uppercase leading-none sm:text-5xl">{decision.title}</h1><p className="screen-prompt mt-3 max-w-2xl text-base font-semibold leading-relaxed sm:text-lg">{decision.prompt}</p>
        {revising && <div className="mt-5 border-l-4 border-warning bg-warning/10 p-4 text-sm"><strong>ΑΝΑΘΕΩΡΗΣΗ</strong><p className="mt-1 text-muted-foreground">Διάλεξε ξανά. Η αλλαγή συμπεράσματος όταν αλλάζει η αξιολόγηση είναι αναλυτική δύναμη.</p></div>}
        {!selected && <div ref={choiceRegionRef} className="choice-grid mt-4 grid gap-2" role="group" aria-label={decision.prompt}>{decision.choices.map((item, index) => <GameButton key={item.id} data-choice variant="option" className="choice-button min-h-13 justify-start py-2 normal-case" onClick={() => onChoose(decision, item.id)} autoFocus={index === 0}><span className="grid size-7 shrink-0 place-items-center rounded-full border border-current text-xs">{String.fromCharCode(65 + index)}</span><span>{item.label}</span></GameButton>)}</div>}
        {!selected && <button onClick={onHint} className="hint-button mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-black text-signal underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"><CircleHelp size={18} />ΥΠΟΔΕΙΞΗ <span className="hidden font-normal text-muted-foreground sm:inline">(H)</span></button>}
        {showHint && !selected && <div className="hint-panel mt-2 border-l-4 border-signal bg-accent p-3 text-sm"><strong>ΚΟΙΤΑ ΠΙΟ ΚΟΝΤΑ:</strong> {decision.hint}</div>}
      </div>
      <aside className="min-w-0">{selected && choice ? <Feedback decision={decision} choice={choice} showWhy={showWhy} onWhy={onWhy} /> : <EvidenceSidecar act={decision.act} />}</aside>
    </div>
    {selected && <BottomActions>{decision.critical && <GameButton variant="secondary" onClick={onRevise} icon={<RotateCcw size={18} />}>ΑΝΑΘΕΩΡΗΣΗ</GameButton>}<GameButton variant="secondary" onClick={onWhy} icon={<CircleHelp size={18} />}>ΓΙΑΤΙ;</GameButton><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>ΣΥΝΕΧΕΙΑ</GameButton></BottomActions>}
  </ScreenFrame>;
}

function EvidenceSidecar({ act }: { act: number }) {
  if (act === 6) return <TimelineVisual />;
  if (act === 7) return <NetworkVisual />;
  if (act === 8) return <article className="evidence-card"><Globe2 className="text-signal" size={30} /><span className="stamp-muted mt-5 w-fit">ΝΕΟ ΣΗΜΑ</span><h2 className="mt-3 text-2xl font-black">worldpulse.media</h2><p className="mt-2 text-muted-foreground">Το ίδιο αφήγημα δημοσιεύεται σε τρεις γλώσσες.</p><dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">ΠΡΩΤΗ ΕΜΦΑΝΙΣΗ</dt><dd className="font-black">20:21</dd></div><div><dt className="text-muted-foreground">ΓΛΩΣΣΕΣ</dt><dd className="font-black">3</dd></div></dl></article>;
  if (act === 9) return <article className="evidence-card"><TimerReset className="text-warning" size={30} /><h2 className="mt-4 text-2xl font-black">ΧΡΟΝΙΚΗ ΚΑΤΕΥΘΥΝΣΗ</h2><ol className="mt-6 space-y-5 border-l-2 border-border pl-5"><li><strong>19:31</strong><p className="text-sm text-muted-foreground">Αρχική ανάρτηση</p></li><li><strong>19:43</strong><p className="text-sm text-muted-foreground">Repost υψηλής απήχησης</p></li><li><strong>19:47</strong><p className="text-sm text-muted-foreground">Κύρια viral αιχμή</p></li><li className="text-signal"><strong>20:21</strong><p className="text-sm">worldpulse.media</p></li></ol></article>;
  if (act === 10) return <article className="evidence-card"><Radio className="text-alert" size={30} /><h2 className="mt-4 text-2xl font-black">ΠΑΡΑΘΥΡΟ ΑΠΟΚΡΙΣΗΣ</h2><p className="mt-3 text-muted-foreground">Ο ισχυρισμός συνεχίζει να εξαπλώνεται. Η διόρθωση πρέπει να είναι γρήγορη, ακριβής και ανάλογη των στοιχείων.</p></article>;
  if (act >= 11) return <article className="evidence-card"><ShieldCheck className="text-signal" size={30} /><h2 className="mt-4 text-2xl font-black">ΦΑΚΕΛΟΣ ΕΥΡΗΜΑΤΩΝ</h2><ul className="mt-5 space-y-3 text-sm"><li className="flex gap-2"><Check className="shrink-0 text-signal" size={18} />Παλαιό πλάνο, ψευδές πλαίσιο</li><li className="flex gap-2"><Check className="shrink-0 text-signal" size={18} />Αιχμή μετά από influencer</li><li className="flex gap-2"><Check className="shrink-0 text-signal" size={18} />Broadcast cascade</li><li className="flex gap-2"><Check className="shrink-0 text-signal" size={18} />Μεταγενέστερη ξενόγλωσση ενίσχυση</li><li className="flex gap-2 text-muted-foreground"><TriangleAlert className="shrink-0 text-warning" size={18} />Ατελές παρατηρούμενο dataset</li></ul></article>;
  return <article className="evidence-card"><FileSearch className="text-signal" size={30} /><h2 className="mt-4 text-2xl font-black">ΤΡΕΧΟΝΤΑ ΣΤΟΙΧΕΙΑ</h2><p className="mt-3 text-muted-foreground">Ένα βίντεο 19″, μία μη επαληθευμένη λεζάντα και ταχεία διάδοση. Κανένα επιβεβαιωμένο αρχείο προέλευσης ακόμη.</p></article>;
}

function Feedback({ decision, choice, showWhy, onWhy }: { decision: Decision; choice: Decision["choices"][number]; showWhy: boolean; onWhy: () => void }) {
  return <article className={`feedback-card ${choice.correct ? "border-signal" : "border-warning"}`} aria-live="polite"><div className="flex items-center gap-2"><span className={choice.correct ? "stamp" : "stamp-warning"}>{choice.correct ? "ΙΣΧΥΡΗ ΚΡΙΣΗ" : "ΠΡΟΩΡΟ ΣΥΜΠΕΡΑΣΜΑ"}</span></div>
    <FeedbackRow title="Η επιλογή σου" text={choice.label} icon={<Fingerprint size={18} />} />
    <FeedbackRow title="Τι δείχνουν τα στοιχεία" text={decision.evidence} icon={<Search size={18} />} />
    <FeedbackRow title="Τι ΔΕΝ μπορούμε ακόμη να συμπεράνουμε" text={decision.cannot} icon={<TriangleAlert size={18} />} />
    <FeedbackRow title="Αρχή" text={decision.principle} icon={<ShieldCheck size={18} />} strong />
    {showWhy && <div className="mt-5 border-t-2 border-dashed border-border pt-5"><h3 className="text-xs font-black uppercase text-signal">ΓΙΑΤΙ;</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{decision.why}</p><p className="mt-3 text-xs font-black">ΚΑΛΥΤΕΡΑ ΥΠΟΣΤΗΡΙΖΟΜΕΝΟ: {decision.best}</p></div>}
    <button className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-black text-signal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring lg:hidden" onClick={onWhy}>{showWhy ? "ΛΙΓΟΤΕΡΑ" : "ΠΕΡΙΣΣΟΤΕΡΑ"}<ChevronDown className={showWhy ? "rotate-180" : ""} size={16} /></button>
  </article>;
}

function FeedbackRow({ title, text, icon, strong }: { title: string; text: string; icon: ReactNode; strong?: boolean }) {
  return <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-4 first:border-0"><span className="text-signal">{icon}</span><div><h3 className="text-[11px] font-black uppercase text-muted-foreground">{title}</h3><p className={`mt-1 text-sm leading-relaxed ${strong ? "font-black text-signal" : ""}`}>{text}</p></div></div>;
}

function EvidenceReveal({ onNext }: { onNext: () => void }) {
  return <ScreenFrame label="EVIDENCE REVEAL · MATCH FOUND"><div className="mt-4 grid gap-8 lg:grid-cols-2 lg:items-center"><div><h1 className="font-display text-4xl font-black uppercase sm:text-6xl">27 ΜΗΝΕΣ ΠΡΙΝ</h1><p className="mt-4 text-lg font-semibold">Η αντίστροφη αναζήτηση βρίσκει ακριβές καρέ από τη φανταστική τηλεοπτική παραγωγή «ΝΥΧΤΕΡΙΝΗ ΓΡΑΜΜΗ».</p><Dialogue who="mara">Το αρχείο δεν είναι συνθετικό. Είναι πραγματικό πλάνο από σκηνή γυρισμάτων — αλλά η σημερινή λεζάντα του δίνει ψευδές πλαίσιο.</Dialogue></div><div className="grid gap-3 sm:grid-cols-2"><article className="evidence-card"><span className="stamp-warning">VIRAL POST</span><div className="mt-4 aspect-video overflow-hidden"><img src={keyArt} alt="Καρέ από τη viral ανάρτηση" width={1536} height={1024} className="size-full object-cover" /></div><p className="mt-3 text-sm font-black">ΣΗΜΕΡΑ · «ΕΚΡΗΞΗ»</p></article><article className="evidence-card"><span className="stamp">ARCHIVE MATCH · 98%</span><div className="mt-4 aspect-video overflow-hidden grayscale"><img src={keyArt} alt="Αρχειακό καρέ της τηλεοπτικής παραγωγής" width={1536} height={1024} className="size-full object-cover" /></div><p className="mt-3 text-sm font-black">ΠΡΙΝ 27 ΜΗΝΕΣ · TV PRODUCTION</p></article></div></div><BottomActions><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>ΚΑΤΑΓΡΑΦΗ ΕΥΡΗΜΑΤΟΣ</GameButton></BottomActions></ScreenFrame>;
}

function Checkpoint({ onNext }: { onNext: () => void }) {
  const columns = [
    { title: "ΤΙ ΞΕΡΟΥΜΕ", tone: "border-signal", items: ["Το βίντεο είναι 27 μηνών.", "Προέρχεται από τηλεοπτική παραγωγή.", "Δεν δείχνει σημερινή έκρηξη."] },
    { title: "ΤΙ ΥΠΟΨΙΑΖΟΜΑΣΤΕ", tone: "border-warning", items: ["Η δραματική λεζάντα επιτάχυνε τη διάδοση.", "Λογαριασμοί μεγάλης απήχησης ίσως έπαιξαν κρίσιμο ρόλο."] },
    { title: "ΤΙ ΔΕΝ ΞΕΡΟΥΜΕ", tone: "border-alert", items: ["Ποιος άλλαξε πρώτος το πλαίσιο.", "Αν υπήρχε πρόθεση εξαπάτησης.", "Αν υπήρξε συντονισμός."] },
  ];
  return <ScreenFrame label="ANALYSIS CHECKPOINT"><h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">ΣΤΑΜΑΤΑ. ΧΩΡΙΣΕ ΤΑ ΕΠΙΠΕΔΑ.</h1><Dialogue who="lead">Πριν δεις το δίκτυο, κλείδωσε τη διαφορά ανάμεσα σε εύρημα, υπόθεση και κενό. Οι κακές αναλύσεις αρχίζουν όταν οι τρεις στήλες συγχέονται.</Dialogue><div className="mt-8 grid gap-4 lg:grid-cols-3">{columns.map((column) => <article key={column.title} className={`case-card border-t-8 bg-card p-5 ${column.tone}`}><h2 className="font-display text-xl font-black">{column.title}</h2><ul className="mt-5 space-y-4">{column.items.map((item) => <li key={item} className="flex gap-3 text-sm"><span className="mt-2 size-2 shrink-0 bg-current" />{item}</li>)}</ul></article>)}</div><BottomActions><GameButton onClick={onNext} icon={<Network size={18} />}>ΑΝΟΙΓΜΑ ΔΙΚΤΥΟΥ</GameButton></BottomActions></ScreenFrame>;
}

function TimelineVisual() {
  return <article className="evidence-card"><div className="flex items-center justify-between"><BarChart3 className="text-signal" /><span className="stamp-muted">19:31—20:21</span></div><h2 className="mt-4 text-2xl font-black">ΡΥΘΜΟΣ ΔΙΑΔΟΣΗΣ</h2><div className="mt-7 flex h-48 items-end gap-1 border-b-2 border-l-2 border-border p-2">{[8,10,13,18,25,33,82,96,88,73,64,58,51,47].map((height, index) => <div key={index} className={`min-w-0 flex-1 ${index === 6 ? "bg-alert" : "bg-signal"}`} style={{ height: `${height}%` }} />)}</div><div className="mt-3 grid grid-cols-2 text-xs font-black"><span>19:31</span><span className="text-right">20:21</span></div><div className="mt-5 border-l-4 border-alert pl-3"><strong>19:43 · REPOST</strong><p className="text-sm text-muted-foreground">2,4 εκατ. ακόλουθοι</p></div></article>;
}

function NetworkVisual() {
  const nodes = [[50,50],[14,20],[18,70],[85,18],[88,72],[50,10],[52,90],[28,42],[74,46],[34,82],[68,80],[25,12],[78,10]];
  return <article className="evidence-card"><div className="flex items-center justify-between"><Network className="text-signal" /><span className="stamp-muted">612 ΚΟΜΒΟΙ</span></div><h2 className="mt-4 text-2xl font-black">CASCADE MAP</h2><svg className="mt-5 aspect-square w-full" viewBox="0 0 100 100" role="img" aria-label="Δίκτυο με έναν κεντρικό κόμβο και ακτινωτές αναμεταδόσεις">{nodes.slice(1).map((node, index) => <line key={`l-${index}`} x1="50" y1="50" x2={node[0]} y2={node[1]} className="stroke-border" strokeWidth="1" />)}{nodes.map((node, index) => <circle key={`n-${index}`} cx={node[0]} cy={node[1]} r={index === 0 ? 8 : index % 3 === 0 ? 4 : 2.5} className={index === 0 ? "fill-alert" : "fill-signal"} />)}</svg><p className="text-center text-xs font-black text-muted-foreground">ΕΝΑΣ ΚΕΝΤΡΙΚΟΣ ΠΟΜΠΟΣ · ΠΟΛΛΕΣ ΑΚΤΙΝΕΣ</p></article>;
}

function Report({ state, onNext }: { state: GameState; onNext: () => void }) {
  const correct = decisions.filter((decision) => decision.choices.find((choice) => choice.id === state.decisions[decision.id])?.correct).length;
  const strongest = (Object.entries(state.skillScores) as [SkillKey, number][]).sort((a, b) => b[1] - a[1])[0];
  const needsWork = (Object.entries(state.skillScores) as [SkillKey, number][]).sort((a, b) => a[1] - b[1])[0];
  return <ScreenFrame label="CASE REPORT · 01"><div className="mt-3 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><span className="stamp">ΦΑΚΕΛΟΣ ΟΛΟΚΛΗΡΩΘΗΚΕ</span><h1 className="mt-5 font-display text-5xl font-black uppercase leading-none">ΚΑΘΑΡΟ ΣΗΜΑ.<br />ΠΡΟΣΕΚΤΙΚΟ ΣΥΜΠΕΡΑΣΜΑ.</h1><div className="mt-6 border-l-4 border-signal pl-4"><p className="text-xl font-black">«Δεν υπάρχουν στοιχεία συντονισμένης χειραγώγησης στο παρατηρούμενο dataset.»</p></div><Dialogue who="lead">Δεν σε βαθμολογούμε για το πόσο δραματική ήταν η απάντηση. Σε αξιολογούμε για το αν κάθε λέξη της χωρά μέσα στα στοιχεία.</Dialogue></div><div><article className="evidence-card"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-black">ΠΡΟΦΙΛ ΔΕΞΙΟΤΗΤΩΝ</h2><span className="text-xs font-black text-muted-foreground">{correct}/{decisions.length} ΙΣΧΥΡΕΣ ΚΡΙΣΕΙΣ</span></div><div className="mt-7 space-y-5">{(Object.entries(state.skillScores) as [SkillKey, number][]).map(([key, value]) => <div key={key}><div className="mb-2 flex justify-between gap-3 text-sm font-black"><span>{skillLabels[key]}</span><span>{value}</span></div><div className="h-3 border border-border bg-muted"><div className="h-full bg-signal" style={{ width: `${value}%` }} /></div></div>)}</div></article><article className="mt-4 grid gap-4 sm:grid-cols-2"><div className="border-2 border-signal bg-card p-4"><span className="text-xs font-black text-signal">ΙΣΧΥΡΟΤΕΡΟ ΣΗΜΕΙΟ</span><h3 className="mt-2 font-black">{skillLabels[strongest[0]]}</h3><p className="mt-2 text-sm text-muted-foreground">Κράτησες τη σκέψη σου κοντά στα παρατηρήσιμα δεδομένα.</p></div><div className="border-2 border-warning bg-card p-4"><span className="text-xs font-black text-warning">ΕΠΟΜΕΝΗ ΕΣΤΙΑΣΗ</span><h3 className="mt-2 font-black">{skillLabels[needsWork[0]]}</h3><p className="mt-2 text-sm text-muted-foreground">Στην επόμενη υπόθεση, ζήτα ένα ακόμη τεκμήριο πριν ανεβάσεις τη βεβαιότητα.</p></div></article>{state.revisedDecisions.length > 0 && <p className="mt-4 text-sm font-semibold text-signal">Αναθεώρησες {state.revisedDecisions.length} {state.revisedDecisions.length === 1 ? "κρίση" : "κρίσεις"}. Η αναθεώρηση με βάση τα στοιχεία είναι δεξιότητα, όχι αποτυχία.</p>}</div></div><BottomActions><GameButton onClick={onNext} icon={<Radio size={18} />}>ΚΛΕΙΣΙΜΟ ΦΑΚΕΛΟΥ</GameButton></BottomActions></ScreenFrame>;
}

function Cliffhanger({ onHub }: { onHub: () => void }) {
  const posts = ["Το φως έσβησε στις 22:14. Κανείς δεν μιλά.", "Το φως έσβησε στις 22:14. Κανείς δεν μιλά.", "Το φως έσβησε στις 22:14. Κανείς δεν μιλά."];
  return <ScreenFrame label="INCOMING SIGNAL"><div className="mx-auto mt-8 max-w-3xl"><Dialogue who="leo">Πρέπει να δεις αυτό.</Dialogue><div className="mt-8 border-2 border-alert bg-card p-5 shadow-editorial sm:p-8"><div className="flex items-center justify-between gap-4"><div><span className="stamp-warning">ΝΕΟ ΜΟΤΙΒΟ</span><h1 className="mt-4 font-display text-4xl font-black uppercase">23 ΛΟΓΑΡΙΑΣΜΟΙ</h1></div><Radio className="animate-pulse text-alert" size={36} /></div><p className="mt-2 text-lg font-bold">Σχεδόν ίδιο κείμενο. Μέσα σε 11 δευτερόλεπτα.</p><div className="mt-7 space-y-2">{posts.map((post, index) => <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-border bg-background p-3 text-xs"><span className="grid size-8 place-items-center rounded-full bg-muted font-black">{index + 1}</span><span>{post}</span><span className="font-black text-alert">22:14:{String(3 + index * 4).padStart(2, "0")}</span></div>)}</div></div><div className="mt-8 text-center"><span className="kicker">NEXT FILE</span><h2 className="mt-2 font-display text-5xl font-black uppercase">CASE 02<br />THE ECHO</h2><p className="mx-auto mt-4 max-w-md text-muted-foreground">Το μοτίβο είναι ισχυρότερο. Αλλά θυμήσου: μοτίβο ≠ συντονισμός.</p></div></div><BottomActions><GameButton variant="secondary" onClick={onHub} icon={<ArrowLeft size={18} />}>SEASON HUB</GameButton></BottomActions></ScreenFrame>;
}
