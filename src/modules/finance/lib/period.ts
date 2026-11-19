import type { MonthRange } from '../model/finance.types';

/* Los periodos del tablero de finanzas: los atajos que se piden en una
   reunion —lo que va del año, el ultimo trimestre, el año pasado— y como se
   escribe un rango en pantalla. Los meses como "2026-11", en hora de
   Colombia. */

export const MAX_RANGE_MONTHS = 36;

export const mesActual = (ahora = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    timeZone: 'America/Bogota',
  })
    .format(ahora)
    .slice(0, 7);

export const moverMes = (month: string, n: number) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
};

export const mesesEntre = (from: string, to: string) => {
  const lista: string[] = [];
  for (let m = from; m <= to; m = moverMes(m, 1)) lista.push(m);
  return lista;
};

export type PresetKey = 'year' | 'last3' | 'last6' | 'last12' | 'lastYear';

export const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'year', label: 'Este año' },
  { key: 'last3', label: 'Últimos 3 meses' },
  { key: 'last6', label: 'Últimos 6 meses' },
  { key: 'last12', label: 'Últimos 12 meses' },
  { key: 'lastYear', label: 'Año anterior' },
];

/* "Este año" va hasta diciembre: los meses que faltan muestran la meta del
   plan, y las cifras solo suman lo que ya paso. */
export const presetRange = (key: PresetKey, ahora = new Date()): MonthRange => {
  const actual = mesActual(ahora);
  const anio = Number(actual.slice(0, 4));
  switch (key) {
    case 'year':
      return { from: `${anio}-01`, to: `${anio}-12` };
    case 'last3':
      return { from: moverMes(actual, -2), to: actual };
    case 'last6':
      return { from: moverMes(actual, -5), to: actual };
    case 'last12':
      return { from: moverMes(actual, -11), to: actual };
    case 'lastYear':
      return { from: `${anio - 1}-01`, to: `${anio - 1}-12` };
  }
};

export interface RangeOption {
  key: string;
  label: string;
  range: MonthRange;
}

/* Lo que ofrece el desplegable de periodo de cada grafica: los atajos y,
   despues, cada año anterior con datos, hasta `desde`. */
export const rangeOptions = (desde?: string): RangeOption[] => {
  const atajos = PRESETS.map(({ key, label }) => ({ key, label, range: presetRange(key) }));
  const anio = Number(mesActual().slice(0, 4));
  const primero = desde ? Number(desde.slice(0, 4)) : anio;
  const anios: RangeOption[] = [];
  for (let y = anio - 2; y >= primero; y--) {
    anios.push({ key: `y${y}`, label: `Año ${y}`, range: { from: `${y}-01`, to: `${y}-12` } });
  }
  return [...atajos, ...anios];
};

export const DEFAULT_RANGE: PresetKey = 'year';

const CORTO = new Intl.DateTimeFormat('es-CO', { month: 'short', timeZone: 'UTC' });
const LARGO = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const fecha = (month: string) => new Date(`${month}-01T00:00:00Z`);
const corto = (month: string) => CORTO.format(fecha(month)).replace('.', '');

/* "noviembre de 2026", "ene – nov 2026", "nov 2025 – oct 2026". */
export const rangoLargo = ({ from, to }: MonthRange) => {
  if (from === to) return LARGO.format(fecha(from));
  if (from.slice(0, 4) === to.slice(0, 4)) {
    return from.endsWith('-01') && to.endsWith('-12')
      ? `todo ${from.slice(0, 4)}`
      : `${corto(from)} – ${corto(to)} ${to.slice(0, 4)}`;
  }
  return `${corto(from)} ${from.slice(0, 4)} – ${corto(to)} ${to.slice(0, 4)}`;
};

const DIA = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Bogota',
});

export const fechaDeCorte = (iso: string) => DIA.format(new Date(iso));
