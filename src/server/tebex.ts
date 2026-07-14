import "server-only";
import type { RankId } from "@/server/catalog";
import { getServerEnv } from "@/server/env";

type TebexBasket = {
  ident: string;
  links: { checkout: string };
};

type TebexResponse = {
  data?: TebexBasket;
  error?: string;
};

export function getTebexPackageId(rankId: RankId) {
  const env = getServerEnv();
  return {
    donador: env.TEBEX_PACKAGE_BOSSLY_ID,
    donador_plus: env.TEBEX_PACKAGE_BOSSLY_PLUS_ID,
    donador_premium: env.TEBEX_PACKAGE_BOSSLY_PREMIUM_ID,
  }[rankId];
}

function tebexHeaders() {
  const env = getServerEnv();
  const credentials = Buffer.from(
    `${env.TEBEX_PUBLIC_TOKEN}:${env.TEBEX_PRIVATE_KEY}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function parseTebexResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as TebexResponse;
  if (!response.ok || !payload.data) {
    throw new Error(`Tebex respondió con estado ${response.status}`);
  }
  return payload.data;
}

export async function createTebexCheckout(input: {
  username: string;
  rankId: RankId;
  purchaseId: string;
  origin: string;
  ipAddress: string;
}) {
  const env = getServerEnv();
  const basketResponse = await fetch(
    `https://headless.tebex.io/api/accounts/${encodeURIComponent(env.TEBEX_PUBLIC_TOKEN)}/baskets`,
    {
      method: "POST",
      headers: tebexHeaders(),
      body: JSON.stringify({
        username: input.username,
        ip_address: input.ipAddress,
        complete_url: `${input.origin}/pago/exito`,
        cancel_url: `${input.origin}/pago/cancelado`,
        complete_auto_redirect: true,
        custom: { purchaseId: input.purchaseId, rankId: input.rankId },
      }),
      cache: "no-store",
    },
  );
  const basket = await parseTebexResponse(basketResponse);

  const packageResponse = await fetch(
    `https://headless.tebex.io/api/baskets/${encodeURIComponent(basket.ident)}/packages`,
    {
      method: "POST",
      headers: tebexHeaders(),
      body: JSON.stringify({
        package_id: getTebexPackageId(input.rankId),
        quantity: 1,
      }),
      cache: "no-store",
    },
  );
  const updatedBasket = await parseTebexResponse(packageResponse);
  const checkoutUrl = updatedBasket.links?.checkout ?? basket.links?.checkout;
  if (!checkoutUrl) {
    throw new Error("Tebex no devolvió una URL de checkout");
  }

  return { ident: basket.ident, checkoutUrl };
}
