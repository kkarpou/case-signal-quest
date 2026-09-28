import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { strings as S } from "./strings";

/** Opens the glossary dialog from anywhere inside the case (wired once in GameApp). */
export const GlossaryLinkContext = createContext<() => void>(() => {});

type GlossaryTerm = (typeof S.glossary.terms)[number];
const terms = S.glossary.terms;
const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termPattern = new RegExp(
  terms.map((item) => item.term).sort((a, b) => b.length - a.length).map(escapeRe).join("|"),
  "gi",
);

function findTerm(label: string): GlossaryTerm | undefined {
  const lower = label.toLocaleLowerCase("el");
  return terms.find((item) => item.term.toLocaleLowerCase("el") === lower);
}

function MarginaliaTerm({ label, up }: { label: string; up?: boolean | undefined }) {
  const openGlossary = useContext(GlossaryLinkContext);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);
  const data = findTerm(label);
  if (!data) return <>{label}</>;
  return (
    <span ref={wrapRef} className={`marginalia-wrap${up ? " marginalia-up" : ""}`}>
      <button
        type="button"
        className="marginalia-term"
        aria-expanded={open}
        title={S.glossary.short}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.stopPropagation(); setOpen(false); }
        }}
      >
        {label}
      </button>
      {open && (
        <span className="marginalia-note" role="note">
          <strong className="marginalia-note-term">{data.term}</strong>
          <span className="marginalia-note-body">{data.note}</span>
          <button
            type="button"
            className="marginalia-note-link"
            onClick={() => { setOpen(false); openGlossary(); }}
          >
            {S.notify.inGlossary}
          </button>
        </span>
      )}
    </span>
  );
}

/** Renders a string with glossary terms as underlined, tappable marginalia. */
export function MarginaliaText({ text, up }: { text: string; up?: boolean }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(termPattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(<MarginaliaTerm key={key++} label={match[0]} up={up} />);
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** A thin incoming-telex strip that types out its message (organic notification). */
export function FaxRibbon({ message, active }: { message: string; active: boolean }) {
  if (!active) return null;
  return (
    <div className="fax-ribbon" role="status">
      <span className="fax-ribbon-label">{S.notify.faxLabel}</span>
      <span className="fax-ribbon-text" style={{ "--fax-chars": message.length } as CSSProperties}>{message}</span>
    </div>
  );
}

/** Shows the fax ribbon once on mount, then lets it fade away. */
export function FaxOnMount({ message }: { message: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), 4600);
    return () => window.clearTimeout(timer);
  }, [message]);
  return <FaxRibbon message={message} active={show} />;
}

/** Transient "filed to the folder" stamp overlay. */
export function FolderStamp({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="folder-stamp" aria-hidden="true">{S.notify.stamp}</span>;
}
