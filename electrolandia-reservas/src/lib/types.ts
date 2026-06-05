import type { CargadorId, Conector, Estado } from "./config";

export type Reserva = {
  id: string;
  creada_en: string;
  cargador: CargadorId;
  nombre: string;
  whatsapp: string;
  correo: string;
  placa: string;
  marca: string;
  modelo: string;
  conector: Conector;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // "HH:00:00"
  hora_fin: string; // "HH:00:00"
  observaciones: string | null;
  terminos: boolean;
  estado: Estado;
};

export type HoraSlot = { hora: number; label: string; libre: boolean };

export type DisponibilidadCargador = {
  cargador: CargadorId;
  nombre: string;
  horas: HoraSlot[];
};

export type DisponibilidadRespuesta = {
  fecha: string;
  cargadores: DisponibilidadCargador[];
};
