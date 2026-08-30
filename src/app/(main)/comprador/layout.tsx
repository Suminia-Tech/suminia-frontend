'use client';

import type { ReactNode } from 'react';

import { AreaGuard } from '@/modules/auth';

import AreaShell from '../_shell/AreaShell';
import { BUYER_ACCOUNT_LINKS, BUYER_NAV } from './_nav';

/* Area del comprador. A diferencia del proveedor, aqui no hay barra lateral
   permanente: el catalogo ocupa el ancho completo y las secciones de cuenta
   son paginas sueltas. Cuando el carrito exista, cuelga de este chasis. */
const BuyerLayout = ({ children }: { children: ReactNode }) => (
  <AreaGuard area='comprador'>
    <AreaShell nav={BUYER_NAV} homeHref='/comprador' accountLinks={BUYER_ACCOUNT_LINKS}>
      {children}
    </AreaShell>
  </AreaGuard>
);

export default BuyerLayout;
