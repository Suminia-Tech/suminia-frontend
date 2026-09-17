import type { Metadata } from 'next';

import { MyOrdersScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Mis pedidos',
  description: 'Lo que has pedido en Suminia y en qué punto está.',
};

export default function PedidosPage() {
  return (
    <div className='dashboard-profile'>
      <MyOrdersScreen />
    </div>
  );
}
