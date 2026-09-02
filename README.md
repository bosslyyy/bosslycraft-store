# 🛒 BosslyCraft · Rank Store

A cosmetic rank store for a Minecraft server, built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Prisma**, **PostgreSQL**, and **Tebex Headless Checkout**. Tebex handles payment processing, and its official plugin delivers ranks in-game.

🔗 **Live demo:** [bosslycraft-store.vercel.app](https://bosslycraft-store.vercel.app)

---

## 💡 What this project solves

A complete e-commerce store for gaming servers: the player picks a rank, pays securely through Tebex, and the system logs and validates the entire transaction in the database — never trusting data sent from the client (price and package are always re-validated server-side).

---

## 🛠️ Tech Stack

- **Next.js** + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **PostgreSQL**
- **Tebex Headless Checkout** (payment processing)
- Signed and verified webhooks

---

## 📋 Requirements

- Node.js 20.9 or higher
- npm
- A local or managed PostgreSQL database (Neon, Supabase, Vercel Postgres, or another compatible option)

---

## ⚙️ Manual Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file. On PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Edit `.env.local` and configure manually:

   - `DATABASE_URL`: private PostgreSQL connection string. Must stay server-side only.
   - `NEXT_PUBLIC_APP_URL`: `http://localhost:3000` locally, and the deployed HTTPS URL on Vercel.
   - `NEXT_PUBLIC_SERVER_IP`: public IP or domain of BosslyCraft.
   - `DISCORD_LINK`: public invite link to the support Discord.
   - `MONTHLY_GOAL_CENTS`: monthly goal in cents; `2000` equals $20 USD.
   - `DEMO_RAISED_CENTS`: demo figure used when applicable.
   - `SERVER_API_TOKEN`: leave empty; will be set once the delivery plugin exists.
   - `TEBEX_PUBLIC_TOKEN`, `TEBEX_PRIVATE_KEY`, and the three `TEBEX_PACKAGE_*_ID`: private credentials and IDs for the Headless integration.
   - `TEBEX_WEBHOOK_SECRET`: the secret Tebex shows when creating the webhook endpoint. Not the same as the server plugin secret.

   > `.env.local` is git-ignored. `.env.example` only contains placeholders and public/non-secret values.

4. Apply migrations and generate the Prisma Client. These commands explicitly load `.env.local`:

   ```bash
   npm run db:deploy
   npm run db:generate
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

---

## 💳 Checkout Flow

Buttons call `POST /api/checkout/tebex` with only:

```json
{
  "username": "Steve_123",
  "rankId": "donador_plus"
}
```

The server validates both fields, retrieves price, duration, and Package ID from private configuration, creates a `pending` purchase, creates the Tebex basket, and returns its checkout URL. Valid internal IDs are `donador`, `donador_plus`, and `donador_premium`. **The endpoint rejects any extra fields, including any price sent by the client** — this prevents price tampering from the frontend.

The confirmation page does not change statuses or deliver ranks. Delivery is handled exclusively by the official Tebex plugin after Tebex confirms the transaction.

---

## 🗄️ Database

Versioned migrations live in `prisma/migrations`. Available statuses are:

- `pending`
- `paid`
- `delivered`
- `refunded`
- `disputed`
- `cancelled`

Use `npm run db:migrate` to create a migration during development. Use `npm run db:deploy` in CI/Vercel; never use `db push` in production.

---

## 🔗 Tebex & Delivery

Set `TEBEX_PUBLIC_TOKEN`, `TEBEX_PRIVATE_KEY`, and the three Package IDs only in `.env.local` and in Vercel. The Private Key must never use the `NEXT_PUBLIC_` prefix or be sent to the browser.

Delivery happens through the official Tebex plugin for Bukkit/Paper, without RCON. The `POST /api/webhooks/tebex` endpoint confirms payments using the raw body and the `X-Signature` header, and logs every event ID to prevent a retry from being processed twice. The webhook updates the database, but never executes commands or delivers ranks — that remains the exclusive responsibility of the official plugin.

Once you have a public HTTPS URL, create the endpoint in Tebex under **Developers → Webhooks → Endpoints** with this address:

```text
https://YOUR-DOMAIN/api/webhooks/tebex
```

Select `payment.completed`, `payment.declined`, `payment.refunded`, and the dispute events. Copy the webhook secret into `TEBEX_WEBHOOK_SECRET` on Vercel and use **Validate**. Keep Test Mode on until you've completed a test purchase and confirmed it moves from `pending` to `paid` in PostgreSQL.

The monthly progress bar only counts purchases confirmed as `paid` whose start date falls within the current UTC month. Prices, Package IDs, and duration are re-checked server-side against the canonical catalog before accepting confirmation.

---

## ☁️ Vercel

Import the repository, connect PostgreSQL, and add the variables from `.env.example` under Project Settings → Environment Variables. The first deploy gets a free `*.vercel.app` URL — use it as `NEXT_PUBLIC_APP_URL` and as the webhook base. Run `npm run db:deploy` against the corresponding database before deploying. Don't run migrations automatically from every app instance.

---

## 🚦 Going from Test to Production

First validate checkout, webhook, database, and delivery in **Test Mode**. To go live, complete Tebex's review, disable Test Mode from their dashboard, and keep the same private variables in Vercel. Never replace keys with hardcoded values or add the `NEXT_PUBLIC_` prefix to them.

---

## ✅ Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Don't commit or push until you've reviewed the changes and migrations.
