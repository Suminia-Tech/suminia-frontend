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
