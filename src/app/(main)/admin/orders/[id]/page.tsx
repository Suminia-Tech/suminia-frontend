import type { Metadata } from 'next';

import { StaffOrderDetailScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Detalle del pedido',
  description: 'Qué se pidió, a quién y cómo se liquida.',
};

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StaffOrderDetailScreen orderId={id} />;
}
