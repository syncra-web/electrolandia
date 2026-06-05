import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CARGADORES } from "@/lib/config";
import { HORAS, horaToNum, horasLibres, horaLabel, type Rango } from "@/lib/availability";

export const dynamic = "force-dynamic";

// GET /api/disponibilidad?fecha=YYYY-MM-DD
// Devuelve, por cada cargador, las 24 horas del día marcadas como libre/ocupado.
export async function GET(req: NextRequest) {
  const fecha = req.nextUrl.searchParams.get("fecha");
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "Parámetro 'fecha' (YYYY-MM-DD) requerido" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const [reservasRes, bloqueosRes] = await Promise.all([
    db.from("reservas").select("cargador,hora_inicio,hora_fin").eq("fecha", fecha).neq("estado", "Cancelada"),
    db.from("bloqueos").select("cargador,hora_inicio,hora_fin").eq("fecha", fecha),
  ]);

  if (reservasRes.error || bloqueosRes.error) {
    return NextResponse.json({ error: "Error consultando disponibilidad" }, { status: 500 });
  }

  const ocupadosTodos = [...(reservasRes.data ?? []), ...(bloqueosRes.data ?? [])];

  const cargadores = CARGADORES.map((c) => {
    const ocupados: Rango[] = ocupadosTodos
      .filter((r) => r.cargador === c.id)
      .map((r) => ({ ini: horaToNum(r.hora_inicio), fin: horaToNum(r.hora_fin) }));
    const libres = horasLibres(ocupados);
    return {
      cargador: c.id,
      nombre: c.nombre,
      horas: HORAS.map((h) => ({ hora: h, label: horaLabel(h), libre: libres[h] })),
    };
  });

  return NextResponse.json({ fecha, cargadores });
}
