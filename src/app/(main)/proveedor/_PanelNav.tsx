'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Col, Nav, NavItem } from 'reactstrap';

import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import { SUPPLIER_PANEL_SECTIONS } from './_nav';

/* Barra lateral del panel. Cada seccion es una ruta de verdad y no una pestana:
   asi se puede compartir un enlace, volver atras y recargar sin perder donde
   estabas, que con las pestanas de reactstrap no pasaba. */
const PanelNav = () => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  const sections = SUPPLIER_PANEL_SECTIONS.filter(
    (section) => !section.permission || hasPermission(user?.permissions, section.permission),
  );

  return (
    <Col lg='3'>
      <Nav className='nav-tabs custome-nav-tabs flex-column category-option' id='panelNav'>
        {sections.map((section) => (
          <NavItem className='mb-2' key={section.href}>
            <Link
              href={section.href}
              className={`nav-link${pathname === section.href ? ' active' : ''}`}
            >
              <i className='fas fa-angle-right'></i>
              {section.label}
            </Link>
          </NavItem>
        ))}
      </Nav>
    </Col>
  );
};

export default PanelNav;
