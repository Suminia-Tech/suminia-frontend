import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import { MyProfileScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Mi perfil',
  description: 'Tus datos personales en Suminia.',
};

export default function PerfilPage() {
  return (
    <section className='section-b-space'>
      <Container>
        <div className='dashboard-profile'>
          <MyProfileScreen />
        </div>
      </Container>
    </section>
  );
}
