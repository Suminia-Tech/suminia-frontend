'use client';

import OrderDetailScreen from '../common/OrderDetailScreen';

/* La ficha de un pedido vista desde dentro de Suminia: la misma que ven el
   comprador y el proveedor, sin botones —el personal no mueve pedidos— y con
   la liquidacion, que es lo que le toca mirar. */
export const StaffOrderDetailScreen = ({ orderId }: { orderId: string }) => (
  <OrderDetailScreen orderId={orderId} side='staff' />
);

export default StaffOrderDetailScreen;
