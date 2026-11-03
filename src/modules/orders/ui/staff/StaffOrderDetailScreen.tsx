'use client';

import type { ComponentType } from 'react';

import OrderDetailScreen, { type OrderPayoutPanelProps } from '../common/OrderDetailScreen';

/* La ficha de un pedido vista desde dentro de Suminia: la misma que ven el
   comprador y el proveedor, sin botones —el personal no mueve pedidos— y con
   la liquidacion, que es lo que le toca mirar. */
export const StaffOrderDetailScreen = ({
  orderId,
  PayoutPanel,
}: {
  orderId: string;
  PayoutPanel?: ComponentType<OrderPayoutPanelProps>;
}) => <OrderDetailScreen orderId={orderId} side='staff' PayoutPanel={PayoutPanel} />;

export default StaffOrderDetailScreen;
