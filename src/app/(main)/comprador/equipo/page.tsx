import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import { MyTeamScreen } from '@/modules/users';

export const metadata: Metadata = {
  title: 'Mi equipo',
  description: 'Personas de tu empresa con acceso a Suminia.',
};

export default function EquipoPage() {
  return (
    <section className='section-b-space'>
      <Container>
        <div className='table-dashboard dashboard'>
          <MyTeamScreen />
        </div>
      </Container>
    </section>
  );
}
