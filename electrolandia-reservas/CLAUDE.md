# CLAUDE.md — Guía para Claude Code

Lee este archivo antes de tocar el código. Resume qué es el proyecto, qué ya está hecho, qué falta y cómo continuar **sin re-auditar todo**.

## Qué es

App de reservas para un punto de carga de vehículos eléctricos (**Electrolandia**, San Joaquín, Cali). El cliente reserva un horario por internet; el administrador ve y gestiona las reservas. Reemplaza un sistema manual de Google Sheets + Google Forms.

**Esta es la V1 (MVP).** Fuera de alcance ahora: pagos en línea, OCPP/control remoto del cargador, facturación, membresías, app nativa, más sedes.

## Stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** mapeado a los tokens del design system (ver sección «Design system»)
- **Supabase (Postgres)** — acceso desde el servidor con la **service role key**
- **Vercel** para deploy
- Validación con **zod**
- Sin librería de estado: React `useState`

## Design system (adoptado al 100%)

La UI usa el design system ELECTROLANDIA, **única fuente de verdad visual**:

- **Estilos** en `src/styles/` (`tokens.css` → `base.css` → `components.css` → `app.css`), importados en `src/app/layout.tsx` **después** de Tailwind (el DS gana en conflictos). Son copia de `../Desing_system_By_syncraev/styles/`: si actualizás el DS allá, recopiá acá.
- **Fuentes** con `next/font` (Space Grotesk · Hanken Grotesk · JetBrains Mono) en variables propias (`--font-space-grotesk`…). `src/styles/fonts.css` —importado **al final**— las encadena a los tokens `--font-display/body/mono`. Sin ese puente la tipografía caería a system-ui en producción; **no borres `fonts.css` al recopiar el DS**.
- **Iconos**: sprite de línea en `src/components/IconSprite.tsx` (render una vez en el layout); usar `<Icon name="…" />` (`src/components/Icon.tsx`).
- **Chrome compartido**: `SiteHeader.tsx` (`.nav`) + `MobileTabBar.tsx` (`.tabbar`, visible solo ≤760px).
- **Tailwind** (`tailwind.config.ts`) mapeado a los tokens: `bg-primary`, `text-ink-strong`, `rounded-lg`, `shadow-glow`… salen de las mismas variables. Regla: clases del DS (`.btn`, `.card`, `.badge`, `.field`/`.input`, `.slot`, `.segment`, `.chooser-opt`, `.calendar`, `.table`) para componentes; utilidades Tailwind para layout responsive.
- **Color**: lima `--primary` (#C6F542) = energía/CTA, en dosis (1 CTA primario por vista). Cian `--accent` solo para datos de kW. Texto sobre lima = `--primary-ink`.
- **Responsive mobile-first (crítico)**: breakpoints reales 940/760/620; toque ≥44px, texto ≥13.5px. Probá cada pantalla en móvil antes de darla por hecha.

## Reglas de negocio (reales, tomadas del sistema actual)

- **2 cargadores**: `C1` (Cra 90 #16-97) y `C2` (Cra 90 #16-89), contiguos. Cada uno se reserva por separado.
- **Servicio 24/7**: horas de 00:00 a 23:00, todos los días.
- **Reservas multi-hora**: granularidad de 1 hora; una reserva ocupa `[hora_inicio, hora_fin)` dentro del mismo día (la carga es AC ~11 kW = sesiones largas).
- **Tarifa por kWh por franja** (solo informativa; el pago es en sitio: transferencia/QR/efectivo): 7–9am $1.000 · 9am–3pm $900 · 3–7pm $1.000 · 7pm–7am $1.250. Vive en `src/lib/config.ts`.
- **Estados de reserva**: `Confirmada` (inicial) · `Finalizada` · `No asistió` · `Cancelada`. Solo el admin los cambia. `Cancelada` libera el horario.
- **Mantenimiento**: tabla `bloqueos` (equivale al "En mantenimiento" naranja del sheet) — bloquea horas de un cargador.
- Conectores que se piden: `J1772 Tipo 1`, `Tipo 2`, `GB/T-AC`, `No estoy seguro`.
- Contacto: WhatsApp +57 310 817 6786 · electrolandia.vs@gmail.com · Maps en `config.ts`.

## Modelo de datos

Ver `supabase/migrations/0001_init.sql`. Tabla `reservas` + tabla `bloqueos`.

🔒 **La prevención de doble reserva es a nivel de base de datos** (no solo en la UI): un índice de exclusión GiST impide que dos reservas activas del mismo cargador se solapen en el tiempo:

```sql
constraint reservas_sin_solape
  exclude using gist (cargador with =, periodo with &&)
  where (estado <> 'Cancelada')
```

`periodo` es un `tsrange` generado a partir de `fecha + hora_inicio` y `fecha + hora_fin`. Requiere las extensiones `btree_gist` y `pgcrypto`. La API además revalida en servidor antes de insertar y maneja el error `23P01` (choque) devolviendo 409.

## Mapa de archivos

```
supabase/migrations/0001_init.sql   Esquema + anti-doble-reserva + mantenimiento
src/lib/config.ts                   Cargadores, horario, tarifas, conectores, contacto
src/lib/types.ts                    Tipos (Reserva, Disponibilidad…)
src/lib/availability.ts             Lógica pura: horas, solapamiento, rango libre
src/lib/supabase.ts                 Cliente Supabase (service role) SOLO servidor
src/middleware.ts                   Protege /admin
src/app/page.tsx                    P1 Inicio (landing)
src/app/reservar/page.tsx           P2+P3 Disponibilidad + formulario (client)
src/app/confirmacion/[id]/page.tsx  P4 Confirmación (server)
src/app/admin/login/page.tsx        Login admin
src/app/admin/page.tsx              P5 Panel (client)
src/app/api/disponibilidad/route.ts GET disponibilidad por fecha
src/app/api/reservas/route.ts       POST crear reserva (valida + anti-doble-reserva)
src/app/api/admin/login/route.ts    POST/DELETE sesión admin (cookie)
src/app/api/admin/reservas/route.ts GET listar + PATCH cambiar estado
```

## Contrato de la API

- `GET /api/disponibilidad?fecha=YYYY-MM-DD` → `{ fecha, cargadores: [{ cargador, nombre, horas: [{hora,label,libre}] }] }`
- `POST /api/reservas` → body con datos del formulario + `hora_inicio`/`hora_fin` (números 0–24). Devuelve `201 {id}` o `409` si el horario se ocupó, o `400` con `detalles`.
- `GET /api/admin/reservas?filtro=hoy|proximas` → `{ reservas: [...] }` (requiere sesión).
- `PATCH /api/admin/reservas?id=UUID` → body `{ estado }` (requiere sesión).

## Cómo correr (local)

1. `npm install`
2. Copia `.env.example` a `.env.local` y llénalo (ver README para crear el proyecto Supabase y correr la migración).
3. `npm run dev` → http://localhost:3000

## Qué falta / orden sugerido para continuar

Prioriza en este orden. Marca cada uno al terminar.

1. **Verificar el flujo end-to-end** con datos reales en Supabase: reservar desde `/reservar`, ver la confirmación, y verla en `/admin`.
2. **Probar la no-doble-reserva**: abre dos pestañas e intenta reservar el mismo cargador/horario solapado → solo una debe entrar; la otra recibe 409. Confirma que el índice de exclusión está activo (la migración corrió completa).
3. **Pulir la UI** (mobile-first) con las clases del design system (`src/styles/`). Revisar estados de carga, vacíos y errores en cada breakpoint (940/760/620).
4. **Bloqueos de mantenimiento en el admin**: agregar UI + endpoint `POST/DELETE /api/admin/bloqueos` para crear/quitar bloqueos (la tabla ya existe).
5. **Endurecer seguridad** (ver abajo).
6. *(Opcional V1)* **Correo de confirmación** con Resend al crear la reserva (hay un `TODO` en `api/reservas/route.ts`).

### Criterios de aceptación V1
- Un cliente puede reservar en < 1 min desde el celular y recibir la pantalla de confirmación con todos los datos + botón a Maps.
- Es imposible que dos reservas activas ocupen el mismo cargador a la misma hora.
- El admin ve hoy/próximas y puede cambiar estado (Confirmada/Finalizada/No asistió/Cancelada).
- Cancelar libera el horario.

## Seguridad — pendientes importantes

- **`SUPABASE_SERVICE_ROLE_KEY` es secreta y solo se usa en el servidor.** Nunca importes `src/lib/supabase.ts` desde un componente `"use client"` ni la expongas al navegador.
- **Auth de admin V1 es básica** (clave compartida → cookie httpOnly). Para producción: migrar a **Supabase Auth** (un usuario admin) y activar **RLS** + políticas en las tablas; entonces usar la anon key para lecturas/inserts públicos con políticas. Ver la nota al final de la migración SQL.
- Validar/normalizar entradas (ya se usa zod en `reservas`; replicar en endpoints nuevos).

## Convenciones

- Español en UI, nombres de DB y mensajes (incluye tildes: `No asistió`).
- Horas como enteros 0–24 en la app; en DB como `time` (`HH:00:00`, fin puede ser `24:00:00`).
- Reservas dentro del mismo día (no cruzan medianoche en V1). Si se requiere overnight, es una mejora aparte.
- Alias de imports: `@/` → `src/`.

## Backlog V2/V3 (NO hacer ahora)
WhatsApp (confirmación + recordatorio), recordatorios y mensaje post-servicio, selector de vehículo → conector/adaptador automático + tiempo estimado, reportes de ocupación/horas pico/no-shows, pagos en línea (Wompi/Nequi/PSE), OCPP, facturación, membresías, multi-sede, cargador rápido CCS1/CCS2 (próximamente).
