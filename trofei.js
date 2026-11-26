/* ilnicoprof · trofei delle escape room
   - il nome dell'alunno e i trofei restano salvati SOLO su questo dispositivo (localStorage), niente viene inviato
   - ogni codice ha una parte casuale (diverso a ogni partita) e una "firma" calcolata con il nome:
     il codice di un compagno non funziona con un altro nome
   Per aggiungere un trofeo: una riga in TROFEI (id uguale a quello passato da OggettoSegreto.apri nella escape room). */
const TROFEI = [
  {id:"insiemi", nome:"Gli anelli di Venn", gioco:"L'aula chiusa", link:"escape-insiemi.html", argomento:"Insiemi, tabelle e grafici"},
  {id:"relativi", nome:"Il drone d'oro", gioco:"Il drone sotto zero", link:"escape-relativi.html", argomento:"Numeri relativi"}
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

/* disegni dei trofei: la forma richiama l'argomento. colori = {oro, oroScuro, linea, base} */
function svgTrofeo(id, colori){
  const {oro, oroScuro, linea, base} = colori;
  const piedistallo = `<path d="M30 84h40l-4-10H34z" fill="${base}" stroke="${linea}" stroke-width="2.5" stroke-linejoin="round"/><rect x="24" y="84" width="52" height="10" rx="2" fill="${base}" stroke="${linea}" stroke-width="2.5"/>`;
  const forme = {
    insiemi: `<circle cx="39" cy="42" r="21" fill="none" stroke="${linea}" stroke-width="13"/><circle cx="39" cy="42" r="21" fill="none" stroke="${oro}" stroke-width="8"/>
              <circle cx="61" cy="42" r="21" fill="none" stroke="${linea}" stroke-width="13"/><circle cx="61" cy="42" r="21" fill="none" stroke="${oro}" stroke-width="8"/>
              <path d="M52 25.5a21 21 0 0 1 0 33" fill="none" stroke="${linea}" stroke-width="13"/><path d="M52 25.5a21 21 0 0 1 0 33" fill="none" stroke="${oroScuro}" stroke-width="8"/>
              <path d="M50 66v8" stroke="${linea}" stroke-width="4"/>`,
    relativi: `<path d="M12 26h26M62 26h26" stroke="${linea}" stroke-width="5" stroke-linecap="round"/><path d="M25 26v12M75 26v12" stroke="${linea}" stroke-width="4"/>
               <rect x="20" y="36" width="60" height="26" rx="10" fill="${oro}" stroke="${linea}" stroke-width="3.5"/>
               <circle cx="50" cy="49" r="7" fill="${oroScuro}" stroke="${linea}" stroke-width="3"/>
               <path d="M40 62l-5 12M60 62l5 12" stroke="${linea}" stroke-width="4" stroke-linecap="round"/>`,
    gran: `<path d="M30 14h40v18a20 20 0 0 1-40 0z" fill="${oro}" stroke="${linea}" stroke-width="3.5" stroke-linejoin="round"/>
           <path d="M30 20H18a10 10 0 0 0 12 16M70 20h12a10 10 0 0 1-12 16" fill="none" stroke="${linea}" stroke-width="4"/>
           <path d="M46 51h8v14h-8z" fill="${oroScuro}" stroke="${linea}" stroke-width="3"/>
           <path d="M50 22l3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3.1-5.9 3.1 1.1-6.4-4.7-4.6 6.5-1z" fill="${oroScuro}"/>`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">${forme[id] || forme.gran}${piedistallo}</svg>`;
}
const COLORI_ORO = {oro:"#F5C542", oroScuro:"#D9A21B", linea:"#1E2A44", base:"#B98042"};
const COLORI_SPENTO = {oro:"#D5DCE6", oroScuro:"#C2CBD8", linea:"#8A96AB", base:"#D5DCE6"};
