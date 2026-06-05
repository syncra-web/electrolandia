# Sistema de reservas para punto de carga EV — Análisis y propuesta de producto digital

**Punto de carga:** Cra 90 No. 16-97, Barrio San Joaquín, Cali, Colombia
**Equipo actual:** Cargador J1772 Tipo 1 + adaptadores a Tipo 2 y GB/T-AC · 50 A ≈ 11.0 kW (carga AC)
**Estado del proyecto:** Operación funcional sobre Google Sheets + Google Forms + correo automático
**Objetivo:** Convertir el flujo manual en un aplicativo claro, profesional y fácil de usar

---

## Nota antes de empezar

Este documento se basa en el flujo que me describiste (consulta de disponibilidad en Sheets → formulario → correo de confirmación → llegada → conexión). No accedí al contenido vivo del Sheets ni del Forms porque están detrás del login de Google; si me compartes capturas o el acceso, puedo afinar los detalles de campos y migración. Aun así, el análisis estratégico y de producto es válido y accionable tal cual.

Hay un hecho técnico que atraviesa todo el documento y conviene tener claro desde ya: **tu cargador entrega carga AC a ~11 kW, no carga rápida DC.** Eso significa sesiones de **varias horas**, no de 20 minutos. El producto digital no debe venderse como "carga rápida", sino como **"deja tu carro cargando mientras haces tu día"**. Esta diferencia cambia cómo se diseñan los bloques de reserva, los tiempos estimados y los textos al cliente.

---

## 1. Resumen ejecutivo

Hoy tienes un sistema que **funciona pero es frágil y se siente artesanal**. El cliente tiene que saltar entre dos herramientas (un Sheets para mirar disponibilidad y un Forms para reservar), no hay nada que impida que dos personas reserven el mismo horario, y la confirmación por correo no resuelve las dudas reales del cliente: *¿mi carro es compatible? ¿cuánto me voy a demorar? ¿cómo llego? ¿qué adaptador necesito?*

El problema de fondo no es el formulario. Es que **el proceso no genera confianza ni claridad**, y eso le cuesta reservas (gente que se cae en el camino) y le genera trabajo operativo (clientes preguntando por WhatsApp lo que el sistema debería responder solo).

**Recomendación central:** construir una **PWA (web app instalable)** con **una sola pantalla de reserva** que muestre disponibilidad en vivo, calcule tiempos estimados según el vehículo, diga automáticamente qué adaptador se necesita, y confirme por **correo + WhatsApp**. Todo respaldado por un panel administrativo y una base de datos real que prevenga la doble reserva.

**Por qué PWA y no app nativa de entrada:** un solo desarrollo, funciona en cualquier celular, se comparte con un link y un código QR pegado en el mismo cargador, sin fricción de tiendas de apps. WhatsApp cubre la necesidad de notificaciones sin tener que construir push nativo todavía.

**Plan en 3 fases (MVP):**

- **V1 — Reemplazar Sheets + Forms.** Reserva en una pantalla, disponibilidad en vivo sin doble reserva, confirmación por correo. Es lo mínimo para dejar de operar a mano.
- **V2 — Profesionalizar.** WhatsApp, recordatorios, panel admin completo, selector de vehículo con adaptador y tiempo estimado, cancelación/modificación.
- **V3 — Escalar.** Multi-cargador y multi-sede, pagos en línea (Wompi/Nequi/PSE), membresías, flotas empresariales e integración OCPP para activar/medir el cargador de forma remota.

El resto del documento desarrolla cada punto.

---

## 2. Mapa del workflow actual

### Lo que vive el cliente hoy

```
1. Cliente quiere cargar su carro
        │
        ▼
2. Abre el Google Sheets de disponibilidad
   → tiene que interpretar una tabla/horario por su cuenta
        │
        ▼
3. Decide un horario que "parece" libre
        │
        ▼
4. Cambia de pestaña y abre el Google Forms
   → vuelve a escribir lo que ya pensó
        │
        ▼
5. Llena: placa + fecha + hora
   → no hay validación contra el Sheets (puede pedir un horario ya tomado)
        │
        ▼
6. Envía el formulario
        │
        ▼
7. Recibe correo de confirmación
   → confirma que "se envió", pero no resuelve dudas de compatibilidad, tiempo, llegada
        │
        ▼
8. Llega a la Cra 90 No. 16-97 (busca la dirección por su cuenta)
        │
        ▼
9. Encuentra el cargador J1772 Tipo 1
   → ¿necesita adaptador? ¿cuál? lo descubre en el sitio
        │
        ▼
10. Enchufa → la carga inicia sola (cargador siempre activo)
        │
        ▼
11. No hay confirmación de fin, ni registro de cuánto cargó, ni mensaje posterior
```

### Lo que pasa del lado del sistema

