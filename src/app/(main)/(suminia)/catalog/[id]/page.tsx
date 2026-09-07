import type { Metadata } from 'next';

import { PublicProductScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Producto',
};

/* En Next 16 los params de una ruta dinamica llegan como promesa. */
export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicProductScreen productId={id} />;
}
