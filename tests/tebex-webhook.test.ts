import { describe, expect, it } from "vitest";
import {
  createTebexSignature,
  parseTebexWebhook,
  statusForTebexEvent,
  verifyTebexSignature,
} from "@/server/tebex-webhook";

describe("webhook de Tebex", () => {
  const secret = "test-secret-with-enough-length";
  const body = JSON.stringify({
    id: "event-1",
    type: "validation.webhook",
    date: "2026-07-14T10:00:00Z",
    subject: {},
  });

  it("verifica la firma usando el cuerpo JSON sin modificar", () => {
    const signature = createTebexSignature(body, secret);
    expect(verifyTebexSignature(body, signature, secret)).toBe(true);
    expect(verifyTebexSignature(`${body} `, signature, secret)).toBe(false);
    expect(verifyTebexSignature(body, "00", secret)).toBe(false);
  });

  it("valida la estructura mínima del evento", () => {
    expect(parseTebexWebhook(JSON.parse(body))).toMatchObject({ id: "event-1" });
    expect(() => parseTebexWebhook({ type: "payment.completed" })).toThrow();
  });

  it("mapea únicamente eventos de pago conocidos", () => {
    expect(statusForTebexEvent("payment.completed")).toBe("PAID");
    expect(statusForTebexEvent("payment.refunded")).toBe("REFUNDED");
    expect(statusForTebexEvent("payment.dispute.opened")).toBe("DISPUTED");
    expect(statusForTebexEvent("unknown.event")).toBeUndefined();
  });
});