- **Disponibilidad y reservas viven en lugares distintos** (Sheets vs. respuestas del Forms) y **no están sincronizados automáticamente**. Alguien tiene que mirar las respuestas del Forms y actualizar el Sheets a mano para que el siguiente cliente vea el horario ocupado.
- **No hay bloqueo de slots.** El Forms acepta cualquier fecha/hora aunque ya esté tomada.
- **El cargador no "sabe" quién reservó.** Está siempre encendido, así que cualquiera puede usarlo sin reservar y no hay forma de verificar asistencia ni consumo real.
- **No hay base de datos de clientes utilizable.** Los datos quedan dispersos en filas del Sheets, difíciles de explotar para entender clientes frecuentes, horas pico o vehículos comunes.

> **Lectura rápida del mapa:** los puntos críticos están en los pasos **2→4** (saltar entre herramientas), **5** (sin validación → doble reserva), **7** (confirmación que no informa) y **9** (compatibilidad/adaptador descubierta en sitio). Son justo donde el cliente se confunde o se cae.

---

## 3. Análisis de experiencia de usuario (proceso actual)

Evaluado como si yo fuera un cliente que llega por primera vez:

| Dimensión | Cómo se siente hoy | Comentario |
|---|---|---|
| **Claridad del proceso** | Media-baja | El cliente debe armar el proceso en su cabeza; nada lo guía paso a paso. |
| **Confianza que transmite** | Baja-media | Sheets + Forms se ven como herramientas internas, no como un servicio profesional. |
| **Facilidad para reservar** | Media | Reservar en sí es simple, pero el salto entre dos herramientas suma fricción. |
| **Tiempo para completar** | Aceptable | 2–4 minutos, aunque con reescritura de datos entre Sheets y Forms. |
| **Dudas del cliente** | Muchas sin resolver | Compatibilidad, adaptador, tiempo de carga, cómo llegar, si quedó confirmada. |
| **Miedos del cliente** | Presentes | "¿Y si llego y no es compatible?", "¿y si alguien más reservó lo mismo?", "¿de verdad quedó?" |
| **Profesionalismo percibido** | Bajo | Es lo que más resta valor a un servicio que técnicamente está bien montado. |
| **Entender horarios disponibles** | Difícil | Leer una tabla de Sheets no es una experiencia de reserva. |
| **Llegar al punto** | Media | Hay dirección y link de Maps, pero el cliente los busca por su cuenta. |
| **Saber si su carro es compatible** | Muy difícil | Es el punto más débil: el cliente no sabe si necesita adaptador hasta llegar. |

### Cómo debería *sentirse* el nuevo aplicativo

- **Más simple:** una sola pantalla resuelve "ver, elegir y reservar".
- **Más visual:** un calendario con horarios en colores (libre / ocupado / tu selección), no una tabla.
- **Más rápido:** menos de 1 minuto para reservar, sin reescribir nada.
- **Más confiable:** confirmación inmediata clara + WhatsApp; el cliente nunca duda si quedó.
- **Más moderno:** estética limpia y tecnológica acorde a un servicio EV.
- **Más cercano:** lenguaje humano, nada técnico de más.
- **Apto para no-expertos:** el cliente elige su carro y el sistema le dice todo lo demás (conector, adaptador, tiempo estimado). El cliente no debería tener que saber qué es "J1772 Tipo 1".

---

## 4. Problemas detectados (por categoría)

| Categoría | Problema | Severidad |
|---|---|---|
| **Claridad** | El cliente debe consultar disponibilidad en un lado y reservar en otro. | Alta |
| **Claridad** | No queda claro si el carro es compatible ni qué adaptador se necesita antes de llegar. | Alta |
| **Claridad** | El dato de potencia/amperaje (50 A / 11 kW) no se traduce en algo entendible: tiempo estimado de carga. | Alta |
| **UX** | Leer una tabla de Sheets no es una experiencia de reserva; hay carga cognitiva innecesaria. | Alta |
| **UX** | Reescritura de datos entre Sheets y Forms (fricción evitable). | Media |
| **UX** | El correo de confirmación dice "se envió" pero no resuelve las dudas reales. | Media |
| **Automatización** | La disponibilidad no se actualiza sola; requiere intervención manual. | Alta |
| **Automatización** | El Forms no valida contra horarios ocupados → no hay bloqueo de slot. | Crítica |
| **Confianza** | Estética de herramienta interna resta profesionalismo a un buen servicio. | Alta |
| **Confianza** | Sin recordatorio ni mensaje posterior, el cliente queda "solo" tras reservar. | Media |
| **Operativos** | El cargador siempre encendido permite uso sin reserva; no hay control de quién entra. | Alta |
| **Operativos** | No hay verificación de asistencia (no-shows) ni de consumo real. | Alta |
| **Datos** | Información dispersa en filas; no hay base de clientes ni métricas de operación. | Alta |
| **Datos** | No se capturan datos clave (marca/modelo, conector, contacto WhatsApp, %) para mejorar el servicio. | Media |
| **Escalabilidad** | Un Sheets no escala a varios cargadores, sedes o pagos. | Alta |
| **Comunicación** | El canal preferido en Colombia (WhatsApp) no se está usando. | Alta |

---

