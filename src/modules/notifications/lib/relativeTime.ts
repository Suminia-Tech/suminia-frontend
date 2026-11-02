import { formatDate } from '@/shared/lib/dates';

const RELATIVO = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' });

/* "hace 5 minutos", "ayer", y pasada una semana la fecha: en un aviso importa
   cuanto hace, hasta que hace tanto que ya importa el dia. */
export const timeAgo = (iso: string, now: Date = new Date()): string => {
  const segundos = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(segundos);
  if (abs < 60) return 'hace un momento';
  if (abs < 3600) return RELATIVO.format(Math.round(segundos / 60), 'minute');
  if (abs < 86400) return RELATIVO.format(Math.round(segundos / 3600), 'hour');
  if (abs < 7 * 86400) return RELATIVO.format(Math.round(segundos / 86400), 'day');
  return formatDate(iso) ?? '';
};
