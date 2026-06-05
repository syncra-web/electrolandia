import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Auth de admin V1: clave compartida -> cookie httpOnly.
// (Para producción, migrar a Supabase Auth + RLS. Ver CLAUDE.md.)
export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!adminPassword || !sessionSecret) {
    return NextResponse.json({ error: "Auth no configurada en el servidor" }, { status: 500 });
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });
  return res;
}

// DELETE /api/admin/login -> cerrar sesión
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
