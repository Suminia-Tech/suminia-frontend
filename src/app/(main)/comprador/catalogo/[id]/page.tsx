import type { Metadata } from 'next';

import { ProductDetailScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Producto',
  description: 'Formatos, precios y disponibilidad de un producto del catálogo.',
};

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductDetailScreen productId={id} />;
}
