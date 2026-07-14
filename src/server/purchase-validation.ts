import "server-only";
import { z } from "zod";

export const minecraftUsernameSchema = z
  .string()
  .trim()
  .regex(
    /^(?:[A-Za-z0-9_]{3,16}|\.[A-Za-z0-9_ ]{1,16})$/,
    "Usa un username Java válido o el username Bedrock con prefijo .",
  );

export const testPurchaseSchema = z
  .object({
    username: minecraftUsernameSchema,
    rankId: z.enum(["donador", "donador_plus", "donador_premium"]),
  })
  .strict();

export type TestPurchaseInput = z.infer<typeof testPurchaseSchema>;
