/* Las mismas reglas de compra que valida el backend, repetidas aqui a
   proposito.

   No es duplicar por duplicar: el servidor es quien decide —y quien rechaza un
   pedido imposible—, pero esperar a su respuesta para enterarse de que el
   proveedor despacha de 5 en 5 convierte cada intento en un viaje de ida y
   vuelta. Aqui los botones solo ofrecen cantidades que existen, y el error deja
   de ocurrir en vez de explicarse. */

export interface PurchaseRules {
  minOrderQuantity: number;
  orderMultiple: number;
  stock: number;
}

/* El multiplo se cuenta desde cero y no desde el minimo: quien empaca de 5 en 5
   con minimo 10 despacha 10, 15 o 20, nunca 12. */
const alMultiplo = (cantidad: number, multiplo: number): number =>
  Math.ceil(cantidad / multiplo) * multiplo;

/** La cantidad con la que arranca el selector: el primer pedido posible. */
export const initialQuantity = (rules: PurchaseRules): number =>
  alMultiplo(Math.max(rules.minOrderQuantity, 1), rules.orderMultiple);

/** El siguiente escalon hacia arriba, sin pasarse de existencias. */
export const stepUp = (quantity: number, rules: PurchaseRules): number => {
  const siguiente = quantity + rules.orderMultiple;
  return siguiente > rules.stock ? quantity : siguiente;
};

/** El anterior, sin bajar del pedido minimo. */
export const stepDown = (quantity: number, rules: PurchaseRules): number => {
  const anterior = quantity - rules.orderMultiple;
  return anterior < initialQuantity(rules) ? quantity : anterior;
};

/** Lo que hay que decirle a quien escribio una cantidad a mano, o null. */
export const quantityError = (
  quantity: number,
  rules: PurchaseRules,
): string | null => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return 'Escribe una cantidad';
  }

  if (quantity < rules.minOrderQuantity) {
    return `El pedido mínimo es ${rules.minOrderQuantity}`;
  }

  if (quantity % rules.orderMultiple !== 0) {
    return `Se pide de ${rules.orderMultiple} en ${rules.orderMultiple}`;
  }

  if (quantity > rules.stock) {
    return `Solo quedan ${rules.stock}`;
  }

  return null;
};

export interface PriceTier {
  minQuantity: number;
  price: number;
}

/* El precio que corresponde a una cantidad, igual que lo resuelve el backend.

   Se repite por lo mismo que las reglas: para poder enseñar lo que va a costar
   mientras se elige la cantidad, sin pedirselo al servidor en cada pulsacion.
   El que se cobra es siempre el suyo. */
export const resolveUnitPrice = (
  basePrice: number,
  tiers: PriceTier[],
  quantity: number,
): number => {
  const alcanzado = [...tiers]
    .filter((tier) => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

  return alcanzado ? alcanzado.price : basePrice;
};

/* El siguiente escalon por alcanzar, para poder decir cuanto falta para que
   baje el precio. Null si ya se llego al ultimo. */
export const nextTier = (
  tiers: PriceTier[],
  quantity: number,
): PriceTier | null =>
  [...tiers]
    .filter((tier) => quantity < tier.minQuantity)
    .sort((a, b) => a.minQuantity - b.minQuantity)[0] ?? null;
