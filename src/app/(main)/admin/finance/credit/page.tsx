import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { CreditPortfolioScreen } from '@/modules/finance';
import { CREDIT_AVAILABLE } from '@/shared/config/features';

export const metadata: Metadata = {
  title: 'Crédito',
};

export default function Page() {
  /* El credito a compradores llega a mediados de 2027. */
  if (!CREDIT_AVAILABLE) notFound();
  return <CreditPortfolioScreen />;
}
