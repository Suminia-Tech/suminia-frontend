'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight, X } from 'react-feather';

import { CommonPath } from '@/_template/Constant';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import type { SidebarGroup } from './sidebar.types';

/* Panel de navegacion del area. Fijo en escritorio, cajon deslizante en movil.

   La entrada activa se decide por prefijo salvo cuando otra entrada del mismo
   grupo es mas especifica: /supplier/account/company empieza por
   /supplier/account, y sin esa comprobacion "Resumen" quedaria encendido a la
   vez que "Mi empresa". */

interface AreaSidebarProps {
  groups: SidebarGroup[];
  homeHref: string;
  isOpen: boolean;
  /** Contraido a solo iconos. En movil no aplica: alli el panel es un cajon. */
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
}

const AreaSidebar = ({
  groups,
  homeHref,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapsed,
}: AreaSidebarProps) => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const allHrefs = groups.flatMap((group) => group.items.map((item) => item.href));

  const isActive = (href: string): boolean => {
    if (pathname === href) return true;
    if (!pathname.startsWith(`${href}/`)) return false;

    /* Hay una entrada mas concreta para esta misma ruta: que se encienda ella. */
    return !allHrefs.some(
      (other) => other !== href && other.length > href.length && pathname.startsWith(other),
    );
  };

  return (
    <>
      {/* Velo del cajon en movil. */}
      <div
        className={`area-sidebar-veil${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        role='presentation'
      />

      <aside className={`area-sidebar${isOpen ? ' is-open' : ''}`}>
        <div className='area-sidebar-brand'>
          <Link href={homeHref} className='area-sidebar-logo'>
            {/* Contraido se queda el simbolo: el logotipo completo no cabe en
                68px y encogerlo lo dejaria ilegible. */}
            <Image
              src={isCollapsed ? '/assets/svg/icons.svg' : `${CommonPath}/logo.png`}
              width={isCollapsed ? 30 : 150}
              height={isCollapsed ? 30 : 40}
              alt='Suminia'
              priority
            />
          </Link>

          <button
            type='button'
            className='area-sidebar-collapse'
            onClick={onToggleCollapsed}
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>

          <button
            type='button'
            className='area-sidebar-close'
            onClick={onClose}
            aria-label='Cerrar menú'
          >
            <X size={18} />
          </button>
        </div>

        <nav className='area-sidebar-nav'>
          {groups.map((group) => {
            const visible = group.items.filter(
              (item) => !item.permission || hasPermission(user?.permissions, item.permission),
            );

            if (visible.length === 0) return null;

            return (
              <div className='area-sidebar-group' key={group.label}>
                <span className='area-sidebar-group-label'>{group.label}</span>
                <ul>
                  {visible.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          /* El title solo hace falta contraido, que es cuando el
                             icono viaja sin su etiqueta. */
                          title={isCollapsed ? item.label : undefined}
                          className={isActive(item.href) ? 'is-active' : undefined}
                        >
                          <Icon size={17} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AreaSidebar;
