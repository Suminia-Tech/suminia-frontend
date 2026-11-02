'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, type Icon } from 'react-feather';
import { Col } from 'reactstrap';

import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

export interface PanelSection {
  label: string;
  href: string;
  icon: Icon;
  /* Esconde la entrada a quien no tiene el permiso: un operador no puede listar
     el equipo, de modo que ofrecersela solo le daria un 403. */
  permission?: string;
  /* Las subsecciones, que se despliegan debajo mientras se esta dentro. */
  children?: { label: string; href: string; permission?: string }[];
}

/* Las entradas van agrupadas, con el titulo del grupo como en el panel del
   proveedor (`area-sidebar-group-label`). */
export interface PanelGroup {
  label: string;
  items: PanelSection[];
}

/* Barra lateral de la cuenta del comprador. Cada seccion es una ruta de verdad
   y no una pestaña: asi se puede compartir un enlace, volver atras y recargar
   sin perder donde estabas.

   Se dibuja como el resto de la app y no con la barra del tema
   (`custome-nav-tabs`, fondo azul claro y flechas): una caja blanca como los
   paneles, y las entradas como las del panel lateral del proveedor
   (`area-sidebar-nav`), con su icono y el fondo suave en la activa. Son el
   mismo elemento —el menu de una cuenta— y se tienen que ver igual. */
const PanelNav = ({ groups }: { groups: PanelGroup[] }) => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const allowed = (item: { permission?: string }) =>
    !item.permission || hasPermission(user?.permissions, item.permission);
  const inside = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  /* Lo que el usuario abrio o cerro a mano. Sin entrada, un grupo esta abierto
     mientras se esta dentro de el. */
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <Col lg='3'>
      <nav className='account-nav' aria-label='Mi cuenta'>
        {groups.map((group) => {
          const items = group.items.filter(allowed);
          if (items.length === 0) return null;
          return (
            <div className='account-nav-group' key={group.label}>
              <span className='account-nav-group-label'>{group.label}</span>
              <ul>
                {items.map((section) => {
                  const Icon = section.icon;
                  const children = (section.children ?? []).filter(allowed);
                  const active = inside(section.href);

                  /* Una entrada con subsecciones es un grupo que se abre y se
               cierra, con la flecha que lo dice: si solo se desplegara al
               entrar, nada avisaria de que las tiene. */
                  if (children.length > 0) {
                    const open = toggled[section.href] ?? active;
                    return (
                      <li key={section.href}>
                        <button
                          type='button'
                          className={`account-nav-parent${active ? ' is-open' : ''}`}
                          aria-expanded={open}
                          onClick={() =>
                            setToggled((current) => ({ ...current, [section.href]: !open }))
                          }
                        >
                          <Icon size={19} />
                          <span>{section.label}</span>
                          <ChevronDown size={16} className='account-nav-chevron' />
                        </button>
                        {open && (
                          <ul className='account-nav-sub'>
                            {children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={pathname === child.href ? 'is-active' : undefined}
                                  aria-current={pathname === child.href ? 'page' : undefined}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={section.href}>
                      <Link
                        href={section.href}
                        className={active ? 'is-active' : undefined}
                        aria-current={pathname === section.href ? 'page' : undefined}
                      >
                        <Icon size={19} />
                        <span>{section.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </Col>
  );
};

export default PanelNav;
