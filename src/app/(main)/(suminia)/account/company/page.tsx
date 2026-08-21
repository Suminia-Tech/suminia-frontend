import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { MyCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Mi empresa',
  description: 'Datos de tu empresa y estado de aprobación en Suminia.',
};

/* Acceso directo por URL a la misma pantalla que sirve la pestana "Mi empresa"
   del panel de cuenta. La pantalla no trae contenedor propio, de modo que aqui
   se le pone el de pagina y en la pestana hereda el del panel. */
export default function MyCompanyPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Mi cuenta'} title={'Mi empresa'} />
      <section className='section-b-space'>
        <Container>
          <div className='dashboard-profile'>
            <MyCompanyScreen />
          </div>
        </Container>
      </section>
    </Layout6>
  );
}
