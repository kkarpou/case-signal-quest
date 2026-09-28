# Signal Files: Case Zero

Create a mobile-first narrative serious game titled “THE SIGNAL FILES”, starting with a fully playable MVP for CASE 01 — THE VIRAL LIE. Language: Greek throughout the UI and narrative, except keep the brand THE SIGNAL FILES and episode title THE VIRAL LIE in English as stylistic brand elements. Target audience: teenagers/young adults, approximately 13–18, but mature enough for university/media-literacy demos.

CORE CONCEPT
The player is a junior analyst in an independent Information Integrity Unit investigating a viral false claim. The learning objective is evidence discipline around misinformation/FIMI. The core distinctions must appear repeatedly:
- Ψευδές περιεχόμενο ≠ παραπληροφόρηση
- Viral διάδοση ≠ συντονισμός
- Συντονισμός ≠ απόδοση ευθύνης
- Σύνδεση ≠ έλεγχος
- Μοτίβο ≠ συντονισμός
- Απουσία τεκμηρίων ≠ τεκμήριο απουσίας
The player should learn not to overclaim and should be allowed to choose “Δεν υπάρχουν ακόμη αρκετά στοιχεία.”

VISUAL DIRECTION
Use a stylized graphic-novel + editorial collage + crisp vector data-UI aesthetic. Avoid photorealistic AI-looking people, cyberpunk clichés, hooded hackers, military command rooms, glossy corporate dashboard aesthetics, and overuse of neon. Think screen-printed/riso-inspired textures, torn paper, bold typographic labels, off-white paper surfaces, black/charcoal, cyan/teal, muted red, mustard/amber, subtle print grain. Characters should be clearly illustrated/stylized rather than realistic. Data visualisations (network, timeline, source checks) should be clean, readable, vector-like.
Design for mobile first. Every screen must work well at 390px width, with large tap targets, no tiny text, and a single dominant interaction per screen. Desktop should expand gracefully to 16:9. Do not bake critical text into images; UI text must be actual HTML so it remains readable and translatable.

GAME STRUCTURE
Create a Season Hub with one playable case and five visibly locked future cases. The first card is:
CASE 01 — THE VIRAL LIE
subtitle: «Μια ψευδής ιστορία εξαπλώνεται. Είναι όμως εκστρατεία;»
Locked preview cards may show CASE 02 — THE ECHO and four placeholder future cases.

CASE 01 STORY
Fictional country/city only; do not use real governments, parties or real-world political actors. A 19-second video appears online claiming there has been an explosion at the central station. It spreads rapidly. Investigation reveals the video is old footage from a fictional TV production and has been miscontextualised. A high-reach influencer explains most of the initial spike. A foreign-language site later amplifies the story but appears to follow the viral wave rather than originate it. There is no sufficient evidence of coordinated manipulation in the observed dataset.

CHARACTERS
Recurring stylized illustrated team portraits/avatars:
- Unit Lead: calm, experienced, asks for defensible conclusions.
- MARA — source/content analyst: provenance, reverse search, metadata.
- LEO — network analyst: structures, clusters, amplification flows.
- NOOR — communications/civil-society perspective: proportional response, avoid over-attribution.
Use brief dialogue bubbles between analytic screens so the experience feels like a narrative investigation, not a quiz.

