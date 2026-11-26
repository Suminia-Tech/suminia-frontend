import type { Metadata } from 'next';
import { Suspense } from 'react';

import { QuickAddToCart } from '@/modules/cart';
import { PublicCatalogScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Productos',
  description:
    'Medicamentos e insumos médicos de proveedores verificados en Colombia. Consulta composición, registro INVIMA y presentaciones.',
};

/* La pantalla lee la busqueda y la categoria de la URL, y useSearchParams sin
   Suspense obliga a Next a renderizar toda la ruta de forma dinamica. */
export default function PublicCatalogPage() {
  return (
    <Suspense fallback={null}>
      <PublicCatalogScreen CardAction={QuickAddToCart} />
    </Suspense>
  );
}
