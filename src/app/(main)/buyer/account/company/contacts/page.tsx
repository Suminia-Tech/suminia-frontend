import type { Metadata } from 'next';

import { BuyerCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Contactos',
  description: 'Las personas de contacto de tu organización.',
};

export default function ContactosPage() {
  return (
    <div className='dashboard-profile'>
      <BuyerCompanyScreen section='contacto' />
    </div>
  );
}
