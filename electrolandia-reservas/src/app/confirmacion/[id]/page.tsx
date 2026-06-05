import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { NEGOCIO, CARGADORES, ADAPTADORES } from "@/lib/config";
import { horaToNum, horaLabel } from "@/lib/availability";
import type { Reserva } from "@/lib/types";
import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/IconSprite";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileTabBar } from "@/components/MobileTabBar";

export const dynamic = "force-dynamic";

export default async function ConfirmacionPage({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data } = await db.from("reservas").select("*").eq("id", params.id).single();
  const r = data as Reserva | null;

  if (!r) {
    return (
      <div className="app">
        <SiteHeader />
        <main className="app-main">
          <div className="container-narrow section">
            <div className="empty">
              <span className="icon-tile">
                <Icon name="x-circle" />
              </span>
              <p className="t-h3">No encontramos esta reserva.</p>
              <Link
                href="/reservar"
                className="btn btn-primary"
                style={{ marginTop: "var(--space-4)" }}
              >
                <Icon name="calendar-check" /> Hacer una reserva
              </Link>
            </div>
          </div>
        </main>
        <MobileTabBar />
      </div>
    );
  }

  const cargador = CARGADORES.find((c) => c.id === r.cargador);
  const ini = horaToNum(r.hora_inicio);
  const fin = horaToNum(r.hora_fin);

  return (
    <div className="app">
      <SiteHeader />

      <main className="app-main">
        <div className="container-narrow section-sm">
          {/* Éxito */}
          <div className="confirm-wrap rise">
            <div className="confirm-badge">
              <Icon name="check" />
            </div>
            <h1 className="t-h1">¡Reserva confirmada!</h1>
            <p className="t-body-lg t-muted" style={{ marginTop: 8 }}>
              Te esperamos. Acá están tus datos.
            </p>
          </div>

          {/* Ticket */}
          <div className="card" style={{ marginTop: "var(--space-7)" }}>
            <KV k="Reserva" v={`#${r.id.slice(0, 8).toUpperCase()}`} />
            <KV k="Fecha" v={r.fecha} />
            <KV
              k="Horario"
              v={`${horaLabel(ini)} → ${horaLabel(fin === 24 ? 0 : fin)} (${fin - ini} h)`}
            />
            <KV k="Cargador" v={cargador?.nombre ?? r.cargador} />
            <KV k="Vehículo" v={`${r.marca} ${r.modelo} · ${r.placa}`} />
            <KV k="Conector" v={r.conector} />
          </div>

          <a
            href={NEGOCIO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg btn-block"
            style={{ marginTop: "var(--space-4)" }}
          >
            <Icon name="pin" /> Cómo llegar (Google Maps)
          </a>

          {/* Info de llegada */}
          <div className="card" style={{ marginTop: "var(--space-4)" }}>
            <InfoBlock icon="pin" title="Dirección" body={cargador?.direccion ?? ""} />
            <InfoBlock
              icon="plug"
              title="Al llegar"
              body={`Conectá tu vehículo y la carga inicia automáticamente. Nuestro cargador es J1772 (Tipo 1); si tu carro usa ${ADAPTADORES.join(
                " o ",
              )}, te facilitamos el adaptador sin costo.`}
            />
            <InfoBlock
              icon="whatsapp"
              title="¿Dudas?"
              body={`WhatsApp ${NEGOCIO.contacto.whatsapp} · ${NEGOCIO.contacto.correo}`}
              last
            />
          </div>

          <Link href="/" className="btn btn-text btn-block" style={{ marginTop: "var(--space-3)" }}>
            Volver al inicio
          </Link>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v" style={{ textAlign: "right" }}>
        {v}
      </span>
    </div>
  );
}

function InfoBlock({
  icon,
  title,
  body,
  last,
}: {
  icon: IconName;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        paddingBlock: "var(--space-3)",
        borderBottom: last ? "0" : "1px solid var(--border)",
      }}
    >
      <span className="icon-tile plain" style={{ width: 36, height: 36 }}>
        <Icon name={icon} className="icon-sm" />
      </span>
      <div className="grow">
        <div className="field-label">{title}</div>
        <p className="t-sm t-muted" style={{ marginTop: 2 }}>
          {body}
        </p>
      </div>
    </div>
  );
}
