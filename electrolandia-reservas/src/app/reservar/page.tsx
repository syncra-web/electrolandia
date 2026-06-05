"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CARGADORES, CONECTORES, MARCAS, tarifaPorHora, formatoCOP } from "@/lib/config";
import { horaLabel, maxFinDesde } from "@/lib/availability";
import type { DisponibilidadRespuesta } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileTabBar } from "@/components/MobileTabBar";

function hoyISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export default function ReservarPage() {
  const router = useRouter();
  const [cargador, setCargador] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [disp, setDisp] = useState<DisponibilidadRespuesta | null>(null);
  const [cargando, setCargando] = useState(false);

  const [inicio, setInicio] = useState<number | null>(null);
  const [fin, setFin] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    whatsapp: "",
    correo: "",
    placa: "",
    marca: "",
    modelo: "",
    conector: "" as string,
    observaciones: "",
    terminos: false,
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string>("");

  // Cargar disponibilidad cuando hay cargador + fecha
  useEffect(() => {
    if (!cargador || !fecha) return;
    setCargando(true);
    setDisp(null);
    setInicio(null);
    setFin(null);
    fetch(`/api/disponibilidad?fecha=${fecha}`)
      .then((r) => r.json())
      .then((data: DisponibilidadRespuesta) => setDisp(data))
      .catch(() => setError("No se pudo cargar la disponibilidad."))
      .finally(() => setCargando(false));
  }, [cargador, fecha]);

  const horasCargador = disp?.cargadores.find((c) => c.cargador === cargador)?.horas ?? [];
  const libresBool = horasCargador.map((h) => h.libre);
  const maxFin = inicio !== null ? maxFinDesde(inicio, libresBool) : null;

  function elegirInicio(h: number) {
    setInicio(h);
    setFin(null);
    setError("");
  }

  async function enviar() {
    setError("");
    if (!cargador || !fecha || inicio === null || fin === null) {
      setError("Completa cargador, fecha y horario.");
      return;
    }
    if (!form.terminos) {
      setError("Debes aceptar los términos.");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cargador,
          nombre: form.nombre,
          whatsapp: form.whatsapp,
          correo: form.correo,
          placa: form.placa,
          marca: form.marca,
          modelo: form.modelo,
          conector: form.conector,
          fecha,
          hora_inicio: inicio,
          hora_fin: fin,
          observaciones: form.observaciones,
          terminos: form.terminos,
        }),
      });
      const data = await res.json();
      if (res.status === 201 && data.id) {
        router.push(`/confirmacion/${data.id}`);
        return;
      }
      if (res.status === 409) {
        setError(data.error || "Ese horario acaba de ocuparse. Elige otro.");
        // refrescar disponibilidad
        const r = await fetch(`/api/disponibilidad?fecha=${fecha}`);
        setDisp(await r.json());
        setInicio(null);
        setFin(null);
      } else {
        setError(data.error || "No se pudo crear la reserva. Revisa los datos.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const t = e.target as HTMLInputElement;
      const value = t.type === "checkbox" ? t.checked : t.value;
      setForm((f) => ({ ...f, [k]: value }));
    };

  const listo = cargador && fecha && inicio !== null && fin !== null;

  // Estado del stepper
  const s1done = !!(cargador && fecha);
  const s2done = !!listo;

  return (
    <div className="app">
      <SiteHeader active="reservar" />

      <main className="app-main">
        <div className="container-narrow section-sm">
          {/* Stepper */}
          <div className="stepper" style={{ marginBottom: "var(--space-6)", flexWrap: "wrap", rowGap: "var(--space-2)" }}>
            <Step n={1} label="Cargador y fecha" active={!s1done} done={s1done} />
            <span className={`step-bar${s1done ? " done" : ""}`} />
            <Step n={2} label="Horario" active={s1done && !s2done} done={s2done} />
            <span className={`step-bar${s2done ? " done" : ""}`} />
            <Step n={3} label="Tus datos" active={s2done} done={false} />
          </div>

          <div className="stack" style={{ display: "grid", gap: "var(--space-5)" }}>
            {/* PASO 1: cargador + fecha */}
            <section className="card">
              <h2 className="t-h3" style={{ marginBottom: "var(--space-4)" }}>
                1. Cargador y fecha
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CARGADORES.map((c) => {
                  const sel = cargador === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCargador(c.id)}
                      aria-pressed={sel}
                      className="chooser-opt"
                      style={
                        sel
                          ? { borderColor: "var(--primary)", background: "var(--primary-soft)" }
                          : undefined
                      }
                    >
                      <span className="icon-tile">
                        <Icon name="station" />
                      </span>
                      <span className="grow" style={{ textAlign: "left", minWidth: 0 }}>
                        <span className="field-label" style={{ display: "block" }}>
                          {c.nombre}
                        </span>
                        <span className="t-xs t-muted">{c.direccion}</span>
                      </span>
                      {sel && <Icon name="check-circle" />}
                    </button>
                  );
                })}
              </div>

              <div className="field" style={{ marginTop: "var(--space-4)" }}>
                <label className="field-label" htmlFor="fecha">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  min={hoyISO()}
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="input"
                />
              </div>
            </section>

            {/* PASO 2: horario */}
            {cargador && fecha && (
              <section className="card">
                <h2 className="t-h3">2. Horario</h2>
                <p className="t-sm t-muted" style={{ marginTop: 4 }}>
                  Es carga AC (~11 kW): elegí cuántas horas dejarás tu vehículo. Verde = libre.
                </p>

                {cargando && (
                  <p className="t-sm t-muted" style={{ marginTop: "var(--space-4)" }}>
                    Cargando disponibilidad…
                  </p>
                )}

                {!cargando && disp && (
                  <>
                    <p className="field-label" style={{ marginTop: "var(--space-4)" }}>
                      Hora de inicio
                    </p>
                    <div className="slots" style={{ marginTop: "var(--space-2)" }}>
                      {horasCargador.map((h) => (
                        <button
                          key={h.hora}
                          type="button"
                          disabled={!h.libre}
                          onClick={() => elegirInicio(h.hora)}
                          className={`slot${inicio === h.hora ? " selected" : ""}${!h.libre ? " busy" : ""}`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>

                    {inicio !== null && maxFin !== null && (
                      <>
                        <p className="field-label" style={{ marginTop: "var(--space-5)" }}>
                          ¿Hasta qué hora?
                        </p>
                        <div
                          className="row-wrap"
                          style={{ marginTop: "var(--space-2)", gap: "var(--space-2)" }}
                        >
                          {Array.from({ length: maxFin - inicio }, (_, i) => inicio + i + 1).map(
                            (hf) => (
                              <button
                                key={hf}
                                type="button"
                                onClick={() => setFin(hf)}
                                className={`slot${fin === hf ? " selected" : ""}`}
                                style={{ width: "auto", paddingInline: "var(--space-4)" }}
                              >
                                {horaLabel(hf === 24 ? 0 : hf)}
                                <span className="t-xs" style={{ opacity: 0.6, marginLeft: 4 }}>
                                  ({hf - inicio}h)
                                </span>
                              </button>
                            ),
                          )}
                        </div>
                      </>
                    )}

                    {listo && (
                      <div
                        className="card"
                        style={{
                          marginTop: "var(--space-5)",
                          background: "var(--primary-soft)",
                          borderColor: "color-mix(in oklch, var(--lime-400) 35%, transparent)",
                          boxShadow: "none",
                        }}
                      >
                        <div className="row between" style={{ flexWrap: "wrap", gap: "var(--space-2)" }}>
                          <span className="field-label">
                            {CARGADORES.find((c) => c.id === cargador)?.nombre} · {fecha}
                          </span>
                          <span className="badge badge-lime">
                            <Icon name="clock" /> {fin! - inicio!} hora{fin! - inicio! > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="t-data" style={{ marginTop: 6, color: "var(--text-strong)" }}>
                          {horaLabel(inicio!)} → {horaLabel(fin === 24 ? 0 : fin!)}
                        </div>
                        <div className="t-xs t-muted" style={{ marginTop: 4 }}>
                          Tarifa de inicio: {formatoCOP(tarifaPorHora(inicio!))}/kWh · pago en el sitio.
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}

            {/* PASO 3: datos */}
            {listo && (
              <section className="card">
                <h2 className="t-h3" style={{ marginBottom: "var(--space-4)" }}>
                  3. Tus datos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre completo">
                    <input value={form.nombre} onChange={set("nombre")} className="input" placeholder="Ej. Ana Gómez" />
                  </Field>
                  <Field label="WhatsApp">
                    <input value={form.whatsapp} onChange={set("whatsapp")} inputMode="tel" className="input" placeholder="Ej. 300 123 4567" />
                  </Field>
                  <Field label="Correo electrónico">
                    <input value={form.correo} onChange={set("correo")} inputMode="email" className="input" placeholder="tucorreo@email.com" />
                  </Field>
                  <Field label="Placa del vehículo">
                    <input value={form.placa} onChange={set("placa")} className="input" style={{ textTransform: "uppercase" }} placeholder="ABC123" />
                  </Field>
                  <Field label="Marca">
                    <input list="marcas" value={form.marca} onChange={set("marca")} className="input" placeholder="Ej. BYD" />
                    <datalist id="marcas">
                      {MARCAS.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="Modelo">
                    <input value={form.modelo} onChange={set("modelo")} className="input" placeholder="Ej. Dolphin" />
                  </Field>
                  <Field label="Tipo de conector">
                    <div className="select-wrap">
                      <select value={form.conector} onChange={set("conector")} className="select">
                        <option value="">Selecciona…</option>
                        {CONECTORES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  <Field label="Observaciones (opcional)">
                    <input value={form.observaciones} onChange={set("observaciones")} className="input" placeholder="Algo que debamos saber" />
                  </Field>
                </div>

                <label className="check" style={{ marginTop: "var(--space-4)" }}>
                  <input type="checkbox" checked={form.terminos} onChange={set("terminos")} />
                  <span className="box">
                    <Icon name="check" />
                  </span>
                  <span>
                    Acepto llegar puntual, usar el cargador de forma responsable y entender que la
                    carga es AC (~11 kW) y toma varias horas.
                  </span>
                </label>

                {error && (
                  <div
                    className="toast"
                    style={{
                      marginTop: "var(--space-4)",
                      background: "var(--danger-soft)",
                      borderColor: "color-mix(in oklch, var(--danger) 25%, transparent)",
                      color: "var(--danger-text)",
                    }}
                  >
                    <Icon name="alert" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={enviar}
                  disabled={enviando}
                  className="btn btn-primary btn-lg btn-block"
                  style={{ marginTop: "var(--space-5)" }}
                >
                  {enviando ? (
                    "Confirmando…"
                  ) : (
                    <>
                      <Icon name="check-circle" /> Confirmar reserva
                    </>
                  )}
                </button>
              </section>
            )}

            {error && !listo && (
              <div
                className="toast"
                style={{
                  background: "var(--danger-soft)",
                  borderColor: "color-mix(in oklch, var(--danger) 25%, transparent)",
                  color: "var(--danger-text)",
                }}
              >
                <Icon name="alert" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileTabBar active="reservar" />
    </div>
  );
}

function Step({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className={`step${active ? " active" : ""}${done ? " done" : ""}`}>
      <span className="num">{done ? <Icon name="check" className="icon-sm" /> : n}</span>
      <span className="lbl">{label}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
