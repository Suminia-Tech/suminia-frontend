import type { Metadata } from 'next';

import { SupplierOrderDetailScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pedido',
  description: 'Detalle de un pedido que te hicieron.',
};

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className='dashboard-profile'>
      <SupplierOrderDetailScreen orderId={id} />
    </div>
  );
}
