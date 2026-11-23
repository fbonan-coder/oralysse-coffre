// Regénère index.html et src/app.js à partir de la démo (app/index.html).
// Usage : node tools/export-from-demo.cjs ../app/index.html
// Les fichiers src/main.js, src/cloud.js et supabase/ ne sont pas touchés.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, '..', 'app', 'index.html'), 'utf8');

const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('introuvable : ' + a); return [s.slice(0, i), s.slice(i + a.length, j), s.slice(j + b.length)]; };

// 1. La page : en-tête, styles, balisage.
const [headPart, , ] = cut(src, '<style>', '</style>');
const style = cut(src, '<style>', '</style>')[1].replace(/url\("([a-z]+\.(?:webp|jpg))"\)/g, 'url("/$1")');
const afterStyle = src.slice(src.indexOf('</style>') + 8);
const markup = afterStyle.slice(0, afterStyle.indexOf('<script>\n(function () {'));
const script = afterStyle.slice(afterStyle.indexOf('<script>\n(function () {') + 9, afterStyle.lastIndexOf('</script>'));
const links = headPart.split('\n').filter(l => /^<link /.test(l)).join('\n');

const RESET = `:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
img { max-width: 100%; }
[hidden] { display: none !important; }`;
const GATE_CSS = `
/* Accueil : créer un dossier ou se connecter (sans mot de passe). */
#gate { z-index: 40; }
#gate .lockform { flex-direction: column; align-items: center; gap: 12px; }
#gate .lockform input.wide { width: min(340px, 100%); }
.gate-alt { padding: 6px 10px; border: 0; background: none; color: var(--on-night-2); font: inherit; font-size: 15px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.gate-alt:hover, .gate-alt:focus-visible { color: var(--on-night); }
#gate small { min-height: 1.4em; max-width: 420px; }
#save-state { display: inline-block; margin-top: 4px; }
#save-state[data-kind="err"] { color: var(--accent); font-weight: 600; }

/* Page d'accueil : commencer, ou ouvrir son coffre. */
#home { position: fixed; inset: 0; z-index: 35; overflow-y: auto; display: flex; flex-direction: column; background: var(--bg); color: var(--fg); }
.home-top, .home-main, .home-points, .home-foot { padding-left: max(var(--gut), env(safe-area-inset-left, 0px)); padding-right: max(var(--gut), env(safe-area-inset-right, 0px)); }
.home-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-block: calc(14px + env(safe-area-inset-top, 0px)) 14px; border-bottom: 1px solid var(--line); }
.home-logo { font-family: var(--logo); font-weight: 500; font-size: 32px; line-height: 1.1; letter-spacing: -.015em; }
.home-help { font-size: 14px; color: var(--muted); text-align: right; }
.home-help b { color: var(--fg); font-weight: 500; white-space: nowrap; font-variant-numeric: lining-nums tabular-nums; }
.home-main { flex: 1 0 auto; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); align-items: center; gap: clamp(32px, 6vw, 96px); padding-block: clamp(40px, 7vw, 96px); }
.home-text { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
.home-text .eyebrow { color: var(--accent); }
.home-text h1 { margin: 18px 0 0; font-family: var(--display); font-size: clamp(44px, 6vw, 84px); line-height: .98; text-wrap: balance; }
.home-text h1 em { color: var(--accent); }
.home-lead { margin: 26px 0 0; max-width: 44ch; font-size: 18px; line-height: 1.55; color: var(--muted); }
.home-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
.home-actions .btn { min-height: 56px; padding: 0 30px; font-size: 15.5px; }
.home-actions .btn svg { width: 18px; height: 18px; }
.home-note { margin: 16px 0 0; font-size: 14px; color: var(--muted); max-width: 46ch; }
.home-photo { position: relative; justify-self: end; width: auto; max-width: 100%; height: clamp(440px, calc(100svh - 190px), 760px); aspect-ratio: 736 / 981; background: url("/colline.jpg") 50% 70% / cover no-repeat, #0E3A78; }
.home-photo::after { content: ""; position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(20, 19, 15, .06); }
.home-points { list-style: none; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); }
.home-points li { padding: 28px 28px 32px 0; display: flex; flex-direction: column; gap: 8px; }
.home-points li + li { padding-left: 28px; border-left: 1px solid var(--line); }
.home-points .n { font-family: var(--display); font-size: 15px; color: var(--accent); font-variant-numeric: lining-nums; }
.home-points b { font-family: var(--display); font-weight: 400; font-size: 23px; line-height: 1.15; }
.home-points span { font-size: 14.5px; color: var(--muted); max-width: 36ch; }
.home-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding-block: 18px calc(18px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); }
.home-foot em { font-family: var(--display); font-size: 15px; color: var(--fg); }
@media (max-width: 860px) {
  .home-main { grid-template-columns: minmax(0, 1fr); padding-block: 0 40px; gap: 28px; }
  .home-photo { order: -1; justify-self: stretch; aspect-ratio: auto; max-width: none; height: 38vh; background-position: 50% 74%; margin-inline: calc(-1 * max(var(--gut), env(safe-area-inset-left, 0px))) calc(-1 * max(var(--gut), env(safe-area-inset-right, 0px))); }
  .home-points { grid-template-columns: minmax(0, 1fr); }
  .home-points li, .home-points li + li { padding: 20px 0; border-left: 0; }
  .home-points li + li { border-top: 1px solid var(--line); }
}
@media (max-width: 480px) {
  .home-logo { font-size: 26px; }
  .home-help span { display: none; }
  .home-actions { width: 100%; }
  .home-actions .btn { flex: 1 1 100%; justify-content: center; }
}
`;
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const HOME = `<section id="home" hidden aria-labelledby="home-title">
  <header class="home-top">
    <span class="home-logo">ORALYSSE</span>
    <p class="home-help"><span>Une question ? </span><b>01 45 22 72 19</b></p>
  </header>
  <div class="home-main">
    <div class="home-text">
      <p class="eyebrow">Votre coffre</p>
      <h1 id="home-title">Ce que vos proches auront besoin de <em>savoir.</em></h1>
      <p class="home-lead">Vos papiers, vos comptes, vos volontés et vos mots, rassemblés à votre rythme. Vous décidez qui recevra quoi, et quand.</p>
      <div class="home-actions">
        <button type="button" class="btn" data-home="create"><span id="home-create">Commencer</span>${ARROW}</button>
        <button type="button" class="btn line" data-home="login">Ouvrir mon coffre</button>
      </div>
      <p class="home-note" id="home-note">Pas de mot de passe : à chaque connexion, un code vous est envoyé par e-mail.</p>
    </div>
    <div class="home-photo" role="img" aria-label="Une femme en robe rouge marche dans une prairie, sous un grand nuage blanc"></div>
  </div>
  <ol class="home-points">
    <li><span class="n">01</span><b>Quelques minutes pour commencer</b><span>Quatre questions, puis votre coffre se remplit au fil de vos visites.</span></li>
    <li><span class="n">02</span><b>Enregistré au fur et à mesure</b><span>Chaque modification est gardée. Vous reprenez là où vous en étiez.</span></li>
    <li><span class="n">03</span><b>Vous choisissez qui reçoit quoi</b><span>Une personne de confiance par sujet, et un message pour chacun.</span></li>
  </ol>
  <footer class="home-foot"><em>Ce que vos proches auront besoin de savoir.</em><span>Oralysse · Mon coffre</span></footer>
</section>
`;
const LOCK_SVG = '<svg class="biglock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/><path d="M12 15v2"/></svg>';
const GATE = `<div class="vault-overlay" id="gate" hidden role="dialog" aria-modal="true" aria-labelledby="gate-title">
  <form class="inner" id="gate-form" novalidate>
    ${LOCK_SVG}
    <h2 id="gate-title">Oralysse</h2>
    <p id="gate-text"></p>
    <div class="lockform" id="gate-fields"></div>
    <small id="gate-note" role="status"></small>
  </form>
</div>
`;
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Oralysse · Mon coffre</title>
<meta name="description" content="Le coffre où vous rassemblez ce que vos proches auront besoin de savoir.">
${links}
<style>
${RESET}
</style>
<style>${style}${GATE_CSS}</style>
</head>
<body>
${markup.trim()}
${HOME}${GATE}
<script type="module" src="/src/main.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');

