'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'react-feather';

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
  onClose: () => void;
}

const AreaSidebar = ({ groups, homeHref, isOpen, onClose }: AreaSidebarProps) => {
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
          <Link href={homeHref}>
            <Image
              src={`${CommonPath}/logo.png`}
              width={150}
              height={40}
              alt='Suminia'
              priority
            />
          </Link>
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
                          className={isActive(item.href) ? 'is-active' : undefined}
                        >
                          <Icon size={17} />
                          {item.label}
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
