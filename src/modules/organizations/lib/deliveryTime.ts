/* El tiempo de entrega, en las tres formas que se le ofrecen al proveedor. El
   backend guarda solo dos numeros de dias habiles; la forma se deduce de
   ellos: 0 y 0 es el mismo dia, dos iguales un numero fijo y dos distintos un
   rango. */
export type DeliveryKind = 'same-day' | 'fixed' | 'range';

export const DELIVERY_KIND_OPTIONS: { value: DeliveryKind; label: string }[] = [
  { value: 'same-day', label: 'Mismo día' },
  { value: 'fixed', label: 'Número de días' },
  { value: 'range', label: 'Rango de días' },
];

/* Lo que se escribe. kind vacio es "no lo ha dicho". En un numero fijo solo
   cuenta min. */
export interface DeliveryValues {
  kind: DeliveryKind | '';
  min: string;
  max: string;
}

export const emptyDelivery = (): DeliveryValues => ({ kind: '', min: '', max: '' });

export const deliveryKindOf = (min: number, max: number): DeliveryKind =>
  max === 0 ? 'same-day' : min === max ? 'fixed' : 'range';

export const toDeliveryValues = (
  min: number | null | undefined,
  max: number | null | undefined,
): DeliveryValues => {
  if (min == null || max == null) return emptyDelivery();
  const kind = deliveryKindOf(min, max);
  return {
    kind,
    min: kind === 'same-day' ? '' : String(min),
    max: kind === 'range' ? String(max) : '',
  };
};

/* De vuelta a los dos numeros. Null en los dos si no ha elegido forma. */
export const toDeliveryDays = (
  values: DeliveryValues,
): { min: number | null; max: number | null } => {
  switch (values.kind) {
    case '':
      return { min: null, max: null };
    case 'same-day':
      return { min: 0, max: 0 };
    case 'fixed':
      return { min: Number(values.min), max: Number(values.min) };
    case 'range':
      return { min: Number(values.min), max: Number(values.max) };
  }
};

const isDays = (value: string, from: number) => {
  const n = Number(value);
  return value.trim() !== '' && Number.isInteger(n) && n >= from && n <= 90;
};

/* Lo que falta o sobra en lo escrito, o null si se puede guardar. Un rango
   de 3 a 3 se acepta: es un numero fijo dicho de otro modo. */
export const deliveryError = (values: DeliveryValues): string | null => {
  switch (values.kind) {
    case '':
    case 'same-day':
      return null;
    case 'fixed':
      return isDays(values.min, 1) ? null : 'Indica los días hábiles, entre 1 y 90.';
    case 'range':
      if (!isDays(values.min, 0) || !isDays(values.max, 1)) {
        return 'Indica el rango completo en días hábiles, entre 0 y 90.';
      }
      return Number(values.min) > Number(values.max)
        ? 'El primer número no puede ser mayor que el segundo.'
        : null;
  }
};

const dias = (n: number) => `${n} ${n === 1 ? 'día hábil' : 'días hábiles'}`;

/* "Mismo día", "3 días hábiles" o "2 a 5 días hábiles". Null si no lo ha
   dicho. */
export const formatDeliveryTime = (
  min: number | null | undefined,
  max: number | null | undefined,
): string | null => {
  if (min == null || max == null) return null;
  switch (deliveryKindOf(min, max)) {
    case 'same-day':
      return 'Mismo día';
    case 'fixed':
      return dias(min);
    case 'range':
      return `${min} a ${max} días hábiles`;
  }
};
