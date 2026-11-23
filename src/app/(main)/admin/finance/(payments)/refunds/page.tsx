import type { Metadata } from 'next';

import { StaffOrdersQueueScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Devoluciones',
};

export default function Page() {
  return <StaffOrdersQueueScreen queue='refunds' />;
}
