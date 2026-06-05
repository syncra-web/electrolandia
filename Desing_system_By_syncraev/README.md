# ELECTROLANDIA · Design System

Sistema visual para una plataforma de **reserva de puntos de carga EV** en Cali, Colombia.
Moderno, limpio, tecnológico y confiable — energía verde lima sobre neutros carbón.

> Paquete listo para **Claude Code**: tokens, componentes, iconos y 3 pantallas de ejemplo
> totalmente funcionales, construidas solo con este sistema.

---

## 📁 Estructura

```
ELECTROLANDIA Design System.html   ← Guía de estilo (abre esto primero)
styles/
  tokens.css        Variables CSS: color, tipografía, espaciado, radios, sombras (single source of truth)
  base.css          Reset, tipografía base, utilidades de layout y texto
  components.css     Botones, inputs, tarjetas, badges, calendario, tabla, nav, segments…
  app.css           Helpers para pantallas (hero, stepper, grids, confirmación)
  guide.css         Solo para la guía de estilo (no usar en producto)
assets/
  icons.js          Sprite de iconos de línea. Inyecta <symbol> → usar con <use href="#i-...">
pantallas/
  Home.html         Landing del servicio
  Reserva.html      Flujo de reserva interactivo (calendario → datos → confirmación)
  Panel Admin.html  Tabla de reservas con búsqueda y filtros
```

## 🚀 Uso

Cada página enlaza, en este orden:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/tokens.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/app.css">   <!-- solo en pantallas de producto -->
...
<script src="assets/icons.js"></script>
```

Iconos: `<svg class="icon"><use href="#i-bolt"></use></svg>`
(lista completa en la sección «Iconografía» de la guía o en `window.ELECTRO_ICONS`).

## 🎨 Fundamentos (resumen)

| Rol | Token | HEX |
|---|---|---|
| Primario · Lime Electric | `--primary` | `#C6F542` |
| Texto sobre lima | `--primary-ink` | `#16210A` |
| Lima como texto (en claro) | `--primary-text` | `#4D6B0F` |
| Negro carbón | `--carbon-900` | `#11150F` |
| Fondo de página (humo) | `--bg-page` | `#F4F7EE` |
| Verde oscuro (paneles) | `--green-deep` | `#1C3326` |
| Acento cian (solo datos kW) | `--accent` | `#14C2C9` |
| Confirmada / Disponible | `--success` | `#2FA84F` |
| Ocupado | `--warning` | `#E8A317` |
| Cancelada | `--danger` | `#E5484D` |
| Finalizada | `--info` | `#4E7BD6` |
| No asistió | `--noshow` | `#B26A3C` |

**Tipografía:** Space Grotesk (display) · Hanken Grotesk (UI) · JetBrains Mono (datos).
**Espaciado:** base 4px (`--space-1`…`--space-13`). **Radios:** 6 → pill. **Sombras:** xs → xl + `--shadow-glow` (energía).

## ⚡ Regla de oro del verde lima

El lima es **energía, no fondo**. Úsalo en dosis: CTA principal, estado activo, acentos y detalles
de energía. Nunca como fondo amplio ni como texto sobre blanco (para eso, `--primary-text`).
Texto sobre lima siempre `--primary-ink`. Un solo CTA primario por vista.

## 📱 Responsive

Móvil primero. Breakpoints 640 / 940 / 1200. Toque mínimo 44px, texto ≥ 13.5px.
En móvil: una columna + tab bar inferior. En desktop: 2–3 columnas + barra superior.
