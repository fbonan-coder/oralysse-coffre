/* Démarrage : connexion sans mot de passe, chargement du dossier, enregistrement automatique. */
import { createCloud } from './cloud.js';
import { startApp } from './app.js';

const cloud = createCloud();
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Petit stockage local : brouillon avant la création du compte, copie de secours, dernière adresse. */
const LS = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const DEMO_KEY = 'oralysse-demo-v4', DRAFT_KEY = 'oralysse-brouillon', EMAIL_KEY = 'oralysse-email';
const cacheKey = id => 'oralysse-copie-' + id;
const validEmail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

const env = { cloud: false, email: '', initial: null, auth: null };
let me = null, app = null;

/* ---------- Enregistrement : regroupé, réessayé, avec une copie locale tant que ce n'est pas parti ---------- */
let pending = null, timer = 0, busy = false, fails = 0;
function status(text, kind) {
  const el = $('#save-state'); if (!el) return;
  el.textContent = text; el.dataset.kind = kind || '';
}
function persist(state) {
  if (!env.cloud) { LS.set(cloud ? DRAFT_KEY : DEMO_KEY, state); return; }
  pending = state;
  LS.set(cacheKey(me.id), { state, dirty: true });
  status('Enregistrement…', 'busy');
  clearTimeout(timer); timer = setTimeout(flush, 700);
}
async function flush() {
  if (busy || !pending || !env.cloud) return;
  busy = true; clearTimeout(timer);
  const snap = JSON.parse(JSON.stringify(pending)); pending = null;
  try {
    await cloud.saveDossier(snap);
    fails = 0;
    if (!pending) LS.set(cacheKey(me.id), { state: snap, dirty: false });
    status('Enregistré à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + '.', 'ok');
  } catch (e) {
    pending = pending || snap; fails++;
    status(e.code === 'signed_out' ? 'Session expirée : reconnectez-vous pour enregistrer.' : 'Pas de connexion : vos réponses sont gardées sur cet appareil, nouvel essai dans un instant.', 'err');
    timer = setTimeout(flush, Math.min(30000, 2000 * 2 ** fails));
  }
  busy = false;
  if (pending && !fails) timer = setTimeout(flush, 300);
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
addEventListener('pagehide', flush);
addEventListener('online', flush);

/* Fichiers : copiés dans le bucket privé ; l'app les garde aussi sur l'appareil. */
const media = {
  async put(key, blob) {
    if (!env.cloud) return;
    for (let i = 0; i < 3; i++) {
      try { await cloud.putFile(key, blob); return; } catch (e) { await new Promise(r => setTimeout(r, 3000 * (i + 1))); }
    }
    console.warn('Fichier non envoyé', key);
  },
  get: key => (env.cloud ? cloud.getFile(key) : Promise.resolve(null))
};

/* ---------- Le menu du compte ---------- */
function accountMenu() {
  const p = $('#user-menu > p');
  /* L'exemple de Claire écraserait un vrai dossier : il ne reste qu'en mode démo. */
  $('#reset-btn').hidden = !!cloud;
  $('#lock-btn').hidden = !!cloud && !env.cloud;
  if (!env.cloud) {
    p.textContent = cloud ? 'Votre coffre n’est pas encore enregistré : créez votre compte pour le garder.' : 'Compte de démonstration. Les données restent dans ce navigateur.';
    return;
  }
  p.innerHTML = `Connecté avec <b>${esc(env.email)}</b>.<br><span id="save-state">Vos réponses sont enregistrées.</span>`;
  $('#newuser-btn').hidden = true; $('#reset-btn').hidden = true;
  $('#lock-btn').lastChild.textContent = 'Me déconnecter';
}

async function signOut() {
  await flush();
  if (pending) { status('Pas encore enregistré : réessayez dans un instant.', 'err'); return; }
  LS.del(cacheKey(me.id));
  await cloud.signOut();
  location.hash = '';
  location.reload();
}

/* Création du compte depuis l'app (fin du paramétrage) : envoyer puis vérifier le code. */
const auth = {
  send: (email, opts) => { LS.set(EMAIL_KEY, email); return cloud.sendCode(email, Object.assign({ create: true }, opts)); },
  async verify(email, code) {
    const u = await cloud.verifyCode(email, code);
    return adopt(u);
  }
};
/* Un utilisateur vient de se connecter alors que l'app tourne avec un brouillon. */
async function adopt(u) {
  me = u;
  const row = await cloud.loadDossier();
  if (row) { setTimeout(() => location.reload(), 1600); return { existing: true }; }
  env.cloud = true; env.email = u.email;
  LS.del(DRAFT_KEY);
  accountMenu();
  return { existing: false };
}

/* L'app lit env en direct : après la création du compte, env.cloud passe à true et l'enregistrement part en ligne. */
function launch() {
  Object.assign(env, { persist, media, signOut });
  if (env.cloud) env.auth = null;
  app = startApp(env);
  accountMenu();
}

/* ---------- L'écran d'accueil : créer un dossier ou se connecter ---------- */
const gate = {
  el: () => $('#gate'),
  show(mode, opts = {}) {
    const g = $('#gate'), f = $('#gate-fields'), t = $('#gate-title'), p = $('#gate-text'), n = $('#gate-note');
    g.hidden = false; g.dataset.mode = mode; n.textContent = opts.note || '';
    const email = opts.email || LS.get(EMAIL_KEY) || '';
    if (mode === 'choose') {
      t.textContent = 'Bienvenue sur Oralysse';
      p.textContent = 'Le coffre où vous rassemblez ce que vos proches auront besoin de savoir.';
      f.innerHTML = `<button type="button" class="btn plain" data-gate="create">Créer mon dossier</button><button type="button" class="gate-alt" data-gate="login">J’ai déjà un dossier</button>`;
      n.textContent = 'Pas de mot de passe : vous recevez un code par e-mail à chaque connexion.';
    } else if (mode === 'login') {
      t.textContent = 'Retrouver mon dossier';
      p.textContent = 'Indiquez l’adresse e-mail de votre compte : nous vous envoyons un code pour vous connecter.';
      f.innerHTML = `<label for="gate-email" class="sr">Adresse e-mail</label><input id="gate-email" class="wide" type="email" autocomplete="email" placeholder="vous@exemple.fr" value="${esc(email)}" required><button type="submit" class="btn plain">Recevoir mon code</button><button type="button" class="gate-alt" data-gate="choose">Retour</button>`;
      setTimeout(() => $('#gate-email').focus(), 50);
    } else if (mode === 'code') {
      t.textContent = 'Vérifiez vos e-mails';
      p.textContent = `Nous avons envoyé un code à 6 chiffres à ${email}. Saisissez-le ici, ou cliquez sur le lien du mail.`;
      f.innerHTML = `<label for="gate-code" class="sr">Code à 6 chiffres</label><input id="gate-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" required><button type="submit" class="btn plain">Ouvrir mon coffre</button><button type="button" class="gate-alt" data-gate="resend">Renvoyer le code</button><button type="button" class="gate-alt" data-gate="login">Changer d’adresse</button>`;
      g.dataset.email = email;
      setTimeout(() => $('#gate-code').focus(), 50);
    } else if (mode === 'wait') {
      t.textContent = 'Votre coffre s’ouvre…';
      p.textContent = opts.text || 'Un instant.';
      f.innerHTML = '';
    } else if (mode === 'error') {
      t.textContent = 'Impossible d’ouvrir votre coffre';
      p.textContent = opts.text || 'Vérifiez votre connexion à Internet, puis réessayez.';
      f.innerHTML = `<button type="button" class="btn plain" data-gate="retry">Réessayer</button>`;
    }
  },
  hide() { $('#gate').hidden = true; }
};

/* La page d'accueil : « Commencer » (ou reprendre un brouillon) et « Ouvrir mon coffre ». */
const home = {
  show() {
    gate.hide();
    const draft = LS.get(cloud ? DRAFT_KEY : DEMO_KEY);
    $('#home-create').textContent = draft ? 'Reprendre mon dossier' : 'Commencer';
    if (!cloud) $('#home-note').textContent = 'Version de démonstration : ce que vous saisissez reste dans ce navigateur.';
    $('#home').hidden = false;
    document.title = 'Oralysse · Mon coffre';
  },
  hide() { $('#home').hidden = true; }
};
function wireHome() {
  $('#home').addEventListener('click', e => {
    const b = e.target.closest('[data-home]'); if (!b) return;
    if (b.dataset.home === 'create') {
      home.hide();
      env.initial = LS.get(cloud ? DRAFT_KEY : DEMO_KEY);
      launch(); window.scrollTo(0, 0);
    } else if (cloud) gate.show('login');
    else { home.hide(); env.initial = LS.get(DEMO_KEY); launch(); }
  });
}
const say = e => ({
  no_account: 'Aucun dossier n’est ouvert avec cette adresse. Vérifiez-la, ou créez votre dossier.',
  rate: 'Trop de codes demandés d’un coup. Attendez une minute, puis réessayez.',
  bad_code: 'Ce code n’est pas bon, ou il a expiré. Vérifiez-le, ou demandez-en un nouveau.',
  network: 'Pas de connexion à Internet. Réessayez dans un instant.'
}[e && e.code] || 'Une erreur est survenue. Réessayez dans un instant.');

let sending = false;
async function sendLogin(email) {
  if (sending) return; sending = true;
  try { await cloud.sendCode(email, { create: false }); LS.set(EMAIL_KEY, email); gate.show('code', { email }); }
  catch (e) { gate.show('login', { email, note: say(e) }); if (e.code === 'no_account') $('#gate-fields').insertAdjacentHTML('beforeend', '<button type="button" class="gate-alt" data-gate="create">Créer mon dossier</button>'); }
  sending = false;
}
function wireGate() {
  $('#gate').addEventListener('click', e => {
    const b = e.target.closest('[data-gate]'); if (!b) return;
    const a = b.dataset.gate;
    if (a === 'create') { gate.hide(); home.hide(); env.initial = LS.get(DRAFT_KEY); launch(); }
    else if (a === 'choose') home.show();
    else if (a === 'login') gate.show(a);
    else if (a === 'resend') sendLogin($('#gate').dataset.email).then(() => { $('#gate-note').textContent = 'Un nouveau code vient de partir.'; });
    else if (a === 'retry') location.reload();
  });
  $('#gate-form').addEventListener('submit', async e => {
    e.preventDefault();
    const mode = $('#gate').dataset.mode;
    if (mode === 'login') {
      const email = $('#gate-email').value.trim();
      if (!validEmail(email)) { $('#gate-note').textContent = 'Indiquez une adresse e-mail valide.'; return; }
      sendLogin(email);
    } else if (mode === 'code') {
      const code = $('#gate-code').value.replace(/\D/g, '');
      if (code.length !== 6) { $('#gate-note').textContent = 'Saisissez les 6 chiffres du code.'; return; }
      const email = $('#gate').dataset.email;
      gate.show('wait', { text: 'Vérification du code…' });
      try { await openDossier(await cloud.verifyCode(email, code)); }
      catch (x) { gate.show('code', { email, note: say(x) }); }
    }
  });
}

/* Ouvre le dossier d'un utilisateur connecté : la base, ou la copie locale si elle n'était pas encore partie. */
async function openDossier(u) {
  me = u; env.cloud = true; env.email = u.email; LS.set(EMAIL_KEY, u.email);
  gate.show('wait', { text: 'Chargement de votre dossier…' });
  let row;
  try { row = await cloud.loadDossier(); }
  catch (e) { gate.show('error', { text: say(e) }); return; }
  const copy = LS.get(cacheKey(u.id)), draft = LS.get(DRAFT_KEY);
  let initial = row && row.state && Object.keys(row.state).length ? row.state : null, push = false;
  if (copy && copy.dirty && copy.state) { initial = copy.state; push = true; }
  if (!initial && draft) { initial = draft; push = true; }
  LS.del(DRAFT_KEY);
  env.initial = initial;
  gate.hide(); home.hide();
  launch();
  if (push || !row) persist(app.state());
}

async function boot() {
  wireGate(); wireHome();
  if (!cloud) { home.show(); return; }
  env.auth = auth;
  gate.show('wait', { text: 'Un instant.' });
  let u = null;
  try { u = await cloud.getUser(); } catch (e) { u = null; }
  /* Le lien du mail revient avec ?code=… : on le retire de l'adresse une fois la session ouverte. */
  if (/[?&]code=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);
  if (u) { openDossier(u); return; }
  home.show();
  /* Lien du mail ouvert dans un autre onglet : la session arrive ici aussi. */
  cloud.onSignedIn(nu => { if (!$('#gate').hidden && $('#gate').dataset.mode === 'code') openDossier(nu); });
}
boot();
