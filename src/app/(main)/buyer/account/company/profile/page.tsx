import type { Metadata } from 'next';

import { BuyerCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Perfil y medio de pago',
  description: 'La naturaleza de tu organización y tu medio de pago.',
};

export default function PerfilPage() {
  return (
    <div className='dashboard-profile'>
      <BuyerCompanyScreen section='perfil' />
    </div>
  );
}
