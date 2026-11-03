import type { Metadata } from 'next';

import { InsightsScreen } from '@/modules/insights';

export const metadata: Metadata = {
  title: 'Indicadores',
};

export default function Page() {
  return <InsightsScreen />;
}
