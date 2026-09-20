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

/* Los mismos pares, pero para leerlos.

   `toAttributePairs` no sirve para pintar: lo usa tambien el formulario del
   proveedor, que los edita y los devuelve al backend con `fromAttributePairs`,
   de modo que ahi el valor tiene que seguir siendo el que se escribio. Si esa
   funcion tradujera los booleanos, el proveedor guardaria la cadena "Si" donde
   habia un `true`.

   De ahi que la traduccion viva aparte. En la ficha del comprador un `false`
   crudo se leia "Esteril  false", que es lo que escribiria un volcado de la
   base de datos, no una ficha de producto. */
export const toDisplayPairs = (attributes: unknown): AttributePair[] => {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    return [];
  }

  return Object.entries(attributes as Record<string, unknown>)
    .filter(
      ([, value]) =>
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
    )
    .map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value),
    }));
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

/* Las claves las teclea el proveedor en un campo libre y casi siempre sin
   tildes, porque es mas comodo y porque nunca penso que se fueran a publicar.
   Las que se repiten en este catalogo se escriben bien al pintarlas.

   Es una lista corta a proposito: solo lo que de verdad aparece. Lo que no
   este cae en el humanizador generico, que es lo que habia. */
const SPELLINGS: Record<string, string> = {
  esteril: 'Estéril',
  libredelatex: 'Libre de látex',
  volumen: 'Volumen',
  presentacion: 'Presentación',
  concentracion: 'Concentración',
  composicion: 'Composición',
  dimensiones: 'Dimensiones',
  capacidad: 'Capacidad',
  formafarmaceutica: 'Forma farmacéutica',
  viaadministracion: 'Vía de administración',
  unidadmedida: 'Unidad de medida',
  desechable: 'Desechable',
  reutilizable: 'Reutilizable',
  biodegradable: 'Biodegradable',
  entrepanos: 'Entrepaños',
};

export const humanizeAttributeKey = (key: string): string => {
  const conocida = SPELLINGS[key.toLowerCase().replace(/[\s_-]+/g, '')];
  if (conocida) return conocida;

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
