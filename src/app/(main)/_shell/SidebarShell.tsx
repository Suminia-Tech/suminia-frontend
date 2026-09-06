'use client';

import { useState, type ReactNode } from 'react';

import AreaSidebar from './AreaSidebar';
import AreaTopbar from './AreaTopbar';
import type { SidebarGroup } from './sidebar.types';

/* Chasis de panel lateral, para las areas que son un lugar de trabajo y no un
   sitio que se navega.

   Sustituye a AreaShell —cabecera ancha, menu horizontal, pie de tienda— para
   el proveedor: con ocho secciones, un menu horizontal obliga a esconderlas
   detras de otro menu, mientras que el panel las tiene todas a la vista y deja
   claro donde esta uno parado.

   El pie de la plantilla no viaja aqui: telefono, direccion y enlaces de tienda
   no pintan nada dentro de un panel de administracion. */

interface SidebarShellProps {
  groups: SidebarGroup[];
  homeHref: string;
  children: ReactNode;
}

const SidebarShell = ({ groups, homeHref, children }: SidebarShellProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className='area-layout'>
      <AreaSidebar
        groups={groups}
        homeHref={homeHref}
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className='area-main'>
        <AreaTopbar
          groups={groups}
          homeHref={homeHref}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className='area-content'>{children}</main>
      </div>
    </div>
  );
};

export default SidebarShell;
