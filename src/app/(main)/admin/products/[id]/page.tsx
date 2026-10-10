import type { Metadata } from 'next';

import { ProductReviewScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Revisar producto',
  description: 'Datos, presentaciones y documentos de un producto enviado a revisión.',
};

export default async function RevisarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductReviewScreen productId={id} />;
}
