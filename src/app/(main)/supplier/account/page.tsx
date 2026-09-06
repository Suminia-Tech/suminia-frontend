import type { Metadata } from 'next';

import { SupplierSummaryScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Resumen de tu empresa y tu cuenta en Suminia.',
};

export default function CuentaPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierSummaryScreen />
    </div>
  );
}