// 2. Le code de l'app : un module qui reçoit son environnement (enregistrement, fichiers, compte).
let s = script;
const once = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(n + ' × « ' + a.slice(0, 80) + ' »'); s = s.replace(a, () => b); };
const last = s.lastIndexOf('})();');
s = s.slice(0, last) + '  return { state: () => state };\n}\n';
once('(function () {\n', `/* Le coffre Oralysse. main.js fournit env : état initial, enregistrement, fichiers, compte. */
export function startApp(env) {
`);
once('try { state = JSON.parse(localStorage.getItem(KEY)) || NEW(); } catch (e) { state = NEW(); }', 'state = env.initial || NEW();');
once("  if (state.onboarded !== false && !state.account) state.account = { email: 'vous@exemple.fr', mfa: 'app' };\n  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };",
  `  if (env.cloud) state.account = Object.assign({}, state.account, { email: env.email, mfa: 'email' });
  if (!env.auth && state.onboarded !== false && !state.account) state.account = { email: 'vous@exemple.fr', mfa: 'app' };
  const save = () => env.persist(state);`);

// Fichiers : aussi copiés dans le stockage du compte, et rechargés de là sur un autre appareil.
once("  async function mediaPut(k, blob) { MEDIA[k] = blob; try { (await idb()).transaction('m', 'readwrite').objectStore('m').put(blob, k); } catch (e) {} }",
  "  async function mediaPut(k, blob) { MEDIA[k] = blob; try { (await idb()).transaction('m', 'readwrite').objectStore('m').put(blob, k); } catch (e) {} if (env.media) env.media.put(k, blob); }");
{
  const a = s.indexOf('  async function mediaGet(k) {'), b = s.indexOf('  const urlOf = b =>');
  s = s.slice(0, a) + `  async function mediaGet(k) {
    if (MEDIA[k]) return MEDIA[k];
    let b = null;
    try { const db = await idb(); b = await new Promise(res => { const r = db.transaction('m').objectStore('m').get(k); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); }); }
    catch (e) { b = null; }
    if (!b && env.media) { b = await env.media.get(k); if (b) { try { (await idb()).transaction('m', 'readwrite').objectStore('m').put(b, k); } catch (e) {} } }
    return b ? (MEDIA[k] = b) : null;
  }
` + s.slice(b);
}

