export const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

/* "$ 5,3 M": para los ejes y las barras, donde la cifra entera no cabe. */
export const pesosCortos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(valor);

export const porcentaje = (valor: number) =>
  new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 0 }).format(valor);

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
