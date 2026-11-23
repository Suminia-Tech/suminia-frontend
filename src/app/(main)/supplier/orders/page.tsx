import type { Metadata } from 'next';

import { SupplierOrdersScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Órdenes de compra',
  description: 'Las órdenes de compra que te ha emitido Suminia.',
};

export default function PedidosPage() {
  return (
    <div className='dashboard-profile'>
      <SupplierOrdersScreen />
    </div>
  );
}
