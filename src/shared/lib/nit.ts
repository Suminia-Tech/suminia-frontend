/* El NIT colombiano y su digito de verificacion.

   El digito sale de la formula de la DIAN: cada cifra del NIT, de derecha a
   izquierda, por un peso primo (3, 7, 13, 17...); la suma modulo 11; si el
   residuo es 0 o 1 ese es el digito, si no, 11 menos el residuo. Con el de la
   propia DIAN, 800197268, da 4. La misma formula valida el backend.

   Se escribe sin puntos y con guion, como en el RUT: "900123456-8". */

const PESOS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

export const nitCheckDigit = (base: string): number => {
  const cifras = base.replace(/\D/g, '').split('').reverse();
  const suma = cifras.reduce((s, c, i) => s + Number(c) * PESOS[i], 0);
  const residuo = suma % 11;
  return residuo > 1 ? 11 - residuo : residuo;
};

/** El NIT sin el digito: de 6 a 10 cifras. */
export const isNitBase = (base: string): boolean => /^\d{6,10}$/.test(base);

/** "900123456" → "900123456-8" */
export const withCheckDigit = (base: string): string => `${base}-${nitCheckDigit(base)}`;
