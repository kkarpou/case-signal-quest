import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { GameButton } from '../components/GameButton';
import helen from '../assets/team-lead.jpg';
import { readSessionLog } from './play-sessions';
import { completeAnswers, ensureCheckin, experienceItems, readExperience, updateCheckin, writeExperience, type Answers, type ExperienceRecord } from './experience-data';

export function ExperienceCheckin({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const [record, setRecord] = useState<ExperienceRecord | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      const current = readSessionLog(localStorage).sessions.at(-1);
      const result = ensureCheckin(readExperience(localStorage), caseId, current?.endedAt === null ? current.id : null, () => crypto.randomUUID(), new Date().toISOString());
      if (result.record.status !== 'presented') { onDone(); return; }
      writeExperience(result.log);
      setRecord(result.record); setAnswers(result.record.answers);
    } catch { setError(true); }
  }, [caseId, onDone]);
  const save = (next: Answers, status: ExperienceRecord['status']) => {
    setAnswers(next);
    try {
      if (!record) throw new Error('No check-in record');
      writeExperience(updateCheckin(readExperience(localStorage), record.id, next, status, new Date().toISOString()));
      setError(false);
      if (status !== 'presented') onDone();
    } catch { setError(true); }
  };
  return <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] max-h-[94svh] w-[calc(100%_-_1rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-2 border-signal bg-background p-4 text-foreground sm:p-6" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => { e.preventDefault(); save({}, 'skipped'); }}>
        <div className="flex items-center gap-3">
          <img src={helen} alt="" className="h-16 w-16 border-2 border-border object-cover" />
          <div><span className="font-mono text-xs font-bold text-signal">HELEN · ΥΠΟΘΕΣΗ {caseId.slice(-2)}</span><Dialog.Title className="font-display text-xl">Πώς σου φάνηκε;</Dialog.Title></div>
        </div>
        <Dialog.Description className="mt-3 text-sm leading-relaxed">Πριν συνεχίσουμε, πώς σου φάνηκε αυτή η υπόθεση; Δεν υπάρχουν σωστές ή λάθος απαντήσεις και δεν επηρεάζεται η βαθμολογία σου. Μπορείς να παραλείψεις τις ερωτήσεις.</Dialog.Description>
        <p className="mt-2 text-xs text-muted-foreground">Οι απαντήσεις αποθηκεύονται μόνο σε αυτόν τον browser, για την πιλοτική αξιολόγηση του παιχνιδιού.</p>
        <div className="mt-4 space-y-4">
          {experienceItems.map(item => <fieldset key={item.id}>
            <legend className="mb-2 text-sm font-bold">{item.question}</legend>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {item.labels.map((label, i) => <label key={label} className="relative cursor-pointer">
                <input className="peer sr-only" type="radio" name={item.id} value={i + 1} checked={answers[item.id] === i + 1} onChange={() => save({ ...answers, [item.id]: i + 1 }, 'presented')} />
                <span className="flex min-h-20 flex-col items-center justify-start gap-1 border-2 border-border bg-card text-card-foreground px-1 py-2 text-center peer-checked:border-signal peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-signal">
                  <span className="text-lg font-black">{i + 1}</span><span className="text-[10px] leading-tight sm:text-xs">{label}</span>
                </span>
              </label>)}
            </div>
          </fieldset>)}
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-bold text-destructive">Δεν ήταν δυνατή η αποθήκευση. Μπορείς να δοκιμάσεις ξανά ή να συνεχίσεις χωρίς αποθήκευση.</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <GameButton disabled={!completeAnswers(answers) || !record} onClick={() => save(answers, 'submitted')}>Υποβολή και συνέχεια</GameButton>
          <GameButton variant="secondary" onClick={() => save({}, 'skipped')}>Παράλειψη</GameButton>
          {error && <GameButton variant="ghost" onClick={onDone}>Συνέχεια χωρίς αποθήκευση</GameButton>}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
