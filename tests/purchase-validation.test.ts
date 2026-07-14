import { describe, expect, it } from "vitest";
import {
  minecraftUsernameSchema,
  testPurchaseSchema,
} from "@/server/purchase-validation";

describe("minecraftUsernameSchema", () => {
  it.each(["Steve", "Alex_123", "abc", "A123456789012345", ".Bedrock", ".Player One"])(
    "acepta %s",
    (username) => {
      expect(minecraftUsernameSchema.parse(username)).toBe(username);
    },
  );

  it.each(["ab", "abcdefghijklmnopq", "Steve-123", "Álex", "a b", "."])(
    "rechaza %s",
    (username) => {
      expect(minecraftUsernameSchema.safeParse(username).success).toBe(false);
    },
  );
});

describe("testPurchaseSchema", () => {
  it.each(["donador", "donador_plus", "donador_premium"])(
    "acepta el rankId %s",
    (rankId) => {
      expect(testPurchaseSchema.safeParse({ username: "Steve", rankId }).success).toBe(true);
    },
  );

  it("rechaza rankId desconocido", () => {
    expect(
      testPurchaseSchema.safeParse({ username: "Steve", rankId: "admin" }).success,
    ).toBe(false);
  });

  it("rechaza campos de precio enviados por el cliente", () => {
    expect(
      testPurchaseSchema.safeParse({
        username: "Steve",
        rankId: "donador",
        amountCents: 1,
      }).success,
    ).toBe(false);
  });
});
