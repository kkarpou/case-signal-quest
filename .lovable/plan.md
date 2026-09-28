# THE SIGNAL FILES — Editorial Case-File Redesign

## Στόχος
Να μετατραπεί η υπάρχουσα εμπειρία από σκοτεινό dashboard σε συνεκτικό narrative game με αισθητική graphic novel, investigative zine και layered case-board, χωρίς καμία αλλαγή σε λογική, κείμενα, βαθμολογία, πρόοδο ή χειρισμούς.

## Αλλαγές
- Η επάνω μπάρα γίνεται συμπαγές masthead φακέλου με status, act marker και επεισοδιακή γραμμή προόδου.
- Το Season Hub αποκτά μικρότερη editorial σύνθεση: το υπάρχον key art ως ανεξάρτητο collage layer, torn-paper τίτλο, taped snippets, vector network/timeline σημάδια και sticker CTA.
- Το CASE 01 γίνεται ενεργός φάκελος με εικόνα, stamp και progress strip· οι μελλοντικές υποθέσεις γίνονται σφραγισμένοι/taped dossiers σε δίστηλο desktop και μονόστηλο mobile.
- Οι πράξεις γίνονται case-board σκηνές: off-white question sheet, ξεχωριστό evidence print και tactile clipped-paper επιλογές A/B/C/D.
- Στο κινητό το evidence panel εμφανίζεται συμπαγές πριν από τις επιλογές, χωρίς να κρύβεται κρίσιμο στοιχείο.
- Το feedback αποκτά ισχυρό stamp, ξεχωριστά evidence/cannot/principle blocks και taped analyst note για το «ΓΙΑΤΙ;».
- Cold Open, Evidence Reveal, Checkpoint, Timeline, Network, Report και Cliffhanger αποκτούν ειδικές editorial συνθέσεις, με καθαρά vector δεδομένα και περιορισμένες χειρόγραφες/marker λεπτομέρειες.
- Dark και light mode μοιράζονται το ίδιο warm-paper/ink σύστημα, με cyan, alert red και amber ως σημασιολογικά accents.
- Προστίθενται διακριτικές entrance κινήσεις με πλήρη υποστήριξη reduced motion.

## Τεχνικές λεπτομέρειες
- Διατηρούνται ακριβώς τα υπάρχοντα state fields, localStorage keys, αποφάσεις, σωστές απαντήσεις, scoring, act order, keyboard shortcuts και single-route πλοήγηση.
- Οι αλλαγές περιορίζονται σε markup/classes παρουσίασης και semantic tokens/utilities στο κεντρικό stylesheet.
- Τα υπάρχοντα bitmap assets παραμένουν· νέα διακοσμητικά στοιχεία γίνονται με CSS και προσβάσιμα inline SVG χωρίς κρίσιμο κείμενο μέσα σε εικόνες.
- Τα fixed actions παραμένουν με μεγάλα tap targets. Οι πυκνές mobile σκηνές χρησιμοποιούν compact/collapsible evidence strip όπου χρειάζεται, όχι απόκρυψη στοιχείων.

## Έλεγχος
- Season Hub και πλήρης 16-act διαδρομή σε 390×844, 1068×639 και 1280×720.
- Έλεγχος πριν/μετά την επιλογή σε αντιπροσωπευτική decision screen και ανοιχτό «ΓΙΑΤΙ;».
- Επιβεβαίωση ότι δεν υπάρχει οριζόντια υπερχείλιση, ότι τα fixed actions δεν καλύπτουν περιεχόμενο και ότι κάθε πράξη παραμένει εντός viewport.
- Έλεγχος light/dark, focus states, reduced motion και τελικού build.
