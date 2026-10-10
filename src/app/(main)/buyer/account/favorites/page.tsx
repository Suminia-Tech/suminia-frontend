import type { Metadata } from 'next';

import { FavoritesScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Favoritos',
  description: 'Los productos que guardaste en Suminia.',
};

export default function FavoritosPage() {
  return (
    <div className='dashboard-profile'>
      <FavoritesScreen />
    </div>
  );
}
