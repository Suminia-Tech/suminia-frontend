import type { Metadata } from 'next';

import { SecurityScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Seguridad',
  description: 'Cambia tu contraseña y revisa el acceso a tu cuenta.',
};

export default function SeguridadPage() {
  return (
    <div className='dashboard-profile'>
      <SecurityScreen />
    </div>
  );
}
