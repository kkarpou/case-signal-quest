# THE SIGNAL FILES — Season 01 scenario specification

Fictional educational material. Every organisation, person, account, domain, dataset and
incident below is invented for teaching purposes. Nothing here is an empirical claim, a
real measurement, or a statement about any real person or institution. All `.example`
addresses are inert and must never accept real input.

Editing rules for this file:

- This document is the source of truth for narrative and datasets. The playable text lives
  in `src/game/cases/case0X.ts`; the numbers and beats must stay consistent with this file.
- Keys/ids (`E2-A`, `d2-03`, choice ids) drive scoring and must not be renamed casually.

---

## 1. Pedagogical basis

Supplied by the author from **«Παιδεία στα Μέσα και Κοινωνική Ανθεκτικότητα»**. Priorities:

1. Understanding information, not only truth-checking.
2. Lateral reading — leave the page to check the source.
3. Statistical and visual literacy (denominators, percentage points, sampling, charts).
4. Platform incentives and selection effects.
5. Phishing, impersonation and privacy risk.
6. Proportionate response and helping other people.

Measurement intent: observed actions, false positives on true items, and transfer — not
completion. One transfer item per case is **formative**, not a validated instrument.

### Design contract derived from it

- Every case contains at least one **accurate/authentic** item (so distrust is not the
  reward), one **unresolved** claim, one **helping-another-person** choice, and one **new
  transfer** example with fresh wording.
- Uncertainty is not always correct. When the evidence is conclusive (Case 06, five
  accounts), a clear conclusion is the rewarded answer.
- Wrong answers create recoverable narrative consequences (a correction to an earlier
  message, a follow-up from a colleague), never a game over or mockery.
- Initial answer and revised answer are stored separately. Score derives from the current
  answer set; points are never added repeatedly for the same decision.

---

## 2. Season continuity

Fictional city of **Νεάπολη**. Team: **MARA** (sources/provenance), **LEO** (networks/data),
**NOOR** (community response), **UNIT LEAD** (limits of conclusions).

- **CASE 01 — THE VIRAL LIE**: a 27-month-old clip from a fictional TV production was
  relabelled as an explosion at the central station. Viral spread was explained by one
  high-reach account. Conclusion: no evidence of coordinated manipulation in the observed
  data.
- Cliffhanger already in the product, and the exact opening of Case 02: 23 accounts publish
  near-identical text within 11 seconds — «Το φως έσβησε στις 22:14. Κανείς δεν μιλά.»
- Cases 02–06 follow the station-closure consultation and the exploitation of genuine local
  uncertainty. There is no single mastermind: some accounts are honest, some content is
  true, and deliberate deception is confirmed only in Case 06 and only for five accounts.

---

## 3. Common play contract

Per case: short opening → ~10 consequential decisions → evidence reveals → checkpoint →
report → handoff to the next case.

Each decision has:

- 3–4 plausible choices of comparable length,
- a specific hint (never the answer),
- choice-specific feedback,
- «τι δείχνουν τα στοιχεία» / «τι δεν μπορούμε ακόμη να συμπεράνουμε»,
- ΓΙΑΤΙ (principle) and ΑΝΑΘΕΩΡΗΣΗ (revision),
- explicit evidence ids available at that beat. No answer requires evidence not yet
  revealed, and the evidence panel never states the conclusion the player must reach.

Recorded locally per case: initial decision, revised decision, hint use, evidence opened
before answering, false alarms on true items, transfer result, objective tags.

---

## 4. CASE 02 — THE ECHO / Η ηχώ

**Dramatic question:** coordinated publication can be real without being covert manipulation.

### Evidence

| id | content |
|----|---------|
| E2-A | 23 distinct accounts publish the cliffhanger text between 22:14:00 and 22:14:11 (simulated platform export, second precision). |
| E2-B | Open residents'-association post at 21:40 publicly invites scheduled posts at 22:14 to recall a documented previous outage; supplies the exact text. |
| E2-C | 18 of the 23 link that invitation and identify as participants. Five remaining accounts have no verified provenance. |
| E2-D | Validated maintenance record: a 4-minute outage the **previous week**, not tonight. |
| E2-E | Two simulated feeds built from the same 40-post pool — one ranked by prior engagement, one chronological. Demonstrates selection, not a real platform audit. |

### Beats

