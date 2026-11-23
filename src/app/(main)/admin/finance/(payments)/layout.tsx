import type { ReactNode } from 'react';

import { StaffPaymentsLayout } from '@/modules/orders';

/* Las bandejas de pagos comparten cabecera y pestañas. Van en el layout para
   que al cambiar de bandeja se quede fijo y solo cambie la lista. */
export default function Layout({ children }: { children: ReactNode }) {
  return <StaffPaymentsLayout>{children}</StaffPaymentsLayout>;
}
