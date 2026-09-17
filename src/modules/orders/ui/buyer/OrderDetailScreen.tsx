'use client';

import OrderDetailScreen from '../common/OrderDetailScreen';

export const BuyerOrderDetailScreen = ({ orderId }: { orderId: string }) => (
  <OrderDetailScreen orderId={orderId} side='buyer' />
);

export default BuyerOrderDetailScreen;
