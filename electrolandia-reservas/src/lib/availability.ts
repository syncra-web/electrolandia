// Lógica pura (sin DB) para generar horas y detectar solapamientos.
// Modelo: granularidad de 1 hora; una reserva ocupa [ini, fin) (fin exclusivo).
// Ej: 14:00–16:00 ocupa las horas 14 y 15 (2 horas).

export const HORAS = Array.from({ length: 24 }, (_, i) => i); // 0..23

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function horaLabel(h: number): string {
  return `${pad(h)}:00`;
}

// "HH:MM:SS" | "HH:MM" -> número de hora. "24:00:00" -> 24.
export function horaToNum(t: string): number {
  return parseInt(t.slice(0, 2), 10);
}

export type Rango = { ini: number; fin: number };

export function solapan(aIni: number, aFin: number, bIni: number, bFin: number): boolean {
  return aIni < bFin && bIni < aFin;
}

// Marca qué horas (0..23) están libres dado un conjunto de rangos ocupados.
export function horasLibres(ocupados: Rango[]): boolean[] {
  const libres = HORAS.map(() => true);
  for (const o of ocupados) {
    for (let h = o.ini; h < o.fin && h < 24; h++) libres[h] = false;
  }
  return libres;
}

// ¿El rango [ini, fin) está completamente libre?
export function rangoLibre(ini: number, fin: number, ocupados: Rango[]): boolean {
  if (!(fin > ini) || ini < 0 || fin > 24) return false;
  return !ocupados.some((o) => solapan(ini, fin, o.ini, o.fin));
}

// Dadas las horas libres, calcula hasta dónde se puede extender una reserva
// que empieza en `ini` (hora_fin máxima posible sin chocar con una ocupada).
export function maxFinDesde(ini: number, libres: boolean[]): number {
  let fin = ini;
  while (fin < 24 && libres[fin]) fin++;
  return fin; // si fin === ini, no hay horas libres desde ahí
}
