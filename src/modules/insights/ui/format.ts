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

/* Los meses viven en shared: los usan tambien las graficas de finanzas. */
export { mesCorto, mesLargo } from '@/shared/lib/months';
