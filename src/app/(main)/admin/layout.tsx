'use client';

import type { ReactNode } from 'react';

import { AreaGuard } from '@/modules/auth';

import SidebarShell from '../_shell/SidebarShell';
import { ADMIN_SIDEBAR } from './_nav';

/* Area del personal interno de Suminia.

   Mismo chasis que el proveedor: el trabajo se parece —un panel con listados
   que se recorren a diario— y no habia razon para que se navegara distinto.

   A diferencia del proveedor y del comprador, no pertenece a ninguna empresa:
   por eso aqui no hay "mi empresa" ni "mi equipo".

   AreaGuard manda a otra parte a quien no es personal interno. No es la
   barrera de seguridad —esa la pone el backend con 403 en cada endpoint— sino
   lo que evita pintar un panel ajeno que despues se llenaria de errores. */
const AdminLayout = ({ children }: { children: ReactNode }) => (
  <AreaGuard area='admin'>
    <SidebarShell groups={ADMIN_SIDEBAR} homeHref='/admin'>
      {children}
    </SidebarShell>
  </AreaGuard>
);

export default AdminLayout;
