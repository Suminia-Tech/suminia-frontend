/* API publica del modulo. Nada fuera de modules/orders debe importar rutas
   internas (../api, ../ui): solo lo que se exporta aqui. */

export { CheckoutScreen } from './ui/CheckoutScreen';

export { MyOrdersScreen } from './ui/buyer/MyOrdersScreen';
export { BuyerOrderDetailScreen } from './ui/buyer/OrderDetailScreen';

export { SupplierOrdersScreen } from './ui/supplier/SupplierOrdersScreen';
export { SupplierOrderDetailScreen } from './ui/supplier/SupplierOrderDetailScreen';

/* El personal de Suminia los ve todos: no opera, liquida. */
export { StaffOrdersScreen } from './ui/staff/StaffOrdersScreen';
export { StaffOrderDetailScreen } from './ui/staff/StaffOrderDetailScreen';
/* Las bandejas del dinero: pagos por verificar, devoluciones, facturas. */
export { StaffOrdersQueueScreen } from './ui/staff/StaffOrdersQueueScreen';

/* La cotizacion formal: sale del carrito y se convierte en pedido. */
export { CreateQuoteButton } from './ui/buyer/CreateQuoteButton';
export { QuotesScreen } from './ui/buyer/QuotesScreen';
export { QuoteDetailScreen } from './ui/buyer/QuoteDetailScreen';

export { useGetBillingQuery, useGetOrdersQuery } from './api/ordersApi';

export type { MonthlyBilling, Order, OrderItem, OrderStatus } from './model/order.types';
