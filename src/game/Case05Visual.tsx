import { useEffect, useRef, useState } from "react";
import { Eye, Maximize2, X } from "lucide-react";
import { GameButton } from "../components/GameButton";
import { strings as S } from "./strings";

type Case05VisualId = "E5-A" | "E5-B" | "E5-C" | "E5-D" | "E5-E" | "E5-F";

type VisualDefinition = {
  src: string;
  revealSrc?: string;
  alt: string;
  revealAlt?: string;
  aspect: "standard" | "tall";
};

const visuals: Record<Case05VisualId, VisualDefinition> = {
  "E5-A": {
    src: "/visuals/case05/a-change.svg",
    revealSrc: "/visuals/case05/a-change-reveal.svg",
    alt: S.case05Visuals.alt.change,
    revealAlt: S.case05Visuals.alt.changeReveal,
    aspect: "standard",
  },
  "E5-B": {
    src: "/visuals/case05/b-scales.svg",
    alt: S.case05Visuals.alt.scales,
    aspect: "tall",
  },
  "E5-C": {
    src: "/visuals/case05/c-sample.svg",
    alt: S.case05Visuals.alt.sample,
    aspect: "standard",
  },
  "E5-D": {
    src: "/visuals/case05/d-uncertainty.svg",
    alt: S.case05Visuals.alt.uncertainty,
    aspect: "standard",
  },
  "E5-E": {
    src: "/visuals/case05/e-counts.svg",
    revealSrc: "/visuals/case05/e-rates.svg",
    alt: S.case05Visuals.alt.counts,
    revealAlt: S.case05Visuals.alt.rates,
    aspect: "standard",
  },
  "E5-F": {
    src: "/visuals/case05/f-waits.svg",
    revealSrc: "/visuals/case05/f-waits-reveal.svg",
    alt: S.case05Visuals.alt.waits,
    revealAlt: S.case05Visuals.alt.waitsReveal,
    aspect: "standard",
  },
};

function isCase05VisualId(id: string): id is Case05VisualId {
  return id in visuals;
}

export function Case05Visual({ evidenceId }: { evidenceId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [alternate, setAlternate] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpanded(false);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = closeRef.current?.closest<HTMLElement>("[role='dialog']");
      const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  if (!isCase05VisualId(evidenceId)) return null;
  const visual = visuals[evidenceId];
  const isToggle = evidenceId === "E5-E";
  const isReveal = evidenceId === "E5-A" || evidenceId === "E5-F";
  const src = alternate && visual.revealSrc ? visual.revealSrc : visual.src;
  const alt = alternate && visual.revealAlt ? visual.revealAlt : visual.alt;

  const controls = (
    <div className="case05-visual-controls">
      {isToggle && <div className="case05-segmented" role="group" aria-label={S.case05Visuals.viewMode}>
        <GameButton variant="secondary" aria-pressed={!alternate} onClick={() => setAlternate(false)}>{S.case05Visuals.counts}</GameButton>
        <GameButton variant="secondary" aria-pressed={alternate} onClick={() => setAlternate(true)}>{S.case05Visuals.rates}</GameButton>
      </div>}
      {isReveal && <GameButton variant="secondary" aria-pressed={alternate} onClick={() => setAlternate((value) => !value)} icon={<Eye size={18} />}>
        {alternate ? S.case05Visuals.hideExplanation : S.case05Visuals.revealExplanation}
      </GameButton>}
      <GameButton ref={openerRef} variant="secondary" onClick={() => setExpanded(true)} icon={<Maximize2 size={18} />} aria-label={`${S.case05Visuals.enlarge}: ${alt}`}>
        {S.case05Visuals.enlarge}
      </GameButton>
    </div>
  );

  return <>
    <figure className="case05-figure" data-aspect={visual.aspect}>
      <img src={src} alt={alt} width={800} height={visual.aspect === "tall" ? 1080 : 900} />
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
    {controls}
    {expanded && <div className="case05-visual-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <section className="case05-visual-dialog" role="dialog" aria-modal="true" aria-labelledby={`case05-visual-title-${evidenceId}`}>
        <header className="case05-visual-dialog-head">
          <div><span className="kicker">{S.case05Visuals.fullscreenLabel}</span><h2 id={`case05-visual-title-${evidenceId}`} className="font-display text-xl font-black">{evidenceId}</h2></div>
          <GameButton ref={closeRef} variant="secondary" className="dialog-close" onClick={() => setExpanded(false)} icon={<X size={20} />} aria-label={S.case05Visuals.close}>{S.case05Visuals.close}</GameButton>
        </header>
        <div className="case05-visual-dialog-scroll">
          <img src={src} alt={alt} width={800} height={visual.aspect === "tall" ? 1080 : 900} />
        </div>
      </section>
    </div>}
  </>;
}