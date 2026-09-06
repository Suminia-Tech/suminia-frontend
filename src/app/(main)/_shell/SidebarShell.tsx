'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';

import { uiPreferences } from '@/shared/lib/uiPreferences';

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
  /* La preferencia vive en localStorage, que el servidor no puede ver.
     useSyncExternalStore es justo para eso: da una instantanea al servidor
     —siempre abierto— y otra al navegador, sin un efecto que cambie el estado
     despues de pintar. */
  const isCollapsed = useSyncExternalStore(
    uiPreferences.subscribe,
    () => uiPreferences.isSidebarCollapsed(),
    () => false,
  );

  const toggleCollapsed = () => uiPreferences.setSidebarCollapsed(!isCollapsed);

  return (
    <div className={`area-layout${isCollapsed ? ' is-collapsed' : ''}`}>
      <AreaSidebar
        groups={groups}
        homeHref={homeHref}
        isOpen={isMenuOpen}
        isCollapsed={isCollapsed}
        onClose={() => setMenuOpen(false)}
        onToggleCollapsed={toggleCollapsed}
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
