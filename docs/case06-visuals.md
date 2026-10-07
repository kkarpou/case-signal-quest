# Case 06 implementation and verification

Case06Visual renders six accessible HTML evidence props in the game's paper style. The brief has three inspectable sections (instruction, authentication, account mapping). Text is selectable and accessible; the modal is portaled to document.body to avoid transformed-ancestor clipping. All entities and IDs are fictional educational fixtures, not recovered records. No personal address exists in the source, DOM or accessibility text. No external announcement is published.

`account-fixture.ts` establishes N-01–N-18 as public-call participants and N-19–N-23 as the previously unclassified five. Case02 introduces only the anonymous mapping, without the future company finding. Case06 connects those same five through a document identifier and simulated scheduling export. Five documented matches do not establish maximum total operation size; responsibility is not automatically extended to all23 or the construction client. Foreign-language reposts do not establish nationality, control or payment.

All six decision IDs, sixteen scenes, choice IDs and storageKey v1 remain. Correct positions are A/B/C/A/B/C. Feedback, misconception labels, hints and Why are specific; network and response decisions now award their relevant skills. Existing derived scoring avoids repeat-award accumulation.

The report scene contains an announcement composer with additive persisted reportDraft state. Empty drafts cannot complete a fresh case. Checking identifies unsupported additions and missing essential statements; editing invalidates the check. A checked nonempty draft can finish after feedback, including mistakes; the validated team conclusion remains visible. Previously completed saves retain completion. Fresh completion happens on the report action, not on report entry.

Validation commands (Node24 for native TypeScript stripping):
- npm install --ignore-scripts --package-lock=false
- npx tsc --noEmit
- npm run build
- node scripts/check-case06.mjs

These pass locally. The focused check covers storage/scene/choice compatibility, varied correct positions, disjoint18/5 mapping, missing/unsupported/empty report behavior, edit invalidation, JSON roundtrip, and skill alignment.

Browser verification used local Vite + headless Chromium. Checked all12 evidence/decision screens at390×844 and1280×720, in light/dark (48 screen checks), including no page-level horizontal overflow. Inspected the central evidence board screenshots, then changed the Case06 evidence layout to a full-width reading column. Checked brief tabs/account selection, zoom focus containment/return and Escape, same-choice score stability after revision, composer empty/unsupported/supported/edit/reload/finish behavior, and opening Case04/05 evidence. No browser page errors. These are local checks; the public deployment was not changed.
