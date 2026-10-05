# Case 04 — THE CUT: visual evidence and learning flow

All six SVGs in `public/visuals/case04/` are original, typeset educational simulations. Rebuild with `python scripts/make_case04_visuals.py`. They are deliberately not real video or audio: label the interface «Οπτική αναπαράσταση / μεταγραφή προσομοίωσης». Do not add fake play buttons, waveforms or claims that a real recording exists. The message wording and source-note layout are authored scenario props, not external records.

| Evidence | Asset | Interaction |
| --- | --- | --- |
| E4-A | a-social-clip.svg | Separate speaker words from the post's caption; no full context yet. |
| E4-B | b-full-context.svg | Toggle «Σύντομο 8″» (A asset) / «Πλήρες 20″» (B asset); timeline exactly 60%/40%. Default full. |
| E4-C | c-source-note.svg | Read primary-source extract; optionally select the sentence supporting a bounded claim. |
| E4-D | d-disclosed-avatar.svg | Clearly disclosed schematic avatar; source control opens E4-C inside the evidence interface. |
| E4-E | e-unverified-message.svg | Unverified message only, followed by the existing three response choices. |
| Voice feedback | e-verification-reveal.svg | Show AFTER committing a choice; correct-choice action is independently contacting Kate; for wrong choices, label as subsequent team verification, not something the player did. |

## Implementation contract

Add a Case04Visual component integrated in BOTH evidence and decision views. Reuse the Case05 accessible image zoom pattern but ensure Escape closes a dialog without triggering the runner's revise/hub shortcuts, focus is trapped and returned, and background shortcuts do not act inside dialogs. Provide adjacent accessible HTML transcripts, not just tiny rasterized text. Fullscreen/zoom must remain usable at 390×844 and 1280×720, both themes, keyboard only. Avoid duplicate HTML IDs if desktop/mobile evidence instances both mount.

Preserve scene count/order, decision IDs, stable choice IDs and storageKey v1. Preserve all other cases, character art and Case05 visuals. No public deployment requested.

Remove advance conclusions from Case04 evidence metadata/lines: E4-C title should be «Τεχνικό σημείωμα», raw text «Οι εργασίες μπορεί να προκαλέσουν καθυστερήσεις.» with provenance; do not assert overall safety. E4-D show disclosure and source text, let player compare rather than saying already accurate. E4-E kicker «ΕΙΣΕΡΧΟΜΕΝΟ ΗΧΗΤΙΚΟ · ΜΕΤΑΓΡΑΦΗ ΠΡΟΣΟΜΟΙΩΣΗΣ», no «ΠΛΑΣΤΟΠΡΟΣΩΠΙΑ», no Kate denial before selection, and title «Ένα επείγον αίτημα». Change decision title «ΣΥΝΘΕΤΙΚΟ ΔΕΝ ΣΗΜΑΙΝΕΙ ΨΕΥΔΕΣ» to «ΕΛΕΓΧΟΣ ΤΟΥ AVATAR». Keep pedagogical findings in feedback and final report.

Case04 choice presentation must no longer put every correct answer first. Use a deterministic per-decision order, preserving choice IDs: hold [leap,bounded,dismiss], context [dismiss,leap,bounded], claim [bounded,dismiss,leap], synthetic [leap,bounded,dismiss], voice [dismiss,leap,bounded]. Scope to Case04 data, not a global random shuffle.

Replace the shared generic feedback and why WITH Case04-specific text without changing other cases. Suggested wrong-choice feedback:

| Decision | leap | dismiss |
| --- | --- | --- |
| hold | Η λέξη «κίνδυνος» δεν προσδιορίζει κατάρρευση. Λείπει η προηγούμενη ερώτηση. | Χωρίς πρωτότυπο δεν τεκμηριώνεται ότι το βίντεο είναι τεχνητό. |
| context | Στο πλήρες τμήμα η ίδια φράση αφορά καθυστερήσεις. Δεν έχουμε ένδειξη κατασκευής εικόνας ή φωνής. | Η γνησιότητα της φράσης δεν δικαιώνει μια λεζάντα που αλλάζει το αντικείμενό της. |
| claim | Η πηγή μιλά για καθυστερήσεις· δεν πιστοποιεί απόλυτη ασφάλεια του έργου. | Μπορούμε να αναφέρουμε πιθανές καθυστερήσεις, επειδή αυτό στηρίζεται στις πηγές. |
| synthetic | Η συνθετική μορφή δεν αποδεικνύει ότι το κείμενο είναι ψευδές. Σύγκρινέ το με το E4-C. | Η εμφάνιση δεν αποδεικνύει πραγματική ταυτότητα. Η κάρτα δηλώνει συνθετικό παρουσιαστή. |
| voice | Η ομοιότητα φωνής δεν επιβεβαιώνει τον αποστολέα. Το αίτημα χρειάζεται έλεγχο από γνωστό κανάλι. | Δεν έχουμε στοιχεία για συγκεκριμένο εργαλείο ή παραγωγό. Η αναδημοσίευση διαδίδει το ανεπιβεβαίωτο αίτημα. |

Write distinct correct feedback and Why for each: missing referent; restored semantic context; limited scope of source; disclosure versus factual accuracy; independent identity verification versus unknown production mechanism. Replace misleading misconception labels (e.g. polished avatar judged real is overconfidence, not over-caution).

In voice feedback show the verification reveal for any submitted answer with accurate action attribution. Checkpoint/report may then state Kate denied the request. Do not conclude AI/deepfake or name a producer. No real ID collection, upload endpoint, external malicious link or voice cloning.

## Verification

Build/typecheck; inspect all five evidence/decision pairs, short/full toggle, source comparison and verification reveal. Verify first-time E4-E has no denial in visible text, alt, transcript or mounted hidden reveal. Verify reload restores selection/reveal; revising may retain learned information but must not award repeat score deltas. If touching revision scoring, derive skillScores from initial scores + one current choice per decision in scene order, clamped consistently, never cumulatively add on each click. Ensure Case05 remains functional. Report exact checks and any limitation.
