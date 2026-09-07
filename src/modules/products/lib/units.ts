/* Unidades sugeridas para el contenido de un formato.

   Debe coincidir con la lista canonica del backend, que es quien normaliza al
   guardar: aqui solo se ofrecen como sugerencia para que el proveedor no tenga
   que inventarse la forma de escribirlas.

   Las mayusculas no son un capricho: en el SI el litro es "L" y el gramo es
   "g". Escribir "l" o "G" da una unidad distinta. */
/* Empaques que ya se usan en el catalogo, como sugerencia. Tampoco es una lista
   cerrada: un producto nuevo puede venir en un envase que no habiamos visto. */
export const PACKAGING_SUGGESTIONS = [
  'Unidad',
  'Caja',
  'Paquete',
  'Frasco',
  'Galón',
  'Rollo',
  'Kit',
  'Bolsa',
  'Ampolla',
  'Vial',
];

/* Se guarda el simbolo y se enseña el nombre.

   Las dos mitades de la lista no se pueden escribir igual: "unidad" y "par" son
   palabras, mientras que "mL" y "g" son simbolos del SI cuyas mayusculas son
   parte de la unidad —"l" no es litro y "G" no es gramo—. Puestos en crudo uno
   detras de otro, el desplegable parecia escrito sin criterio.

   Enseñando el nombre en el desplegable la lista se lee pareja, y el simbolo
   entre parentesis dice que es lo que se va a guardar. */
export interface ContentUnit {
  value: string;
  label: string;
}

export const CONTENT_UNITS: ContentUnit[] = [
  { value: 'unidad', label: 'Unidad' },
  { value: 'par', label: 'Par' },
  { value: 'prueba', label: 'Prueba' },
  { value: 'kit', label: 'Kit' },
  { value: 'mL', label: 'Mililitro (mL)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'mg', label: 'Miligramo (mg)' },
  { value: 'g', label: 'Gramo (g)' },
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'cm', label: 'Centímetro (cm)' },
  { value: 'm', label: 'Metro (m)' },
];

/* Misma normalizacion que hace el backend al guardar. Aqui solo sirve para que
   la vista previa del nombre enseñe lo que de verdad se va a almacenar. */
const ALIASES: Record<string, string> = {
  und: 'unidad',
  uds: 'unidad',
  u: 'unidad',
  unidades: 'unidad',
  ml: 'mL',
  litro: 'L',
  litros: 'L',
  gramo: 'g',
  gramos: 'g',
  pruebas: 'prueba',
  pares: 'par',
  metro: 'm',
  metros: 'm',
};

const BY_LOWERCASE = new Map(
  CONTENT_UNITS.map((unit) => [unit.value.toLowerCase(), unit.value]),
);

export const normalizeUnit = (unit: string): string => {
  const trimmed = unit.trim();
  if (!trimmed) return trimmed;

  const lower = trimmed.toLowerCase();
  return ALIASES[lower] ?? BY_LOWERCASE.get(lower) ?? trimmed;
};
