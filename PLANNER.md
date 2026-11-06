# PLANNER — Plateforme de suivi de requêtes ESTLC

**Institution :** École Supérieure de Transport, de Logistique et de Commerce (ESTLC) — Université d’Ebolowa, Ambam  
**Sources :** `description.pdf` · `scrum_backlog.pdf` · `découpage_taches.pdf` · [estlc.unv-ebolowa.cm](https://estlc.unv-ebolowa.cm/)  
**Statut :** EN ATTENTE D’APPROBATION — aucune implémentation tant que ce plan n’est pas validé.

---

## 1. Verdict sur l’existant

L’app actuelle (`Express` + JSON + UI basique) est une **démo technique**. Elle ne couvre pas :

- inscription / rôles réels / admin utilisateurs-services-catégories ;
- numéro de suivi public, pièces jointes, commentaires, notes internes ;
- SLA, notifications, tableau de bord, audit, exports ;
- identité visuelle ESTLC / Université d’Ebolowa ;
- stack cible des documents (React/Next, Prisma, PostgreSQL).

**Décision proposée :** reconstruire le produit sur le backlog Scrum (US01–US34), brandé ESTLC. L’ancien code sert uniquement de référence métier (workflow), pas de base UI.

---

## 2. Produit

### Vision
Point d’entrée unique pour soumettre, affecter, traiter et suivre les requêtes administratives et pédagogiques de l’ESTLC, avec traçabilité complète.

### Nom produit proposé
**ESTLC Requêtes** (sous-titre : *Plateforme de suivi de requêtes — Université d’Ebolowa*)

### Acteurs (description.pdf §4)

| Rôle | Qui à l’ESTLC | Droits |
| --- | --- | --- |
| Demandeur | Étudiant, personnel, candidat | Compte, soumission, pièces, suivi, commentaires, annulation, évaluation |
| Agent | Scolarité, secrétariat de département, service | File du service, affectation, statuts, notes internes, clôture |
| Responsable de service | Chef de service / chef de département | Agent + affectation/réaffectation, escalade, dashboards, exports |
| Administrateur | DSI / direction | Utilisateurs, rôles, services, catégories, SLA, journal d’audit |

### Catégories métier ESTLC (v1 — seed)

Exemples alignés sur l’école (ajustables en admin) :

1. Relevé de notes / attestation de scolarité  
2. Recours de note  
3. Inscription / réinscription / documents concours  
4. Réservation de salle / matériel  
5. Stage / lettre de recommandation  
6. Signalement technique / assistance informatique  
7. Autre demande administrative  

Services seed : Scolarité, Département GSI, Département Transport, Patrimoine, Direction des études, DSI.

### Cycle de vie (description.pdf §6)

```
Soumise → Affectée → En cours ⇄ En attente d’information → Résolue → Clôturée
         ↘ Rejetée (motif obligatoire)
Demandeur peut Annuler tant que pas « En cours »
```

Chaque transition → historique horodaté + auteur.

---

## 3. Identité visuelle ESTLC

Inspirée du site officiel (pas un thème générique violet/cream) :

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `--estlc-navy` | `#003399` (`#039`) | Header, liens, primaire |
| `--estlc-red` | `rgb(233, 99, 99)` | Accents, alertes douces, CTA secondaire |
| `--estlc-ink` | `#0f172a` | Texte |
| `--estlc-paper` | `#f8fafc` | Fond page |
| `--estlc-card` | `#ffffff` | Surfaces |
| Logo | `logo_estlc.png` + `logo_ueb.png` | Header / login / PDF |

**UX :** mobile-first, français, layouts par rôle (demandeur ≠ agent ≠ admin), typographie soignée (pas Inter/Roboto par défaut — ex. Source Serif + IBM Plex Sans ou équivalent libre), peu de cartes décoratives, hiérarchie claire, états vides utiles.

---

## 4. Stack (description.pdf §8 — figée ici)

| Couche | Choix | Pourquoi |
| --- | --- | --- |
| App | **Next.js 15 (App Router) + TypeScript** | Frontend + API dans un monorepo, conforme aux docs |
| UI | **Tailwind CSS + composants maison** | Contrôle total du design ESTLC |
| ORM / DB | **Prisma + PostgreSQL** (SQLite en local si Postgres absent) | Modèle riche (11 entités) |
| Auth | **Auth.js (NextAuth) credentials + sessions** | Rôles, bcrypt, middleware |
| Fichiers | Dossier `uploads/` (local) puis objet S3-compatible | US06 |
| Mail | Nodemailer + SMTP (Ethereal en dev) | US22 |
| Qualité | Vitest + Playwright + ESLint + GitHub Actions | US30, US31 |
| Conteneur | Docker Compose (app + postgres + mailpit) | US30 / S6 |

---

## 5. Modèle de données (aperçu)

`User` · `Role` · `Service` · `Category` · `Request` · `Comment` · `Attachment` · `StatusHistory` · `Notification` · `AuditLog` · `Rating`

Relations clés : demandeur → N requêtes ; requête → catégorie + service + agent ; historique / commentaires / pièces / notifications liés à la requête.

Numéro de suivi : `REQ-YYYY-#####` (ex. `REQ-2026-00042`).

---

## 6. Équipe — mapping membres réels

| Doc | Nom | Rôle | Module |
| --- | --- | --- | --- |
| M1 | **Atangana Sara** | Scrum Master, DevOps, intégration | CI/CD, dépôt, Docker, déploiement |
| M2 | **Emma Nkot** | Product Owner, UX, documentation | Maquettes, backlog, guides, charte |
| M3 | **Maffo Daniel** | Backend identité & admin | Auth, rôles, users, services, audit |
| M4 | **Neh Ngapouh** | Backend cœur métier | Requêtes, workflow, SLA, notifs |
| M5 | **Sibefeu Luc** | Frontend espace demandeur | Soumission, suivi, public, responsive |
| M6 | **Wome Franck** | Frontend agent/admin + QA | File, dashboard, tests, recette |

*(Ajustable si vous préférez Sara en PO et Emma en UX seule — à confirmer.)*

---

## 7. Plan de sprints (scrum_backlog + découpage)

Vélocité cible ~40 pts. DoD : PR revue, tests CI verts, critères PO, doc à jour.

### Sprint 0 — Cadrage (fait via ce PLANNER + kickoff)
- [ ] Valider ce plan  
- [ ] Charte graphique ESTLC + wireframes haute fidélité (login, dashboard, soumission, file agent)  
- [ ] Repo Next.js, branches, GitHub Projects  
- [ ] Schéma Prisma initial  

### Sprint 1 — Fondations (US01, US02, US30, US31) · ~23 pts
**But :** un utilisateur s’inscrit/connecte avec un rôle ; squelette app brandé ESTLC ; CI qui lint/test/build.

| Qui | Livrable |
| --- | --- |
| M1 Sara | Repo, CI GitHub Actions, Docker Compose, conventions |
| M2 Emma | HF login + shell app, critères d’acceptation S2 |
| M3 Daniel | Prisma User/Role, register/login, middleware rôles, bcrypt |
| M4 Neh | Schéma Request/Comment/Attachment/History, conventions API |
| M5 Luc | App shell, design system (Button, Input, Table, Badge), pages auth |
| M6 Franck | Stratégie de tests, layout par rôle, premiers tests auth |

### Sprint 2 — Soumission & administration (US03,05,06,07,09,25,26) · ~34 pts
**But :** un demandeur crée une requête avec pièces, obtient un n°, la voit dans sa liste ; l’admin gère services, catégories, utilisateurs.

### Sprint 3 — Traitement (US15,16,17,19,10,12) · ~33 pts
**But :** un agent filtre la file, s’affecte, change le statut, clôture ; le demandeur voit historique + commentaires.

### Sprint 4 — Suivi enrichi & notifications (US18,20,22,23,11,13,34) · ~36 pts
**But :** SLA/priorités, mails + in-app, notes internes, suivi public par n°, annulation, responsive.

### Sprint 5 — Pilotage & robustesse (US21,24,27,28,04,08,14) · ~37 pts
**But :** escalade, rappels, audit, dashboard indicateurs, profil, brouillons, évaluation, revue sécu.

### Sprint 6 — Stabilisation & livraison (US29,33,32) · ~15 + recette
**But :** export CSV/PDF, recherche, prod Docker, guides, démo ESTLC.

---

## 8. Epics & priorités (rappel backlog)

| Epic | Contenu | Priorité v1 |
| --- | --- | --- |
| E1 Comptes & sécurité | US01–04, US03 | Must puis Should/Could |
| E2 Soumission | US05–08 | Must |
| E3 Suivi demandeur | US09–14 | Must + Should |
| E4 Traitement agents | US15–21 | Must + Should |
| E5 Notifications | US22–24 | Should |
| E6 Administration | US25–27 | Must + Should |
| E7 Pilotage | US28–29 | Should / Could |
| E8 Qualité & déploiement | US30–34 | Must |

**Hors v1 (description §3.2) :** appli native, SMS, chatbot, ERP/GED, signature électronique.

---

## 9. Architecture cible (monorepo Next)

```
/app
  /(public)     login, register, suivi/[numero]
  /(demandeur)  dashboard, requetes/*, nouvelle, profil, notifications
  /(agent)      file, requetes/[id], dashboard
  /(admin)      users, services, categories, audit, settings
/api/...
/components/ui  design system ESTLC
/lib            auth, prisma, workflow, mail, sla
/prisma         schema + seed ESTLC
```

Machine à états centralisée dans `lib/workflow.ts` (transitions + droits) — source de vérité unique backend.

---

## 10. Dépendances critiques (découpage §4)

1. Fin S1 : auth + rôles (M3) → bloquant pour écrans protégés (M5/M6).  
2. Début S2 : contrat OpenAPI / types partagés (M4) → mocks parallèles frontend.  
3. S3 : workflow (M4) → écrans traitement (M6).  
4. S4 : SMTP (M1) → notifications (M4).

---

## 11. Definition of Done (obligatoire)

- PR revue par ≥1 autre membre sous 24 h  
- Lint + tests unitaires/intégration verts en CI  
- Critères d’acceptation validés par le PO (Emma)  
- Déployé sur environnement de test  
- Doc API ou guide mise à jour  

Exemple US05 : formulaire refuse champs vides → statut Soumise + n° unique → visible dans la liste → historique « Création ».

---

## 12. Livrables finaux

- App web déployée (Docker)  
- Dépôt Git documenté  
- Cahier de conception (cas d’utilisation, classes, séquences, maquettes)  
- Plan de tests + rapport de recette  
- Guide utilisateur + guide d’installation  
- Présentation / démo ESTLC  

---

## 13. Risques

| Risque | Parade |
| --- | --- |
| Refaire trop large d’un coup | Strictement sprints S1→S6, MoSCoW |
| Stack trop lourde pour 6 | Next monolithe ; SQLite local acceptable jusqu’à S3 |
| Design « démo » | Charte ESTLC + design system dès S1 |
| Auth en retard | M3 prioritaire S1 ; mocks JWT pour M5/M6 si besoin |

---

## 14. Première itération d’implémentation (après approbation)

**Ordre d’exécution immédiat une fois validé :**

1. Remplacer le squelette Express par Next.js + Prisma + seed ESTLC.  
2. Design system + login/register brandés (logos ESTLC/UEB).  
3. Auth + rôles + layouts par rôle.  
4. CI minimale.  
5. Enchaîner Sprint 2 (soumission réelle).

---

## 15. Décisions à valider (cochez / répondez)

- [ ] **Approuver ce PLANNER** comme feuille de route officielle  
- [ ] Nom produit : `ESTLC Requêtes` OK ?  
- [ ] Mapping M1–M6 (Sara / Emma / Daniel / Neh / Luc / Franck) OK ?  
- [ ] Stack Next.js + Prisma + Postgres/SQLite OK ?  
- [ ] On **écrase** l’UI Express actuelle (garde le repo GitHub `UniRequest`) ?  
- [ ] Catégories/services seed ESTLC ci-dessus OK ou liste à modifier ?  

**Dès votre « OK / j’approuve », l’implémentation commence par le Sprint 0 technique + Sprint 1 (fondations).**
