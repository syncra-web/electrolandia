import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { horaToNum, rangoLibre, pad, type Rango } from "@/lib/availability";

export const dynamic = "force-dynamic";

const schema = z.object({
  cargador: z.enum(["C1", "C2"]),
  nombre: z.string().trim().min(3, "Nombre demasiado corto"),
  whatsapp: z.string().trim().min(7, "WhatsApp inválido"),
  correo: z.string().trim().email("Correo inválido"),
  placa: z.string().trim().min(5, "Placa inválida"),
  marca: z.string().trim().min(1),
  modelo: z.string().trim().min(1),
  conector: z.enum(["J1772 Tipo 1", "Tipo 2", "GB/T-AC", "No estoy seguro"]),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  hora_inicio: z.number().int().min(0).max(23),
  hora_fin: z.number().int().min(1).max(24),
  observaciones: z.string().trim().optional().default(""),
  terminos: z.literal(true, { errorMap: () => ({ message: "Debes aceptar los términos" }) }),
});

// POST /api/reservas
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const d = parsed.data;

  if (d.hora_fin <= d.hora_inicio) {
    return NextResponse.json({ error: "La hora de fin debe ser mayor a la de inicio" }, { status: 400 });
  }

  // No permitir fechas pasadas (zona Colombia, comparación simple por fecha).
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }); // YYYY-MM-DD
  if (d.fecha < hoy) {
    return NextResponse.json({ error: "No puedes reservar en una fecha pasada" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Revalidación en servidor: ¿el rango sigue libre? (reservas activas + bloqueos)
  const [reservasRes, bloqueosRes] = await Promise.all([
    db.from("reservas").select("hora_inicio,hora_fin").eq("fecha", d.fecha).eq("cargador", d.cargador).neq("estado", "Cancelada"),
    db.from("bloqueos").select("hora_inicio,hora_fin").eq("fecha", d.fecha).eq("cargador", d.cargador),
  ]);
  if (reservasRes.error || bloqueosRes.error) {
    return NextResponse.json({ error: "Error verificando disponibilidad" }, { status: 500 });
  }
  const ocupados: Rango[] = [...(reservasRes.data ?? []), ...(bloqueosRes.data ?? [])].map((r) => ({
    ini: horaToNum(r.hora_inicio),
    fin: horaToNum(r.hora_fin),
  }));

  if (!rangoLibre(d.hora_inicio, d.hora_fin, ocupados)) {
    return NextResponse.json(
      { error: "Ese horario acaba de ocuparse o está bloqueado. Elige otro." },
      { status: 409 }
    );
  }

  // Insert. El índice de exclusión en la BD es la garantía final ante carreras.
  const { data, error } = await db
    .from("reservas")
    .insert({
      cargador: d.cargador,
      nombre: d.nombre,
      whatsapp: d.whatsapp,
      correo: d.correo,
      placa: d.placa.toUpperCase(),
      marca: d.marca,
      modelo: d.modelo,
      conector: d.conector,
      fecha: d.fecha,
      hora_inicio: `${pad(d.hora_inicio)}:00:00`,
      hora_fin: `${pad(d.hora_fin)}:00:00`,
      observaciones: d.observaciones || null,
      terminos: true,
    })
    .select("id")
    .single();

  if (error) {
    // 23P01 = exclusion_violation (dos reservas chocaron en el mismo milisegundo)
    if ((error as { code?: string }).code === "23P01") {
      return NextResponse.json(
        { error: "Ese horario acaba de ocuparse. Elige otro." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "No se pudo crear la reserva" }, { status: 500 });
  }

  // TODO (V2): enviar correo de confirmación (Resend) y WhatsApp.
  return NextResponse.json({ id: data.id }, { status: 201 });
}
