# Portrait team conversations

Eight short exchanges are rendered as alternating speech bubbles with the existing HELEN, LIZZY, CHRIS and KATE portraits and visible speaker names. They are static ordered conversations: no typing delay, autoplay, extra progression gate or player dialogue choices. The order in the DOM follows the spoken exchange even when portraits alternate sides. Portraits are decorative beside the explicit names; text remains selectable and screen-reader accessible.

| Case | Existing insertion point | Subject |
| --- | --- | --- |
| 01 | Archive reveal, act 3 | Authentic image vs false present-day context |
| 02 | E2-A | Synchronization vs malicious intent |
| 02 | E2-B | Revision after finding a public call; no disclosure of later account matches |
| 03 | E3-C | Conflict of interest vs proof of falsity |
| 04 | E4-B | Restored context vs blanket claims about station safety |
| 05 | E5-C | Respecting respondents without generalizing to the city |
| 06 | E6-C | Contract vs authorization of a deceptive tactic |
| 06 | E6-D | Updating attribution after authentication and five verified matches |

The lines describe characters' own interpretations, not the player's choices. Only evidence available at the insertion point is referenced. In Cases 02 and 06 later exchanges explicitly update earlier positions. Existing scene indices, saves, scores, report composition and survey flows are unchanged. In Case 01 the prior single LIZZY explanation is replaced by the exchange to avoid repeating it.

Validation: TypeScript and production build; browser checks at all eight insertion points, portrait loading, mobile/desktop light/dark layouts, readable DOM order, horizontal overflow, continuation and preservation of scores/decisions. No new images or assets were generated.
