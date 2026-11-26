/* ilnicoprof · l'oggetto che cade quando si apre la porta di una escape room.
   Va esplorato (sfogliato, scosso, girato...) per trovare il codice segreto della bacheca dei trofei.
   Uso nella escape room:  OggettoSegreto.bottone()  nell'HTML finale,
                           OggettoSegreto.apri("insiemi")  al clic sul bottone.
   Richiede trofei.js. */
const OggettoSegreto = (() => {
  const OGGETTI = ["diario", "barattolo", "scatola", "mappamondo"];
  const scelto = OGGETTI[Math.floor(Math.random() * OGGETTI.length)];
  let codice = null, trovato = false, idTrofeo = null;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const suono = t => { try { if(typeof suona === "function") suona(t); } catch {} };

  const ICONE = {
    diario:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="8" width="40" height="50" rx="4" fill="#C0392B" stroke="#1E2A44" stroke-width="3"/><rect x="12" y="8" width="8" height="50" fill="#962D22" stroke="#1E2A44" stroke-width="3"/><rect x="26" y="18" width="20" height="10" rx="2" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/></svg>',
    barattolo:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="8" width="32" height="9" rx="3" fill="#B98042" stroke="#1E2A44" stroke-width="3"/><path d="M14 17h36v36a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#CFE8FF" fill-opacity=".85" stroke="#1E2A44" stroke-width="3"/><path d="M24 40l8-5 9 6-8 6z" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/></svg>',
    scatola:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 20l24-10 24 10v28L32 58 8 48z" fill="#B98042" stroke="#1E2A44" stroke-width="3" stroke-linejoin="round"/><path d="M8 20l24 10 24-10M32 30v28" fill="none" stroke="#1E2A44" stroke-width="3"/><text x="19" y="46" font-family="Georgia,serif" font-weight="700" font-size="16" fill="#1E2A44">?</text></svg>',
    mappamondo:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 52v6M22 60h20" stroke="#1E2A44" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="28" r="20" fill="#7DBDF0" stroke="#1E2A44" stroke-width="3"/><path d="M20 20c4-3 8 0 7 4s-6 3-8 7M38 14c4 2 6 6 3 9s1 8 4 10" fill="#8EDDB4" stroke="#1E2A44" stroke-width="2"/><path d="M50 14a24 24 0 0 1-6 34" fill="none" stroke="#1E2A44" stroke-width="3"/></svg>'
  };
  const NOMI = {diario:"un vecchio diario", barattolo:"un barattolo", scatola:"una scatola misteriosa", mappamondo:"un piccolo mappamondo"};
  const ISTRUZIONI = {
    diario:"Sfoglia il diario pagina per pagina: da qualche parte qualcuno ha scritto il codice.",
    barattolo:"Dentro il barattolo c'è un bigliettino. Scuotilo forte (anche trascinandolo a destra e a sinistra) finché il tappo salta!",
    scatola:"Gira la scatola da tutti i lati: il codice è inciso su uno di essi.",
    mappamondo:"Fai girare il mappamondo (trascinalo o usa le frecce) e cerca l'isola con il codice."
  };

  const CSS = `
.os-cade{all:unset;box-sizing:border-box;cursor:pointer;display:grid;justify-items:center;gap:6px;padding:12px 18px;border-radius:16px;border:2px dashed var(--ink);background:var(--card);color:var(--ink);font-weight:800;max-width:320px;animation:os-cade 1.1s cubic-bezier(.3,1.4,.5,1) both}
.os-cade svg{width:64px;height:64px;animation:os-dondola 1.6s ease-in-out 1.1s infinite}
.os-cade:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
@keyframes os-cade{from{transform:translateY(-160px) rotate(-25deg);opacity:0}70%{transform:translateY(8px) rotate(4deg);opacity:1}to{transform:none}}
@keyframes os-dondola{50%{transform:rotate(-8deg) scale(1.06)}}
.os-fin{width:min(560px,calc(100% - 20px));max-height:calc(100% - 24px);overflow:auto;border:2px solid var(--ink);border-radius:20px;padding:18px;background:var(--card);color:var(--ink);box-shadow:6px 6px 0 var(--ink)}
.os-fin::backdrop{background:rgba(20,27,43,.55)}
.os-fin h2{margin:0;font-family:var(--f-display);font-size:1.4rem;line-height:1.15}
.os-fin p{margin:0}
.os-corpo{display:grid;gap:12px;margin-top:10px;justify-items:center;text-align:center}
.os-testa{display:flex;justify-content:space-between;align-items:start;gap:10px}
.os-x{all:unset;cursor:pointer;width:36px;height:36px;display:grid;place-items:center;border-radius:50%;border:2px solid var(--ink);font-weight:800;flex:none}
.os-x:focus-visible{outline:3px solid var(--accent)}
.os-btn{all:unset;box-sizing:border-box;cursor:pointer;font-family:var(--f-display);font-weight:700;font-size:1.05rem;padding:8px 16px;border-radius:12px;border:2px solid var(--ink);background:var(--card);color:var(--ink);box-shadow:3px 3px 0 var(--ink);text-align:center;text-decoration:none}
.os-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
.os-btn:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.os-btn.blu{background:var(--accent);color:var(--accent-ink)}
.os-btn.giallo{background:var(--giallo);color:var(--giallo-ink,#5A4300)}
.os-riga{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center}
.os-campo{flex:1 1 220px;min-width:0;padding:10px 12px;border-radius:12px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);font:inherit;font-weight:700}
.os-nota{font-size:.9rem;color:var(--ink-soft)}
.os-esito{min-height:1.4em;font-weight:800;color:var(--errore,#C2410C)}
.os-codice{font-family:var(--f-display);font-weight:800;font-size:2.2rem;letter-spacing:.14em;padding:4px 18px;border-radius:12px;background:var(--marker);color:var(--ink);border:2px solid var(--ink)}
.os-scena{position:relative;width:min(360px,100%);height:250px;display:grid;place-items:center;user-select:none;-webkit-user-select:none;touch-action:none}
.os-mano{font-family:"Patrick Hand","Comic Sans MS",cursive;color:#2B3A67}
/* diario */
.os-libro{display:grid;grid-template-columns:1fr 1fr;width:100%;height:220px;border:3px solid #1E2A44;border-radius:8px;background:#C0392B;padding:8px;perspective:900px;box-shadow:4px 5px 0 #1E2A44}
.os-pag{background:#FFF8EC;color:#1E2A44;border:1px solid #D9C9A8;padding:12px 10px;text-align:left;font-size:.95rem;line-height:1.35;position:relative;overflow:hidden}
.os-pag.sx{border-radius:4px 0 0 4px}.os-pag.dx{border-radius:0 4px 4px 0;transform-origin:left center}
.os-pag.gira{animation:os-gira .45s ease}
@keyframes os-gira{from{transform:rotateY(-90deg)}to{transform:none}}
.os-pag .os-num{position:absolute;bottom:6px;right:8px;font-size:.75rem;color:#8A96AB}
.os-angolo{position:absolute;right:6px;bottom:22px;transform:rotate(-8deg);font-size:1.25rem}
.os-copertina{grid-column:1/-1;display:grid;place-items:center;color:#FFF8EC;font-family:var(--f-display);font-size:1.5rem;text-align:center;border:2px dashed rgba(255,248,236,.5);border-radius:6px}
/* barattolo */
.os-vaso{position:relative;width:150px;height:200px;cursor:grab}
.os-vaso svg{width:100%;height:100%;overflow:visible}
.os-vaso.scuoti{animation:os-scuoti .45s ease}
@keyframes os-scuoti{20%{transform:rotate(-14deg) translateX(-10px)}40%{transform:rotate(12deg) translateX(10px)}60%{transform:rotate(-8deg)}80%{transform:rotate(5deg)}}
.os-tappo{transition:transform .6s cubic-bezier(.3,1.4,.5,1)}
.os-tappo.vola{transform:translate(70px,-90px) rotate(160deg)}
.os-bigliettino{all:unset;box-sizing:border-box;cursor:pointer;position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);background:#FFF8EC;color:#1E2A44;border:2px solid #1E2A44;border-radius:4px;padding:6px 10px;font-weight:800;animation:os-esce .7s cubic-bezier(.3,1.4,.5,1) both;box-shadow:2px 3px 0 #1E2A44}
.os-bigliettino:focus-visible{outline:3px solid var(--accent)}
@keyframes os-esce{from{transform:translate(-50%,-120px) scale(.3) rotate(30deg);opacity:0}}
.os-aperto{position:absolute;inset:20px 0 auto;margin:auto;width:240px;padding:16px;background:#FFF8EC;color:#1E2A44;border:2px solid #1E2A44;box-shadow:3px 4px 0 #1E2A44;transform:rotate(-2deg);animation:os-apri .5s ease both}
@keyframes os-apri{from{transform:scaleY(.1) rotate(-2deg)}}
/* scatola */
.os-cubo{width:190px;height:190px;border:4px solid #1E2A44;border-radius:10px;background:#B98042;background-image:repeating-linear-gradient(90deg,transparent 0 22px,rgba(0,0,0,.08) 22px 24px);display:grid;place-items:center;text-align:center;color:#1E2A44;padding:12px;box-shadow:5px 6px 0 #1E2A44}
.os-cubo.gira{animation:os-giracubo .4s ease}
@keyframes os-giracubo{50%{transform:scaleX(.05)}}
.os-cubo img{width:80px;height:80px;border-radius:50%;border:3px solid #1E2A44;background:#FFFFFF}
.os-inciso{font-family:"Courier New",monospace;font-weight:700;font-size:1.6rem;color:#4E3519;text-shadow:0 1px 0 rgba(255,255,255,.4);letter-spacing:.1em}
.os-faccia{font-family:var(--f-display);font-weight:800;font-size:1.15rem}
/* mappamondo */
.os-globo{position:relative;width:220px;height:220px;border-radius:50%;border:4px solid #1E2A44;overflow:hidden;background:#7DBDF0;cursor:grab;box-shadow:inset -18px -14px 0 rgba(0,0,0,.12),5px 6px 0 #1E2A44}
.os-striscia{position:absolute;top:0;left:0;height:100%;width:880px;display:block}
.os-isola{position:absolute;display:grid;place-items:center;border:2px solid #1E2A44;background:#8EDDB4;border-radius:46% 54% 40% 60%/55% 45% 55% 45%;color:#1E2A44;font-weight:800;font-size:.8rem;text-align:center}
.os-trovato{display:grid;gap:10px;justify-items:center;padding:12px;border-radius:14px;background:var(--ok-bg,#D7F5E5);border:2px solid var(--ok,#0B6B3F);width:100%;animation:os-apri .5s ease both}
@media (prefers-reduced-motion:reduce){.os-cade,.os-cade svg,.os-pag.gira,.os-vaso.scuoti,.os-cubo.gira,.os-bigliettino,.os-aperto,.os-trovato{animation:none!important}.os-tappo{transition:none}}
`;
  let stile = false;
  function aggiungiStile(){ if(stile) return; stile = true; const s = document.createElement("style"); s.textContent = CSS; document.head.append(s); }

  function bottone(){
    aggiungiStile();
    return `<button class="os-cade" type="button" id="os-cade">${ICONE[scelto]}<span>Aprendo la porta è caduto ${NOMI[scelto]}! Toccalo per esplorarlo.</span></button>`;
  }

  let fin;
  function finestra(){
    if(fin) return fin;
    fin = document.createElement("dialog"); fin.className = "os-fin"; fin.setAttribute("aria-labelledby", "os-t");
    document.body.append(fin);
    fin.addEventListener("click", e => { if(e.target === fin) fin.close(); });
    return fin;
  }
  function apri(id){
    aggiungiStile(); idTrofeo = id;
    const f = finestra();
    if(!Trofei.nome()) passoNome(); else passoEsplora();
    if(!f.open) f.showModal();
  }
  function testa(titolo){ return `<div class="os-testa"><h2 id="os-t">${titolo}</h2><button class="os-x" type="button" aria-label="Chiudi" onclick="this.closest('dialog').close()">✕</button></div>`; }

  /* 1. il nome: il codice sarà valido solo per lui */
  function passoNome(){
    fin.innerHTML = testa("Di chi è questo codice?") + `<div class="os-corpo">
      <p>Il codice segreto sarà <b>solo tuo</b>: funzionerà nella bacheca dei trofei soltanto con il tuo nome.</p>
      <form class="os-riga" id="os-form-nome" autocomplete="off" style="width:100%">
        <input class="os-campo" id="os-nome" placeholder="Nome e iniziale del cognome, es. Marco R." maxlength="40" aria-label="Il tuo nome">
        <button class="os-btn blu" type="submit">Continua</button></form>
      <p class="os-nota">Scrivilo bene: dopo non si può cambiare. Resta salvato solo su questo dispositivo, non viene inviato a nessuno.</p>
      <p class="os-esito" id="os-esito-nome" aria-live="polite"></p></div>`;
    fin.querySelector("#os-nome").focus();
    fin.querySelector("#os-form-nome").addEventListener("submit", e => {
      e.preventDefault();
      const v = fin.querySelector("#os-nome").value.trim();
      if(Trofei.pulisci(v).length < 2){ fin.querySelector("#os-esito-nome").textContent = "Scrivi un nome di almeno 2 lettere."; return; }
      Trofei.impostaNome(v); passoEsplora();
    });
  }

  /* 2. esplorare l'oggetto */
  function passoEsplora(){
    if(!codice) codice = Trofei.nuovoCodice(idTrofeo);
    fin.innerHTML = testa(NOMI[scelto][0].toUpperCase() + NOMI[scelto].slice(1)) + `<div class="os-corpo">
      <p>${ISTRUZIONI[scelto]}</p>
      <div class="os-scena" id="os-scena"></div>
      <div class="os-riga" id="os-comandi"></div>
      <div id="os-premio" style="width:100%"></div></div>`;
    ({diario, barattolo, scatola, mappamondo})[scelto]();
    if(trovato) mostraCodice();
  }
  function mostraCodice(){
    trovato = true;
    const p = fin.querySelector("#os-premio"); if(!p || p.innerHTML) return;
    const t = TROFEI.find(x => x.id === idTrofeo);
    p.innerHTML = `<div class="os-trovato" role="status">
      <p><b>Hai trovato il codice segreto!</b></p>
      <span class="os-codice">${codice}</span>
      <p class="os-nota">Vale il trofeo «${esc(t ? t.nome : "")}» ed è intestato a <b>${esc(Trofei.nome())}</b>.</p>
      <div class="os-riga"><button class="os-btn" type="button" id="os-copia">Copia il codice</button><a class="os-btn blu" href="bacheca.html#${codice}">Vai alla bacheca dei trofei</a></div>
      <p class="os-nota" id="os-copiato" aria-live="polite"></p></div>`;
    p.querySelector("#os-copia").addEventListener("click", () => {
      const ok = () => { p.querySelector("#os-copiato").textContent = "Codice copiato!"; };
      try { navigator.clipboard.writeText(codice).then(ok, () => { p.querySelector("#os-copiato").textContent = "Copialo a mano: " + codice; }); }
      catch { p.querySelector("#os-copiato").textContent = "Copialo a mano: " + codice; }
    });
    suono("segreto");
  }
  const scena = () => fin.querySelector("#os-scena");
  const comandi = html => { fin.querySelector("#os-comandi").innerHTML = html; };

  /* ---- il diario: si sfoglia, il codice è scritto a matita in un angolo dell'ultima pagina ---- */
  function diario(){
    const PAGINE = [
      ["Lunedì", "Oggi in laboratorio abbiamo contato tantissimi dati. La prof dice che ci servirà una tabella."],
      ["Martedì", "Il drone è volato fino al tetto. Mi sono segnato le coordinate... ma dove le ho messe?"],
      ["Mercoledì", "Qualcuno ha chiuso la porta! Per fortuna ho nascosto il codice in questo diario."],
      ["Giovedì", "Se stai leggendo, sei riuscito a uscire. Bravo! Il codice è qui, guarda bene..."]
    ];
    let p = -1;
    const disegna = gira => {
      if(p < 0){
        scena().innerHTML = `<div class="os-libro"><div class="os-copertina">Diario del laboratorio<br><small class="os-mano" style="color:#FFF8EC">non aprire!</small></div></div>`;
      } else {
        const a = PAGINE[p * 2] || PAGINE[0], b = PAGINE[p * 2 + 1];
        const ultima = p * 2 + 1 >= PAGINE.length - 1;
        scena().innerHTML = `<div class="os-libro"><div class="os-pag sx"><b>${a[0]}</b><br><span class="os-mano">${a[1]}</span><span class="os-num">${p*4+1}</span></div>
          <div class="os-pag dx${gira ? " gira" : ""}"><b>${b[0]}</b><br><span class="os-mano">${b[1]}</span>${ultima ? `<span class="os-angolo os-mano" aria-label="Codice scritto a matita: ${codice}">${codice}</span>` : ""}<span class="os-num">${p*4+2}</span></div></div>`;
        if(ultima) setTimeout(mostraCodice, 900);
      }
      comandi(`<button class="os-btn" type="button" id="os-ind"${p < 0 ? " disabled" : ""}>◀ Indietro</button><button class="os-btn blu" type="button" id="os-av"${p >= 1 ? " disabled" : ""}>${p < 0 ? "Apri il diario" : "Sfoglia ▶"}</button>`);
      fin.querySelector("#os-ind").addEventListener("click", () => { p--; suono("prendi"); disegna(false); });
      fin.querySelector("#os-av").addEventListener("click", () => { p++; suono("prendi"); disegna(true); });
    };
    disegna(false);
  }

  /* ---- il barattolo: va scosso 4 volte, il tappo salta, esce il bigliettino da aprire ---- */
  function barattolo(){
    let scosse = 0;
    scena().innerHTML = `<div class="os-vaso" id="os-vaso" role="img" aria-label="Barattolo chiuso con un bigliettino dentro">
      <svg viewBox="0 0 150 200"><g class="os-tappo" id="os-tappo"><rect x="30" y="8" width="90" height="24" rx="6" fill="#B98042" stroke="#1E2A44" stroke-width="4"/></g>
      <path d="M24 32h102v138a14 14 0 0 1-14 14H38a14 14 0 0 1-14-14z" fill="#CFE8FF" fill-opacity=".8" stroke="#1E2A44" stroke-width="4"/>
      <path d="M50 120l30-16 26 18-28 16z" fill="#FFF8EC" stroke="#1E2A44" stroke-width="3" id="os-foglio"/>
      <path d="M40 60c10-6 20-6 30 0" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/></svg></div>`;
    comandi(`<button class="os-btn blu" type="button" id="os-scuoti">Scuoti il barattolo</button>`);
    const vaso = fin.querySelector("#os-vaso");
    const scuoti = () => {
      if(scosse >= 4) return;
      scosse++; vaso.classList.remove("scuoti"); void vaso.offsetWidth; vaso.classList.add("scuoti"); suono("prendi");
      if(scosse === 4){
        fin.querySelector("#os-tappo").classList.add("vola"); fin.querySelector("#os-foglio").style.display = "none"; suono("sblocco");
        setTimeout(() => {
          vaso.insertAdjacentHTML("beforeend", `<button class="os-bigliettino" type="button" id="os-big">Un bigliettino! Aprilo</button>`);
          fin.querySelector("#os-big").addEventListener("click", () => {
            scena().insertAdjacentHTML("beforeend", `<div class="os-aperto"><span class="os-mano" style="font-size:1.2rem">Complimenti, agente!<br>Il tuo codice è:</span><br><b style="font-family:var(--f-display);font-size:1.6rem;letter-spacing:.1em">${codice}</b></div>`);
            mostraCodice();
          });
          fin.querySelector("#os-big").focus();
        }, 500);
        comandi("");
      }
    };
    fin.querySelector("#os-scuoti").addEventListener("click", scuoti);
    /* scuoterlo anche trascinandolo a destra e sinistra */
    let ultimoX = null, verso = 0, strada = 0;
    vaso.addEventListener("pointerdown", e => { ultimoX = e.clientX; try { vaso.setPointerCapture(e.pointerId); } catch {} });
    vaso.addEventListener("pointermove", e => {
      if(ultimoX === null) return;
      const d = e.clientX - ultimoX; ultimoX = e.clientX;
      const v = Math.sign(d); strada += Math.abs(d);
      if(v && v !== verso && strada > 40){ verso = v; strada = 0; scuoti(); }
    });
    const stop = () => { ultimoX = null; };
    vaso.addEventListener("pointerup", stop); vaso.addEventListener("pointercancel", stop);
  }

  /* ---- la scatola: si gira lato per lato, il codice è inciso sul retro ---- */
  function scatola(){
    const FACCE = [
      `<span class="os-faccia">FRAGILE<br>↑ alto ↑</span>`,
      `<img src="immagini/logo-mini.png" alt="Il logo di ilnicoprof">`,
      `<span><span class="os-faccia">Codice segreto</span><br><span class="os-inciso">${codice}</span></span>`,
      `<span class="os-faccia">Questo lato<br>non c'è niente!</span>`
    ];
    let f = 0;
    const disegna = gira => {
      scena().innerHTML = `<div class="os-cubo${gira ? " gira" : ""}" role="img" aria-label="Lato ${f+1} di 4 della scatola">${FACCE[f]}</div>`;
      if(f === 2) setTimeout(mostraCodice, 500);
    };
    disegna(false);
    comandi(`<button class="os-btn" type="button" id="os-sx">◀ Gira</button><span class="os-nota" id="os-lato">lato 1 di 4</span><button class="os-btn" type="button" id="os-dx">Gira ▶</button>`);
    const gira = d => { f = (f + d + 4) % 4; fin.querySelector("#os-lato").textContent = `lato ${f+1} di 4`; suono("prendi"); disegna(true); };
    fin.querySelector("#os-sx").addEventListener("click", () => gira(-1));
    fin.querySelector("#os-dx").addEventListener("click", () => gira(1));
  }

  /* ---- il mappamondo: si fa girare, il codice è su un'isola lontana ---- */
  function mappamondo(){
    const LARGO = 880;
    scena().innerHTML = `<div class="os-globo" id="os-globo" role="img" aria-label="Mappamondo">
      <div class="os-striscia" id="os-striscia">
        <span class="os-isola" style="left:30px;top:40px;width:90px;height:70px">Isola<br>dei Numeri</span>
        <span class="os-isola" style="left:170px;top:120px;width:70px;height:60px">Capo<br>Zero</span>
        <span class="os-isola" style="left:300px;top:30px;width:80px;height:80px">Monte<br>Meno</span>
        <span class="os-isola" style="left:420px;top:130px;width:60px;height:50px">Baia<br>Più</span>
        <span class="os-isola" style="left:560px;top:60px;width:150px;height:90px;background:#FFD966" id="os-isola-codice">Isola segreta<br><b style="font-size:1.05rem;letter-spacing:.08em">${codice}</b></span>
        <span class="os-isola" style="left:760px;top:140px;width:70px;height:50px">Scoglio<br>Pari</span>
      </div></div>`;
    let pos = 0;
    const striscia = fin.querySelector("#os-striscia"), globo = fin.querySelector("#os-globo");
    const metti = p => {
      pos = ((p % LARGO) + LARGO) % LARGO;
      striscia.style.transform = `translateX(${-pos}px)`;
      /* l'isola segreta è al centro del globo quando pos è tra 470 e 600 */
      if(pos > 470 && pos < 600) mostraCodice();
    };
    metti(0);
    comandi(`<button class="os-btn" type="button" id="os-sx">◀</button><span class="os-nota">fai girare il mappamondo</span><button class="os-btn" type="button" id="os-dx">▶</button>`);
    fin.querySelector("#os-sx").addEventListener("click", () => { metti(pos - 90); suono("bip"); });
    fin.querySelector("#os-dx").addEventListener("click", () => { metti(pos + 90); suono("bip"); });
    let x0 = null;
    globo.addEventListener("pointerdown", e => { x0 = e.clientX; try { globo.setPointerCapture(e.pointerId); } catch {} });
    globo.addEventListener("pointermove", e => { if(x0 === null) return; metti(pos - (e.clientX - x0)); x0 = e.clientX; });
    const stop = () => { x0 = null; };
    globo.addEventListener("pointerup", stop); globo.addEventListener("pointercancel", stop);
  }

  return {bottone, apri};
})();
