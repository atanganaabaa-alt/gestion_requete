import { PrismaClient, Role } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.rating.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.request.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();

  const services = await Promise.all([
    prisma.service.create({
      data: {
        code: "SCOL",
        name: "Scolarité",
        description: "Documents étudiants, attestations, relevés",
      },
    }),
    prisma.service.create({
      data: {
        code: "GSI",
        name: "Département GSI",
        description: "Génie Informatique des Systèmes Logistiques Intelligents",
      },
    }),
    prisma.service.create({
      data: {
        code: "TRANS",
        name: "Département Transport",
        description: "Transport, logistique et commerce",
      },
    }),
    prisma.service.create({
      data: {
        code: "PAT",
        name: "Patrimoine",
        description: "Salles, matériel, réservations",
      },
    }),
    prisma.service.create({
      data: {
        code: "DIR",
        name: "Direction des études",
        description: "Recours, stages, courriers officiels",
      },
    }),
    prisma.service.create({
      data: {
        code: "DSI",
        name: "DSI",
        description: "Assistance informatique et comptes",
      },
    }),
  ]);

  const byCode = Object.fromEntries(services.map((s) => [s.code, s]));

  const categories = [
    { code: "RELEVE", name: "Relevé de notes", service: "SCOL" },
    { code: "ATTEST", name: "Attestation de scolarité", service: "SCOL" },
    { code: "RECOURS", name: "Recours de note", service: "DIR" },
    { code: "INSCR", name: "Inscription / documents concours", service: "SCOL" },
    { code: "SALLE", name: "Réservation de salle / matériel", service: "PAT" },
    { code: "STAGE", name: "Stage / lettre de recommandation", service: "DIR" },
    { code: "IT", name: "Assistance informatique", service: "DSI" },
    { code: "AUTRE", name: "Autre demande administrative", service: "SCOL" },
  ];

  for (const c of categories) {
    await prisma.category.create({
      data: {
        code: c.code,
        name: c.name,
        serviceId: byCode[c.service].id,
      },
    });
  }

  const password = hashSync("Estlc2026!", 10);

  const users: Array<{
    email: string;
    nom: string;
    role: Role;
    service?: string;
  }> = [
    { email: "etudiant@estlc.cm", nom: "Amina Ngo", role: "DEMANDEUR" },
    { email: "agent@estlc.cm", nom: "M. Owona", role: "AGENT", service: "SCOL" },
    {
      email: "responsable@estlc.cm",
      nom: "Dr. Fotso",
      role: "RESPONSABLE",
      service: "GSI",
    },
    { email: "admin@estlc.cm", nom: "Admin ESTLC", role: "ADMIN", service: "DSI" },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        email: u.email,
        nom: u.nom,
        role: u.role,
        passwordHash: password,
        serviceId: u.service ? byCode[u.service].id : undefined,
      },
    });
  }

  console.log("Seed ESTLC OK — mot de passe démo : Estlc2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
