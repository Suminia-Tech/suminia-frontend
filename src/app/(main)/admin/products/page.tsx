import type { Metadata } from 'next';

import { ProductReviewQueueScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Revisión de productos',
  description: 'Productos que los proveedores enviaron a revisión de dirección técnica.',
};

export default function RevisionProductosPage() {
  return <ProductReviewQueueScreen />;
}
