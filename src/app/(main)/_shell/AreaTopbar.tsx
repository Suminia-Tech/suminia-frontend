'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, Home, Menu } from 'react-feather';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { getAccountLabel, useAuth } from '@/modules/auth';

import type { SidebarGroup } from './sidebar.types';

/* Barra superior: migas a la izquierda, quien esta dentro a la derecha.

   Las migas salen de la propia navegacion en vez de una lista aparte: si una
   entrada cambia de nombre, la miga cambia con ella y no hay dos sitios que
   mantener de acuerdo. */

interface AreaTopbarProps {
  groups: SidebarGroup[];
  homeHref: string;
  onOpenMenu: () => void;
}

const initials = (name: string | undefined): string =>
  (name ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const AreaTopbar = ({ groups, homeHref, onOpenMenu }: AreaTopbarProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  /* La entrada mas larga que casa con la ruta actual: asi una subruta como
     /account/company encuentra "Mi empresa" y no se queda en "Resumen". */
  const current = groups
    .flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })))
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <header className='area-topbar'>
      <div className='area-topbar-left'>
        <button
          type='button'
          className='area-topbar-menu'
          onClick={onOpenMenu}
          aria-label='Abrir menú'
        >
          <Menu size={20} />
        </button>

        <nav className='area-breadcrumb' aria-label='Ruta'>
          <Link href={homeHref} aria-label='Inicio'>
            <Home size={15} />
          </Link>
          {current && (
            <>
              <ChevronRight size={14} />
              <span className='font-light'>{current.group}</span>
              <ChevronRight size={14} />
              <strong>{current.label}</strong>
            </>
          )}
        </nav>
      </div>

      <Dropdown
        className='area-topbar-user'
        isOpen={menuOpen}
        toggle={() => setMenuOpen(!menuOpen)}
      >
        <DropdownToggle tag='button' type='button'>
          <span className='area-avatar'>{initials(user?.name)}</span>
          <span className='area-topbar-name'>{user?.name}</span>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem header>{getAccountLabel(user)}</DropdownItem>
          <DropdownItem onClick={logout}>Cerrar sesión</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
};

export default AreaTopbar;
