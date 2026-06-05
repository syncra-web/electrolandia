# MVP V1 — App de reservas de carga EV (Electrolandia Valle del Lili)

**Objetivo de esta fase:** reemplazar el sistema actual (Google Sheets + Google Forms) por una web simple, clara y profesional donde el cliente reserva en un flujo guiado, y el administrador ve las reservas en un panel. **Un solo cargador, una sola sede. Sin pagos, sin OCPP, sin app nativa.**

> Regla de oro de esta versión: **simple, funcional y rápida de construir.** Todo lo que no sea imprescindible para reservar y administrar, va para V2.

---

## 1. Estructura general del MVP

El sistema tiene **dos lados** y **una base de datos**:

```
┌─────────────────────────────┐        ┌──────────────────────────┐
│  LADO CLIENTE (público)     │        │  LADO ADMIN (protegido)  │
│  4 pantallas                │        │  1 pantalla              │
│  P1 Inicio                  │        │  P5 Panel de reservas    │
│  P2 Disponibilidad          │        │  - ver / filtrar         │
│  P3 Formulario              │        │  - cambiar estado        │
│  P4 Confirmación            │        │                          │
└──────────────┬──────────────┘        └────────────┬─────────────┘
               │                                     │
               └──────────────┬──────────────────────┘
                              ▼
                   ┌──────────────────────┐
                   │  BASE DE DATOS       │
                   │  tabla: reservas     │
                   │  (+ config horarios) │
                   └──────────────────────┘
```

- **Cliente:** Inicio → Disponibilidad → Formulario → Confirmación.
- **Admin:** una pantalla con login que lista las reservas y permite cambiar su estado.
- **Datos:** una sola tabla `reservas`. La disponibilidad se calcula a partir de los horarios de atención (config) menos los horarios ya reservados.
- **Confirmación:** en pantalla (obligatorio). Correo de confirmación = opcional recomendado (para no perder lo que ya hacía el Forms); fácil de agregar.

---

## 2. Flujo del cliente paso a paso

1. Entra al link (o escanea el **QR pegado en el cargador**).
2. **P1 Inicio:** ve qué es, dónde queda, tipo de cargador, adaptadores, potencia e instrucciones. Pulsa **“Reservar mi carga”**.
3. **P2 Disponibilidad:** elige una **fecha** → ve los **horarios** del día (verde = libre, gris = ocupado) → toca un horario libre.
4. **P3 Formulario:** la fecha y hora ya vienen cargadas. Llena sus datos, elige tipo de conector, acepta términos.
5. Pulsa **“Confirmar reserva”** → el sistema valida que el horario siga libre y **guarda la reserva** (estado `Confirmada`).
6. **P4 Confirmación:** ve “¡Reserva confirmada!” con fecha, hora, dirección, botón **Cómo llegar (Maps)**, recordatorio de cargador/adaptadores e instrucciones para conectar.
7. La reserva queda visible para el **administrador** en su panel.

Si el horario se ocupó justo antes de confirmar → mensaje claro: *“Ese horario acaba de ocuparse, elige otro”* y vuelve a P2.

---

## 3. Pantallas necesarias