## 5. Oportunidades de mejora (problema → oportunidad)

- **Salto entre Sheets y Forms** → **Una sola pantalla** donde el cliente ve horarios disponibles y reserva en el mismo lugar, sin reescribir nada.
- **Compatibilidad incierta** → **Selector de vehículo** (marca/modelo) que devuelve automáticamente el conector y el adaptador necesario, con un mensaje tranquilizador ("Tu BYD usa Tipo 2, nosotros te prestamos el adaptador sin costo").
- **Potencia incomprensible** → **Tiempo estimado de carga** mostrado en horas según el vehículo o el % que quiere reponer; el cliente entiende "≈ 4 horas", no "11 kW".
- **Tabla difícil de leer** → **Calendario visual** con estados por color y bloques de tiempo seleccionables.
- **Disponibilidad manual** → **Bloqueo automático del slot** en el momento de reservar; nadie más puede tomarlo.
- **Posible doble reserva** → **Reserva atómica en base de datos** (el sistema verifica y bloquea en una sola operación).
- **Confirmación pobre** → **Confirmación completa** por correo + WhatsApp con ubicación, conector, adaptador, tiempo estimado e instrucciones.
- **Cliente "solo" tras reservar** → **Recordatorio** antes de la cita + **mensaje posterior** con agradecimiento y encuesta corta.
- **Cargador sin control** → (futuro) **Activación por OCPP** para que solo cargue quien reservó, con medición de kWh.
- **Datos dispersos** → **Base de datos** que alimenta panel admin, reportes y un historial de clientes frecuentes.
- **No escala** → **Arquitectura modular** lista para multi-cargador, multi-sede y pagos.
- **WhatsApp sin usar** → **Confirmaciones y recordatorios por WhatsApp**, el canal donde el cliente realmente lee.

---

## 6. Flujo ideal del nuevo sistema

Versión mejorada y completa del recorrido del cliente:

```
1.  Cliente abre el link (desde Instagram, Google, o el QR pegado en el cargador)
        │
        ▼
2.  Ve una pantalla clara: qué es, dónde queda, qué carros carga, a qué velocidad
        │
        ▼
3.  Pulsa "Reservar mi carga"
        │
        ▼
4.  Elige su vehículo (marca/modelo)  ──►  el sistema le dice:
        - conector que usa
        - si necesita adaptador (y que es sin costo)
        - potencia disponible (~11 kW)
        │
        ▼
5.  Indica cuánto quiere cargar (opciones: "1–2 h", "media carga", "carga completa",
    o "no sé / lo dejo unas horas")  ──►  el sistema sugiere una duración
        │
        ▼
6.  Selecciona fecha en un calendario visual
        │
        ▼
7.  Ve los horarios disponibles de ese día (verde = libre, gris = ocupado)
    y selecciona su bloque
        │
        ▼
8.  Completa datos mínimos: nombre, WhatsApp, placa (correo opcional)
        │
        ▼
9.  Revisa un resumen ANTES de confirmar:
    vehículo · conector/adaptador · fecha · hora · duración · dirección · tiempo estimado
        │
        ▼
10. Acepta términos y confirma  ──►  el slot se bloquea de inmediato (nadie más lo toma)
        │
        ▼
11. Pantalla de "¡Reserva confirmada!" con botón "Cómo llegar" (abre Google Maps)
    y botón "Guardar en mi calendario"
        │
        ▼
12. Recibe confirmación por WhatsApp + correo (con todo lo anterior)
        │
        ▼
13. [Recordatorio automático] unas horas antes: ubicación, conector y "responde OK para confirmar"
        │
        ▼
14. Llega al punto → enchufa → la carga inicia
        │
        ▼
15. [Futuro con OCPP] el cargador solo se activa para su reserva y mide los kWh
        │
        ▼
16. Al terminar: mensaje posterior de agradecimiento + encuesta de 1 toque
    + invitación a reservar de nuevo
```

La diferencia con el flujo actual: el cliente **nunca se queda con una duda**, **nunca reescribe nada**, y **nunca descubre un problema en el sitio** (compatibilidad, adaptador, tiempo). Todo se resuelve antes de confirmar.

---

## 7. Propuesta de aplicativo: pantallas recomendadas

Para cada pantalla: **objetivo · qué muestra · campos · acciones · mensajes · cómo se ve**.

### 7.1 Home / Landing
- **Objetivo:** generar confianza en 5 segundos y llevar a "Reservar".
- **Muestra:** nombre del punto, foto del cargador, dirección + mini-mapa, "Cargamos BYD, Kia, Nissan, Chevrolet, JAC y más", velocidad de carga en lenguaje simple, horario de atención.
- **Campos:** ninguno.
- **Acciones:** botón principal **"Reservar mi carga"**; secundario "Cómo funciona".
- **Mensajes:** "Reserva en 1 minuto. Te confirmamos por WhatsApp."
- **Cómo se ve:** limpia, una sola columna en celular, un solo botón dominante.

