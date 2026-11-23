import type { Metadata } from 'next';

import { SupplierOrderDetailScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Orden de compra',
  description: 'Detalle de una orden de compra que te emitió Suminia.',
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
