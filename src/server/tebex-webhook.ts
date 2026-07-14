import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Prisma, type PurchaseStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { isRankId, RANK_CATALOG, type RankId } from "@/server/catalog";
import { getTebexPackageId } from "@/server/tebex";

type JsonObject = Record<string, unknown>;

export type TebexWebhook = {
  id: string;
  type: string;
  date: string;
  subject: JsonObject;
};

export function createTebexSignature(rawBody: string, secret: string) {
  const bodyHash = createHash("sha256").update(rawBody, "utf8").digest("hex");
  return createHmac("sha256", secret).update(bodyHash).digest("hex");
}

export function verifyTebexSignature(rawBody: string, signature: string, secret: string) {
  const expected = Buffer.from(createTebexSignature(rawBody, secret), "hex");
  const received = Buffer.from(signature.trim(), "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function parseTebexWebhook(value: unknown): TebexWebhook {
  if (!value || typeof value !== "object") throw new Error("Webhook inválido");
  const event = value as JsonObject;
  if (
    typeof event.id !== "string" || !event.id ||
    typeof event.type !== "string" || !event.type ||
    typeof event.date !== "string" ||
    !event.subject || typeof event.subject !== "object" || Array.isArray(event.subject)
  ) {
    throw new Error("Webhook incompleto");
  }
  return event as TebexWebhook;
}

function objectValue(value: unknown): JsonObject | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : undefined;
}

function customData(subject: JsonObject) {
  const direct = objectValue(subject.custom);
  if (direct) return direct;
  const products = Array.isArray(subject.products) ? subject.products : [];
  for (const product of products) {
    const custom = objectValue(objectValue(product)?.custom);
    if (custom) return custom;
  }
  return undefined;
}

function transactionId(subject: JsonObject) {
  return typeof subject.transaction_id === "string" ? subject.transaction_id : undefined;
}

function amountToCents(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round(value * 100)
    : undefined;
}

function validatePurchasedProduct(subject: JsonObject, rankId: RankId) {
  const products = Array.isArray(subject.products) ? subject.products : [];
  const expectedPackageId = getTebexPackageId(rankId);
  const product = products.map(objectValue).find((item) => Number(item?.id) === expectedPackageId);
  if (!product || Number(product.quantity) !== 1) {
    throw new Error("El producto confirmado por Tebex no coincide con el rango");
  }
  const price = objectValue(product.base_price) ?? objectValue(product.paid_price);
  const rank = RANK_CATALOG[rankId];
  if (
    amountToCents(price?.amount) !== rank.priceCents ||
    String(price?.currency ?? "").toLowerCase() !== rank.currency
  ) {
    throw new Error("El importe confirmado por Tebex no coincide con el catálogo");
  }
}

export function statusForTebexEvent(type: string): PurchaseStatus | undefined {
  return {
    "payment.completed": "PAID",
    "payment.declined": "CANCELLED",
    "payment.refunded": "REFUNDED",
    "payment.dispute.opened": "DISPUTED",
    "payment.dispute.won": "PAID",
    "payment.dispute.lost": "DISPUTED",
    "payment.dispute.closed": "DISPUTED",
  }[type] as PurchaseStatus | undefined;
}

function validDate(value: unknown, fallback: string) {
  const date = new Date(typeof value === "string" ? value : fallback);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function processTebexWebhook(event: TebexWebhook) {
  const status = statusForTebexEvent(event.type);
  if (!status) return { outcome: "ignored" as const };

  try {
    return await db.$transaction(async (tx) => {
      if (await tx.webhookEvent.findUnique({ where: { id: event.id } })) {
        return { outcome: "duplicate" as const };
      }

      const custom = customData(event.subject);
      const purchaseId = typeof custom?.purchaseId === "string" ? custom.purchaseId : undefined;
      const paymentId = transactionId(event.subject);
      const purchase = purchaseId
        ? await tx.purchase.findUnique({ where: { id: purchaseId } })
        : paymentId
          ? await tx.purchase.findUnique({ where: { externalPaymentId: paymentId } })
          : null;
      if (!purchase || !isRankId(purchase.rankId)) {
        throw new Error("No se encontró una compra local válida para el webhook");
      }
      if (typeof custom?.rankId === "string" && custom.rankId !== purchase.rankId) {
        throw new Error("El rango del webhook no coincide con la compra");
      }
      validatePurchasedProduct(event.subject, purchase.rankId);

      const data: Prisma.PurchaseUpdateInput = { status };
      if (paymentId) data.externalPaymentId = paymentId;
      if (status === "PAID") {
        const startsAt = validDate(event.subject.settled_at ?? event.subject.created_at, event.date);
        data.startsAt = startsAt;
        data.expiresAt = new Date(startsAt.getTime() + purchase.durationDays * 86_400_000);
      }
      await tx.purchase.update({ where: { id: purchase.id }, data });
      await tx.webhookEvent.create({
        data: { id: event.id, provider: "tebex", type: event.type, purchaseId: purchase.id, outcome: "processed" },
      });
      return { outcome: "processed" as const, purchaseId: purchase.id, status };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { outcome: "duplicate" as const };
    }
    throw error;
  }
}
