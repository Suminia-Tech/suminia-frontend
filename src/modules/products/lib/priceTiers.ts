import type { PriceTier } from '../model/product.types';

/* Precio por volumen.

   Estas comprobaciones son un espejo de las del backend, que es quien manda:
   estan aqui para que el proveedor vea el error mientras escribe la escala y no
   despues de intentar guardarla. Si las dos discrepan, la del backend gana.

   Cada escalon dice "a partir de esta cantidad, este precio". Por debajo del
   primero rige el precio base del formato. */

export const MAX_PRICE_TIERS = 6;

export const sortTiers = (tiers: PriceTier[]): PriceTier[] =>
  [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

/* El precio que corresponde a una cantidad: el escalon mas alto que alcanza, y
   el precio base si no alcanza ninguno. */
export const priceForQuantity = (
  quantity: number,
  basePrice: number,
  tiers: PriceTier[],
): number => {
  const alcanzados = sortTiers(tiers).filter(
    (tier) => quantity >= tier.minQuantity,
  );

  return alcanzados.length > 0
    ? alcanzados[alcanzados.length - 1].price
    : basePrice;
};

/* El precio mas bajo alcanzable. Es el que se enseña como "desde": mostrar el
   base cuando hay descuento por volumen haria parecer cara una oferta que no lo
   es. */
export const lowestPrice = (basePrice: number, tiers: PriceTier[]): number =>
  tiers.reduce((min, tier) => Math.min(min, tier.price), basePrice);

/* Devuelve el mensaje del primer problema, o null si la escala es coherente.
   Se para en el primero a proposito: encadenar errores de una escala mal
   ordenada produce ruido y ninguno ayuda mas que el primero. */
export const validateTiers = (
  tiers: PriceTier[],
  basePrice: number,
  minOrderQuantity: number,
): string | null => {
  if (tiers.length === 0) return null;

  if (tiers.length > MAX_PRICE_TIERS) {
    return `Se admiten hasta ${MAX_PRICE_TIERS} escalones`;
  }

  const ordenados = sortTiers(tiers);

  for (const [index, tier] of ordenados.entries()) {
    if (!Number.isInteger(tier.minQuantity) || tier.minQuantity < 2) {
      return 'Cada escalón empieza en una cantidad entera de 2 en adelante';
    }

    if (!(tier.price > 0)) {
      return 'El precio de un escalón tiene que ser mayor que cero';
    }

    const anterior = ordenados[index - 1];

    if (anterior && anterior.minQuantity === tier.minQuantity) {
      return `Hay dos escalones que empiezan en ${tier.minQuantity}`;
    }

    /* Un escalon que no baja el precio no es un escalon: casi siempre son dos
       cifras intercambiadas, y publicado significa cobrarle más a quien compra
       más. */
    const precioPrevio = anterior ? anterior.price : basePrice;
    if (tier.price >= precioPrevio) {
      return `Desde ${tier.minQuantity} el precio debería bajar de ${precioPrevio.toLocaleString('es-CO')}`;
    }
  }

  /* Por debajo del primer escalon rige el precio base. Si el primero arranca en
     el minimo o antes, ese precio base no se cobra nunca. */
  if (ordenados[0].minQuantity <= minOrderQuantity) {
    return `El primer escalón debe empezar por encima del pedido mínimo (${minOrderQuantity})`;
  }

  return null;
};

/* La cantidad minima y el multiplo tienen que encajar: con minimo 10 y multiplo
   4, lo pedible salta de 8 a 12 y el propio minimo no se puede pedir. */
export const validateOrderQuantities = (
  minOrderQuantity: number,
  orderMultiple: number,
): string | null => {
  if (!Number.isInteger(minOrderQuantity) || minOrderQuantity < 1) {
    return 'El pedido mínimo debe ser un entero de 1 en adelante';
  }

  if (!Number.isInteger(orderMultiple) || orderMultiple < 1) {
    return 'El múltiplo debe ser un entero de 1 en adelante';
  }

  if (minOrderQuantity % orderMultiple !== 0) {
    const sugerido = Math.ceil(minOrderQuantity / orderMultiple) * orderMultiple;
    return `Con múltiplo ${orderMultiple}, el mínimo debe ser múltiplo suyo: ${sugerido} sería el más cercano`;
  }

  return null;
};
