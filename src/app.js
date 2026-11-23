/* Le coffre Oralysse. main.js fournit env : état initial, enregistrement, fichiers, compte. */
export function startApp(env) {
  const KEY = 'oralysse-demo-v4';
  const META = {
    volontes: { title: 'Volontés', desc: 'Vos souhaits généraux, funérailles et animaux de compagnie.', icon: 'doc', add: 'Ajouter une volonté' },
    messages: { title: 'Messages', desc: 'Lettres et messages pour vos proches.', icon: 'chat', add: 'Écrire un nouveau message' },
    acces: { title: 'Accès numériques', desc: 'Comptes avec consignes de récupération.', icon: 'laptop', add: 'Ajouter un compte' },
    documents: { title: 'Documents', desc: 'Livret de famille, contrats, titres importants.', icon: 'doc', add: 'Ajouter un document', file: true }
  };
  const item = label => ({ id: uid(), label, done: false, text: '', fileName: '' });
  /* Nouvel utilisateur : le coffre est construit à partir du paramétrage. */
  const NEW = () => ({
    user: { name: '', full: '' }, built: false, onboarded: false,
    sections: [], people: [], testament: 'none', open: [], ess: {}, essOpen: ['urgence'],
    account: null, signup: null, mail: null, essProp: {},
    wizard: { step: 0, name: 'Claire', who: ['enfants', 'conjoint'], doneWho: [], person: { name: 'Thomas', relation: 'Fils' }, priorities: ['volontes', 'messages'] }
  });
  /* Ce que chaque réponse « Pour qui » ajoute au coffre. */
  const WHO_MSG = { conjoint: 'Pour mon conjoint ou ma conjointe', enfants: 'Pour mes enfants', parents: 'Pour mes parents', amis: 'Pour un ou une ami·e proche' };
  const WHO_VOL = { animaux: 'Animaux de compagnie', asso: 'Dons et engagements' };
  function buildSections(w) {
    const vol = ['Souhaits généraux', 'Obsèques'].concat(w.who.filter(id => WHO_VOL[id]).map(id => WHO_VOL[id]));
    const msgs = w.who.filter(id => WHO_MSG[id]).map(id => WHO_MSG[id]);
    if (!msgs.length) msgs.push('Pour un proche');
    const lists = { volontes: vol, messages: msgs, acces: ['Messagerie e-mail', 'Photos en ligne', 'Réseaux sociaux'], documents: ['Livret de famille', 'Contrats d’assurance'] };
    return Object.keys(META).map(id => Object.assign({ id }, META[id], { items: lists[id].map(item) }));
  }
  /* Exemple avancé : le coffre de Claire, à 60 %. */
  /* Messages audio et vidéo de l’exemple : aucun fichier réel, lecture simulée. */
  const MEDIA_SEED = () => [
    { id: 'm5', label: 'Pour Sophie, en vidéo', done: true, to: 'p2', when: 'now', kind: 'video',
      media: { kind: 'video', name: 'Vidéo enregistrée', dur: 94, demo: true },
      text: 'Filmée sur notre banc préféré, face à la mer.' },
    { id: 'm6', label: 'Ma voix, pour Thomas', done: true, to: 'p1', when: 'now', kind: 'audio',
      media: { kind: 'audio', name: 'Enregistrement audio', dur: 48, demo: true },
      text: '', music: { title: 'La Mer', artist: 'Charles Trenet', when: 'during', fileName: '' } }
  ];
  const SEED = () => ({
    user: { name: 'Claire', full: 'Claire M.' }, built: true,
    sections: [
      { id: 'volontes', title: 'Volontés', desc: 'Vos souhaits généraux, funérailles et animaux de compagnie.', icon: 'doc', add: null, items: [
        { id: 'v1', label: 'Souhaits généraux', done: true, to: 'all', text: 'rédigé', fields: {
          proches: 'Que vous restiez unis, et que vous preniez le temps de vous retrouver autour d’un bon repas.',
          souvenir: 'Comme quelqu’un qui aimait rire, recevoir et marcher au bord de la mer.' } },
        { id: 'v2', label: 'Obsèques', done: true, to: 'all', text: 'rédigé', fields: {
          mode: 'Une crémation', ceremonie: 'Laïque', lieu: 'Près de la mer, si possible',
          musique: 'Une chanson que Thomas choisira', autres: 'Une cérémonie simple, en petit comité, avec des fleurs des champs.' } },
        { id: 'v3', label: 'Animaux de compagnie', done: true, to: 'p2', text: 'rédigé', fields: {
          nom: 'Pistache, mon chat', qui: 'Sophie, qui a accepté de la recueillir', soins: 'Des croquettes le matin, et beaucoup de câlins le soir.' } }
      ] },
      { id: 'messages', title: 'Messages', desc: 'Lettres et messages pour vos proches.', icon: 'chat', add: 'Écrire un nouveau message', items: [
        { id: 'm1', label: 'Pour Thomas', done: true, to: 'p1', when: 'now', text: 'Mon grand,\n\nSi tu lis ces lignes, je veux que tu saches à quel point je suis fière de toi. Tu as été ma plus belle aventure.\n\nPrends soin de toi, et de ceux que tu aimes.\n\nMaman' },
        { id: 'm2', label: 'Pour Sophie', done: true, to: 'p2', when: 'now', text: 'Ma Sophie,\n\nMerci pour toutes ces années d’amitié, pour les fous rires et les silences partagés. Prends bien soin de Pistache pour moi.\n\nClaire' },
        { id: 'm3', label: 'Pour Thomas, à ses 30 ans', done: false, to: 'p1', when: 'later', occasion: 'Le jour de ses 30 ans', text: 'Thomas, aujourd’hui tu as 30 ans…' },
        { id: 'm4', label: 'Pour Thomas, le jour de son mariage', done: true, to: 'p1', when: 'later', occasion: 'Le jour de son mariage', text: 'Mon fils,\n\nAujourd’hui commence une nouvelle histoire. Je serai là, d’une autre façon, à chaque pas.\n\nMaman' },
        ...MEDIA_SEED()
      ] },
      { id: 'acces', title: 'Accès numériques', desc: 'Comptes avec consignes de récupération.', icon: 'laptop', add: 'Ajouter un compte', items: [
        { id: 'a1', label: 'Messagerie e-mail', done: false, to: 'all', text: '' },
        { id: 'a2', label: 'Photos en ligne', done: false, to: 'p1', text: '' }
      ] },
      { id: 'documents', title: 'Documents', desc: 'Livret de famille, contrats, titres importants.', icon: 'doc', add: 'Ajouter un document', file: true, items: [
        { id: 'd1', label: 'Livret de famille', done: false, to: 'p1', text: '', fileName: '' }
      ] }
    ],
    people: [
      { id: 'p1', name: 'Thomas', relation: 'Fils', status: 'accepted', email: 'thomas@example.com', phone: '06 39 98 00 12', address: '12 rue des Lilas, 69003 Lyon' },
      { id: 'p2', name: 'Sophie', relation: 'Amie', status: 'invited', email: 'sophie@example.com' },
      { id: 'p3', name: 'Maître Lefèvre', kind: 'notaire', relation: 'Notaire de la famille depuis la vente de la maison.', status: 'accepted', email: 'etude.lefevre@example.com', phone: '04 39 98 00 45', address: '3 place du Marché, 44000 Nantes', notes: 'Étude Lefèvre et associés, de préférence le matin.' }
    ],
    testament: 'none',
    account: { email: 'claire.m@exemple.fr', mfa: 'passkey' }, signup: null, mail: null, essProp: {},
    essOpen: ['urgence'],
    ess: {
      'urgence-0': { a: 'Thomas en premier, puis Sophie. Thomas préviendra le reste de la famille.', to: 'all' },
      'urgence-1': { a: 'Oui, à vérifier dans le classeur bleu.', to: 'all', draft: true },
      'urgence-2': { a: 'Dans le tiroir du secrétaire, je crois.', to: 'all', draft: true },
      'urgence-3': { a: 'Thomas. Le code est noté dans le carnet bleu, rangé dans le secrétaire.', to: 'p1' },
      'urgence-5': { a: 'Pistache, mon chat : Sophie a accepté de la recueillir.', to: 'all' },
      'banque-0': { a: 'Compte courant et livret A à la banque de mon quartier, agence du centre-ville.', to: 'p1' },
      'assur-0': { a: 'Une assurance-vie au bénéfice de Thomas. Le contrat est dans le classeur bleu.', to: 'p1' },
      'patri-0': { a: 'Maître Lefèvre, à Nantes.', to: 'all' },
      'patri-1': { a: '', na: true, to: 'all' },
      'num-0': { a: 'Sur mon téléphone, sauvegardées en ligne, et sur le disque dur du bureau. Thomas, garde-les toutes.', to: 'p1' },
      'num-2': { a: 'Transformer mes profils en comptes de commémoration.', to: 'all' },
      'sante-2': { a: 'J’y suis favorable, et mes proches le savent.', to: 'all' }
    },
    onboarded: true,
    open: ['messages'],
    wizard: { step: 0, name: 'Claire', who: ['enfants', 'conjoint'], doneWho: ['enfants', 'conjoint'], person: { name: '', relation: '' }, priorities: ['messages', 'volontes'] }
  });

  let state;
  state = env.initial || NEW();
  if (!state.ess) state.ess = {};
  if (!state.essOpen) state.essOpen = ['urgence'];
  if (!state.essProp) state.essProp = {};
  if (!state.mediaSeed) {
    const ms = (state.sections || []).find(s => s.id === 'messages');
    if (ms && state.user && state.user.name === 'Claire' && !ms.items.some(i => i.kind)) ms.items.push(...MEDIA_SEED());
    state.mediaSeed = true;
  }
  if (env.cloud) state.account = Object.assign({}, state.account, { email: env.email, mfa: 'email' });
  if (!env.auth && state.onboarded !== false && !state.account) state.account = { email: 'vous@exemple.fr', mfa: 'app' };
  const save = () => env.persist(state);

  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ico = (n, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const uid = () => Math.random().toString(36).slice(2, 8);

  /* ---------- Messages : formats, durées et fichiers ---------- */
  const KIND_ICO = { texte: 'chat', audio: 'mic', video: 'video' };
  const KIND_LBL = { texte: 'Écrit', audio: 'Audio', video: 'Vidéo' };
  const MUSIC_WHEN = { during: 'pendant le message', before: 'avant, en ouverture', after: 'après, pour finir' };
  const fmtDur = s => !s ? '' : s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')}`;
  const msgMeta = i => [
    i.kind && i.kind !== 'texte' ? `${KIND_LBL[i.kind]}${i.media && i.media.dur ? ' ' + fmtDur(i.media.dur) : ''}` : '',
    i.music && i.music.title ? `musique : ${i.music.title}` : '',
    i.when === 'later' ? `à ouvrir : ${i.occasion || 'plus tard'}` : ''
  ].filter(Boolean).map(t => ` <span class="state">· ${esc(t)}</span>`).join('');
  /* Les enregistrements restent sur cet appareil (IndexedDB), jamais dans le stockage de la page. */
  const MEDIA = {};
  let idbP = null;
  const idb = () => idbP || (idbP = new Promise((res, rej) => {
    try { const r = indexedDB.open('oralysse-media', 1); r.onupgradeneeded = () => r.result.createObjectStore('m'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }
    catch (e) { rej(e); }
  }));
  async function mediaPut(k, blob) { MEDIA[k] = blob; try { (await idb()).transaction('m', 'readwrite').objectStore('m').put(blob, k); } catch (e) {} if (env.media) env.media.put(k, blob); }
  async function mediaGet(k) {
    if (MEDIA[k]) return MEDIA[k];
    let b = null;
    try { const db = await idb(); b = await new Promise(res => { const r = db.transaction('m').objectStore('m').get(k); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); }); }
    catch (e) { b = null; }
    if (!b && env.media) { b = await env.media.get(k); if (b) { try { (await idb()).transaction('m', 'readwrite').objectStore('m').put(b, k); } catch (e) {} } }
    return b ? (MEDIA[k] = b) : null;
  }
  const urlOf = b => { try { return URL.createObjectURL(b); } catch (e) { return ''; } };

  function progress() {
    /* L'essentiel compte pour deux rubriques, au prorata des réponses. */
    let total = 3, done = (state.people.length ? 1 : 0) + 2 * essTotal() / ESS_ALL.length;
    state.sections.forEach(s => s.items.forEach(i => { total++; if (i.done) done++; }));
    return Math.round(done / total * 100);
  }
  function status(s) {
    const d = s.items.filter(i => i.done).length;
    if (s.items.length && d === s.items.length) return 'done';
    if (d > 0 || s.items.some(i => i.text)) return 'doing';
    return 'todo';
  }
  const LABEL = { done: 'Terminé', doing: 'En cours', todo: 'À faire' };

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2800);
  }

  /* ---------- Volontés : questions guidées ---------- */
  const VOL_FORMS = {
    'Obsèques': [
      { k: 'mode', l: 'Je souhaite', type: 'choice', o: ['Une inhumation', 'Une crémation', 'Je laisse mes proches choisir'], d: 'Je laisse mes proches choisir' },
      { k: 'ceremonie', l: 'La cérémonie', type: 'choice', o: ['Religieuse', 'Laïque', 'Pas de cérémonie', 'Mes proches choisiront'], d: 'Mes proches choisiront' },
      { k: 'lieu', l: 'Lieu souhaité', type: 'text', ph: 'Une ville, un lieu, un cimetière…', d: 'Près de chez moi' },
      { k: 'musique', l: 'Une musique, un texte', type: 'text', ph: 'Ce qui pourrait être joué ou lu', d: 'Une musique que mes proches aiment' },
      { k: 'autres', l: 'Autres souhaits', type: 'area', ph: 'Des fleurs, une tenue, des personnes à prévenir…', d: 'Une cérémonie simple, entourée de ceux que j’aime.' }
    ],
    'Souhaits généraux': [
      { k: 'proches', l: 'Ce que je souhaite pour mes proches', type: 'area', ph: 'Ce que vous aimeriez leur dire, ou leur souhaiter.', d: 'Que vous restiez unis, et que vous preniez soin les uns des autres.' },
      { k: 'souvenir', l: 'Comment j’aimerais qu’on se souvienne de moi', type: 'area', ph: 'Un trait, une habitude, une phrase…', d: 'Comme quelqu’un qui vous aimait profondément.' }
    ],
    'Animaux de compagnie': [
      { k: 'nom', l: 'Son nom', type: 'text', ph: 'Par exemple : Pistache, mon chat', d: 'Mon animal de compagnie' },
      { k: 'qui', l: 'Qui s’en occupera', type: 'text', ph: 'Une personne qui a accepté', d: 'Un proche qui a accepté de l’accueillir' },
      { k: 'soins', l: 'Ses habitudes et ses soins', type: 'area', ph: 'Alimentation, vétérinaire, petites manies…', d: 'Ses repas, son vétérinaire et ses petites habitudes.' }
    ],
    'Dons et engagements': [
      { k: 'cause', l: 'L’association ou la cause', type: 'text', ph: 'Le nom de l’association', d: 'Une association qui m’est chère' },
      { k: 'souhait', l: 'Votre souhait', type: 'area', ph: 'Ce que vous aimeriez transmettre ou soutenir.', d: 'Soutenir une cause qui me tient à cœur.' }
    ]
  };
  const DEFAULT_FORM = [{ k: 'texte', l: 'Votre volonté', type: 'area', ph: 'Écrivez ici, avec vos mots.', d: 'Ce que je souhaite, avec mes mots.' }];
  /* ---------- L'essentiel : ce que mes proches doivent savoir et faire ---------- */
  const ESS = [
    { id: 'urgence', icon: 'chat', t: 'Les premières heures', d: 'Qui prévenir, où trouver l’essentiel, qui dépend de vous.', q: [
      ['Qui faut-il prévenir en tout premier ?', 'Mes enfants, puis ma sœur. Elle se chargera de prévenir le reste de la famille.'],
      ['Avez-vous un contrat obsèques ? Auprès de qui ?', 'Oui, auprès de [assureur]. Le contrat est dans le classeur des papiers importants.'],
      ['Où sont vos papiers d’identité et votre livret de famille ?', 'Dans le tiroir du bureau, avec mon passeport.'],
      ['Qui doit récupérer votre téléphone, et comment le déverrouiller ?', 'Thomas. Le code est noté dans le carnet rangé dans le coffre de la chambre.'],
      ['Qui a un double des clés du logement et de la voiture ?', 'Ma voisine, Mme [nom], a un double des clés de la maison.'],
      ['Quelqu’un dépend-il de vous au quotidien (enfant, parent, animal) ?', 'Mon père, à qui je rends visite chaque mercredi. Prévenir son aide à domicile.'],
      ['Qui est votre médecin traitant ?', 'Dr [nom], à [ville].'],
      ['Faut-il prévenir votre employeur, vos clients ou vos associés ?', 'Le service RH de [entreprise].']
    ] },
    { id: 'banque', icon: 'lock', t: 'Banques et argent', d: 'Comptes, épargne, crédits, coffres et cryptoactifs.', q: [
      ['Dans quelles banques avez-vous des comptes ?', 'Compte courant et livret A à la [banque], agence de [ville].'],
      ['Avez-vous des comptes joints ou des procurations ?', 'Un compte joint avec mon conjoint à la [banque].'],
      ['Avez-vous de l’épargne : livrets, PEL, PEA, compte-titres ?', 'Un PEL et un PEA à la [banque].'],
      ['Avez-vous une épargne salariale (PEE, PERCO) ou un plan d’épargne retraite ?', 'Un PEE chez [gestionnaire], par mon employeur.'],
      ['Avez-vous des comptes ou des biens à l’étranger ?', 'Non.'],
      ['Avez-vous des crédits en cours ? Sont-ils assurés ?', 'Un crédit immobilier à la [banque], avec une assurance emprunteur.'],
      ['Avez-vous prêté ou emprunté de l’argent à un proche ?', 'J’ai prêté [montant] à [prénom], sans reconnaissance de dette.'],
      ['Gardez-vous des espèces ou des objets de valeur chez vous ?', 'Un peu d’argent liquide dans la boîte à bijoux.'],
      ['Avez-vous un coffre-fort, à la banque ou chez vous ?', 'Un coffre à la [banque], agence de [ville]. La clé est dans le tiroir du bureau.'],
      ['Possédez-vous des cryptoactifs ? Où trouver la phrase de récupération ?', 'Un peu de bitcoin sur [plateforme]. La phrase de récupération est dans une enveloppe scellée, chez mon notaire.']
    ] },
    { id: 'assur', icon: 'shield', t: 'Assurances et prévoyance', d: 'Assurance-vie, prévoyance, mutuelle, retraite.', q: [
      ['Avez-vous une ou plusieurs assurances-vie ? Auprès de qui ?', 'Une assurance-vie chez [assureur], au bénéfice de mes enfants.'],
      ['Avez-vous une assurance décès ou un contrat de prévoyance ?', 'Oui, par mon employeur, chez [organisme].'],
      ['Votre carte bancaire ou vos crédits comportent-ils une assurance décès ?', 'Je ne sais pas : à vérifier auprès de ma banque.'],
      ['Quelle est votre mutuelle santé ?', '[Mutuelle], contrat famille.'],
      ['Où sont vos contrats d’assurance habitation et auto ?', 'Chez [assureur]. Les contrats sont dans le classeur bleu.'],
      ['Quelles sont vos caisses de retraite ?', 'Régime général et complémentaire. Mes relevés sont sur mon espace retraite en ligne.'],
      ['Percevez-vous des pensions ou des aides à signaler (réversion, CAF, APA) ?', 'Non.']
    ] },
    { id: 'patri', icon: 'home', t: 'Patrimoine et notaire', d: 'Notaire, testament, biens, sociétés, objets de valeur.', q: [
      ['Qui est votre notaire ?', 'Maître [nom], à [ville].'],
      ['Avez-vous fait un testament ? Où est-il conservé ?', 'Oui, déposé chez mon notaire.'],
      ['Avez-vous fait une donation, ou une donation au dernier vivant ?', 'Une donation au dernier vivant, chez mon notaire.'],
      ['Êtes-vous marié·e sous contrat, ou pacsé·e ?', 'Marié·e sans contrat, sous le régime de la communauté.'],
      ['Quels biens immobiliers possédez-vous ?', 'Ma résidence principale, et une part de la maison familiale avec ma sœur.'],
      ['Possédez-vous des parts de sociétés (SCI, entreprise) ?', 'Des parts de la SCI familiale [nom].'],
      ['Avez-vous des placements particuliers : or, SCPI, forêts, vin… ?', 'Quelques pièces d’or, dans le coffre de la banque.'],
      ['Quels véhicules possédez-vous ? Où sont les cartes grises ?', 'Une voiture. La carte grise est dans la boîte à gants.'],
      ['Avez-vous des objets de valeur : bijoux, œuvres, collections ?', 'La bague de ma grand-mère, et ma collection de timbres.']
    ] },
    { id: 'logement', icon: 'path', t: 'Logement et quotidien', d: 'Contrats, abonnements, impôts, papiers.', q: [
      ['Êtes-vous propriétaire ou locataire ? Qui contacter ?', 'Locataire. Bailleur : [nom]. Le bail est dans le classeur.'],
      ['Quels contrats faut-il transférer ou résilier : énergie, eau, internet ?', 'Électricité chez [fournisseur], box internet chez [opérateur].'],
      ['Quels abonnements faut-il résilier ?', 'Streaming, presse, salle de sport : la liste est dans mes accès numériques.'],
      ['Qui est votre opérateur de téléphone mobile ?', '[Opérateur], forfait à mon nom.'],
      ['Employez-vous quelqu’un à domicile ?', 'Une aide-ménagère le mardi, payée en CESU.'],
      ['Où sont rangés vos papiers importants ?', 'Dans le classeur bleu, dans le bureau.'],
      ['Où sont vos déclarations et avis d’impôts ?', 'Sur mon espace impots.gouv.fr, et les avis papier dans le classeur.'],
      ['Avez-vous une boîte postale, un garde-meuble ou un box ?', 'Un box de stockage chez [société], à [ville].']
    ] },
    { id: 'pro', icon: 'people', t: 'Travail et engagements', d: 'Employeur, entreprise, conseillers, mandats.', q: [
      ['Qui contacter chez votre employeur ?', 'Le service RH de [entreprise] : [contact].'],
      ['Êtes-vous indépendant·e ou dirigeant·e ? Qui doit prendre le relais ?', 'Non concerné·e.'],
      ['Avez-vous un comptable, un avocat ou un conseiller en patrimoine ?', 'Mon conseiller à la [banque] : [nom].'],
      ['Exercez-vous des mandats : syndic, association, tutelle d’un proche ?', 'Trésorière de l’association [nom].'],
      ['Vous êtes-vous porté·e caution, ou avez-vous des dettes que vos proches ignorent ?', 'Non.']
    ] },
    { id: 'num', icon: 'laptop', t: 'Vie numérique', d: 'Photos, e-mails, réseaux sociaux, appareils.', q: [
      ['Où sont vos photos et vos vidéos ?', 'Sur mon téléphone, sauvegardées sur [service], et sur un disque dur dans le bureau.'],
      ['Quelles messageries e-mail utilisez-vous ?', 'Une adresse personnelle chez [fournisseur].'],
      ['Que faire de vos réseaux sociaux : fermer, ou transformer en mémorial ?', 'Transformer mes profils en comptes de commémoration.'],
      ['Utilisez-vous un gestionnaire de mots de passe ? Qui peut y accéder ?', 'Oui, [service], avec Thomas comme contact d’urgence.'],
      ['Comment accéder à votre ordinateur et à votre tablette ?', 'Les codes sont dans le carnet rangé dans le coffre.'],
      ['Avez-vous désigné un contact légataire sur votre téléphone ou vos comptes ?', 'Pas encore.'],
      ['Avez-vous des comptes de paiement en ligne, des cagnottes ou des cartes cadeaux ?', 'Un compte de paiement en ligne et des cartes cadeaux dans mon tiroir.'],
      ['Avez-vous un site, un blog ou un nom de domaine ?', 'Non.'],
      ['Avez-vous des points de fidélité ou des miles ?', 'Des miles chez [compagnie].']
    ] },
    { id: 'sante', icon: 'heart', t: 'Santé et fin de vie', d: 'Directives anticipées, personne de confiance, don d’organes.', q: [
      ['Avez-vous rédigé des directives anticipées ? Où sont-elles ?', 'Oui. Une copie chez mon médecin, une dans le classeur.'],
      ['Avez-vous désigné une personne de confiance médicale ?', 'Oui, Thomas.'],
      ['Quelle est votre position sur le don d’organes ?', 'J’y suis favorable, et mes proches le savent.'],
      ['Avez-vous des traitements ou des soins en cours à signaler ?', 'Non.'],
      ['Où sont votre carte Vitale et votre dossier médical ?', 'La carte Vitale est dans mon portefeuille.']
    ] },
    { id: 'famille', icon: 'gift', t: 'Famille et souvenirs', d: 'Enfants, objets à transmettre, personnes à prévenir.', q: [
      ['Si vos enfants sont mineurs, qui souhaitez-vous comme tuteur ?', 'Non concerné·e : mes enfants sont majeurs.'],
      ['Y a-t-il des objets à transmettre à une personne précise ?', 'La montre de mon père, pour Thomas.'],
      ['Qui prévenir, que vos proches ne connaissent peut-être pas ?', 'Mes amis de la chorale. Le contact est [prénom].'],
      ['Où sont vos souvenirs : albums, lettres, archives familiales ?', 'Dans les cartons du grenier, étiquetés « famille ».'],
      ['Y a-t-il quelque chose que vos proches devraient apprendre de vous, plutôt que par hasard ?', 'Rien de particulier.']
    ] }
  ];
  const ESS_ALL = ESS.flatMap(th => th.q.map((q, i) => ({ id: th.id + '-' + i, th, q: q[0], d: q[1] })));
  const essQ = id => ESS_ALL.find(x => x.id === id);
  const checkMk = (on, label) => `<span class="ess-mk ${on ? 'on' : ''}" role="img" aria-label="${label}">${ico('check')}</span>`;
  /* Écrit, même en brouillon. */
  const essHas = id => { const a = state.ess[id]; return !!(a && (a.a || a.na || (a.files && a.files.length))); };
  /* Validé : seul ce qui est validé compte dans la progression et sera transmis. */
  const essDone = id => essHas(id) && !state.ess[id].draft;
  const essCount = th => th.q.filter((_, i) => essDone(th.id + '-' + i)).length;
  const essTotal = () => ESS_ALL.filter(x => essDone(x.id)).length;
  const formFor = label => VOL_FORMS[label] || DEFAULT_FORM;
  const summary = it => { const f = it.fields || {}; return formFor(it.label).map(q => f[q.k]).filter(Boolean).join(' · '); };
  const whoSees = to => { const p = state.people.find(x => x.id === to); return p ? p.name + ' uniquement' : 'Toutes vos personnes de confiance'; };
  function volRows(it) {
    const f = it.fields || {}, qs = formFor(it.label).filter(q => f[q.k]);
    if (!qs.length) return it.text && it.text !== 'rédigé' ? `<p>${esc(it.text)}</p>` : '';
    return `<dl class="vrows">${qs.map(q => `<div class="vrow"><dt>${q.l}</dt><dd>${esc(f[q.k])}</dd></div>`).join('')}</dl>`;
  }
  function editVolonte(iid) {
    const s = state.sections.find(x => x.id === 'volontes');
    const isNew = !iid;
    const it = isNew ? Object.assign(item(''), { fields: {}, to: 'all' }) : s.items.find(x => x.id === iid);
    const form = formFor(it.label);
    if (!it.fields) it.fields = it.text ? { [form[form.length - 1].k]: it.text } : {};
    const field = q => {
      const v = it.fields[q.k] || (it.text ? '' : q.d || ''), id = 'vf-' + q.k;
      if (q.type === 'choice') return `<fieldset class="seg"><legend>${q.l}</legend><div>${q.o.map(o => `<label><input type="radio" name="${q.k}" value="${esc(o)}" ${v === o ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>`;
      if (q.type === 'area') return `<div class="field"><label for="${id}">${q.l}</label><textarea id="${id}" name="${q.k}" placeholder="${esc(q.ph || '')}" style="min-height:110px">${esc(v)}</textarea></div>`;
      return `<div class="field"><label for="${id}">${q.l}</label><input id="${id}" name="${q.k}" value="${esc(v)}" placeholder="${esc(q.ph || '')}"></div>`;
    };
    const opts = [['all', state.people.length ? 'Toutes mes personnes de confiance' : 'Mes personnes de confiance, une fois désignées']]
      .concat(state.people.map(p => [p.id, p.name + ' uniquement']));
    openDlg(`
      <p class="eyebrow">Volontés</p>
      <h2>${isNew ? 'Ajouter une volonté' : esc(it.label)}</h2>
      ${isNew ? '<div class="field"><label for="vf-title">Titre</label><input id="vf-title" name="title" required value="Une volonté personnelle" placeholder="Par exemple : ma maison, mes plantes…"></div>' : ''}
      ${form.map(field).join('')}
      <div class="field"><label for="vf-to">Qui pourra la lire, le moment venu</label>
        <select id="vf-to" name="to">${opts.map(([v, l]) => `<option value="${v}" ${it.to === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <p class="muted" style="font-size:14px">Vos volontés guident vos proches. Pour leur donner une valeur juridique, parlez-en à un notaire.</p>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Annuler</button>
        <button type="submit" class="ghost" value="draft">Enregistrer le brouillon</button>
        <button type="submit" class="btn plain" value="done">Marquer comme prête</button>
      </div>`, (fd, action) => {
      if (isNew) it.label = String(fd.get('title') || '').trim() || 'Volonté';
      form.forEach(q => { it.fields[q.k] = String(fd.get(q.k) || '').trim(); });
      if (isNew && form === DEFAULT_FORM && VOL_FORMS[it.label]) it.fields = { [VOL_FORMS[it.label].slice(-1)[0].k]: it.fields.texte };
      it.to = String(fd.get('to') || 'all');
      it.text = summary(it);
      it.done = action === 'done';
      if (isNew) s.items.push(it);
      if (!state.open.includes('volontes')) state.open.push('volontes');
      save(); render();
      toast(it.done ? `« ${it.label} » est prête.` : 'Brouillon enregistré.');
    });
  }

  /* ---------- Vue : mes volontés ---------- */
  function volBody() {
    const s = state.sections.find(x => x.id === 'volontes') || { items: [] };
    return `<div class="vtools">
        <button type="button" class="btn plain" data-act="volpreview">${ico('people')}&nbsp;Voir ce que liront mes proches</button>
        <button type="button" class="add" data-add="volontes">${ico('plus')}Ajouter une volonté</button>
      </div>
      <div class="vgrid">
        ${s.items.map(it => {
          const rows = volRows(it);
          const one = state.people.some(p => p.id === it.to);
          return `<article class="card vcard">
            <header>${checkMk(it.done, it.done ? 'Validé' : rows ? 'Brouillon' : 'À compléter')}<h3>${esc(it.label)}</h3></header>
            ${rows || '<p class="muted-p">Rien d’écrit pour l’instant.</p>'}
            <footer><span class="who ${one ? 'one' : ''}">${ico(one ? 'lock' : 'people')}<span>Pour ${esc(one ? whoSees(it.to) : 'toutes vos personnes de confiance')}</span></span>
              <button type="button" class="mini" data-edit="volontes:${it.id}">${rows ? 'Modifier' : 'Rédiger'}</button></footer>
          </article>`;
        }).join('')}
      </div>`;
  }
  /* Ce que lira chaque proche, à la demande : seules les volontés prêtes et qui lui sont destinées. */
  function volPreview(pid) {
    const s = state.sections.find(x => x.id === 'volontes') || { items: [] };
    const P = state.people.find(p => p.id === pid) || state.people[0];
    const U = state.user.name || 'votre proche';
    const mine = s.items.filter(it => volRows(it) && (!P || !it.to || it.to === 'all' || it.to === P.id));
    const ready = mine.filter(it => it.done), drafts = mine.filter(it => !it.done);
    openDlg(`
      <p class="eyebrow">Aperçu · ce que liront vos proches</p>
      <h2>Les volontés de ${esc(U)}</h2>
      ${state.people.length ? `<div class="asbar" role="group" aria-label="Voir comme"><span class="muted-p">Voir comme</span>
        ${state.people.map(p => `<button type="button" class="aspill" data-vp="${p.id}" aria-pressed="${p.id === P.id}"><span class="ini">${esc(p.name[0])}</span>${esc(p.name)}</button>`).join('')}</div>` : ''}
      <div class="letter">
        ${ready.length ? ready.map(it => `<section class="vletter"><h3>${esc(it.label)}</h3>${volRows(it)}</section>`).join('')
          : `<p>Aucune volonté prête pour ${esc(P ? P.name : 'vos proches')} pour l’instant.</p>`}
        <small>Transmises uniquement après vérification du décès.</small>
      </div>
      ${drafts.length ? `<p class="muted" style="font-size:14px">${ico('path')} Pas encore transmis, car en brouillon : ${drafts.map(d => esc(d.label)).join(', ')}.</p>` : ''}
      <div class="dlg-actions"><button type="submit" class="btn plain" value="cancel">Fermer</button></div>`, () => {});
    dlg.querySelectorAll('[data-vp]').forEach(b => b.addEventListener('click', () => volPreview(b.dataset.vp)));
  }

  /* ---------- Vue : l'essentiel ---------- */
  function essBody() {
    const mtMode = !!(state.mtOn && state.mailTest && state.mail && !state.mail.scanning);
    const mtK = mtMode ? mtCur() : -1, mtId = mtK >= 0 ? state.mailTest.items[mtK].id : null;
    const mtWait = new Set(mtMode ? state.mailTest.items.filter(it => !it.res || it.res === 'skip').map(it => it.id) : []);
    return `<div class="two${mtMode ? ' mt-mode' : ''}">
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          ${ESS.map(th => {
            const c = essCount(th), st = c === th.q.length ? 'done' : c ? 'doing' : 'todo';
            const np = th.q.filter((_, i) => !essHas(th.id + '-' + i) && state.essProp[th.id + '-' + i]).length;
            const nd = th.q.filter((_, i) => essHas(th.id + '-' + i) && !essDone(th.id + '-' + i)).length;
            return `<details class="card ess" data-ess="${th.id}" ${state.essOpen.includes(th.id) ? 'open' : ''}>
              <summary class="step-head"><span class="badge-ico">${ico(th.icon)}</span><span><h3>${th.t}</h3><p>${th.d}${nd ? ` · <b class="nd">${nd} brouillon${nd > 1 ? 's' : ''}</b>` : ''}${np ? ` · <b class="np">${np} proposée${np > 1 ? 's' : ''}</b>` : ''}</p></span>
                <span class="chip ${st}">${st === 'done' ? ico('check') : ''}${c} / ${th.q.length}</span>${ico('chev', 'ico chev')}</summary>
              <ul class="ess-list">${th.q.map(([q], i) => {
                const id = th.id + '-' + i, a = state.ess[id], p = !essHas(id) && state.essProp[id];
                if (p) return `<li class="proposed"><div class="ess-q"><span>${esc(q)}</span>
                    <small class="prop">${ico('chat')}Proposé à partir de vos mails · ${esc(p.src)}</small><em>${esc(p.a)}</em></div>
                  <span class="prop-actions"><button type="button" class="mini ok" data-essacc="${id}">Accepter</button><button type="button" class="mini" data-essq="${id}">Modifier</button><button type="button" class="mini" data-essign="${id}">Ignorer</button></span></li>`;
                const st = !essHas(id) ? 'todo' : essDone(id) ? 'ok' : 'draft';
                const mtc = id === mtId ? ' mt-cur' : mtJust && mtJust.id === id ? ' mt-just' : '';
                const mtx = id === mtId ? '<small class="mt-here">Proposition à vérifier →</small>' : mtWait.has(id) && !essHas(id) ? `<button type="button" class="mt-tag" data-mtgo="${id}">${ico('chat')}Trouvé dans vos emails</button>` : '';
                return `<li class="q-${st}${mtc}">${checkMk(st === 'ok', st === 'ok' ? 'Validé' : st === 'draft' ? 'Brouillon' : 'À répondre')}<div class="ess-q"><span>${esc(q)}</span>${a && a.a ? `<small>${esc(a.a)}</small>` : a && a.na ? '<small>Non concerné·e</small>' : ''}${attChips(id, a)}${mtx}</div>
                  <span class="prop-actions">${st === 'ok' ? `<button type="button" class="linkbtn" data-essq="${id}">Modifier</button>` : st === 'draft' ? `<button type="button" class="mini" data-essq="${id}">Reprendre</button><button type="button" class="mini ink" data-essval="${id}">Valider</button>` : `<button type="button" class="mini" data-essq="${id}">Répondre</button>`}</span></li>`;
              }).join('')}</ul>
            </details>`;
          }).join('')}
        </div>
        <div class="side">
          ${mtMode ? mtPanelHtml() : `${!state.mail ? `<button type="button" class="feature f-mail" data-act="mail"><span class="badge-ico">${ico('chat')}</span>
              <span><h3>Gagnez du temps avec vos mails</h3><p class="sub">Connectez votre boîte : vos factures et relevés proposent des réponses. Vous validez chacune.</p></span><span class="go">${ico('chev')}</span></button>`
            : state.mail.scanning ? `<div class="card panel mail-on"><h3>Analyse en cours…</h3><p class="sub">Nous repérons vos banques, assureurs, fournisseurs et abonnements.</p><span class="bar scan"><i></i></span></div>`
            : `<div class="card panel mail-on"><h3>${ico('check')}Boîte mail connectée</h3>
              <p class="sub">${esc(state.mail.prov)} · ${esc((state.account && state.account.email) || '')}<br>${(n => n ? `${n} réponse${n > 1 ? 's' : ''} en attente de votre accord.` : 'Toutes les propositions ont été relues.')(mtCounts().left + mtCounts().skip)} Seuls l’expéditeur et l’objet des mails utiles sont lus.</p>
              ${mtCounts().left + mtCounts().skip ? '<button type="button" class="btn plain" data-act="mt-resume" style="align-self:flex-start">Reprendre la vérification</button>' : ''}
              <button type="button" class="add" data-act="mail-off">Déconnecter ma boîte mail</button></div>`}
          <aside class="ob-help">${LEAF}<h3>Par où commencer ?</h3>
            <p>Commencez par « Les premières heures » : ce sont les questions les plus urgentes pour vos proches. Le reste peut attendre, et se compléter au fil du temps.</p>
            <p><b>Ne notez jamais de mot de passe ni de code ici.</b> Indiquez seulement où les trouver.</p></aside>
          <a class="feature f-people" href="#transmission" style="text-decoration:none;color:inherit"><span class="badge-ico">${ico('people')}</span>
            <span><h3>Ce que liront vos proches</h3><p class="sub">Vos réponses leur sont transmises après vérification du décès, à la personne choisie pour chacune.</p></span><span class="go">${ico('chev')}</span></a>`}
        </div>
      </div>`;
  }
  /* ---------- Pièces jointes des réponses ---------- */
  const ATT_MAX = 15 * 1048576;
  const fmtSize = n => n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko';
  const isImg = f => /^image\//.test(f.type || '');
  async function mediaDel(k) { delete MEDIA[k]; try { (await idb()).transaction('m', 'readwrite').objectStore('m').delete(k); } catch (e) {} }
  const attChips = (id, a) => a && a.files && a.files.length
    ? `<span class="att-chips">${a.files.map(f => `<button type="button" class="att-chip" data-essfile="${id}|${f.k}">${ico('clip')}<span>${esc(f.name)}</span></button>`).join('')}</span>` : '';
  /* Le bloc d'une fenêtre de réponse : rien n'est enregistré tant que la réponse ne l'est pas. */
  function attachBlock(initial) {
    const list = (initial || []).map(f => Object.assign({}, f));
    const gone = [];
    const paint = () => {
      const box = $('#att-list'); if (!box) return;
      box.innerHTML = list.map((f, i) => `<li>${isImg(f) ? '<img class="att-th" alt="">' : `<span class="att-th">${ico('doc')}</span>`}<span class="att-n"><b>${esc(f.name)}</b><small>${fmtSize(f.size)}</small></span><button type="button" class="linkbtn" data-att-rm="${i}">Retirer</button></li>`).join('');
      list.forEach((f, i) => {
        const img = box.children[i].querySelector('img'); if (!img) return;
        Promise.resolve(f.blob || mediaGet(f.k)).then(b => { const u = b && urlOf(b); if (u) img.src = u; });
      });
    };
    return {
      html: `<div class="field att"><span class="att-lab">Pièces jointes</span>
        <ul class="att-list" id="att-list"></ul>
        <button type="button" class="add" id="att-btn">${ico('clip')}Joindre un document ou une photo</button>
        <input type="file" id="att-input" multiple accept="image/*,application/pdf" hidden>
        <small class="att-hint">Une carte grise, la photo d’un objet, un contrat… Image ou PDF, 15 Mo maximum.</small></div>`,
      wire() {
        paint();
        const input = $('#att-input');
        $('#att-btn').addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
          [...input.files].forEach(file => {
            if (!/^image\//.test(file.type) && file.type !== 'application/pdf') { toast(`« ${file.name} » : seuls les images et les PDF sont acceptés.`); return; }
            if (file.size > ATT_MAX) { toast(`« ${file.name} » dépasse 15 Mo.`); return; }
            list.push({ k: 'ess-file-' + uid(), name: file.name, type: file.type, size: file.size, blob: file });
          });
          input.value = '';
          paint();
        });
        $('#att-list').addEventListener('click', e => {
          const b = e.target.closest('[data-att-rm]'); if (!b) return;
          const [f] = list.splice(+b.dataset.attRm, 1);
          if (!f.blob) gone.push(f.k);
          paint();
        });
      },
      count: () => list.length,
      /* À l'enregistrement : range les nouveaux fichiers, efface les retirés, rend la liste à garder. */
      commit() {
        gone.forEach(mediaDel);
        return list.map(f => { if (f.blob) mediaPut(f.k, f.blob); return { k: f.k, name: f.name, type: f.type, size: f.size }; });
      },
      dropAll() { list.forEach(f => { if (!f.blob) mediaDel(f.k); }); gone.forEach(mediaDel); }
    };
  }
  async function showAttach(qid, k) {
    const a = state.ess[qid], f = a && (a.files || []).find(x => x.k === k); if (!f) return;
    const v = $('#viewer');
    v.innerHTML = `<div class="dlg"><p class="eyebrow">Pièce jointe</p><h2 class="att-title">${esc(f.name)}</h2><div id="v-body" class="muted">Chargement…</div>
      <div class="dlg-actions"><button type="button" class="btn plain" data-vclose>Fermer</button></div></div>`;
    v.showModal();
    const b = await mediaGet(k), body = $('#v-body'); if (!body) return;
    if (!b) body.textContent = 'Ce fichier n’est plus disponible dans ce navigateur.';
    else if (isImg(f)) { const img = document.createElement('img'); img.className = 'att-big'; img.alt = f.name; img.src = urlOf(b); body.replaceChildren(img); }
    else body.textContent = `Document PDF de ${fmtSize(f.size)}. L’aperçu des PDF n’est pas disponible dans cette démo.`;
  }
  function editEss(id) {
    const x = essQ(id); if (!x) return;
    const a = state.ess[id] || {};
    const att = attachBlock(a.files);
    const opts = [['all', state.people.length ? 'Toutes mes personnes de confiance' : 'Mes personnes de confiance, une fois désignées']]
      .concat(state.people.map(p => [p.id, p.name + ' uniquement']));
    openDlg(`
      <p class="eyebrow">L’essentiel · ${x.th.t}</p>
      <h2>${esc(x.q)}</h2>
      <div class="field"><label for="e-a">Votre réponse</label>
        <textarea id="e-a" name="a" style="min-height:110px" placeholder="Une phrase suffit.">${esc(a.a || (a.na ? '' : (state.essProp[id] && state.essProp[id].a) || x.d))}</textarea></div>
      ${!a.a && state.essProp[id] ? `<p class="muted-p">${ico('chat')}Proposé à partir de vos mails · ${esc(state.essProp[id].src)}</p>` : ''}
      ${att.html}
      <div class="field"><label for="e-to">Qui pourra la lire, le moment venu</label>
        <select id="e-to" name="to">${opts.map(([v, l]) => `<option value="${v}" ${(a.to || 'all') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <p class="muted" style="font-size:14px">${ico('shield')} Ne notez jamais de mot de passe ni de code : indiquez seulement où les trouver.</p>
      <button type="submit" class="linkbtn" value="na" formnovalidate style="align-self:flex-start">Je ne suis pas concerné·e</button>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Annuler</button>
        <button type="submit" class="ghost" value="draft" formnovalidate>Garder en brouillon</button>
        <button type="submit" class="btn plain" value="${essHas(id) ? 'done' : 'next'}">${essHas(id) ? 'Valider' : 'Valider et continuer'}</button>
      </div>`, (fd, action) => {
      const text = String(fd.get('a') || '').trim();
      if (action !== 'na' && !text && !att.count()) { toast('Écrivez une réponse, joignez un document, ou indiquez que vous n’êtes pas concerné·e.'); return false; }
      if (action === 'na') att.dropAll();
      state.ess[id] = action === 'na' ? { a: '', na: true, to: 'all' } : { a: text, na: false, to: String(fd.get('to') || 'all'), draft: action === 'draft', files: att.commit() };
      delete state.essProp[id];
      if (!state.essOpen.includes(x.th.id)) state.essOpen.push(x.th.id);
      save(); render();
      if (action === 'next') {
        const nx = ESS_ALL.find(y => y.th === x.th && !essHas(y.id)) || ESS_ALL.find(y => !essHas(y.id));
        if (nx) { if (!state.essOpen.includes(nx.th.id)) { state.essOpen.push(nx.th.id); save(); render(); } setTimeout(() => editEss(nx.id), 0); }
        else toast('Vous avez répondu à toutes les questions. Merci pour vos proches.');
      } else toast(action === 'draft' ? 'Gardé en brouillon. Vos proches ne le recevront pas tant que vous ne l’aurez pas validé.' : action === 'na' ? 'C’est noté.' : 'Réponse validée.');
    });
    att.wire();
  }
  function readEss(thid) {
    const th = ESS.find(t => t.id === thid); if (!th) return;
    const P = state.people.find(p => p.id === state.viewAs) || state.people[0];
    const U = state.user.name || 'Votre proche';
    const rows = th.q.map(([q], i) => [q, state.ess[th.id + '-' + i], th.id + '-' + i]).filter(([, a]) => a && (a.a || (a.files && a.files.length)) && !a.draft && (!a.to || a.to === 'all' || (P && a.to === P.id)));
    openDlg(`
      <p class="eyebrow">De ${esc(U)} · pour ${esc(P ? P.name : 'vous')}</p>
      <h2>${th.t}</h2>
      <div class="letter"><dl class="vrows">${rows.map(([q, a, qid]) => `<div class="vrow"><dt>${esc(q)}</dt><dd>${esc(a.a)}${attChips(qid, a)}</dd></div>`).join('')}</dl></div>
      <div class="dlg-actions"><button type="submit" class="btn plain" value="cancel">Fermer</button></div>`, () => {});
  }

  /* ---------- Vue : mon coffre ---------- */
  const bandHtml = (cls, alt) => `<div class="band ${cls}" role="img" aria-label="${alt}"></div>`;
  const heroHtml = (photo, alt, inner) => `<header class="split"><div class="split-tx">${inner}</div>${bandHtml(photo, alt)}</header>`;
  const trackHtml = f => `<span class="trk" aria-hidden="true"><b style="width:${Math.round(f * 100)}%"></b></span>`;
  const meterHtml = (label, f, aria) => `<div class="meter" role="img" aria-label="${aria}"><span>${label}</span>${trackHtml(f)}</div>`;
  const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
  const listFr = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} et ${a[a.length - 1]}`;
  /* Les étapes viennent de ce qui reste réellement à faire dans le coffre. */
  function nextSteps() {
    const sec = id => state.sections.find(s => s.id === id) || { items: [] };
    const open = id => sec(id).items.filter(i => !i.done);
    const rows = [
      { t: 'Créer mon coffre', done: true },
      { t: 'Désigner une personne de confiance', done: state.people.length > 0, attr: 'data-act="people"' }
    ];
    const msgs = open('messages');
    const m = msgs.find(i => i.text) || msgs[0];
    if (m) rows.push({ t: `Terminer le message « ${m.label} »`, attr: `data-edit="messages:${m.id}"` });
    const v = open('volontes')[0];
    if (v) rows.push({ t: `Compléter « ${v.label} »`, attr: `data-edit="volontes:${v.id}"` });
    state.people.filter(p => p.status !== 'accepted').forEach(p => rows.push({ t: `Confirmer ${p.name} comme personne de confiance`, attr: 'data-act="people"' }));
    const a = open('acces').length;
    if (a) rows.push({ t: `Rédiger les consignes pour ${plural(a, 'compte')} en ligne`, href: '#acces' });
    const d = open('documents').length;
    if (d) rows.push({ t: `Ajouter ${plural(d, 'document')}`, href: '#documents' });
    return rows;
  }
  function viewCoffre() {
    const pct = progress();
    const steps = nextSteps();
    const todo = steps.filter(s => !s.done);
    const first = todo[0];
    const W = ['', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six'];
    const left = W[todo.length] || todo.length;
    const name = state.user.name ? ' ' + esc(state.user.name) : '';
    const ctl = (s, cls, inner) => s.href ? `<a class="${cls}" href="${s.href}">${inner}</a>` : `<button type="button" class="${cls}" ${s.attr}>${inner}</button>`;
    const sec = id => state.sections.find(s => s.id === id) || { items: [] };
    const draft = sec('messages').items.find(i => !i.done && i.text);
    const line = draft ? draft.text.split('\n')[0] : '';
    const quote = line.length > 54 ? line.slice(0, 54).trim() + '…' : line;
    const ok = state.people.filter(p => p.status === 'accepted').map(p => p.name);
    const wait = state.people.filter(p => p.status !== 'accepted').map(p => p.name);
    const says = [
      ok.length ? `${esc(listFr(ok))} ${ok.length > 1 ? 'ont' : 'a'} accepté.` : '',
      wait.length ? `${esc(listFr(wait))} ${wait.length > 1 ? 'n’ont' : 'n’a'} pas encore répondu.` : ''
    ].filter(Boolean).join(' ');
    const relance = state.people.find(p => p.status !== 'accepted');

    const card = t => {
      const [photo, alt] = RUB_PHOTOS[t.id];
      return `<a class="rcard" href="#${t.id}" aria-label="${esc(t.label)}, ${t.sub}">${bandHtml(photo, alt)}<h3>${esc(t.label)}</h3><p>${RUB_SUB[t.id]}</p><span class="nb">${t.sub.replace(/ prêts?$/, '')}</span>${trackHtml(t.f)}</a>`;
    };
    const cell = (c, kick, title, sub) => ctl(c, 'cell', `<span class="cell-tx"><span class="kick">${kick}</span><span class="cell-t">${title}</span>${sub ? `<span class="cell-s">${sub}</span>` : ''}</span>${ico('arrow')}`);

    return `<div class="wrap dash">
      ${heroHtml('nuage', 'Un immense nuage blanc au-dessus de collines vertes, avec une personne vêtue d’orange', `
        <p class="eyebrow">Mon coffre</p>
        <h1 id="hello">Bonjour${name},<em>votre coffre est prêt à&nbsp;${pct}&nbsp;%.</em></h1>
        <span class="rule"></span>
        <p class="lead">${todo.length ? `Encore ${left} étape${todo.length > 1 ? 's' : ''} pour que vos proches trouvent tout ce dont ils auront besoin, au bon moment.` : 'Pensez à le relire de temps en temps : il évolue avec votre vie.'}</p>
        ${meterHtml(`${pct}&nbsp;%`, pct / 100, `${pct} % de votre coffre est prêt`)}
        ${first ? ctl(first, 'btn', `Continuer le parcours${ico('arrow')}`) : ''}`)}

      ${mtPauseCell(cell)}

      <nav class="rcards" aria-label="Les rubriques de mon coffre">${tabList().map(card).join('')}</nav>

      <div class="cells">
        ${draft
          ? cell({ attr: `data-edit="messages:${draft.id}"` }, 'Brouillon à reprendre', esc(draft.label), `« ${esc(quote)} »`)
          : cell({ href: '#messages' }, 'Messages', 'Laisser un message', 'Écrit, audio ou vidéo.')}
        ${relance
          ? cell({ attr: `data-relance="${relance.id}"` }, 'Personnes de confiance', `Relancer ${esc(relance.name)}`, says)
          : cell({ attr: 'data-act="people"' }, 'Personnes de confiance', state.people.length ? 'Gérer mes personnes' : 'Désigner une personne', says || 'Celle qui pourra signaler votre décès.')}
        ${cell({ href: '#transmission' }, 'À savoir', 'Ce que vivront vos proches', 'Ce que chacun découvrira, et rien de plus.')}
      </div>

      <div class="dgrid">
        <section aria-labelledby="d-next">
          <h2 id="d-next">Prochaines étapes</h2>
          <ul class="todo">
            ${steps.filter(s => s.done).concat(todo.slice(0, 4)).map(s => s.done
              ? `<li class="done"><span class="row"><span class="mk">${ico('check')}</span><span>${esc(s.t)}</span></span></li>`
              : `<li class="${s === first ? 'now' : ''}">${ctl(s, 'row', `<span class="mk"></span><span>${esc(s.t)}</span>`)}</li>`).join('')}
            ${state.testament === 'requested' ? '' : '<li class="opt"><button type="button" class="row" data-act="testament"><span class="mk"></span><span>Optionnel : indiquer si vous avez un testament</span></button></li>'}
          </ul>
        </section>
        <div class="dcol">
        ${helpCallHtml()}
        <section class="nv" aria-labelledby="d-verif">
          <h2 id="d-verif">Rien n’est transmis sans vérification.</h2>
          <ol>
            <li><b>1.</b><span>Oralysse identifie le décès à partir des actes officiels, ou parce qu’une personne de confiance le signale.</span></li>
            <li><b>2.</b><span>Confirmation formelle auprès des services concernés et des personnes de confiance.</span></li>
            <li><b>3.</b><span>Après un délai de 7 jours, chacun est prévenu et accède aux informations et instructions laissées à son attention.</span></li>
          </ol>
          <a href="#transmission">Voir le parcours de vos proches →</a>
        </section>
        </div>
      </div>
    </div>
    <div class="wrap dfoot">
      <button type="button" class="add" data-act="restart">${ico('path')}Modifier mes choix de départ</button>
      <p class="demo">Prototype de démonstration : les données restent dans ce navigateur. Le menu de votre compte permet de recommencer ou de voir un coffre déjà avancé. Photos Unsplash : Kumiko Shimizu, Vladimir Fedotov, Pierre Leverrier, Tyler Lastovich, Nikola Knezevic, Petr Slováček.</p>
    </div>`;
  }
  const RUB_SUB = {
    essentiel: 'Ce que vos proches devront savoir et faire dès les premiers jours.',
    volontes: 'Souhaits généraux, funérailles, animaux.',
    messages: 'Lettres, audio et vidéo pour ceux que vous aimez.',
    acces: 'Comptes, avec consignes de récupération.',
    documents: 'Livret de famille, contrats, titres.',
  };
  const RUB_PHOTOS = {
    essentiel: ['phare', 'Un phare sur son rocher, face à la mer bleu nuit'],
    volontes: ['cheval', 'Une personne au galop, vêtue d’orange, faisant tourner un grand cercle sous un ciel bleu nuit'],
    messages: ['champ', 'Une femme en robe blanche danse dans un champ de blé'],
    acces: ['dome', 'Un grand dôme blanc au bout d’une allée bordée de fleurs, sous un ciel bleu nuit'],
    documents: ['lettres', 'Une pile de lettres nouée d’un ruban, sous une arche ouverte sur des collines'],
  };
  /* Une rubrique du coffre : bandeau et contenu. */
  function viewRubric(id) {
    state.tab = id;
    return `<div class="wrap tabpanel" id="tabpanel">
      ${panelHtml(state.tab)}
    </div>
    <div class="wrap dfoot"></div>`;
  }

  /* ---------- Rubriques de la colonne ---------- */
  function tabList() {
    const n = essTotal(), N = ESS_ALL.length;
    return [{ id: 'essentiel', label: 'L’essentiel', icon: 'help', f: n / N, st: n === N ? 'done' : n ? 'doing' : 'todo', sub: `${n} / ${N}` }]
      .concat(state.sections.map(s => {
        const d = s.items.filter(i => i.done).length, t = s.items.length;
        return { id: s.id, label: s.title, icon: s.icon, f: t ? d / t : 0, st: status(s), sub: `${d} / ${t} prêt${t > 1 ? 's' : ''}` };
      }));
  }
  function navRubsHtml() {
    return tabList().map(t => `<a href="#${t.id}" data-view="${t.id}" aria-label="${esc(t.label)}, ${t.sub}">${esc(t.label)}<span class="cnt">${t.st === 'done' ? ico('check') : t.sub.replace(/ prêts?$/, '').replace(/ /g, '')}</span></a>`).join('');
  }
  function panelHtml(id) {
    const head = (eyebrow, title, lead) => {
      const [photo, alt] = RUB_PHOTOS[id], t = tabList().find(x => x.id === id);
      return heroHtml(photo, alt, `<p class="eyebrow"><a href="#coffre">Mon coffre</a><span class="sl" aria-hidden="true">/</span>${eyebrow}</p><h1>${title}</h1><span class="rule"></span>${lead ? `<p class="lead">${lead}</p>` : ''}${meterHtml(t.sub.replace(' / ', ' sur '), t.f, t.sub)}`);
    };
    if (id === 'essentiel') return `${head('L’essentiel pour mes proches', 'Ce que mes proches auront besoin de savoir <em>quand je ne pourrai plus le leur dire.</em>', 'Ce sont les questions que vos proches se poseront dès les premiers jours. Répondez à votre rythme : une phrase suffit souvent.')}${essBody()}`;
    if (id === 'volontes') return `${head('Mes volontés', 'Ce que vous souhaitez, <em>dit avec vos mots.</em>', 'Vos volontés guident vos proches le moment venu. Elles ne remplacent pas un testament : pour leur donner une valeur juridique, parlez-en à un notaire.')}${volBody()}`;
    const s = state.sections.find(x => x.id === id); if (!s) return '';
    const isM = s.id === 'messages';
    const H1 = { messages: 'Lettres et messages <em>pour vos proches.</em>', acces: 'Vos comptes, <em>avec leurs consignes.</em>', documents: 'Vos papiers importants, <em>au même endroit.</em>' };
    return `${head(s.title, H1[s.id] || s.desc, isM ? 'Écrit, audio ou vidéo : laissez-leur votre voix, votre visage, et si vous le souhaitez une musique qui vous ressemble.' : s.desc)}
      <div class="card plist">
        ${s.items.length ? s.items.map(i => `<div class="item">
          ${checkMk(i.done, i.done ? 'Validé' : i.text ? 'Brouillon' : 'À compléter')}
          <span class="name">${esc(i.label)}${i.fileName ? ` <span class="state">· ${esc(i.fileName)}</span>` : ''}${isM ? msgMeta(i) : ''}</span>
          <button type="button" class="mini" data-edit="${s.id}:${i.id}">${i.done ? 'Relire' : s.file ? 'Ajouter' : 'Rédiger'}</button>
        </div>`).join('') : '<p class="muted-p">Rien pour l’instant.</p>'}
        <div style="display:flex;flex-wrap:wrap;gap:4px 24px;padding-top:6px">
          ${s.add ? `<button type="button" class="add" data-add="${s.id}">${ico('plus')}${isM ? 'Laisser un nouveau message' : s.add}</button>` : ''}
          ${s.id === 'messages' ? `<a class="add" href="#transmission" style="text-decoration:none">${ico('people')}Voir ce que chaque proche recevra</a>` : ''}
        </div>
      </div>`;
  }

  /* ---------- Vue : parcours ---------- */
  const WHO = [
    ['conjoint', 'Mon conjoint ou ma conjointe', 'Partager les accès du quotidien et les décisions importantes.'],
    ['enfants', 'Mes enfants', 'Leur laisser des messages, des souvenirs et les documents utiles.'],
    ['parents', 'Mes parents', 'Les prévenir et leur éviter des démarches difficiles.'],
    ['amis', 'Un ou une ami·e proche', 'Une personne de confiance en dehors de la famille.'],
    ['animaux', 'Mes animaux', 'Indiquer qui s’en occupera et comment.'],
    ['asso', 'Une association', 'Exprimer un souhait de don ou d’engagement.']
  ];
  const PRIO = [
    ['volontes', 'Mes volontés', 'Obsèques, souhaits personnels.'],
    ['messages', 'Des messages personnels', 'Pour ceux que vous aimez.'],
    ['acces', 'Mes accès numériques', 'Comptes, photos, abonnements.'],
    ['documents', 'Mes documents importants', 'Contrats, livret de famille…']
  ];
  const ICONS = { conjoint: 'heart', enfants: 'people', parents: 'home', amis: 'chat', animaux: 'paw', asso: 'gift', volontes: 'doc', messages: 'chat', acces: 'laptop', documents: 'doc' };
  const LEAF = `<svg class="leaf" viewBox="0 0 120 170" aria-hidden="true"><path d="M30 165 C 45 120, 70 70, 100 15" stroke="var(--sage)" stroke-width="2" fill="none"/>
    <path d="M84 40 C 60 30, 52 55, 70 64 C 82 56, 92 48, 84 40 Z M62 82 C 36 80, 34 106, 52 110 C 62 100, 70 92, 62 82 Z M100 70 C 112 52, 96 40, 88 52 C 88 64, 92 70, 100 70 Z M46 128 C 22 132, 26 156, 42 156 C 50 144, 54 136, 46 128 Z" fill="var(--sage)" fill-opacity=".45"/></svg>`;
  const next = (label, attrs = '') => `<button type="button" class="btn" data-wiz="next" ${attrs}><span class="dot">${ico('arrow')}</span>${label}</button>`;
  function viewParcours() {
    const w = state.wizard;
    const mode = state.built ? 'Modifier mes choix de départ' : 'Votre coffre';
    if (w.step === 0 && !state.built) {
      return `<section class="hero ob-welcome" aria-labelledby="ob-title">
          <div class="hero-photo" role="img" aria-label="Une arche de pierre ouverte sur un paysage"></div>
          <div class="wrap"><div>
            <p class="eyebrow">Bienvenue</p>
            <h1 id="ob-title">Bienvenue sur Oralysse,<em>commençons par identifier vos besoins.</em></h1>
            <p class="lead">En quatre questions, nous préparons un coffre à votre image : pour qui, avec qui, et par quoi commencer. Comptez deux minutes. Vous pourrez tout modifier ensuite.</p>
            <div class="actions">${next('Commencer')}</div>
          </div></div>
        </section>
        <div class="wrap">
          <ul class="ob-promise" aria-label="Nos engagements">
            <li>${ico('shield')}<div><h3>Rien n’est transmis sans vérification</h3><p>Le décès est vérifié avant que quiconque reçoive quoi que ce soit.</p></div></li>
            <li>${ico('lock')}<div><h3>Chiffré et hébergé en France</h3><p>Vos volontés et vos messages restent privés, de votre vivant.</p></div></li>
            <li>${ico('path')}<div><h3>Modifiable à tout moment</h3><p>Votre coffre évolue avec votre vie, à votre rythme.</p></div></li>
          </ul>
        </div>`;
    }
    const steps = {
      1: { t: 'Pour qui préparez-vous', em: 'votre coffre ?', l: 'Choisissez autant de réponses que nécessaire.', list: WHO, key: 'who', max: 99,
           help: 'Vos réponses préparent les bonnes rubriques : un message pour vos enfants, une volonté pour vos animaux… Rien n’est figé.' },
      2: { t: 'Qui sera votre première', em: 'personne de confiance ?', l: 'C’est la personne qui pourra signaler votre décès le moment venu. Elle recevra une invitation.',
           help: 'Nous recommandons deux personnes de confiance : le signalement de l’une est confirmé par l’autre. Vous pourrez ajouter la seconde depuis votre coffre.' },
      3: { t: 'Par quoi souhaitez-vous', em: 'commencer ?', l: 'Choisissez ce par quoi vous voulez commencer. Vous pourrez tout compléter ensuite.', list: PRIO, key: 'priorities', max: 99,
           help: 'Les rubriques choisies passent en tête de votre coffre, dans l’ordre où vous les cochez. En commençant par ce qui compte le plus pour vous, vous avancerez plus sereinement.' },
      4: { t: w.name ? esc(w.name) + ',' : 'Voilà,', em: 'votre coffre est prêt.', l: 'Voici ce que nous avons préparé avec vos réponses.',
           help: 'Rien n’est transmis sans vérification du décès. Vous avancerez ensuite rubrique par rubrique depuis Mon coffre, qui vous montre où vous en êtes.' }
    };
    const s = steps[w.step] || steps[1];
    const hero = `<section class="hero ob-hero" aria-labelledby="ob-title">
        <div class="hero-photo" aria-hidden="true"></div>
        <div class="wrap">
          <p class="eyebrow">${mode} · Étape ${w.step} sur 4</p>
          <div class="progress-dots" role="img" aria-label="Étape ${w.step} sur 4">${[1, 2, 3, 4].map(i => `<i class="${i <= w.step ? 'on' : ''}"></i>`).join('')}</div>
          <h1 id="ob-title">${s.t}<em>${s.em}</em></h1>
          <p class="lead">${s.l}</p>
        </div>
      </section>`;
    const help = `<aside class="ob-help">${LEAF}<h3>Pourquoi cette question ?</h3><p>${s.help}</p></aside>`;
    const back = w.step > 1 || !state.built ? '<button type="button" class="ghost" data-wiz="back">Retour</button>' : '<button type="button" class="ghost" data-wiz="later">Annuler</button>';
    let main;
    if (w.step === 2) {
      main = `<div class="card panel ob-fields">
          <div class="field"><label for="w-pname">Son prénom</label><input id="w-pname" value="${esc(w.person.name)}" placeholder="Par exemple : Thomas" autocomplete="off"></div>
          <div class="field"><label for="w-prel">Votre lien avec cette personne</label><input id="w-prel" value="${esc(w.person.relation)}" placeholder="Fils, sœur, ami…" autocomplete="off"></div>
        </div>
        <div class="wizard-nav">${back}<span style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><button type="button" class="ghost" data-wiz="skip">Je le ferai plus tard</button>${next('Continuer')}</span></div>`;
    } else if (w.step === 4) {
      const label = (list, id) => (list.find(p => p[0] === id) || [, id])[1];
      const pr = w.priorities.map(id => label(PRIO, id).toLowerCase()).join(' et ');
      const who = w.who.map(id => label(WHO, id).toLowerCase()).join(', ');
      main = `<div class="card panel">
          <ul class="receives">
            <li><span class="badge-ico" style="width:44px;height:44px">${ico('people')}</span><span><b>Pour :</b> ${esc(who || 'vos proches')}</span></li>
            <li><span class="badge-ico" style="width:44px;height:44px">${ico('shield')}</span><span><b>Personne de confiance :</b> ${w.person.name ? esc(w.person.name) + (w.person.relation ? ' (' + esc(w.person.relation) + ')' : '') + ', qui recevra une invitation' : 'à désigner depuis votre coffre'}</span></li>
            <li><span class="badge-ico" style="width:44px;height:44px">${ico('path')}</span><span><b>Votre parcours commencera par :</b> ${esc(pr || 'vos volontés')}</span></li>
          </ul>
        </div>
        <div class="wizard-nav">${back}<button type="button" class="btn" data-wiz="finish"><span class="dot">${ico('arrow')}</span>${state.account ? 'Ouvrir mon coffre' : 'Créer mon compte'}</button></div>`;
    } else {
      const sel = w[s.key];
      main = `${w.step === 1 ? `<div class="card panel ob-fields"><div class="field"><label for="w-name">Votre prénom</label><input id="w-name" value="${esc(w.name)}" placeholder="Par exemple : Claire" autocomplete="given-name"></div></div>` : ''}
        <div class="choices${s.key === 'priorities' ? ' two-col' : ''}">${s.list.map(([id, t, h]) => `<button type="button" class="choice" data-pick="${s.key}:${id}:${s.max}" aria-pressed="${sel.includes(id)}">
            <span class="badge-ico">${ico(ICONS[id] || 'doc')}</span><span class="ctext"><strong>${t}</strong><span>${h}</span></span><span class="tick" aria-hidden="true">${s.key === 'priorities' ? `<b>${sel.indexOf(id) + 1}</b>` : ico('check')}</span></button>`).join('')}</div>
        <div class="wizard-nav">${back}<span style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><span style="color:var(--muted)">${sel.length} sélection${sel.length > 1 ? 's' : ''}</span>${next('Continuer', sel.length ? '' : 'disabled')}</span></div>`;
    }
    return `${hero}<div class="wrap ob-body"><div class="ob-main">${main}</div>${help}</div>`;
  }

  /* ---------- Vue : création du compte ---------- */
  function viewCompte() {
    const su = state.signup, n = su.step;
    const T = {
      1: ['Créez votre compte', 'pour ouvrir votre coffre.', 'Votre coffre est prêt. Il ne reste qu’à le protéger.',
          'Votre mot de passe protège un espace très personnel : choisissez-en un long, que vous n’utilisez nulle part ailleurs. « Continuer avec Google » sert uniquement à vous connecter : cela ne donne aucun accès à vos mails.'],
      2: ['Vérifiez', 'votre adresse e-mail.', `Nous avons envoyé un code à 6 chiffres à ${esc(su.email || 'votre adresse')}.`,
          'Cette adresse servira à vous prévenir de toute connexion, et à vos personnes de confiance pour vous joindre.'],
      3: ['Ajoutez une seconde', 'protection.', 'À chaque connexion, nous vous demanderons une preuve en plus de votre mot de passe.',
          'Votre coffre contient vos volontés, vos comptes et vos messages. La double authentification empêche quiconque d’y entrer avec votre seul mot de passe.'],
      4: ['Gardez votre kit', 'de récupération.', 'Il vous permettra de retrouver l’accès à votre coffre si vous oubliez votre mot de passe.',
          'Votre coffre est chiffré avec une clé que vous seul détenez : même Oralysse ne peut pas le lire, ni réinitialiser votre mot de passe à votre place. Ce kit est votre clé de secours. Imprimez-le et rangez-le avec vos papiers importants.']
    }[n];
    const SU_N = env.auth ? 2 : 4;
    if (env.auth) T.splice(0, 4, ...{
      1: ['Créez votre compte', 'pour garder votre coffre.', 'Pas de mot de passe à retenir : à chaque connexion, nous vous envoyons un code par e-mail.',
          'Votre adresse e-mail sert de clé : seule une personne qui lit vos e-mails peut ouvrir votre coffre. Choisissez une adresse que vous garderez longtemps, et protégez-la bien.'],
      2: ['Vérifiez', 'votre adresse e-mail.', `Nous avons envoyé un code à 6 chiffres à ${esc(su.email || 'votre adresse')}. Vous pouvez aussi cliquer sur le lien du mail.`,
          'Cette adresse servira à vous connecter, à vous prévenir de toute connexion, et à vos personnes de confiance pour vous joindre.']
    }[n]);
    const hero = `<section class="hero ob-hero" aria-labelledby="su-title">
        <div class="hero-photo" aria-hidden="true"></div>
        <div class="wrap">
          <p class="eyebrow">Votre compte · Étape ${n} sur ${SU_N}</p>
          <div class="progress-dots" role="img" aria-label="Étape ${n} sur ${SU_N}">${[1, 2, 3, 4].slice(0, SU_N).map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>
          <h1 id="su-title">${T[0]}<em>${T[1]}</em></h1>
          <p class="lead">${T[2]}</p>
        </div>
      </section>`;
    const back = `<button type="button" class="ghost" data-su="back">Retour</button>`;
    const go = label => `<button type="button" class="btn" data-su="next"><span class="dot">${ico('arrow')}</span>${label}</button>`;
    let main;
    if (n === 1 && env.auth) main = `<div class="card panel" style="display:flex;flex-direction:column;gap:16px">
        <div class="field"><label for="su-email">Adresse e-mail</label><input id="su-email" type="email" autocomplete="email" placeholder="vous@exemple.fr" value="${esc(su.email || '')}"></div>
        <p class="muted-p">${ico('shield')}Aucun mot de passe : un code vous sera envoyé par e-mail à chaque connexion.</p>
      </div>
      <div class="wizard-nav">${back}${go('Recevoir mon code')}</div>`;
    else if (n === 1) main = `<div class="card panel" style="display:flex;flex-direction:column;gap:16px">
        <div class="field"><label for="su-email">Adresse e-mail</label><input id="su-email" type="email" autocomplete="email" value="${esc(su.email || (state.user.name || state.wizard.name || 'claire').toLowerCase().replace(/[^a-z]/g, '') + '@exemple.fr')}"></div>
        <div class="field"><label for="su-pass">Mot de passe</label><input id="su-pass" type="password" autocomplete="new-password" placeholder="12 caractères au minimum"></div>
        <p class="muted-p">${ico('shield')}Démo : le mot de passe n’est ni envoyé ni enregistré.</p>
        <div class="or"><span>ou</span></div>
        <button type="button" class="ghost" data-su="google" style="align-self:flex-start">Continuer avec Google</button>
      </div>
      <div class="wizard-nav">${back}${go('Créer mon compte')}</div>`;
    else if (n === 2 && env.auth) main = `<div class="card panel ob-fields">
        <div class="field"><label for="su-code">Code reçu par e-mail</label><input id="su-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div>
        <p class="muted-p" style="align-self:end">Rien reçu ? Regardez dans les courriers indésirables, ou demandez un nouveau code.</p>
      </div>
      <div class="wizard-nav">${back}<span style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><button type="button" class="ghost" data-su="resend">Renvoyer le code</button>${go('Ouvrir mon coffre')}</span></div>`;
    else if (n === 2) main = `<div class="card panel ob-fields">
        <div class="field"><label for="su-code">Code reçu par e-mail</label><input id="su-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div>
        <p class="muted-p" style="align-self:end">Démo : n’importe quel code à 6 chiffres.</p>
      </div>
      <div class="wizard-nav">${back}<span style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><button type="button" class="ghost" data-su="resend">Renvoyer le code</button>${go('Vérifier')}</span></div>`;
    else if (n === 3) main = `<div class="choices two-col">
        <button type="button" class="choice" data-mfa="passkey" aria-pressed="${su.mfa === 'passkey'}"><span class="badge-ico">${ico('lock')}</span><span class="ctext"><strong>Une passkey</strong><span>Recommandé. Votre empreinte, votre visage ou le code de votre appareil. Rien à retenir.</span></span><span class="tick" aria-hidden="true">${ico('check')}</span></button>
        <button type="button" class="choice" data-mfa="app" aria-pressed="${su.mfa === 'app'}"><span class="badge-ico">${ico('shield')}</span><span class="ctext"><strong>Une application d’authentification</strong><span>Un code à 6 chiffres qui change toutes les 30 secondes.</span></span><span class="tick" aria-hidden="true">${ico('check')}</span></button>
      </div>
      ${su.mfa === 'app' ? `<div class="card panel ob-fields"><div class="field"><label for="su-totp">Code affiché par l’application</label><input id="su-totp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div><p class="muted-p" style="align-self:end">Démo : scannez le QR code dans la vraie version. Ici, n’importe quel code.</p></div>` : ''}
      <div class="wizard-nav">${back}${go(su.mfa === 'passkey' ? 'Créer ma passkey' : 'Activer')}</div>`;
    else main = `<div class="card panel" style="display:flex;flex-direction:column;gap:16px">
        <p class="eyebrow">Code de récupération</p>
        <p class="rcode">${esc(su.rcode)}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><button type="button" class="ghost" data-su="pdf">Télécharger le kit (PDF)</button><button type="button" class="ghost" data-su="print">Imprimer</button></div>
        <label class="check"><input type="checkbox" id="su-saved" ${su.saved ? 'checked' : ''}><span>J’ai rangé mon kit de récupération en lieu sûr.</span></label>
        <label class="check"><input type="checkbox" id="su-help" ${su.help !== false ? 'checked' : ''}><span>Si je perds aussi mon kit, mes personnes de confiance pourront confirmer mon identité pour m’aider à récupérer l’accès.</span></label>
      </div>
      <div class="wizard-nav">${back}${go('Ouvrir mon coffre')}</div>`;
    return `${hero}<div class="wrap ob-body"><div class="ob-main">${main}</div><aside class="ob-help">${LEAF}<h3>Pourquoi cette étape ?</h3><p>${T[3]}</p></aside></div>`;
  }
  let suBusy = false;
  async function suAuth(a, su, val) {
    if (suBusy) return;
    suBusy = true;
    const btn = $('[data-su="next"]'); if (btn) btn.disabled = true;
    try {
      if (a === 'resend') { await env.auth.send(su.email, { name: (state.wizard.name || '').trim() }); toast('Un nouveau code vient de partir.'); }
      else if (su.step === 1) {
        const email = val('su-email');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Indiquez une adresse e-mail valide.'); return; }
        await env.auth.send(email, { name: (state.wizard.name || '').trim() });
        su.email = email; su.step = 2; save(); render(); window.scrollTo(0, 0);
      } else {
        const code = val('su-code').replace(/\D/g, '');
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
    if (a === 'back') { if (su.step === 1) { state.signup = null; } else su.step = su.step === 3 && su.google ? 1 : su.step - 1; }
    else if (a === 'google') { su.google = true; su.email = (state.wizard.name || 'claire').toLowerCase().replace(/[^a-z]/g, '') + '@gmail.com'; su.step = 3; toast('Connexion avec Google (démo) : aucun accès à vos mails n’est demandé.'); }
    else if (a === 'resend') { toast('Un nouveau code a été envoyé (démo).'); return; }
    else if (a === 'pdf' || a === 'print') { toast(a === 'pdf' ? 'Kit de récupération téléchargé (démo).' : 'Impression du kit (démo).'); return; }
    else if (a === 'next') {
      if (su.step === 1) {
        const email = val('su-email');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Indiquez une adresse e-mail valide.'); return; }
        if (val('su-pass').length < 12) { toast('Choisissez un mot de passe d’au moins 12 caractères.'); return; }
        su.email = email; su.google = false; su.step = 2;
      } else if (su.step === 2) {
        if (val('su-code').replace(/\D/g, '').length !== 6) { toast('Saisissez le code à 6 chiffres.'); return; }
        su.step = 3;
      } else if (su.step === 3) {
        if (su.mfa === 'app' && val('su-totp').replace(/\D/g, '').length !== 6) { toast('Saisissez le code à 6 chiffres de l’application.'); return; }
        if (su.mfa === 'passkey') toast('Passkey créée (démo).');
        const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', g = () => Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('');
        su.rcode = su.rcode || ['ORA', g(), g(), g(), g()].join('-');
        su.step = 4;
      } else {
        if (!$('#su-saved').checked) { toast('Cochez la case une fois votre kit rangé en lieu sûr.'); return; }
        state.account = { email: su.email, mfa: su.mfa, trustedRecovery: $('#su-help').checked };
        state.signup = null; save(); finishWiz('new'); return;
      }
    }
    save(); render(); window.scrollTo(0, 0);
  }

  /* ---------- Boîte mail : des réponses proposées ---------- */
  const MAIL_PROPS = {
    'urgence-7': ['Mon employeur : Atelier Lumen, service des ressources humaines.', 'Bulletins de paie mensuels'],
    'banque-2': ['Un livret A et un PEL à la Banque du Littoral.', 'Relevés annuels d’épargne'],
    'banque-5': ['Un crédit auto chez Finéo, avec une assurance emprunteur.', 'Échéancier de prêt'],
    'assur-3': ['Mutuelle des Familles, contrat individuel.', 'Décomptes de remboursement'],
    'assur-4': ['Habitation et auto chez Assurances Horizon.', 'Avis d’échéance annuels'],
    'patri-7': ['Une citadine, immatriculée en 2022. La carte grise est à mon nom.', 'Démarche de carte grise en ligne'],
    'logement-1': ['Électricité chez Énergie Ouest, internet chez Box Fibre+.', 'Factures mensuelles'],
    'logement-2': ['CinéPlus, MusicBox, le journal Ouest Matin et la salle Forme+.', 'Reçus de paiement récurrents'],
    'logement-3': ['Mobilis, forfait à mon nom.', 'Factures mobiles'],
    'logement-6': ['Mon espace en ligne des impôts : avis et déclarations y sont disponibles.', 'Notifications de l’administration fiscale'],
    'num-1': ['', 'Adresse de la boîte connectée'],
    'num-6': ['Un compte PayFlex, sur lequel il reste un petit solde.', '« De l’argent dort sur votre compte »'],
    'num-8': ['Un compte de fidélité Air Océane.', 'Relevés de points']
  };
  /* ---------- Boîte mail : confirmer une à une ce qui a été trouvé ---------- */
  /* « Label : Nom (12 mails, dernier le 01/02/2026), Autre (…) » devient une liste d'organismes à cocher. */
  function mtParse(raw) {
    const re = /([\s\S]*?)\((\d+\+?) mails?, dernier le ([\d/]+)\)/g;
    const items = []; let m, last = 0, label = '';
    while ((m = re.exec(raw))) {
      let name = m[1].replace(/^[\s,.;]+/, '').trim();
      const c = name.lastIndexOf(' : ');
      if (c >= 0) { label = name.slice(0, c).trim(); name = name.slice(c + 3).trim(); }
      items.push({ label, name: name.replace(/^(et|ou)\s+/, ''), n: m[2], d: m[3] });
      last = re.lastIndex;
    }
    return { items, tail: raw.slice(last).replace(/^[\s.,;]+/, '').trim() };
  }
  /* Ce qui n'est qu'une simple mention n'est pas coché d'avance. */
  const mtSure = it => !/^mentions?/i.test(it.label);
  const mtAnswer = (items, on) => {
    const parts = [];
    items.forEach((it, i) => {
      if (!on(i)) return;
      const last = parts[parts.length - 1];
      if (last && last.label === it.label) last.names.push(it.name); else parts.push({ label: it.label, names: [it.name] });
    });
    return parts.map(p => (p.label ? p.label + ' : ' : '') + p.names.join(', ') + '.').join(' ');
  };
  /* Sur l'accueil : la vérification en attente, pour la reprendre où on l'a laissée. */
  function mtPauseCell(cell) {
    const mt = state.mailTest;
    if (!mt || !state.mail || state.mail.scanning) return '';
    const c = mtCounts();
    if (!c.left && !c.skip) return '';
    const k = mt.items.findIndex(it => !it.res);
    return `<div class="cells mt-pause">${cell({ attr: 'data-act="mt-resume"' }, 'Vérification de vos emails en pause', k >= 0 ? `Reprendre à la question ${k + 1} sur ${mt.items.length}` : `Revoir ${c.skip > 1 ? `les ${c.skip} questions passées` : 'la question passée'}`, `${c.yes} confirmée${c.yes > 1 ? 's' : ''}, ${c.draft} en brouillon, ${c.no} écartée${c.no > 1 ? 's' : ''}.`)}</div>`;
  }
  const mtCounts = () => {
    const c = { yes: 0, draft: 0, no: 0, skip: 0, left: 0 };
    (state.mailTest ? state.mailTest.items : []).forEach(it => { c[it.res || 'left']++; });
    return c;
  };
  /* La vérification se fait dans la page L'essentiel : la liste à gauche, la proposition à droite. */
  let mtJust = null, mtAtt = null;
  const mtCur = () => {
    const mt = state.mailTest; if (!mt) return -1;
    const k = mt.items.findIndex((it, i) => i >= mt.idx && !it.res);
    return k >= 0 ? k : mt.items.findIndex(it => !it.res);
  };
  function mtStep() {
    const mt = state.mailTest; if (!mt) return;
    if (dlg.open) dlg.close();
    state.mtOn = true;
    const k = mtCur();
    if (k >= 0) { mt.idx = k; const x = essQ(mt.items[k].id); if (x && !state.essOpen.includes(x.th.id)) state.essOpen.push(x.th.id); }
    save();
    if (location.hash !== '#essentiel') location.hash = 'essentiel'; else render();
  }
  function mtPanelHtml() {
    const mt = state.mailTest, k = mtCur();
    if (k < 0) {
      const c = mtCounts();
      const line = (n, one, many) => n ? `<li><b>${n}</b> ${n > 1 ? many : one}</li>` : '';
      return `<section class="mt-panel done" aria-labelledby="mt-h">
        <p class="eyebrow">Vos emails · vérification terminée</p>
        <h2 id="mt-h">Merci, c’est fait pour cette fois.</h2>
        <ul class="mt-recap">${line(c.yes, 'réponse confirmée', 'réponses confirmées')}${line(c.draft, 'gardée en brouillon', 'gardées en brouillon')}${line(c.no, 'écartée', 'écartées')}${line(c.skip, 'passée', 'passées')}</ul>
        ${mt.kept ? `<p class="muted-p">${mt.kept} question${mt.kept > 1 ? 's' : ''} déjà répondue${mt.kept > 1 ? 's' : ''}, laissée${mt.kept > 1 ? 's' : ''} telle${mt.kept > 1 ? 's' : ''} quelle${mt.kept > 1 ? 's' : ''}.</p>` : ''}
        <div class="mt-acts">${c.skip ? '<button type="button" class="ghost" data-act="mt-again">Revoir les passées</button>' : ''}<button type="button" class="btn plain" data-act="mt-end">Terminer</button></div>
      </section>`;
    }
    const it = mt.items[k], x = essQ(it.id);
    const { items, tail } = mtParse(it.raw);
    const note = items.length ? tail : '';
    const start = items.length ? mtAnswer(items, i => mtSure(items[i])) : it.raw;
    const done = mt.items.filter(y => y.res).length;
    mtAtt = attachBlock((state.ess[it.id] || {}).files);
    return `<section class="mt-panel" aria-labelledby="mt-h">
      <div class="mt-top"><p class="eyebrow">${ico('chat')}Vos emails · ${k + 1} sur ${mt.items.length}</p>
        <button type="button" class="linkbtn" data-act="mt-stop">Arrêter et reprendre plus tard</button></div>
      <span class="trk" aria-hidden="true"><b style="width:${Math.round(done / mt.items.length * 100)}%"></b></span>
      <form id="mt-form" class="mt-form">
        <p class="mt-th">${esc(x.th.t)}</p>
        <h2 id="mt-h">${esc(x.q)}</h2>
        <p class="mt-say"><b>Voilà ce que j’ai trouvé dans vos emails.</b>${it.conf === 'Indice' ? ' C’est un simple indice : à vérifier.' : ''}</p>
        ${items.length ? `<ul class="mt-list">${items.map((o, i) => `<li><label class="check"><input type="checkbox" class="mt-o" data-i="${i}" ${mtSure(o) ? 'checked' : ''}><span><b>${esc(o.name)}</b><small>${o.label ? esc(o.label) + ' · ' : ''}${esc(o.n)} mail${o.n === '1' ? '' : 's'}, dernier le ${esc(o.d)}</small></span></label></li>`).join('')}</ul>` : ''}
        ${note ? `<p class="mt-note">${esc(note)}</p>` : ''}
        ${it.sample ? `<p class="mt-src">Exemple de mail : « ${esc(it.sample)} »</p>` : ''}
        <div class="field"><label for="mt-a">Est-ce que vous confirmez ? Vous pouvez corriger la réponse.</label><textarea id="mt-a" name="a" style="min-height:84px">${esc(start)}</textarea></div>
        ${mtAtt.html}
        <div class="mt-acts">
          <button type="submit" class="btn plain" value="yes">${ico('check')}Oui, je confirme</button>
          <button type="submit" class="ghost" value="draft">Garder en brouillon</button>
          <button type="submit" class="ghost" value="no">Ce n’est pas ça</button>
          <button type="submit" class="linkbtn" value="skip">Passer</button>
        </div>
      </form>
    </section>`;
  }
  /* Après chaque affichage de la page en mode vérification. */
  function mtWire() {
    const mt = state.mailTest, form = $('#mt-form');
    const just = mtJust; mtJust = null;
    /* Après l'affichage (et après le retour en haut de page d'un changement d'adresse). */
    const top = $('.top').offsetHeight;
    const seen = el => { const r = el.getBoundingClientRect(); return r.top >= top + 20 && r.bottom <= innerHeight - 20; };
    const goTo = (el, smooth) => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - top - innerHeight * .25, behavior: smooth ? 'smooth' : 'auto' });
    setTimeout(() => {
      if (matchMedia('(max-width: 1040px)').matches) {
        const p = $('.mt-panel'); if (p && just) window.scrollTo({ top: scrollY + p.getBoundingClientRect().top - top - 12, behavior: 'smooth' });
        return;
      }
      const cur = $('.ess-list li.mt-cur'), done = just && $('.ess-list li.mt-just');
      if (!cur || seen(cur)) return;
      /* La réponse confirmée passe d'abord au vert sous les yeux, puis la liste avance. */
      if (done) { if (!seen(done)) goTo(done, false); setTimeout(() => { const c = $('.ess-list li.mt-cur'); if (c && !seen(c)) goTo(c, true); }, 1100); }
      else goTo(cur, false);
    }, 0);
    if (!form) return;
    const k = mtCur(), it = mt.items[k], x = essQ(it.id), att = mtAtt;
    const { items } = mtParse(it.raw);
    att.wire();
    const area = $('#mt-a');
    area.addEventListener('input', () => { area.dataset.touched = '1'; });
    form.querySelectorAll('.mt-o').forEach(c => c.addEventListener('change', () => {
      if (area.dataset.touched) return;
      const on = new Set([...form.querySelectorAll('.mt-o:checked')].map(b => +b.dataset.i));
      area.value = mtAnswer(items, i => on.has(i));
    }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const action = e.submitter ? e.submitter.value : 'yes';
      const text = String(area.value || '').trim();
      if ((action === 'yes' || action === 'draft') && !text && !att.count()) { toast('La réponse est vide : corrigez-la, ou choisissez « Ce n’est pas ça ».'); return; }
      it.res = action;
      if (action === 'yes' || action === 'draft') state.ess[it.id] = { a: text, na: false, to: 'all', src: 'mailtest', draft: action === 'draft', files: att.commit() };
      mt.idx = k + 1;
      const nk = mtCur();
      if (nk >= 0) { mt.idx = nk; const nx = essQ(mt.items[nk].id); if (nx && !state.essOpen.includes(nx.th.id)) state.essOpen.push(nx.th.id); }
      mtJust = { id: it.id, res: action };
      save(); render();
      if (action === 'yes') toast('Confirmé. Question suivante.');
      else if (action === 'draft') toast('Gardé en brouillon.');
    });
  }
  /* Choisir une autre proposition depuis la liste. */
  function mtGoto(id) {
    const mt = state.mailTest; if (!mt) return;
    const i = mt.items.findIndex(it => it.id === id); if (i < 0) return;
    if (mt.items[i].res === 'skip') delete mt.items[i].res;
    if (mt.items[i].res) return;
    mt.idx = i;
    mtStep();
  }
  /* Simulation de Gmail : l'analyse de test est dans la base de l'app, lisible par son seul propriétaire.
     Pour tout autre visiteur, le document n'existe pas : c'est l'exemple fictif qui s'affiche. */
  async function mtCloudItems() {
    const late = () => new Promise(r => setTimeout(() => r(null), 6000));
    try {
      if (!window.claude || !window.claude.use) return null;
      const db = await Promise.race([window.claude.use('db'), late()]);
      if (!db) return null;
      const snap = await Promise.race([db.doc('gmail-test/analyse').get(), late()]);
      const d = snap && snap.exists ? snap.data() : null;
      if (!d || !Array.isArray(d.items)) return null;
      const items = d.items.flatMap(r => { const x = ESS_ALL.find(y => y.q === r.q); return x ? [{ id: x.id, raw: r.raw, conf: r.conf, sample: r.sample }] : []; });
      return items.length ? items : null;
    } catch (e) { return null; }
  }
  function mailDlg() {
    openDlg(`
      <p class="eyebrow">Connecter ma boîte mail</p>
      <h2>Vos mails peuvent répondre à une partie des questions.</h2>
      <p class="muted">Vos factures, relevés et confirmations disent déjà où sont vos comptes, vos contrats et vos abonnements. Oralysse les repère et vous propose des réponses.</p>
      <ul class="receives">
        <li><span class="badge-ico" style="width:40px;height:40px">${ico('check')}</span><span><b>Ce que nous lisons :</b> l’expéditeur et l’objet des mails des banques, assureurs, fournisseurs et administrations.</span></li>
        <li><span class="badge-ico" style="width:40px;height:40px">${ico('lock')}</span><span><b>Ce que nous ne faisons jamais :</b> lire vos échanges personnels, envoyer un mail, conserver vos messages.</span></li>
        <li><span class="badge-ico" style="width:40px;height:40px">${ico('shield')}</span><span><b>Vous gardez la main :</b> chaque réponse proposée attend votre accord. Vous pouvez déconnecter votre boîte à tout moment.</span></li>
      </ul>
      <fieldset class="seg"><legend>Votre messagerie</legend><div>
        <label><input type="radio" name="prov" value="Gmail" checked><span>Gmail</span></label>
        <label><input type="radio" name="prov" value="Outlook"><span>Outlook</span></label>
        <label><input type="radio" name="prov" value="Autre messagerie"><span>Autre messagerie</span></label></div></fieldset>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Plus tard</button>
        <button type="submit" class="btn plain" value="ok">Autoriser la lecture</button>
      </div>`, fd => {
      state.mail = { prov: String(fd.get('prov') || 'Gmail'), at: Date.now(), scanning: true };
      save(); render(); toast('Analyse de votre boîte mail…');
      (async () => {
        const [cloud] = await Promise.all([mtCloudItems(), new Promise(r => setTimeout(r, 1600))]);
        if (!state.mail) return;
        const email = (state.account && state.account.email) || 'votre adresse';
        const items = cloud || Object.keys(MAIL_PROPS).filter(id => !essHas(id)).map(id => ({ id, raw: MAIL_PROPS[id][0] || `Cette adresse : ${email}.`, conf: 'Forte', sample: MAIL_PROPS[id][1] }));
        state.mail.scanning = false; state.mail.count = items.length;
        state.mailTest = { items, idx: 0, kept: 0 };
        save(); render();
        if (items.length) mtStep(); else toast('Rien de nouveau dans vos mails.');
      })();
    });
  }

  /* ---------- Vue : transmission ---------- */
  function viewTransmission() {
    const U = state.user.name || 'Votre proche';
    const intro = `<p class="eyebrow">Transmission</p>
      <h1>Le moment venu, chacun reçoit sa part. <em>Rien d’autre.</em></h1>`;
    const head = lead => heroHtml('mer', 'La mer bleu sombre jusqu’à l’horizon', `${intro}<span class="rule"></span><p class="lead">${lead}</p>`);
    if (!state.people.length) {
      return `<div class="wrap page">${head('Désignez une personne de confiance pour voir ce qu’elle recevra le moment venu.')}
        <button type="button" class="btn plain" data-act="people" style="align-self:flex-start">Désigner une personne de confiance</button>
      </div>`;
    }
    const P = state.people.find(p => p.id === state.viewAs) || state.people[0];
    const forP = it => !it.to || it.to === 'all' || it.to === P.id;
    const sec = id => (state.sections.find(s => s.id === id) || { items: [] }).items;
    const ready = id => sec(id).filter(it => it.done && forP(it));
    const msgs = ready('messages'), vols = ready('volontes');
    const others = ready('acces').map(o => ['acces', 'laptop', o]).concat(ready('documents').map(o => ['documents', 'doc', o]));
    const drafts = ['messages', 'volontes', 'acces', 'documents'].flatMap(id => sec(id).filter(it => !it.done && it.text && forP(it)));
    const env = m => m.when === 'later'
      ? `<div class="env locked">${ico('lock')}<b>${esc(m.label)}</b><span>À ouvrir : ${esc(m.occasion || 'plus tard')}</span></div>`
      : `<button type="button" class="env" data-read="messages:${m.id}">${ico(KIND_ICO[m.kind || 'texte'])}<b>${esc(m.label)}</b><span>De ${esc(U)} · ${m.kind === 'video' ? 'Regarder la vidéo' : m.kind === 'audio' ? 'Écouter le message' : 'Ouvrir le message'}${m.music && m.music.title ? ' · avec une musique' : ''}</span></button>`;
    return `<div class="wrap page">${head('Choisissez une personne pour voir exactement ce qu’elle découvrira, et rien de plus.')}
      <div class="asbar" role="group" aria-label="Voir comme">
        <span class="muted-p">Voir comme</span>
        ${state.people.map(p => `<button type="button" class="aspill" data-viewas="${p.id}" aria-pressed="${p.id === P.id}"><span class="ini">${esc(p.name[0])}</span>${esc(p.name)}</button>`).join('')}
      </div>
      <div class="two">
        <section class="card space" aria-label="Espace de ${esc(P.name)}">
          <header class="space-top"><span class="space-logo">ORALYSSE</span><span>Espace de ${esc(P.name)}</span></header>
          <div class="space-body">
            <div class="letter">
              <p class="eyebrow" style="margin-bottom:12px">Le premier message que verra ${esc(P.name)}</p>
              <p>${esc(P.name)}, ${esc(U)} a pris le temps de préparer des choses pour vous. Elles vous attendent ici, à votre rythme. Rien ne presse.</p>
              <small>Texte provisoire : le message d’accueil définitif est en cours d’écriture.</small>
            </div>
            <div><h3>Messages pour vous</h3>
              ${msgs.length ? `<div class="envs">${msgs.map(env).join('')}</div>` : `<p class="muted-p">Aucun message pour ${esc(P.name)} pour l’instant.</p>`}</div>
            <div><h3>Volontés que ${esc(U)} vous confie</h3>
              ${vols.length ? `<ul class="olist">${vols.map(v => `<li><button type="button" class="orow" data-read="volontes:${v.id}">${ico('doc')}<span>${esc(v.label)}</span>${ico('chev')}</button></li>`).join('')}</ul>` : '<p class="muted-p">Aucune volonté partagée pour l’instant.</p>'}</div>
            ${(() => { const ths = ESS.filter(th => th.q.some((_, i) => { const a = state.ess[th.id + '-' + i]; return a && (a.a || (a.files && a.files.length)) && !a.draft && (!a.to || a.to === 'all' || a.to === P.id); }));
              return ths.length ? `<div><h3>Ce que ${esc(U)} vous a laissé à savoir</h3><ul class="olist">${ths.map(th => `<li><button type="button" class="orow" data-readess="${th.id}">${ico(th.icon)}<span>${th.t}</span>${ico('chev')}</button></li>`).join('')}</ul></div>` : ''; })()}
            ${others.length ? `<div><h3>Accès et documents</h3><ul class="olist">${others.map(([sid, icon, o]) => `<li><button type="button" class="orow" data-read="${sid}:${o.id}">${ico(icon)}<span>${esc(o.label)}</span>${ico('chev')}</button></li>`).join('')}</ul></div>` : ''}
          </div>
        </section>
        <div style="display:flex;flex-direction:column;gap:20px">
          ${helpCallHtml()}
          <div class="card panel">
            <h3 style="font-size:22px;margin-bottom:8px">Ce que ${esc(P.name)} ne voit pas</h3>
            <p style="color:var(--muted)">Les éléments réservés à d’autres personnes, et vos brouillons : seuls les éléments marqués comme prêts sont transmis.</p>
            ${drafts.length ? `<ul class="olist" style="margin-top:12px">${drafts.map(d => `<li class="muted-p">${ico('path')}En préparation : ${esc(d.label)}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="card panel">
          <ol class="timeline">
            <li><span class="num">1</span><div><h3>Identification</h3><p>Oralysse identifie le décès à partir des actes officiels, ou parce qu’une personne de confiance le signale.</p></div></li>
            <li><span class="num">2</span><div><h3>Confirmation</h3><p>Confirmation formelle auprès des services concernés et des personnes de confiance.</p></div></li>
            <li><span class="num">3</span><div><h3>Transmission</h3><p>Après un délai de 7 jours, chacun est prévenu et accède aux informations et instructions laissées à son attention.</p></div></li>
          </ol>
          </div>
        </div>
      </div>
    </div>`;
  }
  function readItem(sid, id) {
    const it = (state.sections.find(s => s.id === sid) || { items: [] }).items.find(x => x.id === id);
    if (!it) return;
    const P = state.people.find(p => p.id === state.viewAs) || state.people[0];
    const U = state.user.name || 'Votre proche';
    const isM = sid === 'messages', k = it.kind || 'texte', mu = it.music && it.music.title ? it.music : null;
    const hasMedia = isM && k !== 'texte' && it.media;
    const player = !hasMedia ? '' : it.media.demo
      ? `<div class="player demo ${k}" id="rd-media"><button type="button" class="pbtn" id="rd-play" aria-label="Lire">${ico('play')}</button>
          <div class="pinfo"><div class="pbar"><i id="rd-bar"></i></div><small>${k === 'video' ? 'Vidéo' : 'Message audio'} de ${esc(U)} · ${fmtDur(it.media.dur)} · aperçu de démonstration</small></div></div>`
      : `<div class="player" id="rd-media"><p class="muted-p">Chargement…</p></div>`;
    const music = !mu ? '' : `<div class="musicchip"><p>${ico('music')}<span><b>${esc(mu.title)}</b>${mu.artist ? ` · ${esc(mu.artist)}` : ''}<br>
        <small>La musique choisie par ${esc(U)}, ${MUSIC_WHEN[mu.when] || MUSIC_WHEN.during}.</small></span></p>
        <div id="rd-music">${mu.fileName ? '' : '<small>Écoutez-la sur votre service de musique habituel.</small>'}</div></div>`;
    const text = it.text ? `<p style="white-space:pre-line">${esc(it.text)}</p>` : '';
    const body = sid === 'volontes' ? volRows(it)
      : `${text}${it.fileName ? `<small>Document joint : ${esc(it.fileName)}</small>` : ''}`;
    openDlg(`
      <p class="eyebrow">De ${esc(U)} · pour ${esc(P ? P.name : 'vous')}</p>
      <h2>${esc(it.label)}</h2>
      ${player}
      ${body ? `<div class="letter">${body}</div>` : ''}
      ${music}
      <div class="dlg-actions"><button type="submit" class="btn plain" value="cancel">Fermer</button></div>`, () => {});
    if (!isM) return;
    /* Musique : fichier importé si disponible ; « pendant » l’accompagne en fond, plus doucement. */
    let bg = null;
    const playBg = on => { if (!bg || !mu || mu.when !== 'during') return; if (on) { bg.volume = hasMedia ? .25 : .6; bg.play().catch(() => {}); } else bg.pause(); };
    if (mu && mu.fileName) mediaGet(it.id + '-music').then(b => {
      const box = $('#rd-music', dlg); if (!box) return;
      if (!b) { box.innerHTML = '<small>Le morceau est conservé sur l’appareil où il a été ajouté (démo).</small>'; return; }
      box.innerHTML = `<audio controls preload="metadata" src="${urlOf(b)}"></audio>`;
      bg = box.querySelector('audio');
      if (!hasMedia) playBg(true);
    });
    if (hasMedia && it.media.demo) {
      $('#rd-play', dlg).addEventListener('click', e => {
        const btn = e.currentTarget, bar = $('#rd-bar', dlg); btn.hidden = true;
        bar.style.transition = 'none'; bar.style.width = '0';
        requestAnimationFrame(() => { bar.style.transition = 'width 6s linear'; bar.style.width = '100%'; });
        playBg(true);
        toast('Lecture simulée : dans la démo, aucun fichier réel n’est enregistré.');
        setTimeout(() => { btn.hidden = false; playBg(false); }, 6000);
      });
    } else if (hasMedia) {
      mediaGet(it.id).then(b => {
        const box = $('#rd-media', dlg); if (!box) return;
        if (!b) { box.innerHTML = '<p class="muted-p">Ce fichier est conservé sur l’appareil où il a été enregistré (démo).</p>'; return; }
        box.innerHTML = k === 'video' ? `<video controls playsinline preload="metadata" src="${urlOf(b)}"></video>` : `<audio controls preload="metadata" src="${urlOf(b)}"></audio>`;
        const m = box.querySelector('video, audio');
        m.addEventListener('play', () => playBg(true)); m.addEventListener('pause', () => playBg(false)); m.addEventListener('ended', () => playBg(false));
      });
    }
  }

  /* Bloc d'appel, sur l'accueil et la page Transmission. */
  const helpCallHtml = () => `<aside class="help-call" aria-label="Besoin d’aide">${ico('phone')}<div><h3>Besoin d’aide ?</h3><p>Une personne de l’équipe Oralysse vous répond au</p><a class="help-tel" href="tel:+33145227219">01 45 22 72 19</a></div></aside>`;

  /* ---------- Vue : aide ---------- */
  function viewAide() {
    const faq = [
      ['Qui peut voir ce que je dépose ?', 'Personne de votre vivant. Le moment venu, chaque destinataire ne reçoit que ce que vous lui avez destiné, après vérification du décès.'],
      ['Comment le décès est-il vérifié ?', 'Oralysse identifie le décès à partir des actes officiels, ou parce qu’une personne de confiance le signale. Il est ensuite confirmé formellement auprès des services concernés et des personnes de confiance. Après un délai de 7 jours, chacun est prévenu et accède à ce qui lui est destiné.'],
      ['Oralysse remplace-t-il un notaire ?', 'Non. Oralysse ne rédige aucun acte. Pour un testament, nous vous orientons vers un notaire partenaire, qui l’inscrit au fichier central des dispositions de dernières volontés.'],
      ['Mes mots de passe sont-ils stockés ?', 'Non. Vous rédigez des consignes pour vos comptes, et vos proches suivent les procédures officielles de chaque service.'],
      ['Puis-je tout modifier plus tard ?', 'Oui, à tout moment. Votre coffre évolue avec votre vie.']
    ];
    return `<div class="wrap page">
      ${heroHtml('ciel', 'Un grand nuage blanc dans un ciel bleu profond', '<p class="eyebrow">Aide</p><h1>Vos questions, <em>nos réponses.</em></h1>')}
      <div class="two">
        <div>${faq.map(([q, a]) => `<details class="faq"><summary>${q}${ico('chev', 'ico chev')}</summary><p>${a}</p></details>`).join('')}</div>
        <div class="card panel" style="display:flex;flex-direction:column;gap:12px">
          <h3 style="font-size:26px">Besoin d’en parler ?</h3>
          <p class="muted" style="color:var(--muted)">Une personne de l’équipe Oralysse vous répond au <a class="help-tel" href="tel:+33145227219">01 45 22 72 19</a>, ou peut vous rappeler pour vous accompagner.</p>
          <button type="button" class="btn plain" data-act="callback" style="align-self:flex-start">Être rappelé·e</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Rendu et navigation ---------- */
  const tabView = id => () => viewRubric(id);
  const VIEWS = { coffre: viewCoffre, volontes: tabView('volontes'), essentiel: tabView('essentiel'), messages: tabView('messages'), acces: tabView('acces'), documents: tabView('documents'), personnes: viewPersonnes, compte: viewCompte, depart: viewParcours, transmission: viewTransmission, aide: viewAide };
  function route() {
    if (state.onboarded === false) return state.signup ? 'compte' : 'depart';
    const v = location.hash.slice(1); return VIEWS[v] ? v : 'coffre';
  }
  function render() {
    const v = route();
    $('#app').innerHTML = VIEWS[v]();
    document.body.classList.toggle('vault', v !== 'depart' && v !== 'compte');
    document.documentElement.style.setProperty('--toph', $('.top').offsetHeight + 'px');
    const full = state.user.full || state.user.name;
    const ini = full ? full.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase() : '·';
    $('#user-btn').innerHTML = `<span class="avatar" aria-hidden="true">${esc(ini)}</span>${esc(full || 'Mon compte')}${ico('down')}`;
    $('#nav-rubs').innerHTML = navRubsHtml();
    document.querySelectorAll('.nav a').forEach(a => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    /* Mon coffre reste souligné partout dedans. */
    const inCoffre = v === 'coffre' || tabList().some(t => t.id === v);
    $('.nav-root').classList.toggle('open', inCoffre);
    if (v === 'essentiel' && $('.mt-mode')) mtWire();
  }
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

  /* ---------- Fenêtres ---------- */
  const dlg = $('#dlg');
  /* Fermer la fenêtre coupe tout son et tout enregistrement en cours. */
  let dlgCleanup = null;
  dlg.addEventListener('close', () => {
    dlg.querySelectorAll('audio, video').forEach(m => { try { m.pause(); } catch (e) {} });
    if (dlgCleanup) { const f = dlgCleanup; dlgCleanup = null; f(); }
  });
  function openDlg(html, onSubmit) {
    dlg.innerHTML = `<form class="dlg" method="dialog">${html}</form>`;
    const form = dlg.querySelector('form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = e.submitter;
      if (btn && btn.value === 'cancel') { dlg.close(); return; }
      if (onSubmit(new FormData(form), btn ? btn.value : '') !== false) dlg.close();
    });
    dlg.showModal();
    const f = dlg.querySelector('input:not([type]), input[type="text"], textarea'); if (f) f.focus();
  }
  /* Valeurs proposées par défaut, que l’on garde ou que l’on modifie. */
  const DEF_TITLE = { messages: 'Pour un proche', acces: 'Un compte en ligne', documents: 'Un document important' };
  const DEF_TEXT = {
    messages: 'Si tu lis ces mots, sache combien je t’aime et combien je suis fier·e de toi. Prends soin de toi, et de ceux qui t’entourent.',
    acces: 'Merci de conserver ce qui compte (photos, messages, souvenirs), puis de fermer ce compte en suivant la procédure officielle du service.',
    documents: 'L’original est rangé chez moi, dans le classeur des papiers importants.'
  };
  function editMessage(iid) {
    const s = state.sections.find(x => x.id === 'messages');
    const isNew = !iid;
    const it = isNew ? { id: uid(), label: '', done: false, text: '', kind: 'texte' } : s.items.find(x => x.id === iid);
    const mu = it.music || {};
    let media = it.media || null, blob = null, mBlob = null, rec = null, stream = null, timer = 0, t0 = 0, cancelled = false;
    const toOpts = [['all', state.people.length ? 'Toutes mes personnes de confiance' : 'Mes personnes de confiance, une fois désignées']]
      .concat(state.people.map(p => [p.id, p.name + ' uniquement']));
    const radio = (name, v, label, cur) => `<label><input type="radio" name="${name}" value="${v}" ${cur === v ? 'checked' : ''}><span>${label}</span></label>`;
    const k0 = it.kind || 'texte';
    openDlg(`
      <p class="eyebrow">Messages</p>
      <h2>${isNew ? 'Laisser un nouveau message' : esc(it.label)}</h2>
      ${isNew ? `<div class="field"><label for="f-label">Titre</label><input id="f-label" name="label" required value="${esc(DEF_TITLE.messages)}" placeholder="Pour…"></div>` : ''}
      <fieldset class="seg"><legend>Sous quelle forme</legend><div>
        ${radio('kind', 'texte', `${ico('chat')}&nbsp;Écrit`, k0)}${radio('kind', 'audio', `${ico('mic')}&nbsp;Audio, avec votre voix`, k0)}${radio('kind', 'video', `${ico('video')}&nbsp;Vidéo`, k0)}
      </div></fieldset>
      <div class="rec" id="rec" ${k0 === 'texte' ? 'hidden' : ''}>
        <div class="rec-stage" id="rec-stage" aria-live="polite"></div>
        <div class="rec-bar">
          <button type="button" class="btn plain" id="rec-go"></button>
          <span class="rec-time" id="rec-time"></span>
          <label class="add rec-file">${ico('plus')}Importer un fichier<input type="file" id="rec-file" accept="audio/*,video/*" hidden></label>
        </div>
        <p class="muted" style="font-size:14px">Prenez votre temps : vous pouvez réécouter et recommencer autant de fois que vous le voulez. 10 minutes au plus.</p>
      </div>
      <div class="field"><label for="f-text" id="f-text-l">${k0 === 'texte' ? 'Votre message' : 'Quelques mots pour accompagner (facultatif)'}</label>
        <textarea id="f-text" name="text" placeholder="Écrivez ici, à votre rythme.">${esc(isNew ? DEF_TEXT.messages : it.text || '')}</textarea></div>
      <details class="music" ${mu.title ? 'open' : ''}><summary>${ico('music')}Ajouter une musique <small>facultatif</small></summary>
        <div class="mbody">
          <div class="mgrid">
            <div class="field"><label for="f-mt">Titre du morceau</label><input id="f-mt" name="mtitle" value="${esc(mu.title || '')}" placeholder="La chanson de notre mariage"></div>
            <div class="field"><label for="f-ma">Artiste</label><input id="f-ma" name="martist" value="${esc(mu.artist || '')}" placeholder="Facultatif"></div>
          </div>
          <div class="field"><label for="f-mf">Le morceau lui-même (facultatif)</label><input id="f-mf" name="mfile" type="file" accept="audio/*">
            ${mu.fileName ? `<p class="muted" style="font-size:14px">Fichier actuel : ${esc(mu.fileName)}</p>` : ''}</div>
          <fieldset class="seg"><legend>Quand l’écouter</legend><div>
            ${radio('mwhen', 'during', 'Pendant le message', mu.when || 'during')}${radio('mwhen', 'before', 'Avant, en ouverture', mu.when || 'during')}${radio('mwhen', 'after', 'Après, pour finir', mu.when || 'during')}
          </div></fieldset>
          <p class="muted" style="font-size:14px">Sans fichier, vos proches verront le titre et pourront l’écouter sur leur service de musique.</p>
        </div>
      </details>
      <div class="field"><label for="f-to">Pour qui</label>
        <select id="f-to" name="to">${toOpts.map(([v, l]) => `<option value="${v}" ${(it.to || 'all') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      <fieldset class="seg"><legend>Quand le transmettre</legend><div>
        ${radio('when', 'now', 'Dès la transmission', it.when === 'later' ? 'later' : 'now')}${radio('when', 'later', 'À une date ou une occasion', it.when === 'later' ? 'later' : 'now')}</div></fieldset>
      <div class="field"><label for="f-occ">Date ou occasion (si plus tard)</label><input id="f-occ" name="occasion" value="${esc(it.occasion || '')}" placeholder="Le jour de ses 30 ans, de son mariage…"></div>
      <p class="muted" style="font-size:14px">${ico('shield')} Chiffré. Transmis seulement après vérification, à la personne que vous choisissez.</p>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Annuler</button>
        <button type="submit" class="ghost" value="draft">Enregistrer le brouillon</button>
        <button type="submit" class="btn plain" value="done">Marquer comme prêt</button>
      </div>`, (fd, action) => {
      const k = String(fd.get('kind') || 'texte');
      if (rec) { toast('Arrêtez d’abord l’enregistrement.'); return false; }
      const ok = media && media.kind === k;
      if (action === 'done' && k !== 'texte' && !ok) { toast(k === 'video' ? 'Enregistrez ou importez une vidéo avant de marquer ce message comme prêt.' : 'Enregistrez ou importez votre message audio avant de le marquer comme prêt.'); return false; }
      it.kind = k;
      it.media = k !== 'texte' && ok ? media : null;
      if (it.media && blob) mediaPut(it.id, blob);
      const mt = String(fd.get('mtitle') || '').trim(), mf = fd.get('mfile');
      const mfName = mf && mf.name ? mf.name : (mu.fileName || '');
      if (mf && mf.name) mediaPut(it.id + '-music', mf);
      it.music = mt || mfName ? { title: mt || mfName.replace(/\.[^.]+$/, ''), artist: String(fd.get('martist') || '').trim(), when: String(fd.get('mwhen') || 'during'), fileName: mfName } : null;
      it.text = String(fd.get('text') || '').trim();
      if (isNew) it.label = String(fd.get('label') || '').trim() || 'Sans titre';
      it.to = String(fd.get('to') || 'all');
      it.when = fd.get('when') === 'later' ? 'later' : 'now';
      it.occasion = String(fd.get('occasion') || '').trim();
      it.done = action === 'done';
      if (isNew) s.items.push(it);
      if (!state.open.includes('messages')) state.open.push('messages');
      save(); render();
      toast(it.done ? `« ${it.label} » est prêt.` : 'Brouillon enregistré.');
    });
    const form = $('form', dlg), stageEl = $('#rec-stage', dlg), go = $('#rec-go', dlg), time = $('#rec-time', dlg);
    const kindNow = () => (form.querySelector('input[name="kind"]:checked') || {}).value || 'texte';
    const stopStream = () => { if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; clearInterval(timer); };
    dlgCleanup = () => { cancelled = true; if (rec && rec.state !== 'inactive') { try { rec.stop(); } catch (e) {} } rec = null; stopStream(); };
    function stage() {
      const k = kindNow(); if (k === 'texte' || rec) return;
      const has = media && media.kind === k;
      time.className = 'rec-time'; time.textContent = has && !media.demo ? `${media.name || KIND_LBL[k]}${media.dur ? ' · ' + fmtDur(media.dur) : ''}` : '';
      go.innerHTML = has ? 'Recommencer' : `${ico(k === 'video' ? 'video' : 'mic')}&nbsp;${k === 'video' ? 'Commencer à filmer' : 'Commencer l’enregistrement'}`;
      if (has && blob) stageEl.innerHTML = k === 'video' ? `<video controls playsinline src="${urlOf(blob)}"></video>` : `<audio controls src="${urlOf(blob)}"></audio>`;
      else if (has && media.demo) stageEl.innerHTML = `<span class="pulse">${ico(KIND_ICO[k])}</span><span>${k === 'video' ? 'Vidéo' : 'Message audio'} prêt${k === 'video' ? 'e' : ''} · ${fmtDur(media.dur)}<br><small>Aperçu de démonstration, sans fichier réel.</small></span>`;
      else if (has) stageEl.innerHTML = `<span class="pulse">${ico(KIND_ICO[k])}</span><span>${esc(media.name || '')}</span>`;
      else stageEl.innerHTML = `<span class="pulse">${ico(KIND_ICO[k])}</span><span>${k === 'video' ? 'Installez-vous face à la caméra, dans un endroit calme et lumineux.' : 'Installez-vous dans un endroit calme, puis parlez simplement, comme à eux.'}</span>`;
    }
    function liveTick() { const s2 = Math.round((Date.now() - t0) / 1000); time.className = 'rec-time live'; time.textContent = `● Enregistrement · ${fmtDur(s2) || '0 s'}`; if (s2 >= 600 && rec) rec.stop(); }
    function simulate(k) {
      stageEl.innerHTML = `<span class="pulse live">${ico(KIND_ICO[k])}</span><span>Enregistrement simulé pour la démo…</span>`;
      go.disabled = true; t0 = Date.now(); timer = setInterval(liveTick, 250);
      setTimeout(() => {
        clearInterval(timer); go.disabled = false; if (cancelled) return;
        media = { kind: k, name: k === 'video' ? 'Vidéo enregistrée' : 'Enregistrement audio', dur: k === 'video' ? 72 : 48, demo: true }; blob = null; stage();
      }, 2200);
    }
    /* Dire pourquoi l’enregistrement est impossible, au lieu de simuler en silence. */
    function blocked(k, e) {
      const dev = k === 'video' ? 'la caméra' : 'le micro', feat = k === 'video' ? 'camera' : 'microphone';
      const fp = document.featurePolicy;
      const framed = (() => { try { return window.top !== window; } catch (x) { return true; } })();
      const policy = fp && fp.allowsFeature ? !fp.allowsFeature(feat) : false;
      const name = e && e.name || '';
      let why;
      if (!window.isSecureContext || !navigator.mediaDevices) why = `Cette page n’est pas ouverte dans un contexte sécurisé : le navigateur n’y autorise pas ${dev}.`;
      else if (policy || (framed && name === 'NotAllowedError')) why = `Cet aperçu (la page est affichée dans un cadre de claude.ai) n’a pas le droit d’utiliser ${dev} : le navigateur refuse sans rien vous demander. Pour enregistrer pour de vrai, ouvrez le fichier de l’app directement dans Chrome ou Edge.`;
      else if (name === 'NotAllowedError') why = `L’accès à ${dev} a été refusé. Autorisez-le depuis l’icône à gauche de l’adresse, puis réessayez.`;
      else if (name === 'NotFoundError') why = `Aucun${k === 'video' ? 'e caméra' : ' micro'} n’a été trouvé${k === 'video' ? 'e' : ''} sur cet appareil.`;
      else if (name === 'NotReadableError') why = `${dev[0].toUpperCase() + dev.slice(1)} est déjà utilisé${k === 'video' ? 'e' : ''} par une autre application.`;
      else why = `Le navigateur n’a pas permis d’utiliser ${dev}${name ? ` (${esc(name)})` : ''}.`;
      stageEl.innerHTML = `<span class="pulse">${ico(KIND_ICO[k])}</span><span>${why}<br><small>Vous pouvez importer un fichier enregistré avec votre téléphone, ou simuler l’enregistrement pour la démo.</small></span>
        <button type="button" class="mini" id="rec-sim">Simuler un enregistrement</button>`;
      $('#rec-sim', dlg).addEventListener('click', () => simulate(k));
    }
    async function start() {
      const k = kindNow();
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) throw new Error('indisponible');
        stream = await navigator.mediaDevices.getUserMedia(k === 'video' ? { audio: true, video: { width: 1280, height: 720 } } : { audio: true });
      } catch (e) { blocked(k, e); return; }
      if (cancelled) { stopStream(); return; }
      const chunks = []; rec = new MediaRecorder(stream);
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        const mime = (rec && rec.mimeType) || (k === 'video' ? 'video/webm' : 'audio/webm');
        const dur = Math.max(1, Math.round((Date.now() - t0) / 1000));
        rec = null; stopStream(); if (cancelled) return;
        blob = new Blob(chunks, { type: mime });
        media = { kind: k, name: k === 'video' ? 'Vidéo enregistrée' : 'Enregistrement audio', dur, mime }; stage();
      };
      if (k === 'video') { stageEl.innerHTML = '<video muted autoplay playsinline></video>'; stageEl.querySelector('video').srcObject = stream; }
      else stageEl.innerHTML = `<span class="pulse live">${ico('mic')}</span><span>Je vous écoute…</span>`;
      rec.start(); t0 = Date.now(); go.textContent = 'Arrêter'; liveTick(); timer = setInterval(liveTick, 250);
    }
    go.addEventListener('click', () => { if (rec) rec.stop(); else start(); });
    $('#rec-file', dlg).addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const k = /^video\//.test(f.type) ? 'video' : /^audio\//.test(f.type) ? 'audio' : '';
      if (!k) { toast('Choisissez un fichier audio ou vidéo.'); return; }
      form.querySelector(`input[name="kind"][value="${k}"]`).checked = true; onKind();
      blob = f; media = { kind: k, name: f.name, dur: 0, mime: f.type }; stage();
      const probe = document.createElement(k); probe.preload = 'metadata';
      probe.onloadedmetadata = () => { if (isFinite(probe.duration) && media && media.name === f.name) { media.dur = Math.round(probe.duration); stage(); } };
      probe.src = urlOf(f);
    });
    function onKind() {
      const k = kindNow();
      if (rec) rec.stop();
      $('#rec', dlg).hidden = k === 'texte';
      $('#f-text-l', dlg).textContent = k === 'texte' ? 'Votre message' : 'Quelques mots pour accompagner (facultatif)';
      const ta = $('#f-text', dlg); if (k !== 'texte' && ta.value.trim() === DEF_TEXT.messages) ta.value = '';
      stage();
    }
    form.querySelectorAll('input[name="kind"]').forEach(r => r.addEventListener('change', onKind));
    $('#f-mf', dlg).addEventListener('change', e => { const f = e.target.files[0], t = $('#f-mt', dlg); if (f && !t.value.trim()) t.value = f.name.replace(/\.[^.]+$/, ''); });
    if (media && !media.demo) mediaGet(it.id).then(b => { if (b && !blob && !rec) { blob = b; stage(); } });
    stage();
  }
  /* Depuis Mon coffre, on entre d'abord dans la rubrique avant d'ouvrir l'élément. */
  function goRubric(sid) {
    if (location.hash === '#' + sid) return;
    location.hash = sid; render(); window.scrollTo(0, 0);
  }
  function editItem(sid, iid) {
    if (sid === 'volontes') return editVolonte(iid);
    if (sid === 'messages') return editMessage(iid);
    const s = state.sections.find(x => x.id === sid);
    const isNew = !iid;
    const it = isNew ? { id: uid(), label: '', done: false, text: '', fileName: '' } : s.items.find(x => x.id === iid);
    const fileField = s.file ? `<div class="field"><label for="f-file">Fichier</label><input id="f-file" name="file" type="file">${it.fileName ? `<p class="muted" style="font-size:14px">Fichier actuel : ${esc(it.fileName)}</p>` : ''}</div>` : '';
    const toOpts = [['all', state.people.length ? 'Toutes mes personnes de confiance' : 'Mes personnes de confiance, une fois désignées']]
      .concat(state.people.map(p => [p.id, p.name + ' uniquement']));
    const toField = `<div class="field"><label for="f-to">${sid === 'messages' ? 'Pour qui' : 'Qui pourra y accéder'}</label>
      <select id="f-to" name="to">${toOpts.map(([v, l]) => `<option value="${v}" ${(it.to || 'all') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
    const whenField = sid !== 'messages' ? '' : `<fieldset class="seg"><legend>Quand le transmettre</legend><div>
        <label><input type="radio" name="when" value="now" ${it.when !== 'later' ? 'checked' : ''}><span>Dès la transmission</span></label>
        <label><input type="radio" name="when" value="later" ${it.when === 'later' ? 'checked' : ''}><span>À une date ou une occasion</span></label></div></fieldset>
      <div class="field"><label for="f-occ">Date ou occasion (si plus tard)</label><input id="f-occ" name="occasion" value="${esc(it.occasion || '')}" placeholder="Le jour de ses 30 ans, de son mariage…"></div>`;
    openDlg(`
      <p class="eyebrow">${s.title}</p>
      <h2>${isNew ? s.add : esc(it.label)}</h2>
      ${isNew ? `<div class="field"><label for="f-label">Titre</label><input id="f-label" name="label" required value="${esc(DEF_TITLE[sid] || '')}" placeholder="${sid === 'messages' ? 'Pour…' : 'Nom'}"></div>` : ''}
      ${fileField}
      <div class="field"><label for="f-text">${sid === 'messages' ? 'Votre message' : sid === 'acces' ? 'Vos consignes' : 'Précisions'}</label>
        <textarea id="f-text" name="text" placeholder="${sid === 'acces' ? 'Que faire de ce compte, et qui doit s’en occuper ?' : 'Écrivez ici, à votre rythme.'}">${esc(it.text || DEF_TEXT[sid] || '')}</textarea></div>
      ${toField}${whenField}
      <p class="muted" style="font-size:14px">${ico('shield')} Chiffré. Transmis seulement après vérification, à la personne que vous choisissez.</p>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Annuler</button>
        <button type="submit" class="ghost" value="draft">Enregistrer le brouillon</button>
        <button type="submit" class="btn plain" value="done">Marquer comme prêt</button>
      </div>`, (fd, action) => {
      it.text = String(fd.get('text') || '').trim();
      if (isNew) it.label = String(fd.get('label') || '').trim() || 'Sans titre';
      const file = fd.get('file'); if (file && file.name) it.fileName = file.name;
      it.to = String(fd.get('to') || 'all');
      if (sid === 'messages') { it.when = fd.get('when') === 'later' ? 'later' : 'now'; it.occasion = String(fd.get('occasion') || '').trim(); }
      it.done = action === 'done';
      if (isNew) s.items.push(it);
      if (!state.open.includes(sid)) state.open.push(sid);
      save(); render();
      toast(it.done ? `« ${it.label} » est prêt.` : 'Brouillon enregistré.');
    });
  }
  const PKINDS = {
    proche: ['Proche', 'Mon fils, ma sœur, un ami d’enfance…'],
    notaire: ['Notaire', 'Notaire de la famille depuis la vente de la maison…'],
    avocat: ['Avocat·e', 'Me conseille pour mes affaires personnelles…'],
    financier: ['Conseil financier ou banque', 'Suit mon épargne depuis dix ans…'],
    comptable: ['Expert-comptable', 'Tient les comptes de ma société…'],
    medecin: ['Médecin', 'Mon médecin traitant, connaît mes directives anticipées…'],
    executeur: ['Exécuteur testamentaire', 'Chargé de veiller au respect de mon testament…'],
    autre: ['Autre', 'Décrivez ce qui vous lie à cette personne…']
  };
  const pKindLabel = p => p.kind === 'autre' ? (p.kindOther || 'Autre') : (PKINDS[p.kind] || PKINDS.proche)[0];
  const pContact = p => [
    [p.email, p.phone && p.phone.replace(/ /g, ' ')].filter(Boolean).join(' · '),
    String(p.address || '').trim().replace(/\s*\n+\s*/g, ', '),
    p.notes
  ].filter(Boolean).map(l => esc(l)).join('<br>');
  function viewPersonnes() {
    const n = state.people.length, ok = state.people.filter(p => p.status === 'accepted').length;
    const row = p => `<li>
        <span class="pwho"><span class="avatar" aria-hidden="true">${esc(p.name[0])}</span>
          <span class="grow"><span class="pname"><b>${esc(p.name)}</b><span class="tag ${p.status === 'accepted' ? 'ok' : ''}">${p.status === 'accepted' ? 'Invitation acceptée' : 'Invitation envoyée'}</span></span><span class="kick">${esc(pKindLabel(p))}</span>${p.relation ? `<br><span class="pcontact">${esc(p.relation)}</span>` : ''}</span></span>
        <span class="pcontact pcoord">${pContact(p)}</span>
        <span class="pacts"><button type="button" class="mini" data-pedit="${p.id}">Modifier</button>${p.status === 'accepted' ? '' : `<button type="button" class="mini" data-relance="${p.id}">Relancer</button>`}</span></li>`;
    return `<div class="wrap page">
      ${heroHtml('duo', 'Deux personnes en costume orange et chapeau blanc bondissent côte à côte sous un ciel bleu profond', `<p class="eyebrow">Personnes de confiance</p><h1>Qui veille, <em>qui reçoit.</em></h1><span class="rule"></span>
        <p class="lead">Un proche, mais aussi un notaire, un avocat ou tout autre professionnel. Une personne de confiance peut signaler votre décès. Son signalement est vérifié, puis confirmé auprès des autres.</p>
        ${n ? meterHtml(`${ok} sur ${n} ${ok > 1 ? 'ont' : 'a'} accepté`, ok / n, `${ok} personnes sur ${n} ont accepté`) : ''}`)}
      <section class="ppl" aria-labelledby="ppl-title">
        <div class="ppl-head">
          <h2 id="ppl-title">${n ? plural(n, 'personne') + ' de confiance' : 'Aucune personne pour l’instant'}</h2>
          <button type="button" class="btn plain" data-act="padd">${ico('plus')}Ajouter une personne</button>
        </div>
        ${n ? `<ul class="people-list">${state.people.map(row).join('')}</ul>` : '<p class="muted-p">Commencez par la personne qui pourra signaler votre décès.</p>'}
      </section>
    </div>`;
  }
  function personDlg(editId) {
    const ed = state.people.find(p => p.id === editId);
    const v = ed || { name: '', relation: '', kind: 'proche', kindOther: '' };
    const kind = PKINDS[v.kind] ? v.kind : 'proche';
    openDlg(`
      <p class="eyebrow">Personnes de confiance</p>
      <h2>${ed ? `Modifier ${esc(ed.name)}` : 'Ajouter une personne'}</h2>
      <div class="pform">
        <div class="field"><label for="f-kind">Qui est-ce ?</label><select id="f-kind" name="kind">${Object.keys(PKINDS).map(k => `<option value="${k}" ${k === kind ? 'selected' : ''}>${PKINDS[k][0]}</option>`).join('')}</select></div>
        <div class="field"><label for="f-name">Nom</label><input id="f-name" name="name" value="${esc(v.name)}" placeholder="Prénom, ou Maître Durand"></div>
        <div class="field pwide" id="f-other-w" ${kind === 'autre' ? '' : 'hidden'}><label for="f-other">Précisez son rôle</label><input id="f-other" name="other" value="${esc(v.kindOther || '')}" placeholder="Parrain, tuteur, assistante de vie…"></div>
        <div class="field pwide"><label for="f-rel">Quelle est votre relation ?</label><input id="f-rel" name="relation" value="${esc(v.relation || '')}" placeholder="${esc(PKINDS[kind][1])}"></div>
        <p class="kick pwide pform-sep">Coordonnées</p>
        <div class="field"><label for="f-mail">Email</label><input id="f-mail" name="email" type="email" autocomplete="off" value="${esc(v.email || '')}" placeholder="prenom.nom@exemple.fr"></div>
        <div class="field"><label for="f-tel">Téléphone</label><input id="f-tel" name="phone" type="tel" autocomplete="off" value="${esc(v.phone || '')}" placeholder="06 12 34 56 78"></div>
        <div class="field pwide"><label for="f-addr">Adresse postale</label><textarea id="f-addr" name="address" style="min-height:68px" placeholder="Numéro, rue, code postal, ville">${esc(v.address || '')}</textarea></div>
        <div class="field pwide"><label for="f-notes">Autres informations</label><input id="f-notes" name="notes" value="${esc(v.notes || '')}" placeholder="Étude ou cabinet, meilleur moment pour appeler…"></div>
      </div>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Annuler</button>
        <button type="submit" class="btn plain" value="save">${ed ? 'Enregistrer' : 'Inviter cette personne'}</button>
      </div>`, fd => {
      const val = k => String(fd.get(k) || '').trim();
      const name = val('name');
      if (!name) { toast('Indiquez un nom pour continuer.'); return false; }
      const data = { name, kind: val('kind') || 'proche', kindOther: val('other'), relation: val('relation'), email: val('email'), phone: val('phone'), address: val('address'), notes: val('notes') };
      if (ed) { Object.assign(ed, data); toast('Modifications enregistrées.'); }
      else { state.people.push(Object.assign({ id: uid(), status: 'invited' }, data)); toast(`Invitation préparée pour ${name} (démo).`); }
      save(); render();
    });
  }
  document.addEventListener('change', e => {
    if (e.target.id !== 'f-kind') return;
    $('#f-rel').placeholder = PKINDS[e.target.value][1];
    $('#f-other-w').hidden = e.target.value !== 'autre';
  });
  function testamentDlg() {
    openDlg(`
      <p class="eyebrow">Testament</p>
      <h2>Le testament se prépare avec un notaire.</h2>
      <p class="muted">Oralysse ne rédige pas de testament. Un notaire partenaire vous conseille, le rédige ou le reçoit, puis l’inscrit au fichier central des dispositions de dernières volontés. S’il existe, il sera prévenu le moment venu.</p>
      <div class="dlg-actions">
        <button type="submit" class="ghost" value="cancel" formnovalidate>Plus tard</button>
        <button type="submit" class="btn plain" value="rdv">${state.testament === 'requested' ? 'Rendez-vous déjà demandé' : 'Demander un rendez-vous'}</button>
      </div>`, () => { state.testament = 'requested'; save(); render(); toast('Demande enregistrée (démo).'); });
  }

  /* ---------- Interactions ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.toggle) {
      const id = t.dataset.toggle, i = state.open.indexOf(id);
      if (i > -1) state.open.splice(i, 1); else state.open.push(id);
      save(); render(); const b = document.querySelector(`[data-toggle="${id}"]`); if (b) b.focus();
    } else if (t.dataset.edit) { const [s, i] = t.dataset.edit.split(':'); goRubric(s); editItem(s, i); }
    else if (t.dataset.viewas) { state.viewAs = t.dataset.viewas; save(); render(); }
    else if (t.dataset.su) suAction(t.dataset.su);
    else if (t.dataset.mfa) { state.signup.mfa = t.dataset.mfa; save(); render(); }
    else if (t.dataset.act === 'mail') mailDlg();
    else if (t.dataset.act === 'mt-resume') mtStep();
    else if (t.dataset.mtgo) mtGoto(t.dataset.mtgo);
    else if (t.dataset.act === 'mt-stop') { const k = mtCur(); state.mtOn = false; save(); render(); toast(`C’est enregistré. Vous reprendrez à la question ${k + 1} sur ${state.mailTest.items.length}.`); }
    else if (t.dataset.act === 'mt-end') { state.mtOn = false; save(); render(); }
    else if (t.dataset.act === 'mt-again') { state.mailTest.items.forEach(it => { if (it.res === 'skip') delete it.res; }); state.mailTest.idx = 0; mtStep(); }
    else if (t.dataset.act === 'mail-off') { state.mail = null; state.essProp = {}; delete state.mailTest; state.mtOn = false; save(); render(); toast('Boîte mail déconnectée. Les réponses déjà acceptées restent dans votre coffre.'); }
    else if (t.dataset.essacc) {
      const id = t.dataset.essacc, p = state.essProp[id];
      if (p) { state.ess[id] = { a: p.a, na: false, to: 'all', src: 'mail' }; delete state.essProp[id]; save(); render(); toast('Réponse acceptée.'); }
    }
    else if (t.dataset.essign) { delete state.essProp[t.dataset.essign]; save(); render(); toast('Proposition ignorée.'); }
    else if (t.dataset.essfile) { const c = t.dataset.essfile.indexOf('|'); showAttach(t.dataset.essfile.slice(0, c), t.dataset.essfile.slice(c + 1)); }
    else if (t.dataset.essval) { delete state.ess[t.dataset.essval].draft; save(); render(); toast('Réponse validée.'); }
    else if (t.dataset.essq) editEss(t.dataset.essq);
    else if (t.dataset.readess) readEss(t.dataset.readess);
    else if (t.dataset.read) { const [s, i] = t.dataset.read.split(':'); readItem(s, i); }
    else if (t.dataset.add) editItem(t.dataset.add, null);
    else if (t.dataset.act === 'expand-all') { state.open = state.sections.map(s => s.id); save(); render(); document.querySelector('.board').scrollIntoView({ behavior: 'smooth' }); }
    else if (t.dataset.act === 'continue') {
      for (const s of state.sections) { const it = s.items.find(i => !i.done); if (it) { goRubric(s.id); editItem(s.id, it.id); return; } }
      toast('Tout est prêt. Pensez à relire votre coffre de temps en temps.');
    }
    else if (t.dataset.act === 'people') goRubric('personnes');
    else if (t.dataset.act === 'padd') personDlg();
    else if (t.dataset.pedit) personDlg(t.dataset.pedit);
    else if (t.dataset.relance) { const p = state.people.find(x => x.id === t.dataset.relance); toast(`Invitation renvoyée à ${p.name} (démo).`); }
    else if (t.dataset.act === 'volpreview') volPreview();
    else if (t.dataset.act === 'testament') testamentDlg();
    else if (t.dataset.act === 'callback') toast('Demande de rappel enregistrée (démo).');
    else if (t.dataset.act === 'restart') { state.onboarded = false; state.wizard.step = state.built ? 1 : 0; save(); render(); window.scrollTo(0, 0); }
    else if (t.dataset.pick) {
      const [key, id, max] = t.dataset.pick.split(':'); const arr = state.wizard[key]; const i = arr.indexOf(id);
      if (i > -1) arr.splice(i, 1);
      else { if (arr.length >= +max) arr.shift(); arr.push(id); }
      save(); render();
    }
    else if (t.dataset.wiz) {
      const w = state.wizard;
      if (t.dataset.wiz === 'next') w.step = Math.min(4, w.step + 1);
      if (t.dataset.wiz === 'skip') { w.person = { name: '', relation: '' }; w.step = Math.min(4, w.step + 1); }
      if (t.dataset.wiz === 'back') w.step = Math.max(state.built ? 1 : 0, w.step - 1);
      if (t.dataset.wiz === 'later' && state.built) {
        w.who = (w.doneWho || w.who).slice(); w.step = 0; state.onboarded = true; save();
        if (location.hash !== '#coffre') location.hash = 'coffre';
        render(); window.scrollTo(0, 0); toast('Vos choix n’ont pas été modifiés.'); return;
      }
      /* Nouveau compte : le questionnaire d'abord, puis la création du compte pour ouvrir le coffre. */
      if (t.dataset.wiz === 'finish' && !state.account) {
        state.signup = { step: 1, email: '', mfa: 'passkey' }; save(); render(); window.scrollTo(0, 0); return;
      }
      if (t.dataset.wiz === 'finish' || t.dataset.wiz === 'later') { finishWiz(t.dataset.wiz); return; }
      save(); render(); window.scrollTo(0, 0);
    }
  });
  function finishWiz(kind) {
        const w = state.wizard;
        if (w.name.trim()) state.user = { name: w.name.trim(), full: w.name.trim() };
        let added = 0; const touched = [];
        if (!state.built) { state.sections = buildSections(w); state.built = true; }
        else {
          /* Choix modifiés : on ajoute ce qui manque, sans rien effacer de ce qui est déjà écrit. */
          const fresh = w.who.filter(id => !(w.doneWho || []).includes(id));
          const addTo = (sid, label) => {
            const s = state.sections.find(x => x.id === sid);
            if (s && !s.items.some(i => i.label === label)) { s.items.push(item(label)); added++; touched.push(sid); }
          };
          fresh.forEach(id => { if (WHO_MSG[id]) addTo('messages', WHO_MSG[id]); if (WHO_VOL[id]) addTo('volontes', WHO_VOL[id]); });
        }
        w.doneWho = w.who.slice();
        if (kind !== 'later') {
          const rank = id => { const i = w.priorities.indexOf(id); return i === -1 ? 99 : i; };
          state.sections.sort((a, b) => rank(a.id) - rank(b.id));
          state.open = Array.from(new Set(w.priorities.concat(touched)));
          state.tab = w.priorities[0] || 'essentiel';
          const pn = w.person.name.trim();
          if (pn && !state.people.some(p => p.name.toLowerCase() === pn.toLowerCase())) {
            state.people.push({ id: uid(), name: pn, relation: w.person.relation.trim() || 'Proche', status: 'invited' });
          }
        }
        w.step = 0; state.onboarded = true; save();
        if (location.hash !== '#coffre') location.hash = 'coffre';
        render(); window.scrollTo(0, 0);
        openVault();
        toast(kind === 'later' ? 'Vous pourrez modifier vos choix de départ depuis Mon coffre.'
          : kind === 'new' ? 'Votre compte est créé et votre coffre est ouvert.'
          : added ? `${added} élément${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''} à votre coffre selon vos nouveaux choix.`
          : 'Votre parcours suit vos priorités.');
  }
  document.addEventListener('toggle', e => {
    const d = e.target; if (!d.dataset || !d.dataset.ess) return;
    const i = state.essOpen.indexOf(d.dataset.ess);
    if (d.open && i === -1) state.essOpen.push(d.dataset.ess);
    if (!d.open && i > -1) state.essOpen.splice(i, 1);
    save();
  }, true);
  document.addEventListener('input', e => {
    const w = state.wizard, id = e.target.id;
    if (id === 'w-name') w.name = e.target.value;
    else if (id === 'w-pname') w.person.name = e.target.value;
    else if (id === 'w-prel') w.person.relation = e.target.value;
    else return;
    save();
  });
  const ng = $('.nav-group'), nt = $('.nav-toggle');
  const setDrop = o => { ng.classList.toggle('open', o); nt.setAttribute('aria-expanded', String(o)); };
  nt.addEventListener('click', () => { const o = !ng.classList.contains('open'); setDrop(o); ng.classList.toggle('shut', !o); });
  ng.addEventListener('click', e => { if (e.target.closest('a')) { setDrop(false); ng.classList.add('shut'); } });
  ng.addEventListener('mouseleave', () => ng.classList.remove('shut'));
  document.addEventListener('click', e => { if (!ng.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setDrop(false); });
  $('#viewer').addEventListener('click', e => { if (e.target.closest('[data-vclose]')) $('#viewer').close(); });
  const ub = $('#user-btn'), um = $('#user-menu');
  ub.addEventListener('click', e => { e.stopPropagation(); um.hidden = !um.hidden; ub.setAttribute('aria-expanded', String(!um.hidden)); });
  document.addEventListener('click', e => { if (!um.hidden && !um.contains(e.target)) { um.hidden = true; ub.setAttribute('aria-expanded', 'false'); } });
  $('#choices-btn').addEventListener('click', () => { state.onboarded = false; state.wizard.step = state.built ? 1 : 0; save(); um.hidden = true; ub.setAttribute('aria-expanded', 'false'); render(); window.scrollTo(0, 0); });
  $('#newuser-btn').addEventListener('click', () => { state = NEW(); save(); um.hidden = true; render(); window.scrollTo(0, 0); });
  $('#reset-btn').addEventListener('click', () => { state = SEED(); save(); um.hidden = true; if (location.hash !== '#coffre') location.hash = 'coffre'; render(); window.scrollTo(0, 0); openVault(); toast('Voici le coffre de Claire, un exemple déjà avancé.'); });

  /* ---------- Espace privé : ouverture et verrouillage ---------- */
  function openVault() {
    const o = $('#opening');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    o.hidden = false; o.classList.remove('fade', 'opening');
    requestAnimationFrame(() => requestAnimationFrame(() => o.classList.add('opening')));
    clearTimeout(openVault.a); clearTimeout(openVault.b);
    openVault.a = setTimeout(() => o.classList.add('fade'), 1100);
    openVault.b = setTimeout(() => { o.hidden = true; o.classList.remove('fade', 'opening'); }, 1600);
  }
  const lockscreen = $('#lockscreen');
  /* Connexion : mot de passe, puis double authentification. Le mot de passe n'est jamais enregistré. */
  let lockPhase = 1;
  function lockStep(n) {
    lockPhase = n;
    const acc = state.account || { email: '', mfa: 'app' };
    $('#lock-step1').hidden = n !== 1; $('#lock-step2').hidden = n !== 2;
    if (n === 1) {
      $('#lock-hello').textContent = (state.user.name ? state.user.name + ', votre coffre est verrouillé' : 'Votre coffre est verrouillé') + (acc.email ? ' · ' + acc.email : '') + '. Saisissez votre mot de passe pour l’ouvrir.';
      $('#lock-pass').value = ''; setTimeout(() => $('#lock-pass').focus(), 50);
    } else if (acc.mfa === 'passkey') {
      $('#lock-hello').textContent = 'Deuxième étape : confirmez qu’il s’agit bien de vous, avec votre passkey (empreinte, visage ou code de l’appareil).';
      $('#lock-step2').innerHTML = '<button type="submit" class="btn plain">Confirmer avec ma passkey</button>';
      setTimeout(() => $('#lock-step2 button').focus(), 50);
    } else {
      $('#lock-hello').textContent = 'Deuxième étape : saisissez le code à 6 chiffres affiché par votre application d’authentification.';
      $('#lock-step2').innerHTML = '<label for="lock-code" class="sr">Code à 6 chiffres</label><input id="lock-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"><button type="submit" class="btn plain">Ouvrir mon coffre</button>';
      setTimeout(() => $('#lock-code').focus(), 50);
    }
  }
  $('#lock-btn').addEventListener('click', () => { um.hidden = true; ub.setAttribute('aria-expanded', 'false'); if (env.cloud) { env.signOut(); return; } lockscreen.hidden = false; lockStep(1); });
  $('#lock-form').addEventListener('submit', e => {
    e.preventDefault();
    if (lockPhase === 1) {
      if (!$('#lock-pass').value) { toast('Saisissez votre mot de passe.'); return; }
      $('#lock-pass').value = ''; lockStep(2); return;
    }
    const c = $('#lock-code');
    if (c && c.value.replace(/\D/g, '').length !== 6) { toast('Saisissez le code à 6 chiffres.'); return; }
    lockscreen.hidden = true;
    openVault();
  });

  render();
  if (state.onboarded !== false) openVault();
  return { state: () => state };
}