### 7.2 Selección de vehículo (clave para compatibilidad)
- **Objetivo:** eliminar el miedo a la incompatibilidad antes de reservar.
- **Muestra:** selector de marca → modelo; tras elegir, una tarjeta clara: "Tu [modelo] usa conector [Tipo X]. Te prestamos el adaptador sin costo ✓".
- **Campos:** marca (obligatorio), modelo (obligatorio o "no lo veo / otro").
- **Acciones:** continuar; "No encuentro mi carro" (cae a una opción genérica).
- **Mensajes:** tranquilizador y sin tecnicismos.
- **Cómo se ve:** dos desplegables grandes y una tarjeta de resultado con un check verde.

### 7.3 Selección de duración / cuánto cargar
- **Objetivo:** que el cliente entienda que es carga AC (horas) y reserve el tiempo correcto.
- **Muestra:** opciones simples ("Una recarga rápida 1–2 h", "Media carga ~3 h", "Carga completa", "No estoy seguro, lo dejo unas horas") y el tiempo estimado correspondiente.
- **Campos:** duración deseada (obligatorio); opcional: % actual y % objetivo.
- **Acciones:** continuar.
- **Mensajes:** "Cargamos a ~11 kW. No es carga rápida: lo ideal es dejar tu carro mientras haces otras cosas."
- **Cómo se ve:** tarjetas seleccionables con el tiempo estimado visible en cada una.

### 7.4 Calendario / fecha
- **Objetivo:** elegir el día.
- **Muestra:** calendario mensual; días sin cupo se ven deshabilitados.
- **Campos:** fecha (obligatorio).
- **Acciones:** seleccionar día.
- **Mensajes:** si un día está lleno, "Sin cupos este día, prueba otro".
- **Cómo se ve:** calendario táctil, día seleccionado resaltado en el color de marca.

### 7.5 Disponibilidad / horarios del día
- **Objetivo:** elegir el bloque horario sin ambigüedad.
- **Muestra:** franjas horarias (según horario de atención) en **verde (libre)** o **gris (ocupado)**; respeta la duración elegida.
- **Campos:** hora de inicio (obligatorio).
- **Acciones:** seleccionar franja.
- **Mensajes:** "Selecciona tu hora de inicio. La carga durará aprox. [X] horas."
- **Cómo se ve:** lista o cuadrícula de horas tipo "chips", muy clara en celular.

### 7.6 Datos del cliente (formulario corto)
- **Objetivo:** capturar lo mínimo para operar y contactar.
- **Muestra:** campos esenciales.
- **Campos:** nombre (obligatorio), WhatsApp (obligatorio), placa (obligatorio), correo (opcional), observaciones (opcional).
- **Acciones:** continuar.
- **Mensajes:** "Te escribiremos por WhatsApp para confirmar."
- **Cómo se ve:** 3–4 campos visibles, teclado correcto por tipo de dato, sin pedir nada que no se use.

### 7.7 Resumen y confirmación
- **Objetivo:** que el cliente revise todo y confirme con seguridad.
- **Muestra:** vehículo · conector/adaptador · fecha · hora · duración · tiempo estimado · dirección · qué llevar.
- **Campos:** checkbox de aceptación de términos (obligatorio).
- **Acciones:** **"Confirmar reserva"**; editar cualquier dato.
- **Mensajes:** "Al confirmar, este horario queda reservado solo para ti."
- **Cómo se ve:** tarjeta de resumen tipo "ticket", botón de confirmar fijo abajo.

### 7.8 Confirmación exitosa
- **Objetivo:** cerrar el círculo y dar próximos pasos.
- **Muestra:** "¡Reserva confirmada!", código/ID de reserva, resumen, botones "Cómo llegar" y "Agregar a mi calendario".
- **Acciones:** abrir Maps; guardar en calendario; compartir; volver al inicio.
- **Mensajes:** "Te enviamos todo por WhatsApp y correo."
- **Cómo se ve:** check verde grande, sensación de logro, todo a un toque.

### 7.9 Instrucciones de llegada / detalle del cargador
- **Objetivo:** que llegar y cargar sea trivial.
- **Muestra:** mapa + dirección + foto del frente del local; pasos de carga ("1. Enchufa, 2. La carga inicia sola"); qué adaptador usar; teléfono/WhatsApp de soporte.
- **Acciones:** llamar/escribir; abrir Maps.
- **Mensajes:** "¿Algo no funciona? Escríbenos por WhatsApp."
- **Cómo se ve:** pasos numerados con íconos.

### 7.10 Estado de la reserva
- **Objetivo:** que el cliente consulte/gestione su reserva.
- **Muestra:** estado (Confirmada / Hoy / En curso / Finalizada / Cancelada), datos y acciones.
- **Acciones:** ver, modificar, cancelar.
- **Cómo se ve:** una tarjeta por reserva con un badge de estado en color.

### 7.11 Cancelar / modificar
- **Objetivo:** liberar el cupo fácilmente y reducir no-shows.
- **Muestra:** confirmación de la acción y políticas (p. ej. cancelar con X horas de anticipación).
- **Acciones:** confirmar cambio/cancelación → libera el slot automáticamente.
- **Mensajes:** "Cupo liberado. Puedes reservar otro horario cuando quieras."

