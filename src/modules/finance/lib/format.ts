/* Como se escriben el dinero, los meses y los dias en las pantallas de
   finanzas. */

export const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

/* "$ 5,3 M": para las tarjetas y las barras, donde la cifra entera no cabe. */
export const pesosCortos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(valor);

/* "13,5%": un decimal como mucho, con coma. */
export const porcentaje = (valor: number) =>
  `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(valor)}%`;

/* "Noviembre de 2026". El mes llega como "2026-11" y se lee en UTC para que
   no retroceda un dia —y con el, un mes— por la zona horaria. */
const FORMATO_MES = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
/* 6,5%: coma decimal, como se escribe en Colombia. */
export const formatPercent = (rate: number) => `${String(rate).replace('.', ',')}%`;

export const monthName = (month: string) => {
  const texto = FORMATO_MES.format(new Date(`${month}-01T00:00:00Z`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const WEEKDAY_LABEL: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
};

/* Un valor del historial de cambios como se lee: "10%", "$ 20.000.000",
   "30 días", "Sí". El backend los guarda como texto, sin unidades. */
const PORCENTAJES = [
  'commissionRate',
  'freightRate',
  'collectionRate',
  'returnsRate',
  'badDebtRate',
  'otherVariableRate',
  'targetQuoteConversion',
];
const PESOS = ['creditLimit', 'monthlyFixedCosts', 'cashFloor', 'creditPortfolioCap', 'targetTicket'];

export const formatChangeValue = (field: string, value: string | null): string => {
  if (value === null) return field === 'commissionRate' ? 'La general' : '—';
  /* Los del plan llegan como "line:SUPPLIES:markupRate" o
     "plan:2027-03:sales": se formatean por su ultimo tramo. */
  const [tipo, , campo] = field.split(':');
  if (tipo === 'line') return formatPercent(Number(value));
  if (tipo === 'plan') {
    return campo === 'sales' || campo === 'result' ? pesos(Number(value)) : value;
  }
  if (PORCENTAJES.includes(field)) return formatPercent(Number(value));
  if (PESOS.includes(field)) return pesos(Number(value));
  switch (field) {
    case 'targetFrequency':
      return value.replace('.', ',');
    case 'creditEnabled':
      return value === 'true' ? 'Sí' : 'No';
    case 'creditDays':
    case 'quoteValidityDays':
      return `${value} días`;
    case 'claimWindowDays':
      return `${value} días hábiles`;
    case 'paymentWindowHours':
    case 'paymentReminderHours':
      return `${value} horas`;
    case 'payoutWeekday':
      return WEEKDAY_LABEL[Number(value)] ?? value;
    default:
      return value;
  }
};
