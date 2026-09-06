import type { Metadata } from 'next';

import { MyCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Mi empresa',
  description: 'Datos de tu empresa y estado de aprobación en Suminia.',
};

export default function EmpresaPage() {
  return (
    <div className='dashboard-profile'>
      <MyCompanyScreen />
    </div>
  );
}
