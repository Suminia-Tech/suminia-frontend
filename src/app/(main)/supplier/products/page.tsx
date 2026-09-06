import type { Metadata } from 'next';

import { MyProductsScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Mis productos',
  description: 'Administra el catálogo que tu empresa publica en Suminia.',
};

/* Ancho completo, sin barra lateral: la tabla lleva miniaturas, formatos,
   precio e inventario y en una columna de nueve se quedaba estrecha. */
export default function ProductosPage() {
  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <div className='table-dashboard dashboard'>
          <MyProductsScreen />
        </div>
      </div>
    </section>
  );
}
