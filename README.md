# ESTLC Requêtes

Plateforme de suivi de requêtes de l’École Supérieure de Transport, de Logistique et de Commerce (Université d’Ebolowa, Ambam).

Équipe : Atangana Sara, Neh Ngapouh, Maffo Daniel, Sibefeu Luc, Wome Franck, Emma Nkot.

Feuille de route : [PLANNER.md](PLANNER.md) (sprints 0 à 6, backlog US01–US34).

## Lancer

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Ouvrir [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Comptes de démonstration

Mot de passe : `Estlc2026!`

| Courriel | Rôle |
| --- | --- |
| etudiant@estlc.cm | Demandeur |
| agent@estlc.cm | Agent scolarité |
| responsable@estlc.cm | Responsable GSI |
| admin@estlc.cm | Administrateur |

## État Sprint 2

- Soumission avec pièces PDF/JPG/PNG (1 Ko–5 Mo, 5 max) et numéro `REQ-AAAA-#####`
- Confirmation du numéro et téléchargement des pièces selon le rôle
- Réinitialisation du mot de passe (lien local, SMTP au sprint 4)
- Administration : comptes, services, catégories

## État Sprint 1

- Auth inscription / connexion, rôles, espaces demandeur, agent et admin
- Design ESTLC (navy / rouge, logos)
- Soumission d’une requête et suivi public par numéro
- Schéma Prisma complet (workflow, SLA, audit, notifications)
