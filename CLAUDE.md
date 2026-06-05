# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Todo el proyecto está en español. Mantené español en UI, nombres de DB y mensajes (con tildes: `No asistió`).

## Qué es

App de reservas para el punto de carga de vehículos eléctricos de **Electrolandia** (San Joaquín, Cali). El cliente reserva un horario; el admin gestiona las reservas. **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase**, lista para **Vercel**. Es la V1 (MVP).

**El código está extraído en `electrolandia-reservas/`** (la entrega original sigue comprimida en `files/electrolandia-reservas-v1.zip`). Su `CLAUDE.md` interno es **la fuente de verdad del código**: mapa de archivos, contrato de API, modelo de datos, seguridad y el design system ya adoptado. Leelo antes de tocar la app.

> Los `.md` de la raíz (`Analisis-*`, `MVP-V1-*`) son contexto histórico de planificación, **no autoritativos**. Donde difieran del código, **manda la app implementada**.

## Comandos (dentro de `electrolandia-reservas/`)

No hay tests en el proyecto. `package.json` define solo:

```bash
npm install
cp .env.example .env.local      # NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm run dev                     # http://localhost:3000 · admin en /admin
npm run build
npm run lint                    # next lint
```

DB: en Supabase → **SQL Editor → New query** → pegar `supabase/migrations/0001_init.sql` → **Run**.

---

## 🎨 Design system — adoptado al 100%

**El sistema visual de la app es el de `Desing_system_By_syncraev/`, la ÚNICA fuente de verdad de UI. Ya está adoptado en `electrolandia-reservas/`** (fuentes, tokens, componentes e iconos). Las fuentes viejas Sora/Manrope quedaron reemplazadas por Space Grotesk / Hanken Grotesk / JetBrains Mono.

**Fuente de verdad** (`Desing_system_By_syncraev/styles/`):
- `tokens.css` → color, tipografía, espaciado, radios, sombras. **Single source of truth.** Siempre `var(--token)`, **nunca HEX sueltos**.
- `base.css` → reset, tipografía base, utilidades de layout/texto.
- `components.css` → `.btn` · `.input` · `.card` · `.badge` · `.calendar` · `.table` · `.nav` · `.tabbar`… **Reusá estos antes de crear nada nuevo.**
- `app.css` → helpers de pantalla (hero, stepper, grids, confirmación).
- `assets/icons.js` → sprite de iconos de línea.
- `pantallas/` (Home, Reserva, Panel Admin) → implementaciones de referencia: copiá su estructura.

**Reglas del sistema:**
- **Tipografía:** Space Grotesk (display/titulares) · Hanken Grotesk (UI/cuerpo) · JetBrains Mono (datos: kW, horas, placas, IDs → `.t-data`/`.mono`).
- **Color primario:** lima `--primary` (`#C6F542`). **Regla de oro: el lima es energía, no fondo.** Úsalo en dosis (CTA principal, estado activo, acentos). Texto sobre lima = `--primary-ink`. Lima como texto en claro = `--primary-text`. **Un solo CTA primario por vista.**
- **Cian `--accent`** (`#14C2C9`): EXCLUSIVO para datos de energía (kW, carga en vivo). Nunca como CTA.
- **Estados de reserva (badges):** `success`=Confirmada/Disponible · `warning`=Ocupado · `danger`=Cancelada · `info`=Finalizada · `noshow`=No asistió · `charging`(cian)=Cargando.
- **Iconos:** solo del sprite → `<svg class="icon"><use href="#i-NOMBRE"></use></svg>`. Trazo 1.75, sin relleno.
- **Espaciado:** múltiplos de 4 (`--space-*`). Layout con flex/grid + `gap`.

**Cómo quedó integrado (en `electrolandia-reservas/`):**
1. Las 3 fuentes se sirven con `next/font` (`src/app/layout.tsx`); Sora/Manrope, borradas.
2. `src/styles/` tiene copia de `tokens.css`/`base.css`/`components.css`/`app.css`, importadas **después** de Tailwind. Si cambiás el DS en `Desing_system_By_syncraev/`, recopiá a `src/styles/`.
3. `tailwind.config.ts` mapea el theme a los tokens; los iconos son `src/components/IconSprite.tsx` + `<Icon/>`; el chrome es `SiteHeader` + `MobileTabBar`.
4. Tono: tecnológico pero cercano y simple. Sin saturar de lima, sin iconografía infantil, sin exceso de rayos/glows.

