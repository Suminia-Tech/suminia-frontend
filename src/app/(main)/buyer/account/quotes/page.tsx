import type { Metadata } from 'next';

import { QuotesScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Cotizaciones',
};

export default function Page() {
  return (
    <div className='dashboard-profile'>
      <QuotesScreen />
    </div>
  );
}
