import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Check, ChevronDown, CircleHelp, FileSearch, Fingerprint, Globe2, LockKeyhole, Moon, Network, Play, Radio, RotateCcw, Search, ShieldCheck, Sun, TimerReset, TriangleAlert } from "lucide-react";
import { GameButton } from "../components/GameButton";
import keyArt from "../assets/signal-files-keyart.jpg";
import teamArt from "../assets/signal-team.jpg";
import { strings as S } from "./strings";
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
  lead: { ...S.team.lead, tone: "bg-signal text-signal-foreground" },
  mara: { ...S.team.mara, tone: "bg-warning text-warning-foreground" },
  leo: { ...S.team.leo, tone: "bg-primary text-primary-foreground" },
  noor: { ...S.team.noor, tone: "bg-alert text-alert-foreground" },
};

// Ποιο μέλος της ομάδας «οδηγεί» κάθε απόφαση (μόνο εμφάνιση, καμία επίδραση στη λογική).
const decisionAnalyst: Record<string, keyof typeof team> = {
  classification: "lead", sourceLab: "mara", proven: "mara", spike: "leo", network: "leo",
  foreign: "leo", direction: "leo", response: "noor", final: "lead", confidence: "lead", lesson: "lead",
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
  const [glossaryOpen, setGlossaryOpen] = useState(false);
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
      if (glossaryOpen) return;
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
  }, [view, activeDecision, selected, glossaryOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "g" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setGlossaryOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    if (!window.confirm(S.app.resetConfirm)) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState); setView("hub");
  };

  if (!hydrated) return <div className="grid min-h-screen place-items-center bg-background"><span className="stamp">{S.app.loading}</span></div>;

  return (
    <div className="h-svh overflow-hidden bg-background text-foreground">
      <header className="case-masthead sticky top-0 z-40 border-b-2 border-border bg-background/95">
        <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setView("hub")} className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring" aria-label={S.app.backToHub}>
            <span className="masthead-brand block truncate font-display text-lg font-black uppercase sm:text-xl">{S.app.brand}</span>
            <span className="block truncate font-mono text-[10px] font-bold uppercase text-muted-foreground">{S.app.unit}</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <span className="status-stamp hidden sm:inline-flex">{view === "case" ? S.app.statusCase : S.app.statusSeason}</span>
            {view === "case" && <span className="act-counter border-r border-border px-2 font-mono text-xs font-black text-signal">{String(state.currentAct + 1).padStart(2, "0")} / {TOTAL_ACTS}</span>}
            <GameButton variant="ghost" className="min-h-11 min-w-11 gap-1.5 px-2" onClick={() => setGlossaryOpen(true)} aria-label={S.glossary.open} aria-haspopup="dialog" aria-expanded={glossaryOpen}>
              <BookOpen size={20} aria-hidden="true" />
              <span className="hidden font-mono text-[11px] font-black uppercase lg:inline">{S.glossary.short}</span>
            </GameButton>
            <GameButton variant="ghost" className="min-h-11 min-w-11 px-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? S.app.themeToLight : S.app.themeToDark}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </GameButton>
          </div>
        </div>
        {view === "case" && <div className="case-progress h-1.5 bg-muted"><div className="h-full bg-signal transition-all" style={{ width: `${((state.currentAct + 1) / TOTAL_ACTS) * 100}%` }} /></div>}
      </header>

      <main className={view === "case" ? "h-[calc(100svh-4.25rem)] overflow-hidden" : "h-[calc(100svh-4rem)] overflow-hidden"}>
        {view === "hub" ? (
          <Hub state={state} onPlay={() => setView("case")} onReset={reset} />
        ) : (
          <CaseScreen
            state={state} {...(activeDecision ? { decision: activeDecision } : {})} selected={selected} showWhy={showWhy} showHint={showHint} revising={revising}
            choiceRegionRef={choiceRegionRef} onChoose={choose} onNext={next} onWhy={() => setShowWhy((value) => !value)}
            onHint={() => setShowHint((value) => !value)} onRevise={() => { setSelected(null); setRevising(true); setShowWhy(false); }}
            onHub={() => setView("hub")}
          />
        )}
      </main>
      <Glossary open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}

