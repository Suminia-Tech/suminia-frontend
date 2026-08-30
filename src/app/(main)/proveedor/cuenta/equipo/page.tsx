import type { Metadata } from 'next';

import { MyTeamScreen } from '@/modules/users';

export const metadata: Metadata = {
  title: 'Mi equipo',
  description: 'Personas de tu empresa con acceso a Suminia.',
};

export default function EquipoPage() {
  return (
    <div className='table-dashboard dashboard'>
      <MyTeamScreen />
    </div>
  );
}
