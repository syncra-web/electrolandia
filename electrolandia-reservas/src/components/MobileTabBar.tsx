import Link from "next/link";
import { Icon } from "./Icon";

type Active = "inicio" | "reservar" | "admin";

/** Tab bar inferior (.tabbar). Solo visible en móvil (≤760px, ver globals.css). */
export function MobileTabBar({ active }: { active?: Active }) {
  return (
    <nav className="tabbar">
      <Link className={`tabbar-item${active === "inicio" ? " active" : ""}`} href="/">
        <Icon name="home" /> Inicio
      </Link>
      <Link className={`tabbar-item${active === "reservar" ? " active" : ""}`} href="/reservar">
        <Icon name="calendar" /> Reservar
      </Link>
      <Link className={`tabbar-item${active === "admin" ? " active" : ""}`} href="/admin">
        <Icon name="grid" /> Admin
      </Link>
    </nav>
  );
}
