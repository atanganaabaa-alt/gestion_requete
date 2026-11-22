import type { Role } from "@prisma/client";

export function canTreatRequest(role: Role): boolean {
  switch (role) {
    case "AGENT":
    case "RESPONSABLE":
    case "ADMIN":
      return true;
    case "DEMANDEUR":
      return false;
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function canReadRequest(params: {
  role: Role;
  userId: string;
  serviceId?: string | null;
  demandeurId: string;
  requestServiceId: string;
}): boolean {
  switch (params.role) {
    case "ADMIN":
      return true;
    case "DEMANDEUR":
      return params.userId === params.demandeurId;
    case "AGENT":
    case "RESPONSABLE":
      return Boolean(params.serviceId) && params.serviceId === params.requestServiceId;
    default: {
      const _exhaustive: never = params.role;
      return _exhaustive;
    }
  }
}
