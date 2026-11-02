import type { Metadata } from 'next';

import { StaffOrdersQueueScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Pagos vencidos',
};

export default function Page() {
  return <StaffOrdersQueueScreen queue='overdue' />;
}
