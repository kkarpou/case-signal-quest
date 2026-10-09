// Local session boundaries only. No research upload, identity or inferred active time.
export const SESSION_KEY = "the-signal-files-play-sessions-v1";

export type SessionCheckpoint = { caseId: string; sceneIndex: number };
export type PlaySession = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  endReason: "player_finished_today" | null;
  checkpoint: SessionCheckpoint;
};
export type SessionLog = { version: 1; sessions: PlaySession[] };

export function readSessionLog(storage: Pick<Storage, "getItem">): SessionLog {
  const raw = storage.getItem(SESSION_KEY);
  if (!raw) return { version: 1, sessions: [] };
  const value = JSON.parse(raw) as SessionLog;
  if (value.version !== 1 || !Array.isArray(value.sessions) || value.sessions.some((s) =>
    !s || typeof s.id !== "string" || !Number.isFinite(Date.parse(s.startedAt)) ||
    !(s.endedAt === null || (typeof s.endedAt === "string" && Number.isFinite(Date.parse(s.endedAt)))) ||
    s.endReason !== (s.endedAt === null ? null : "player_finished_today") ||
    !s.checkpoint || !/^case0[1-6]$/.test(s.checkpoint.caseId) ||
    !Number.isInteger(s.checkpoint.sceneIndex) || s.checkpoint.sceneIndex < 0
  ) || value.sessions.slice(0, -1).some((s) => s.endedAt === null)) {
    throw new Error("Invalid session log");
  }
  return value;
}

export function startPlaySession(log: SessionLog, checkpoint: SessionCheckpoint, id: string, at: string): SessionLog {
  if (log.sessions.at(-1)?.endedAt === null) return log;
  return { version: 1, sessions: [...log.sessions, { id, startedAt: at, endedAt: null, endReason: null, checkpoint }] };
}

export function finishPlaySession(log: SessionLog, checkpoint: SessionCheckpoint, at: string): SessionLog {
  const current = log.sessions.at(-1);
  if (!current || current.endedAt !== null) return log;
  return { version: 1, sessions: [...log.sessions.slice(0, -1), { ...current, checkpoint, endedAt: at, endReason: "player_finished_today" }] };
}
