import type { Metadata } from 'next';

import { PublicCatalogScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Medicamentos e insumos médicos de proveedores verificados en Colombia. Consulta composición, registro INVIMA y formatos de venta.',
};

export default function PublicCatalogPage() {
  return <PublicCatalogScreen />;
}
