# Oralysse · Mon coffre

L'app Oralysse prête pour Bolt : la démo cliquable, avec de vrais comptes et un backend Supabase qui enregistre tout.

- **Connexion sans mot de passe** : la personne donne son adresse e-mail et reçoit un code à 6 chiffres (ou un lien) à chaque connexion.
- **Un dossier par personne**, enregistré automatiquement quelques instants après chaque modification. S'il n'y a pas de réseau, une copie reste sur l'appareil et part dès le retour de la connexion.
- **Fichiers** (audio, vidéo, documents, pièces jointes) rangés dans un espace de stockage privé, propre à chaque compte.
- **Sans Supabase**, l'app tourne en mode démo, comme l'artifact : tout reste dans le navigateur.

## Mettre le projet dans Bolt

1. Créez un dépôt GitHub (privé) et poussez-y ce dossier `bolt/` tel quel, sans `node_modules` ni `dist`.
2. Dans Bolt, importez le dépôt : bouton **Import from GitHub**, ou l'adresse `https://bolt.new/~/github.com/<compte>/<depot>`.
3. Bolt installe les dépendances et lance `npm run dev`. L'app s'ouvre en mode démo.

## Brancher Supabase

1. Dans Bolt, cliquez sur **Supabase → Connect** et créez un projet. Choisissez la région **Paris (eu-west-3)** : la page affiche « Hébergé en France ».
2. Bolt applique la migration `supabase/migrations/…_dossiers.sql` et remplit `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Si la migration ne passe pas toute seule, copiez le fichier dans le **SQL Editor** de Supabase et exécutez-le.
3. Dans le tableau de bord Supabase, **Authentication → Emails → Magic Link** : ajoutez le code au message, sinon le mail ne contient qu'un lien. Par exemple :

   ```html
   <h2>Votre code Oralysse</h2>
   <p>Pour ouvrir votre coffre, saisissez ce code :</p>
   <p style="font-size:28px;letter-spacing:6px"><b>{{ .Token }}</b></p>
   <p>Ou cliquez sur ce lien : <a href="{{ .ConfirmationURL }}">ouvrir mon coffre</a></p>
   <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
   ```

   Faites la même chose dans le modèle **Confirm signup**, qui sert au tout premier mail.
4. **Authentication → URL Configuration** : mettez l'adresse publiée de l'app dans *Site URL*, puis ajoutez l'adresse de prévisualisation Bolt dans *Redirect URLs*. Sans cela, le lien du mail renvoie vers la mauvaise adresse ; le code, lui, marche partout.
5. **Avant de vrais utilisateurs**, configurez un serveur d'envoi (**Authentication → SMTP**, par exemple Brevo ou Resend). Les envois intégrés de Supabase sont limités à quelques mails par heure.

## Ce que fait chaque fichier

| Fichier | Rôle |
|---|---|
| `index.html` | La page, les styles et l'écran d'accueil (créer un dossier ou se connecter). |
| `src/app.js` | Toute l'app : vues, questions, messages, Transmission… Elle reçoit de `main.js` l'état initial et les fonctions d'enregistrement. |
| `src/main.js` | Démarrage, écran de connexion, enregistrement automatique (regroupé, réessayé, avec une copie locale). |
| `src/cloud.js` | Les appels à Supabase : code e-mail, table `dossiers`, fichiers du bucket `coffre`. |
| `supabase/migrations/` | La table `dossiers` (un dossier par utilisateur, contenu en JSON), le bucket privé `coffre` et les règles d'accès : chacun ne voit que son propre dossier. |
| `public/` | Les photos. |
| `tools/export-from-demo.cjs` | Regénère `index.html` et `src/app.js` à partir de la démo `app/index.html`, si la démo évolue encore hors de Bolt. |

## Le parcours

1. **Accueil** : « Créer mon dossier » ou « J'ai déjà un dossier ».
2. **Création** : le paramétrage habituel (4 questions), puis l'adresse e-mail et le code reçu. Le dossier est alors créé et enregistré. Si l'adresse a déjà un dossier, c'est celui-là qui s'ouvre.
3. **Connexion** : adresse e-mail, puis code. Une adresse inconnue reçoit « Aucun dossier n'est ouvert avec cette adresse », avec un bouton pour en créer un.
4. **Menu du compte** : l'adresse connectée, l'état de l'enregistrement (« Enregistré à 14:32 ») et **Me déconnecter**. L'exemple de Claire n'est plus proposé, pour ne pas écraser un vrai dossier.

## À savoir avant d'ouvrir à de vrais utilisateurs

- **« Chiffré de bout en bout » est faux pour l'instant.** Supabase chiffre les données sur ses disques, mais un administrateur du projet peut les lire. Il faut soit chiffrer dans le navigateur avant l'envoi, soit changer ce texte dans la bande du bas et sur l'accueil.
- **La transmission reste simulée.** Les personnes de confiance n'ont pas de compte, aucun mail ne leur est envoyé, et la vérification du décès n'est pas branchée.
- **L'analyse des e-mails reste l'exemple fictif.** La connexion Gmail n'est pas branchée.
- **Si le même compte modifie le dossier sur deux appareils en même temps, la dernière modification gagne.**
- **Un fichier supprimé dans l'app reste dans le stockage.** Il faudra un nettoyage.
