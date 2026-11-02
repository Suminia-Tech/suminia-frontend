import type { Metadata } from 'next';

import { PayoutsScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Liquidaciones',
};

export default function Page() {
  return <PayoutsScreen />;
}
