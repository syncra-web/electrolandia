import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { ESTADOS } from "@/lib/config";

export const dynamic = "force-dynamic";

function autorizado(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = cookies().get("admin_session")?.value;
  return !!secret && cookie === secret;
}

// GET /api/admin/reservas?filtro=hoy|proximas
export async function GET(req: NextRequest) {
  if (!autorizado()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const filtro = req.nextUrl.searchParams.get("filtro") ?? "proximas";
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

  const db = supabaseAdmin();
  let q = db.from("reservas").select("*").order("fecha", { ascending: true }).order("hora_inicio", { ascending: true });
  if (filtro === "hoy") q = q.eq("fecha", hoy);
  else q = q.gte("fecha", hoy);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: "Error consultando reservas" }, { status: 500 });
  return NextResponse.json({ reservas: data });
}

// PATCH /api/admin/reservas?id=UUID   body: { estado }
export async function PATCH(req: NextRequest) {
  if (!autorizado()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });

  let body: { estado?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body.estado || !(ESTADOS as readonly string[]).includes(body.estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db.from("reservas").update({ estado: body.estado }).eq("id", id);
  if (error) return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
