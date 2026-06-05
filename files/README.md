# Electrolandia — Reservas de carga EV (V1)

App web para reservar el uso de los cargadores de Electrolandia (San Joaquín, Cali). Hecha con **Next.js + Supabase**, lista para desplegar en **Vercel**.

> ¿Vas a continuar el desarrollo con Claude Code? Lee primero **`CLAUDE.md`**.

## Requisitos
- Node.js 18.18+ (recomendado 20+)
- Una cuenta de Supabase (gratis) y una de Vercel (gratis)

## 1. Instalar
```bash
npm install
```

## 2. Crear la base de datos (Supabase)
1. Crea un proyecto en https://supabase.com
2. En el panel: **SQL Editor → New query**, pega el contenido de
   `supabase/migrations/0001_init.sql` y dale **Run**.
   (Crea las tablas `reservas` y `bloqueos`, las extensiones y el índice
   anti-doble-reserva.)
3. En **Project Settings → API** copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (secreta) → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Variables de entorno
Copia el ejemplo y complétalo:
```bash
cp .env.example .env.local
```
```
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...        # secreta, solo servidor
ADMIN_PASSWORD=tu-clave-admin         # para entrar al panel
ADMIN_SESSION_SECRET=string-aleatorio-largo
```

## 4. Correr en local
```bash
npm run dev
```
- Cliente: http://localhost:3000
- Admin: http://localhost:3000/admin (pide la `ADMIN_PASSWORD`)

## 5. Probar lo importante
- Haz una reserva en `/reservar` y verifica la pantalla de confirmación.
- Verifica que aparezca en `/admin`.
- **Doble reserva:** abre dos pestañas e intenta reservar el mismo cargador a
  una hora que se solape → solo una debe quedar; la otra recibe un aviso.

## 6. Desplegar en Vercel
1. Sube el proyecto a un repo (GitHub) e impórtalo en Vercel.
2. En Vercel, agrega las mismas variables de entorno (paso 3).
3. Deploy. Luego genera un **código QR** que apunte a la URL y pégalo en el cargador.

## Estructura
Ver `CLAUDE.md` para el mapa de archivos, el contrato de la API y las reglas de negocio.

## Pendientes conocidos (V1)
- Endurecer auth de admin (migrar a Supabase Auth + RLS) antes de producción seria.
- UI de bloqueos de mantenimiento en el panel (la tabla `bloqueos` ya existe).
- (Opcional) correo de confirmación con Resend.
