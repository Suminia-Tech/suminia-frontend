import type { Metadata } from 'next';

import { BuyerDetailScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Detalle del comprador',
  description: 'Datos y estado de aprobación de una empresa compradora.',
};

export default async function CompradorDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BuyerDetailScreen buyerId={id} />;
}
