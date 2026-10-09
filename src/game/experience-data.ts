export const EXPERIENCE_KEY = 'the-signal-files-experience-v1';
export const INSTRUMENT_VERSION = 'case-checkin-el-v1';
export const experienceItems = [
  { id: 'enjoyment', question: 'Πόσο σου άρεσε αυτή η υπόθεση;', labels: ['Καθόλου', 'Λίγο', 'Μέτρια', 'Πολύ', 'Πάρα πολύ'] },
  { id: 'difficulty', question: 'Πόσο δύσκολη σου φάνηκε;', labels: ['Πολύ εύκολη', 'Μάλλον εύκολη', 'Ούτε εύκολη ούτε δύσκολη', 'Μάλλον δύσκολη', 'Πολύ δύσκολη'] },
  { id: 'clarity', question: 'Πόσο ξεκάθαρο ήταν τι έπρεπε να κάνεις;', labels: ['Καθόλου', 'Λίγο', 'Μέτρια', 'Πολύ', 'Απόλυτα'] },
] as const;
export type Answers = Partial<Record<'enjoyment' | 'difficulty' | 'clarity', number>>;
export type ExperienceRecord = {
  id: string; caseId: string; attemptId: string; sessionId: string | null;
  instrumentVersion: typeof INSTRUMENT_VERSION;
  presentedAt: string; finalizedAt: string | null;
  status: 'presented' | 'submitted' | 'skipped'; answers: Answers;
};
export type ExperienceLog = { version: 1; attempts: Record<string, string>; records: ExperienceRecord[] };
const caseIdValid = (v: string) => /^case0[1-6]$/.test(v);
export function completeAnswers(answers: Answers) {
  return experienceItems.every(({ id }) => Number.isInteger(answers[id]) && answers[id]! >= 1 && answers[id]! <= 5);
}
export function readExperience(storage: Pick<Storage, 'getItem'>): ExperienceLog {
  const raw = storage.getItem(EXPERIENCE_KEY);
  if (!raw) return { version: 1, attempts: {}, records: [] };
  const log = JSON.parse(raw) as ExperienceLog;
  if (!log || log.version !== 1 || !log.attempts || typeof log.attempts !== 'object' || Array.isArray(log.attempts) ||
    Object.entries(log.attempts).some(([k, v]) => !caseIdValid(k) || typeof v !== 'string') || !Array.isArray(log.records) ||
    log.records.some(r => !r || typeof r.id !== 'string' || !caseIdValid(r.caseId) || typeof r.attemptId !== 'string' ||
      !(r.sessionId === null || typeof r.sessionId === 'string') || r.instrumentVersion !== INSTRUMENT_VERSION ||
      !Number.isFinite(Date.parse(r.presentedAt)) || !['presented', 'submitted', 'skipped'].includes(r.status) ||
      !(r.status === 'presented' ? r.finalizedAt === null : typeof r.finalizedAt === 'string' && Number.isFinite(Date.parse(r.finalizedAt))) ||
      !r.answers || typeof r.answers !== 'object' || Array.isArray(r.answers) ||
      Object.entries(r.answers).some(([k, v]) => !experienceItems.some(i => i.id === k) || !Number.isInteger(v) || v < 1 || v > 5) ||
      (r.status === 'submitted' && !completeAnswers(r.answers)) || (r.status === 'skipped' && Object.keys(r.answers).length > 0))) {
    throw new Error('Invalid experience data; preserve the original');
  }
  return log;
}
export function writeExperience(log: ExperienceLog) { localStorage.setItem(EXPERIENCE_KEY, JSON.stringify(log)); }
export function ensureCheckin(log: ExperienceLog, caseId: string, sessionId: string | null, uuid: () => string, at: string) {
  const attemptId = log.attempts[caseId] ?? uuid();
  const existing = log.records.find(r => r.caseId === caseId && r.attemptId === attemptId);
  if (existing) return { log, record: existing };
  const record: ExperienceRecord = { id: uuid(), caseId, attemptId, sessionId, instrumentVersion: INSTRUMENT_VERSION, presentedAt: at, finalizedAt: null, status: 'presented', answers: {} };
  return { log: { ...log, attempts: { ...log.attempts, [caseId]: attemptId }, records: [...log.records, record] }, record };
}
export function updateCheckin(log: ExperienceLog, id: string, answers: Answers, status: ExperienceRecord['status'], at: string): ExperienceLog {
  if (status === 'submitted' && !completeAnswers(answers)) throw new Error('Incomplete answers');
  return { ...log, records: log.records.map(r => r.id !== id || r.status !== 'presented' ? r : {
    ...r, answers: status === 'skipped' ? {} : answers, status, finalizedAt: status === 'presented' ? null : at,
  }) };
}
export function resetExperienceAttempt(caseId: string) {
  const log = readExperience(localStorage);
  writeExperience({ ...log, attempts: { ...log.attempts, [caseId]: crypto.randomUUID() } });
}
export function experienceCSV(records: ExperienceRecord[]) {
  const columns = ['id', 'caseId', 'attemptId', 'sessionId', 'instrumentVersion', 'presentedAt', 'finalizedAt', 'status', 'enjoyment', 'difficulty', 'clarity'] as const;
  const cell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return '\uFEFF' + [columns.join(','), ...records.map(r => [r.id, r.caseId, r.attemptId, r.sessionId, r.instrumentVersion, r.presentedAt, r.finalizedAt, r.status, r.answers.enjoyment, r.answers.difficulty, r.answers.clarity].map(cell).join(','))].join('\r\n');
}
