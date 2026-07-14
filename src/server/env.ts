import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL debe ser una URL PostgreSQL válida")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL debe usar el protocolo PostgreSQL",
    ),
  MONTHLY_GOAL_CENTS: z.coerce.number().int().positive().default(2000),
  DEMO_RAISED_CENTS: z.coerce.number().int().nonnegative().default(750),
  TEBEX_PUBLIC_TOKEN: z.string().min(1),
  TEBEX_PRIVATE_KEY: z.string().min(1),
  TEBEX_PACKAGE_BOSSLY_ID: z.coerce.number().int().positive(),
  TEBEX_PACKAGE_BOSSLY_PLUS_ID: z.coerce.number().int().positive(),
  TEBEX_PACKAGE_BOSSLY_PREMIUM_ID: z.coerce.number().int().positive(),
});

const webhookEnvSchema = z.object({
  TEBEX_WEBHOOK_SECRET: z.string().min(16, "TEBEX_WEBHOOK_SECRET no está configurado"),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    MONTHLY_GOAL_CENTS: process.env.MONTHLY_GOAL_CENTS,
    DEMO_RAISED_CENTS: process.env.DEMO_RAISED_CENTS,
    TEBEX_PUBLIC_TOKEN: process.env.TEBEX_PUBLIC_TOKEN,
    TEBEX_PRIVATE_KEY: process.env.TEBEX_PRIVATE_KEY,
    TEBEX_PACKAGE_BOSSLY_ID: process.env.TEBEX_PACKAGE_BOSSLY_ID,
    TEBEX_PACKAGE_BOSSLY_PLUS_ID: process.env.TEBEX_PACKAGE_BOSSLY_PLUS_ID,
    TEBEX_PACKAGE_BOSSLY_PREMIUM_ID: process.env.TEBEX_PACKAGE_BOSSLY_PREMIUM_ID,
  });
}


export function getTebexWebhookSecret() {
  return webhookEnvSchema.parse({
    TEBEX_WEBHOOK_SECRET: process.env.TEBEX_WEBHOOK_SECRET,
  }).TEBEX_WEBHOOK_SECRET;
}