### 7.12 Panel administrativo (ver sección 10)
### 7.13 Reportes de uso (ver sección 10)

---

## 8. Datos que captura el sistema

### 8.1 Datos del cliente (formulario de reserva)

| Campo | Obligatorio | Por qué / nota |
|---|---|---|
| Nombre | ✅ | Identificación y trato cercano. |
| WhatsApp (celular) | ✅ | Canal principal de confirmación/recordatorio en Colombia. |
| Placa del vehículo | ✅ | Identifica la reserva en sitio; útil para historial. |
| Marca del vehículo | ✅ | Determina conector/adaptador y tiempo estimado. |
| Modelo del vehículo | ⬜ recomendado | Afina el tiempo estimado (depende del cargador a bordo). |
| Tipo de conector | (automático) | Se deduce del vehículo; no se le pide al cliente. |
| Adaptador requerido | (automático) | Se deduce; se informa, no se pide. |
| Fecha de reserva | ✅ | — |
| Hora de inicio | ✅ | — |
| Duración / tiempo de uso | ✅ | Define el bloque y previene solapamientos. |
| Correo electrónico | ⬜ | Respaldo de la confirmación; WhatsApp ya cubre lo esencial. |
| Observaciones | ⬜ | Casos especiales ("llego 10 min tarde", etc.). |
| Aceptación de términos | ✅ | Reglas de uso, cancelación y responsabilidad. |
| Confirmación de llegada | (vía recordatorio) | El cliente responde "OK"; reduce no-shows. |

**Principio:** pedir lo mínimo en pantalla y **deducir todo lo posible** (conector, adaptador, tiempo). Cada campo extra baja la conversión.

### 8.2 Datos internos para operación y analítica

Capturar y consolidar automáticamente:

- **Historial de reservas** por cliente (frecuencia, recurrencia).
- **Horas más usadas** (horas pico) y **días más demandados**.
- **Clientes frecuentes** (para fidelización/membresías).
- **Tipos de vehículos más comunes** (decisiones de inventario de adaptadores).
- **Adaptadores más solicitados** (Tipo 2 vs. GB/T-AC).
- **Consumo estimado** (kWh teóricos por sesión; reales cuando haya OCPP).
- **Tiempo promedio de carga** por tipo de vehículo.
- **Cancelaciones** (tasa, anticipación, motivos).
- **No-shows** (reservas no asistidas) → input para políticas o depósito futuro.
- **Ocupación del cargador** (%) por día/semana/mes.

Estos datos son los que el Sheets actual no permite explotar y son **oro** para decidir precios, horarios y expansión.

---

## 9. Automatizaciones recomendadas

Priorizadas por impacto/esfuerzo (disparador → acción → canal):

**Imprescindibles (V1–V2)**
- **Bloqueo automático del slot** al confirmar → impide doble reserva. *(crítico)*
- **Prevención de doble reserva** a nivel de base de datos (operación atómica).
- **Confirmación automática por correo** al reservar.
- **Confirmación automática por WhatsApp** con ubicación, conector, adaptador y tiempo estimado.
- **Notificación interna** (al admin) cuando entra una reserva nueva.
- **Liberación automática del slot** al cancelar.

**Alto valor (V2)**
- **Recordatorio** unas horas antes (WhatsApp) con "responde OK para confirmar".
- **Instrucciones de llegada** automáticas (mapa + pasos) junto con la confirmación.
- **Mensaje con ubicación de Google Maps** (link directo "Cómo llegar").
- **Mensaje de confirmación de asistencia** (reduce no-shows).
- **Mensaje posterior a la carga** + **encuesta de satisfacción** de 1 toque.
- **Base de datos automática de clientes** (se construye sola con cada reserva).
- **Alerta al admin** si alguien cancela.

**Operativas / futuro (V3)**
- **Alerta si el cargador no está disponible** (mantenimiento) → bloquea agenda y avisa a reservas afectadas.
- **Recordatorio de "tu sesión está por terminar"** (con OCPP).
- **Cobro automático** al finalizar (con pagos + OCPP).

---

## 10. Panel administrativo

### 10.1 Qué debe ver el administrador

- **Reservas del día** (vista principal al abrir): hora, cliente, placa, vehículo, conector/adaptador, estado.
- **Calendario de reservas** (día/semana/mes) con bloques ocupados.
- **Ficha del cliente:** nombre, WhatsApp, correo, placa, vehículo, historial.
- **Estado de cada reserva:** Confirmada · En proceso · Finalizada · Cancelada · No asistió.
- **Reportes básicos:**
  - Ocupación por día y por semana (%).
  - Clientes frecuentes (ranking).
  - Horas pico.
  - Vehículos/adaptadores más comunes.
  - Cancelaciones y no-shows.
- **Historial completo** filtrable y exportable.

### 10.2 Qué debe poder hacer el administrador