CASE FLOW — implement these as playable screens/acts with progress indicator:
1. Cold open: viral post + live spread counter + urgent briefing.
2. Decision 1: classify the incident: Confirmed disinformation / Unverified claim / Coordinated manipulation / FIMI operation. Best: Unverified claim.
3. Source Lab: choose what to inspect first: provenance / nationality of uploader / angry comments / emotional language. Best: provenance.
4. Evidence reveal: reverse-search result shows footage is 27 months old and from a fictional TV production.
5. Decision 3: what has been proven? Best: authentic video presented in false context; not proof of intent.
6. ANALYSIS CHECKPOINT screen with three columns/cards: ΤΙ ΞΕΡΟΥΜΕ / ΤΙ ΥΠΟΨΙΑΖΟΜΑΣΤΕ / ΤΙ ΔΕΝ ΞΕΡΟΥΜΕ.
7. Virality timeline: show spike after one high-reach influencer repost. Decision: what does spike indicate? Best: high-reach account may explain much of the increase.
8. Network view: visual star/broadcast cascade. Decision: Coordinated cluster / Botnet / Broadcast cascade / Command-and-control network. Best: Broadcast cascade.
9. Foreign signal: fictional site worldpulse.media republishes later in multiple languages. Decision: Best = foreign-language amplification requiring further checking, not automatic foreign operation.
10. Directionality screen: timeline shows the foreign site followed the already-viral narrative. Decision: Best = it appears to follow rather than originate.
11. Response decision: choose public response. Best wording should correct the false claim and explicitly state that there is currently no evidence of organised coordination.
12. Final classification: Organic misinformation / Coordinated domestic manipulation / Foreign-linked manipulation / FIMI operation / Insufficient evidence. Preferred result: “No evidence of coordinated manipulation in the observed dataset.”
13. Confidence: Low / Medium / High. Best: Medium, because evidence strongly supports miscontextualisation but observed data is incomplete.
14. Final learning decision: strongest lesson = viral spread can be explained without assuming coordinated operation.
15. Case Report: skill profile and personalised feedback.
16. Cliffhanger: LEO message “Πρέπει να δεις αυτό.” Show 23 accounts posting near-identical text within seconds. Reveal CASE 02 — THE ECHO.

DECISION FEEDBACK
Every decision must give meaningful explanatory feedback, not just right/wrong. After choosing, show:
- Η επιλογή σου
- Τι δείχνουν τα στοιχεία
- Τι ΔΕΝ μπορούμε ακόμη να συμπεράνουμε
- Αρχή
Then show two buttons: ΣΥΝΕΧΕΙΑ and ΓΙΑΤΙ;
ΓΙΑΤΙ; expands a short educational explanation. On critical decisions also offer ΑΝΑΘΕΩΡΗΣΗ, allowing the player to change the decision after reading feedback. Track whether the player revised their inference.
Wrong or premature options should not dead-end the story. They should reduce one or more skill metrics and give constructive feedback.

SCORING
Track five dimensions, each 0–100:
- Έλεγχος πηγών
- Συλλογιστική δικτύων
- Πειθαρχία τεκμηρίων
- Διαχείριση αβεβαιότητας
- Κρίση απόκρισης
Do not make total score the main outcome. Show a profile/radar or horizontal bars at the end. Track decisions and revisions locally in browser storage.

STATE MODEL
Use a clear internal state object with at least:
sourceVerified, contentMiscontextualized, coordinationEvidence, foreignAmplification, attributionConfidence, responseChoice, decisions, revisedDecisions, skillScores, currentAct, completed.
Save progress to localStorage and allow reset progress from Hub.

UX
- Mobile-first fixed bottom action area with large buttons.
- Desktop keyboard support: arrows to move focus, Enter/Space select, Esc back where appropriate, H for hint.
- Add a subtle progress indicator through the case.
- Include “Υπόδειξη” but never auto-reveal the answer; hints should point to relevant evidence.
- Dark mode is default; provide light mode.
- No onboarding/tour overlay.
- Make all text selectable/real HTML.
- Use accessible contrast and semantic buttons.

CONTENT/SAFETY
All actors, organisations, countries, domains and incidents are fictional. Avoid partisan messaging. The player is rewarded for evidence discipline and uncertainty, not for reaching a predetermined political conclusion.

DELIVERABLE
Build the functioning interactive web app, not just a mockup. Implement the Season Hub and the complete playable Case 01 with all decisions, explanations, checkpoints, scoring, report, persistence, responsive mobile/desktop design, and cliffhanger. Use placeholder illustrated avatar/art panels if needed, but keep the specified graphic-novel/editorial-collage style in the UI.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://case-signal-quest.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/295443cc-0e94-4b8f-9969-9410a2113dea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
