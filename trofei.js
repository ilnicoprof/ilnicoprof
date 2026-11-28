/* ilnicoprof · trofei delle escape room
   - il nome dell'alunno e i trofei restano salvati SOLO su questo dispositivo (localStorage), niente viene inviato
   - ogni codice ha una parte casuale (diverso a ogni partita) e una "firma" calcolata con il nome:
     il codice di un compagno non funziona con un altro nome
   Per aggiungere un trofeo: una riga in TROFEI (id uguale a quello passato da OggettoSegreto.apri nella escape room). */
const TROFEI = [
  {id:"insiemi", nome:"Il Medaglione dei Due Regni", gioco:"L'aula chiusa", link:"escape-insiemi.html", argomento:"Insiemi, tabelle e grafici"},
  {id:"relativi", nome:"La Piuma del Grifone delle Nevi", gioco:"Il drone sotto zero", link:"escape-relativi.html", argomento:"Numeri relativi"},
  {id:"naturali", nome:"La Moneta del Mercante Infinito", gioco:"Il supermercato chiuso", link:"escape-numeri.html", argomento:"Numeri naturali e decimali"},
  {id:"letterale", nome:"La Pergamena delle Rune", gioco:"Il cantiere bloccato", link:"escape-letterale.html", argomento:"Espressioni letterali e monomi"},
  {id:"misure", nome:"La Clessidra del Custode delle Misure", gioco:"La stazione meteo sul tetto", link:"escape-misure.html", argomento:"Metodo, grandezze e misure"},
  {id:"segmenti", nome:"La Locomotiva di Cristallo", gioco:"Il plastico ferroviario", link:"escape-segmenti.html", argomento:"I segmenti"},
  {id:"stati", nome:"La Goccia di Ghiaccio Eterno", gioco:"Il rifugio nella bufera", link:"escape-stati.html", argomento:"Gli stati di aggregazione della materia"},
  {id:"elementi", nome:"La Bussola delle Stelle", gioco:"La casetta del guardiaparco", link:"escape-elementi.html", argomento:"I primi elementi della geometria"},
  {id:"trasforma", nome:"L'Uovo della Fenice", gioco:"Il laboratorio della pasticceria", link:"escape-trasforma.html", argomento:"La materia si trasforma"},
  {id:"cerchio", nome:"L'Anello dell'Uroboro", gioco:"Il luna park dopo la chiusura", link:"escape-cerchio.html", argomento:"Circonferenza e cerchio"},
  {id:"nervoso", nome:"Il Diadema dei Pensieri Lucenti", gioco:"Lo studio di medicina dello sport", link:"escape-nervoso.html", argomento:"Il sistema nervoso"},
  {id:"poliedri", nome:"La Gemma dei Cinque Elementi", gioco:"Il deposito del museo", link:"escape-poliedri.html", argomento:"I solidi e i poliedri"},
  {id:"genetica", nome:"L'Elica dell'Albero della Vita", gioco:"La serra dell'orto botanico", link:"escape-genetica.html", argomento:"Genetica e DNA"},
  {id:"riproduttore", nome:"Il Medaglione della Luna Nuova", gioco:"La mostra «Come siamo nati»", link:"escape-riproduttore.html", argomento:"Apparato riproduttore"},
  {id:"materia", nome:"Il Cristallo dell'Alchimista", gioco:"Il laboratorio sigillato", link:"escape-chimica.html", argomento:"Atomi, tavola periodica e legami"}
];

