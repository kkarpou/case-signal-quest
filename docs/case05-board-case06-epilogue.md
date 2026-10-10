# Evidence board and community epilogue

## Case 05

The existing checkpoint at scene 13 becomes an interactive evidence board. It uses six claims/questions covering the same A–F evidence and preserves every scene index and the v1 progress key. Players select a card, choose a category and link the most direct evidence. Categories distinguish supported claims, overclaims and open questions. Existing exact SVG figures/tables remain available in the evidence reader. No dragging is required.

All six cards need both fields before review. HELEN gives claim-specific feedback only on request. Correctness does not gate progression: after review the player may continue with mistakes. Editing invalidates the prior review; a fresh review is required. `evidenceBoard` is an optional, normalized member of CaseProgress, stored with the case. Old saves default to a blank board; later scenes stay where they were. Resetting the case clears the board through the existing reset flow. Skill scores and the experience check-in remain unchanged.

The board is a consolidation activity after all evidence; it does not add branching investigations or a new report-writing mechanic.

## Case 06

The existing final handoff at scene 15 renders a fictional next-day community epilogue. Four messages respond to the saved final report: residents, a local journalist, the volunteer and a reader concerned with accountability. Unsupported selections take precedence when the report is contradictory (all23 vs residents, sponsor vs foreign, address vs protect, nobody vs company). Missing statements elicit clarification rather than falsely attributing a harmful action.

The scene explicitly describes a possible fictional continuation, not new evidence or actual publication. No real personal data, likes, approval meter, score change or additional choice is introduced. A careful report can still meet disagreement. The existing report composer is unchanged.

Legacy completed saves with no report text receive a neutral explanation and the open questions, not invented reactions. Remaining unknowns preserve the case's limits: total reach, foreign command/payment/control and contractor approval of the specific tactic.

## Verification

`node scripts/check-case-additions.mjs` checks normalization, persistence, review/edit gating and contradictory/missing epilogue inputs. TypeScript and production build validate integration. Browser checks cover the board-to-report-to-check-in flow, unchanged scores, save/reload, alternative epilogues and mobile/desktop light/dark layouts.
