# KyaStore

Boutique en ligne avec gestion de produits et commande directe via WhatsApp.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (base de données + auth + stockage d'images)

## Démarrage local
1. `npm install`
2. Copier `.env.local.example` en `.env.local` et remplir les valeurs (voir guide complet fourni séparément)
3. `npm run dev`
4. Ouvrir http://localhost:3000

## Base de données
Exécuter le contenu de `supabase/schema.sql` dans l'éditeur SQL de ton projet Supabase.
Créer un bucket de stockage public nommé `product-images`.

Si tu avais déjà déployé le projet avant l'ajout de la gestion des catégories,
exécute uniquement `supabase/migration-categories.sql` (pas besoin de relancer
tout `schema.sql`).

## Compte admin
Crée un utilisateur dans Supabase > Authentication > Users. Utilise cet email/mot
de passe pour te connecter sur `/admin/login`.

## Application installable (PWA)

Le site est une Progressive Web App : une fois déployé en HTTPS (Vercel le fait
automatiquement), tes clients peuvent l'installer comme une vraie application.

- **Android / Chrome / Edge** : un bandeau "Installer KyaStore" apparaît en bas de
  l'écran après quelques secondes de navigation (bouton personnalisé dans
  `components/InstallPrompt.tsx`). Un clic sur "Installer" ajoute l'icône sur
  l'écran d'accueil, sans passer par le Play Store.
- **iPhone / iPad (Safari)** : Apple ne permet pas ce bandeau automatique. Le
  client doit appuyer sur l'icône "Partager" puis "Sur l'écran d'accueil". C'est
  une limitation d'iOS, pas du site — tu peux l'expliquer à tes clients dans tes
  stories/posts de lancement.
- Une fois installée, l'app s'ouvre en plein écran (sans barre d'adresse), avec
  l'icône orange "K" et le nom "KyaStore".

### Personnaliser l'icône
Les icônes sont dans `public/icons/` (icon-192.png, icon-512.png,
icon-maskable-512.png, apple-touch-icon.png). Remplace-les par ton vrai logo en
gardant exactement les mêmes noms et tailles.

### Fonctionnement hors-ligne
Un service worker (`public/sw.js`) met en cache les pages déjà visitées : si un
client perd sa connexion, l'app continue de s'afficher au lieu d'une page
d'erreur blanche. Les données produits (Supabase) nécessitent toujours une
connexion pour être à jour — seul l'habillage de l'app reste disponible hors-ligne.

### Tester l'installation
`npm run build && npm run start`, ouvre le site dans Chrome, ouvre les DevTools
(onglet "Application" > "Manifest") pour vérifier que tout est reconnu, ou
utilise simplement le bouton "Installer" qui doit apparaître automatiquement.

## Sécurité — checklist avant mise en ligne

- [ ] Exécuter `supabase/schema.sql` (table + contraintes + RLS sur `products`)
- [ ] Exécuter `supabase/storage-policies.sql` **après** avoir créé le bucket `product-images` (sinon n'importe qui peut uploader/supprimer des images)
- [ ] Créer le compte admin dans Authentication > Users avec un mot de passe fort et unique
- [ ] Ne jamais commiter `.env.local` sur GitHub (déjà exclu par `.gitignore`)
- [ ] Sur Vercel, activer HTTPS (automatique) et ne renseigner les variables d'environnement que dans "Environment Variables", jamais en dur dans le code
- [ ] Dans Supabase > Authentication > Providers, désactiver les inscriptions publiques si l'option existe, puisque seul toi dois pouvoir te connecter
- [ ] Remplacer les liens sociaux placeholders dans `components/Footer.tsx`

### Comment c'est protégé
- La clé `anon` exposée côté client est normale et sans danger : c'est la base de données elle-même (via RLS) qui bloque les écritures non autorisées, pas la clé.
- N'importe qui peut lire le catalogue (`select`), mais seul un utilisateur connecté (`authenticated`) peut ajouter, modifier ou supprimer un produit ou une image — vérifié côté serveur par Supabase, pas seulement dans l'interface.
- Le prix et le stock ne peuvent pas être négatifs, même via un appel direct à l'API (contrainte en base de données).
