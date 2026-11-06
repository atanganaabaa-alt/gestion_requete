import { RequestStatus, Role } from "@prisma/client";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  BROUILLON: "Brouillon",
  SOUMISE: "Soumise",
  AFFECTEE: "Affectée",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente d’information",
  RESOLUE: "Résolue",
  CLOTUREE: "Clôturée",
  REJETEE: "Rejetée",
  ANNULEE: "Annulée",
};

type Transition = {
  to: RequestStatus;
  roles: Role[];
  requireNote?: boolean;
  demandeurOnly?: boolean;
  beforeEnCours?: boolean;
};

const TRANSITIONS: Partial<Record<RequestStatus, Transition[]>> = {
  BROUILLON: [
    { to: "SOUMISE", roles: ["DEMANDEUR", "ADMIN"], demandeurOnly: true },
    { to: "ANNULEE", roles: ["DEMANDEUR", "ADMIN"], demandeurOnly: true },
  ],
  SOUMISE: [
    { to: "AFFECTEE", roles: ["AGENT", "RESPONSABLE", "ADMIN"] },
    { to: "EN_COURS", roles: ["AGENT", "RESPONSABLE", "ADMIN"] },
    { to: "REJETEE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
    { to: "ANNULEE", roles: ["DEMANDEUR", "ADMIN"], demandeurOnly: true, beforeEnCours: true },
  ],
  AFFECTEE: [
    { to: "EN_COURS", roles: ["AGENT", "RESPONSABLE", "ADMIN"] },
    { to: "REJETEE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
    { to: "ANNULEE", roles: ["DEMANDEUR", "ADMIN"], demandeurOnly: true, beforeEnCours: true },
  ],
  EN_COURS: [
    { to: "EN_ATTENTE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
    { to: "RESOLUE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
    { to: "REJETEE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
  ],
  EN_ATTENTE: [
    { to: "EN_COURS", roles: ["AGENT", "RESPONSABLE", "ADMIN", "DEMANDEUR"] },
    { to: "REJETEE", roles: ["AGENT", "RESPONSABLE", "ADMIN"], requireNote: true },
  ],
  RESOLUE: [{ to: "CLOTUREE", roles: ["AGENT", "RESPONSABLE", "ADMIN", "DEMANDEUR"] }],
};

export function canTransition(params: {
  from: RequestStatus;
  to: RequestStatus;
  role: Role;
  isDemandeur: boolean;
  note?: string;
}): { ok: true } | { ok: false; message: string } {
  const options = TRANSITIONS[params.from] ?? [];
  const match = options.find((t) => t.to === params.to);
  if (!match) {
    return {
      ok: false,
      message: `Passage ${STATUS_LABELS[params.from]} → ${STATUS_LABELS[params.to]} impossible.`,
    };
  }
  if (!match.roles.includes(params.role)) {
    return { ok: false, message: "Vous n’avez pas le droit d’effectuer cette action." };
  }
  if (match.demandeurOnly && !params.isDemandeur && params.role !== "ADMIN") {
    return { ok: false, message: "Seul le demandeur peut effectuer cette action." };
  }
  if (match.requireNote && !params.note?.trim()) {
    return { ok: false, message: "Un motif ou une note est obligatoire." };
  }
  return { ok: true };
}

export function nextActions(from: RequestStatus, role: Role, isDemandeur: boolean): RequestStatus[] {
  return (TRANSITIONS[from] ?? [])
    .filter((t) => t.roles.includes(role))
    .filter((t) => !t.demandeurOnly || isDemandeur || role === "ADMIN")
    .map((t) => t.to);
}
