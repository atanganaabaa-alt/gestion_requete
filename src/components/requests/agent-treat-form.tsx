"use client";

import { useActionState } from "react";
import type { RequestStatus } from "@prisma/client";
import {
  assignToMeAction,
  transitionRequestAction,
  type AgentActionState,
} from "@/app/actions/agent";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { STATUS_LABELS } from "@/lib/workflow";

const initial: AgentActionState = {};

export function AssignForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(assignToMeAction, initial);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="requestId" value={requestId} />
      <Button type="submit" disabled={pending}>
        {pending ? "Affectation…" : "Me l’affecter"}
      </Button>
      <FieldError message={state.message && !state.ok ? state.message : undefined} />
      {state.ok && state.message && (
        <p className="text-sm text-emerald-800">{state.message}</p>
      )}
    </form>
  );
}

export function TransitionForm({
  requestId,
  actions,
}: {
  requestId: string;
  actions: RequestStatus[];
}) {
  const [state, action, pending] = useActionState(transitionRequestAction, initial);
  if (actions.length === 0) {
    return <p className="text-sm text-muted">Aucune transition disponible pour votre rôle.</p>;
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />
      <div>
        <Label>Nouvel état</Label>
        <select
          name="toStatus"
          required
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm"
          defaultValue={actions[0]}
        >
          {actions.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Note / motif</Label>
        <Textarea
          name="note"
          rows={3}
          placeholder="Obligatoire pour rejet, résolution ou mise en attente."
        />
      </div>
      <div>
        <Label>Réponse finale (si résolution)</Label>
        <Input name="reponseFinale" placeholder="Texte communiqué au demandeur" />
      </div>
      <FieldError message={state.message && !state.ok ? state.message : undefined} />
      {state.ok && state.message && (
        <p className="text-sm text-emerald-800">{state.message}</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Mise à jour…" : "Appliquer le statut"}
      </Button>
    </form>
  );
}
