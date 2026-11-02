import type { Metadata } from 'next';

import { StaffOrdersQueueScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Facturas pendientes',
};

export default function Page() {
  return <StaffOrdersQueueScreen queue='invoices' />;
}
