import { describe, expect, it } from "vitest";
import { RANK_CATALOG } from "@/server/catalog";

describe("catálogo canónico de rangos", () => {
  it("mantiene precios y duración definidos por el servidor", () => {
    expect(RANK_CATALOG.donador).toMatchObject({ priceCents: 200, durationDays: 30, currency: "usd" });
    expect(RANK_CATALOG.donador_plus).toMatchObject({ priceCents: 500, durationDays: 30, currency: "usd" });
    expect(RANK_CATALOG.donador_premium).toMatchObject({ priceCents: 1000, durationDays: 30, currency: "usd" });
  });
});
