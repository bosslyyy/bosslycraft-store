import "server-only";

export const RANK_CATALOG = {
  donador: {
    name: "Bossly",
    priceCents: 200,
    currency: "usd",
    durationDays: 30,
    benefits: [
      "Prefijo exclusivo en el chat",
      "2 partículas cosméticas",
      "Color de nombre seleccionable",
    ],
  },
  donador_plus: {
    name: "Bossly Plus",
    priceCents: 500,
    currency: "usd",
    durationDays: 30,
    benefits: [
      "Todo lo incluido en Bossly",
      "5 partículas cosméticas",
      "Efecto visual al entrar",
      "Mascota cosmética",
    ],
  },
  donador_premium: {
    name: "Bossly Premium",
    priceCents: 1000,
    currency: "usd",
    durationDays: 30,
    benefits: [
      "Todo lo incluido en Plus",
      "10 partículas cosméticas",
      "Estela y aura exclusivas",
      "Insignia premium en Discord",
    ],
  },
} as const;

export type RankId = keyof typeof RANK_CATALOG;

export function isRankId(value: string): value is RankId {
  return Object.hasOwn(RANK_CATALOG, value);
}

export function getPublicRanks() {
  return Object.entries(RANK_CATALOG).map(([id, rank]) => ({
    id: id as RankId,
    name: rank.name,
    priceCents: rank.priceCents,
    durationDays: rank.durationDays,
    benefits: [...rank.benefits],
  }));
}
