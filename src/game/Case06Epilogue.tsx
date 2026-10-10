import { communityReactions } from './cases/case06-epilogue';
import helen from '../assets/team-lead.jpg';
import './case-additions.css';

export function Case06Epilogue({ selected }: { selected: string[] }) {
  return <div className="community-epilogue">
    <span className="stamp">ΥΠΟΘΕΣΗ 06 · ΕΠΙΛΟΓΟΣ</span>
    <h1 className="font-display text-3xl sm:text-5xl">Την επόμενη μέρα</h1>
    <p className="text-lg">Ο φάκελος κλείνει. Η συζήτηση στην κοινότητα συνεχίζεται.</p>
    <p className="epilogue-context">Φανταστική συνέχεια: πώς θα μπορούσαν να αντιδράσουν μέλη της κοινότητας αν η αναφορά σου έφτανε σε αυτούς. Τα μηνύματα βασίζονται στις επιλογές σου· δεν αποτελούν νέα τεκμήρια ή πραγματική δημοσίευση.</p>
    {selected.length === 0 ? <p className="epilogue-context">Δεν υπάρχει αποθηκευμένο κείμενο αναφοράς για αυτή την παλαιότερη ολοκλήρωση. Δεν αποδίδουμε αντιδράσεις σε επιλογές που δεν γνωρίζουμε.</p> : <div className="reaction-grid">{communityReactions(selected).map(r => <article className="community-reaction" key={r.id} data-reaction={r.id}>
      <h2>{r.speaker}</h2><blockquote>{r.message}</blockquote><p>{r.note}</p>
    </article>)}</div>}
    <section className="epilogue-open"><h2 className="font-display text-xl">Όσα παραμένουν ανοιχτά</h2><ul>
      <li>Το συνολικό εύρος της επιχείρησης πέρα από τις πέντε επαληθευμένες αντιστοιχίσεις.</li>
      <li>Τυχόν ξένη εντολή, πληρωμή ή έλεγχος.</li>
      <li>Τυχόν έγκριση της συγκεκριμένης τακτικής από τον κατασκευαστή.</li>
    </ul></section>
    <div className="epilogue-helen"><img src={helen} alt="" /><div><strong>HELEN</strong><p>«Μια υπεύθυνη αναφορά δεν χρειάζεται να ευχαριστεί τους πάντες. Χρειάζεται να στηρίζει όσα λέει, να προστατεύει τους ανθρώπους και να δείχνει τι δεν γνωρίζουμε ακόμη.»</p></div></div>
  </div>;
}
