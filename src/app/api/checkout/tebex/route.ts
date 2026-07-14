import { db } from "@/lib/db";
import { RANK_CATALOG } from "@/server/catalog";
import { testPurchaseSchema } from "@/server/purchase-validation";
import { createTebexCheckout } from "@/server/tebex";
import { NextRequest, NextResponse } from "next/server";

function requestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
  return candidate.includes(":") ? "127.0.0.1" : candidate;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 });
  }

  const parsed = testPurchaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const { username, rankId } = parsed.data;
  const rank = RANK_CATALOG[rankId];
  const purchase = await db.purchase.create({
    data: {
      username,
      rankId,
      amountCents: rank.priceCents,
      currency: rank.currency,
      durationDays: rank.durationDays,
      status: "PENDING",
      paymentProvider: "tebex",
    },
  });

  try {
    const checkout = await createTebexCheckout({
      username,
      rankId,
      purchaseId: purchase.id,
      origin: process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin,
      ipAddress: requestIp(request),
    });
    await db.purchase.update({
      where: { id: purchase.id },
      data: { externalCheckoutSessionId: checkout.ident },
    });
    return NextResponse.json({ redirectUrl: checkout.checkoutUrl });
  } catch (error) {
    await db.purchase.update({
      where: { id: purchase.id },
      data: { status: "CANCELLED" },
    });
    console.error("tebex_checkout_error", error);
    return NextResponse.json(
      { error: "No se pudo abrir el checkout de Tebex" },
      { status: 502 },
    );
  }
}