- **Crear reserva manual** (cliente que llama o llega sin reservar).
- **Editar** una reserva (hora, datos, vehículo).
- **Cancelar** una reserva (libera el slot).
- **Bloquear horarios** (mantenimiento, uso interno, festivos).
- **Confirmar llegada** del cliente.
- **Finalizar carga** (marca fin de sesión).
- **Agregar observaciones** internas a una reserva o cliente.
- **Exportar** información (CSV/Excel) para contabilidad o análisis.
- **Enviar mensaje al cliente** (WhatsApp/correo) desde el panel.

> El panel debe ser tan simple que se pueda operar desde el celular: el día a día es "ver reservas de hoy, confirmar llegadas, finalizar cargas".

---

## 11. UX Writing — textos para el cliente

Tono: claro, cercano, profesional, sin tecnicismos. Listos para usar (ajusta el nombre de marca):

**Bienvenida (Home)**
> Carga tu carro eléctrico fácil. Reserva tu horario en 1 minuto y te confirmamos por WhatsApp.

**Explicación del servicio**
> Cargamos vehículos eléctricos de BYD, Kia, Nissan, Chevrolet, JAC y más. Tú reservas, llegas, enchufas y listo. Si tu carro usa otro conector, nosotros te prestamos el adaptador sin costo.

**Antes de elegir fecha (educar sobre carga AC)**
> Cargamos a ~11 kW. No es carga rápida: lo mejor es dejar tu carro un par de horas mientras haces tus cosas. Nosotros te decimos cuánto se demora según tu carro.

**Selección de fecha y hora**
> Elige el día y la hora en que quieres cargar. Verás en verde los horarios disponibles.

**Confirmación de disponibilidad**
> ¡Ese horario está libre! Al confirmar, queda reservado solo para ti.

**Formulario de reserva**
> Solo necesitamos unos datos para confirmarte. Te escribiremos por WhatsApp.

**Confirmación exitosa**
> ¡Reserva confirmada! 🎉 Te esperamos el [fecha] a las [hora]. Te enviamos la ubicación y los detalles por WhatsApp. Toca "Cómo llegar" cuando vengas.

**Recordatorio antes de la reserva**
> Hola [Nombre], te recordamos tu carga hoy a las [hora] en [dirección]. Tu carro usa [conector] y te tendremos listo el adaptador. ¿Confirmas? Responde *OK* 🙂

**Instrucciones de llegada**
> Estamos en [dirección]. Al llegar: 1) Enchufa tu carro. 2) La carga inicia sola. ¿Algo no funciona? Escríbenos por aquí.

**Información sobre conectores**
> Nuestro cargador es tipo J1772 (Tipo 1). Si tu carro usa Tipo 2 o GB/T, te prestamos el adaptador sin costo.

**Información sobre adaptadores**
> Tu [modelo] usa conector [Tipo X]. No te preocupes: tenemos el adaptador y te lo facilitamos al llegar. ✓

**Información sobre potencia de carga**
> Cargamos hasta 50 A (~11 kW). Para tu [modelo], reponer [X]% toma aproximadamente [Y] horas.

**Mensaje si no hay disponibilidad**
> Ese horario ya está ocupado. Estos horarios sí están libres ese día: [opciones]. ¿Te sirve alguno?

**Mensaje de cancelación**
> Tu reserva fue cancelada y el horario quedó libre. Cuando quieras, reservas de nuevo en un toque.

**Mensaje posterior al servicio**
> ¡Gracias por cargar con nosotros, [Nombre]! ¿Cómo te fue? Califícanos en 10 segundos 👉 [encuesta]. Te esperamos pronto.

---

## 12. MVP por fases

### Versión 1 — Básica pero funcional (reemplaza Sheets + Forms)

| Funcionalidad | Prioridad | Complejidad | Impacto cliente | Impacto operación |
|---|---|---|---|---|
| Reserva en una sola pantalla | Alta | Media | Alto | Alto |
| Disponibilidad en vivo (calendario visual) | Alta | Media | Alto | Alto |
| Bloqueo de slot / sin doble reserva | Alta | Media | Alto | Alto |
| Formulario corto integrado | Alta | Baja | Medio | Medio |
| Confirmación por correo | Alta | Baja | Medio | Medio |
| Base de datos de reservas | Alta | Baja | — | Alto |
| Vista admin mínima (lista del día) | Alta | Baja | — | Alto |

**Meta:** dejar de operar a mano y eliminar la doble reserva.

### Versión 2 — Más profesional

| Funcionalidad | Prioridad | Complejidad | Impacto cliente | Impacto operación |
|---|---|---|---|---|
| Confirmación + recordatorio por WhatsApp | Alta | Media | Alto | Alto |
| Selector de vehículo → conector/adaptador | Alta | Media | Alto | Medio |
| Tiempo estimado de carga | Alta | Baja | Alto | Bajo |
| Cancelar / modificar reserva | Media | Media | Alto | Alto |
| Panel admin completo + reportes | Alta | Media | — | Alto |
| Confirmación de asistencia y no-shows | Media | Media | Medio | Alto |
| Encuesta posterior | Baja | Baja | Medio | Medio |

