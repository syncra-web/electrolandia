"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar() {
    setError("");
    setCargando(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Clave incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--carbon-900)",
        padding: "var(--space-6)",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 380 }}>
        <div className="row" style={{ gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
          <span className="brand-mark">
            <Icon name="shield" />
          </span>
          <div>
            <div className="t-h3">Panel · Electrolandia</div>
            <div className="t-sm t-muted">Ingresá la clave de administrador.</div>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="pwd">
            Clave
          </label>
          <input
            id="pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="••••••••"
            className="input"
            aria-invalid={!!error}
          />
        </div>

        {error && (
          <div className="field-error" style={{ marginTop: "var(--space-2)" }}>
            <Icon name="alert" className="icon-sm" /> {error}
          </div>
        )}

        <button
          onClick={entrar}
          disabled={cargando}
          className="btn btn-primary btn-block"
          style={{ marginTop: "var(--space-4)" }}
        >
          {cargando ? (
            "Entrando…"
          ) : (
            <>
              <Icon name="bolt" /> Entrar
            </>
          )}
        </button>
      </div>
    </main>
  );
}
