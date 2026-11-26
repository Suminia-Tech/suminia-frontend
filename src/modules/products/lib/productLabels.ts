import type { Product, ProductPresentation, ProductStatus } from '../model/product.types';
import { normalizeUnit } from './units';

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  DRAFT: 'Borrador',
  PENDING_REVIEW: 'En revisión',
  ACTIVE: 'Publicado',
  /* "Requiere correcciones" y no "Devuelto": dice que hay que hacer. */
  REJECTED: 'Requiere correcciones',
  /* El proveedor dejo de venderlo: sale de la tienda y conserva su historial.
     Antes se llamaba "Retirado" y se confundia con suspender. */
  INACTIVE: 'Suspendido',
};

/* Tono de cada estado. Se guarda el nombre del tono y no la clase completa para
   que la hoja de estilos decida como se ve: los badge de Bootstrap son bloques
   de color saturado y aqui hace falta algo mas discreto, que no compita con el
   nombre del producto. */
export const PRODUCT_STATUS_TONE: Record<ProductStatus, string> = {
  DRAFT: 'muted',
  PENDING_REVIEW: 'neutral',
  ACTIVE: 'success',
  REJECTED: 'danger',
  INACTIVE: 'muted',
};

/* Desde donde se puede enviar a revision. Debe coincidir con SUBMITTABLE del
   backend, que es quien lo hace cumplir. */
export const canSubmitForReview = (status: ProductStatus): boolean =>
  status === 'DRAFT' || status === 'REJECTED' || status === 'INACTIVE';

/* Sin decimales: los precios del catalogo van en pesos colombianos, donde el
   centavo no existe en la practica y "$ 52.500" se lee mejor que "$ 52.500,00". */
const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number, currency = 'COP'): string =>
  currency === 'COP'
    ? copFormatter.format(value)
    : new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);

export const getPrimaryImage = (product: Product) =>
  product.images.find((image) => image.isPrimary) ?? product.images[0] ?? null;

/* Rango de precios entre formatos. Un producto con varias presentaciones no
   tiene "un" precio, y mostrar solo el del formato por defecto esconde que la
   caja x100 sale mucho mas barata por unidad. */
export const formatPriceRange = (product: Product): string | null => {
  /* Null cuando no llegaron: quien no esta autorizado no recibe ninguno, de
     modo que no hay rango que componer. Se devuelve null en vez de un texto
     para que la pantalla decida como pintar el hueco. */
  const prices = product.presentations
    .map((presentation) => presentation.price)
    .filter((price): price is number => price !== null);

  if (prices.length === 0) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currency = product.presentations[0].currency;

  return min === max
    ? formatPrice(min, currency)
    : `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
};

/* La unidad de venta a la que corresponde el precio, en minuscula: "kit",
   "caja". Nula si las presentaciones se venden en empaques distintos, porque
   entonces no hay una sola que decir. */
export const saleUnitOf = (product: Product): string | null => {
  const empaques = [
    ...new Set(
      product.presentations
        .map((presentation) => presentation.packaging.trim().toLocaleLowerCase('es'))
        .filter(Boolean),
    ),
  ];
  return empaques.length === 1 ? empaques[0] : null;
};

/* Suma del inventario de todos los formatos. Es lo que responde "¿tengo algo
   que vender?", que en una lista importa mas que el detalle por formato. */
export const getTotalStock = (product: Product): number =>
  product.presentations.reduce((total, presentation) => total + presentation.stock, 0);

/* La presentacion que representa al producto en una tarjeta: la marcada como
   principal, o si no la mas barata. Su precio es el que ve el comprador
   primero, y no un rango que mezcla una caja de 10 con una de 100. */
export const featuredPresentation = (product: Product): ProductPresentation | null =>
  product.presentations.find((p) => p.isDefault && p.price !== null) ??
  [...product.presentations]
    .filter((p) => p.price !== null)
    .sort((a, b) => (a.price as number) - (b.price as number))[0] ??
  product.presentations[0] ??
  null;

/* El precio por unidad de medida, para leerlo bajo el precio de venta:
   "$320 por tableta". Nulo si la presentacion trae una sola unidad o no hay
   precio. Es como se comparan los medicamentos. */
export const unitPriceText = (
  price: number | null,
  contentQuantity: number | null,
  contentUnit: string | null,
  currency = 'COP',
): string | null => {
  const unidad = contentUnit ? normalizeUnit(contentUnit) : '';
  if (price === null || !contentQuantity || contentQuantity <= 1 || !unidad) return null;
  return `${formatPrice(price / contentQuantity, currency)} por ${unidad}`;
};

/* "Venta por caja": a que corresponde el precio principal. */
export const saleUnitText = (presentation: ProductPresentation): string | null => {
  const empaque = presentation.packaging.trim().toLocaleLowerCase('es');
  return empaque ? `Venta por ${empaque}` : null;
};
