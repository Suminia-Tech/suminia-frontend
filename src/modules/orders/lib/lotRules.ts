import { todayInColombia } from '@/shared/lib/dates';

/* La vigencia minima del lote, como fecha: la primera de vencimiento que se
   acepta hoy. La usan el campo de cada producto, para validar al elegir la
   fecha, y el despacho, para no dejar salir un lote que se guardo antes de
   que la regla existiera o cambiara. Es la misma cuenta que hace el
   servidor, que la vuelve a exigir. */

const sumarDias = (dia: string, dias: number): string => {
  const fecha = new Date(`${dia}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
};

/* "2026-11-22" mas n meses. Si el dia no existe en el mes de llegada —31 de
   enero mas un mes—, queda en el ultimo del mes. */
const sumarMeses = (dia: string, meses: number): string => {
  const [anio, mes, d] = dia.split('-').map(Number);
  const total = mes - 1 + meses;
  const destinoAnio = anio + Math.floor(total / 12);
  const destinoMes = total % 12;
  const ultimo = new Date(Date.UTC(destinoAnio, destinoMes + 1, 0)).getUTCDate();
  return new Date(Date.UTC(destinoAnio, destinoMes, Math.min(d, ultimo))).toISOString().slice(0, 10);
};

/** La primera fecha de vencimiento aceptable: mañana si no hay minimo, o hoy mas los meses. */
export const minimaFechaDeVencimiento = (meses: number): string => {
  const hoy = todayInColombia();
  return meses > 0 ? sumarMeses(hoy, meses) : sumarDias(hoy, 1);
};

/** "6 meses", "1 mes". */
export const mesesExigidos = (meses: number): string => (meses === 1 ? '1 mes' : `${meses} meses`);
