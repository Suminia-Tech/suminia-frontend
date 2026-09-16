import type { Metadata } from 'next';
import { Suspense } from 'react';

import { PublicCatalogScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Medicamentos e insumos médicos de proveedores verificados en Colombia. Consulta composición, registro INVIMA y formatos de venta.',
};

/* La pantalla lee la busqueda y la categoria de la URL, y useSearchParams sin
   Suspense obliga a Next a renderizar toda la ruta de forma dinamica. */
export default function PublicCatalogPage() {
  return (
    <Suspense fallback={null}>
      <PublicCatalogScreen />
    </Suspense>
  );
}
