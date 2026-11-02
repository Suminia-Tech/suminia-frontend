import type { Metadata } from 'next';

import { PayoutDetailScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Detalle de la liquidación',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className='dashboard-profile'>
      <PayoutDetailScreen payoutId={id} side='supplier' />
    </div>
  );
}
