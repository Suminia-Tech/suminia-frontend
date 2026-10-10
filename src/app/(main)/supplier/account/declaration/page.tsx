import type { Metadata } from 'next';

import { SupplierDeclarationScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Declaración de autocontrol',
  description: 'Declaración de autocontrol y gestión de riesgos LA/FT/FP y C/ST.',
};

export default function DeclaracionPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierDeclarationScreen />
    </div>
  );
}
