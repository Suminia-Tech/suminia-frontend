import type { Metadata } from 'next';

import { StaffOrdersScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Todos los pedidos de la plataforma y lo que deja cada uno.',
};

export default function PedidosPage() {
  return <StaffOrdersScreen />;
}
