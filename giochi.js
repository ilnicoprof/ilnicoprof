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
  {titolo:"Il drone sotto zero", tipo:"escape", materia:"algebra", classe:"3ª",
   capitolo:["I numeri relativi", "Le operazioni con i numeri relativi"],
   descr:"Escape room: sistema gli oggetti ai piani del palazzo, guida il drone sopra i tetti fino al pacco e collega le operazioni ai risultati.",
   link:"escape-relativi.html"}
];

/* I giochi del prof: i giochi più grandi, con il link diretto
   {titolo:"…", descr:"…", link:"https://…"}
   (facoltativi: materia:"geometria", classe:"2ª")
*/
const GIOCHI_PROF = [];
