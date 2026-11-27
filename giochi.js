/* Giochi di ripasso del nicoprof (questo elenco si modifica a mano)
   Ogni gioco è una riga così:
   {titolo:"…", tipo:"minigioco" oppure "eureka", materia:"aritmetica", classe:"1ª",
    capitolo:"Le frazioni", descr:"…", link:"…"}
   capitolo: titolo esatto del capitolo, così il gioco compare anche dentro la sua scheda
   (per più capitoli: capitolo:["…", "…"])
   Un gioco senza materia è "generale": si vede sempre, con qualsiasi filtro.
*/
const GIOCHI = [
  {titolo:"Eureka solitario", tipo:"minigioco",
   descr:"Indovina la frase misteriosa di aritmetica, geometria, algebra o scienze, una lettera alla volta.",
   link:"eureka-solo.html"},
  {titolo:"L'aula chiusa", tipo:"escape", materia:"aritmetica", classe:"1ª", capitolo:"Insiemi, tabelle e grafici",
   descr:"Escape room: sistema i numeri nel diagramma di Venn, completa la tabella e aggiusta l'istogramma per aprire la porta.",
   link:"escape-insiemi.html"},
  {titolo:"Il supermercato chiuso", tipo:"escape", materia:"aritmetica", classe:"1ª", capitolo:"Numeri naturali e decimali",
   descr:"Escape room: scopri quanto vale ogni cifra nell'inventario del magazzino, metti in ordine i sacchetti di frutta secca e arrotonda lo scontrino per uscire dal supermercato.",
   link:"escape-numeri.html"},
  {titolo:"La casetta del guardiaparco", tipo:"escape", materia:"geometria", classe:"1ª", capitolo:"I primi elementi della geometria",
   descr:"Escape room: riconosci punti, linee, semirette e piani nelle foto del parco, tendi i fili tra le puntine con le regole di Euclide e ritrova le lanterne dell'orienteering sul piano cartesiano.",
   link:"escape-elementi.html"},
  {titolo:"Il plastico ferroviario", tipo:"escape", materia:"geometria", classe:"1ª", capitolo:"I segmenti",
   descr:"Escape room: riconosci binari consecutivi, adiacenti e spezzate, componi la nuova tratta con la somma dei segmenti, trova il punto medio e risolvi i problemi del capostazione.",
   link:"escape-segmenti.html"},
  {titolo:"La stazione meteo sul tetto", tipo:"escape", materia:"scienze", classe:"1ª", capitolo:"Metodo, grandezze e misure",
   descr:"Escape room: rimetti in ordine le tappe del metodo scientifico, leggi sensibilità e portata degli strumenti, calcola la media e converti le unità di misura sulla scala delle equivalenze.",
   link:"escape-misure.html"},
  {titolo:"Il drone sotto zero", tipo:"escape", materia:"algebra", classe:"3ª",
   capitolo:["I numeri relativi", "Le operazioni con i numeri relativi"],
   descr:"Escape room: sistema gli oggetti ai piani del palazzo, guida il drone sopra i tetti fino al pacco e collega le operazioni ai risultati.",
   link:"escape-relativi.html"},
  {titolo:"Il cantiere bloccato", tipo:"escape", materia:"algebra", classe:"3ª", capitolo:"Il calcolo letterale",
   descr:"Escape room: sostituisci le misure del progetto nelle formule, porta i monomi simili sugli scaffali con il muletto e sblocca la gru con le operazioni tra monomi.",
   link:"escape-letterale.html"},
  {titolo:"Il laboratorio sigillato", tipo:"escape", materia:"scienze", classe:"2ª", capitolo:"Dentro la materia",
   descr:"Escape room: costruisci un atomo, rimetti a posto la tavola periodica caduta e riconosci i legami chimici per uscire dal laboratorio.",
   link:"escape-chimica.html"}
];

/* I giochi del prof: i giochi più grandi, con il link diretto
   {titolo:"…", descr:"…", link:"https://…"}
   (facoltativi: materia:"geometria", classe:"2ª")
*/
const GIOCHI_PROF = [];
