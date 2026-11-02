import type { Metadata } from 'next';

import { SupplierPayoutsScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Liquidaciones',
};

export default function Page() {
  return (
    <div className='dashboard-profile'>
      <SupplierPayoutsScreen />
    </div>
  );
}
