import { useId } from 'react';
import helen from '../assets/team-lead.jpg';
import lizzy from '../assets/team-mara.jpg';
import chris from '../assets/team-leo.jpg';
import kate from '../assets/team-noor.jpg';
import { strings as S } from './strings';
import type { Analyst } from './cases/types';
import type { TeamExchange } from './cases/team-conversations';
import './team-conversation.css';

const portraits: Record<Analyst, string> = { lead: helen, mara: lizzy, leo: chris, noor: kate };

export function TeamConversation({ conversation }: { conversation: TeamExchange | null }) {
  const titleId = useId();
  if (!conversation) return null;
  return <section className="team-conversation" aria-labelledby={titleId} data-conversation={conversation.id}>
    <header className="team-conversation-heading"><span>ΣΤΟ ΓΡΑΦΕΙΟ ΤΗΣ ΟΜΑΔΑΣ</span><h2 id={titleId}>{conversation.title}</h2></header>
    <ol className="team-conversation-turns">
      {conversation.lines.map((line, index) => <li key={`${conversation.id}-${index}`} className={`team-conversation-turn team-conversation-${line.who} ${index % 2 ? 'team-conversation-reply' : ''}`}>
        <img className="team-conversation-portrait" src={portraits[line.who]} alt="" width={88} height={88} loading="lazy" />
        <div className="team-conversation-bubble"><span className="team-conversation-speaker">{S.team[line.who].name}</span><p>{line.text}</p></div>
      </li>)}
    </ol>
  </section>;
}
