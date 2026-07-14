import { describe, expect, it, vi } from "vitest";
import { createTestPurchase } from "@/server/create-test-purchase";

describe("createTestPurchase", () => {
  it("crea una compra pending con el precio canónico", async () => {
    const create = vi.fn(async (data) => ({ id: "purchase_1", ...data }));

    const purchase = await createTestPurchase(
      { username: "Steve", rankId: "donador_plus" },
      { create },
    );

    expect(create).toHaveBeenCalledWith({
      username: "Steve",
      rankId: "donador_plus",
      amountCents: 500,
      currency: "usd",
      durationDays: 30,
      status: "PENDING",
    });
    expect(purchase.id).toBe("purchase_1");
  });
});
