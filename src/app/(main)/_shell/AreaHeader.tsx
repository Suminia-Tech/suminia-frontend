'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

import Link from 'next/link';
import HeadingLogo from '@/_template/Layout/Element/HeadingLogo';
import { getAccountLabel, useAuth } from '@/modules/auth';

/* Cabecera comun a todas las areas. Lo unico que cambia entre ellas son los
   enlaces, que llegan por props: asi el proveedor no tiene un carrito
   escondido tras un `if`, simplemente nadie se lo pasa.

   Es una sola barra, no las dos de la plantilla: la primera de Header5 era la
   fila de tienda (categorias, buscador, carrito) y no aplica a ningun area de
   Suminia salvo la del comprador, que la montara por su cuenta. */

export interface AreaNavItem {
  label: string;
  href: string;
}

interface AreaHeaderProps {
  /** Enlaces del menu principal, propios de cada area. */
  nav: AreaNavItem[];
  /** A donde lleva el logo. Cada area vuelve a su propia raiz. */
  homeHref: string;
  /** Fila superior opcional: el comprador cuelga aqui buscador y carrito. */
  children?: React.ReactNode;
  /* Secciones de cuenta dentro del menu de usuario. El proveedor las deja
     vacias porque su panel ya las tiene en la barra lateral. */
  accountLinks?: AreaNavItem[];
}

const AreaHeader = ({ nav, homeHref, children, accountLinks = [] }: AreaHeaderProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header id='home'>
      {children}

      <div className='main-header'>
        <div className='container-fluid-lg'>
          <Row>
            <Col lg='12'>
              <div className='main-menu'>
                <div className='menu-left'>
                  <Link href={homeHref} className='d-inline-flex align-items-center'>
                    <HeadingLogo />
                  </Link>
                </div>

                <nav className='area-nav'>
                  <ul>
                    {nav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={
                            pathname === item.href || pathname.startsWith(`${item.href}/`)
                              ? 'active'
                              : ''
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className='menu-right'>
                  <ul>
                    <li>
                      {isAuthenticated ? (
                        <Dropdown
                          className='top-header-dropdown'
                          isOpen={menuOpen}
                          toggle={() => setMenuOpen(!menuOpen)}
                        >
                          <DropdownToggle
                            tag='a'
                            href='#javascript'
                            className='nav-link menu-title'
                            style={{ cursor: 'pointer' }}
                          >
                            <span>{user?.name}</span>
                            <i className='fas fa-chevron-down ms-1'></i>
                          </DropdownToggle>
                          <DropdownMenu end>
                            <DropdownItem header>{getAccountLabel(user)}</DropdownItem>
                            {accountLinks.map((item) => (
                              <DropdownItem key={item.href} href={item.href}>
                                {item.label}
                              </DropdownItem>
                            ))}
                            {accountLinks.length > 0 && <DropdownItem divider />}
                            <DropdownItem onClick={logout}>Cerrar sesión</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <Link className='nav-link menu-title' href='/'>
                          <span>Iniciar sesión</span>
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </header>
  );
};

export default AreaHeader;
