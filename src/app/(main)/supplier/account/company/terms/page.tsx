import type { Metadata } from 'next';

import { SupplierCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Condiciones y pagos',
  description: 'Tus políticas comerciales y la cuenta donde recibes pagos.',
};

export default function CondicionesPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierCompanyScreen section='condiciones' />
    </div>
  );
}
