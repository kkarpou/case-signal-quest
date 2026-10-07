import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleHelp, FileSearch, Fingerprint, RotateCcw, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import { GameButton } from "../components/GameButton";
import teamArt from "../assets/signal-team.jpg";
import teamLeadArt from "../assets/team-lead.jpg";
import teamMaraArt from "../assets/team-mara.jpg";
import teamLeoArt from "../assets/team-leo.jpg";
import teamNoorArt from "../assets/team-noor.jpg";
import { strings as S } from "./strings";
import { FaxRibbon, FolderStamp, MarginaliaText } from "./organic";
import { Case04VerificationReveal, Case04Visual } from "./Case04Visual";
import { Case05Visual } from "./Case05Visual";
import { Case06Visual } from "./Case06Visual";
import { Case06Report } from "./Case06Report";
import { canFinishReport, normalizeReport, type ReportDraft } from "./cases/case06-report";
import { skillLabels, type SkillKey } from "./game-data";
import type { Analyst, CaseChoice, CaseDecision, CaseDef, EvidenceCard } from "./cases/types";

const teamPortraits: Record<string, string> = { LZ: teamMaraArt, CH: teamLeoArt, KA: teamNoorArt, UL: teamLeadArt };
const team: Record<Analyst, { name: string; role: string; initials: string; focus: string }> = {
  lead: S.team.lead, mara: S.team.mara, leo: S.team.leo, noor: S.team.noor,
};

export type CaseProgress = {
  currentScene: number;
  decisions: Record<string, string>;
  revisedDecisions: string[];
  skillScores: Record<SkillKey, number>;
  completed: boolean;
  reportDraft?: ReportDraft;
};

export const initialProgress: CaseProgress = {
  currentScene: 0,
  decisions: {},
  revisedDecisions: [],
  skillScores: { source: 54, network: 50, evidence: 52, uncertainty: 50, response: 52 },
  completed: false,
};

export function loadProgress(storageKey: string): CaseProgress {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw);
    return { ...initialProgress, ...parsed, reportDraft: normalizeReport(parsed?.reportDraft) };
  } catch {
    return initialProgress;
  }
}

function clamp(value: number) { return Math.max(0, Math.min(100, value)); }

export function deriveSkillScores(def: CaseDef, decisions: Record<string, string>) {
  const scores = { ...initialProgress.skillScores };
  for (const scene of def.scenes) {
    if (scene.kind !== "decision") continue;
    const selectedId = decisions[scene.decision.id];
    const choice = scene.decision.choices.find((item) => item.id === selectedId);
    if (!choice) continue;
    for (const [key, value] of Object.entries(choice.delta)) {
      scores[key as SkillKey] = clamp(scores[key as SkillKey] + (value ?? 0));
    }
  }
  return scores;
}

