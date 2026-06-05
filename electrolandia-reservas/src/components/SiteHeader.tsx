import Link from "next/link";
import { Icon } from "./Icon";

type Active = "inicio" | "reservar" | "admin";

/** Barra superior del DS (.nav). En móvil los links se ocultan (≤760px) y la
 *  navegación pasa a <MobileTabBar />. */
export function SiteHeader({ active }: { active?: Active }) {
  return (
    <header className="nav">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Icon name="bolt" />
        </span>
        ELECTROLANDIA
      </Link>
      <nav className="nav-links grow" style={{ justifyContent: "center" }}>
        <Link className={`nav-link${active === "inicio" ? " active" : ""}`} href="/">
          <Icon name="home" /> Inicio
        </Link>
        <Link className={`nav-link${active === "reservar" ? " active" : ""}`} href="/reservar">
          <Icon name="calendar" /> Reservar
        </Link>
        <Link className={`nav-link${active === "admin" ? " active" : ""}`} href="/admin">
          <Icon name="grid" /> Admin
        </Link>
      </nav>
      <Link className="btn btn-primary btn-sm" href="/reservar">
        <Icon name="bolt" /> Reservar carga
      </Link>
    </header>
  );
}
