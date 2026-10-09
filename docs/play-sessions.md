# Explicit end of a play session

The masthead action **Ολοκλήρωση για σήμερα** is available after starting or resuming a case, including after returning to the Hub. HELEN presents a confirmation. Confirming flushes game progress, records the explicit session end and returns to the Hub with a completion message. Cancel/Escape leaves the session and case unchanged. The next case launch starts a new session while retaining case progress.

Session state uses `the-signal-files-play-sessions-v1`, independent of all six case saves. Each record has a random session ID, start/end ISO timestamps, explicit end reason and last case/zero-based scene checkpoint. No participant identifier, questionnaire responses or external analytics are collected by this change. Data is local to this browser and is not a central research dataset.

Reloading, closing a tab, inactivity, midnight and completing a case do **not** end a session. An unclosed session resumes on the next visit; elapsed wall time must not be interpreted as active play time. At this stage a shared-browser installation also has shared progress: participant switching and study scheduling require the future research layer.

miniPXI and IMI remain unimplemented. The three per-case experience items are implemented separately; see `experience-checkin.md`. The explicit confirmation is the future entry point for optional end-session questionnaires; do not label missing questionnaires as completed or skipped. Before a study, add the research participation flow, participant/session linkage, validated instrument content and reliable export/storage.

An invalid existing session log is not silently erased. Failed writes show a visible error and never claim successful completion. No history is truncated.

Validation: `node scripts/check-play-sessions.mjs`, TypeScript, production build and browser interaction checks (cancel/Escape, case 01 and shared runner completion, reload/new session, preserved progress, mobile layout, write failure).
