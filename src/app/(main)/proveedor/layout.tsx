'use client';

import type { ReactNode } from 'react';

import { AreaGuard } from '@/modules/auth';

import AreaShell from '../_shell/AreaShell';
import { SUPPLIER_NAV } from './_nav';

/* Area del proveedor. Todo lo que cuelga de /proveedor comparte este chasis, de
   modo que ninguna pantalla tiene que preguntar quien la esta viendo: el rol ya
   quedo decidido por la ruta.

   La barra lateral no vive aqui sino en cuenta/layout.tsx: el catalogo ocupa el
   ancho completo, que es lo que pide una tabla de productos con imagenes.

   AreaGuard manda a otra parte a quien no es proveedor. No es la barrera de
   seguridad —esa la pone el backend con 403 en cada endpoint— sino lo que evita
   pintar un panel ajeno que despues se llenaria de errores. */
const SupplierLayout = ({ children }: { children: ReactNode }) => (
  <AreaGuard area='proveedor'>
    <AreaShell nav={SUPPLIER_NAV} homeHref='/proveedor'>
      {children}
    </AreaShell>
  </AreaGuard>
);

export default SupplierLayout;
