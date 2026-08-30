'use client';

import type { ReactNode } from 'react';

import Cookie1 from '@/_template/Layout/Common/Cookie/Cookie1';
import Footers from '@/_template/Layout/Common/Footer';
import TapTop from '@/_template/Layout/Common/TapTop';

import AreaHeader, { type AreaNavItem } from './AreaHeader';

/* Chasis base: cabecera propia del area, contenido, y el pie comun.

   Sustituye a Layout6, que montaba siempre Header5 con la fila de tienda
   —categorias, buscador, carrito— para todo el mundo. Aqui cada area declara
   su menu y no hereda nada que no haya pedido. */

interface AreaShellProps {
  nav: AreaNavItem[];
  homeHref: string;
  children: ReactNode;
  /** Fila superior propia del area, si la necesita. */
  headerTop?: ReactNode;
  accountLinks?: AreaNavItem[];
}

const AreaShell = ({ nav, homeHref, children, headerTop, accountLinks }: AreaShellProps) => (
  <>
    <AreaHeader nav={nav} homeHref={homeHref} accountLinks={accountLinks}>
      {headerTop}
    </AreaHeader>
    {children}
    <Cookie1 />
    <TapTop />
    <Footers QuestionTab={true} />
  </>
);

export default AreaShell;
