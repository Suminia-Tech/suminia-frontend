import type { Metadata } from 'next';

import { SupplierOrdersScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Los pedidos que te han hecho en Suminia.',
};

export default function PedidosPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierOrdersScreen />
    </div>
  );
}
