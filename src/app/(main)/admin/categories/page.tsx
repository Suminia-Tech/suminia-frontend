import type { Metadata } from 'next';

import { CategoriesScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Categorías del catálogo de Suminia.',
};

export default function AdminCategoriesPage() {
  return <CategoriesScreen />;
}
