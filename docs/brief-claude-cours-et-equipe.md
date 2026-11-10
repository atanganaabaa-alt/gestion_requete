# Brief pour Claude — Cours, TD, TP + Google Doc

**À qui :** Claude (rédacteur pédagogique)  
**De :** Atangana Sara (ESTLC / Université d’Ebolowa, Ambam)  
**Objectif :** Produire en **français** les supports **Cours / TD (tutoriels) / TP (laboratoires)** pour **deux matières séparées**, sessions **1 à 6**, puis **écrire le contenu directement** dans le Google Doc ci-dessous.

**Google Doc cible (écriture directe obligatoire) :**  
https://docs.google.com/document/d/1IgqNHFRgBz2uknUrj7GJaIfaXYiJ5Y9C1GQwfiKEt-E/edit?tab=t.0

> Si l’accès Google échoue (login requis), livrer quand même le texte structuré prêt à coller, et indiquer clairement le blocage.

---

## 1. Mission exacte

Créer **six sujets distincts** (pas un seul document mélangé) :

### Matière A — Validation et vérification logicielle (V&V)
1. **Cours** — sessions 1 à 6  
2. **Tutoriels (TD)** — sessions 1 à 6  
3. **Laboratoires (TP)** — sessions 1 à 6  

### Matière B — Building Team Project
1. **Cours projet** — sessions 1 à 6  
2. **Tutoriels (TD)** — sessions 1 à 6  
3. **Laboratoires (TP)** — sessions 1 à 6  

Le projet pédagogique de l’équipe est une **application de gestion des requêtes** dans une institution universitaire, brandée **ESTLC** (École Supérieure de Transport, de Logistique et de Commerce — Université d’Ebolowa, Ambam).

**Contraintes de forme :**
- Tout en **français**.
- Cours ≠ TD ≠ TP : ne pas fusionner les sujets.
- Chaque session ~ **3 heures** (indiquer durée, objectifs, déroulé, livrable).
- Relier V&V au projet réel (exemples sur UniRequest / ESTLC Requêtes).
- Inclure une section **Évolution crescendo** du travail des 6 membres (sessions 1→6), destinée aussi au Google Doc.
- Ton académique clair, utilisable en classe, avec exercices concrets.

**Structure souhaitée dans le Google Doc :**
1. Page de garde (matières, équipe, école, période sessions 1–6)  
2. Évolution crescendo de l’équipe  
3. V&V — Cours (S1–S6)  
4. V&V — TD (S1–S6)  
5. V&V — TP (S1–S6)  
6. Building Team Project — Cours (S1–S6)  
7. Building Team Project — TD (S1–S6)  
8. Building Team Project — TP (S1–S6)  
9. Annexes (comptes démo, glossaire, backlog résumé, liens)

---

## 2. Équipe (6 membres)

Institution : **ESTLC — Université d’Ebolowa, Ambam**  
Site école : https://estlc.unv-ebolowa.cm/

| Membre | Rôle projet (PLANNER officiel) | Focus pédagogique |
| --- | --- | --- |
| **Atangana Sara** | M1 — Scrum Master, DevOps, intégration | CI/CD, dépôt, Docker, déploiement, animation d’équipe |
| **Emma Nkot** | M2 — Product Owner, UX, documentation | Backlog, maquettes, guides, charte, textes UI |
| **Maffo Daniel** | M3 — Backend identité & admin | Auth, rôles, users, services, audit |
| **Neh Ngapouh** | M4 — Backend cœur métier | Requêtes, workflow, SLA, notifications |
| **Sibefeu Luc** | M5 — Frontend espace demandeur | Soumission, suivi, public, responsive |
| **Wome Franck** | M6 — Frontend agent/admin + QA | File agent, dashboard, tests, recette |

**Note :** un ancien portail de cours présentait parfois Sara comme « Cheffe de projet · PO » et Emma en « UX · documentation ». Le **mapping officiel à utiliser** est celui du tableau ci-dessus (Sara = Scrum/DevOps ; Emma = PO/UX).

Personas seed / démo :
- **Amina Ngo** — étudiante demandeur (`etudiant@estlc.cm`)
- **M. Owona** — agent scolarité (`agent@estlc.cm`)
- **Dr. Fotso** — responsable GSI (`responsable@estlc.cm`)
- **Admin ESTLC** — administrateur DSI (`admin@estlc.cm`)
- Mot de passe démo : `Estlc2026!`

