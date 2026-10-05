<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the game as a single-route state-driven experience; this preserves instant local progress restoration between Hub and Case.
- Store CASE 01 progress only in browser localStorage; the MVP is intentionally account-free and offline-capable.
- Structure visual scenes as briefing, evidence, and verdict families instead of a repeated dashboard layout; this keeps the narrative identity primary.
- Use Archivo Black for display text and IBM Plex Sans/Mono for Greek UI and metadata; this preserves editorial character with reliable Greek legibility.
- Keep secondary Hub cases in a single-open, locally ephemeral archive accordion; this prevents status/action collisions without changing game progress.
- Author Cases 02–06 as typed CaseDef data with independent versioned localStorage keys; this keeps one runner consistent while isolating progress.
- Derive glossary unlocked examples and Hub journey badges from a single completedCases set computed from stored progress; this keeps rewards in sync without duplicating progress state.
- Present the HELEN briefing as a four-step in-world sequence; this keeps onboarding text large and readable without scrolling.
- Render Case 05 statistical evidence through the supplied SVG figures plus adjacent HTML tables and accessible zoom/reveal controls; this preserves exact plotted data and methodological qualifications.
- Render Case 04 media evidence as supplied SVG simulations with adjacent HTML transcripts and post-choice identity verification; this prevents simulated props from being mistaken for real recordings.
