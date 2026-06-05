// Configuración central del servicio. Cambia aquí los datos del negocio.
// (Datos tomados del sistema actual de Electrolandia: Sheets + Forms.)

export const NEGOCIO = {
  nombre: "Electrolandia",
  subtitulo: "Carga para vehículos eléctricos",
  // El servicio opera 24 horas, todos los días.
  abierto247: true,
  potencia: "hasta 50 A · ~10–11 kW (carga AC)",
  mapsUrl: "https://maps.app.goo.gl/GVG9622ywZvZ2im29",
  contacto: {
    whatsapp: "+57 310 817 6786",
    correo: "electrolandia.vs@gmail.com",
  },
  pago: "Transferencia bancaria, QR o efectivo (en el sitio).",
};

// Dos cargadores contiguos.
export const CARGADORES = [
  { id: "C1", nombre: "Cargador 1", direccion: "Cra 90 #16-97, Barrio San Joaquín, Cali" },
  { id: "C2", nombre: "Cargador 2", direccion: "Cra 90 #16-89, Barrio San Joaquín, Cali (contiguo)" },
] as const;

export type CargadorId = (typeof CARGADORES)[number]["id"];

// Conector que se pide en el formulario.
export const CONECTORES = [
  "J1772 Tipo 1",
  "Tipo 2",
  "GB/T-AC",
  "No estoy seguro",
] as const;
export type Conector = (typeof CONECTORES)[number];

// Adaptadores que el punto facilita (informativo).
export const ADAPTADORES = ["Tipo 2", "GB/T-AC"] as const;

// Estados de la reserva.
export const ESTADOS = ["Confirmada", "Finalizada", "No asistió", "Cancelada"] as const;
export type Estado = (typeof ESTADOS)[number];

// Marcas comunes (datalist del formulario; el cliente puede escribir otra).
export const MARCAS = [
  "BYD", "Kia", "Nissan", "Chevrolet", "JAC", "Renault", "Volvo",
  "Hyundai", "MG", "Tesla", "Volkswagen", "Audi", "Mini", "Otra",
];

// Tarifa por kWh según franja (informativa; el pago es en sitio, no en línea).
// Vigente desde el 8 de febrero de 2026.
export const TARIFAS = [
  { desde: 7, hasta: 9, valor: 1000, etiqueta: "7am–9am" },
  { desde: 9, hasta: 15, valor: 900, etiqueta: "9am–3pm" },
  { desde: 15, hasta: 19, valor: 1000, etiqueta: "3pm–7pm" },
  { desde: 19, hasta: 24, valor: 1250, etiqueta: "7pm–7am" },
  { desde: 0, hasta: 7, valor: 1250, etiqueta: "7pm–7am" },
];

// Devuelve la tarifa $/kWh para una hora (0..23).
export function tarifaPorHora(hora: number): number {
  const f = TARIFAS.find((t) => hora >= t.desde && hora < t.hasta);
  return f ? f.valor : 1250;
}

export function formatoCOP(valor: number): string {
  return "$" + valor.toLocaleString("es-CO");
}
