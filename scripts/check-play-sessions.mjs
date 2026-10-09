import assert from 'node:assert/strict';
import { readSessionLog, startPlaySession, finishPlaySession } from '../src/game/play-sessions.ts';

const first = { caseId: 'case01', sceneIndex: 3 };
const last = { caseId: 'case06', sceneIndex: 9 };
const empty = readSessionLog({ getItem: () => null });
const started = startPlaySession(empty, first, 'session-1', '2026-10-09T10:00:00Z');
assert.equal(started.sessions.length, 1);
// Reloads, case changes and an overnight interruption do not imply session completion.
const restored = readSessionLog({ getItem: () => JSON.stringify(started) });
assert.equal(startPlaySession(restored, last, 'unused', '2026-10-10T10:00:00Z'), restored);
assert.equal(restored.sessions[0].endedAt, null);
const ended = finishPlaySession(restored, last, '2026-10-10T10:05:00Z');
assert.deepEqual(ended.sessions[0].checkpoint, last);
assert.equal(ended.sessions[0].endReason, 'player_finished_today');
assert.equal(finishPlaySession(ended, first, '2026-10-10T10:06:00Z'), ended);
const next = startPlaySession(ended, last, 'session-2', '2026-10-11T10:00:00Z');
assert.equal(next.sessions.length, 2);
assert.equal(next.sessions[1].endedAt, null);
assert.deepEqual(next.sessions[0], ended.sessions[0]);
assert.throws(() => readSessionLog({ getItem: () => '{broken' }));
assert.throws(() => readSessionLog({ getItem: () => JSON.stringify({ version: 2, sessions: [] }) }));
assert.throws(() => readSessionLog({ getItem: () => JSON.stringify({ version: 1, sessions: [null] }) }));
console.log('Session lifecycle checks passed.');
