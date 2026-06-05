# ELECTROLANDIA — Convenciones del proyecto

Plataforma de reserva de carga EV (Cali). Al generar o editar UI, respeta SIEMPRE este sistema.

## No inventar
- Colores, tipos, espaciados y radios salen de `styles/tokens.css`. Usa `var(--token)`, nunca HEX sueltos.
- Componentes existen en `styles/components.css` (`.btn`, `.input`, `.card`, `.badge`, `.calendar`, `.table`, `.nav`…). Reúsalos antes de crear nuevos.

## Color
- Primario lima `--primary` (#C6F542) solo para acción/energía. Texto sobre lima = `--primary-ink`. Lima como texto = `--primary-text`.
- Cian `--accent` exclusivamente para datos de energía (kW, carga en vivo, líneas de flujo). Nunca como CTA.
- Estados de reserva: success=Confirmada, warning=Ocupado, danger=Cancelada, info=Finalizada, noshow=No asistió, charging(cian)=Cargando.

## Tipografía
- Display/titulares: Space Grotesk. UI/cuerpo: Hanken Grotesk. Datos (kW, horas, placas, IDs): JetBrains Mono (`.t-data` / `.mono`).

## Iconos
- Solo line icons del sprite (`assets/icons.js`): `<svg class="icon"><use href="#i-NOMBRE"></use></svg>`. Trazo 1.75, no rellenar.

## Layout
- Usa flex/grid con `gap`. Clases `grid-auto` + `cols-2/3/4`. Espaciado en múltiplos de 4 (`--space-*`).
- Móvil primero. Toque ≥ 44px, texto ≥ 13.5px.

## Tono
- Tecnológico pero cercano y simple. Sin jerga, sin saturar de lima, sin iconografía infantil, sin exceso de rayos/glows.
