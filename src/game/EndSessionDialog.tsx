import * as Dialog from "@radix-ui/react-dialog";
import { GameButton } from "../components/GameButton";
import helen from "../assets/team-lead.jpg";

export function EndSessionDialog({ open, finished, error, onClose, onFinish }: {
  open: boolean; finished: boolean; error: string | null; onClose: () => void; onFinish: () => void;
}) {
  return <Dialog.Root open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-[81] max-h-[90svh] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-2 border-signal bg-background p-5 text-foreground shadow-xl sm:p-7" onInteractOutside={(event) => event.preventDefault()}>
        <div className="mb-4 flex items-center gap-3">
          <img src={helen} alt="" className="h-20 w-20 shrink-0 border-2 border-border object-cover" />
          <div><span className="font-mono text-xs font-bold text-signal">HELEN</span>
            <Dialog.Title className="font-display text-xl">{finished ? "Τα λέμε την επόμενη φορά!" : "Ολοκλήρωση για σήμερα"}</Dialog.Title>
          </div>
        </div>
        <Dialog.Description className="text-base leading-relaxed">
          {finished
            ? "Η σημερινή συνεδρία ολοκληρώθηκε και η πρόοδός σου αποθηκεύτηκε σε αυτόν τον browser. Μπορείς να κλείσεις την καρτέλα. Όταν επιστρέψεις, θα συνεχίσεις από το σημείο που σταμάτησες."
            : "Σταματάμε εδώ για σήμερα; Θα αποθηκεύσουμε την πρόοδό σου σε αυτόν τον browser, ώστε να συνεχίσεις την επόμενη φορά. Η υπόθεση δεν χρειάζεται να έχει ολοκληρωθεί."}
        </Dialog.Description>
        {error && <p role="alert" className="mt-4 font-semibold text-destructive">{error}</p>}
        <div className="mt-6 flex flex-col gap-3">
          {finished ? <GameButton onClick={onClose}>Επιστροφή στους φακέλους</GameButton> : <>
            <GameButton onClick={onFinish}>Αποθήκευση και ολοκλήρωση</GameButton>
            <GameButton variant="secondary" onClick={onClose}>Συνεχίζω το παιχνίδι</GameButton>
          </>}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
