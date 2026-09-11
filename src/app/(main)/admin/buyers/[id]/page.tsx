import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
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

  return (
    <>
      <BreadCrumb parent={'Compradores'} title={'Detalle del comprador'} />
      <BuyerDetailScreen buyerId={id} />
    </>
  );
}
