from pathlib import Path
from html import escape

OUT=Path(__file__).resolve().parent.parent/'public/visuals/case05'
OUT.mkdir(parents=True,exist_ok=True)
INK='#202a2d'; PAPER='#f7f1e5'; TEAL='#176b70'; RED='#a13f39'; GOLD='#aa7015'; GRID='#c7c9bd'
def text(x,y,s,size=28,color=INK,weight=500,anchor='start'):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(str(s))}</text>'
def line(x1,y1,x2,y2,color=GRID,width=2,dash=''):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def rect(x,y,w,h,color):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"/>'
def circle(x,y,r,color):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>'
def save(name,title,desc,body,height=900):
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><rect width="800" height="{height}" fill="{PAPER}"/><g font-family="DejaVu Sans, Arial, sans-serif">'''
    svg+=text(36,42,'THE CROWD / ΦΑΚΕΛΟΣ 05',21,TEAL,700)+text(36,93,title,32,INK,700)+line(36,116,764,116,INK,3)+body
    svg+=line(36,height-60,764,height-60)+text(36,height-25,'Φανταστικά δεδομένα • Εκπαιδευτική προσομοίωση',20)+ '</g></svg>'
    (OUT/(name+'.svg')).write_text(svg)
def fmt(v):return f'{v:g}'.replace('.',',')
def bars(title,labels,values,lo,hi,y,width=650,x=105,height=220,ticks=None,suffix='%',colors=None):
    b=text(36,y,title,28,INK,700); top=y+42; bottom=top+height
    for t in ticks or [lo,(lo+hi)/2,hi]:
        yy=bottom-(t-lo)/(hi-lo)*height
        b+=line(x,yy,x+width,yy)+text(x-14,yy+9,fmt(t)+suffix,23,anchor='end')
    b+=line(x,top,x,bottom,INK)+line(x,bottom,x+width,bottom,INK)
    for i,(label,value) in enumerate(zip(labels,values)):
        xx=x+width*(i+.5)/len(values); hh=(value-lo)/(hi-lo)*height
        b+=rect(xx-65,bottom-hh,130,hh,(colors or [TEAL,RED])[i%2])+text(xx,bottom-hh-13,fmt(value)+suffix,28,weight=700,anchor='middle')+text(xx,bottom+36,label,25,anchor='middle')
    return b

# A: rates and denominators, with calculation hidden in a separate reveal asset.
b=text(36,160,'Παράπονα καθυστέρησης ανά 1.000',28)
for y,year,n,p in [(220,'2024',20,2),(460,'2025',30,3)]:
    b+=text(36,y,year,32,weight=700)+text(36,y+44,f'{n} / 1.000 = {p}%',30,TEAL,700)
    for j in range(100):b+=rect(60+(j%20)*34,y+66+(j//20)*27,18,18,TEAL if j<n//10 else GRID)
b+=text(36,703,'Κάθε τετράγωνο = 10 στα 1.000',24)+text(36,744,'Τι μετράμε; Παράπονα καθυστέρησης.',27,weight=700)+text(36,789,'Πόσο άλλαξε το ποσοστό;',27)
save('a-change','Από 20 σε 30 στα 1.000','2024: 20 παράπονα ανά 1000, 2%. 2025: 30 ανά 1000, 3%. Κάθε τετράγωνο παριστάνει 10 στα 1000.',b)
b=text(36,175,'Απόλυτη μεταβολή',30,TEAL,700)+text(36,230,'3% − 2% = 1 ποσοστιαία μονάδα',30)+text(36,345,'Σχετική μεταβολή',30,TEAL,700)+text(36,400,'(3 − 2) / 2 × 100 = 50%',30)+text(36,515,'Με τον ίδιο παρονομαστή',30,TEAL,700)+text(36,570,'30 − 20 = 10 επιπλέον ανά 1.000',30)+text(36,710,'Οι τρεις περιγραφές είναι συμβατές.',28,weight=700)+text(36,765,'Τα δεδομένα δεν μετρούν ατυχήματα.',27)
save('a-change-reveal','Τρεις τρόποι να πεις τη μεταβολή','Αύξηση μίας ποσοστιαίας μονάδας ή 50 τοις εκατό σχετικά ή δέκα επιπλέον παράπονα ανά χίλια.',b)

# B: equal plotting heights, different baselines, explicit ticks and axis break.
b=bars('Α. Κλίμακα 0%–4%', ['2024','2025'],[2,3],0,4,162,ticks=[0,1,2,3,4])
b+=bars('Β. Κλίμακα 1,9%–3,1%', ['2024','2025'],[2,3],1.9,3.1,580,ticks=[1.9,2.2,2.5,2.8,3.1])
b+=text(36,530,'Ίδιες τιμές και ίδιο ύψος περιοχής σχεδίασης.',24)
b+=f'<path d="M 96 835 l 8 -7 l 8 7 l 8 -7" fill="none" stroke="{RED}" stroke-width="3"/>'
b+=text(36,935,'Προσοχή: ο δεύτερος άξονας δεν αρχίζει από 0.',23,RED,700)+text(36,988,'Ποιο γράφημα κάνει την αύξηση να φαίνεται μεγαλύτερη;',23)
save('b-scales','Ίδιοι αριθμοί, δύο κλίμακες','Και τα δύο ραβδογράμματα δείχνουν 2% το 2024 και 3% το 2025. Το πρώτο έχει άξονα 0 έως 4%, το δεύτερο 1,9 έως 3,1%.',b,1080)

# C: distinguish the recruitment process from the known result.
b=rect(36,150,728,115,'#e5ded1')+text(60,189,'Κάτοικοι της πόλης',29,weight=700)+text(60,232,'Η συνολική τους στάση δεν έχει μετρηθεί.',25)
b+=line(400,280,400,328,INK,3)+text(400,324,'▼',25,anchor='middle')
b+=rect(36,345,728,145,'#e3eae4')+text(60,387,'Ανοιχτός σύνδεσμος ψηφοφορίας',28,weight=700)+text(60,431,'Κυκλοφόρησε σε ομάδα κατά του σταθμού.',24)+text(60,467,'Ο καθένας επέλεξε αν θα απαντήσει.',25)
b+=text(36,553,'Απάντησαν 1.000 άτομα',30,weight=700)
b+=rect(36,586,728*.78,64,TEAL)+rect(36+728*.78,586,728*.22,64,'#d3c5ab')
b+=text(36,696,'780 υπέρ (78%)',27,TEAL,700)+text(764,696,'220 λοιπές απαντήσεις',23,anchor='end')
b+=text(36,769,'Το 78% αφορά ποια ομάδα;',29,weight=700)
save('c-sample','Από την πόλη στην ψηφοφορία','Σύνδεσμος σε ομάδα κατά του σταθμού. Αυτοεπιλογή 1000 απαντησάντων: 780 υπέρ, 220 λοιπές απαντήσεις. Η στάση της πόλης είναι άγνωστη.',b)

# D: one interval for the proportion in favour, avoiding independent-overlap inference.
b=text(36,164,'600 κάτοικοι • πιθανοτική επιλογή',28)+text(36,222,'Υπέρ 51%     /     Κατά 49%',34,weight=700)+text(36,274,'Αναφερόμενο περιθώριο: ±4 ποσοστιαίες μονάδες',24)
x=lambda p:100+(p-40)/20*600
for v in range(40,61,5):b+=line(x(v),370,x(v),585)+text(x(v),630,f'{v}%',25,anchor='middle')
b+=line(x(50),335,x(50),585,RED,3,'8 8')+text(x(50),323,'50%',27,RED,700,anchor='middle')
b+=line(x(47),465,x(55),465,TEAL,12)+line(x(47),438,x(47),492,TEAL,4)+line(x(55),438,x(55),492,TEAL,4)+circle(x(51),465,12,INK)
for v,yy in [(47,425),(51,535),(55,425)]:b+=text(x(v),yy,f'{v}%',27,weight=700,anchor='middle')
b+=text(36,697,'Εύρος για το ποσοστό «υπέρ»: 47%–55%.',27)+text(36,744,'Το επίπεδο εμπιστοσύνης δεν δίνεται στο σενάριο.',23)+text(36,795,'Πού βρίσκεται το 50% σε αυτό το εύρος;',26,weight=700)
save('d-uncertainty','Πόσο βέβαιο είναι το 51%;','Εκτίμηση υπέρ 51%, αναφερόμενο περιθώριο ±4 ποσοστιαίες μονάδες: εύρος 47% έως 55%. Γραμμή αναφοράς στο 50%. Δεν προσδιορίζεται επίπεδο εμπιστοσύνης.',b)

# E: switch between counts and population-normalised rates.
for normal in [False,True]:
    b=text(36,165,'Ίδια περίοδος • Ίδιος ορισμός παραπόνου',26)
    b+=bars('Παράπονα ανά 1.000 κατοίκους' if normal else 'Συνολικά παράπονα',['Περιοχή Α','Περιοχή Β'],[1,2] if normal else [120,60],0,2.5 if normal else 150,225,ticks=[0,.5,1,1.5,2,2.5] if normal else [0,30,60,90,120,150],suffix='',height=280)
    b+=text(36,645,'Α: 120 παράπονα / 120.000 κάτοικοι',27)+text(36,692,'Β: 60 παράπονα / 30.000 κάτοικοι',27)
    b+=text(36,775,'Ρυθμός = παράπονα / κάτοικοι × 1.000',26,TEAL,700) if normal else text(36,775,'Τι αλλάζει όταν λάβεις υπόψη τον πληθυσμό;',25,weight=700)
    save('e-rates' if normal else 'e-counts','Δύο περιοχές, δύο συγκρίσεις','Περιοχή Α: 120 παράπονα σε 120000 κατοίκους, 1 ανά 1000. Περιοχή Β: 60 σε 30000, 2 ανά 1000.' if normal else 'Περιοχή Α: 120 παράπονα σε 120000 κατοίκους. Περιοχή Β: 60 σε 30000 κατοίκους.',b)

# F: individual observations on a numeric scale; reveal location summaries later.
for reveal in [False,True]:
    b=text(36,165,'Πέντε αναμονές: 1, 2, 2, 3, 22 λεπτά',28)+text(36,216,'Κάθε κύκλος = μία παρατήρηση',25)
    xx=lambda v:72+v/24*660
    for v in range(0,25,4):b+=line(xx(v),275,xx(v),560)+text(xx(v),605,v,26,anchor='middle')
    b+=line(xx(0),560,xx(24),560,INK,3)+text(400,657,'Χρόνος αναμονής (λεπτά)',27,anchor='middle')
    for val,yy in [(1,525),(2,525),(2,475),(3,525),(22,525)]:b+=circle(xx(val),yy,17,TEAL)
    if reveal:
        for val,label,color,yy in [(2,'Διάμεσος: 2′',TEAL,285),(6,'Μέσος: 6′',RED,350)]:
            b+=line(xx(val),yy+15,xx(val),555,color,3,'7 7')+text(xx(val),yy,label,25,color,700)
        b+=text(36,723,'Μέσος = (1 + 2 + 2 + 3 + 22) / 5 = 6',26)+text(36,778,'Διάμεσος = η τρίτη τιμή στη σειρά = 2',26)
    else:b+=text(36,734,'Πού βρίσκονται οι περισσότερες αναμονές;',26,weight=700)+text(36,790,'Ποια τιμή απέχει περισσότερο από τις άλλες;',25)
    save('f-waits-reveal' if reveal else 'f-waits','Πώς μοιάζει μια «τυπική» αναμονή;','Πέντε σημεία στις θέσεις 1, 2, 2, 3 και 22 λεπτά. Οι δύο τιμές 2 εμφανίζονται κατακόρυφα στοιβαγμένες.'+(' Μέσος 6, διάμεσος 2.' if reveal else ''),b)
print('Created',len(list(OUT.glob('*.svg'))),'SVG assets')
