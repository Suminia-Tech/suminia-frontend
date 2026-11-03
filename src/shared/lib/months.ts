/* Los meses como se escriben en las graficas: "nov" en el eje, "Noviembre de
   2026" en el detalle. El mes llega como "2026-11" y se lee en UTC para que no
   retroceda uno por la zona horaria. */

const FORMATO_MES = new Intl.DateTimeFormat('es-CO', { month: 'short', timeZone: 'UTC' });
const FORMATO_MES_LARGO = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const fecha = (month: string) => new Date(`${month}-01T00:00:00Z`);

export const mesCorto = (month: string) => FORMATO_MES.format(fecha(month)).replace('.', '');

export const mesLargo = (month: string) => {
  const texto = FORMATO_MES_LARGO.format(fecha(month));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
