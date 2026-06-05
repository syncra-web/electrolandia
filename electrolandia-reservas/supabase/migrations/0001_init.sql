-- =====================================================================
-- Electrolandia — Sistema de reservas de carga EV (V1)
-- Migración inicial: tablas, validaciones y prevención de doble reserva.
-- Ejecutar en Supabase: SQL Editor -> pegar este archivo -> Run.
-- =====================================================================

-- Extensiones necesarias
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists btree_gist;    -- exclusión por (cargador =, periodo &&)

-- ---------------------------------------------------------------------
-- Tabla principal: reservas
-- ---------------------------------------------------------------------
create table if not exists reservas (
  id            uuid primary key default gen_random_uuid(),
  creada_en     timestamptz not null default now(),

  -- cargador: C1 (Cra 90 #16-97) | C2 (Cra 90 #16-89)
  cargador      text not null check (cargador in ('C1','C2')),

  -- cliente
  nombre        text not null,
  whatsapp      text not null,
  correo        text not null,

  -- vehículo
  placa         text not null,
  marca         text not null,
  modelo        text not null,
  conector      text not null
                check (conector in ('J1772 Tipo 1','Tipo 2','GB/T-AC','No estoy seguro')),

  -- reserva (multi-hora, dentro del mismo día). hora_fin puede ser '24:00:00'.
  fecha         date not null,
  hora_inicio   time not null,
  hora_fin      time not null,

  observaciones text,
  terminos      boolean not null default false,

  estado        text not null default 'Confirmada'
                check (estado in ('Confirmada','Finalizada','No asistió','Cancelada')),

  -- rango calculado [inicio, fin) para detectar solapamientos
  periodo       tsrange generated always as (
                  tsrange((fecha + hora_inicio), (fecha + hora_fin), '[)')
                ) stored,

  constraint reservas_horas_validas check (hora_fin > hora_inicio),

  -- 🔒 GARANTÍA REAL ANTI-DOBLE-RESERVA:
  -- dos reservas activas del MISMO cargador no pueden solaparse en el tiempo.
  constraint reservas_sin_solape
    exclude using gist (cargador with =, periodo with &&)
    where (estado <> 'Cancelada')
);

-- ---------------------------------------------------------------------
-- Tabla: bloqueos (mantenimiento / horarios cerrados por el admin)
-- En el sistema actual esto es el color naranja "En mantenimiento".
-- ---------------------------------------------------------------------
create table if not exists bloqueos (
  id          uuid primary key default gen_random_uuid(),
  cargador    text not null check (cargador in ('C1','C2')),
  fecha       date not null,
  hora_inicio time not null,
  hora_fin    time not null,
  motivo      text default 'Mantenimiento',
  creado_en   timestamptz not null default now(),
  constraint bloqueos_horas_validas check (hora_fin > hora_inicio)
);

-- Índices de apoyo
create index if not exists reservas_fecha_idx on reservas (fecha);
create index if not exists bloqueos_fecha_idx on bloqueos (fecha);

-- =====================================================================
-- SEGURIDAD (leer CLAUDE.md):
-- En V1 el backend usa la SERVICE ROLE KEY desde el servidor (Route
-- Handlers), que ignora RLS. La service role NUNCA se expone al navegador.
-- Para producción: activar RLS y crear políticas, y mover lecturas/inserts
-- públicos a la anon key con políticas adecuadas. Ejemplo (comentado):
--
-- alter table reservas enable row level security;
-- alter table bloqueos  enable row level security;
-- (definir políticas según el modelo de acceso antes de usar anon key)
-- =====================================================================
