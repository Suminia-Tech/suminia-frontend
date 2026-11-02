import type { Metadata } from 'next';

import { DeliveryLocationPicker } from '@/modules/organizations';
import { QuoteDetailScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Detalle de la cotización',
};

/* La sede la pone organizations y la cotizacion orders: la pagina los junta,
   como en el checkout. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className='dashboard-profile'>
      <QuoteDetailScreen quoteId={id} LocationPicker={DeliveryLocationPicker} />
    </div>
  );
}