---

## 3. Produit réel (état actuel)

**Nom produit :** ESTLC Requêtes  
**Sous-titre :** Plateforme de suivi de requêtes — Université d’Ebolowa  
**Dépôt GitHub :** https://github.com/atanganaabaa-alt/gestion_requete  
**Workspace local :** `/home/sara/Downloads/UniRequest`  
**Feuille de route :** `PLANNER.md` (approuvée)  
**Sources métier :** `description.pdf`, `scrum_backlog.pdf`, `découpage_taches.pdf` (dans Downloads)

### Vision
Point d’entrée unique pour soumettre, affecter, traiter et suivre les requêtes administratives et pédagogiques de l’ESTLC, avec traçabilité complète.

### Rôles
| Rôle | Qui | Droits |
| --- | --- | --- |
| Demandeur | Étudiant, personnel, candidat | Compte, soumission, pièces, suivi, commentaires, annulation, évaluation |
| Agent | Scolarité, secrétariat, service | File du service, affectation, statuts, notes internes, clôture |
| Responsable | Chef de service / département | Agent + réaffectation, escalade, dashboards, exports |
| Admin | DSI / direction | Utilisateurs, rôles, services, catégories, SLA, audit |

### Cycle de vie
```
BROUILLON → SOUMISE → AFFECTEE → EN_COURS ⇄ EN_ATTENTE → RESOLUE → CLOTUREE
                    ↘ REJETEE
Demandeur peut ANNULER tant que pas « En cours »
```
Numéro de suivi : `REQ-YYYY-#####` (ex. `REQ-2026-00002`).

### Stack technique (réelle)
- **Next.js 15** App Router + TypeScript + Tailwind 4  
- **Prisma 6** + **SQLite** local (`file:./dev.db`) ; Postgres prévu en prod  
- **Auth.js / NextAuth v5** credentials + JWT + bcryptjs  
- Server Actions, Zod, uploads hors `public/` (`uploads/`)  
- Docker Compose, GitHub Actions CI (`lint` + `test` + build)  
- Design ESTLC : navy `#003399`, accent `rgb(233,99,99)`, logos ESTLC/UEB  
- Typo : Source Serif 4 + IBM Plex Sans  

### Lancer l’app
```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
# http://127.0.0.1:3000
```

### Ce qui est déjà livré

**Sprint 0–1 (fait, poussé sur GitHub) :**
- Auth inscription / connexion, rôles, middleware  
- Layouts demandeur `/espace`, agent `/agent`, admin `/admin`  
- Design system ESTLC  
- Soumission basique + suivi public `/suivi`  
- Seed services/catégories/users  
- CI GitHub Actions  

**Sprint 2 (implémenté et vérifié en local ; pas forcément encore commit/push) :**
- US03 réinit mot de passe (lien local 1 h ; SMTP = sprint 4)  
- US05/06 soumission avec pièces PDF/JPG/PNG (1 Ko–5 Mo, max 5) + numéro unique  
- US07/09 liste + détail demandeur, téléchargement pièces authentifié  
- US25/26 admin CRUD comptes, services, catégories (création + activation/désactivation)  

**Pas encore (sprints 3–6) :**
- File agent : s’affecter, changer statut, clôturer, commentaires (S3)  
- SLA, mails SMTP, notifs in-app, notes internes, annulation (S4)  
- Escalade, audit UI, dashboard métriques, brouillons, évaluation (S5)  
- Export CSV/PDF, recherche, guides prod, démo finale (S6)  

Backlog global : **US01–US34**, vélocité cible ~40 pts/sprint, DoD = PR + CI verte + validation PO.

---

## 4. Contenu pédagogique déjà existant (à enrichir / réécrire proprement)

Portail local : `/home/sara/Downloads/Cours-VV-et-Projet-Equipe/`  
Fichiers HTML (sessions 1–6 déjà ébauchées) :
- `vv-cours.html`, `vv-td.html`, `vv-tp.html`
- `projet-cours.html`, `projet-td.html`, `projet-tp.html`

Le Google Doc n’a **pas** encore été rempli correctement (accès Google souvent bloqué sans login). Claude doit **écrire dans le Doc** le contenu final soigné.

Évolution crescendo déjà rédigée (à intégrer / améliorer) :  
`/home/sara/Downloads/UniRequest/docs/evolution-crescendo.md`