### P1 — Inicio
- **Objetivo:** dar confianza y llevar a reservar.
- **Muestra:** nombre del servicio · descripción corta · dirección (Cra 90 #16-97, San Joaquín, Cali) · botón **Abrir en Google Maps** · tipo de cargador (J1772 Tipo 1) · adaptadores (Tipo 2, GB/T-AC) · potencia (hasta 50 A ≈ 11 kW) · instrucciones básicas (“Llega, conecta y la carga inicia sola”).
- **Acción principal:** botón **Reservar mi carga**.

### P2 — Disponibilidad
- **Objetivo:** elegir fecha y horario sin ambigüedad.
- **Muestra:** selector de **fecha** (no permite fechas pasadas) · lista de **horarios** del día en **verde (libre)** / **gris (ocupado, deshabilitado)**.
- **Acción:** seleccionar un horario libre → pasa a P3.
- **Mensaje si el día está lleno:** “Sin cupos este día, prueba otro”.

### P3 — Formulario de reserva
- **Objetivo:** capturar lo necesario para operar y contactar.
- **Muestra:** resumen arriba (fecha + hora elegidas) + campos (ver sección 4) + checkbox de términos.
- **Acción:** **Confirmar reserva**.

### P4 — Confirmación
- **Objetivo:** cerrar el círculo y dar próximos pasos.
- **Muestra:** ✅ “¡Reserva confirmada!” · fecha y hora · dirección · botón **Cómo llegar (Maps)** · recordatorio: “Cargador J1772 Tipo 1; tenemos adaptadores Tipo 2 y GB/T-AC sin costo” · instrucciones: “Al llegar, conecta tu vehículo y la carga inicia automáticamente”.

### P5 — Panel administrativo (protegido con login)
- **Objetivo:** que el admin vea y gestione las reservas.
- **Muestra:** **Reservas de hoy** + **Próximas reservas**, cada una con: nombre, WhatsApp, correo, placa, vehículo (marca/modelo), tipo de conector, fecha, hora y **estado** (badge de color).
- **Acción:** cambiar el estado de una reserva (Confirmada → Finalizada / No asistió / Cancelada). *(Crear/editar reservas manuales y reportes = V2.)*

---

## 4. Campos de información (formulario)

| Campo | Tipo | Obligatorio | Validación / nota |
| --- | --- | --- | --- |
| Nombre completo | texto | Sí | mínimo 3 caracteres |
| WhatsApp | teléfono | Sí | formato Colombia (10 dígitos / +57) |
| Correo electrónico | email | Sí | formato email válido |
| Placa del vehículo | texto | Sí | formato placa CO (ej. ABC123 / ABC12D); guardar en mayúsculas |
| Marca del vehículo | texto o select | Sí | select con marcas comunes (BYD, Kia, Nissan, Chevrolet, JAC…) + “Otra” |
| Modelo del vehículo | texto | Sí | — |
| Tipo de conector | select | Sí | `J1772 Tipo 1` · `Tipo 2` · `GB/T-AC` · `No estoy seguro` |
| Fecha | date | Sí | viene de P2 (no editable aquí) |
| Hora | time | Sí | viene de P2 (no editable aquí) |
| Observaciones | texto largo | No | — |
| Acepto términos básicos | checkbox | Sí | debe estar marcado para enviar |

**Términos básicos (texto corto sugerido):** “Acepto llegar puntual a mi horario, usar el cargador de forma responsable y entender que la carga es AC (~11 kW) y toma varias horas.”

---

## 5. Estados de la reserva

Cuatro estados, con badge de color:

| Estado | Cuándo | Color sugerido |
| --- | --- | --- |
| **Confirmada** | Estado inicial al crear la reserva | Verde |
| **Finalizada** | El admin la marca cuando el cliente terminó de cargar | Azul |
| **No asistió** | El admin la marca si el cliente no llegó | Gris |
| **Cancelada** | El admin la cancela (libera el horario) | Rojo suave |

**Transiciones (V1):** toda reserva nace `Confirmada`. Solo el admin cambia el estado. Una reserva `Cancelada` **deja de ocupar el horario** (queda libre de nuevo).

---

## 6. Estructura básica de base de datos

Una sola tabla. Ejemplo en PostgreSQL (Supabase):

```sql
create table reservas (
  id              uuid primary key default gen_random_uuid(),
  creada_en       timestamptz not null default now(),

  -- cliente
  nombre          text not null,
  whatsapp        text not null,
  correo          text not null,

  -- vehículo
  placa           text not null,
  marca           text not null,
  modelo          text not null,
  conector        text not null,   -- 'J1772 Tipo 1' | 'Tipo 2' | 'GB/T-AC' | 'No estoy seguro'

  -- reserva
  fecha           date not null,
  hora_inicio     time not null,
  duracion_min    int  not null default 120,  -- duración del bloque (configurable)

  observaciones   text,
  terminos        boolean not null default false,

  estado          text not null default 'Confirmada'
                  check (estado in ('Confirmada','Finalizada','No asistió','Cancelada'))
);

-- 🔒 Evita doble reserva: un mismo (fecha, hora) no puede tener dos reservas activas.
create unique index reservas_slot_unico
  on reservas (fecha, hora_inicio)
  where estado <> 'Cancelada';
```

**Horarios de atención (configuración, no tabla):** defínelos como constantes y genera los bloques dinámicamente. Ejemplo de arranque (ajústalo a tu operación real):
- Días: Lunes a Sábado
- Horario: 8:00 a 18:00
- Duración de bloque: 2 horas → bloques 8–10, 10–12, 12–14, 14–16, 16–18

> Como la carga es AC (~11 kW), las sesiones son largas. Para mantener V1 simple, el cliente reserva **un bloque** como unidad. Si necesita más tiempo, reserva bloques consecutivos o se coordina en sitio. La **duración del bloque, los días y el horario son lo primero que debes definir tú.**

---

## 7. Reglas para evitar doble reserva

La regla más importante del MVP. Tres capas, de menos a más confiable:

1. **Frontend (cómodo):** en P2, los horarios ya reservados se muestran **deshabilitados (gris)**. Evita el error visualmente, pero **no es garantía** (dos personas pueden ver el mismo horario libre a la vez).
2. **Backend (revalida):** al recibir el `POST` de la reserva, el servidor **vuelve a consultar** si el horario sigue libre antes de insertar. Nunca confíes solo en lo que mandó el navegador.
3. **Base de datos (garantía real):** el **índice único parcial** `reservas_slot_unico` (sección 6) hace que, aunque dos reservas lleguen en el mismo milisegundo, **solo una entre**; la otra falla con un error de unicidad.

**Manejo del choque:** si el insert falla por el índice único, el backend responde con un **409 (conflicto)** y el front muestra: *“Ese horario acaba de ocuparse, elige otro”* y refresca la disponibilidad. Así nunca hay dos reservas para el mismo bloque.

**Endpoints mínimos:**
- `GET /api/disponibilidad?fecha=YYYY-MM-DD` → bloques del día con `libre/ocupado`.
- `POST /api/reservas` → valida campos, revalida horario, inserta (el índice único es el seguro). Devuelve confirmación o 409.
- `GET /api/admin/reservas?filtro=hoy|proximas` → lista (protegido).
- `PATCH /api/admin/reservas/:id` → cambia estado (protegido).

---

## 8. Diseño sugerido de la interfaz

**Principio:** mobile-first, limpio, una acción por pantalla. La mayoría reservará desde el celular o el QR.

- **Estilo:** minimalista, mucho aire, tarjetas. Sensación moderna y tecnológica (es un servicio EV).
- **Colores:** **verde** como acento principal (energía limpia / “disponible”), sobre base neutra (blancos y grises, o un fondo oscuro elegante). Estados: verde = libre/confirmada, gris = ocupado/no asistió, ámbar = aviso, rojo suave = cancelada/error. *(Si Electrolandia tiene colores de marca, se ajustan aquí.)*
- **Tipografía:** sans-serif moderna y legible (Inter, Poppins u Outfit).
- **Íconos:** lineales (rayo ⚡, calendario, ubicación, carro, conector, check).
- **Componentes clave:**
  - *Horarios (P2):* “chips” o botones por bloque, verde (libre) / gris deshabilitado (ocupado), el seleccionado resaltado.
  - *Calendario/fecha:* selector táctil, sin fechas pasadas.
  - *Botón principal:* grande, un solo CTA por pantalla, fijo abajo en celular.
  - *Confirmación (P4):* tarjeta tipo “ticket” con check verde grande.
  - *Admin (P5):* tabla en desktop / tarjetas en celular, con **badge de estado** por color y filtros Hoy / Próximas.
- **Tono de textos:** claro y cercano, sin tecnicismos (reusa el UX writing del documento de análisis).

**Layout rápido por pantalla:**
- P1: hero con nombre + 1 línea → tarjeta de datos del cargador → instrucciones (3 pasos) → CTA fijo.
- P2: título “Elige fecha y hora” → calendario → grilla de horarios → (CTA al elegir).
- P3: resumen fecha/hora arriba → formulario en una columna → checkbox términos → CTA Confirmar.
- P4: check + “¡Reserva confirmada!” → datos → botones Maps / Calendario → instrucciones.
- P5: barra con filtros → lista con badges → acción de estado por reserva.

---

## 9. Recomendación técnica para construirlo

**Stack recomendado (aprovecha lo que ya tienes y es base de V2/V3):**

| Pieza | Recomendación | Por qué |
| --- | --- | --- |
| Framework | **Next.js (App Router)** | UI + API en un solo proyecto |
| Hosting | **Vercel** | ya lo tienes conectado; deploy en minutos |
| Base de datos | **Supabase (Postgres)** | rápido, gratis para empezar, soporta el índice único parcial |
| Login admin | **Supabase Auth** (1 usuario admin) | protege el panel sin construir auth desde cero |
| Estilos | **Tailwind CSS** | rápido y consistente, mobile-first |
| Validación | **react-hook-form + zod** | formularios robustos con poco código |
| Correo (opcional) | **Resend** | confirmación por email, como hacía el Forms |
| PWA | manifest + ícono | instalable desde el celular (un extra pequeño) |

**Alternativa no-code (más rápida pero limitada):** un formulario tipo Tally/Typeform + Airtable como base + una vista de calendario. Sirve para salir del paso, **pero no garantiza bien la no-doble-reserva ni crece a V2/V3**. Por eso recomiendo el stack de código: con Next.js + Supabase tienes algo profesional en pocos días y no botas trabajo después.

**Esfuerzo estimado V1:** del orden de unos pocos días de desarrollo enfocado (5 pantallas + 4 endpoints + 1 tabla).

---

## 10. Siguiente paso para empezar a desarrollarlo

**Checklist de arranque (en orden):**

1. **Definir reglas de negocio** (bloqueante, 10 min): días de atención, horario, **duración del bloque**, y confirmar que en V1 es **gratis** (sin pagos).
2. **Crear el proyecto en Supabase** + la tabla `reservas` + el índice único parcial (sección 6).
3. **Scaffold del proyecto** Next.js + Tailwind y conectarlo a Vercel.
4. **Construir las 5 pantallas** (P1–P5) mobile-first.
5. **Cablear los 4 endpoints** (disponibilidad, crear reserva con revalidación + índice único, lista admin, cambiar estado).
6. **Login admin** con Supabase Auth (un usuario).
7. **Probar la no-doble-reserva** con dos pestañas reservando el mismo bloque (debe entrar solo una).
8. **Deploy en Vercel** + **generar el QR** que apunte al link y pegarlo en el cargador.
9. *(Opcional)* correo de confirmación con Resend.

---

### Lo que NO va en V1 (recordatorio)
Pagos · OCPP · control remoto del cargador · facturación · membresías · app nativa · múltiples sedes · múltiples cargadores. Todo eso es V2/V3.
