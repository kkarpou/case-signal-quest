import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { GameButton } from '../components/GameButton';
import { experienceCSV, experienceItems, readExperience, INSTRUMENT_VERSION } from './experience-data';
import { readSessionLog } from './play-sessions';

export function ExperienceExport() {
  const [error, setError] = useState(false);
  const download = (format: 'json' | 'csv') => {
    try {
      const experience = readExperience(localStorage);
      const content = format === 'csv' ? experienceCSV(experience.records) : JSON.stringify({
        exportedAt: new Date().toISOString(), scope: 'local-browser-pilot', instrumentVersion: INSTRUMENT_VERSION,
        instrumentNote: 'Authored momentary items; not a validated short PXI or IMI. Analyze separately; no composite score.',
        items: experienceItems, experience, sessions: readSessionLog(localStorage),
      }, null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url;
      link.download = `signal-files-pilot-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setError(false);
    } catch { setError(true); }
  };
  return <Dialog.Root>
    <Dialog.Trigger asChild><GameButton variant="ghost" className="min-h-11 px-2 py-2 text-xs normal-case">Δεδομένα πιλοτικής δοκιμής</GameButton></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] max-h-[90svh] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-2 border-signal bg-background p-6 text-foreground">
        <Dialog.Title className="font-display text-xl">Εξαγωγή πιλοτικών δεδομένων</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-relaxed">Η εξαγωγή περιλαμβάνει τις αξιολογήσεις από αυτόν τον browser. Δεν περιέχει ονόματα και δεν αποστέλλει δεδομένα σε διακομιστή. Αν τον browser χρησιμοποιούν διαφορετικά άτομα, τα δεδομένα τους δεν διαχωρίζονται ανά συμμετέχοντα.</Dialog.Description>
        <p className="mt-3 text-sm">JSON: απαντήσεις, συνεδρίες και περιγραφή των κλιμάκων. CSV: μία γραμμή ανά check-in, μαζί με την κατάσταση συμπλήρωσης. Οι τρεις ερωτήσεις αναλύονται χωριστά· δεν αποτελούν κλίμακα IMI ή miniPXI.</p>
        {error && <p role="alert" className="mt-3 text-destructive">Η εξαγωγή απέτυχε. Τα αποθηκευμένα δεδομένα δεν τροποποιήθηκαν.</p>}
        <div className="mt-5 flex flex-wrap gap-2"><GameButton onClick={() => download('json')}>Λήψη JSON</GameButton><GameButton variant="secondary" onClick={() => download('csv')}>Λήψη CSV</GameButton><Dialog.Close asChild><GameButton variant="ghost">Κλείσιμο</GameButton></Dialog.Close></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