Idée du crescendo (résumé) :
| Session | Niveau | Livrable d’équipe |
| --- | --- | --- |
| 1 | Fondations | Charte, rôles, dépôt, problème formulé |
| 2 | Besoin | Personas, user stories, maquettes |
| 3 | Structure | UML / schéma, squelette qui démarre |
| 4 | Produit | Parcours réel demandeur → agent |
| 5 | Confiance | Tests, revue croisée, audit |
| 6 | Livraison | Démo, rapport, tag release |

---

## 5. Trame recommandée des sessions

### V&V — axes par session
1. Fondements V&V (validation vs vérification, coût de la qualité)  
2. Revues / inspections d’exigences et de design  
3. Analyse statique, lint, dette technique  
4. Tests unitaires & boîte noire/blanche (ex. workflow `REQ-*`, pièces jointes)  
5. Intégration, API, non-régression, CI  
6. Recette, couverture des US, rapport V&V, go/no-go  

### Building Team Project — axes par session
1. Lancement d’équipe, charte, DoD, Kanban  
2. Personas ESTLC, MoSCoW, user stories testables  
3. Architecture Next/Prisma, modèle de données, seed  
4. Sprint incrément : auth + dépôt + file (selon avancement réel)  
5. Qualité : tests, revue croisée, audit  
6. Démo 12 min, guides, rétrospective, livrable final  

Pour chaque **TD** : exercices guidés papier / discussion (pas forcément code).  
Pour chaque **TP** : consignes outillées (Git, Prisma, tests, parcours navigateur, critères d’acceptation).  
Citer les membres dans les ateliers (qui fait quoi) pour coller à la réalité d’équipe.

---

## 6. Glossaire rapide à réutiliser

- **ESTLC** : École Supérieure de Transport, de Logistique et de Commerce  
- **UEB** : Université d’Ebolowa  
- **US** : User Story (US01–US34)  
- **SLA** : délais de traitement par priorité/catégorie  
- **DoD** : Definition of Done  
- **PO** : Product Owner (Emma Nkot)  
- **Scrum Master** : Atangana Sara  

Services seed : Scolarité, Département GSI, Département Transport, Patrimoine, Direction des études, DSI (+ éventuellement Bibliothèque ajoutée en démo admin).  
Catégories seed : relevé, attestation, recours, inscription/concours, salle/matériel, stage/recommandation, assistance IT, autre (+ prêt document en démo).

---

## 7. Instructions d’écriture pour Claude

1. Se connecter / utiliser l’accès Google disponible et **écrire dans le Doc** (pas seulement un résumé chat).  
2. Titres clairs, listes, tableaux ; éviter le remplissage creux.  
3. Chaque session : **Objectifs · Prérequis · Déroulé (horaire) · Activités · Livrable · Critères de réussite**.  
4. Ancrer les exemples sur **ESTLC Requêtes** et les personas Amina / Owona / Fotso.  
5. Séparer nettement **Cours / TD / TP** et **V&V / Projet**.  
6. Inclure la **page de garde** avec les **6 noms**.  
7. En fin de Doc : liens GitHub `gestion_requete`, site ESTLC, comptes démo.  
8. Ne pas inventer un autre produit ; rester sur la gestion de requêtes universitaires ESTLC.  
9. Si tu enrichis l’évolution crescendo, reste cohérent avec les rôles M1–M6 du PLANNER.

---

## 8. Message court à coller à Claude (optionnel)

```
Lis le brief docs/brief-claude-cours-et-equipe.md (ou le texte collé).
Produis en français, sessions 1–6, six sujets séparés :
V&V (cours, TD, TP) et Building Team Project (cours, TD, TP).
Écris directement dans :
https://docs.google.com/document/d/1IgqNHFRgBz2uknUrj7GJaIfaXYiJ5Y9C1GQwfiKEt-E/edit?tab=t.0
Inclus l’évolution crescendo des 6 membres (Sara, Emma, Daniel, Neh, Luc, Franck)
autour du produit ESTLC Requêtes (gestion de requêtes universitaires).
Ancre les TP/TD sur le backlog Scrum US01–US34 et l’état réel (Sprints 1–2 faits ;
S3–S6 à venir).
```

---

*Document généré pour transmission à Claude — projet ESTLC Requêtes / UniRequest.*
