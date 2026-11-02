import type { Metadata } from 'next';

import { FinanceSummaryScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Resumen financiero',
};

export default function Page() {
  return <FinanceSummaryScreen />;
}