---

## 📱 Responsive — mobile-first es CRÍTICO

La mayoría reserva **desde el celular o escaneando el QR del cargador**. Cada pantalla se diseña y se prueba **primero en móvil**; el desktop es la mejora, no al revés. **Ninguna pantalla está terminada hasta verla bien en viewport móvil.**

**Breakpoints reales del CSS de producto** (`styles/app.css` — usalos, no inventes otros):

| Ancho | Qué cambia |
| --- | --- |
| **≤ 940px** | Grids `.cols-4` y `.cols-3` colapsan a **2 columnas**. |
| **≤ 760px** | Se ocultan los `.nav-links` del top bar → navegación por **`.tabbar` inferior**. Padding de sección reducido. |
| **≤ 620px** | `.cols-2/3/4` colapsan a **1 columna**. |

**Reglas mínimas (de `Desing_system_By_syncraev/CLAUDE.md`):**
- **Toque ≥ 44px**, **texto ≥ 13.5px**. Sin excepciones en móvil.
- **Móvil:** una sola columna + `.tabbar` inferior; **un único CTA primario fijo/visible**, "pulgar-friendly".
- **Desktop:** 2–3 columnas + `.nav` superior; resúmenes con `.summary-card` (sticky).
- Grids con `.grid-auto` + `.cols-2/3/4` y `gap` (colapsan solos en los breakpoints de arriba).
- Contenedores `.container` / `.container-narrow` con `padding-inline`.
- Teclados correctos por tipo de dato (tel, email, date, time).

Pantallas a cuidar especialmente en móvil: **P2 Disponibilidad** (grilla de horarios tocable), **P3 Formulario** (campos amplios, CTA fijo) y **P5 Admin** (tabla → tarjetas en móvil).

---

## Arquitectura

Dos lados sobre **una sola base de datos**. UI y API en el mismo proyecto Next.js; sin librería de estado (React `useState`); validación con `zod`.

- **Cliente (público):** `/` (inicio) → `/reservar` (disponibilidad + formulario) → `/confirmacion/[id]`.
- **Admin (protegido por `src/middleware.ts`):** `/admin/login` → `/admin` (ver/filtrar reservas, cambiar estado).

**El núcleo es la prevención de doble reserva, a nivel de base de datos** — entendé esto antes que nada:
- Índice de exclusión **GiST** (`reservas_sin_solape`): impide que dos reservas activas del mismo cargador se solapen. Requiere extensiones `btree_gist` y `pgcrypto`.
- `periodo` es un `tsrange` de `fecha + hora_inicio/hora_fin`.
- La API revalida en servidor y traduce el error `23P01` a **HTTP 409**. La UI (horarios en gris) es comodidad, **no** la garantía.

Mapa de archivos completo y contrato de API: ver **`files/CLAUDE.md`**.

## Reglas de negocio (de la implementación, en `src/lib/config.ts`)

- **2 cargadores** `C1` (Cra 90 #16-97) y `C2` (Cra 90 #16-89), contiguos, reservables por separado.
- **24/7**. Reservas **multi-hora**, granularidad 1 hora, dentro del mismo día (carga AC ~11 kW = sesiones largas).
- **Estados:** `Confirmada` (inicial) · `Finalizada` · `No asistió` · `Cancelada`. Solo el admin cambia estado; `Cancelada` libera el horario.
- **Tarifa por kWh por franja** (informativa; pago en sitio: transferencia/QR/efectivo). Vive en `config.ts`.
- **Conectores:** `J1772 Tipo 1` · `Tipo 2` · `GB/T-AC` · `No estoy seguro`. Mantenimiento vía tabla `bloqueos`.
- Contacto: WhatsApp +57 310 817 6786 · electrolandia.vs@gmail.com.

## Convenciones

- Horas como enteros 0–24 en la app; en DB `time` (`HH:00:00`, fin puede ser `24:00:00`). No cruzan medianoche en V1.
- Alias de imports: `@/` → `src/`.
- `SUPABASE_SERVICE_ROLE_KEY` es secreta y **solo** server-side: nunca importes `src/lib/supabase.ts` desde un componente `"use client"`.

## Fuera de alcance V1

Pagos en línea, OCPP/control remoto, facturación, membresías, app nativa, multi-sede. Eso es V2/V3.
