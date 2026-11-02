import type { Metadata } from 'next';

import { StaffOrdersQueueScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pagos por verificar',
};

export default function Page() {
  return <StaffOrdersQueueScreen queue='payments' />;
}
