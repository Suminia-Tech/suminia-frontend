'use client';

import type { ReactNode } from 'react';

import { AreaGuard } from '@/modules/auth';

import AreaShell from '../_shell/AreaShell';
import { ADMIN_NAV } from './_nav';

/* Area del personal interno de Suminia. A diferencia del proveedor y del
   comprador, no pertenece a ninguna empresa: por eso aqui no hay panel de
   "mi empresa" ni "mi equipo". */
const AdminLayout = ({ children }: { children: ReactNode }) => (
  <AreaGuard area='admin'>
    <AreaShell nav={ADMIN_NAV} homeHref='/admin'>
      {children}
    </AreaShell>
  </AreaGuard>
);

export default AdminLayout;
