/* Fechas para leer, no para calcular.

   El backend las manda en ISO con hora y zona; en pantalla sobra todo eso: a
   quien espera que le aprueben la empresa le importa el dia, no el minuto. */

const FORMATO = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** "2 de agosto de 2026", o null si no hay fecha o viene rota. */
export const formatDate = (iso: string | null | undefined): string | null => {
  if (!iso) return null;

  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  return FORMATO.format(fecha);
};

/* Una fecha sin hora —"para el 20 de octubre"— llega como medianoche UTC. Leida
   en hora de Colombia seria el 19 a las siete de la noche, y se mostraria un
   dia antes. Se formatea en UTC para que diga el dia que se guardo. */
const FORMATO_DIA = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Para fechas sin hora: "20 de octubre de 2026". */
export const formatDay = (iso: string | null | undefined): string | null => {
  if (!iso) return null;

  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  return FORMATO_DIA.format(fecha);
};

/** Hoy en Colombia como YYYY-MM-DD, para el `min` de un campo de fecha. */
export const todayInColombia = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
