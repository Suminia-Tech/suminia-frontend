'use client';

import type { ReactNode } from 'react';

import { AreaGuard } from '@/modules/auth';

import SidebarShell from '../_shell/SidebarShell';
import { SUPPLIER_SIDEBAR } from './_nav';

/* Area del proveedor. Todo lo que cuelga de /supplier comparte este chasis, de
   modo que ninguna pantalla tiene que preguntar quien la esta viendo: el rol ya
   quedo decidido por la ruta.

   AreaGuard manda a otra parte a quien no es proveedor. No es la barrera de
   seguridad —esa la pone el backend con 403 en cada endpoint— sino lo que evita
   pintar un panel ajeno que despues se llenaria de errores. */
const SupplierLayout = ({ children }: { children: ReactNode }) => (
  <AreaGuard area='supplier'>
    <SidebarShell groups={SUPPLIER_SIDEBAR} homeHref='/supplier/products'>
      {children}
    </SidebarShell>
  </AreaGuard>
);

export default SupplierLayout;
