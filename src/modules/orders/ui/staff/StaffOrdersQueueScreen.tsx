'use client';

import OrdersListScreen, { type OrdersQueue } from '../common/OrdersListScreen';

/* Una bandeja del dinero: pagos por verificar, devoluciones, facturas
   pendientes, pagos vencidos. La misma lista de pedidos con un filtro fijo. */
export const StaffOrdersQueueScreen = ({ queue }: { queue: OrdersQueue }) => (
  <OrdersListScreen side='staff' queue={queue} />
);

export default StaffOrdersQueueScreen;
