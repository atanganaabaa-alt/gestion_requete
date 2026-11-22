import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canTreatRequest } from "../src/lib/access";
import { canTransition, nextActions } from "../src/lib/workflow";

describe("droits de traitement", () => {
  it("autorise agent, responsable et admin seulement", () => {
    assert.equal(canTreatRequest("AGENT"), true);
    assert.equal(canTreatRequest("RESPONSABLE"), true);
    assert.equal(canTreatRequest("ADMIN"), true);
    assert.equal(canTreatRequest("DEMANDEUR"), false);
  });
});

describe("transitions agent", () => {
  it("permet SOUMISE → AFFECTEE pour un agent", () => {
    assert.deepEqual(
      canTransition({
        from: "SOUMISE",
        to: "AFFECTEE",
        role: "AGENT",
        isDemandeur: false,
      }),
      { ok: true }
    );
  });

  it("exige une note pour le rejet", () => {
    const without = canTransition({
      from: "EN_COURS",
      to: "REJETEE",
      role: "AGENT",
      isDemandeur: false,
    });
    assert.equal(without.ok, false);

    const withNote = canTransition({
      from: "EN_COURS",
      to: "REJETEE",
      role: "AGENT",
      isDemandeur: false,
      note: "Dossier incomplet",
    });
    assert.deepEqual(withNote, { ok: true });
  });

  it("liste les actions agent depuis EN_COURS", () => {
    const actions = nextActions("EN_COURS", "AGENT", false);
    assert.ok(actions.includes("EN_ATTENTE"));
    assert.ok(actions.includes("RESOLUE"));
    assert.ok(actions.includes("REJETEE"));
    assert.ok(!actions.includes("ANNULEE"));
  });

  it("permet la clôture depuis RESOLUE", () => {
    assert.deepEqual(
      canTransition({
        from: "RESOLUE",
        to: "CLOTUREE",
        role: "AGENT",
        isDemandeur: false,
      }),
      { ok: true }
    );
  });
});
