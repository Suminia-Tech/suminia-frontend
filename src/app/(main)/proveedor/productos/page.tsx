import type { Metadata } from 'next';

import { MyProductsScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Mis productos',
  description: 'Administra el catálogo que tu empresa publica en Suminia.',
};

export default function ProductosPage() {
  return <MyProductsScreen />;
}