const Trofei = (() => {
  const SALE = "ilnicoprof·2026·trofei";
  const ALF = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // niente O/0 e I/1, che si confondono
  const K_NOME = "ilnicoprof:nome", K_TROFEI = "ilnicoprof:trofei";
  const leggi = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
  const scrivi = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  /* "Marco R." e "marco r" sono lo stesso nome */
  const pulisci = n => String(n || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  function hash(s){
    let a = 0x811c9dc5, b = 0x9e3779b9 ^ s.length;
    for(let i = 0; i < s.length; i++){
      const c = s.charCodeAt(i);
      a = Math.imul(a ^ c, 0x01000193);
      b = Math.imul(b ^ (c + i * 131), 0x5bd1e995); b ^= b >>> 15;
    }
    a ^= b; a = Math.imul(a ^ (a >>> 16), 0x85ebca6b); a ^= a >>> 13;
    return a >>> 0;
  }
  function firma(casuale, id, nome){
    let h = hash(casuale + "|" + id + "|" + pulisci(nome) + "|" + SALE), s = "";
    for(let i = 0; i < 3; i++){ s += ALF[h & 31]; h >>>= 5; }
    return s;
  }
  function casuale(n){
    const v = new Uint32Array(n);
    try { crypto.getRandomValues(v); } catch { for(let i = 0; i < n; i++) v[i] = Math.floor(Math.random() * 1e9); }
    return Array.from(v, x => ALF[x % 32]).join("");
  }
  const nome = () => leggi(K_NOME, "");
  return {
    nome,
    impostaNome: n => scrivi(K_NOME, String(n).trim().slice(0, 40)),
    sbloccati: () => leggi(K_TROFEI, {}),
    sblocca(id, codice){
      const t = leggi(K_TROFEI, {});
      if(!t[id]) t[id] = {codice, data: new Date().toISOString().slice(0, 10)};
      scrivi(K_TROFEI, t); return t;
    },
    azzera(){ try { localStorage.removeItem(K_NOME); localStorage.removeItem(K_TROFEI); } catch {} },
    /* un codice nuovo per il trofeo "id", intestato al nome salvato */
    nuovoCodice(id){ const r = casuale(4); return r + "-" + firma(r, id, nome()); },
    /* restituisce {trofeo, codice} se il codice è valido per il nome salvato, altrimenti null */
    verifica(codice, nomeDaUsare = nome()){
      const c = String(codice || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      if(c.length !== 7 || !pulisci(nomeDaUsare)) return null;
      const r = c.slice(0, 4), f = c.slice(4);
      const trofeo = TROFEI.find(t => firma(r, t.id, nomeDaUsare) === f);
      return trofeo ? {trofeo, codice: r + "-" + f} : null;
    },
    pulisci
  };
})();

/* il premio per chi conquista tutti i trofei */
const GRAN_NOME = "La Corona del Gran Maestro ilnicoprof";

/* disegni dei trofei: oggetti magici inventati, ognuno legato al suo argomento e con i suoi colori.
   svgTrofeo(id, COLORI_ORO) = trofeo conquistato (usa i colori del trofeo), svgTrofeo(id, COLORI_SPENTO) = ancora da vincere */
const COLORI_TROFEO = {
  insiemi:  {oro:"#D5DEEC", oroScuro:"#4F7FE0", linea:"#1E2A44", base:"#7286AE", extra:"#9FC0FF"},
  naturali: {oro:"#E0A065", oroScuro:"#A8642E", linea:"#1E2A44", base:"#8A5A34", extra:"#FFE7B8"},
  relativi: {oro:"#CFEAFF", oroScuro:"#4FA3E3", linea:"#1E2A44", base:"#7FA8C9", extra:"#FFFFFF"},
  materia:  {oro:"#C39BF5", oroScuro:"#7A47D6", linea:"#1E2A44", base:"#5E4A8A", extra:"#FFE066"},
  letterale:{oro:"#F2E1B6", oroScuro:"#C9A66B", linea:"#1E2A44", base:"#8A6A3E", extra:"#2F9E5B"},
  elementi: {oro:"#3A5A9E", oroScuro:"#D5DCE6", linea:"#1E2A44", base:"#4A5A7A", extra:"#FFE066"},
  misure:   {oro:"#D6F1FF", oroScuro:"#3FA9E0", linea:"#1E2A44", base:"#8A6A3E", extra:"#FFE066"},
  segmenti: {oro:"#BFF0E6", oroScuro:"#2FB59B", linea:"#1E2A44", base:"#5A6A7A", extra:"#FFE066"},
  stati:    {oro:"#CDEFFF", oroScuro:"#5BB8F0", linea:"#1E2A44", base:"#7FA8C9", extra:"#FFFFFF"},
  trasforma:{oro:"#FFB36B", oroScuro:"#E5534B", linea:"#1E2A44", base:"#8A4A3A", extra:"#FFE066"},
  cerchio:  {oro:"#9BE3C0", oroScuro:"#2F9E5B", linea:"#1E2A44", base:"#4A6A5A", extra:"#FFE066"},
  nervoso:  {oro:"#FFC7E0", oroScuro:"#D6457F", linea:"#1E2A44", base:"#6A3A5A", extra:"#7FE0E8"},
  poliedri: {oro:"#7FE0D0", oroScuro:"#1F9E8A", linea:"#1E2A44", base:"#B98042", extra:"#FFB36B"},
  genetica: {oro:"#8EDDB4", oroScuro:"#2F9E5B", linea:"#1E2A44", base:"#7A5428", extra:"#FF8FB1"},
  riproduttore:{oro:"#D8E2FF", oroScuro:"#7A8CE0", linea:"#1E2A44", base:"#5A4A8A", extra:"#FFC7E0"},
  gran:     {oro:"#F5C542", oroScuro:"#D9A21B", linea:"#1E2A44", base:"#B98042", extra:"#E5534B"}
};
function svgTrofeo(id, colori){
  const c = colori === COLORI_SPENTO ? COLORI_SPENTO : (COLORI_TROFEO[id] || colori);
  const {oro, oroScuro, linea, base} = c, extra = c.extra || oroScuro;
  const piedistallo = `<path d="M30 84h40l-4-10H34z" fill="${base}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/><rect x="24" y="84" width="52" height="10" rx="2" fill="${base}" stroke="${linea}" stroke-width="2.5"/>`;
  const scintilla = (x, y, r) => `<path d="M${x} ${y - r}l${r * .3} ${r * .7} ${r * .7} ${r * .3}-${r * .7} ${r * .3}-${r * .3} ${r * .7}-${r * .3}-${r * .7}-${r * .7}-${r * .3} ${r * .7}-${r * .3}z" fill="${extra}" stroke="${linea}" stroke-width="1"/>`;
  const forme = {
    /* due anelli d'argento intrecciati: la terra blu in mezzo è quella che i due regni condividono */
    insiemi: `<path d="M50 24.1A21 21 0 0 1 50 59.9A21 21 0 0 1 50 24.1z" fill="${oroScuro}"/>
              <circle cx="39" cy="42" r="21" fill="none" stroke="${linea}" stroke-width="12"/><circle cx="39" cy="42" r="21" fill="none" stroke="${oro}" stroke-width="7"/>
              <circle cx="61" cy="42" r="21" fill="none" stroke="${linea}" stroke-width="12"/><circle cx="61" cy="42" r="21" fill="none" stroke="${oro}" stroke-width="7"/>
              <path d="M52 24.5a21 21 0 0 1 0 35" fill="none" stroke="${linea}" stroke-width="12"/><path d="M52 24.5a21 21 0 0 1 0 35" fill="none" stroke="${oro}" stroke-width="7"/>
              <circle cx="50" cy="42" r="4" fill="${extra}" stroke="${linea}" stroke-width="1.5"/><path d="M50 64v10" stroke="${linea}" stroke-width="4"/>`,
    /* una moneta di bronzo con il simbolo dell'infinito */
    naturali: `<circle cx="50" cy="40" r="28" fill="${oro}" stroke="${linea}" stroke-width="3.5"/><circle cx="50" cy="40" r="21" fill="none" stroke="${oroScuro}" stroke-width="2.5" stroke-dasharray="3 3"/>
               <path d="M50 40c-4-7-15-7-15 0s11 7 15 0 15-7 15 0-11 7-15 0z" fill="none" stroke="${linea}" stroke-width="6"/><path d="M50 40c-4-7-15-7-15 0s11 7 15 0 15-7 15 0-11 7-15 0z" fill="none" stroke="${oroScuro}" stroke-width="3"/>
               ${scintilla(78, 16, 7)}${scintilla(22, 66, 5)}<path d="M50 68v6" stroke="${linea}" stroke-width="4"/>`,
    /* la piuma del grifone, con un fiocco di neve */
    relativi: `<path d="M56 8C76 20 74 52 52 70L46 70C34 50 38 22 56 8z" fill="${oro}" stroke="${linea}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M55 12C52 34 50 52 49 74" fill="none" stroke="${linea}" stroke-width="2.5" stroke-linecap="round"/>
               <path d="M54 22l10-4M53 32l13-3M52 42l12-1M51 52l10 1M54 26l-11-1M53 36l-12 1M52 46l-10 3" stroke="${oroScuro}" stroke-width="2.2" stroke-linecap="round"/>
               <g stroke="${linea}" stroke-width="2" stroke-linecap="round"><path d="M24 20v16M16 28h16M18.5 22.5l11 11M29.5 22.5l-11 11"/></g>
               <g stroke="${extra}" stroke-width="1" stroke-linecap="round"><path d="M24 20v16M16 28h16"/></g>`,
    /* il cristallo dell'alchimista, con scintille in orbita */
    materia:  `<ellipse cx="50" cy="40" rx="36" ry="12" fill="none" stroke="${linea}" stroke-width="1.5" stroke-dasharray="4 4" transform="rotate(-18 50 40)"/>
               <path d="M50 10l16 16-4 36-12 10-12-10-4-36z" fill="${oro}" stroke="${linea}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M34 26h32M50 10l-6 16 6 46 6-46z" fill="none" stroke="${oroScuro}" stroke-width="2"/><path d="M44 26l6 46" stroke="${linea}" stroke-width="1" opacity=".4"/>
               ${scintilla(16, 34, 6)}${scintilla(84, 46, 6)}<path d="M50 72v2" stroke="${linea}" stroke-width="4"/>`,
    /* la pergamena con le rune: le lettere che valgono numeri */
    letterale:`<rect x="26" y="16" width="48" height="48" fill="${oro}" stroke="${linea}" stroke-width="3"/>
               <rect x="20" y="10" width="60" height="10" rx="5" fill="${oroScuro}" stroke="${linea}" stroke-width="3"/><rect x="20" y="60" width="60" height="10" rx="5" fill="${oroScuro}" stroke="${linea}" stroke-width="3"/>
               <g fill="none" stroke="${extra}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M34 28v14M34 28l7 5M34 35l7 5"/><path d="M50 27l-5 15M50 27l5 15M46 37h8"/><path d="M62 27v15M62 34l6-7M62 34l6 8"/>
                 <path d="M36 50h10M41 47v8"/><path d="M54 48l4 6 4-6"/></g>
               <path d="M50 70v4" stroke="${linea}" stroke-width="4"/>`,
    /* la bussola delle stelle: l'ago punta sempre verso una stella, cioè verso un punto */
    elementi: `<path d="M50 4l2.5 5.5 6 .8-4.4 4 1.1 6-5.2-3-5.2 3 1.1-6-4.4-4 6-.8z" fill="${extra}" stroke="${linea}" stroke-width="1.5"/>
               <circle cx="50" cy="46" r="26" fill="${oro}" stroke="${linea}" stroke-width="3.5"/><circle cx="50" cy="46" r="20" fill="none" stroke="${oroScuro}" stroke-width="1.5" stroke-dasharray="2 4"/>
               <path d="M50 24l6 22-6 22-6-22z" fill="${oroScuro}" stroke="${linea}" stroke-width="2" stroke-linejoin="round"/><path d="M50 24l6 22h-12z" fill="${extra}" stroke="${linea}" stroke-width="2" stroke-linejoin="round"/>
               <circle cx="50" cy="46" r="3" fill="${linea}"/>${scintilla(20, 22, 5)}${scintilla(82, 70, 5)}<path d="M50 72v2" stroke="${linea}" stroke-width="4"/>`,
    /* la clessidra del custode delle misure: la sabbia azzurra scorre verso l'alto */
    misure:   `<rect x="24" y="6" width="52" height="7" rx="2" fill="${base}" stroke="${linea}" stroke-width="2.5"/><rect x="24" y="61" width="52" height="7" rx="2" fill="${base}" stroke="${linea}" stroke-width="2.5"/>
               <path d="M29 13v48M71 13v48" stroke="${base}" stroke-width="4"/><path d="M29 13v48M71 13v48" stroke="${linea}" stroke-width="1.2"/>
               <path d="M34 13h32l-14 24 14 24H34l14-24z" fill="${oro}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/>
               <path d="M38 16h24l-7 10h-10z" fill="${oroScuro}"/><path d="M42 58h16l-4-5h-8z" fill="${oroScuro}"/>
               <circle cx="50" cy="44" r="1.6" fill="${oroScuro}"/><circle cx="50" cy="38" r="1.6" fill="${oroScuro}"/><circle cx="50" cy="32" r="1.6" fill="${oroScuro}"/>
               ${scintilla(16, 30, 5)}${scintilla(84, 46, 6)}<path d="M50 68v6" stroke="${linea}" stroke-width="4"/>`,
    /* la locomotiva di cristallo, su un binario che non finisce mai */
    segmenti: `<path d="M8 62h84" stroke="${linea}" stroke-width="3"/><path d="M12 66h4M26 66h4M40 66h4M54 66h4M68 66h4M82 66h4" stroke="${base}" stroke-width="3"/>
               <path d="M20 26h30v28H20z" fill="${oro}" stroke="${linea}" stroke-width="3" stroke-linejoin="round"/><path d="M24 31h22v10H24z" fill="${oroScuro}" opacity=".6"/>
               <path d="M50 36h28a6 6 0 016 6v12H50z" fill="${oro}" stroke="${linea}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M62 36V22h8v14" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5"/><path d="M66 18c-6-6 2-10-4-14" fill="none" stroke="${oroScuro}" stroke-width="2.5" stroke-linecap="round"/>
               <circle cx="30" cy="58" r="6" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5"/><circle cx="56" cy="58" r="6" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5"/><circle cx="76" cy="58" r="5" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5"/>
               ${scintilla(14, 16, 5)}${scintilla(88, 24, 5)}<path d="M50 68v6" stroke="${linea}" stroke-width="4"/>`,
    /* la goccia di ghiaccio eterno: metà ghiaccio, metà acqua, con un fiocco di neve dentro */
    stati:    `<path d="M50 6C62 24 74 38 74 50a24 24 0 0 1-48 0C26 38 38 24 50 6z" fill="${oro}" stroke="${linea}" stroke-width="3.5" stroke-linejoin="round"/>
               <path d="M27 54a23 23 0 0 0 46 0z" fill="${oroScuro}" opacity=".55"/>
               <g stroke="${linea}" stroke-width="2" stroke-linecap="round"><path d="M50 34v24M40 40l20 12M60 40L40 52"/></g>
               <g stroke="${extra}" stroke-width="1" stroke-linecap="round"><path d="M50 34v24M40 40l20 12M60 40L40 52"/></g>
               <path d="M38 22c-4 6-6 12-6 18" fill="none" stroke="${extra}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
               ${scintilla(16, 24, 6)}${scintilla(84, 40, 5)}<path d="M50 74v0" stroke="${linea}" stroke-width="4"/>`,
    /* l'uovo della fenice: si trasforma nel fuoco e rinasce */
    trasforma:`<path d="M30 66c-10-10-6-22 2-26-2 8 4 10 6 6 0-10 6-16 12-20-2 8 4 12 8 8 2-6 8-8 10-4-4 4 2 10 6 8 6 6 8 18-4 28z" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/>
               <ellipse cx="50" cy="44" rx="17" ry="22" fill="${oro}" stroke="${linea}" stroke-width="3"/>
               <path d="M38 40l6 4 6-6 6 6 6-4" fill="none" stroke="${oroScuro}" stroke-width="2.5" stroke-linejoin="round"/>
               <ellipse cx="44" cy="34" rx="4" ry="6" fill="#FFFFFF" opacity=".55"/>
               ${scintilla(16, 22, 6)}${scintilla(84, 30, 5)}<path d="M50 68v6" stroke="${linea}" stroke-width="4"/>`,
    /* l'anello dell'uroboro: il drago che si morde la coda e forma un cerchio perfetto, senza inizio né fine */
    cerchio:  `<circle cx="50" cy="40" r="25" fill="none" stroke="${linea}" stroke-width="14"/><circle cx="50" cy="40" r="25" fill="none" stroke="${oro}" stroke-width="9"/>
               <circle cx="50" cy="40" r="25" fill="none" stroke="${oroScuro}" stroke-width="3" stroke-dasharray="4 5"/>
               <path d="M66 18l12-6-4 12z" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/>
               <path d="M60 14c8-2 14 4 13 10l-7 2c-2-4-4-6-8-6z" fill="${oro}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/>
               <circle cx="66" cy="18" r="1.8" fill="${linea}"/>
               <circle cx="50" cy="40" r="7" fill="${extra}" stroke="${linea}" stroke-width="2"/><text x="50" y="44" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="11" fill="${linea}">π</text>
               ${scintilla(14, 18, 6)}${scintilla(86, 52, 5)}<path d="M50 65v9" stroke="${linea}" stroke-width="4"/>`,
    /* il diadema dei pensieri lucenti: i rami sono dendriti, in punta brillano i pensieri */
    nervoso:  `<path d="M50 34V16M50 24l-8-8M50 24l8-8M36 42l-12-12M36 42l-3-15M64 42l12-12M64 42l3-15" stroke="${linea}" stroke-width="5" stroke-linecap="round"/>
               <path d="M50 34V16M50 24l-8-8M50 24l8-8M36 42l-12-12M36 42l-3-15M64 42l12-12M64 42l3-15" stroke="${oroScuro}" stroke-width="2.5" stroke-linecap="round"/>
               ${[[50, 13, 5], [41, 15, 3], [59, 15, 3], [23, 29, 3.5], [33, 26, 3], [77, 29, 3.5], [67, 26, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${extra}" stroke="${linea}" stroke-width="1.8"/>`).join("")}
               <path d="M16 64c8-18 20-26 34-26s26 8 34 26z" fill="${oro}" stroke="${linea}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M24 58c8-9 16-13 26-13s18 4 26 13" fill="none" stroke="${oroScuro}" stroke-width="2" stroke-dasharray="3 3"/>
               <circle cx="50" cy="54" r="6" fill="${oroScuro}" stroke="${linea}" stroke-width="2.5"/><circle cx="48" cy="52" r="1.8" fill="#fff"/>
               ${scintilla(12, 22, 6)}${scintilla(88, 46, 5)}<path d="M50 64v10" stroke="${linea}" stroke-width="4"/>`,
    /* la gemma dei cinque elementi: un icosaedro magico che racchiude acqua, fuoco, terra, aria e cielo */
    poliedri: `<path d="M50 8L78 24V56L50 72L22 56V24Z" fill="${oro}" stroke="${linea}" stroke-width="3.5" stroke-linejoin="round"/>
               <path d="M50 8L36 32H64ZM36 32L22 24M64 32L78 24M36 32L50 54L64 32M36 32L22 56L50 54M64 32L78 56L50 54M50 54V72" fill="none" stroke="${linea}" stroke-width="2" stroke-linejoin="round"/>
               <path d="M50 8L36 32H64Z" fill="${extra}" opacity=".85"/><path d="M36 32L50 54L64 32Z" fill="${oroScuro}" opacity=".55"/>
               <path d="M30 28l4-6" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
               ${scintilla(12, 18, 6)}${scintilla(88, 40, 5)}<path d="M50 72v2" stroke="${linea}" stroke-width="4"/>`,
    /* l'elica dell'albero della vita: il tronco è una doppia elica, la chioma porta i frutti di tutti i caratteri */
    genetica: `<circle cx="50" cy="26" r="22" fill="${oro}" stroke="${linea}" stroke-width="3"/>
               <circle cx="36" cy="20" r="4" fill="${extra}" stroke="${linea}" stroke-width="1.5"/><circle cx="58" cy="14" r="4" fill="#F5D04A" stroke="${linea}" stroke-width="1.5"/><circle cx="64" cy="32" r="4" fill="${extra}" stroke="${linea}" stroke-width="1.5"/><circle cx="44" cy="34" r="4" fill="#F5D04A" stroke="${linea}" stroke-width="1.5"/>
               <path d="M44 44c12 6 0 12 12 18s0 12 0 12M56 44c-12 6 0 12-12 18s0 12 0 12" fill="none" stroke="${linea}" stroke-width="5" stroke-linecap="round"/>
               <path d="M44 44c12 6 0 12 12 18s0 12 0 12M56 44c-12 6 0 12-12 18s0 12 0 12" fill="none" stroke="${base}" stroke-width="2.6" stroke-linecap="round"/>
               <path d="M47 50h6M47 68h6" stroke="${oroScuro}" stroke-width="2.5"/>
               ${scintilla(14, 20, 6)}${scintilla(88, 44, 5)}`,
    /* il medaglione della luna nuova: la luna rinasce ogni 28 giorni, come un ciclo che ricomincia */
    riproduttore:`<circle cx="50" cy="40" r="27" fill="${oroScuro}" stroke="${linea}" stroke-width="3.5"/>
               <circle cx="50" cy="40" r="20" fill="${oro}" stroke="${linea}" stroke-width="2"/>
               <path d="M56 24a16 16 0 1 0 0 32a20 20 0 0 1 0-32z" fill="${extra}" stroke="${linea}" stroke-width="2"/>
               ${[0, 90, 180, 270].map(a => `<circle cx="${50 + 27 * Math.cos(a * Math.PI / 180)}" cy="${40 + 27 * Math.sin(a * Math.PI / 180)}" r="3.5" fill="#FFFFFF" stroke="${linea}" stroke-width="1.5"/>`).join("")}
               <path d="M50 10V4" stroke="${linea}" stroke-width="3"/><circle cx="50" cy="4" r="3" fill="none" stroke="${linea}" stroke-width="2"/>
               ${scintilla(14, 22, 6)}${scintilla(86, 56, 5)}<path d="M50 67v7" stroke="${linea}" stroke-width="4"/>`,
    /* la corona del gran maestro: una gemma per ogni regno */
    gran:     `<path d="M18 58l-4-34 18 16 18-26 18 26 18-16-4 34z" fill="${oro}" stroke="${linea}" stroke-width="3.5" stroke-linejoin="round"/>
               <rect x="17" y="56" width="66" height="12" rx="3" fill="${oroScuro}" stroke="${linea}" stroke-width="3"/>
               <circle cx="32" cy="62" r="3.5" fill="#4F7FE0" stroke="${linea}" stroke-width="1.5"/><circle cx="44" cy="62" r="3.5" fill="#7A47D6" stroke="${linea}" stroke-width="1.5"/><circle cx="56" cy="62" r="3.5" fill="#2F9E5B" stroke="${linea}" stroke-width="1.5"/><circle cx="68" cy="62" r="3.5" fill="${extra}" stroke="${linea}" stroke-width="1.5"/>
               <circle cx="14" cy="22" r="4" fill="${extra}" stroke="${linea}" stroke-width="2"/><circle cx="50" cy="12" r="4" fill="#4FA3E3" stroke="${linea}" stroke-width="2"/><circle cx="86" cy="22" r="4" fill="#2F9E5B" stroke="${linea}" stroke-width="2"/>
               <path d="M50 68v6" stroke="${linea}" stroke-width="4"/>`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">${forme[id] || forme.gran}${piedistallo}</svg>`;
}
const COLORI_ORO = {oro:"#F5C542", oroScuro:"#D9A21B", linea:"#1E2A44", base:"#B98042"};
const COLORI_SPENTO = {oro:"#D5DCE6", oroScuro:"#C2CBD8", linea:"#8A96AB", base:"#D5DCE6", extra:"#C2CBD8"};
