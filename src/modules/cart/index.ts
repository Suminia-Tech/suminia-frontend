/* API publica del modulo. Nada fuera de modules/cart debe importar rutas
   internas (../api, ../ui): solo lo que se exporta aqui. */

export { CartScreen } from './ui/CartScreen';
export { CartSummary } from './ui/CartSummary';
export { CartWidget } from './ui/CartWidget';
export { BuyBox } from './ui/BuyBox';
export type { BuyableFormat } from './ui/BuyBox';

export { useGetCartQuery } from './api/cartApi';
export { useCanBuy } from './hooks/useCanBuy';

export type { Cart, CartItem, CartSupplierGroup } from './model/cart.types';
