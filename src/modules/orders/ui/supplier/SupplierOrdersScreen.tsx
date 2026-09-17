'use client';

import OrdersListScreen from '../common/OrdersListScreen';

/* Los pedidos que le entran al proveedor. Misma pantalla que la del comprador:
   la lista es la misma y lo que cambia entra por el lado. */
export const SupplierOrdersScreen = () => <OrdersListScreen side='supplier' />;

export default SupplierOrdersScreen;
