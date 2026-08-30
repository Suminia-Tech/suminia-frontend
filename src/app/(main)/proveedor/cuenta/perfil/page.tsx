import type { Metadata } from 'next';

import { MyProfileScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Mi perfil',
  description: 'Tus datos personales en Suminia.',
};

export default function PerfilPage() {
  return (
    <div className='dashboard-profile'>
      <MyProfileScreen />
    </div>
  );
}
