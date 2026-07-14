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
   - `DISCORD_LINK`: invitación pública al Discord de soporte.
   - `MONTHLY_GOAL_CENTS`: meta mensual en centavos; `2000` equivale a $20 USD.
   - `DEMO_RAISED_CENTS`: cifra de demostración usada cuando corresponda.
   - `SERVER_API_TOKEN`: déjalo vacío; se configurará cuando exista el plugin de entrega.
   - `TEBEX_PUBLIC_TOKEN`, `TEBEX_PRIVATE_KEY` y los tres `TEBEX_PACKAGE_*_ID`: credenciales e identificadores privados de la integración Headless.
   - `TEBEX_WEBHOOK_SECRET`: secreto que Tebex muestra al crear el endpoint de webhook. No es el secret del plugin del servidor.

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

La entrega se realiza mediante el plugin oficial de Tebex para Bukkit/Paper, sin RCON. El endpoint `POST /api/webhooks/tebex` confirma pagos usando el cuerpo original y la firma `X-Signature`; además registra cada ID de evento para impedir que un reintento se procese dos veces. El webhook actualiza la base de datos, pero nunca ejecuta comandos ni entrega rangos: eso sigue siendo responsabilidad exclusiva del plugin oficial.

Cuando exista una URL HTTPS pública, crea el endpoint en Tebex desde **Developers → Webhooks → Endpoints** con esta dirección:

```text
https://TU-DOMINIO/api/webhooks/tebex
```

Selecciona `payment.completed`, `payment.declined`, `payment.refunded` y los eventos de disputa. Copia el webhook secret a `TEBEX_WEBHOOK_SECRET` en Vercel y usa **Validate**. Mantén Test Mode activo hasta completar una compra ficticia y confirmar que la compra pasa de `pending` a `paid` en PostgreSQL.

La barra mensual suma únicamente compras confirmadas como `paid` cuya fecha de inicio pertenece al mes UTC actual. Los precios, Package IDs y duración se vuelven a comprobar en el servidor con el catálogo canónico antes de aceptar la confirmación.

## Vercel

Importa el repositorio, conecta PostgreSQL y añade las variables de `.env.example` desde Project Settings → Environment Variables. El primer despliegue recibe una URL gratuita `*.vercel.app`; úsala como `NEXT_PUBLIC_APP_URL` y como base del webhook. Antes del despliegue aplica `npm run db:deploy` contra la base correspondiente. No ejecutes migraciones automáticamente desde cada instancia de la aplicación.

## Paso de prueba a producción

Primero valida checkout, webhook, base de datos y entrega con **Test Mode**. Para pasar a producción, completa la revisión de Tebex, desactiva Test Mode desde su panel y conserva las mismas variables privadas en Vercel. No reemplaces las claves por valores escritos en el código ni les añadas el prefijo `NEXT_PUBLIC_`.

## Verificación

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

No hagas commit ni push hasta revisar los cambios y las migraciones.