// Création du compte : adresse e-mail puis code reçu, sans mot de passe (quand le backend est branché).
once('    }[n];\n    const hero = `<section class="hero ob-hero" aria-labelledby="su-title">', `    }[n];
    const SU_N = env.auth ? 2 : 4;
    if (env.auth) T.splice(0, 4, ...{
      1: ['Créez votre compte', 'pour garder votre coffre.', 'Pas de mot de passe à retenir : à chaque connexion, nous vous envoyons un code par e-mail.',
          'Votre adresse e-mail sert de clé : seule une personne qui lit vos e-mails peut ouvrir votre coffre. Choisissez une adresse que vous garderez longtemps, et protégez-la bien.'],
      2: ['Vérifiez', 'votre adresse e-mail.', \`Nous avons envoyé un code à 6 chiffres à \${esc(su.email || 'votre adresse')}. Vous pouvez aussi cliquer sur le lien du mail.\`,
          'Cette adresse servira à vous connecter, à vous prévenir de toute connexion, et à vos personnes de confiance pour vous joindre.']
    }[n]);
    const hero = \`<section class="hero ob-hero" aria-labelledby="su-title">`);
s = s.replace('<p class="eyebrow">Votre compte · Étape ${n} sur 4</p>', '<p class="eyebrow">Votre compte · Étape ${n} sur ${SU_N}</p>');
once('role="img" aria-label="Étape ${n} sur 4">${[1, 2, 3, 4].map(', 'role="img" aria-label="Étape ${n} sur ${SU_N}">${[1, 2, 3, 4].slice(0, SU_N).map(');
once('    if (n === 1) main = `<div class="card panel" style="display:flex;flex-direction:column;gap:16px">\n        <div class="field"><label for="su-email">',
  `    if (n === 1 && env.auth) main = \`<div class="card panel" style="display:flex;flex-direction:column;gap:16px">
        <div class="field"><label for="su-email">Adresse e-mail</label><input id="su-email" type="email" autocomplete="email" placeholder="vous@exemple.fr" value="\${esc(su.email || '')}"></div>
        <p class="muted-p">\${ico('shield')}Aucun mot de passe : un code vous sera envoyé par e-mail à chaque connexion.</p>
      </div>
      <div class="wizard-nav">\${back}\${go('Recevoir mon code')}</div>\`;
    else if (n === 1) main = \`<div class="card panel" style="display:flex;flex-direction:column;gap:16px">
        <div class="field"><label for="su-email">`);