1. Judge 23 posts / 11 seconds: investigate the synchrony; neither dismiss it nor call it a botnet.
2. Choose the next evidence: publicly search the exact phrase and the original call — not follower counts or nationality.
3. Compare the 21:40 invitation with the 22:14 posts: shared scheduled participation is supported for the 18 linked accounts.
4. Distinguish coordination / deception / automation: open organising is coordination, not proof of a deceptive operation; "all organic, no coordination" is equally wrong.
5. Check the outage date: a true event, misleading if presented as tonight; a contemporary outage remains unverified.
6. Tag known / suspected / unknown: 18 linked, five unresolved; no inference stretched across all 23.
7. Compare feeds by opening the chronological view of the common pool: one feed cannot establish majority opinion.
8. Answer a resident frightened about tonight's outage: give the verified date and an independent current-status route, without ridiculing the concern.
9. Draft the correction: acknowledge legitimate residents' organising, correct the temporal ambiguity, leave five accounts unclassified. Neither a blanket takedown nor a declaration of categorical innocence.
10. **Transfer:** a fresh group of library volunteers posts identical text after an explicit public call. Classify open coordination, and judge the truth of their factual claim separately.

**Report line:** «Τεκμηριώνεται δημόσια οργανωμένη δημοσίευση για 18 λογαριασμούς. Δεν
τεκμηριώνεται κρυφή χειραγώγηση για το σύνολο.»

**Handoff:** a professional-looking "independent observatory" claims the station closure is
scientifically inevitable.

---

## 5. CASE 03 — THE SOURCE / Η πηγή

**Question:** where does a professional-looking report get its authority?

### Evidence

| id | content |
|----|---------|
| E3-A | Fictional «Παρατηρητήριο Αστικής Ροής» page: "Μελέτη αποδεικνύει ότι ο σταθμός είναι επικίνδυνος", named author, 3 citations. |
| E3-B | Full primary transport report: recommends **temporary platform repairs**; no recommendation for permanent closure. |
| E3-C | Independent company registry and funding disclosure: the observatory is funded by a developer owning nearby property. Not proof that every claim is false. |
| E3-D | Citation 1 is real within the story and supports only passenger counts. Citation 2's title is absent from the simulated publisher catalogue (unverified, not proven nonexistent). Citation 3 circularly cites another version of the observatory page. |
| E3-E | A message offering the "full report" at `urban-flow-verify.example`, asking for an email password/OTP — versus the genuine, independently located public PDF that requires no login. |

### Beats

1. Do not judge by logo or design: isolate the closure claim.
2. Lateral reading mechanic: leave the page for the simulated independent registry and the original publisher's results, instead of rereading "About us".
3. Trace the cited source and read the relevant full paragraph before concluding.
4. Compare the headline with the repair recommendation: the primary source does not justify closure.
5. Interpret funding: a disclosed conflict demands scrutiny; it does not automatically falsify the data.
6. Check the citations: supported-but-irrelevant / unverified / circular. Do not label an absent search result definitive fabrication.
7. Confront an AI-generated summary asserting "the study proves closure": verify against the primary text. Fluent prose and reference lists are not evidence.
8. Handle the access lure: retrieve the public report independently, never supply credentials; distinguish the authentic PDF from the impersonation.
9. Help a colleague who entered a password: through the known official route, change the compromised/reused password, revoke sessions, contact account support. Do not blame them and never ask them for the secret. Simulation only.
10. **Transfer:** a modest-looking library bulletin links correctly to a primary report. Accept the bounded, supported claim despite low production value.

**Report:** a precise source/claim assessment, not a blanket blacklist.

**Handoff:** an 8-second clip appears to show the engineer admitting «γνωρίζαμε τον κίνδυνο».

---

## 6. CASE 04 — THE CUT / Τα δώδεκα δευτερόλεπτα

**Question:** authentic media can mislead; synthetic media can be transparently illustrative.

### Evidence

| id | content |
|----|---------|
| E4-A | 8-second captioned clip. Transcript: «Δεν μπορούμε να εγγυηθούμε ότι δεν υπάρχει κίνδυνος.» Caption: «Ομολογία άμεσου κινδύνου κατάρρευσης». |
| E4-B | Full 20-second segment including the missing preceding 12 seconds. Interviewer: «Μιλάτε για κατάρρευση ή για μικροκαθυστερήσεις κατά τις εργασίες;» Engineer: «Για μικροκαθυστερήσεις. Σε ένα έργο δεν υπάρχει μηδενικό ρίσκο καθυστέρησης.» then the 8-second sentence. Full transcripts and a synced timeline; no video generation required. |
| E4-C | Authenticated original full public briefing plus technical note: the works cause delays; no evidence of imminent collapse. |
| E4-D | A labelled synthetic illustrative avatar explaining station accessibility. Transcript matches the technical note; synthetic nature clearly disclosed. |
| E4-E | Unknown voice message impersonating NOOR, urgently asking for residents' IDs to be uploaded "to protect the investigation". The independently known in-game team channel confirms NOOR did not request it. |

### Beats

