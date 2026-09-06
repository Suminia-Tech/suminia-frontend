/* NIT colombiano. El backend lo guarda tal cual lo envia el registro, de modo
   que en la base conviven "900123456-7" y "9001234567". Estas funciones son
   para mostrar y comparar, no para reformatear lo que ya esta guardado. */

/** Deja solo dígitos: sirve para comparar dos NIT escritos distinto. */
export const normalizeTaxId = (taxId: string): string => taxId.replace(/\D/g, '');

/** "9001234567" → "900.123.456-7" */
export const formatTaxId = (taxId: string): string => {
  const digits = normalizeTaxId(taxId);
  if (digits.length < 2) return taxId;

  const base = digits.slice(0, -1);
  const checkDigit = digits.slice(-1);
  const grouped = base.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${grouped}-${checkDigit}`;
};

/** Entre 9 y 10 dígitos, incluido el de verificación. */
export const isValidTaxId = (taxId: string): boolean => {
  const digits = normalizeTaxId(taxId);
  return digits.length >= 9 && digits.length <= 10;
};
