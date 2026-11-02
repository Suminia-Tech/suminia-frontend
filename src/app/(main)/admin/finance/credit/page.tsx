import type { Metadata } from 'next';

import { CreditPortfolioScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Crédito',
};

export default function Page() {
  return <CreditPortfolioScreen />;
}
