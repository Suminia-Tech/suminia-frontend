import type { Metadata } from 'next';

import { MyOrdersScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Mis pedidos',
  description: 'Consulta tus pedidos y haz seguimiento a sus entregas.',
};

export default function PedidosPage() {
  return (
    <div className='dashboard-profile'>
      <MyOrdersScreen />
    </div>
  );
}
