import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para USO EN SERVIDOR únicamente (Route Handlers,
// Server Components). Usa la SERVICE ROLE KEY, que ignora RLS.
// ⚠️ NUNCA importes este archivo desde un componente "use client".
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (revisa .env.local)"
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
