import type { Metadata } from 'next';

import { BuyBox } from '@/modules/cart';
import { PublicProductScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Producto',
};

/* La pagina es quien junta los dos modulos: products pinta la ficha y cart pone
   la compra. Ninguno de los dos se importa al otro —la regla de frontera no lo
   permite— y aqui, que los ve a los dos, no hace falta. */
export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicProductScreen productId={id} BuyBox={BuyBox} />;
}
