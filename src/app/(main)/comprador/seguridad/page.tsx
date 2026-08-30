import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import { SecurityScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Seguridad',
  description: 'Cambia tu contraseña y revisa el acceso a tu cuenta.',
};

export default function SeguridadPage() {
  return (
    <section className='section-b-space'>
      <Container>
        <div className='dashboard-profile'>
          <SecurityScreen />
        </div>
      </Container>
    </section>
  );
}
