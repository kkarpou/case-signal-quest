# Per-case experience check-in — pilot v1

After closing a report in any of the six cases, HELEN presents three authored momentary items: enjoyment, perceived difficulty and goal/action clarity. Each uses five fully labelled options, with no default. All three are required for submission; a visible Skip button or Escape records a skip with no answers. Neither route changes scores or narrative outcomes. The original report continuation runs after either route. Viewing an already completed case does not request a retrospective evaluation.

These are not validated short forms of PXI or IMI. Analyze each item separately. Difficulty runs from very easy to very difficult and is not an optimal-challenge score. Greek wording and completion burden still require pilot testing with the intended age group. There are no inferred emotion labels or composite scores.

## Persistence and repeat visits

`the-signal-files-experience-v1` stores independent case attempt IDs and records. Records contain an ID, case ID, attempt ID, originating session ID (nullable if unavailable), instrument version, presentation/finalization timestamps, status and separate answers. Status is `presented`, `submitted` or `skipped`; missing values are not zeroes. Draft choices are saved immediately. On reload, return to the case report and close it to resume the draft. The original presentation time/session remain attached to the draft; elapsed time across interruptions is not an active response-time measure.

Each case attempt is evaluated once. A game reset generates a new attempt ID while preserving previous records. Merely starting a new session does not reset case attempts. Finalized records are not overwritten. Invalid existing data is preserved; a save failure displays an error and allows continuing without claiming a saved response. A draft abandoned this way remains `presented`.

## Export

The Hub has a **Δεδομένα πιλοτικής δοκιμής** action. JSON includes the item wording/labels, records, attempt mapping and local session log. CSV contains one record per row, with blank missing values and status. CSV is UTF-8 with BOM for spreadsheet compatibility. Downloads do not clear or upload records.

This is a local pilot feature, not a research deployment. It has no participant identifiers, participant switching, central collection, consent management, miniPXI or IMI. A shared browser contains mixed users' progress and records. The export dialog explains this limitation. Clearing browser data removes the local records.

## Verification

- `node scripts/check-experience.mjs`: initial state, deduplication, draft restoration, complete submission, immutable finalization, reset attempts, skip semantics, CSV rows and malformed data rejection.
- TypeScript and production build.
- Browser: all six report continuations; no initial selection; disabled incomplete submit; partial draft across reload; submit; skip/Escape; session linkage; unchanged scores; mobile/desktop layout; JSON/CSV downloads.
