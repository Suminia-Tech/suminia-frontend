import type { Metadata } from 'next';

import { CatalogScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Medicamentos e insumos médicos de proveedores verificados.',
};

export default function CatalogoPage() {
  return <CatalogScreen />;
}
