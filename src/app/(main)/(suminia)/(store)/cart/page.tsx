import type { Metadata } from 'next';

import { CartScreen } from '@/modules/cart';
import { Breadcrumbs } from '@/shared/ui';

export const metadata: Metadata = {
  title: 'Mi carrito',
  description: 'Lo que vas a pedir, agrupado por proveedor.',
};

export default function CarritoPage() {
  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <Breadcrumbs
          steps={[
            { label: 'Inicio', href: '/' },
            { label: 'Catálogo', href: '/catalog' },
            { label: 'Mi carrito' },
          ]}
        />

        <div className='box-head'>
          <h3>Mi carrito</h3>
        </div>
        <CartScreen />
      </div>
    </section>
  );
}