1. Hold the collapse claim unverified while locating the full context.
2. Seek the complete original recording and timestamp, not unreliable visual-artifact guessing.
3. Restore the missing segment using an accessible compare control.
4. Identify semantic/contextual omission; no need to claim the pixels were fabricated.
5. Verify the narrower delay claim: supported. The danger-of-collapse claim is unsupported by these sources.
6. Judge the labelled avatar on disclosure and factual support, not "AI, therefore false".
7. Unknown voice: withhold identity judgment pending out-of-band verification; apparent voice similarity is not enough.
8. Choose the known team contact instead of replying to the supplied link; after confirmation, identify the impersonation request (the audio generation mechanism remains unknown).
9. Support the targeted engineer: publish the full context, request a proportionate platform review of the misleading post, avoid spreading private details.
10. **Transfer:** a new sports quote, «δεν αποκλείουμε αλλαγές», with the complete transcript supplied. Reject the unsupported "confirmed resignation" headline while acknowledging the authentic quote.

**Report:** authenticity, context, truth and identity are four separate judgments.

**Handoff:** a chart reading «+50% ΚΙΝΔΥΝΟΣ — ΤΟ 78% ΑΠΑΙΤΕΙ ΚΛΕΙΣΙΜΟ».

---

## 7. CASE 05 — THE CROWD / Ποια πλειοψηφία;

**Question:** the numbers can be correct while the inference is wrong. All figures fictional
and internally consistent, presented on selectable primary data cards with accessible table
equivalents.

| id | data |
|----|------|
| E5-A | Delay complaints — 2024: 20 per 1000 journeys; 2025: 30 per 1000 journeys. That is 2% → 3%: **+1 percentage point**, **+50% relative**, **+10 complaints per 1000**. Complaints measure neither accidents nor injury risk. |
| E5-B | Bar chart of 2% and 3% with a y-axis of 1.9%–3.1%, labelled; a toggle shows the same values on a zero baseline. |
| E5-C | Open online poll: 780 of 1000 respondents support closure. The link circulated in an anti-station group. Not a random sample; no valid conventional margin of error. |
| E5-D | A distinct probability-sample municipal survey: n = 600, 51% support / 49% oppose, reported margin ±4 percentage points (simplified educational report). Does not establish a clear lead. |
| E5-E | Raw complaint counts: district A = 120 with population 120,000; district B = 60 with 30,000. Rates: A = 1 per 1000, B = 2 per 1000, same period and definition. |
| E5-F | Waits [1, 2, 2, 3, 22] minutes: mean = 6, median = 2. "The mean is 6" is true; "the typical passenger waits 6 minutes" does not follow. |

### Beats

1. Identify what is measured: delay complaints, not physical danger.
2. Convert 20/1000 → 30/1000 into both absolute and relative change; neither deny the increase nor inflate it to "+50 points".
3. Toggle the chart baseline and explain the visual effect while acknowledging the real numerical increase.
4. Check the denominator for districts A and B: B's rate is higher despite the smaller total.
5. Examine poll recruitment before accepting a population claim; 78% correctly describes the respondents.
6. Compare 51/49 with the supplied uncertainty: acknowledge a close result, do not announce a clear mandate.
7. Use mean vs median and the outlier to write a precise description of waiting time.
8. Correlation: a joint increase in works and complaints does not isolate a cause. Ask for comparable periods/routes; do not invent causal certainty.
9. Build a public-facing corrected caption including measure, denominator, dates and uncertainty; brief a resident deciding whether to attend the consultation, without telling them which political position to take.
10. **Transfer:** a new dataset 40/2000 → 50/2000, i.e. 2% → 2.5%, +0.5 pp / +25%, with no safety inference. A truthful plain table is offered as a control item that should be accepted.

**Report:** numeracy, charts, sampling and uncertainty subskills, mapped onto the existing
five bars and detailed only in the report text.

**Handoff:** a leaked invoice claims to identify who manufactured the entire debate.

---

## 8. CASE 06 — THE ATTRIBUTION / Ποιος ευθύνεται;

**Question:** how far can a public accusation go while protecting a community?

| id | content |
|----|---------|
| E6-A | Unverified screenshot "invoice" alleging a foreign sponsor. No original provenance. |
| E6-B | Shared hosting across the observatory and unrelated innocuous sites. Does not prove common ownership. |
| E6-C | Verified fictional public commercial record: a local communications company is contracted by the property developer for public communications. Not proof of deception. |
| E6-D | Independent corroboration within the simulation: a voluntarily supplied original campaign brief, authenticated by a matching company document identifier and confirmed by the responsible signatory through an independently sourced official contact. The brief explicitly orders presenting selected company-operated accounts as unrelated residents and deliberately relabelling last week's outage as current. Verified scheduling exports link exactly **five** of the Case 02 accounts — not all 23. This supports deceptive coordinated amplification by the local company on this campaign. |
| E6-E | No authenticated evidence ties the alleged foreign sponsor to instruction, funding or control. Foreign-language reposts alone are insufficient. |
| E6-F | A malicious new post publishes a volunteer's private address and accuses them of running all 23 accounts. An independent, genuine maintenance notice remains valid. |

