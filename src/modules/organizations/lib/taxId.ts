import { nitCheckDigit } from '@/shared/lib/nit';

/* NIT colombiano. Desde que el registro calcula el digito de verificacion se
   guarda como "900123456-8"; los de antes pueden estar como "9001234567".
   Estas funciones son para mostrar y comparar, no para reescribir lo que ya
   esta guardado. */

/** Deja solo dígitos: sirve para comparar dos NIT escritos distinto. */
export const normalizeTaxId = (taxId: string): string => taxId.replace(/\D/g, '');

/** "9001234568" o "900.123.456-8" → "900123456-8": sin puntos, como en el RUT. */
export const formatTaxId = (taxId: string): string => {
  const digits = normalizeTaxId(taxId);
  if (digits.length < 2) return taxId;
  return `${digits.slice(0, -1)}-${digits.slice(-1)}`;
};

/* El digito que deberia tener un NIT guardado, si el que tiene no
   corresponde; nulo si esta bien. Un NIT escrito a mano antes de la regla
   puede traer el digito errado, y quien lo revisa tiene que verlo. */
export const wrongCheckDigit = (taxId: string): number | null => {
  const digits = normalizeTaxId(taxId);
  if (digits.length < 7) return null;
  const correcto = nitCheckDigit(digits.slice(0, -1));
  return correcto === Number(digits.slice(-1)) ? null : correcto;
};
