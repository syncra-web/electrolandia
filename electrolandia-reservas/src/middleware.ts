import { NextResponse, type NextRequest } from "next/server";

// Protege /admin (excepto /admin/login). Si no hay sesión válida, redirige a login.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const esLogin = pathname.startsWith("/admin/login");
  if (!esLogin) {
    const cookie = req.cookies.get("admin_session")?.value;
    if (cookie !== process.env.ADMIN_SESSION_SECRET) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
