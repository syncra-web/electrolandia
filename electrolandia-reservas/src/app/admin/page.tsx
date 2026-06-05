"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ESTADOS, CARGADORES } from "@/lib/config";
import { horaToNum, horaLabel } from "@/lib/availability";
import type { Reserva } from "@/lib/types";
import { Icon } from "@/components/Icon";

// Estado de reserva → clase de badge del design system.
const BADGE_ESTADO: Record<string, string> = {
  Confirmada: "badge-success",
  Finalizada: "badge-info",
  "No asistió": "badge-noshow",
  Cancelada: "badge-danger",
};

export default function AdminPage() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<"hoy" | "proximas">("hoy");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const res = await fetch(`/api/admin/reservas?filtro=${filtro}`);
    if (res.ok) {
      const d = await res.json();
      setReservas(d.reservas ?? []);
    }
    setCargando(false);
  }, [filtro]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarEstado(id: string, estado: string) {
    await fetch(`/api/admin/reservas?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    cargar();
  }

  async function salir() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="app">
      <header className="nav">
        <span className="brand">
          <span className="brand-mark">
            <Icon name="grid" />
          </span>
          Panel · Electrolandia
        </span>
        <button onClick={salir} className="btn btn-text btn-sm" style={{ marginLeft: "auto" }}>
          Cerrar sesión
        </button>
      </header>

      <main className="app-main">
        <div className="container section-sm">
          {/* Toolbar */}
          <div className="toolbar" style={{ marginBottom: "var(--space-5)" }}>
            <div className="segment">
              {(["hoy", "proximas"] as const).map((f) => (
                <button
                  key={f}
                  className={filtro === f ? "active" : ""}
                  onClick={() => setFiltro(f)}
                >
                  {f === "hoy" ? "Reservas de hoy" : "Próximas"}
                </button>
              ))}
            </div>
            <button onClick={cargar} className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }}>
              Actualizar
            </button>
          </div>

          {cargando ? (
            <div className="empty">
              <span className="icon-tile">
                <Icon name="clock" />
              </span>
              <p>Cargando…</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="empty">
              <span className="icon-tile">
                <Icon name="calendar" />
              </span>
              <p>No hay reservas para mostrar.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {reservas.map((r) => {
                const cargador = CARGADORES.find((c) => c.id === r.cargador);
                const ini = horaToNum(r.hora_inicio);
                const fin = horaToNum(r.hora_fin);
                return (
                  <div key={r.id} className="card">
                    <div
                      className="row between"
                      style={{ flexWrap: "wrap", gap: "var(--space-2)", alignItems: "flex-start" }}
                    >
                      <div className="row" style={{ gap: "var(--space-3)" }}>
                        <span className="avatar">{r.nombre.slice(0, 1).toUpperCase()}</span>
                        <div>
                          <div className="field-label" style={{ fontSize: "var(--fs-body)" }}>
                            {r.nombre}
                          </div>
                          <div className="t-xs t-muted t-data">
                            {r.fecha} · {horaLabel(ini)}–{horaLabel(fin === 24 ? 0 : fin)} (
                            {fin - ini}h) · {cargador?.nombre ?? r.cargador}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${BADGE_ESTADO[r.estado] ?? "badge-neutral"}`}>
                        <span className="dot" /> {r.estado}
                      </span>
                    </div>

                    <div
                      className="grid gap-2 sm:grid-cols-2 t-sm"
                      style={{ marginTop: "var(--space-3)", color: "var(--text-default)" }}
                    >
                      <span className="row" style={{ gap: 8 }}>
                        <Icon name="whatsapp" className="icon-sm" /> {r.whatsapp}
                      </span>
                      <span className="row" style={{ gap: 8 }}>
                        <Icon name="mail" className="icon-sm" /> {r.correo}
                      </span>
                      <span className="row" style={{ gap: 8 }}>
                        <Icon name="car" className="icon-sm" /> {r.marca} {r.modelo} · {r.placa}
                      </span>
                      <span className="row" style={{ gap: 8 }}>
                        <Icon name="ev-connector" className="icon-sm" /> {r.conector}
                      </span>
                      {r.observaciones && (
                        <span className="row sm:col-span-2" style={{ gap: 8 }}>
                          <Icon name="edit" className="icon-sm" /> {r.observaciones}
                        </span>
                      )}
                    </div>

                    <div
                      className="row-wrap"
                      style={{
                        marginTop: "var(--space-3)",
                        paddingTop: "var(--space-3)",
                        borderTop: "1px solid var(--border)",
                        gap: "var(--space-2)",
                      }}
                    >
                      {ESTADOS.map((e) => (
                        <button
                          key={e}
                          onClick={() => cambiarEstado(r.id, e)}
                          disabled={r.estado === e}
                          className="btn btn-secondary btn-sm"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
