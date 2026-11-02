/* Los filtros del personal de Suminia sobre los pedidos, para evaluar la
   operacion: cuando, que, donde, a quien, por cuanto y cuanto.

   El valor y las unidades van por tramos y no con dos campos de numero: lo
   que se pregunta es "cuantos pedidos grandes hay", no un rango exacto, y un
   tramo se elige de un vistazo desde la misma barra de desplegables. */

export interface StaffOrderFilters {
  month: string;
  categoryId: string;
  city: string;
  department: string;
  clientType: string;
  value: string;
  units: string;
}

export const EMPTY_STAFF_FILTERS: StaffOrderFilters = {
  month: '',
  categoryId: '',
  city: '',
  department: '',
  clientType: '',
  value: '',
  units: '',
};

interface Range {
  key: string;
  label: string;
  min?: number;
  max?: number;
}

/* El valor total del pedido, con IVA. */
export const VALUE_RANGES: Range[] = [
  { key: 'hasta-500k', label: 'Hasta $500.000', max: 500_000 },
  { key: '500k-1m', label: '$500.000 a $1.000.000', min: 500_000, max: 1_000_000 },
  { key: '1m-2m', label: '$1.000.000 a $2.000.000', min: 1_000_000, max: 2_000_000 },
  { key: 'mas-2m', label: 'Más de $2.000.000', min: 2_000_000 },
];

/* Las unidades del pedido: la suma de lo pedido en cada linea. */
export const UNIT_RANGES: Range[] = [
  { key: '1-10', label: '1 a 10 unidades', min: 1, max: 10 },
  { key: '11-50', label: '11 a 50 unidades', min: 11, max: 50 },
  { key: '51-100', label: '51 a 100 unidades', min: 51, max: 100 },
  { key: 'mas-100', label: 'Más de 100 unidades', min: 101 },
];

/* La actividad del comprador. Copia corta de las del modulo organizations
   —un modulo no importa otro—: aqui solo hace falta el nombre. */
export const CLIENT_TYPE_LABEL: Record<string, string> = {
  IPS: 'IPS',
  CLINICAL_LABORATORY: 'Laboratorio clínico',
  DIAGNOSTIC_CENTER: 'Centro de diagnóstico',
  PHARMACY: 'Droguería',
  NON_PROFIT: 'Entidad sin ánimo de lucro',
  NON_HEALTH_ENTITY: 'Entidad fuera del sector salud',
  PRIVATE_COMPANY: 'Empresa privada',
  INDEPENDENT_PROFESSIONAL: 'Profesional independiente',
  OTHER: 'Otro tipo',
};

/* "Octubre de 2026". El mes llega como "2026-10" y se lee en UTC para que no
   retroceda un dia —y con el, un mes— por la zona horaria. */
const FORMATO_MES = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
export const monthLabel = (month: string) => {
  const texto = FORMATO_MES.format(new Date(`${month}-01T00:00:00Z`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/* El mes de un pedido en hora de Colombia, como lo agrupa el backend. */
export const monthOf = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date(iso));

/* Al contrato del backend: filter[month], filter[minTotal]... */
export const toFilterParams = (filters: StaffOrderFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.month) params.month = filters.month;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.city) params.city = filters.city;
  if (filters.department) params.department = filters.department;
  if (filters.clientType) params.clientType = filters.clientType;
  const value = VALUE_RANGES.find((range) => range.key === filters.value);
  if (value?.min !== undefined) params.minTotal = String(value.min);
  if (value?.max !== undefined) params.maxTotal = String(value.max);
  const units = UNIT_RANGES.find((range) => range.key === filters.units);
  if (units?.min !== undefined) params.minUnits = String(units.min);
  if (units?.max !== undefined) params.maxUnits = String(units.max);
  return params;
};

export const rangeLabel = (ranges: Range[], key: string) =>
  ranges.find((range) => range.key === key)?.label ?? key;
