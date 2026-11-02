import type { Metadata } from 'next';

import { BuyerCreditPanel } from '@/modules/finance';
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

  /* El credito es de finanzas y la ficha de organizations: la pagina las
     pone una debajo de la otra. */
  return (
    <>
      <BuyerDetailScreen buyerId={id} />
      <BuyerCreditPanel buyerId={id} />
    </>
  );
}
