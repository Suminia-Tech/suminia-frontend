'use client';

import OrderDetailScreen from '../common/OrderDetailScreen';

/* Misma ficha que la del comprador: lo que se lee es lo mismo y lo que cambia
   —a quien se nombra, que se puede hacer, y que el proveedor si ve la
   comision— entra por el lado. */
export const SupplierOrderDetailScreen = ({ orderId }: { orderId: string }) => (
  <OrderDetailScreen orderId={orderId} side='supplier' />
);

export default SupplierOrderDetailScreen;
