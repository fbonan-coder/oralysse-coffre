/* Le backend : Supabase (connexion par code e-mail, table `dossiers`, fichiers dans le bucket `coffre`).
   Sans les variables VITE_SUPABASE_*, createCloud() renvoie null et l'app tourne en mode démo. */
import { createClient } from '@supabase/supabase-js';

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'coffre';

/* Une erreur lisible par l'interface : `code` vaut no_account, rate, bad_code, network ou other. */
const fail = (code, message) => Object.assign(new Error(message || code), { code });
function explain(e) {
  const m = String((e && (e.message || e.error_description)) || e || '');
  const status = e && e.status;
  if (/signups? not allowed|user not found/i.test(m)) return fail('no_account', m);
  if (status === 429 || /rate limit|too many|security purposes/i.test(m)) return fail('rate', m);
  if (/expired|invalid|otp/i.test(m)) return fail('bad_code', m);
  if (/fetch|network|failed to load/i.test(m)) return fail('network', m);
  return fail('other', m);
}

export function createCloud() {
  if (!URL_ || !KEY_) return null;
  const sb = createClient(URL_, KEY_, {
    /* PKCE : le lien du mail revient avec ?code=…, sans toucher au #hash qui sert à la navigation. */
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  let user = null;
  const uidOrFail = () => { if (!user) throw fail('signed_out'); return user.id; };

  return {
    async getUser() {
      const { data } = await sb.auth.getSession();
      user = data.session ? data.session.user : null;
      return user && { id: user.id, email: user.email };
    },
    onSignedIn(cb) {
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) { user = session.user; cb({ id: user.id, email: user.email }); }
      });
    },
    /* Envoie un code à 6 chiffres (et un lien) par e-mail. create:false refuse une adresse inconnue. */
    async sendCode(email, { create = false, name = '' } = {}) {
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: create, data: create && name ? { first_name: name } : undefined, emailRedirectTo: location.origin + location.pathname }
      });
      if (error) throw explain(error);
    },
    async verifyCode(email, token) {
      const { data, error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw explain(error);
      user = data.user;
      return { id: user.id, email: user.email };
    },
    async signOut() { await sb.auth.signOut(); user = null; },

    async loadDossier() {
      const { data, error } = await sb.from('dossiers').select('state, updated_at').eq('owner_id', uidOrFail()).maybeSingle();
      if (error) throw explain(error);
      return data;
    },
    async saveDossier(state) {
      const id = uidOrFail();
      const row = { owner_id: id, email: user.email, first_name: (state.user && state.user.name) || null, state };
      const { error } = await sb.from('dossiers').upsert(row, { onConflict: 'owner_id' });
      if (error) throw explain(error);
    },

    async putFile(key, blob) {
      const { error } = await sb.storage.from(BUCKET).upload(`${uidOrFail()}/${key}`, blob, { upsert: true, contentType: blob.type || 'application/octet-stream' });
      if (error) throw explain(error);
    },
    async getFile(key) {
      if (!user) return null;
      const { data, error } = await sb.storage.from(BUCKET).download(`${user.id}/${key}`);
      return error ? null : data;
    }
  };
}
