import type { Metadata } from 'next';

import { FinanceSettingsScreen } from '@/modules/finance';

export const metadata: Metadata = {
  title: 'Configuración financiera',
};

export default function Page() {
  return <FinanceSettingsScreen />;
}
