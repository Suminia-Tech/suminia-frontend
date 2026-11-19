import type { Metadata } from 'next';

import { CategoriesScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Categorías de los productos de Suminia.',
};

export default function AdminCategoriesPage() {
  return <CategoriesScreen />;
}
