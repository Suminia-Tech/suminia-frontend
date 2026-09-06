/* Unidades sugeridas para el contenido de un formato.

   Debe coincidir con la lista canonica del backend, que es quien normaliza al
   guardar: aqui solo se ofrecen como sugerencia para que el proveedor no tenga
   que inventarse la forma de escribirlas.

   Las mayusculas no son un capricho: en el SI el litro es "L" y el gramo es
   "g". Escribir "l" o "G" da una unidad distinta. */
export const CONTENT_UNITS = [
  'unidad',
  'par',
  'prueba',
  'kit',
  'mL',
  'L',
  'mg',
  'g',
  'kg',
  'cm',
  'm',
];
