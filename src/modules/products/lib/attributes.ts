/* Los atributos de un producto viven en una columna JSONB, sin forma fija: un
   insumo declara material y esterilidad, un medicamento declarara CUM y
   registro INVIMA. Esa libertad es el punto del diseño —anadir un tipo no pide
   una migracion— pero obliga a tratarlos como pares nombre/valor al leerlos.

   Cuando existan los medicamentos, aqui es donde vivira el conjunto de campos
   que cada tipo espera; hasta entonces el proveedor los escribe libres. */

export interface AttributePair {
  key: string;
  value: string;
}

/* El backend lo tipa como `unknown` porque no puede prometer su forma. Se
   normaliza a pares, descartando lo que no sea texto o numero: un objeto
   anidado no se puede pintar en una fila de tabla, y arrastrarlo daria
   "[object Object]". */
export const toAttributePairs = (attributes: unknown): AttributePair[] => {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return [];
  }

  return Object.entries(attributes as Record<string, unknown>)
    .filter(
      ([, value]) =>
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
    )
    .map(([key, value]) => ({ key, value: String(value) }));
};

/* De vuelta al objeto que espera el backend. Descarta los pares a medio
   escribir: una clave vacia no se puede consultar y solo ensucia el JSONB. */
export const fromAttributePairs = (
  pairs: AttributePair[],
): Record<string, string> | undefined => {
  const filled = pairs.filter((pair) => pair.key.trim() && pair.value.trim());
  if (filled.length === 0) return undefined;

  return filled.reduce<Record<string, string>>((acc, pair) => {
    acc[pair.key.trim()] = pair.value.trim();
    return acc;
  }, {});
};

/* "principioActivo" -> "Principio activo". Las claves las escribe el proveedor
   y suelen venir en una sola palabra; mostrarlas crudas en la ficha del
   comprador se ve descuidado.

   Las siglas escritas en mayusculas se respetan: "CUM" no debe volverse "Cum",
   y este dominio esta lleno de ellas —CUM, INVIMA, ATC, POS—. */
const isAcronym = (word: string): boolean =>
  word.length >= 2 && word === word.toUpperCase() && /[A-Z]/.test(word);

export const humanizeAttributeKey = (key: string): string => {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return key;

  return words
    .map((word, index) => {
      if (isAcronym(word)) return word;
      const lower = word.toLowerCase();
      return index === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(' ');
};
