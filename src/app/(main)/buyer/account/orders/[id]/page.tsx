import type { Metadata } from 'next';

import { OrderDetailScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pedido',
  description: 'Detalle de tu pedido.',
};

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className='dashboard-profile'>
      <OrderDetailScreen orderId={id} />
    </div>
  );
}
