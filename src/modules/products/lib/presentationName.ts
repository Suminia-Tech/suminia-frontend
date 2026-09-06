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
      : `${empaque} × ${cantidad} ${unidad}`;

  return calificador ? `${calificador} · ${base}` : base;
};