### Beats

1. Preserve the screenshot as an unverified lead; no public accusation yet.
2. Reject shared hosting as ownership proof; prioritise independent provenance.
3. Read the contract scope: it establishes a commercial relationship only.
4. Verify the original brief and the confirmation and match the five account ids: now conclude deliberate coordinated deceptive action for those five. This is not a permanent "we can never know".
5. Scope attribution across companies, account operators and the alleged sponsor: name only documented roles; do not attribute every campaign tactic to every contracting party.
6. Assess the foreign claim separately: not established. Absence of proof is not proof of absence.
7. Privacy response to the doxxing: preserve the minimum necessary private evidence in simulated restricted case notes, report the harm, support the volunteer. Never repost the address; no identifying details are ever displayed.
8. Community briefing: correct false dates and context, preserve true notices and legitimate dissent, state verified actors and limits, provide a safe independent information route.
9. Respond to a sceptical resident: show the evidence chain and the correction history respectfully; do not demand trust or discredit the whole community.
10. **Transfer:** a new case with synchrony + shared host + foreign reposts but **no** verified instructions: insufficient for attribution. The contrast with the strong five-account evidence rewards both caution and decisiveness.

**Endings** are driven by the player's actual choices: responsible bounded attribution /
corrected premature accusation / unresolved weaknesses with a replay path. The game never
claims the player has scientifically demonstrated social resilience.

**Final report** distinguishes content falsity, intent, coordination, actor role, and the
unknown sponsor. The season closes on «Έλεγξε — κατανόησε — επαλήθευσε — προστάτευσε —
εξήγησε» and on community restoration, not universal hidden conspiracy.

---

## 9. Implementation contract

- Reuse the existing visual shell. No redesign. Per-case content is data-driven.
- CASE 01 keeps its bespoke screens and its existing localStorage key
  `the-signal-files-case-01`; it is never wiped or migrated destructively.
- Cases 02–06 each use an independent versioned key `the-signal-files-case-0X-v1`.
- Hub opens, resumes and reopens the report of each case. The recommended order is shown,
  but direct access is allowed for classroom use. Reset affects only the named case, after
  confirmation.
- The five skill bars are unchanged. Objective tags (`data-literacy`, `lateral-reading`,
  `privacy`, `impersonation`, `proportionality`, …) are recorded internally and surfaced
  only as report detail.
- No remote tracking, no accounts, no API keys, no live AI.
- Sources appear in an optional educational rationale panel and in this document, never as
  in-world evidence or endorsements.

### Future evaluation (specified, not implemented)

Equivalent pre/post items with a true/false mix, a comparison group where appropriate, and
an optional 6–8 week delayed assessment. No notifications are implemented, no effectiveness
is claimed, and no validated cut-off scores are invented.

---

## 10. References

Supplied by the author. Listed as background and framing, not as evidence that this game
works.

1. **EDMO — Guidelines for Effective Media Literacy Initiatives.**
   https://edmo.eu/areas-of-activities/media-literacy/raising-standards-the-edmo-guidelines/
   Explicit goals, empowering understanding, evaluation, avoiding generalised distrust.
   Basis for balanced true items and formative measurement.
2. **De la Hera et al. (2024), Digital literacy games: a systematic literature review.**
   *Frontiers in Communication.*
   https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2024.1407532/full
   Background on game-based digital literacy; not validation of these cases.
3. **Roozenbeek & van der Linden (2019), Fake news game confers psychological resistance
   against online misinformation.** https://www.nature.com/articles/s41599-019-0279-9
   Background for technique-focused inoculation/prebunking. Study effect sizes are not
   generalised to this product.

Primary frameworks and further reading (no quotations invented):

- UNESCO Media and Information Literacy curriculum — https://www.unesco.org/en/media-information-literacy?hub=66921
- OECD, *Facts not Fakes: Tackling Disinformation, Strengthening Information Integrity* — https://www.oecd.org/en/publications/facts-not-fakes-tackling-disinformation-strengthening-information-integrity_d909ff7a-en/full-report/component-6.html
- DigComp — information and data literacy — https://joint-research-centre.ec.europa.eu/oldpage-digcomp/digcomp-framework_en
- SaferInternet4Kids material — https://saferinternet4kids.gr/nea/bts_2026/

Supplied but **not independently verified in this session** (publisher fetch unavailable);
no findings or bibliographic fields invented:

- Barzilai & Stadtler (2025), *Learning to Evaluate (Mis)information in an Online Game:
  Strategies Matter!* https://www.sciencedirect.com/science/article/pii/S0360131524002240
