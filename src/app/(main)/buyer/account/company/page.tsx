import type { Metadata } from 'next';

import { BuyerCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Mi empresa',
  description: 'Datos de tu empresa y estado de tu solicitud en Suminia.',
};

export default function EmpresaPage() {
  return (
    <div className='dashboard-profile'>
      <BuyerCompanyScreen />
    </div>
  );
}
