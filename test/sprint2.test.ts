import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateUpload, validateUploads } from "../src/lib/files";
import { formatNumero } from "../src/lib/numero";
import { canReadRequest } from "../src/lib/access";

describe("pièces jointes", () => {
  it("accepte un PDF dans les bornes", () => {
    assert.equal(
      validateUpload({ name: "carte.pdf", type: "application/pdf", size: 2048 }),
      null
    );
  });

  it("refuse un type inconnu et un fichier trop gros", () => {
    assert.match(
      validateUpload({ name: "note.txt", type: "text/plain", size: 2048 }) ?? "",
      /PDF/
    );
    assert.match(
      validateUpload({ name: "scan.pdf", type: "application/pdf", size: 6 * 1024 * 1024 }) ?? "",
      /5 Mo/
    );
  });

  it("refuse plus de cinq fichiers", () => {
    const files = Array.from({ length: 6 }, (_, i) => ({
      name: `p${i}.pdf`,
      type: "application/pdf",
      size: 2048,
    }));
    assert.match(validateUploads(files) ?? "", /Cinq/);
  });
});

describe("numéro de suivi", () => {
  it("formate REQ-année-00001", () => {
    assert.equal(formatNumero(2026, 0), "REQ-2026-00001");
    assert.equal(formatNumero(2026, 41), "REQ-2026-00042");
  });
});

describe("accès aux pièces", () => {
  it("laisse le demandeur lire sa requête et refuse celle d’un autre", () => {
    assert.equal(
      canReadRequest({
        role: "DEMANDEUR",
        userId: "a",
        demandeurId: "a",
        requestServiceId: "scol",
      }),
      true
    );
    assert.equal(
      canReadRequest({
        role: "DEMANDEUR",
        userId: "b",
        demandeurId: "a",
        requestServiceId: "scol",
      }),
      false
    );
  });

  it("limite l’agent à son service", () => {
    assert.equal(
      canReadRequest({
        role: "AGENT",
        userId: "ag",
        serviceId: "scol",
        demandeurId: "a",
        requestServiceId: "scol",
      }),
      true
    );
    assert.equal(
      canReadRequest({
        role: "AGENT",
        userId: "ag",
        serviceId: "gsi",
        demandeurId: "a",
        requestServiceId: "scol",
      }),
      false
    );
  });
});
