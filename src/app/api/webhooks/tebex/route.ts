import { getTebexWebhookSecret } from "@/server/env";
import {
  parseTebexWebhook,
  processTebexWebhook,
  verifyTebexSignature,
} from "@/server/tebex-webhook";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");
  let secret: string;
  try {
    secret = getTebexWebhookSecret();
  } catch {
    console.error("tebex_webhook_secret_missing");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }
  if (!signature || !verifyTebexSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let event;
  try {
    event = parseTebexWebhook(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "validation.webhook") {
    return NextResponse.json({ id: event.id });
  }

  try {
    const result = await processTebexWebhook(event);
    return NextResponse.json({ received: true, outcome: result.outcome });
  } catch (error) {
    console.error("tebex_webhook_processing_error", error);
    return NextResponse.json({ error: "No se pudo procesar el webhook" }, { status: 422 });
  }
}
