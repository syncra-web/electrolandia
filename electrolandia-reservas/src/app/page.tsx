import Link from "next/link";
import {
  NEGOCIO,
  CARGADORES,
  CONECTORES,
  ADAPTADORES,
  TARIFAS,
  formatoCOP,
} from "@/lib/config";
import { Icon } from "@/components/Icon";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileTabBar } from "@/components/MobileTabBar";

const tarifasUnicas = TARIFAS.filter(
  (t, i, arr) => arr.findIndex((x) => x.etiqueta === t.etiqueta) === i,
);

const PASOS = [
  "Reservá tu fecha y hora acá mismo.",
  "Llegá al punto a la hora reservada.",
  "Conectá tu vehículo: la carga inicia sola.",
];

export default function Home() {
  return (
    <div className="app">
      <SiteHeader active="inicio" />

      <main className="app-main">
        {/* ============================ HERO ============================ */}
        <section className="hero">
          <div className="hero-grid-bg" />
          <div className="container section" style={{ position: "relative" }}>
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Texto */}
              <div className="rise">
                <span className="badge badge-lime" style={{ marginBottom: 18 }}>
                  <span className="dot" /> Punto activo · San Joaquín, Cali
                </span>
                <h1 className="t-display text-balance" style={{ marginBottom: 18 }}>
                  Reservá tu punto de{" "}
                  <span style={{ color: "var(--lime-700)" }}>carga eléctrica</span> en Cali.
                </h1>
                <p className="t-body-lg t-muted text-pretty" style={{ maxWidth: "52ch" }}>
                  {NEGOCIO.subtitulo}. Elegí día y hora, dejá tus datos y listo: tu
                  cargador te espera. Servicio disponible las 24 horas.
                </p>
                <div className="row-wrap" style={{ gap: "var(--space-3)", marginTop: 28 }}>
                  <Link className="btn btn-primary btn-lg" href="/reservar">
                    <Icon name="calendar-check" /> Reservar ahora
                  </Link>
                  <a
                    className="btn btn-maps btn-lg"
                    href={NEGOCIO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="pin" /> Cómo llegar
                  </a>
                </div>
                {/* Stats */}
                <div className="row-wrap" style={{ gap: "var(--space-7)", marginTop: 32 }}>
                  <HeroStat value="~11" unit="kW" label="Potencia máx." />
                  <span className="hidden sm:block" style={{ width: 1, height: 38, background: "var(--border)" }} />
                  <HeroStat value={String(CARGADORES.length)} label="Cargadores" />
                  <span className="hidden sm:block" style={{ width: 1, height: 38, background: "var(--border)" }} />
                  <HeroStat value="24/7" label="Disponible" />
                </div>
              </div>

              {/* Tarjeta de datos del punto (oculta en móvil para no estorbar el CTA) */}
              <div
                className="card card-dark rise hidden lg:block"
                style={{ animationDelay: ".08s", position: "relative", overflow: "hidden" }}
              >
                <div className="row between">
                  <span className="badge badge-charging">
                    <span className="dot" /> Carga AC
                  </span>
                  <span className="t-data" style={{ color: "var(--text-on-dark-muted)" }}>
                    J1772 · Tipo 1
                  </span>
                </div>
                <div style={{ margin: "22px 0 8px" }}>
                  <div className="t-label" style={{ color: "var(--lime-400)" }}>
                    Potencia del punto
                  </div>
                  <div
                    className="power"
                    style={{ color: "var(--cyan-400)", fontSize: 56, lineHeight: 1, marginTop: 6 }}
                  >
                    11.0<span className="unit" style={{ fontSize: 22 }}>kW</span>
                  </div>
                </div>
                <div className="flow-line" style={{ margin: "18px 0" }} />
                <div className="grid grid-cols-3 gap-4" style={{ marginTop: 16 }}>
                  <PointFact label="Conectores" value={String(CONECTORES.length - 1)} />
                  <PointFact label="Adaptadores" value={String(ADAPTADORES.length)} accent />
                  <PointFact label="Cargadores" value={String(CARGADORES.length)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== INFO DEL PUNTO ===================== */}
        <section className="container section">
          <div
            className="row between"
            style={{ marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-3)" }}
          >
            <div>
              <span className="eyebrow">
                <Icon name="station" /> Nuestro punto de carga
              </span>
              <h2 className="t-h1" style={{ marginTop: 8 }}>
                Todo lo que necesitás saber
              </h2>
            </div>
            <span className="badge badge-success">
              <span className="dot" /> Abierto · 24/7
            </span>
          </div>

          <div className="grid-auto cols-4">
            {/* Ubicación */}
            <div className="card card-hover">
              <div className="card-head">
                <span className="icon-tile">
                  <Icon name="pin" />
                </span>
                <div className="grow">
                  <div className="card-title">Ubicación</div>
                </div>
              </div>
              <p className="t-sm" style={{ color: "var(--text-default)" }}>
                {CARGADORES.map((c) => c.direccion).join(" · ")}
              </p>
              <a
                className="btn btn-maps btn-sm btn-block"
                href={NEGOCIO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 14 }}
              >
                <Icon name="pin" /> Abrir en Maps
              </a>
            </div>

            {/* Potencia */}
            <div className="card card-hover">
              <div className="card-head">
                <span className="icon-tile accent">
                  <Icon name="battery-charging" />
                </span>
                <div className="grow">
                  <div className="card-title">Potencia</div>
                </div>
              </div>
              <div className="power" style={{ fontSize: 40, margin: "4px 0" }}>
                11.0<span className="unit">kW</span>
              </div>
              <p className="t-sm t-muted">
                Carga AC: las sesiones toman varias horas. Dejá tu carro mientras hacés tus cosas.
              </p>
            </div>

            {/* Conectores */}
            <div className="card card-hover">
              <div className="card-head">
                <span className="icon-tile">
                  <Icon name="ev-connector" />
                </span>
                <div className="grow">
                  <div className="card-title">Conectores</div>
                </div>
              </div>
              <div className="kv">
                <span className="k">J1772 · Tipo 1</span>
                <span className="badge badge-success">Estándar</span>
              </div>
              {ADAPTADORES.map((a) => (
                <div className="kv" key={a}>
                  <span className="k">{a}</span>
                  <span className="badge badge-lime">Adaptador</span>
                </div>
              ))}
            </div>

            {/* Cómo funciona */}
            <div className="card card-hover">
              <div className="card-head">
                <span className="icon-tile">
                  <Icon name="clock" />
                </span>
                <div className="grow">
                  <div className="card-title">Cómo funciona</div>
                </div>
              </div>
              <ol
                className="t-sm"
                style={{ color: "var(--text-default)", paddingLeft: 18, margin: 0, display: "grid", gap: 8 }}
              >
                {PASOS.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===================== TARIFA ===================== */}
        <section className="container" style={{ paddingBottom: "var(--space-9)" }}>
          <div className="card">
            <div className="card-head" style={{ marginBottom: "var(--space-5)" }}>
              <span className="icon-tile">
                <Icon name="tag" />
              </span>
              <div className="grow">
                <div className="card-title">Tarifa por kWh</div>
                <div className="card-sub">El pago es en el sitio: {NEGOCIO.pago.toLowerCase()}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tarifasUnicas.map((t) => (
                <div
                  key={t.etiqueta}
                  style={{
                    background: "var(--bg-sunken)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-3) var(--space-4)",
                  }}
                >
                  <div className="t-data" style={{ fontWeight: 700, color: "var(--text-strong)" }}>
                    {formatoCOP(t.valor)}
                  </div>
                  <div className="t-xs t-muted" style={{ marginTop: 2 }}>
                    {t.etiqueta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA STRIP ===================== */}
        <section className="container" style={{ paddingBottom: "var(--space-11)" }}>
          <div
            className="card"
            style={{
              background: "var(--carbon-900)",
              border: 0,
              padding: "var(--space-9)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="row between"
              style={{ position: "relative", flexWrap: "wrap", gap: "var(--space-6)" }}
            >
              <div>
                <span className="badge badge-lime">
                  <Icon name="leaf" /> Movilidad limpia
                </span>
                <h2
                  className="t-h1"
                  style={{ color: "#fff", margin: "14px 0 8px", maxWidth: "18ch" }}
                >
                  ¿Listo para cargar? Tu cargador está a un toque.
                </h2>
                <p
                  className="t-muted"
                  style={{ color: "var(--text-on-dark-muted)", maxWidth: "46ch" }}
                >
                  Reservá en menos de un minuto y llegá con la seguridad de que el cargador es tuyo.
                </p>
              </div>
              <Link className="btn btn-primary btn-lg" href="/reservar">
                <Icon name="bolt" /> Reservar mi carga <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        <div className="container" style={{ paddingBlock: "var(--space-6)" }}>
          <div className="row between" style={{ flexWrap: "wrap", gap: "var(--space-3)" }}>
            <div className="brand" style={{ fontSize: 15 }}>
              <span className="brand-mark" style={{ width: 28, height: 28, borderRadius: 8 }}>
                <Icon name="bolt" className="icon-sm" />
              </span>
              ELECTROLANDIA
            </div>
            <p className="t-xs t-muted">
              Carga EV · Cali, Colombia · WhatsApp {NEGOCIO.contacto.whatsapp} ·{" "}
              {NEGOCIO.contacto.correo}
            </p>
          </div>
        </div>
      </footer>

      <MobileTabBar active="inicio" />
    </div>
  );
}

function HeroStat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div>
      <div
        className="t-data"
        style={{ fontSize: 26, fontWeight: 700, color: "var(--text-strong)" }}
      >
        {value}
        {unit && <span style={{ fontSize: 15, color: "var(--accent-text)" }}> {unit}</span>}
      </div>
      <div className="t-xs t-muted">{label}</div>
    </div>
  );
}

function PointFact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="t-label" style={{ color: "var(--text-on-dark-muted)" }}>
        {label}
      </div>
      <div
        className="t-data"
        style={{ color: accent ? "var(--lime-400)" : "#fff", fontSize: 18, marginTop: 2 }}
      >
        {value}
      </div>
    </div>
  );
}
