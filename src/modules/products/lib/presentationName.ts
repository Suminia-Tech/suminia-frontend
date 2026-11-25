import { normalizeUnit } from './units';

/* Compone el nombre de un formato a partir de lo que ya se declara.

   Refleja la misma regla que aplica el backend, que es quien manda: aqui existe
   solo para enseñar la vista previa mientras se escribe. Si las dos se separan,
   la que vale es la del backend — y el formulario se limita a mostrar lo que se
   va a guardar.

   Se duplica a proposito y no se pide al servidor en cada tecla: una peticion
   por pulsacion para pintar una etiqueta no se sostiene. */

interface NameParts {
  packaging: string;
  contentQuantity: string;
  contentUnit: string;
  variant?: string;
}

/* Como se escribe el contenido: "Caja x 10", "Caja x 50 pares", "Frasco x
   500 mL". La unidad suelta no se nombra —"Caja x 10" ya dice diez unidades,
   y es como lo escribe el sector—; las demas palabras van en plural cuando
   son varias, y los simbolos del SI no cambian. */
const PLURALES: Record<string, string> = {
  par: 'pares',
  prueba: 'pruebas',
  kit: 'kits',
  juego: 'juegos',
};

const unidadDelContenido = (unidad: string, cantidad: number): string => {
  if (unidad.toLowerCase() === 'unidad') return '';
  return ` ${cantidad === 1 ? unidad : (PLURALES[unidad] ?? unidad)}`;
};

export const composePresentationName = ({
  packaging,
  contentQuantity,
  contentUnit,
  variant,
}: NameParts): string => {
  const empaque = packaging.trim();
  const cantidad = contentQuantity.trim();
  const unidad = normalizeUnit(contentUnit);
  const calificador = variant?.trim();

  if (!empaque) return '';

  /* Un formato de una sola pieza no gana nada llamandose "Unidad × 1 unidad". */
  const esPiezaSuelta =
    Number(cantidad) === 1 && empaque.toLowerCase() === unidad.toLowerCase();

  const base =
    esPiezaSuelta || !cantidad || !unidad
      ? empaque
      : `${empaque} x ${cantidad}${unidadDelContenido(unidad, Number(cantidad))}`;

  return calificador ? `${calificador} · ${base}` : base;
};

/* Como lo vera el comprador: el producto y, tras una coma, su presentacion
   —"Catéter intravenoso, caja x 50"—. La vista previa enseñaba solo la
   presentacion ("Paquete") y parecia que el producto se iba a llamar asi. */
export const composeDisplayName = (productName: string, presentation: string): string => {
  const producto = productName.trim();
  const formato = presentation.trim();
  if (!producto) return formato;
  if (!formato) return producto;
  return `${producto}, ${formato.charAt(0).toLocaleLowerCase('es')}${formato.slice(1)}`;
};

/* La cantidad con su unidad, para leerla suelta: "100 unidades", "1 par",
   "500 mL". A diferencia del nombre, aqui "unidad" si se escribe. */
export const cantidadConUnidad = (cantidad: string, unidad: string): string => {
  const numero = cantidad.trim();
  const medida = normalizeUnit(unidad);
  if (!numero) return '';
  if (!medida) return numero;
  const varias = Number(numero) !== 1;
  const palabra =
    medida === 'unidad' ? (varias ? 'unidades' : 'unidad') : varias ? (PLURALES[medida] ?? medida) : medida;
  return `${numero} ${palabra}`;
};