export function CaseRunner({ def, progress, onProgress, onHub }: {
  def: CaseDef; progress: CaseProgress; onProgress: (next: CaseProgress) => void; onHub: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revising, setRevising] = useState(false);
  const choiceRegionRef = useRef<HTMLDivElement>(null);

  const index = Math.min(progress.currentScene, def.scenes.length - 1);
  const scene = def.scenes[index] ?? def.scenes[0];
  if (!scene) throw new Error("Empty case definition");
  const decisionId = scene.kind === "decision" ? scene.decision.id : null;

  useEffect(() => {
    setSelected(decisionId ? progress.decisions[decisionId] ?? null : null);
    setShowWhy(false); setShowHint(false); setRevising(false);
  }, [index, decisionId, progress.decisions]);

  const [fax, setFax] = useState<string | null>(null);
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    if (scene.kind !== "evidence") { setFax(null); return; }
    const card = def.evidence.find((item) => item.id === scene.evidenceId);
    setFax(card?.title ?? scene.kicker);
    const timer = window.setTimeout(() => setFax(null), 4600);
    return () => window.clearTimeout(timer);
  }, [index, scene, def.evidence]);
  useEffect(() => {
    if (!selected) return;
    setStamped(true);
    const timer = window.setTimeout(() => setStamped(false), 2800);
    return () => window.clearTimeout(timer);
  }, [selected, index]);

  const next = () => {
    if (def.id === "case06" && scene.kind === "report" && !progress.completed && !canFinishReport(progress.reportDraft)) return;
    onProgress({ ...progress, currentScene: Math.min(def.scenes.length - 1, index + 1), completed: progress.completed || (def.id === "case06" ? scene.kind === "report" : index >= def.scenes.length - 2) });
  };

  const choose = (decision: CaseDecision, choiceId: string) => {
    const choice = decision.choices.find((item) => item.id === choiceId);
    if (!choice) return;
    const previous = progress.decisions[decision.id];
    const decisions = { ...progress.decisions, [decision.id]: choiceId };
    onProgress({
      ...progress,
      decisions,
      revisedDecisions: previous && previous !== choiceId && !progress.revisedDecisions.includes(decision.id)
        ? [...progress.revisedDecisions, decision.id] : progress.revisedDecisions,
      skillScores: deriveSkillScores(def, decisions),
    });
    setSelected(choiceId); setRevising(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || (event.target instanceof HTMLElement && event.target.closest("[role='dialog'], .case06-visual, .case06-composer"))) return;
      if (event.key === "Escape") { if (selected) { setSelected(null); setRevising(true); } else onHub(); }
      if (event.key.toLowerCase() === "h" && scene.kind === "decision" && !selected) { event.preventDefault(); setShowHint((value) => !value); }
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key) && scene.kind === "decision" && !selected) {
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
  }, [scene, selected, onHub]);

  if (scene.kind === "briefing") {
    return <Frame label={scene.kicker}>
      <div className="mt-2">
        <h1 className="font-display text-3xl font-black uppercase leading-none sm:text-5xl">{scene.title}</h1>
        <div className="mt-2 grid gap-1 lg:grid-cols-2 lg:gap-4">{scene.lines.map((line, i) => <Dialogue key={i} who={line.who}><MarginaliaText text={line.text} /></Dialogue>)}</div>
      </div>
      <Actions><GameButton onClick={next} icon={<ArrowRight size={18} />}>{S.decisionUi.next}</GameButton></Actions>
    </Frame>;
  }

  if (scene.kind === "evidence") {
    const card = def.evidence.find((item) => item.id === scene.evidenceId);
    return <Frame label={scene.kicker} ribbon={fax ? <FaxRibbon message={fax} active /> : null}>
      <div className={def.id === "case06" ? "mt-2 mx-auto grid max-w-4xl gap-4" : "mt-2 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"}>
        <div><h1 className="font-display text-2xl font-black uppercase leading-none sm:text-4xl">{card?.title}</h1><p className="marker-copy mt-2 text-sm font-semibold sm:text-base"><MarginaliaText text={scene.intro} /></p></div>
        {card && <EvidenceView card={card} />}
      </div>
      <Actions><GameButton onClick={next} icon={<ArrowRight size={18} />}>{S.decisionUi.next}</GameButton></Actions>
    </Frame>;
  }

  if (scene.kind === "checkpoint") {
    const columns = [
      { title: S.checkpoint.known.title, items: scene.known, tone: "border-signal" },
      { title: S.checkpoint.suspected.title, items: scene.suspected, tone: "border-warning" },
      { title: S.checkpoint.unknown.title, items: scene.unknown, tone: "border-alert" },
    ];
    return <Frame label={S.checkpoint.label}>
      <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-5xl">{S.checkpoint.title}</h1>
      <div className="checkpoint-grid mt-4 grid gap-2 sm:grid-cols-3 lg:gap-4">{columns.map((column, i) => <article key={column.title} className={`case-card checkpoint-sheet checkpoint-sheet-${i + 1} border-t-8 bg-card p-3 lg:p-5 ${column.tone}`}><span className="tape tape-top" aria-hidden="true" /><h2 className="font-display text-sm font-black lg:text-xl">{column.title}</h2><ul className="mt-2 space-y-1 lg:mt-5 lg:space-y-4">{column.items.map((item) => <li key={item} className="flex gap-2 text-xs leading-snug lg:text-sm"><span className="mt-1.5 size-1.5 shrink-0 bg-current" />{item}</li>)}</ul></article>)}</div>
      <Actions><GameButton onClick={next} icon={<ArrowRight size={18} />}>{S.checkpoint.action}</GameButton></Actions>
    </Frame>;
  }

  if (scene.kind === "report") {
    if (def.id === "case06") return <Frame label={`${def.number} · ΑΝΑΦΟΡΑ`}>
      <Case06Report draft={normalizeReport(progress.reportDraft)} completed={progress.completed} onChange={(reportDraft) => onProgress({ ...progress, reportDraft })} onFinish={next} />
      {(progress.completed || progress.reportDraft?.checked) && <section className="case06-reviewed"><h2 className="font-display text-xl">{def.report.verdict}</h2><ul>{def.report.lines.map((line) => <li key={line}>{line}</li>)}</ul><ul>{def.report.teamSummary.map((row) => <li key={row.who}><strong>{row.who}:</strong> {row.text}</li>)}</ul></section>}
    </Frame>;
    const entries = Object.entries(progress.skillScores) as [SkillKey, number][];
    return <Frame label={`${def.number} · ΑΝΑΦΟΡΑ`}>
      <article className="report-layout dossier-report closed-dossier mt-2">
        <div className="dossier-spine" aria-hidden="true">{def.number}</div>
        <div className="report-finding">
          <span className="stamp">{def.report.verdictKicker}</span>
          <h1 className="mt-3 font-display text-xl font-black uppercase leading-tight lg:text-3xl">{def.report.verdict}</h1>
          <ul className="mt-3 grid gap-1 text-[12px] font-semibold leading-snug lg:text-sm">{def.report.lines.map((line) => <li key={line} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 bg-signal" />{line}</li>)}</ul>
        </div>
        <div className="report-profile">
          <section className="skill-sheet"><h2 className="font-display text-base font-black lg:text-2xl">{S.report.profileTitle}</h2>
            <div className="score-bars mt-2 space-y-1 lg:mt-5 lg:space-y-4">{entries.map(([key, value]) => <div key={key}><div className="mb-1 flex justify-between gap-3 text-xs font-black lg:mb-2 lg:text-sm"><span>{skillLabels[key]}</span><span>{value}</span></div><div className="skill-track h-2 border border-border bg-muted lg:h-3"><div className="h-full bg-signal" style={{ width: `${value}%` }} /></div></div>)}</div>
          </section>
          <section className="report-team-summary mt-3 border-t-2 border-border pt-2">
            <h2 className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">{S.report.teamSummaryTitle}</h2>
            <ul className="mt-1.5 grid gap-y-1">{def.report.teamSummary.map((row) => <li key={row.who} className="items-baseline gap-1.5 text-[11px] leading-snug"><strong className="font-black uppercase text-signal">{row.who} </strong><span className="min-w-0 text-muted-foreground">{row.text}</span></li>)}</ul>
          </section>
          {progress.revisedDecisions.length > 0 && <p className="revision-note mt-2 text-xs font-semibold text-signal lg:mt-3">{S.report.revisions(progress.revisedDecisions.length)}</p>}
        </div>
      </article>
      <Actions><GameButton onClick={next} icon={<ArrowRight size={18} />}>{S.report.action}</GameButton></Actions>
    </Frame>;
  }

  if (scene.kind === "handoff") {
    return <Frame label={scene.kicker}>
      <div className="mx-auto mt-3 grid max-w-5xl gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="incoming-board border-2 border-alert bg-card p-3 shadow-editorial lg:p-5">
          <div className="fax-edge" aria-hidden="true" />
          <h1 className="font-display text-2xl font-black uppercase lg:text-4xl">{scene.title}</h1>
          <ul className="mt-3 grid gap-2 text-sm font-semibold">{scene.lines.map((line) => <li key={line} className="border border-border bg-background p-2">{line}</li>)}</ul>
        </div>
        <div className="next-file text-center"><span className="kicker">{S.cliffhanger.nextLabel}</span><h2 className="mt-1 font-display text-3xl font-black uppercase lg:text-4xl">{scene.nextLabel}</h2></div>
      </div>
      <Actions><GameButton variant="secondary" onClick={onHub} icon={<ArrowLeft size={18} />}>{S.cliffhanger.action}</GameButton></Actions>
    </Frame>;
  }

  const decision = scene.decision;
  const choice = decision.choices.find((item) => item.id === selected);
  const card = def.evidence.find((item) => item.id === decision.evidenceIds[decision.evidenceIds.length - 1]);
  return <Frame label={decision.eyebrow}>
    <div className="decision-layout scene-decision mt-2 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
      <div className={selected ? "decision-question decision-question-complete" : "decision-question"}>
        <div className="question-sheet"><span className="paper-clip" aria-hidden="true" /><AnalystTag who={decision.analyst} /><h1 className="screen-title font-display text-2xl font-black uppercase leading-none sm:text-4xl">{decision.title}</h1><p className="screen-prompt mt-3 max-w-2xl text-base font-semibold leading-relaxed sm:text-lg"><MarginaliaText text={decision.prompt} up /></p></div>
        {revising && <div className="mt-5 border-l-4 border-warning bg-warning/10 p-4 text-sm"><strong>{S.decisionUi.revisingTitle}</strong><p className="mt-1 text-muted-foreground">{S.decisionUi.revisingText}</p></div>}
        {!selected && card && <div className="mobile-evidence"><EvidenceView card={card} /></div>}
        {!selected && <div ref={choiceRegionRef} className="choice-grid mt-4 grid gap-2" role="group" aria-label={decision.prompt}>{decision.choices.map((item, i) => <GameButton key={item.id} data-choice variant="option" className="choice-button min-h-13 justify-start py-2 normal-case" onClick={() => choose(decision, item.id)} autoFocus={i === 0}><span className="choice-letter grid size-8 shrink-0 place-items-center border-2 border-current text-xs">{String.fromCharCode(65 + i)}</span><span>{item.label}</span></GameButton>)}</div>}
        {!selected && <button onClick={() => setShowHint((value) => !value)} className="hint-button mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-black text-signal underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"><CircleHelp size={18} />{S.decisionUi.hint}</button>}
        {showHint && !selected && <div className="hint-panel mt-2 border-l-4 border-signal bg-accent p-3 text-sm"><strong>{S.decisionUi.hintLead}</strong> {decision.hint}</div>}
      </div>
      <aside className={selected ? "decision-sidecar min-w-0" : "decision-sidecar desktop-evidence min-w-0"}>
        {selected && choice ? <FeedbackCard decision={decision} choice={choice} showWhy={showWhy} showStamp={stamped} caseId={def.id} /> : card ? <EvidenceView card={card} /> : null}
      </aside>
    </div>
    {selected && <Actions>
      {decision.critical && <GameButton variant="secondary" onClick={() => { setSelected(null); setRevising(true); setShowWhy(false); }} icon={<RotateCcw size={18} />}>{S.decisionUi.revise}</GameButton>}
      <GameButton variant="secondary" onClick={() => setShowWhy((value) => !value)} icon={<CircleHelp size={18} />}>{S.decisionUi.why}</GameButton>
      <GameButton onClick={next} icon={<ArrowRight size={18} />}>{S.decisionUi.next}</GameButton>
    </Actions>}
  </Frame>;
}

function Frame({ children, label, ribbon }: { children: ReactNode; label: string; ribbon?: ReactNode }) {
  return <section className="game-screen case-board mx-auto h-full max-w-6xl overflow-y-auto overflow-x-hidden px-4 pb-20 pt-4 sm:px-6 sm:pb-20 sm:pt-5"><div className="act-ruler"><span className="kicker">{label}</span><span className="ruler-line" aria-hidden="true" /></div>{ribbon}{children}</section>;
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="bottom-actions fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background/95 p-3"><div className="mx-auto flex max-w-4xl flex-wrap justify-end gap-2">{children}</div></div>;
}

function Dialogue({ who, children }: { who: Analyst; children: ReactNode }) {
  const member = team[who];
  return <div className={`dialogue dialogue-${who} mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-3`} data-speaker={who}><div className="portrait-cutout" data-character={who}><img src={teamArt} alt="" aria-hidden="true" /><span>{member.initials}</span></div><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2"><strong className="text-sm">{member.name}</strong><span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">{member.role}</span></div><p className="mt-1.5 text-sm leading-relaxed">{children}</p></div></div>;
}

function AnalystTag({ who }: { who: Analyst }) {
  const member = team[who];
  return <div className="analyst-tag" data-character={who}><span className="analyst-tag-photo"><img src={teamPortraits[member.initials]} alt={member.name} width={148} height={100} /></span><span className="min-w-0"><span className="analyst-tag-label">{S.decisionUi.analystLabel}</span><strong className="analyst-tag-name">{member.name} · {member.role}</strong><span className="analyst-tag-focus">{member.focus}</span></span></div>;
}

function EvidenceView({ card }: { card: EvidenceCard }) {
  const hasCase04Visual = card.id.startsWith("E4-");
  const hasCase05Visual = card.id.startsWith("E5-");
  return <article className="evidence-card signature-evidence">
    <div className="evidence-meta"><FileSearch className="text-signal" size={20} /><span className="font-mono">{card.kicker}</span></div>
    <h2 className="mt-1 font-display text-lg font-black leading-tight lg:text-2xl">{card.title}</h2>
    {card.id.startsWith("E6-") ? <Case06Visual key={card.id} evidenceId={card.id} /> : hasCase04Visual ? <div className="case04-evidence-main">
      <Case04Visual evidenceId={card.id} />
      <ul className="case04-observations">{card.lines.map((line, index) => <li key={line} className="case04-observation"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0"><MarginaliaText text={line} /></span></li>)}</ul>
    </div> : hasCase05Visual ? <div className="case05-evidence-main">
      <Case05Visual evidenceId={card.id} />
      <ul className="case05-observations">{card.lines.map((line, index) => <li key={line} className="case05-observation"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0"><MarginaliaText text={line} /></span></li>)}</ul>
    </div> : <ul className="mt-2 grid gap-1.5 text-[12px] leading-snug lg:text-sm">{card.lines.map((line) => <li key={line} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 bg-signal" /><span className="min-w-0"><MarginaliaText text={line} /></span></li>)}</ul>}
    {card.table && <table className="mt-3 w-full border-collapse text-[11px] lg:text-xs"><thead><tr>{card.table.head.map((head) => <th key={head} className="border border-border bg-muted p-1 text-left font-black uppercase">{head}</th>)}</tr></thead><tbody>{card.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border border-border p-1 font-semibold">{cell}</td>)}</tr>)}</tbody></table>}
    {card.note && <p className="mt-2 text-[10px] font-semibold uppercase text-muted-foreground"><MarginaliaText text={card.note} /></p>}
  </article>;
}

function FeedbackCard({ decision, choice, showWhy, showStamp, caseId }: { decision: CaseDecision; choice: CaseChoice; showWhy: boolean; showStamp: boolean; caseId: string }) {
  return <article className={`feedback-card feedback-reveal verdict-board ${choice.correct ? "feedback-strong border-signal" : "feedback-caution border-warning"}`} aria-live="polite">
    <FolderStamp show={showStamp} />
    <div className="verdict-heading"><span className={`${choice.correct ? "stamp" : "stamp-warning"} verdict-stamp`}>{choice.correct ? S.feedback.strong : S.feedback.premature}</span></div>
    {!choice.correct && <div className="desk-memo"><span className="desk-memo-label">{S.notify.memoLabel}</span><p><MarginaliaText text={S.notify.memo} /></p></div>}
    <Row title={S.feedback.yourChoice} text={choice.feedback} icon={<Fingerprint size={18} />} />
    <Row title={S.feedback.evidence} text={decision.evidence} icon={<Search size={18} />} />
    <Row title={S.feedback.cannot} text={decision.cannot} icon={<TriangleAlert size={18} />} />
    <Row title={S.feedback.principle} text={decision.principle} icon={<ShieldCheck size={18} />} strong />
    {caseId === "case04" && decision.id === "voice" && <Case04VerificationReveal playerVerified={choice.correct === true} />}
    {showWhy && <div className="analyst-note mt-4 border-t-2 border-dashed border-border pt-4"><h3 className="font-mono text-xs font-black uppercase text-signal">{S.feedback.whyTitle}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{decision.why}</p></div>}
  </article>;
}

function Row({ title, text, icon, strong }: { title: string; text: string; icon: ReactNode; strong?: boolean }) {
  return <div className={`feedback-row mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-3 first:border-0 ${strong ? "feedback-principle" : ""}`}><span className="text-signal">{icon}</span><div><h3 className="font-mono text-[11px] font-black uppercase text-muted-foreground">{title}</h3><p className={`mt-1 text-sm leading-relaxed ${strong ? "font-black text-signal" : ""}`}><MarginaliaText text={text} /></p></div></div>;
}
