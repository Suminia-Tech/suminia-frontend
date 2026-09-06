import type { Product, ProductStatus } from '../model/product.types';

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Publicado',
  INACTIVE: 'Retirado',
};

/* Tono de cada estado. Se guarda el nombre del tono y no la clase completa para
   que la hoja de estilos decida como se ve: los badge de Bootstrap son bloques
   de color saturado y aqui hace falta algo mas discreto, que no compita con el
   nombre del producto. */
export const PRODUCT_STATUS_TONE: Record<ProductStatus, string> = {
  DRAFT: 'neutral',
  ACTIVE: 'success',
  INACTIVE: 'muted',
};

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
export const formatPriceRange = (product: Product): string => {
  const prices = product.presentations.map((presentation) => presentation.price);
  if (prices.length === 0) return 'Sin precio';

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currency = product.presentations[0].currency;

  return min === max
    ? formatPrice(min, currency)
    : `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
};

/* Suma del inventario de todos los formatos. Es lo que responde "¿tengo algo
   que vender?", que en una lista importa mas que el detalle por formato. */
export const getTotalStock = (product: Product): number =>
  product.presentations.reduce((total, presentation) => total + presentation.stock, 0);
