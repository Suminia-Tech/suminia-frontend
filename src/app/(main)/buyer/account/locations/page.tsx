import type { Metadata } from 'next';

import { DeliveryLocationsScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Sedes de entrega',
  description: 'A dónde llegan tus pedidos.',
};

export default function SedesPage() {
  return (
    <div className='dashboard-profile'>
      <DeliveryLocationsScreen />
    </div>
  );
}
