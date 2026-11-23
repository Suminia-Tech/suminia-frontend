import type { Metadata } from 'next';

import { StaffOrdersQueueScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Por facturar',
};

export default function Page() {
  return <StaffOrdersQueueScreen queue='toInvoice' />;
}