**Meta:** experiencia profesional y operación medible.

### Versión 3 — Escalable

| Funcionalidad | Prioridad | Complejidad | Impacto cliente | Impacto operación |
|---|---|---|---|---|
| Multi-cargador y multi-sede | Media | Alta | Alto | Alto |
| Pagos en línea (Wompi/Nequi/PSE) | Media | Alta | Alto | Alto |
| Membresías / clientes frecuentes | Media | Media | Alto | Alto |
| Flotas empresariales | Baja | Alta | Alto | Alto |
| Integración OCPP (activar/medir cargador) | Media | Alta | Alto | Alto |
| Facturación y reportes de consumo | Media | Alta | Medio | Alto |

**Meta:** crecer a red de carga con cobro y control remoto.

---

## 13. Arquitectura funcional y recomendaciones técnicas

### 13.1 Módulos del sistema

- **Módulo de reservas:** crear/editar/cancelar; lógica de slots y bloqueo atómico.
- **Módulo de disponibilidad:** define horarios de atención, duración de bloques, festivos y bloqueos de mantenimiento.
- **Módulo de clientes:** ficha, historial, recurrencia.
- **Módulo de vehículos/compatibilidad:** mapea marca/modelo → conector → adaptador → potencia del cargador a bordo (para el tiempo estimado).
- **Módulo de notificaciones:** correo + WhatsApp (confirmación, recordatorio, posterior).
- **Módulo administrativo:** panel de operación + reportes + exportación.
- **Base de datos:** corazón del sistema (ver entidades abajo).
- **Futuro — Módulo de pagos:** integración con pasarela local.
- **Futuro — Módulo OCPP:** comunicación con cargadores inteligentes (start/stop, medición kWh).
- **Futuro — Módulo de analítica:** dashboards de ocupación, ingresos y consumo.

### 13.2 Entidades de base de datos (modelo conceptual)

- **Cliente** (id, nombre, whatsapp, correo, fecha_alta).
- **Vehículo** (id, cliente_id, placa, marca, modelo, conector, potencia_obc).
- **Slot / Disponibilidad** (id, cargador_id, fecha, hora_inicio, hora_fin, estado).
- **Reserva** (id, cliente_id, vehiculo_id, cargador_id, slot, estado, duración, kwh_estimado, observaciones, creada_en).
- **Cargador** (id, sede_id, tipo_conector, potencia_max, estado, adaptadores_disponibles).
- **Notificación** (id, reserva_id, canal, tipo, estado_envío, enviada_en).
- *(Futuro)* **Pago** (id, reserva_id, monto, método, estado).
- *(Futuro)* **SesiónDeCarga / OCPP** (id, reserva_id, kwh_reales, inicio, fin).

La regla clave: **una reserva ocupa un slot, y un slot no puede tener dos reservas activas** (restricción de unicidad → así se elimina la doble reserva de raíz).

### 13.3 Integraciones

- **Correo:** un servicio transaccional (p. ej. Resend o SendGrid).
- **WhatsApp:** WhatsApp Cloud API o un proveedor local (Wati/Bird/360dialog). Empieza con plantillas de confirmación/recordatorio.
- **Google Maps:** link directo "Cómo llegar" + mini-mapa embebido con la dirección de la Cra 90.
- **Calendario:** botón "Agregar a mi calendario" (archivo .ics) para el cliente.
- *(Futuro)* **Pagos:** Wompi, Mercado Pago o PSE/Nequi/Daviplata (lo estándar en Colombia).
- *(Futuro)* **OCPP:** para cargadores compatibles, activar/medir de forma remota.

### 13.4 ¿Web app, PWA, app móvil o landing con reservas?

| Opción | Pros | Contras | Recomendación |
|---|---|---|---|
| **Landing con reservas** | Rápida de mostrar | Por sí sola no resuelve la lógica de reservas | Úsala como puerta de entrada (Home), pero el motor de reservas debe ser real |
| **Web app / PWA** | Un solo desarrollo, instalable, se comparte por link y QR, sin tiendas | Push nativo limitado (lo cubre WhatsApp) | ✅ **Mejor opción para empezar** |
| **App móvil nativa** | Push robusto, experiencia premium | Doble desarrollo (iOS/Android), costo y tiempo, fricción de descarga | Solo cuando el volumen lo justifique (V3) |
| **Panel admin** | Operación interna | — | Hazlo dentro de la misma web app, con login |

**Recomendación de stack (aprovechando lo que ya usas):** una web app/PWA en un framework moderno (Next.js o similar) desplegada en **Vercel** (que ya tienes conectado), con una base de datos administrada (p. ej. Supabase/Postgres), correo transaccional y WhatsApp por API. Esto te da algo profesional, escalable y económico de operar. El QR del cargador apunta a la PWA: el cliente que llega sin reserva puede reservar en el momento desde su celular.

