'use client';

import type { ReactNode } from 'react';
import { Col, Row } from 'reactstrap';

import PanelNav from '../../_shell/PanelNav';
import { ADMIN_ACCOUNT_SECTIONS } from '../_nav';

/* La cuenta y solo la cuenta lleva barra lateral: el resto del area ocupa el
   ancho completo. */
const AccountLayout = ({ children }: { children: ReactNode }) => (
  <section className='section-b-space'>
    <div className='container-fluid-lg'>
      <Row>
        <PanelNav sections={ADMIN_ACCOUNT_SECTIONS} />
        <Col lg='9'>{children}</Col>
      </Row>
    </div>
  </section>
);

export default AccountLayout;
