-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'paid', 'delivered', 'refunded', 'disputed', 'cancelled');

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "durationDays" INTEGER NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "paymentProvider" TEXT,
    "externalPaymentId" TEXT,
    "externalCheckoutSessionId" TEXT,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchases_externalPaymentId_key" ON "purchases"("externalPaymentId");
CREATE UNIQUE INDEX "purchases_externalCheckoutSessionId_key" ON "purchases"("externalCheckoutSessionId");
CREATE INDEX "purchases_username_status_idx" ON "purchases"("username", "status");
CREATE INDEX "purchases_status_createdAt_idx" ON "purchases"("status", "createdAt");
