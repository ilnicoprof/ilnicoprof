/* ilnicoprof · l'oggetto che cade quando si apre la porta di una escape room.
   Va esplorato (sfogliato, scosso, girato...) per trovare il codice segreto della bacheca dei trofei.
   Uso nella escape room:  OggettoSegreto.bottone()  nell'HTML finale,
                           OggettoSegreto.apri("insiemi")  al clic sul bottone.
   Richiede trofei.js. */
const OggettoSegreto = (() => {
  const OGGETTI = ["diario", "barattolo", "scatola", "mappamondo"];
  /* ogni escape room ha il suo oggetto, legato alla sua storia; gli altri 4 restano per le escape room nuove */
  const PER_STANZA = {insiemi:"astuccio", naturali:"grattaevinci", relativi:"pacco", materia:"provetta", letterale:"attrezzi",
                      elementi:"pergamena", misure:"orologio", segmenti:"biglietto", stati:"ghiaccio", trasforma:"torta", cerchio:"palloncino", nervoso:"cardio", poliedri:"sarcofago", genetica:"baccello", riproduttore:"carillon"};
  let scelto = OGGETTI[Math.floor(Math.random() * OGGETTI.length)];
  /* se la pagina non dice quale oggetto usare (per esempio una pagina vecchia rimasta in memoria nel browser), lo ricavo dal nome del file */
  const DA_PAGINA = {insiemi:"insiemi", numeri:"naturali", relativi:"relativi", chimica:"materia", letterale:"letterale", elementi:"elementi", misure:"misure", segmenti:"segmenti", stati:"stati", trasforma:"trasforma", cerchio:"cerchio", nervoso:"nervoso", poliedri:"poliedri", genetica:"genetica", riproduttore:"riproduttore"};
  const daPagina = () => { const m = /^escape-([a-z]+)\.html$/.exec(location.pathname.split("/").pop()); return m ? DA_PAGINA[m[1]] : null; };
  const scegli = id => { const k = (id && PER_STANZA[id]) ? id : daPagina(); if(k && PER_STANZA[k]) scelto = PER_STANZA[k]; };
  let codice = null, trovato = false, idTrofeo = null;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const suono = t => { try { if(typeof suona === "function") suona(t); } catch {} };

  const ICONE = {
    diario:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="8" width="40" height="50" rx="4" fill="#C0392B" stroke="#1E2A44" stroke-width="3"/><rect x="12" y="8" width="8" height="50" fill="#962D22" stroke="#1E2A44" stroke-width="3"/><rect x="26" y="18" width="20" height="10" rx="2" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/></svg>',
    barattolo:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="8" width="32" height="9" rx="3" fill="#B98042" stroke="#1E2A44" stroke-width="3"/><path d="M14 17h36v36a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#CFE8FF" fill-opacity=".85" stroke="#1E2A44" stroke-width="3"/><path d="M24 40l8-5 9 6-8 6z" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/></svg>',
    scatola:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 20l24-10 24 10v28L32 58 8 48z" fill="#B98042" stroke="#1E2A44" stroke-width="3" stroke-linejoin="round"/><path d="M8 20l24 10 24-10M32 30v28" fill="none" stroke="#1E2A44" stroke-width="3"/><text x="19" y="46" font-family="Georgia,serif" font-weight="700" font-size="16" fill="#1E2A44">?</text></svg>',
    mappamondo:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 52v6M22 60h20" stroke="#1E2A44" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="28" r="20" fill="#7DBDF0" stroke="#1E2A44" stroke-width="3"/><path d="M20 20c4-3 8 0 7 4s-6 3-8 7M38 14c4 2 6 6 3 9s1 8 4 10" fill="#8EDDB4" stroke="#1E2A44" stroke-width="2"/><path d="M50 14a24 24 0 0 1-6 34" fill="none" stroke="#1E2A44" stroke-width="3"/></svg>'
  };
  Object.assign(ICONE, {
    astuccio:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="20" width="52" height="28" rx="12" fill="#5B8DEF" stroke="#1E2A44" stroke-width="3"/><path d="M12 30h40" stroke="#1E2A44" stroke-width="2" stroke-dasharray="3 2"/><rect x="40" y="25" width="8" height="10" rx="2" fill="#D5DCE6" stroke="#1E2A44" stroke-width="2"/></svg>',
    grattaevinci:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="5" fill="#FFD966" stroke="#1E2A44" stroke-width="3"/><rect x="14" y="24" width="36" height="16" rx="3" fill="#AEB9CA" stroke="#1E2A44" stroke-width="2"/><circle cx="46" cy="44" r="7" fill="#E0A065" stroke="#1E2A44" stroke-width="2"/></svg>',
    pacco:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="18" width="44" height="34" rx="3" fill="#C9935A" stroke="#1E2A44" stroke-width="3"/><path d="M10 28h44M32 18v34" stroke="#1E2A44" stroke-width="2"/><rect x="36" y="34" width="14" height="10" fill="#FFF8EC" stroke="#1E2A44" stroke-width="1.5"/><path d="M22 6h20v8H22z" fill="#AEB9CA" stroke="#1E2A44" stroke-width="2"/></svg>',
    provetta:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 6h16M26 6v42a6 6 0 0 0 12 0V6" fill="#FFFFFF" stroke="#1E2A44" stroke-width="3"/><path d="M27 28h10v20a5 5 0 0 1-10 0z" fill="#B58CF0"/><circle cx="32" cy="38" r="2" fill="#fff"/></svg>',
    attrezzi:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 18v-6h16v6" fill="none" stroke="#1E2A44" stroke-width="3"/><rect x="6" y="18" width="52" height="36" rx="4" fill="#E5534B" stroke="#1E2A44" stroke-width="3"/><path d="M6 30h52" stroke="#1E2A44" stroke-width="2.5"/><circle cx="12" cy="24" r="2.5" fill="#D5DCE6" stroke="#1E2A44"/><circle cx="52" cy="24" r="2.5" fill="#D5DCE6" stroke="#1E2A44"/></svg>',
    pergamena:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="14" width="36" height="38" fill="#F2E1B6" stroke="#1E2A44" stroke-width="3"/><rect x="10" y="8" width="44" height="10" rx="5" fill="#C9A66B" stroke="#1E2A44" stroke-width="3"/><path d="M20 28l8 8 6-6 10 10" fill="none" stroke="#A8783E" stroke-width="2" stroke-dasharray="3 3"/><path d="M40 36l6 6M46 36l-6 6" stroke="#E5534B" stroke-width="2.5"/></svg>',
    orologio:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="28" y="4" width="8" height="8" rx="2" fill="#E0B53A" stroke="#1E2A44" stroke-width="2"/><circle cx="32" cy="36" r="22" fill="#F5C542" stroke="#1E2A44" stroke-width="3"/><circle cx="32" cy="36" r="16" fill="#E0B53A" stroke="#1E2A44" stroke-width="1.5"/><path d="M24 30q8-6 16 0" fill="none" stroke="#FFF8EC" stroke-width="2"/></svg>',
    biglietto:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 20h52v8a4 4 0 0 0 0 8v8H6v-8a4 4 0 0 0 0-8z" fill="#FFF3B0" stroke="#1E2A44" stroke-width="3"/><path d="M14 28h22M14 34h16" stroke="#1E2A44" stroke-width="2.5"/><path d="M44 24v16" stroke="#1E2A44" stroke-width="2" stroke-dasharray="2 2"/></svg>',
    torta:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="44" rx="26" ry="10" fill="#E0A065" stroke="#1E2A44" stroke-width="3"/><path d="M6 30v14M58 30v14" stroke="#1E2A44" stroke-width="3"/><ellipse cx="32" cy="30" rx="26" ry="10" fill="#F7C6D0" stroke="#1E2A44" stroke-width="3"/><circle cx="32" cy="26" r="4" fill="#E5534B" stroke="#1E2A44" stroke-width="1.5"/></svg>',
    palloncino:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 44c-3 6 3 8 0 18" fill="none" stroke="#1E2A44" stroke-width="2"/><ellipse cx="32" cy="24" rx="17" ry="20" fill="#E5534B" stroke="#1E2A44" stroke-width="3"/><path d="M29 44h6l-3-4z" fill="#E5534B" stroke="#1E2A44" stroke-width="2"/><ellipse cx="25" cy="16" rx="4" ry="7" fill="#fff" opacity=".5"/></svg>',
    cardio:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="22" y="4" width="20" height="14" rx="3" fill="#2A2F3A" stroke="#1E2A44" stroke-width="2.5"/><rect x="22" y="46" width="20" height="14" rx="3" fill="#2A2F3A" stroke="#1E2A44" stroke-width="2.5"/><rect x="14" y="14" width="36" height="36" rx="10" fill="#3A4560" stroke="#1E2A44" stroke-width="3"/><rect x="19" y="19" width="26" height="26" rx="6" fill="#101826"/><path d="M22 34h6l3-7 4 12 3-5h5" fill="none" stroke="#7CFFA0" stroke-width="2.2" stroke-linejoin="round"/><rect x="50" y="26" width="5" height="10" rx="2" fill="#E5534B" stroke="#1E2A44" stroke-width="1.5"/></svg>',
    sarcofago:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 6h20c6 0 8 6 8 12v32c0 6-6 10-18 10S14 56 14 50V18c0-6 2-12 8-12z" fill="#E0B53A" stroke="#1E2A44" stroke-width="3"/><ellipse cx="32" cy="18" rx="8" ry="9" fill="#F2D59A" stroke="#1E2A44" stroke-width="2"/><path d="M24 12h16v4H24z" fill="#2F6FDE"/><path d="M20 32h24M20 38h24M20 44h24" stroke="#2F6FDE" stroke-width="2.5"/></svg>',
    baccello:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 40C14 18 44 10 58 18c-6 18-34 30-52 22z" fill="#8BC34A" stroke="#1E2A44" stroke-width="3" stroke-linejoin="round"/><path d="M10 38c14-4 30-12 44-18" fill="none" stroke="#1E2A44" stroke-width="2"/><path d="M56 18c2-6 6-8 6-12" fill="none" stroke="#5A8A2A" stroke-width="3" stroke-linecap="round"/></svg>',
    carillon:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="28" width="44" height="26" rx="4" fill="#C9935A" stroke="#1E2A44" stroke-width="3"/><path d="M10 28l6-12h32l6 12z" fill="#E0B07A" stroke="#1E2A44" stroke-width="3" stroke-linejoin="round"/><path d="M54 40h6v-6" fill="none" stroke="#1E2A44" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="41" r="5" fill="#FFC7E0" stroke="#1E2A44" stroke-width="2"/></svg>',
    ghiaccio:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="12" width="40" height="40" rx="8" fill="#DDF3FF" stroke="#1E2A44" stroke-width="3"/><path d="M18 18l10 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="24" y="28" width="18" height="12" fill="#FFF8EC" stroke="#1E2A44" stroke-width="1.5" opacity=".7"/></svg>'
  });
  const NOMI = {diario:"un vecchio diario", barattolo:"un barattolo", scatola:"una scatola misteriosa", mappamondo:"un piccolo mappamondo",
    astuccio:"un astuccio dimenticato", grattaevinci:"un gratta e vinci del supermercato", pacco:"il pacco del drone", provetta:"una provetta misteriosa",
    attrezzi:"la cassetta degli attrezzi", pergamena:"una cartina arrotolata", orologio:"un vecchio orologio da taschino", biglietto:"un biglietto del treno", ghiaccio:"un cubetto di ghiaccio", torta:"una torta del pasticcere", palloncino:"un palloncino del luna park", cardio:"il cardiofrequenzimetro del medico", sarcofago:"un sarcofago in miniatura", baccello:"un baccello di pisello gigante", carillon:"un carillon della mostra"};
  const ISTRUZIONI = {
    diario:"Sfoglia il diario pagina per pagina: da qualche parte qualcuno ha scritto il codice.",
    barattolo:"Dentro il barattolo c'è un bigliettino. Scuotilo forte (anche trascinandolo a destra e a sinistra) finché il tappo salta!",
    scatola:"Gira la scatola da tutti i lati: il codice è inciso su uno di essi.",
    mappamondo:"Fai girare il mappamondo (trascinalo o usa le frecce) e cerca l'isola con il codice.",
    astuccio:"Apri la cerniera dell'astuccio: trascina il cursore fino in fondo (o usa il pulsante) e guarda cosa c'è dentro.",
    grattaevinci:"Gratta la parte argentata con il dito o con il mouse: sotto c'è il premio!",
    pacco:"Gira il pacco del drone da tutti i lati: il codice è su una delle etichette.",
    provetta:"Agita la provetta (anche trascinandola a destra e a sinistra): il liquido reagisce e compare il codice.",
    attrezzi:"Il coperchio è avvitato: svita le 4 viti toccandole una alla volta.",
    pergamena:"La cartina è arrotolata: trascinala verso il basso (o usa il pulsante) per srotolarla e trova la X.",
    orologio:"L'orologio è chiuso: carica la corona in alto toccandola, finché il coperchio scatta.",
    biglietto:"Prima di partire il biglietto va timbrato: trascinalo nella macchinetta obliteratrice (o usa il pulsante).",
    torta:"Dentro la torta il pasticcere ha nascosto una sorpresa: tagliala in fette (tocca il coltello o la torta) e cerca il bigliettino.",
    palloncino:"Dentro il palloncino si vede un bigliettino arrotolato: gonfialo ancora (tocca il palloncino o la pompa) finché scoppia!",
    cardio:"Il cardiofrequenzimetro è acceso: premi il pulsante rosso sul lato (o tocca lo schermo) per sfogliare le schermate. Nell'ultima c'è il codice!",
    sarcofago:"Il coperchio del piccolo sarcofago è chiuso: fallo scorrere trascinandolo verso destra (o usa il pulsante) e guarda dentro.",
    baccello:"È un baccello delle piante di Mendel, ma un po' troppo gonfio: aprilo (tocca il baccello o il pulsante) e guarda tra i piselli.",
    carillon:"Il carillon della mostra si apre solo quando la musica arriva alla fine: gira la manovella (toccala o usa il pulsante) finché il coperchio scatta.",
    ghiaccio:"Dentro il cubetto c'è un bigliettino congelato: scaldalo strofinandoci sopra il dito (o con il pulsante) finché si scioglie."
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
/* astuccio */
.os-astuccio{position:relative;width:300px;max-width:100%;height:150px;border-radius:40px;border:4px solid #1E2A44;background:#FFF8EC;overflow:hidden;box-shadow:4px 5px 0 #1E2A44}
.os-dentro{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 20px}
.os-matita{width:14px;height:96px;border-radius:3px;border:2px solid #1E2A44}
.os-gomma{display:grid;place-items:center;padding:8px 10px;border-radius:8px;border:2px solid #1E2A44;background:#F2B8C6;color:#1E2A44;font-family:"Courier New",monospace;font-weight:700;font-size:1.05rem;transform:rotate(-6deg)}
.os-telo{position:absolute;top:0;bottom:0;right:0;background:#5B8DEF;background-image:repeating-linear-gradient(90deg,transparent 0 10px,rgba(255,255,255,.12) 10px 12px)}
.os-cerniera{position:absolute;top:50%;left:0;right:0;border-top:3px dashed #1E2A44}
.os-cursore{position:absolute;top:50%;width:26px;height:44px;margin:-22px 0 0 -13px;border-radius:6px;border:3px solid #1E2A44;background:#D5DCE6;cursor:grab;touch-action:none;z-index:2}
/* gratta e vinci */
.os-gratta{position:relative;width:300px;max-width:100%;height:170px;border-radius:12px;border:4px solid #1E2A44;background:#FFD966;padding:10px;box-shadow:4px 5px 0 #1E2A44}
.os-gratta-tit{font-family:var(--f-display);font-weight:800;color:#1E2A44}
.os-premio-sotto{position:absolute;left:24px;right:24px;top:52px;height:96px;display:grid;place-items:center;border-radius:8px;background:#FFFFFF;border:2px solid #1E2A44;color:#1E2A44;font-family:var(--f-display);font-weight:800;font-size:1.6rem;letter-spacing:.1em}
.os-gratta canvas{position:absolute;left:24px;top:52px;width:calc(100% - 48px);height:96px;border-radius:8px;touch-action:none;cursor:crosshair}
/* provetta */
.os-tubo{width:120px;height:230px;cursor:grab;touch-action:none}
.os-tubo.scuoti{animation:os-scuoti .45s ease}
.os-liquido{transition:fill 1s ease}
/* cassetta degli attrezzi */
.os-cassa{position:relative;width:280px;max-width:100%;height:200px}
.os-coperchio{transition:transform .9s cubic-bezier(.4,0,.2,1)}
.os-coperchio.alza{transform:translateY(-190px) rotate(-10deg)}
.os-vite{cursor:pointer}
.os-vite.via{animation:os-svita .7s ease forwards}
@keyframes os-svita{40%{transform:rotate(360deg)}100%{transform:rotate(540deg) translateY(30px);opacity:0}}
.os-vite{transform-box:fill-box;transform-origin:center}
/* cartina arrotolata */
.os-rotolo{position:relative;width:280px;max-width:100%;touch-action:none;cursor:grab}
.os-carta{overflow:hidden;transition:height .35s ease;border-left:3px solid #1E2A44;border-right:3px solid #1E2A44;background:#F2E1B6;margin:0 10px}
.os-carta svg{display:block;width:100%;height:200px}
.os-asta{height:22px;border-radius:11px;border:3px solid #1E2A44;background:#C9A66B}
/* orologio da taschino */
.os-orologio{width:220px;height:240px}
.os-orologio svg{width:100%;height:100%;overflow:visible}
.os-lancette{transform-box:view-box;transform-origin:110px 140px}
.os-lancette.carica{animation:os-carica .6s ease}
@keyframes os-carica{to{transform:rotate(180deg)}}
.os-sportello{transform-box:view-box;transform-origin:110px 62px;transition:transform .8s cubic-bezier(.3,1.3,.5,1)}
.os-sportello.apre{transform:scaleY(-.55)}
.os-corona{cursor:pointer}
/* biglietto del treno */
.os-stazione{position:relative;width:320px;max-width:100%;height:230px}
.os-oblit{position:absolute;right:6px;top:10px;width:110px;height:170px;border-radius:12px;border:4px solid #1E2A44;background:#E5534B;display:grid;justify-items:center;align-content:start;gap:6px;padding-top:12px;color:#FFFFFF;font-family:var(--f-display);font-weight:800;font-size:.8rem}
.os-oblit .fessura{width:70px;height:10px;border-radius:5px;background:#1E2A44}
.os-oblit.timbra{animation:os-timbra .4s ease}
@keyframes os-timbra{50%{transform:translateY(4px) scale(.97)}}
.os-ticket{position:absolute;left:6px;top:70px;width:170px;padding:10px 12px;border:3px solid #1E2A44;border-radius:6px;background:#FFF3B0;color:#1E2A44;font-family:"Courier New",monospace;font-weight:700;font-size:.85rem;line-height:1.3;box-shadow:3px 4px 0 #1E2A44;cursor:grab;touch-action:none;z-index:2;text-align:left}
.os-ticket.timbrato{cursor:default}
.os-timbro{display:inline-block;margin-top:6px;padding:2px 8px;border:3px solid #C2410C;border-radius:6px;color:#C2410C;font-size:1.05rem;letter-spacing:.08em;transform:rotate(-6deg);animation:os-apri .4s ease both}
/* cubetto di ghiaccio */
.os-freezer{position:relative;width:260px;max-width:100%;height:230px;display:grid;place-items:center;touch-action:none}
.os-cubetto{position:relative;display:grid;place-items:center;border-radius:22px;border:4px solid #1E2A44;background:linear-gradient(135deg,#F4FBFF,#BFE6FF);box-shadow:inset 8px 8px 0 rgba(255,255,255,.7);transition:width .4s ease,height .4s ease;cursor:pointer}
.os-gelato{padding:6px 10px;background:#FFF8EC;border:2px solid #1E2A44;color:#1E2A44;font-family:var(--f-display);font-weight:800;font-size:1.2rem;letter-spacing:.08em;transition:filter .4s ease}
.os-pozza{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);height:18px;border-radius:50%;background:#8EC5F0;opacity:.8;transition:width .4s ease}
/* torta */
.os-torta{width:260px;height:240px;cursor:pointer;touch-action:manipulation}
.os-torta svg{width:100%;height:100%;overflow:visible}
.os-taglio{stroke-dasharray:120;stroke-dashoffset:120;animation:os-taglia .4s ease forwards}
@keyframes os-taglia{to{stroke-dashoffset:0}}
.os-fetta{transition:transform .8s cubic-bezier(.3,1.3,.5,1)}
.os-fetta.fuori{transform:translate(60px,30px)}
/* palloncino */
.os-luna{position:relative;width:260px;height:250px;display:grid;place-items:center;touch-action:manipulation}
.os-pall{cursor:pointer;transition:transform .35s cubic-bezier(.3,1.6,.5,1);transform-origin:50% 90%}
.os-pall.trema{animation:os-trema .25s linear infinite}
@keyframes os-trema{0%,100%{translate:0 0}25%{translate:-2px 1px}75%{translate:2px -1px}}
.os-scoppio{position:absolute;inset:0;pointer-events:none}
.os-pezzetto{position:absolute;left:50%;top:40%;width:12px;height:8px;border-radius:3px;background:#E5534B;border:1.5px solid #1E2A44;animation:os-vola .9s ease-out forwards}
@keyframes os-vola{to{transform:translate(var(--dx),var(--dy)) rotate(var(--g));opacity:0}}
.os-scende{position:absolute;left:50%;top:30%;padding:6px 10px;background:#FFF8EC;border:2px solid #1E2A44;border-radius:4px;color:#1E2A44;font-family:"Courier New",monospace;font-weight:700;font-size:1.1rem;transform:translateX(-50%);animation:os-plana 1.4s cubic-bezier(.3,1.2,.5,1) forwards}
@keyframes os-plana{0%{transform:translate(-50%,-20px) rotate(-14deg) scale(.4);opacity:0}60%{transform:translate(-50%,40px) rotate(8deg)}100%{transform:translate(-50%,70px) rotate(-3deg) scale(1);opacity:1}}
/* cardiofrequenzimetro */
.os-polso{width:260px;max-width:100%;height:250px;display:grid;place-items:center}
.os-polso svg{width:100%;height:100%;overflow:visible}
.os-tasto{cursor:pointer}
.os-tasto.premuto{transform:translateX(-3px)}
.os-cuore{transform-box:fill-box;transform-origin:center;animation:os-pulsa .8s ease-in-out infinite}
@keyframes os-pulsa{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}}
.os-schermo{cursor:pointer}
@media (prefers-reduced-motion:reduce){.os-cuore{animation:none}}
/* sarcofago */
.os-cripta{position:relative;width:280px;max-width:100%;height:230px;touch-action:none}
.os-cripta svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.os-coperchio{cursor:grab;touch-action:none}
.os-coperchio:active{cursor:grabbing}
.os-coperchio.scivola{transition:transform .5s cubic-bezier(.3,1.2,.5,1)}
/* baccello */
.os-orto{width:280px;max-width:100%;height:220px;display:grid;place-items:center}
.os-orto svg{width:100%;height:100%;overflow:visible;cursor:pointer}
.os-valva{transition:transform .6s cubic-bezier(.3,1.3,.5,1);transform-box:view-box;transform-origin:140px 110px}
.os-pisello{transition:transform .5s cubic-bezier(.3,1.6,.5,1)}
@media (prefers-reduced-motion:reduce){.os-valva,.os-pisello{transition:none}}
/* carillon */
.os-musica{width:280px;max-width:100%;height:230px;display:grid;place-items:center}
.os-musica svg{width:100%;height:100%;overflow:visible}
.os-manovella{cursor:pointer;transform-box:fill-box;transform-origin:0 50%;transition:transform .35s ease}
.os-coperchio-c{transform-box:view-box;transform-origin:40px 100px;transition:transform .8s cubic-bezier(.3,1.3,.5,1)}
.os-nota-m{animation:os-vola-nota 1.6s ease-out forwards}
@keyframes os-vola-nota{from{opacity:1;transform:translate(0,0)}to{opacity:0;transform:translate(30px,-60px)}}
@media (prefers-reduced-motion:reduce){.os-manovella,.os-coperchio-c{transition:none}.os-nota-m{animation:none;opacity:0}}
@media (prefers-reduced-motion:reduce){.os-pall.trema,.os-pezzetto,.os-scende{animation:none!important}.os-scende{transform:translate(-50%,70px)}.os-pezzetto{display:none}}
@media (prefers-reduced-motion:reduce){.os-cade,.os-cade svg,.os-pag.gira,.os-vaso.scuoti,.os-cubo.gira,.os-bigliettino,.os-aperto,.os-trovato{animation:none!important}.os-tappo{transition:none}}
`;
  let stile = false;
  function aggiungiStile(){ if(stile) return; stile = true; const s = document.createElement("style"); s.textContent = CSS; document.head.append(s); }

  function bottone(id){
    scegli(id); aggiungiStile();
    const femm = /^(una|la) /.test(NOMI[scelto]);   /* "è caduta una torta", "è caduto un astuccio" */
    return `<button class="os-cade" type="button" id="os-cade">${ICONE[scelto]}<span>Aprendo la porta è ${femm ? "caduta" : "caduto"} ${NOMI[scelto]}! ${femm ? "Toccala per esplorarla" : "Toccalo per esplorarlo"}.</span></button>`;
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
    scegli(id); aggiungiStile(); idTrofeo = id;
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
    ({diario, barattolo, scatola, mappamondo, astuccio, grattaevinci, pacco, provetta, attrezzi, pergamena, orologio, biglietto, ghiaccio, torta, palloncino, cardio, sarcofago, baccello, carillon})[scelto]();
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
    /* il bigliettino è un pulsante dentro il barattolo: se il barattolo "catturasse" il tocco, il bigliettino non si aprirebbe mai */
    vaso.addEventListener("pointerdown", e => { if(e.target.closest("button")) return; ultimoX = e.clientX; try { vaso.setPointerCapture(e.pointerId); } catch {} });
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


  /* ---- l'astuccio (L'aula chiusa): si apre la cerniera, il codice è scritto sulla gomma ---- */
  function astuccio(){
    let aperto = 0;
    scena().innerHTML = `<div class="os-astuccio" id="os-astuccio" role="img" aria-label="Astuccio con la cerniera">
      <div class="os-dentro"><span class="os-matita" style="background:#E5534B"></span><span class="os-matita" style="background:#4CB782"></span><span class="os-matita" style="background:#F5C542"></span>
        <span class="os-gomma" aria-label="Sulla gomma c'è scritto ${codice}">${codice}</span><span class="os-matita" style="background:#5B8DEF"></span></div>
      <div class="os-telo" id="os-telo"><div class="os-cerniera"></div></div><div class="os-cursore" id="os-cursore" tabindex="0" role="slider" aria-label="Cursore della cerniera" aria-valuemin="0" aria-valuemax="100"></div></div>`;
    const box = fin.querySelector("#os-astuccio"), telo = fin.querySelector("#os-telo"), cur = fin.querySelector("#os-cursore");
    const metti = v => {
      aperto = Math.max(0, Math.min(1, v));
      telo.style.left = aperto * 100 + "%"; cur.style.left = Math.max(4, aperto * 100) + "%"; cur.setAttribute("aria-valuenow", Math.round(aperto * 100));
      if(aperto >= .97){ suono("sblocco"); setTimeout(mostraCodice, 300); }
    };
    metti(0);
    comandi(`<button class="os-btn blu" type="button" id="os-apri">Apri un po' la cerniera ▶</button>`);
    fin.querySelector("#os-apri").addEventListener("click", () => { suono("prendi"); metti(aperto + .25); });
    cur.addEventListener("keydown", e => { if(e.key === "ArrowRight"){ e.preventDefault(); metti(aperto + .1); } if(e.key === "ArrowLeft"){ e.preventDefault(); metti(aperto - .1); } });
    cur.addEventListener("pointerdown", e => {
      e.preventDefault(); try { cur.setPointerCapture(e.pointerId); } catch {}
      const muovi = ev => { const r = box.getBoundingClientRect(); metti((ev.clientX - r.left) / r.width); };
      const fine = () => { cur.removeEventListener("pointermove", muovi); cur.removeEventListener("pointerup", fine); suono("prendi"); };
      cur.addEventListener("pointermove", muovi); cur.addEventListener("pointerup", fine);
    });
  }

  /* ---- il gratta e vinci (Il supermercato chiuso): si gratta la parte argentata ---- */
  function grattaevinci(){
    scena().innerHTML = `<div class="os-gratta"><div class="os-gratta-tit">GRATTA E VINCI · SUPERMERCATO</div>
      <div class="os-premio-sotto" aria-label="Sotto la patina: ${codice}">${codice}</div><canvas id="os-tela" width="252" height="96" aria-hidden="true"></canvas></div>`;
    const c = fin.querySelector("#os-tela"), x = c.getContext("2d");
    x.fillStyle = "#AEB9CA"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#8A96AB"; for(let i = 0; i < 60; i++) x.fillRect(Math.random() * c.width, Math.random() * c.height, 3, 3);
    x.fillStyle = "#56627A"; x.font = "bold 16px sans-serif"; x.textAlign = "center"; x.fillText("GRATTA QUI", c.width / 2, c.height / 2 + 6);
    let fatto = false;
    const gratta = (px, py, r = 16) => { x.globalCompositeOperation = "destination-out"; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); x.globalCompositeOperation = "source-over"; };
    const controlla = () => {
      if(fatto) return;
      const d = x.getImageData(0, 0, c.width, c.height).data; let vuoti = 0;
      for(let i = 3; i < d.length; i += 16) if(d[i] === 0) vuoti++;
      if(vuoti / (d.length / 16) > .5){ fatto = true; x.clearRect(0, 0, c.width, c.height); comandi(""); mostraCodice(); }
    };
    let giu = false, ultimo = null;
    const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * c.width, (e.clientY - r.top) / r.height * c.height]; };
    /* gratto lungo tutta la linea dal punto precedente, così non restano buchi anche se il dito va veloce */
    const linea = (a, b) => { x.globalCompositeOperation = "destination-out"; x.lineWidth = 30; x.lineCap = "round"; x.beginPath(); x.moveTo(...a); x.lineTo(...b); x.stroke(); x.globalCompositeOperation = "source-over"; };
    c.addEventListener("pointerdown", e => { giu = true; try { c.setPointerCapture(e.pointerId); } catch {} ultimo = pos(e); gratta(...ultimo); });
    c.addEventListener("pointermove", e => { if(!giu) return; const p = pos(e); linea(ultimo, p); ultimo = p; if(Math.random() < .15) suono("bip"); });
    c.addEventListener("pointerup", () => { giu = false; ultimo = null; controlla(); });
    comandi(`<button class="os-btn blu" type="button" id="os-moneta">Gratta con la moneta</button>`);
    fin.querySelector("#os-moneta").addEventListener("click", () => { suono("prendi"); for(let i = 0; i < 14; i++) gratta(Math.random() * c.width, Math.random() * c.height, 22); controlla(); });
  }

  /* ---- il pacco del drone (Il drone sotto zero): si gira, il codice è sull'etichetta ---- */
  function pacco(){
    const FACCE = [
      `<span class="os-faccia">DRONE EXPRESS<br>consegna sul tetto<br>(0; 0)</span>`,
      `<span class="os-faccia">⬆ QUESTO LATO IN ALTO ⬆<br>non far cadere sotto zero!</span>`,
      `<span><span class="os-faccia">Etichetta di spedizione</span><br><span class="os-inciso">${codice}</span></span>`,
      `<span class="os-faccia">FRAGILE<br>contiene un premio</span>`
    ];
    let f = 0;
    const disegna = gira => { scena().innerHTML = `<div class="os-cubo${gira ? " gira" : ""}" style="background-color:#C9935A" role="img" aria-label="Lato ${f+1} di 4 del pacco">${FACCE[f]}</div>`; if(f === 2) setTimeout(mostraCodice, 500); };
    disegna(false);
    comandi(`<button class="os-btn" type="button" id="os-sx">◀ Gira</button><span class="os-nota" id="os-lato">lato 1 di 4</span><button class="os-btn" type="button" id="os-dx">Gira ▶</button>`);
    const gira = d => { f = (f + d + 4) % 4; fin.querySelector("#os-lato").textContent = `lato ${f+1} di 4`; suono("prendi"); disegna(true); };
    fin.querySelector("#os-sx").addEventListener("click", () => gira(-1));
    fin.querySelector("#os-dx").addEventListener("click", () => gira(1));
  }

  /* ---- la provetta (Il laboratorio sigillato): agitandola il liquido cambia colore e compare il codice ---- */
  function provetta(){
    const COLORI = ["#B58CF0", "#8E7BE8", "#5BA8E8", "#4CB782", "#F5C542"];
    let scosse = 0;
    scena().innerHTML = `<svg class="os-tubo" id="os-tubo" viewBox="0 0 120 230" role="img" aria-label="Provetta con un liquido viola">
      <path d="M38 10h44" stroke="#1E2A44" stroke-width="5" stroke-linecap="round"/>
      <path d="M44 10v170a16 16 0 0 0 32 0V10" fill="#FFFFFF" fill-opacity=".6" stroke="#1E2A44" stroke-width="4"/>
      <path class="os-liquido" id="os-liquido" d="M46 90h28v90a14 14 0 0 1-28 0z" fill="${COLORI[0]}"/>
      <text id="os-cod-tubo" x="60" y="140" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="12" fill="#1E2A44" opacity="0" transform="rotate(-90 60 140)">${codice}</text>
      <circle cx="54" cy="160" r="3" fill="#fff" opacity=".7"/><circle cx="64" cy="130" r="2" fill="#fff" opacity=".7"/></svg>`;
    const tubo = fin.querySelector("#os-tubo");
    const agita = () => {
      if(scosse >= 4) return;
      scosse++; tubo.classList.remove("scuoti"); void tubo.getBoundingClientRect(); tubo.classList.add("scuoti"); suono("prendi");
      fin.querySelector("#os-liquido").setAttribute("fill", COLORI[scosse]);
      if(scosse === 4){ fin.querySelector("#os-cod-tubo").setAttribute("opacity", "1"); suono("sblocco"); setTimeout(mostraCodice, 700); comandi(""); }
    };
    comandi(`<button class="os-btn blu" type="button" id="os-agita">Agita la provetta</button>`);
    fin.querySelector("#os-agita").addEventListener("click", agita);
    let ultimoX = null, verso = 0, strada = 0;
    tubo.addEventListener("pointerdown", e => { ultimoX = e.clientX; try { tubo.setPointerCapture(e.pointerId); } catch {} });
    tubo.addEventListener("pointermove", e => { if(ultimoX === null) return; const d = e.clientX - ultimoX; ultimoX = e.clientX; const v = Math.sign(d); strada += Math.abs(d); if(v && v !== verso && strada > 40){ verso = v; strada = 0; agita(); } });
    tubo.addEventListener("pointerup", () => { ultimoX = null; });
  }

  /* ---- la cassetta degli attrezzi (Il cantiere bloccato): si svitano 4 viti ---- */
  function attrezzi(){
    let tolte = 0;
    const viti = [[40, 70], [240, 70], [40, 108], [240, 108]].map(([x, y], i) => `<g class="os-vite" data-v="${i}" role="button" tabindex="0" aria-label="Vite ${i + 1}"><circle cx="${x}" cy="${y}" r="11" fill="#D5DCE6" stroke="#1E2A44" stroke-width="2.5"/><path d="M${x - 6} ${y}h12M${x} ${y - 6}v12" stroke="#1E2A44" stroke-width="2.5"/></g>`).join("");
    scena().innerHTML = `<svg class="os-cassa" viewBox="0 0 280 200" role="img" aria-label="Cassetta degli attrezzi avvitata">
      <rect x="20" y="90" width="240" height="100" rx="8" fill="#C0392B" stroke="#1E2A44" stroke-width="4"/>
      <rect x="40" y="112" width="200" height="60" rx="6" fill="#2A2F3A"/><rect x="58" y="132" width="164" height="22" rx="3" fill="#F5C542" stroke="#1E2A44" stroke-width="2"/>
      <text x="140" y="148" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="16" fill="#1E2A44">${codice}</text>
      <g class="os-coperchio" id="os-coperchio"><path d="M108 58V38h64v20" fill="none" stroke="#1E2A44" stroke-width="7"/><rect x="20" y="56" width="240" height="118" rx="8" fill="#E5534B" stroke="#1E2A44" stroke-width="4"/><path d="M20 120h240" stroke="#1E2A44" stroke-width="2.5" opacity=".5"/>${viti}</g></svg>`;
    comandi(`<span class="os-nota" id="os-viti">Viti tolte: 0 su 4</span>`);
    fin.querySelectorAll(".os-vite").forEach(v => {
      const togli = () => {
        if(v.classList.contains("via")) return;
        v.classList.add("via"); tolte++; suono("clic"); fin.querySelector("#os-viti").textContent = `Viti tolte: ${tolte} su 4`;
        if(tolte === 4) setTimeout(() => { fin.querySelector("#os-coperchio").classList.add("alza"); suono("sblocco"); setTimeout(mostraCodice, 800); }, 600);
      };
      v.addEventListener("click", togli);
      v.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); togli(); } });
    });
  }

  /* ---- la cartina arrotolata (La casetta del guardiaparco): si srotola e si trova la X ---- */
  function pergamena(){
    let srotolata = 0;
    scena().innerHTML = `<div class="os-rotolo" id="os-rotolo" role="img" aria-label="Cartina arrotolata"><div class="os-asta"></div>
      <div class="os-carta" id="os-carta" style="height:0"><svg viewBox="0 0 260 200" aria-hidden="true">
        <path d="M20 30q40 20 70 10t60 30 40 40 40 60" fill="none" stroke="#A8783E" stroke-width="3" stroke-dasharray="6 5"/>
        <path d="M30 150l14-20 14 20zM60 160l12-18 12 18z" fill="#5E9E5A" stroke="#1E2A44" stroke-width="1.5"/>
        <ellipse cx="200" cy="50" rx="34" ry="16" fill="#8EC5F0" stroke="#1E2A44" stroke-width="1.5"/>
        <path d="M212 160l16 16M228 160l-16 16" stroke="#E5534B" stroke-width="5" stroke-linecap="round"/>
        <rect x="120" y="172" width="110" height="24" rx="4" fill="#FFF8EC" stroke="#1E2A44" stroke-width="1.5"/>
        <text x="175" y="189" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="14" fill="#1E2A44">${codice}</text>
      </svg></div><div class="os-asta"></div></div>`;
    const carta = fin.querySelector("#os-carta"), rot = fin.querySelector("#os-rotolo");
    const metti = v => { srotolata = Math.max(0, Math.min(1, v)); carta.style.height = srotolata * 200 + "px"; if(srotolata >= .97) setTimeout(mostraCodice, 400); };
    comandi(`<button class="os-btn blu" type="button" id="os-srotola">Srotola ▼</button>`);
    fin.querySelector("#os-srotola").addEventListener("click", () => { suono("prendi"); metti(srotolata + .34); });
    let y0 = null;
    rot.addEventListener("pointerdown", e => { y0 = e.clientY; try { rot.setPointerCapture(e.pointerId); } catch {} });
    rot.addEventListener("pointermove", e => { if(y0 === null) return; metti(srotolata + (e.clientY - y0) / 200); y0 = e.clientY; });
    rot.addEventListener("pointerup", () => { y0 = null; });
  }

  /* ---- l'orologio da taschino (La stazione meteo): si carica la corona e il coperchio si apre ---- */
  function orologio(){
    let cariche = 0;
    scena().innerHTML = `<div class="os-orologio"><svg viewBox="0 0 220 240" role="img" aria-label="Orologio da taschino chiuso">
      <path d="M110 6a14 14 0 1 1 0 28" fill="none" stroke="#C9A12E" stroke-width="5"/>
      <g class="os-corona" id="os-corona" role="button" tabindex="0" aria-label="Corona dell'orologio"><rect x="98" y="34" width="24" height="22" rx="4" fill="#E0B53A" stroke="#1E2A44" stroke-width="3"/><path d="M102 38v14M110 38v14M118 38v14" stroke="#1E2A44" stroke-width="1.5"/></g>
      <circle cx="110" cy="140" r="78" fill="#F5C542" stroke="#1E2A44" stroke-width="5"/>
      <circle cx="110" cy="140" r="66" fill="#FFFDF5" stroke="#1E2A44" stroke-width="2"/>
      ${Array.from({length:12}, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${110 + 56 * Math.sin(a)}" y1="${140 - 56 * Math.cos(a)}" x2="${110 + 62 * Math.sin(a)}" y2="${140 - 62 * Math.cos(a)}" stroke="#1E2A44" stroke-width="2.5"/>`; }).join("")}
      <text x="110" y="182" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="15" fill="#8A6A3E">${codice}</text>
      <g class="os-lancette" id="os-lancette"><path d="M110 140V96" stroke="#1E2A44" stroke-width="4" stroke-linecap="round"/><path d="M110 140h34" stroke="#1E2A44" stroke-width="3" stroke-linecap="round"/><circle cx="110" cy="140" r="5" fill="#1E2A44"/></g>
      <g class="os-sportello" id="os-sportello"><circle cx="110" cy="140" r="78" fill="#E0B53A" stroke="#1E2A44" stroke-width="5"/><circle cx="110" cy="140" r="58" fill="none" stroke="#C9A12E" stroke-width="3"/><path d="M80 120q30-26 60 0" fill="none" stroke="#FFF3B0" stroke-width="5" stroke-linecap="round"/></g>
    </svg></div>`;
    const corona = fin.querySelector("#os-corona");
    const carica = () => {
      if(cariche >= 3) return;
      cariche++; suono("clic");
      const l = fin.querySelector("#os-lancette"); l.classList.remove("carica"); void l.getBoundingClientRect(); l.classList.add("carica");
      fin.querySelector("#os-cariche").textContent = `Carica: ${cariche} su 3`;
      if(cariche === 3) setTimeout(() => { fin.querySelector("#os-sportello").classList.add("apre"); suono("sblocco"); setTimeout(mostraCodice, 800); }, 500);
    };
    comandi(`<button class="os-btn blu" type="button" id="os-carica">Carica la corona</button><span class="os-nota" id="os-cariche">Carica: 0 su 3</span>`);
    fin.querySelector("#os-carica").addEventListener("click", carica);
    corona.addEventListener("click", carica);
    corona.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); carica(); } });
  }

  /* ---- il biglietto del treno (Il plastico ferroviario): si timbra nell'obliteratrice ---- */
  function biglietto(){
    let timbrato = false;
    scena().innerHTML = `<div class="os-stazione" id="os-stazione">
      <div class="os-oblit" id="os-oblit">OBLITERATRICE<span class="fessura"></span><span style="font-size:1.6rem">⇩</span><span>inserisci qui</span></div>
      <div class="os-ticket" id="os-ticket" role="img" aria-label="Biglietto del treno">MUSEO DEI TRASPORTI<br>Biglietto di corsa semplice<br>A ➝ B · 2ª classe<div id="os-timbro-box"></div></div></div>`;
    const t = fin.querySelector("#os-ticket"), ob = fin.querySelector("#os-oblit");
    const timbra = () => {
      if(timbrato) return; timbrato = true;
      t.style.transition = "transform .35s ease"; t.style.transform = "translate(0,0)"; t.classList.add("timbrato");
      ob.classList.add("timbra"); suono("clic"); setTimeout(() => suono("sblocco"), 200);
      fin.querySelector("#os-timbro-box").innerHTML = `<span class="os-timbro" aria-label="Timbro: ${codice}">${codice}</span>`;
      setTimeout(mostraCodice, 600); comandi("");
    };
    comandi(`<button class="os-btn blu" type="button" id="os-timbra">Timbra il biglietto</button>`);
    fin.querySelector("#os-timbra").addEventListener("click", timbra);
    t.addEventListener("pointerdown", e => {
      if(timbrato) return; e.preventDefault();
      const x0 = e.clientX, y0 = e.clientY; t.style.transition = "none";
      try { t.setPointerCapture(e.pointerId); } catch {}
      suono("prendi");
      const muovi = ev => { t.style.transform = `translate(${ev.clientX - x0}px,${ev.clientY - y0}px) rotate(-4deg)`; };
      const fine = ev => {
        t.removeEventListener("pointermove", muovi); t.removeEventListener("pointerup", fine);
        const a = t.getBoundingClientRect(), b = ob.getBoundingClientRect();
        const cx = a.left + a.width / 2, cy = a.top + a.height / 2;
        const sopra = cx > b.left && cx < b.right + 40 && cy > b.top && cy < b.bottom;   /* il centro del biglietto deve arrivare sulla macchinetta */
        if(sopra) timbra(); else { t.style.transition = "transform .35s ease"; t.style.transform = "translate(0,0)"; }
      };
      t.addEventListener("pointermove", muovi); t.addEventListener("pointerup", fine);
    });
  }

  /* ---- il cubetto di ghiaccio (Il rifugio nella bufera): si scalda e si scioglie, il bigliettino si libera ---- */
  function ghiaccio(){
    let caldo = 0;
    scena().innerHTML = `<div class="os-freezer" id="os-freezer"><div class="os-pozza" id="os-pozza" style="width:20px"></div>
      <div class="os-cubetto" id="os-cubetto" style="width:180px;height:180px" role="img" aria-label="Cubetto di ghiaccio con un bigliettino dentro"><span class="os-gelato" id="os-gelato" style="filter:blur(6px)">${codice}</span></div></div>`;
    const cubo = fin.querySelector("#os-cubetto");
    const scalda = q => {
      if(caldo >= 1) return;
      caldo = Math.min(1, caldo + q);
      const lato = 180 - caldo * 70;
      cubo.style.width = cubo.style.height = lato + "px";
      cubo.style.opacity = 1 - caldo * .55;
      fin.querySelector("#os-gelato").style.filter = `blur(${Math.max(0, 6 - caldo * 7)}px)`;
      fin.querySelector("#os-pozza").style.width = 20 + caldo * 180 + "px";
      fin.querySelector("#os-sciolto").textContent = `Sciolto: ${Math.round(caldo * 100)}%`;
      if(caldo >= 1){ suono("sblocco"); cubo.style.borderColor = "transparent"; cubo.style.background = "none"; cubo.style.boxShadow = "none"; setTimeout(mostraCodice, 400); comandi(""); }
    };
    comandi(`<button class="os-btn blu" type="button" id="os-scalda">Scalda con le mani</button><span class="os-nota" id="os-sciolto">Sciolto: 0%</span>`);
    fin.querySelector("#os-scalda").addEventListener("click", () => { suono("bip"); scalda(.2); });
    let ultimo = null;
    cubo.addEventListener("pointerdown", e => { ultimo = [e.clientX, e.clientY]; try { cubo.setPointerCapture(e.pointerId); } catch {} });
    cubo.addEventListener("pointermove", e => { if(!ultimo) return; const d = Math.hypot(e.clientX - ultimo[0], e.clientY - ultimo[1]); ultimo = [e.clientX, e.clientY]; scalda(d / 1500); });
    cubo.addEventListener("pointerup", () => { ultimo = null; });
  }


  /* ---- la torta (Il laboratorio della pasticceria): si taglia a fette, nell'ultima c'è il bigliettino ---- */
  function torta(){
    let tagli = 0;
    const A = [-30, 90, 210];
    const raggio = (a, r) => [130 + r * Math.cos(a * Math.PI / 180), 120 + r * Math.sin(a * Math.PI / 180) * .55];
    const disegna = () => {
      const linee = A.slice(0, tagli).map((a, i) => { const [x, y] = raggio(a, 100); return `<line class="${i === tagli - 1 ? "os-taglio" : ""}" x1="130" y1="120" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#1E2A44" stroke-width="3"/>`; }).join("");
      const [x1, y1] = raggio(-30, 100), [x2, y2] = raggio(90, 100);
      const fetta = tagli >= 2 ? `<g class="os-fetta" id="os-fetta"><path d="M130 120L${x1.toFixed(1)} ${y1.toFixed(1)}A100 55 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}z" fill="#F7C6D0" stroke="#1E2A44" stroke-width="3"/>
        ${tagli >= 3 ? `<rect x="150" y="128" width="78" height="24" rx="3" fill="#FFF8EC" stroke="#1E2A44" stroke-width="1.5" transform="rotate(-8 189 140)"/><text x="189" y="145" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="13" fill="#1E2A44" transform="rotate(-8 189 140)">${codice}</text>` : ""}</g>` : "";
      scena().innerHTML = `<div class="os-torta" id="os-torta" role="img" aria-label="Torta con ${tagli} tagli"><svg viewBox="0 0 260 240">
        <ellipse cx="130" cy="160" rx="100" ry="55" fill="#E0A065" stroke="#1E2A44" stroke-width="4"/><path d="M30 120v40M230 120v40" stroke="#1E2A44" stroke-width="4"/>
        <path d="M30 140q100 40 200 0" fill="none" stroke="#FFF3D6" stroke-width="6"/>
        <ellipse cx="130" cy="120" rx="100" ry="55" fill="#F7C6D0" stroke="#1E2A44" stroke-width="4"/>
        ${[[90, 100], [170, 100], [130, 145], [100, 135], [165, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#E5534B" stroke="#1E2A44" stroke-width="1.5"/>`).join("")}
        ${linee}${fetta}
        <path d="M210 20l-60 60" stroke="#AEB9CA" stroke-width="8" stroke-linecap="round"/><path d="M216 14l-10 10" stroke="#7A5428" stroke-width="10" stroke-linecap="round"/>
      </svg></div>`;
      fin.querySelector("#os-torta").addEventListener("click", taglia);
      if(tagli >= 3){ requestAnimationFrame(() => requestAnimationFrame(() => fin.querySelector("#os-fetta")?.classList.add("fuori"))); setTimeout(mostraCodice, 900); }
    };
    const taglia = () => {
      if(tagli >= 3) return;
      tagli++; suono(tagli === 3 ? "sblocco" : "prendi");
      fin.querySelector("#os-tagli").textContent = `Tagli: ${tagli} su 3`;
      disegna();
      if(tagli === 3) fin.querySelector("#os-coltello")?.remove();
    };
    disegna();
    comandi(`<button class="os-btn blu" type="button" id="os-coltello">Taglia una fetta</button><span class="os-nota" id="os-tagli">Tagli: 0 su 3</span>`);
    fin.querySelector("#os-coltello").addEventListener("click", taglia);
  }

  /* ---- il palloncino (Il luna park dopo la chiusura): si gonfia a ogni tocco e al quinto scoppia, il bigliettino plana giù ---- */
  function palloncino(){
    let soffi = 0;
    const MAX = 5;
    scena().innerHTML = `<div class="os-luna" id="os-luna"><svg viewBox="0 0 260 250" width="260" height="250" role="img" aria-label="Palloncino rosso con un bigliettino dentro">
      <g id="os-pall-g" class="os-pall"><path d="M130 170c-8 18 10 30-2 76" fill="none" stroke="#1E2A44" stroke-width="2.5"/>
        <ellipse cx="130" cy="110" rx="52" ry="60" fill="#E5534B" fill-opacity=".9" stroke="#1E2A44" stroke-width="4"/>
        <path d="M122 170h16l-8-10z" fill="#E5534B" stroke="#1E2A44" stroke-width="3"/>
        <rect x="114" y="104" width="32" height="12" rx="6" fill="#FFF8EC" fill-opacity=".6" stroke="#1E2A44" stroke-width="1.5" transform="rotate(-12 130 110)"/>
        <ellipse cx="108" cy="82" rx="10" ry="18" fill="#fff" opacity=".45"/></g></svg></div>`;
    const g = fin.querySelector("#os-pall-g"), luna = fin.querySelector("#os-luna");
    const soffia = () => {
      if(soffi >= MAX) return;
      soffi++;
      g.style.transform = `scale(${1 + soffi * .09})`;
      fin.querySelector("#os-soffi").textContent = `Gonfiato: ${soffi} su ${MAX}`;
      if(soffi === MAX - 1) g.classList.add("trema");
      if(soffi < MAX){ suono("prendi"); return; }
      suono("sblocco"); comandi("");
      luna.innerHTML = `<div class="os-scoppio">${Array.from({length:14}, (_, i) => { const a = i / 14 * Math.PI * 2, d = 90 + (i % 3) * 25; return `<span class="os-pezzetto" style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px;--g:${i * 50}deg"></span>`; }).join("")}</div><span class="os-scende">${codice}</span>`;
      setTimeout(mostraCodice, 1300);
    };
    g.addEventListener("click", soffia);
    comandi(`<button class="os-btn blu" type="button" id="os-pompa">Gonfia con la pompa</button><span class="os-nota" id="os-soffi">Gonfiato: 0 su ${MAX}</span>`);
    fin.querySelector("#os-pompa").addEventListener("click", soffia);
  }

  /* ---- il cardiofrequenzimetro (Lo studio di medicina dello sport): il pulsante sfoglia le schermate, l'ultima ha il codice ---- */
  function cardio(){
    let pagina = 0;
    const PAGINE = 4;
    const schermo = () => [
      `<text x="130" y="112" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="34" fill="#7CFFA0">10:45</text><text x="130" y="140" text-anchor="middle" font-family="Nunito, sans-serif" font-size="13" fill="#4FBF73">martedì</text>`,
      `<path class="os-cuore" d="M130 120c-18-12-26-22-26-32 0-8 6-14 13-14 6 0 10 4 13 8 3-4 7-8 13-8 7 0 13 6 13 14 0 10-8 20-26 32z" fill="#E5534B"/><text x="130" y="150" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="20" fill="#7CFFA0">72 bpm</text>`,
      `<path d="M98 112h14l6-16 8 30 6-14h30" fill="none" stroke="#7CFFA0" stroke-width="3" stroke-linejoin="round"/><text x="130" y="146" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="16" fill="#7CFFA0">8 421 passi</text>`,
      `<text x="130" y="100" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="12" fill="#4FBF73">CODICE SEGRETO</text><text x="130" y="128" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="21" fill="#FFE066">${codice}</text>`
    ][pagina];
    const disegna = () => {
      scena().innerHTML = `<div class="os-polso"><svg viewBox="0 0 260 250" role="img" aria-label="Cardiofrequenzimetro, schermata ${pagina + 1} di ${PAGINE}">
        <rect x="88" y="0" width="84" height="60" rx="10" fill="#2A2F3A" stroke="#1E2A44" stroke-width="4"/><rect x="88" y="190" width="84" height="60" rx="10" fill="#2A2F3A" stroke="#1E2A44" stroke-width="4"/>
        <rect x="58" y="44" width="144" height="162" rx="36" fill="#3A4560" stroke="#1E2A44" stroke-width="5"/>
        <g class="os-schermo" id="os-schermo"><rect x="74" y="60" width="112" height="130" rx="24" fill="#101826" stroke="#1E2A44" stroke-width="2"/>${schermo()}
          ${Array.from({length: PAGINE}, (_, i) => `<circle cx="${118 + i * 8}" cy="176" r="2.6" fill="${i === pagina ? "#7CFFA0" : "#33415C"}"/>`).join("")}</g>
        <rect class="os-tasto" id="os-tasto" x="200" y="106" width="16" height="36" rx="5" fill="#E5534B" stroke="#1E2A44" stroke-width="3"/>
      </svg></div>`;
      fin.querySelector("#os-tasto").addEventListener("click", premi);
      fin.querySelector("#os-schermo").addEventListener("click", premi);
    };
    const premi = () => {
      if(pagina >= PAGINE - 1) return;
      pagina++; suono(pagina === PAGINE - 1 ? "sblocco" : "bip");
      disegna();
      const t = fin.querySelector("#os-tasto"); t.classList.add("premuto"); setTimeout(() => t.classList.remove("premuto"), 150);
      if(pagina === PAGINE - 1){ comandi(""); setTimeout(mostraCodice, 500); }
    };
    disegna();
    comandi(`<button class="os-btn blu" type="button" id="os-premi">Premi il pulsante</button>`);
    fin.querySelector("#os-premi").addEventListener("click", premi);
  }

  /* ---- il sarcofago (Il deposito del museo): il coperchio scorre di lato, dentro c'è un papiro con il codice ---- */
  function sarcofago(){
    let dx = 0, aperto = false;
    const MAX = 170;
    scena().innerHTML = `<div class="os-cripta" id="os-cripta"><svg viewBox="0 0 280 230" role="img" aria-label="Sarcofago in miniatura con il coperchio chiuso">
      <path d="M60 40h160c14 0 22 10 22 22v110c0 14-10 24-24 24H62c-14 0-24-10-24-24V62c0-12 8-22 22-22z" fill="#8A5A34" stroke="#1E2A44" stroke-width="4"/>
      <path d="M62 56h156c8 0 12 6 12 12v100c0 8-6 14-14 14H64c-8 0-14-6-14-14V68c0-6 4-12 12-12z" fill="#3A2A1A"/>
      <g transform="rotate(-4 140 118)"><rect x="80" y="92" width="120" height="52" rx="4" fill="#F2E1B6" stroke="#1E2A44" stroke-width="2"/><path d="M86 100h108M86 136h108" stroke="#C9A66B" stroke-width="2"/>
        <text x="140" y="125" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="17" fill="#1E2A44">${codice}</text></g>
      <g class="os-coperchio" id="os-coperchio"><path d="M60 40h160c14 0 22 10 22 22v110c0 14-10 24-24 24H62c-14 0-24-10-24-24V62c0-12 8-22 22-22z" fill="#E0B53A" stroke="#1E2A44" stroke-width="4"/>
        <ellipse cx="140" cy="82" rx="26" ry="28" fill="#F2D59A" stroke="#1E2A44" stroke-width="3"/><path d="M114 68h52v10h-52z" fill="#2F6FDE" stroke="#1E2A44" stroke-width="2"/>
        <circle cx="130" cy="84" r="3" fill="#1E2A44"/><circle cx="150" cy="84" r="3" fill="#1E2A44"/>
        <path d="M80 128h120M80 144h120M80 160h120M80 176h120" stroke="#2F6FDE" stroke-width="5"/><path d="M90 128v48M190 128v48" stroke="#C0392B" stroke-width="3"/></g>
    </svg></div>`;
    const cop = fin.querySelector("#os-coperchio"), svg = fin.querySelector("#os-cripta svg");
    const metti = anim => { cop.classList.toggle("scivola", anim); cop.setAttribute("transform", `translate(${dx} ${-dx * .12})`); cop.style.transform = `translate(${dx}px, ${-dx * .12}px)`; };
    const apri = () => { if(aperto) return; aperto = true; dx = MAX; metti(true); suono("cigolio"); comandi(""); setTimeout(mostraCodice, 600); };
    cop.addEventListener("pointerdown", e => {
      if(aperto) return;
      const k = 280 / svg.getBoundingClientRect().width, x0 = e.clientX, d0 = dx;
      try { cop.setPointerCapture(e.pointerId); } catch {}
      const muovi = ev => { dx = Math.max(0, Math.min(MAX, d0 + (ev.clientX - x0) * k)); metti(false); if(dx > MAX * .7) apri(); };
      const fine = () => { window.removeEventListener("pointermove", muovi); window.removeEventListener("pointerup", fine); window.removeEventListener("pointercancel", fine); if(!aperto){ dx = 0; metti(true); } };
      window.addEventListener("pointermove", muovi); window.addEventListener("pointerup", fine); window.addEventListener("pointercancel", fine);
    });
    comandi(`<button class="os-btn blu" type="button" id="os-sposta">Sposta il coperchio</button>`);
    fin.querySelector("#os-sposta").addEventListener("click", apri);
  }

  /* ---- il baccello (La serra dell'orto botanico): si apre in tre tocchi, tra i piselli c'è il bigliettino ---- */
  function baccello(){
    let tocchi = 0;
    const PASSI = 3;
    const disegna = () => {
      const ap = tocchi / PASSI;
      scena().innerHTML = `<div class="os-orto"><svg viewBox="0 0 280 220" role="img" aria-label="Baccello di pisello ${tocchi >= PASSI ? "aperto" : "chiuso"}" id="os-pod">
        <path d="M244 92c10-16 22-20 26-34" fill="none" stroke="#5A8A2A" stroke-width="5" stroke-linecap="round"/>
        <path class="os-valva" style="transform:rotate(${ap * 16}deg) translateY(${ap * 28}px)" d="M24 120C60 150 200 150 248 96C200 128 64 132 24 120z" fill="#7CB342" stroke="#1E2A44" stroke-width="4" stroke-linejoin="round"/>
        ${[60, 96, 132, 168, 204].map((x, i) => `<circle class="os-pisello" cx="${x}" cy="${112 - Math.sin((x - 24) / 224 * Math.PI) * 10}" r="16" fill="#8BC34A" stroke="#1E2A44" stroke-width="3" style="transform:translateY(${tocchi >= PASSI ? (i % 2 ? -6 : 6) : 0}px)"/>`).join("")}
        ${tocchi >= PASSI ? `<g transform="rotate(-6 140 84)"><rect x="92" y="70" width="96" height="28" rx="4" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/><text x="140" y="90" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="16" fill="#1E2A44">${codice}</text></g>` : ""}
        <path class="os-valva" style="transform:rotate(${-ap * 22}deg) translateY(${-ap * 40}px)" d="M24 120C40 70 190 44 248 96C190 66 60 86 24 120z" fill="#9CCC65" stroke="#1E2A44" stroke-width="4" stroke-linejoin="round"/>
      </svg></div>`;
      fin.querySelector("#os-pod").addEventListener("click", apri);
    };
    const apri = () => {
      if(tocchi >= PASSI) return;
      tocchi++; suono(tocchi === PASSI ? "sblocco" : "prendi");
      fin.querySelector("#os-aperto").textContent = `Aperto: ${tocchi} su ${PASSI}`;
      disegna();
      if(tocchi === PASSI){ fin.querySelector("#os-apri-b")?.remove(); setTimeout(mostraCodice, 700); }
    };
    disegna();
    comandi(`<button class="os-btn blu" type="button" id="os-apri-b">Apri il baccello</button><span class="os-nota" id="os-aperto">Aperto: 0 su ${PASSI}</span>`);
    fin.querySelector("#os-apri-b").addEventListener("click", apri);
  }

  /* ---- il carillon (La mostra «Come siamo nati»): ogni giro di manovella suona una frase, al quarto il coperchio si apre ---- */
  function carillon(){
    let giri = 0;
    const GIRI = 4, FRASI = ["bip", "prendi", "bip", "sblocco"];
    const disegna = () => {
      const aperto = giri >= GIRI;
      scena().innerHTML = `<div class="os-musica"><svg viewBox="0 0 280 230" role="img" aria-label="Carillon ${aperto ? "aperto" : "chiuso"}">
        <rect x="40" y="100" width="200" height="100" rx="10" fill="#C9935A" stroke="#1E2A44" stroke-width="4"/>
        <rect x="56" y="114" width="168" height="72" rx="6" fill="#8A5A34"/>
        ${aperto ? `<g transform="rotate(-4 140 140)"><rect x="84" y="124" width="112" height="30" rx="4" fill="#FFF8EC" stroke="#1E2A44" stroke-width="2"/><text x="140" y="145" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="17" fill="#1E2A44">${codice}</text></g>
          <path d="M140 186v-24" stroke="#AEB9CA" stroke-width="4"/><circle cx="140" cy="160" r="8" fill="#FFC7E0" stroke="#1E2A44" stroke-width="2"/>` : ""}
        <g class="os-coperchio-c" style="transform:rotate(${aperto ? -28 : 0}deg)"><path d="M40 100l14-34h172l14 34z" fill="#E0B07A" stroke="#1E2A44" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="140" cy="84" r="10" fill="#FFC7E0" stroke="#1E2A44" stroke-width="2.5"/></g>
        <g class="os-manovella" id="os-manovella" style="transform:rotate(${giri * 90}deg)"><rect x="234" y="112" width="44" height="48" fill="transparent"/><path d="M240 150h22v-22" fill="none" stroke="#1E2A44" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="262" cy="126" r="7" fill="#E5534B" stroke="#1E2A44" stroke-width="2.5"/></g>
        ${giri > 0 && !aperto ? `<text class="os-nota-m" x="200" y="90" font-size="26" fill="#7A8CE0">♪</text>` : ""}
      </svg></div>`;
      fin.querySelector("#os-manovella").addEventListener("click", gira);
    };
    const gira = () => {
      if(giri >= GIRI) return;
      giri++; suono(FRASI[giri - 1]);
      fin.querySelector("#os-giri").textContent = `Giri: ${giri} su ${GIRI}`;
      disegna();
      if(giri === GIRI){ fin.querySelector("#os-gira")?.remove(); setTimeout(mostraCodice, 900); }
    };
    disegna();
    comandi(`<button class="os-btn blu" type="button" id="os-gira">Gira la manovella</button><span class="os-nota" id="os-giri">Giri: 0 su ${GIRI}</span>`);
    fin.querySelector("#os-gira").addEventListener("click", gira);
  }

  return {bottone, apri};
})();