function Hub({ state, onPlay, onReset }: { state: GameState; onPlay: () => void; onReset: () => void }) {
  const hasProgress = state.currentAct > 0 || Object.keys(state.decisions).length > 0;
  const H = S.hub;
  return (
    <div className="hub-wall hub-fit h-full overflow-hidden">
      <section className="case-wall relative mx-auto flex h-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="wall-thread" aria-hidden="true" />
        <header className="wall-heading relative z-10 shrink-0">
          <span className="stamp">{H.seasonStamp}</span>
          <h1 className="mt-1 font-display text-3xl font-black uppercase leading-[0.86] sm:text-5xl">{H.title}</h1>
          <p className="marker-copy mt-1 max-w-xl text-xs font-semibold sm:text-sm">{H.tagline}</p>
        </header>

        <article className="open-case-file relative z-20 min-h-0 shrink-0 border-2 border-signal bg-card p-3 sm:p-4">
          <div className="open-file-tab">{H.caseTab}</div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center">
            <div className="case-photo relative hidden sm:block"><img src={keyArt} alt={H.caseImageAlt} width={1536} height={1024} className="h-32 w-full object-cover lg:h-40" /><span className="case-photo-mark">{H.caseImageMark}</span><span className="case-photo-ref font-mono">{H.caseImageRef}</span></div>
            <div className="min-w-0"><p className="font-mono text-[11px] font-black text-signal">{H.activeFile}</p><h2 className="mt-1 font-display text-3xl font-black uppercase leading-none sm:text-5xl">{H.caseTitle}</h2><p className="mt-2 max-w-lg text-xs font-semibold sm:text-sm">{H.caseSubtitle}</p>
              <div className="dossier-progress mt-2"><span style={{ width: state.completed ? "100%" : hasProgress ? `${((state.currentAct + 1) / TOTAL_ACTS) * 100}%` : "8%" }} /></div><p className="mt-1 text-[11px] font-black">{state.completed ? H.completed : hasProgress ? H.actProgress(state.currentAct + 1, TOTAL_ACTS) : H.duration}</p>
              <div className="mt-3 flex flex-wrap gap-2"><GameButton onClick={onPlay} icon={hasProgress ? <ArrowRight size={18} /> : <Play size={18} />}>{state.completed ? H.playReport : hasProgress ? H.playContinue : H.playStart}</GameButton>{hasProgress && <GameButton variant="secondary" onClick={onReset} icon={<RotateCcw size={18} />}>{H.reset}</GameButton>}</div>
            </div>
          </div>
        </article>

        <div className="wall-lower grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="future-file-stack min-h-0" aria-labelledby="future-cases-title"><h2 id="future-cases-title" className="sr-only">{H.futureCasesTitle}</h2>{H.futureCases.map(({ number, title, subtitle }, index) => <article key={number} className={`sealed-file sealed-file-${index + 1} border-2 border-border bg-card p-2`}><div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="font-mono text-[10px] font-black text-muted-foreground">{number}</p><h3 className="truncate font-display text-base font-black uppercase sm:text-lg">{title}</h3></div><LockKeyhole className="shrink-0" size={16} aria-hidden="true" /></div><div className="mt-0.5 flex items-center gap-2">{index === 0 && <span className="next-case-mark">{H.nextCaseMark}</span>}<p className="min-w-0 truncate text-[11px] text-muted-foreground">{subtitle}</p></div></article>)}</section>
          <aside className="team-pin relative hidden min-h-0 overflow-hidden border-2 border-border bg-card p-2 lg:flex lg:flex-col" aria-labelledby="team-pin-heading"><img src={teamArt} loading="lazy" alt={H.teamImageAlt} width={1536} height={1024} className="h-14 w-full shrink-0 object-cover" /><span className="team-pin-label">{H.teamLabel}</span><h2 id="team-pin-heading" className="mt-1.5 shrink-0 font-display text-base font-black uppercase leading-tight">{H.teamTitle}</h2><ul className="team-roster mt-1.5 min-h-0 flex-1 space-y-1 overflow-hidden">{H.teamCards.map((member) => <li key={member.initials} className="team-card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2 border border-border/60 bg-background/40 p-1.5"><span className="roster-initials mt-0.5 grid size-6 shrink-0 place-items-center border-2 border-current font-mono text-[10px] font-black" aria-hidden="true">{member.initials}</span><span className="min-w-0"><strong className="block text-[11px] font-black uppercase leading-tight">{member.name} · {member.role}</strong><span className="block text-[10px] font-semibold leading-tight text-signal">{member.specialty}</span><span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">{member.example}</span></span></li>)}</ul></aside>
        </div>
      </section>
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
  return <section className="game-screen case-board mx-auto h-full max-w-6xl overflow-hidden px-4 pb-20 pt-4 sm:px-6 sm:pb-20 sm:pt-5"><div className="act-ruler"><span className="kicker">{label}</span><span className="ruler-line" aria-hidden="true" /></div>{children}</section>;
}

function Dialogue({ who, children }: { who: keyof typeof team; children: ReactNode }) {
  const member = team[who];
  return <div className={`dialogue dialogue-${who} mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-3`} data-speaker={who}><div className="portrait-cutout" data-character={who}><img src={teamArt} alt="" aria-hidden="true" /><span>{member.initials}</span></div><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2"><strong className="text-sm">{member.name}</strong><span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">{member.role}</span></div><p className="mt-2 text-sm leading-relaxed sm:text-base">{children}</p></div></div>;
}

function AnalystTag({ id }: { id: string }) {
  const who = decisionAnalyst[id];
  if (!who) return null;
  const member = team[who];
  return <div className="analyst-tag" data-character={who}><span className="analyst-tag-initials">{member.initials}</span><span className="min-w-0"><span className="analyst-tag-label">{S.decisionUi.analystLabel}</span><strong className="analyst-tag-name">{member.name} · {member.role}</strong><span className="analyst-tag-focus">{member.focus}</span></span></div>;
}

function BottomActions({ children }: { children: ReactNode }) {
  return <div className="bottom-actions fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background/95 p-3"><div className="mx-auto flex max-w-4xl flex-wrap justify-end gap-2">{children}</div></div>;
}

function ColdOpen({ onNext }: { onNext: () => void }) {
  const [count, setCount] = useState(14823);
  useEffect(() => { const timer = window.setInterval(() => setCount((value) => value + Math.floor(Math.random() * 47) + 18), 900); return () => window.clearInterval(timer); }, []);
  return <ScreenFrame label={S.coldOpen.label}>
    <div className="cold-open-layout mt-2 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div><h1 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">{S.coldOpen.title}</h1><p className="mt-4 max-w-xl text-lg font-semibold">{S.coldOpen.intro}</p><Dialogue who="lead">{S.coldOpen.leadLine}</Dialogue></div>
      <article className="viral-post rotate-paper relative border-2 border-border bg-card p-4 shadow-editorial"><div className="tape tape-top" aria-hidden="true" /><span className="unverified-stamp">{S.coldOpen.stamp}</span><div className="flex items-center gap-3 border-b border-border pb-3"><div className="grid size-10 place-items-center bg-alert font-black text-alert-foreground">!</div><div><strong>{S.coldOpen.handle}</strong><p className="text-xs text-muted-foreground">{S.coldOpen.postMeta}</p></div></div><div className="relative mt-4 aspect-video overflow-hidden bg-foreground"><img src={keyArt} alt={S.coldOpen.videoAlt} width={1536} height={1024} className="size-full object-cover opacity-80" /><div className="absolute inset-0 grid place-items-center"><div className="grid size-16 place-items-center rounded-full border-4 border-hero-foreground bg-alert text-alert-foreground"><Play fill="currentColor" /></div></div><span className="absolute bottom-2 right-2 bg-foreground px-2 py-1 text-xs font-black text-background">{S.coldOpen.duration}</span></div><p className="mt-4 text-xl font-black">{S.coldOpen.caption}</p><div className="urgency-strip mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-black"><span>{S.coldOpen.reposts}</span><span className="text-2xl text-alert tabular-nums">{count.toLocaleString(S.meta.numberLocale)}</span></div></article>
    </div><BottomActions><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>{S.coldOpen.action}</GameButton></BottomActions>
  </ScreenFrame>;
}

function DecisionScreen({ decision, selected, showWhy, showHint, revising, choiceRegionRef, onChoose, onNext, onWhy, onHint, onRevise }: {
  decision: Decision; selected: string | null; showWhy: boolean; showHint: boolean; revising: boolean; choiceRegionRef: RefObject<HTMLDivElement | null>;
  onChoose: (decision: Decision, choiceId: string) => void; onNext: () => void; onWhy: () => void; onHint: () => void; onRevise: () => void;
}) {
  const choice = decision.choices.find((item) => item.id === selected);
  return <ScreenFrame label={decision.eyebrow}>
    <div className={`decision-layout scene-decision scene-act-${decision.act} mt-2 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]`}>
      <div className={selected ? "decision-question decision-question-complete" : "decision-question"}><div className="question-sheet"><span className="paper-clip" aria-hidden="true" /><AnalystTag id={decision.id} /><h1 className="screen-title font-display text-3xl font-black uppercase leading-none sm:text-5xl">{decision.title}</h1><p className="screen-prompt mt-3 max-w-2xl text-base font-semibold leading-relaxed sm:text-lg">{decision.prompt}</p></div>
        {revising && <div className="mt-5 border-l-4 border-warning bg-warning/10 p-4 text-sm"><strong>{S.decisionUi.revisingTitle}</strong><p className="mt-1 text-muted-foreground">{S.decisionUi.revisingText}</p></div>}
        {!selected && <div className="mobile-evidence"><EvidenceSidecar act={decision.act} /></div>}
        {!selected && <div ref={choiceRegionRef} className="choice-grid mt-4 grid gap-2" role="group" aria-label={decision.prompt}>{decision.choices.map((item, index) => <GameButton key={item.id} data-choice variant="option" className="choice-button min-h-13 justify-start py-2 normal-case" onClick={() => onChoose(decision, item.id)} autoFocus={index === 0}><span className="choice-letter grid size-8 shrink-0 place-items-center border-2 border-current text-xs">{String.fromCharCode(65 + index)}</span><span>{item.label}</span></GameButton>)}</div>}
        {!selected && <button onClick={onHint} className="hint-button mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-black text-signal underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"><CircleHelp size={18} />{S.decisionUi.hint} <span className="hidden font-normal text-muted-foreground sm:inline">{S.decisionUi.hintKey}</span></button>}
        {showHint && !selected && <div className="hint-panel mt-2 border-l-4 border-signal bg-accent p-3 text-sm"><strong>{S.decisionUi.hintLead}</strong> {decision.hint}</div>}
      </div>
       <aside className={selected ? "decision-sidecar min-w-0" : "decision-sidecar desktop-evidence min-w-0"}>{selected && choice ? <Feedback decision={decision} choice={choice} showWhy={showWhy} onWhy={onWhy} /> : <EvidenceSidecar act={decision.act} />}</aside>
    </div>
    {selected && <BottomActions>{decision.critical && <GameButton variant="secondary" onClick={onRevise} icon={<RotateCcw size={18} />}>{S.decisionUi.revise}</GameButton>}<GameButton variant="secondary" onClick={onWhy} icon={<CircleHelp size={18} />}>{S.decisionUi.why}</GameButton><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>{S.decisionUi.next}</GameButton></BottomActions>}
  </ScreenFrame>;
}

function EvidenceSidecar({ act }: { act: number }) {
  if (act === 6) return <TimelineVisual />;
  if (act === 7) return <NetworkVisual />;
  if (act === 8) return <article className="evidence-card"><Globe2 className="text-signal" size={30} /><span className="stamp-muted mt-5 w-fit">{S.evidence.foreign.stamp}</span><h2 className="mt-3 text-2xl font-black">{S.evidence.foreign.site}</h2><p className="mt-2 text-muted-foreground">{S.evidence.foreign.text}</p><dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">{S.evidence.foreign.firstSeen}</dt><dd className="font-black">{S.evidence.foreign.firstSeenValue}</dd></div><div><dt className="text-muted-foreground">{S.evidence.foreign.languages}</dt><dd className="font-black">{S.evidence.foreign.languagesValue}</dd></div></dl></article>;
  if (act === 9) return <article className="evidence-card"><TimerReset className="text-warning" size={30} /><h2 className="mt-4 text-2xl font-black">{S.evidence.direction.title}</h2><ol className="mt-6 space-y-5 border-l-2 border-border pl-5">{S.evidence.direction.events.map((event, index, all) => <li key={event.time} className={index === all.length - 1 ? "text-signal" : ""}><strong>{event.time}</strong><p className={index === all.length - 1 ? "text-sm" : "text-sm text-muted-foreground"}>{event.label}</p></li>)}</ol></article>;
  if (act === 10) return <article className="evidence-card"><Radio className="text-alert" size={30} /><h2 className="mt-4 text-2xl font-black">{S.evidence.response.title}</h2><p className="mt-3 text-muted-foreground">{S.evidence.response.text}</p></article>;
  if (act >= 11) return <article className="evidence-card"><ShieldCheck className="text-signal" size={30} /><h2 className="mt-4 text-2xl font-black">{S.evidence.findings.title}</h2><ul className="mt-5 space-y-3 text-sm">{S.evidence.findings.confirmed.map((item) => <li key={item} className="flex gap-2"><Check className="shrink-0 text-signal" size={18} />{item}</li>)}<li className="flex gap-2 text-muted-foreground"><TriangleAlert className="shrink-0 text-warning" size={18} />{S.evidence.findings.caveat}</li></ul></article>;
  return <article className="evidence-card"><FileSearch className="text-signal" size={30} /><h2 className="mt-4 text-2xl font-black">{S.evidence.current.title}</h2><p className="mt-3 text-muted-foreground">{S.evidence.current.text}</p></article>;
}

function Feedback({ decision, choice, showWhy, onWhy }: { decision: Decision; choice: Decision["choices"][number]; showWhy: boolean; onWhy: () => void }) {
  return <article className={`feedback-card feedback-reveal verdict-board ${choice.correct ? "feedback-strong border-signal" : "feedback-caution border-warning"}`} aria-live="polite"><div className="verdict-heading"><span className={`${choice.correct ? "stamp" : "stamp-warning"} verdict-stamp`}>{choice.correct ? S.feedback.strong : S.feedback.premature}</span><span className="verdict-case-id font-mono">{S.feedback.caseId}</span></div>
    <FeedbackRow title={S.feedback.yourChoice} text={choice.label} icon={<Fingerprint size={18} />} />
    <FeedbackRow title={S.feedback.evidence} text={decision.evidence} icon={<Search size={18} />} />
    <FeedbackRow title={S.feedback.cannot} text={decision.cannot} icon={<TriangleAlert size={18} />} />
    <FeedbackRow title={S.feedback.principle} text={decision.principle} icon={<ShieldCheck size={18} />} strong />
    {showWhy && <div className="analyst-note mt-5 border-t-2 border-dashed border-border pt-5"><span className="tape tape-top" aria-hidden="true" /><h3 className="font-mono text-xs font-black uppercase text-signal">{S.feedback.whyTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{decision.why}</p><p className="mt-3 text-xs font-black">{S.feedback.bestSupported} {decision.best}</p></div>}
    <button className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-black text-signal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring lg:hidden" onClick={onWhy}>{showWhy ? S.feedback.less : S.feedback.more}<ChevronDown className={showWhy ? "rotate-180" : ""} size={16} /></button>
  </article>;
}

function FeedbackRow({ title, text, icon, strong }: { title: string; text: string; icon: ReactNode; strong?: boolean }) {
  return <div className={`feedback-row mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-4 first:border-0 ${strong ? "feedback-principle" : ""}`}><span className="text-signal">{icon}</span><div><h3 className="font-mono text-[11px] font-black uppercase text-muted-foreground">{title}</h3><p className={`mt-1 text-sm leading-relaxed ${strong ? "font-black text-signal" : ""}`}>{text}</p></div></div>;
}

function EvidenceReveal({ onNext }: { onNext: () => void }) {
  return <ScreenFrame label={S.evidenceReveal.label}><div className="evidence-reveal-layout mt-2 grid gap-5 lg:grid-cols-2 lg:items-center"><div><h1 className="font-display text-3xl font-black uppercase sm:text-5xl">{S.evidenceReveal.title}</h1><p className="marker-copy mt-2 text-base font-semibold sm:text-lg">{S.evidenceReveal.text}</p><Dialogue who="mara">{S.evidenceReveal.maraLine}</Dialogue></div><div className="evidence-pair evidence-comparison relative grid grid-cols-2 gap-2"><span className="comparison-arrow" aria-hidden="true">→</span><article className="evidence-card evidence-print"><span className="stamp-warning">{S.evidenceReveal.viralStamp}</span><div className="mt-2 aspect-video overflow-hidden"><img src={keyArt} alt={S.evidenceReveal.viralAlt} width={1536} height={1024} className="size-full object-cover" /></div><p className="mt-2 text-xs font-black">{S.evidenceReveal.viralCaption}</p><span className="scribble-note">{S.evidenceReveal.viralNote}</span></article><article className="evidence-card evidence-print"><span className="stamp">{S.evidenceReveal.archiveStamp}</span><div className="mt-2 aspect-video overflow-hidden grayscale"><img src={keyArt} alt={S.evidenceReveal.archiveAlt} width={1536} height={1024} className="size-full object-cover" /></div><p className="mt-2 text-xs font-black">{S.evidenceReveal.archiveCaption}</p><span className="scribble-note text-signal">{S.evidenceReveal.archiveNote}</span></article></div></div><BottomActions><GameButton onClick={onNext} icon={<ArrowRight size={18} />}>{S.evidenceReveal.action}</GameButton></BottomActions></ScreenFrame>;
}

function Checkpoint({ onNext }: { onNext: () => void }) {
  const columns = [
    { ...S.checkpoint.known, tone: "border-signal" },
    { ...S.checkpoint.suspected, tone: "border-warning" },
    { ...S.checkpoint.unknown, tone: "border-alert" },
  ];
  return <ScreenFrame label={S.checkpoint.label}><h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-5xl">{S.checkpoint.title}</h1><Dialogue who="lead">{S.checkpoint.leadLine}</Dialogue><div className="checkpoint-grid mt-4 grid gap-2 sm:grid-cols-3 lg:gap-4">{columns.map((column, index) => <article key={column.title} className={`case-card checkpoint-sheet checkpoint-sheet-${index + 1} border-t-8 bg-card p-3 lg:p-5 ${column.tone}`}><span className="tape tape-top" aria-hidden="true" /><h2 className="font-display text-sm font-black lg:text-xl">{column.title}</h2><ul className="mt-2 space-y-1 lg:mt-5 lg:space-y-4">{column.items.map((item) => <li key={item} className="flex gap-2 text-xs leading-snug lg:text-sm"><span className="mt-1.5 size-1.5 shrink-0 bg-current" />{item}</li>)}</ul></article>)}</div><BottomActions><GameButton onClick={onNext} icon={<Network size={18} />}>{S.checkpoint.action}</GameButton></BottomActions></ScreenFrame>;
}

function TimelineVisual() {
  const T = S.timeline;
  return <article className="evidence-card timeline-card signature-evidence"><div className="evidence-meta"><BarChart3 className="text-signal" /><span className="font-mono">{T.range}</span></div><h2 className="mt-1 font-display text-2xl font-black">{T.title}</h2><div className="timeline-plot mt-2" aria-hidden="true"><div className="timeline-axis" />{[8,10,13,18,25,33,82,96,88,73,64,58,51,47].map((height, index) => <div key={index} className={`timeline-bar ${index === 6 ? "timeline-spike" : ""}`} style={{ height: `${height}%` }} />)}<span className="spike-tag">{T.spikeTag}</span><span className="timeline-causal-arrow">↑</span></div><div className="timeline-events mt-2 grid grid-cols-4 gap-1">{T.events.map(({ time, label }, index) => <div key={time} className={index === 1 ? "event-active" : index === 3 ? "event-late" : ""}><strong>{time}</strong><span>{label}</span></div>)}</div><div className="direction-note mt-2"><strong>{T.directionStrong}</strong><span>{T.directionText}</span></div></article>;
}

function NetworkVisual() {
  const nodes = [[50,50],[10,17],[14,73],[91,19],[91,76],[48,7],[52,93],[24,39],[79,44],[30,88],[71,84],[23,8],[80,9],[7,48],[94,50],[35,17],[64,18],[18,58],[82,62]];
  return <article className="evidence-card network-card signature-evidence"><div className="evidence-meta"><Network className="text-signal" /><span className="font-mono">{S.network.nodes}</span></div><div className="flex items-end justify-between gap-3"><h2 className="mt-1 font-display text-xl font-black">{S.network.title}</h2><span className="network-annotation">{S.network.annotation}</span></div><div className="network-stage"><svg className="network-map mx-auto aspect-square w-full" viewBox="0 0 100 100" role="img" aria-label={S.network.ariaLabel}>{nodes.slice(1).map((node, index) => <line key={`l-${index}`} x1="50" y1="50" x2={node[0]} y2={node[1]} className="network-edge stroke-border" strokeWidth={index % 4 === 0 ? "1.4" : "0.8"} style={{ animationDelay: `${index * 35}ms` }} />)}{nodes.slice(7).map((node, index) => <line key={`b-${index}`} x1={node[0]} y1={node[1]} x2={nodes[(index % 6) + 1]?.[0]} y2={nodes[(index % 6) + 1]?.[1]} className="network-edge stroke-signal" strokeOpacity="0.18" strokeWidth="0.45" />)}{nodes.map((node, index) => <circle key={`n-${index}`} cx={node[0]} cy={node[1]} r={index === 0 ? 8 : index % 3 === 0 ? 3.8 : 2.2} className={index === 0 ? "network-hub fill-alert" : index % 4 === 0 ? "fill-warning" : "fill-signal"} />)}<circle cx="50" cy="50" r="12" className="network-ring fill-transparent stroke-alert" strokeWidth="1" /></svg><span className="network-callout network-callout-hub">{S.network.calloutHub}</span><span className="network-callout network-callout-rays">{S.network.calloutRays}</span></div><div className="network-conclusion"><strong>{S.network.conclusionStrong}</strong><span>{S.network.conclusionText}</span></div></article>;
}

function Report({ state, onNext }: { state: GameState; onNext: () => void }) {
  const correct = decisions.filter((decision) => decision.choices.find((choice) => choice.id === state.decisions[decision.id])?.correct).length;
  const scoreEntries = Object.entries(state.skillScores) as [SkillKey, number][];
  const strongest = [...scoreEntries].sort((a, b) => b[1] - a[1])[0] ?? ["source", 0] as const;
  const needsWork = [...scoreEntries].sort((a, b) => a[1] - b[1])[0] ?? ["source", 0] as const;
  return <ScreenFrame label={S.report.label}><article className="report-layout dossier-report closed-dossier mt-2"><div className="dossier-spine" aria-hidden="true">{S.report.spine}</div><div className="report-finding"><span className="stamp">{S.report.stamp}</span><h1 className="mt-3 font-display text-3xl font-black uppercase leading-none lg:text-5xl">{S.report.titleLine1}<br />{S.report.titleLine2}</h1><div className="final-assessment mt-3"><span>{S.report.finalLabel}</span><p className="text-base font-black lg:text-xl">{S.report.finalText}</p></div><div className="report-dialogue"><Dialogue who="lead">{S.report.leadLine}</Dialogue></div></div><div className="report-profile"><section className="skill-sheet"><div className="flex items-center justify-between gap-2"><h2 className="font-display text-lg font-black lg:text-2xl">{S.report.profileTitle}</h2><span className="text-[10px] font-black text-muted-foreground lg:text-xs">{S.report.strongCount(correct, decisions.length)}</span></div><div className="score-bars mt-3 space-y-2 lg:mt-5 lg:space-y-4">{(Object.entries(state.skillScores) as [SkillKey, number][]).map(([key, value]) => <div key={key}><div className="mb-1 flex justify-between gap-3 text-xs font-black lg:mb-2 lg:text-sm"><span>{skillLabels[key]}</span><span>{value}</span></div><div className="skill-track h-2 border border-border bg-muted lg:h-3"><div className="h-full bg-signal" style={{ width: `${value}%` }} /></div></div>)}</div></section><section className="report-notes mt-2 grid grid-cols-2 gap-2 lg:mt-4"><div className="report-margin-note border-l-4 border-signal p-2"><span className="text-[10px] font-black text-signal lg:text-xs">{S.report.strongestLabel}</span><h3 className="mt-1 text-sm font-black lg:text-base">{skillLabels[strongest[0]]}</h3><p className="mt-1 hidden text-xs text-muted-foreground lg:block">{S.report.strongestText}</p></div><div className="report-margin-note border-l-4 border-warning p-2"><span className="text-[10px] font-black text-warning lg:text-xs">{S.report.focusLabel}</span><h3 className="mt-1 text-sm font-black lg:text-base">{skillLabels[needsWork[0]]}</h3><p className="mt-1 hidden text-xs text-muted-foreground lg:block">{S.report.focusText}</p></div></section><section className="report-team-summary mt-2 border-t-2 border-border pt-1.5" aria-labelledby="report-team-heading"><h2 id="report-team-heading" className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">{S.report.teamSummaryTitle}</h2><ul className="mt-1 grid gap-x-3 gap-y-0.5 lg:grid-cols-2">{S.report.teamSummary.map((row) => <li key={row.who} className="flex items-baseline gap-1.5 text-[10px] leading-snug"><strong className="shrink-0 font-black uppercase text-signal">{row.who}</strong><span className="min-w-0 text-muted-foreground lg:line-clamp-2">{row.step}</span></li>)}</ul></section>{state.revisedDecisions.length > 0 && <p className="revision-note mt-2 text-xs font-semibold text-signal lg:mt-3">{S.report.revisions(state.revisedDecisions.length)}</p>}</div></article><BottomActions><GameButton onClick={onNext} icon={<Radio size={18} />}>{S.report.action}</GameButton></BottomActions></ScreenFrame>;
}

function Cliffhanger({ onHub }: { onHub: () => void }) {
  const C = S.cliffhanger;
  const posts = [C.post, C.post, C.post];
  return <ScreenFrame label={C.label}><div className="cliffhanger-layout mx-auto mt-3 grid max-w-5xl gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"><div><Dialogue who="leo">{C.leoLine}</Dialogue><div className="incoming-board mt-3 border-2 border-alert bg-card p-3 shadow-editorial lg:p-5"><div className="fax-edge" aria-hidden="true" /><div className="flex items-center justify-between gap-4"><div><span className="stamp-warning">{C.stamp}</span><h1 className="mt-2 font-display text-3xl font-black uppercase">{C.title}</h1></div><Radio className="signal-pulse text-alert" size={32} /></div><p className="mt-1 text-sm font-bold lg:text-lg">{C.subtitle}</p><div className="post-burst mt-3 space-y-1.5">{posts.map((post, index) => <div key={index} className="intercept-post grid grid-cols-[auto_1fr_auto] items-center gap-2 border border-border bg-background p-2 text-[10px] lg:text-xs"><span className="grid size-7 place-items-center bg-muted font-black">{index + 1}</span><span>{post}</span><span className="font-black text-alert">22:14:{String(3 + index * 4).padStart(2, "0")}</span></div>)}</div></div></div><div className="next-file text-center"><span className="kicker">{C.nextLabel}</span><h2 className="mt-1 font-display text-4xl font-black uppercase lg:text-5xl">{C.nextLine1}<br />{C.nextLine2}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground lg:mt-4">{C.nextText}</p></div></div><BottomActions><GameButton variant="secondary" onClick={onHub} icon={<ArrowLeft size={18} />}>{C.action}</GameButton></BottomActions></ScreenFrame>;
}

function Glossary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => { document.removeEventListener("keydown", onKeyDown, true); opener?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  const G = S.glossary;
  return (
    <div className="glossary-overlay fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-full items-start justify-center p-3 sm:p-6">
        <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="glossary-title" className="glossary-panel rotate-paper relative border-2 border-border bg-card p-4 text-card-foreground shadow-editorial sm:p-6" onClick={(event) => event.stopPropagation()}>
          <div className="tape tape-top" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3 border-b-2 border-border pb-3">
            <div className="min-w-0">
              <h2 id="glossary-title" className="font-display text-2xl font-black uppercase leading-none">{G.title}</h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">{G.subtitle}</p>
            </div>
            <button ref={closeRef} onClick={onClose} aria-label={G.close} className="grid size-11 shrink-0 place-items-center border-2 border-border bg-secondary font-black transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring">✕</button>
          </div>
          <dl className="glossary-list">
            {G.terms.map(({ term, definition, example }) => (
              <div key={term} className="glossary-term border-b border-dashed border-border py-3 last:border-0">
                <dt className="font-display text-base font-black uppercase leading-tight text-signal sm:text-lg">{term}</dt>
                <dd className="mt-1 text-sm leading-relaxed">{definition}</dd>
                <p className="mt-2 text-sm leading-relaxed"><span className="stamp-muted mr-2 inline-block align-middle">{G.exampleLabel}</span>{example}</p>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-right font-mono text-[10px] font-bold uppercase text-muted-foreground">{G.escHint}</p>
        </div>
      </div>
    </div>
  );
}
