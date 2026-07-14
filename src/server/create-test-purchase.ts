import "server-only";
import { RANK_CATALOG } from "@/server/catalog";
import type { TestPurchaseInput } from "@/server/purchase-validation";

export type PendingPurchaseData = {
  username: string;
  rankId: string;
  amountCents: number;
  currency: string;
  durationDays: number;
  status: "PENDING";
};

export type PurchaseRepository = {
  create(data: PendingPurchaseData): Promise<{ id: string }>;
};

export async function createTestPurchase(
  input: TestPurchaseInput,
  repository: PurchaseRepository,
) {
  const rank = RANK_CATALOG[input.rankId];

  return repository.create({
    username: input.username,
    rankId: input.rankId,
    amountCents: rank.priceCents,
    currency: rank.currency,
    durationDays: rank.durationDays,
    status: "PENDING",
  });
}
