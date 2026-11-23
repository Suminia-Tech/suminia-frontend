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

/* Con hora, en Colombia: para los plazos que se cuentan en horas y para el
   historial de un pedido, donde el orden de lo que paso el mismo dia importa.

   Fecha y hora se arman por separado y se unen con una coma: "4 de noviembre
   de 2026, 3:20 p. m.". Con las dos en un mismo formato, el navegador escribe
   "4 de noviembre de 2026 a las 3:20 p. m.", que es lenguaje hablado y no el
   de un documento. */
const FORMATO_FECHA_LARGA = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Bogota',
});

const FORMATO_HORA = new Intl.DateTimeFormat('es-CO', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Bogota',
});

/** "4 de noviembre de 2026, 3:20 p. m.", o null. */
export const formatDateTime = (iso: string | null | undefined): string | null => {
  if (!iso) return null;

  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;

  /* La hora no se parte: "1:42 p." en una linea y "m." en la siguiente no se
     lee como hora. */
  const hora = FORMATO_HORA.format(fecha).replace(/\s/g, '\u00a0');
  return `${FORMATO_FECHA_LARGA.format(fecha)}, ${hora}`;
};

/* El momento de un paso, en dos piezas cortas para que quepa bajo su nombre
   en la linea de pasos del pedido: "5 nov 2026" y "3:40 p. m.", en hora de
   Colombia. La hora es la traza de cada paso —cuanto tardo el proveedor en
   confirmar, en despachar— y no solo el dia. */
const FORMATO_CORTO = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Bogota',
});

const FORMATO_SOLO_HORA = new Intl.DateTimeFormat('es-CO', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Bogota',
});

/** { dia: "5 nov 2026", hora: "3:40 p. m." }, o null. */
export const formatMoment = (
  iso: string | null | undefined,
): { dia: string; hora: string } | null => {
  if (!iso) return null;
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return null;
  return {
    /* Por piezas: el formato corto de es-CO dice "5 de nov. de 2026". */
    dia: (() => {
      const pieza = (tipo: Intl.DateTimeFormatPartTypes) =>
        FORMATO_CORTO.formatToParts(fecha).find((p) => p.type === tipo)?.value ?? '';
      return `${pieza('day')} ${pieza('month').replace('.', '')} ${pieza('year')}`;
    })(),
    hora: FORMATO_SOLO_HORA.format(fecha),
  };
};