---

## 14. Recomendaciones visuales

Un servicio EV debe sentirse **moderno, limpio, tecnológico y confiable**, sin saturar.

- **Estilo visual:** minimalista, mucho espacio en blanco (o modo oscuro elegante), foco en una acción por pantalla.
- **Jerarquía de información:** un solo elemento dominante por pantalla (título → dato clave → botón). El cliente nunca debe dudar qué hacer.
- **Colores recomendados:**
  - **Verde** como color principal/acento (asocia energía limpia y "disponible/confirmado"). Un verde tecnológico, no fosforescente.
  - **Neutros** (blancos, grises, o un azul muy oscuro casi negro para modo oscuro) como base.
  - **Estados:** verde = disponible/confirmado, gris = ocupado/no disponible, ámbar = pendiente/recordatorio, rojo suave = cancelado/error.
- **Tipografía:** una sans-serif moderna y muy legible (Inter, Poppins, Outfit o similar); jerarquía clara entre títulos y cuerpo.
- **Íconos:** lineales y consistentes (rayo/carga, calendario, ubicación, carro, conector, check). Refuerzan sin recargar.
- **Tarjetas de información:** todo en tarjetas (resumen de reserva tipo "ticket", tarjeta de compatibilidad, tarjetas de horario).
- **Calendario visual:** táctil, con días/franjas en color por estado.
- **Botones principales:** grandes, un solo CTA por pantalla, fijo abajo en celular ("pulgar-friendly").
- **Estados visuales de reserva:** badges de color claros (Confirmada/En curso/Finalizada/Cancelada).
- **Responsive / mobile-first:** diséñalo primero para celular (la mayoría reservará desde el teléfono o escaneando el QR), una sola columna, campos amplios, teclados correctos por tipo de dato.

---

## 15. Análisis de escalabilidad — visión de evolución del producto

Cómo debe crecer el sistema si el negocio escala:

- **Más cargadores (misma sede):** el modelo ya contempla `cargador_id`; la disponibilidad se calcula por cargador. El cliente elige automáticamente el primero libre o uno específico.
- **Más ubicaciones:** agregar entidad `Sede`; el cliente primero elige sede, luego cargador y horario. Reportes por sede.
- **Más tipos de conectores:** el módulo de compatibilidad ya está pensado para crecer (agregar conectores/adaptadores sin rehacer la lógica).
- **Pagos en línea:** integrar pasarela local (Wompi/Mercado Pago/PSE/Nequi). Permite cobrar por reserva, por kWh o por tiempo, e introducir **depósito** para reducir no-shows.
- **Membresías:** clientes frecuentes con tarifa preferencial, reserva prioritaria o cupo recurrente.
- **Empresas con flotas:** cuentas multiusuario, reservas recurrentes, facturación mensual consolidada y reportes de consumo por flota.
- **Control remoto del cargador (OCPP):** activar/desactivar la carga por reserva, medir kWh reales, iniciar/detener desde la app. Es el salto de "reserva soft" a "control real".
- **Reportes de consumo y facturación:** con kWh reales (OCPP) + pagos, emitir comprobantes y reportes de energía.
- **Soporte al cliente:** centralizar WhatsApp/soporte y, más adelante, un chatbot de preguntas frecuentes (compatibilidad, tiempos, ubicación).

**Hilo conductor de la evolución:**
> **V1** deja de operar a mano → **V2** profesionaliza y mide → **V3** convierte el punto en una **red de carga** con cobro y control remoto. Cada fase reutiliza la base de la anterior porque el modelo de datos ya está pensado para crecer.

---

## 16. Próximos pasos para construir el aplicativo

Orden sugerido, accionable:

1. **Definir reglas de negocio:** horario de atención exacto, duración mínima/máxima de bloque, política de cancelación y de no-shows, ¿se cobrará o seguirá gratis al inicio?
2. **Cerrar el modelo de datos** (entidades de la sección 13.2) y la **tabla de compatibilidad** vehículo → conector → adaptador → potencia (con los carros que más recibes).
3. **Diseñar el flujo y las pantallas** de V1 (wireframes mobile-first) siguiendo la sección 7.
4. **Construir V1** (web app/PWA en Vercel + base de datos + confirmación por correo) con bloqueo de slot anti-doble-reserva.
5. **Migrar** lo útil del Sheets actual (clientes/placas conocidas) a la base de datos.
6. **Generar el QR** y pegarlo en el cargador; publicar el link en Instagram/Google.
7. **Sumar WhatsApp** (confirmación + recordatorio) y el **selector de vehículo + tiempo estimado** → V2.
8. **Activar el panel admin completo** y empezar a medir ocupación, horas pico y no-shows.
9. **Evaluar pagos/OCPP** cuando el volumen lo justifique → V3.

---

### En una frase

No se trata de digitalizar un formulario, sino de **convertir un buen servicio de carga en una buena experiencia de carga**: que el cliente reserve en un minuto, sepa exactamente qué esperar y nunca dude de que su carga está lista para él.
