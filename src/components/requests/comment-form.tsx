"use client";

import { useActionState, useEffect, useRef } from "react";
import { addCommentAction, type AgentActionState } from "@/app/actions/agent";
import { Button } from "@/components/ui/button";
import { FieldError, Label, Textarea } from "@/components/ui/input";

const initial: AgentActionState = {};

export function CommentForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(addCommentAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />
      <div>
        <Label>Nouveau commentaire</Label>
        <Textarea
          name="body"
          required
          rows={3}
          placeholder="Précisez une information visible par le demandeur et l’agent."
        />
      </div>
      <FieldError message={state.message && !state.ok ? state.message : undefined} />
      {state.ok && state.message && (
        <p className="text-sm text-emerald-800">{state.message}</p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Envoi…" : "Publier"}
      </Button>
    </form>
  );
}
