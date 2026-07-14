# BosslyCraft · Tienda de rangos

Tienda de rangos cosméticos con Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL y Tebex Headless Checkout. Tebex procesa el pago y su plugin oficial entrega los rangos dentro del servidor.

## Requisitos

- Node.js 20.9 o superior.
- npm.
- Una base PostgreSQL local o administrada (Neon, Supabase, Vercel Postgres u otra compatible).

## Configuración manual

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo de ejemplo. En PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Edita `.env.local` y configura manualmente:

   - `DATABASE_URL`: cadena privada de conexión PostgreSQL. Debe permanecer solo en el servidor.
   - `NEXT_PUBLIC_APP_URL`: `http://localhost:3000` en local y la URL HTTPS del despliegue en Vercel.
   - `NEXT_PUBLIC_SERVER_IP`: IP o dominio público de BosslyCraft.
   - `MONTHLY_GOAL_CENTS`: meta mensual en centavos; `2000` equivale a $20 USD.
   - `DEMO_RAISED_CENTS`: cifra de demostración usada cuando corresponda.
   - `SERVER_API_TOKEN`: déjalo vacío; se configurará cuando exista el plugin de entrega.

   `.env.local` está ignorado por Git. `.env.example` contiene únicamente marcadores y valores públicos/no secretos.

4. Aplica las migraciones y genera Prisma Client. Estos comandos cargan `.env.local` explícitamente:

   ```bash
   npm run db:deploy
   npm run db:generate
   ```

5. Inicia la aplicación:

   ```bash
   npm run dev
   ```

   Abre `http://localhost:3000`.

## Flujo de checkout

Los botones llaman a `POST /api/checkout/tebex` con solo:

```json
{
  "username": "Steve_123",
  "rankId": "donador_plus"
}
```

El servidor valida ambos campos, obtiene precio, duración y Package ID desde configuración privada, crea una compra `pending`, crea la cesta en Tebex y devuelve su URL de checkout. Los IDs internos válidos son `donador`, `donador_plus` y `donador_premium`. El endpoint rechaza campos adicionales, incluido cualquier precio enviado por el cliente.

La página de confirmación no cambia estados ni entrega rangos. La entrega corresponde exclusivamente al plugin oficial de Tebex después de que Tebex confirma la operación.

## Base de datos

Las migraciones versionadas están en `prisma/migrations`. Los estados disponibles son:

- `pending`
- `paid`
- `delivered`
- `refunded`
- `disputed`
- `cancelled`

Para crear una migración durante desarrollo usa `npm run db:migrate`. En CI/Vercel usa `npm run db:deploy`; no uses `db push` en producción.

## Tebex y entrega

Configura `TEBEX_PUBLIC_TOKEN`, `TEBEX_PRIVATE_KEY` y los tres Package IDs únicamente en `.env.local` y en Vercel. La Private Key nunca debe usar el prefijo `NEXT_PUBLIC_` ni enviarse al navegador.

La entrega se realiza mediante el plugin oficial de Tebex para Bukkit/Paper, sin RCON. El registro local permanece `pending` hasta que una futura integración de webhooks sincronice los estados de pago; esto no interfiere con la entrega del plugin.

## Vercel

Importa el repositorio, conecta PostgreSQL y añade las variables de `.env.example` desde Project Settings → Environment Variables. Antes del despliegue aplica `npm run db:deploy` contra la base correspondiente. No ejecutes migraciones automáticamente desde cada instancia de la aplicación.

## Verificación

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

No hagas commit ni push hasta revisar los cambios y las migraciones.
