/* Eureka! Lab · la modalità guidata delle escape room (per gli alunni con il PEI).
   - si accende con il pulsante "Modalità guidata" nella barra della stanza, oppure con il link …/escape-xxx.html#guidata
   - il browser se la ricorda (solo su questo dispositivo), anche nelle altre stanze
   - opzioni: STAMPATO MAIUSCOLO e voce automatica che legge le domande (voce del dispositivo, niente viene inviato)
   - Guidata.passi(...) disegna un enigma come una serie di domande, una alla volta, con risposte grandi da toccare
   Le stanze che hanno la versione guidata impostano  window.HA_GUIDATA = true  prima di caricare questo file. */
const Guidata = (() => {
  const K = "eurekalab:guidata", KM = "eurekalab:maiuscolo", KV = "eurekalab:voce";
  const leggi = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const scrivi = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const disponibile = !!window.HA_GUIDATA;
  let attiva = disponibile && leggi(K) === "si";
  if(disponibile && location.hash === "#guidata"){ attiva = true; scrivi(K, "si"); }
  let maiuscolo = leggi(KM) === "si";
  let voceAuto = leggi(KV) !== "no";
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const CSS = `
html.guidata body{font-size:18px}
html.guidata body,html.guidata .consegna,html.guidata .storia,html.guidata .g-domanda,html.guidata .g-opz,html.guidata .btn{font-family:"Lexend",var(--f-body)}
html.guidata .storia,html.guidata .consegna{font-size:1.2rem;line-height:1.6;max-width:none}
html.guidata #tempo{display:none}
html.maiuscolo .wrap,html.maiuscolo .os-fin{text-transform:uppercase}
html.maiuscolo .wrap input,html.maiuscolo .wrap textarea{text-transform:none}
.g-voce{all:unset;box-sizing:border-box;cursor:pointer;display:inline-grid;place-items:center;width:40px;height:40px;margin-left:6px;vertical-align:middle;border-radius:50%;border:2px solid var(--ink);background:var(--card);color:var(--ink);font-size:1.15rem;line-height:1;flex:none}
.g-voce:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.g-voce.parla{background:var(--marker)}
.g-riga{display:flex;align-items:flex-start;gap:8px}
.g-riga>p{margin:0;flex:1}
.g-passo{display:grid;gap:14px;padding:14px;border-radius:16px;border:2px dashed var(--line);background:var(--pill)}
.g-domanda{font-size:1.35rem;font-weight:800;line-height:1.35}
.g-figura{justify-self:center;width:100%;max-width:440px}
.g-figura svg{display:block;width:100%;height:auto}
.g-opzioni{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px}
.g-opz{all:unset;box-sizing:border-box;cursor:pointer;min-height:66px;padding:10px 14px;display:grid;place-items:center;text-align:center;border-radius:16px;border:3px solid var(--ink);background:var(--card);color:var(--ink);font-size:1.45rem;font-weight:800;box-shadow:4px 4px 0 var(--ink)}
.g-opz:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.g-opz:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}
.g-opz.giusta{background:var(--ok-bg);border-color:var(--ok);color:var(--ok)}
.g-opz.no{background:var(--errore-bg);border-color:var(--errore);animation:g-no .35s ease}
@keyframes g-no{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.g-esito{margin:0;min-height:1.6em;font-size:1.25rem;font-weight:800}
.g-esito.si{color:var(--ok)}.g-esito.no{color:var(--errore)}
.g-tappe{display:flex;gap:8px;align-items:center;font-weight:800;color:var(--ink-soft)}
.g-tappe i{width:16px;height:16px;border-radius:50%;border:2px solid var(--ink);background:var(--card)}
.g-tappe i.fatta{background:var(--ok)}.g-tappe i.ora{background:var(--marker)}
.g-cifre{font-family:var(--f-display);font-size:1.5rem;font-weight:800;text-align:center;margin:0}
@media (prefers-reduced-motion:reduce){.g-opz.no{animation:none}}`;

  /* la voce: quella italiana del dispositivo, un po' lenta */
  let voce = null;
  const sintesi = "speechSynthesis" in window ? window.speechSynthesis : null;
  const scegliVoce = () => { if(!sintesi) return; const v = sintesi.getVoices().filter(x => /^it/i.test(x.lang)); voce = v.find(x => /google|alice|federica|luca|elsa/i.test(x.name)) || v[0] || null; };
  if(sintesi){ scegliVoce(); sintesi.onvoiceschanged = scegliVoce; }
  let toccato = false;
  document.addEventListener("pointerdown", () => { toccato = true; }, {once:true, capture:true});
  function parla(testo, bottone){
    if(!sintesi || !testo) return;
    sintesi.cancel();
    document.querySelectorAll(".g-voce.parla").forEach(b => b.classList.remove("parla"));
    const u = new SpeechSynthesisUtterance(String(testo).replace(/[★✓]/g, ""));
    u.lang = "it-IT"; u.rate = .88; if(voce) u.voice = voce;
    if(bottone){ bottone.classList.add("parla"); u.onend = u.onerror = () => bottone.classList.remove("parla"); }
    sintesi.speak(u);
  }
  const parlaAuto = t => { if(attiva && voceAuto && toccato) parla(t); };
  const bottoneVoce = testo => sintesi ? `<button class="g-voce" type="button" data-leggi="${esc(testo)}" aria-label="Ascolta">🔊</button>` : "";
  document.addEventListener("click", e => { const b = e.target.closest("[data-leggi]"); if(b){ e.stopPropagation(); parla(b.dataset.leggi, b); } }, true);

  /* i pulsanti nella barra della stanza */
  function applica(){
    document.documentElement.classList.toggle("guidata", attiva);
    document.documentElement.classList.toggle("maiuscolo", attiva && maiuscolo);
  }
  function montaBarra(){
    if(!disponibile) return;
    const barra = document.querySelector(".barra"), suoni = document.querySelector("#suoni");
    if(!barra) return;
    const b = (id, testo, on) => `<button class="suoni" id="${id}" type="button" aria-pressed="${on}">${testo}</button>`;
    const html = b("g-attiva", "🧩 Modalità guidata: " + (attiva ? "sì" : "no"), attiva)
      + (attiva ? b("g-maiusc", "AA Maiuscolo: " + (maiuscolo ? "sì" : "no"), maiuscolo) + (sintesi ? b("g-voceauto", "🔊 Leggi da sola: " + (voceAuto ? "sì" : "no"), voceAuto) : "") : "");
    if(suoni) suoni.insertAdjacentHTML("afterend", html); else barra.insertAdjacentHTML("beforeend", html);
    document.querySelector("#g-attiva").addEventListener("click", () => {
      scrivi(K, attiva ? "no" : "si");
      if(attiva && location.hash === "#guidata") history.replaceState(null, "", location.pathname + location.search);
      location.reload();   /* la stanza riparte nella nuova modalità */
    });
    document.querySelector("#g-maiusc")?.addEventListener("click", e => { maiuscolo = !maiuscolo; scrivi(KM, maiuscolo ? "si" : "no"); applica(); e.currentTarget.textContent = "AA Maiuscolo: " + (maiuscolo ? "sì" : "no"); e.currentTarget.setAttribute("aria-pressed", maiuscolo); });
    document.querySelector("#g-voceauto")?.addEventListener("click", e => { voceAuto = !voceAuto; scrivi(KV, voceAuto ? "si" : "no"); if(!voceAuto && sintesi) sintesi.cancel(); e.currentTarget.textContent = "🔊 Leggi da sola: " + (voceAuto ? "sì" : "no"); e.currentTarget.setAttribute("aria-pressed", voceAuto); });
  }
  if(disponibile){
    const s = document.createElement("style"); s.textContent = CSS; document.head.append(s);
    if(attiva){ const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;800&display=swap"; document.head.append(l); }
    applica();
  }

  /* un enigma guidato: domande una alla volta con risposte grandi.
     opz: {sez, num, titolo, intro, passi:[{testo, figura?, opzioni:[…], giusta:indice, aiuto?}], stato:{passo}, fatto, chiuso, premio, quandoFinito} */
  function passi(o){
    const {sez, num, titolo} = o;
    sez.className = "enigma" + (o.chiuso ? " chiuso" : o.fatto ? " risolto" : "");
    const testa = `<div class="e-head"><h2 id="t${num}"><span class="n">${o.fatto ? "✓" : num}</span>${esc(titolo)}</h2></div>`;
    if(o.chiuso){ sez.innerHTML = testa + `<p class="nota">Prima finisci il gioco ${num - 1}.</p>`; return; }
    if(o.fatto){ sez.innerHTML = testa + `<div class="g-riga"><p class="consegna">${esc(o.intro)}</p></div>` + (o.figuraFinale || "") + o.premio; return; }
    const k = o.stato.passo, p = o.passi[k];
    sez.innerHTML = testa + `<div class="g-riga"><p class="consegna">${esc(o.intro)}</p>${bottoneVoce(o.intro)}</div>
      <div class="g-tappe" aria-label="Domanda ${k + 1} di ${o.passi.length}">${o.passi.map((_, j) => `<i class="${j < k ? "fatta" : j === k ? "ora" : ""}"></i>`).join("")}<span>${k + 1} di ${o.passi.length}</span></div>
      <div class="g-passo">
        <div class="g-riga"><p class="g-domanda">${esc(p.testo)}</p>${bottoneVoce(p.testo)}</div>
        ${p.figura ? `<div class="g-figura">${p.figura}</div>` : ""}
        <div class="g-opzioni" role="group" aria-label="Scegli la risposta">${p.opzioni.map((t, j) => `<button class="g-opz" type="button" data-g="${j}">${esc(t)}</button>`).join("")}</div>
        <p class="g-esito" aria-live="polite"></p>
      </div>`;
    parlaAuto(p.testo);
    const fx = t => { try { if(typeof suona === "function") suona(t); } catch {} };
    sez.querySelectorAll(".g-opz").forEach(b => b.addEventListener("click", () => {
      try { if(typeof avvia === "function") avvia(); } catch {}
      const es = sez.querySelector(".g-esito");
      if(+b.dataset.g === p.giusta){
        b.classList.add("giusta"); sez.querySelectorAll(".g-opz").forEach(x => x.disabled = true);
        const bravo = ["Bravo!", "Giusto!", "Ottimo!", "Esatto!"][k % 4];
        es.textContent = bravo + " ✓"; es.className = "g-esito si"; fx("si"); parlaAuto(bravo);
        setTimeout(() => {
          if(k + 1 < o.passi.length){ o.stato.passo++; passi(o); }
          else o.quandoFinito();
        }, 1100);
      } else {
        b.classList.remove("no"); void b.offsetWidth; b.classList.add("no");
        const msg = "Non è giusto, riprova!" + (p.aiuto ? " " + p.aiuto : "");
        es.textContent = msg; es.className = "g-esito no"; fx("no"); parlaAuto(msg);
      }
    }));
  }

  /* piccoli aiuti per scrivere le domande */
  const mescola = a => { const b = [...a]; for(let i = b.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [b[i],b[j]] = [b[j],b[i]]; } return b; };
  /* tre risposte vicine (n-d, n, n+d) in ordine sparso, mai negative; restituisce {opzioni, giusta} */
  function vicini(n, d = 1, fmt = String){
    let lista = [n - d, n, n + d]; if(n - d < 0) lista = [n, n + d, n + 2 * d];
    const opzioni = mescola(lista).map(fmt);
    return {opzioni, giusta:opzioni.indexOf(fmt(n))};
  }
  /* risposte date come testi: la giusta è la prima, le mescolo */
  function scelte(giusta, ...altre){ const opzioni = mescola([giusta, ...altre]); return {opzioni, giusta:opzioni.indexOf(giusta)}; }

  return {get attiva(){ return attiva; }, montaBarra, passi, parla, parlaAuto, bottoneVoce, mescola, vicini, scelte};
})();
