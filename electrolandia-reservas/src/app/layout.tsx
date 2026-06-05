import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { IconSprite } from "../components/IconSprite";
// Orden importante: primero Tailwind (globals), luego el design system
// (tokens → base → components → app) para que el DS gane en conflictos.
// fonts.css va AL FINAL: enlaza los tokens de tipografía a next/font.
import "./globals.css";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/app.css";
import "../styles/fonts.css";

// Tipografía del design system: Space Grotesk (display) · Hanken Grotesk (UI)
// · JetBrains Mono (datos). Servidas localmente con next/font; pisan las
// variables que declara tokens.css (mayor especificidad en <html class>).
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Electrolandia — Reserva tu carga",
  description:
    "Reserva tu horario para cargar tu vehículo eléctrico en Electrolandia, San Joaquín, Cali.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <IconSprite />
        {children}
      </body>
    </html>
  );
}
