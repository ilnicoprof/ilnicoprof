/* Eureka! Lab · gli indizi dei segreti nascosti delle escape room.
   - ogni tanto la zona di un segreto non ancora trovato fa un piccolo scintillio dorato (uguale su computer e tablet)
   - il pulsante "🔍 Indizi" nella barra apre un indovinello alla volta e un campo per scrivere la parola segreta
     (così i segreti "da scrivere" si trovano anche su tablet e telefono, senza tastiera)
   Uso nella stanza, dopo tutto():
     Segreti.imposta([{id:"venn", dove:".venn", quando:() => true, indizio:"…"}, …])
   dove = il selettore della zona che scintilla (facoltativo), quando = da quando può scintillare (facoltativo);
   usa le variabili della stanza: trovati, SEGRETI, PAROLE_SEGRETE. */
const Segreti = (() => {
  let lista = [], aperto = false, quale = 0;
  const trovato = id => typeof trovati !== "undefined" && trovati.has(id);
  const daTrovare = () => lista.filter(s => !trovato(s.id));
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const CSS = `
.s-luce{position:fixed;z-index:40;pointer-events:none;border-radius:16px;box-shadow:0 0 0 3px #FFD966,0 0 22px 8px rgba(255,214,90,.75);animation:s-luce 1.8s ease-in-out forwards}
@keyframes s-luce{0%{opacity:0}25%{opacity:1}70%{opacity:1}100%{opacity:0}}
.s-stella{position:fixed;z-index:41;pointer-events:none;font-size:22px;line-height:1;animation:s-stella 1.6s ease-out forwards}
@keyframes s-stella{0%{opacity:0;transform:scale(.3) rotate(0)}30%{opacity:1;transform:scale(1.15) rotate(20deg)}100%{opacity:0;transform:scale(.6) rotate(60deg) translateY(-10px)}}
.s-pannello{display:grid;gap:10px;padding:12px 14px;border-radius:14px;border:2px dashed var(--ink);background:var(--card);max-width:620px}
.s-pannello h3{margin:0;font-family:var(--f-display);font-size:1.1rem;display:flex;align-items:center;gap:8px}
.s-indizio{margin:0;font-family:var(--f-hand);font-size:1.2rem;line-height:1.35;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,var(--giallo) 30%,transparent);display:flex;align-items:flex-start;gap:8px}
.s-indizio span{flex:1}
.s-riga{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.s-riga input{font:inherit;font-size:1rem;padding:5px 10px;border-radius:10px;border:2px solid var(--ink);background:var(--card);color:var(--ink);min-width:0;width:180px}
.s-riga .esito{margin:0;font-weight:800}
@media (prefers-reduced-motion:reduce){.s-luce{animation:none;opacity:.9}.s-stella{animation:none;opacity:0}}`;

  /* lo scintillio: un alone dorato sulla zona e qualche stellina intorno */
  function scintilla(el){
    const r = el.getBoundingClientRect();
    if(r.width < 4 || r.bottom < 0 || r.top > innerHeight) return false;
    const m = 6, luce = document.createElement("div");
    luce.className = "s-luce";
    Object.assign(luce.style, {left:r.left - m + "px", top:r.top - m + "px", width:r.width + 2 * m + "px", height:r.height + 2 * m + "px"});
    document.body.append(luce); setTimeout(() => luce.remove(), 1900);
    [[0, 0], [1, 0], [0, 1], [1, 1], [.5, 0]].forEach(([fx, fy], i) => {
      const s = document.createElement("span"); s.className = "s-stella"; s.textContent = "✨";
      Object.assign(s.style, {left:r.left + fx * r.width - 10 + "px", top:r.top + fy * r.height - 12 + "px", animationDelay:i * .12 + "s"});
      document.body.append(s); setTimeout(() => s.remove(), 2400);
    });
    return true;
  }
  /* ogni 22 secondi scintilla un segreto non ancora trovato, a turno, se la sua zona è sullo schermo */
  let turno = 0;
  function giro(){
    /* scintilla solo dove il segreto si può già trovare (quando: una condizione facoltativa della stanza) */
    const visibili = daTrovare().filter(s => s.dove && (!s.quando || s.quando())).map(s => document.querySelector(s.dove)).filter(Boolean);
    for(let k = 0; k < visibili.length; k++){
      const el = visibili[(turno + k) % visibili.length];
      if(scintilla(el)){ turno = (turno + k + 1) % Math.max(visibili.length, 1); break; }
    }
  }

  /* il pulsante nella barra e il pannello degli indizi */
  function contatore(){ return `${typeof trovati !== "undefined" ? trovati.size : 0} su ${typeof SEGRETI !== "undefined" ? SEGRETI : lista.length}`; }
  function aggiornaBottone(){
    const b = document.querySelector("#s-bottone"); if(b) b.textContent = `🔍 Indizi dei segreti: ${contatore()}`;
  }
  function disegnaPannello(){
    let p = document.querySelector("#s-pannello");
    if(!aperto){ p?.remove(); return; }
    if(!p){ p = document.createElement("div"); p.id = "s-pannello"; p.className = "s-pannello"; document.querySelector(".barra")?.after(p); }
    const resto = daTrovare();
    const parole = typeof PAROLE_SEGRETE !== "undefined" && PAROLE_SEGRETE.length > 0;
    if(quale >= resto.length) quale = 0;
    const ind = resto[quale];
    const voce = ind && typeof Guidata !== "undefined" && Guidata.attiva ? Guidata.bottoneVoce(ind.indizio) : "";
    p.innerHTML = `<h3>🔍 Indizi dei segreti <small style="font-family:var(--f-body);font-size:.85rem;color:var(--ink-soft)">trovati ${contatore()}</small></h3>
      ${ind ? `<p class="s-indizio"><span>${esc(ind.indizio)}</span>${voce}</p>
        ${resto.length > 1 ? `<div class="s-riga"><button class="btn piccolo" type="button" id="s-altro">Un altro indizio</button><small style="color:var(--ink-soft);font-weight:700">indizio ${quale + 1} di ${resto.length}</small></div>` : ""}`
        : `<p class="s-indizio"><span>Hai trovato tutti i segreti di questa stanza: bravissimo!</span></p>`}
      ${parole ? `<form class="s-riga" id="s-parola" autocomplete="off"><label for="s-campo" style="font-weight:800">Scrivi la parola segreta:</label><input id="s-campo" type="text" autocapitalize="none" spellcheck="false"><button class="btn piccolo" type="submit">Prova</button><p class="esito" id="s-esito" aria-live="polite"></p></form>` : ""}`;
    p.querySelector("#s-altro")?.addEventListener("click", () => { quale = (quale + 1) % daTrovare().length; disegnaPannello(); });
    p.querySelector("#s-parola")?.addEventListener("submit", e => {
      e.preventDefault();
      const scritta = p.querySelector("#s-campo").value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const giusta = PAROLE_SEGRETE.find(([parola]) => parola === scritta);
      const es = p.querySelector("#s-esito");
      if(giusta){ giusta[1](); es.textContent = ""; }
      else { es.textContent = "Non è la parola segreta… riprova!"; es.className = "esito no"; try { if(typeof suona === "function") suona("no"); } catch {} }
    });
  }

  function imposta(segreti){
    lista = segreti;
    const s = document.createElement("style"); s.textContent = CSS; document.head.append(s);
    const barra = document.querySelector(".barra"), dopo = document.querySelector("#suoni");
    const html = `<button class="suoni" id="s-bottone" type="button" aria-expanded="false"></button>`;
    if(dopo) dopo.insertAdjacentHTML("afterend", html); else barra?.insertAdjacentHTML("beforeend", html);
    aggiornaBottone();
    document.querySelector("#s-bottone")?.addEventListener("click", e => { aperto = !aperto; e.currentTarget.setAttribute("aria-expanded", aperto); disegnaPannello(); });
    /* quando si trova un segreto aggiorno il conto e, se è aperto, il pannello */
    let visti = -1;
    setInterval(() => {
      const n = typeof trovati !== "undefined" ? trovati.size : 0;
      if(n === visti) return;
      visti = n; aggiornaBottone();
      if(aperto){ quale = 0; disegnaPannello(); }
    }, 1000);
    setTimeout(giro, 8000); setInterval(giro, 22000);
  }
  return {imposta, scintilla};
})();
