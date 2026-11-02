import type { Metadata } from 'next';

import { SupplierCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Documentos',
  description: 'Los documentos legales de tu empresa.',
};

export default function DocumentosPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierCompanyScreen section='documentos' />
    </div>
  );
}
