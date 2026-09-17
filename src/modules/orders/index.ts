/* API publica del modulo. Nada fuera de modules/orders debe importar rutas
   internas (../api, ../ui): solo lo que se exporta aqui. */

export { CheckoutScreen } from './ui/CheckoutScreen';

export { MyOrdersScreen } from './ui/buyer/MyOrdersScreen';
export { BuyerOrderDetailScreen } from './ui/buyer/OrderDetailScreen';

export { SupplierOrdersScreen } from './ui/supplier/SupplierOrdersScreen';
export { SupplierOrderDetailScreen } from './ui/supplier/SupplierOrderDetailScreen';

export { useGetOrdersQuery } from './api/ordersApi';

export type { Order, OrderItem, OrderStatus } from './model/order.types';