once('    else if (n === 2) main = `', `    else if (n === 2 && env.auth) main = \`<div class="card panel ob-fields">
        <div class="field"><label for="su-code">Code reçu par e-mail</label><input id="su-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div>
        <p class="muted-p" style="align-self:end">Rien reçu ? Regardez dans les courriers indésirables, ou demandez un nouveau code.</p>
      </div>
      <div class="wizard-nav">\${back}<span style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><button type="button" class="ghost" data-su="resend">Renvoyer le code</button>\${go('Ouvrir mon coffre')}</span></div>\`;
    else if (n === 2) main = \``);
once("  function suAction(a) {\n    const su = state.signup, val = id => (($('#' + id) || {}).value || '').trim();\n",
  `  let suBusy = false;
  async function suAuth(a, su, val) {
    if (suBusy) return;
    suBusy = true;
    const btn = $('[data-su="next"]'); if (btn) btn.disabled = true;
    try {
      if (a === 'resend') { await env.auth.send(su.email, { name: (state.wizard.name || '').trim() }); toast('Un nouveau code vient de partir.'); }
      else if (su.step === 1) {
        const email = val('su-email');
        if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) { toast('Indiquez une adresse e-mail valide.'); return; }
        await env.auth.send(email, { name: (state.wizard.name || '').trim() });
        su.email = email; su.step = 2; save(); render(); window.scrollTo(0, 0);
      } else {
        const code = val('su-code').replace(/\\D/g, '');
        if (code.length !== 6) { toast('Saisissez le code à 6 chiffres.'); return; }
        const r = await env.auth.verify(su.email, code);
        if (r.existing) { toast('Vous aviez déjà un dossier avec cette adresse : nous l’ouvrons.'); return; }
        state.account = { email: su.email, mfa: 'email' };
        state.signup = null; save(); finishWiz('new');
      }
    } catch (e) {
      toast({ rate: 'Trop de codes demandés d’un coup. Attendez une minute, puis réessayez.', bad_code: 'Ce code n’est pas bon, ou il a expiré. Vérifiez-le, ou demandez-en un nouveau.', network: 'Pas de connexion à Internet. Réessayez dans un instant.' }[e && e.code] || 'Une erreur est survenue. Réessayez dans un instant.');
    } finally {
      suBusy = false;
      const b = $('[data-su="next"]'); if (b) b.disabled = false;
    }
  }
  function suAction(a) {
    const su = state.signup, val = id => (($('#' + id) || {}).value || '').trim();
    if (env.auth && (a === 'resend' || (a === 'next' && su.step <= 2))) { suAuth(a, su, val); return; }
`);

// Menu du compte : déconnexion réelle quand le compte est enregistré.
once("  $('#lock-btn').addEventListener('click', () => { um.hidden = true; ub.setAttribute('aria-expanded', 'false'); lockscreen.hidden = false; lockStep(1); });",
  "  $('#lock-btn').addEventListener('click', () => { um.hidden = true; ub.setAttribute('aria-expanded', 'false'); if (env.cloud) { env.signOut(); return; } lockscreen.hidden = false; lockStep(1); });");

fs.writeFileSync(path.join(root, 'src', 'app.js'), s.replace(/^\n+/, ''), 'utf8');
console.log('index.html et src/app.js regénérés.');
