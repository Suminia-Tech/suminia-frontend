import type { Metadata } from 'next';

import { SupplierCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Contactos',
  description: 'Las personas de contacto de tu empresa.',
};

export default function ContactosPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierCompanyScreen section='contacto' />
    </div>
  );
}
