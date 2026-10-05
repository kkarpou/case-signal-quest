# Case 05 visual assets

These SVGs are original, precisely plotted educational assets for THE CROWD. All values are fictional data already in case05.ts. Paper background, teal/ochre/red editorial palette, selectable SVG text, Greek labels, title/description accessibility metadata. No external images or fonts are needed.

| Evidence | Default asset | Optional explanation/comparison |
|---|---|---|
| E5-A | /visuals/case05/a-change.svg | a-change-reveal.svg |
| E5-B | /visuals/case05/b-scales.svg | Two charts already shown together |
| E5-C | /visuals/case05/c-sample.svg | Recruitment path and respondent-only result |
| E5-D | /visuals/case05/d-uncertainty.svg | One proportion interval, 50% reference |
| E5-E | /visuals/case05/e-counts.svg | e-rates.svg |
| E5-F | /visuals/case05/f-waits.svg | f-waits-reveal.svg |

## Integration requirements

Integrate all six visuals into evidence and decision screens, with accessible alt descriptions and adjacent HTML data tables. Use a Case05Visual component selected by card.id; do not change other cases' visuals. Remove the existing tiny percentage-width bars for E5-B.

Provide a keyboard-accessible, focus-trapped full-size viewing dialog with a close button and Escape support, vertical scroll, no clipping, and readable mobile labels. On 390px screens a 800px-wide diagram shrunk into a sidecar is too small: either use responsive native SVG/HTML reconstruction with these exact geometries or provide an obvious zoom/fullscreen control that retains readable label sizes. Allow vertical scroll rather than hiding content. The image should be the primary evidence, not a decorative thumbnail below a long answer-revealing list. Keep the five skill metrics and persistence.

A: show raw percentages before answering; the three change calculations are the optional explanation after choice or via an explicit investigation control.
B: both true plots are required, equal plot heights, explicit tick labels: 0–4% and 1.9–3.1%, bars 2 and 3. The truncated chart is a deliberate teaching example, clearly identified with a nonzero baseline and axis break. Do not replace with bars with CSS width 2% and 3%. Avoid the universal claim that every graph must start at zero: the example concerns bar-length comparisons.
C: 780/1000=78%, 220 other responses. Do not call all other responses opposed. Never draw the population as 78% in favour. Show recruitment and self-selection, not fabricated population data.
D: display estimate 51 and interval 47–55 on 40–60 scale with 50 reference; 49 is the complementary share, not a second independent estimate. No invented 95% confidence level. Improve feedback: the reported interval for support contains 50, so it does not establish a majority; avoid teaching a generic rule comparing a two-percentage gap to a single estimate's margin.
E: toggle Counts / Per 1,000, with aria-pressed and visible denominators. A 120/120000*1000=1; B 60/30000*1000=2. Do not imply causation or use these counts as accident risk.
F: numeric 0–24 minute axis with points 1,2,2,3,22; stack duplicate twos. Mean=6, median=2. Optional reveal with marker lines and arithmetic. Five observations cannot characterise the whole transport system.

Move answer-revealing sentences from pre-choice card.lines into post-choice feedback/reveal panels in Case 05 only. Retain raw figures, recruitment facts and methodological caveats. Preserve the six decisions, scene ordering, identifiers and storage key.

Validation: inspect all six evidence/decision screens at 390x844 and 1280x720, light/dark, opening and closing the figure dialog, scroll and keyboard focus, E toggle and reveal controls. Confirm other cases still render and build passes. Do not claim the public site is updated unless publishing has actually happened.
