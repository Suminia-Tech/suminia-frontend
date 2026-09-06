'use client';

import type { ReactNode } from 'react';
import { Col, Container, Row } from 'reactstrap';

import PanelNav from '../../_shell/PanelNav';
import { ADMIN_ACCOUNT_SECTIONS } from '../_nav';

/* La cuenta y solo la cuenta lleva barra lateral: el resto del area ocupa el
   ancho completo. */
const AccountLayout = ({ children }: { children: ReactNode }) => (
  <section className='section-b-space'>
    <Container>
      <Row>
        <PanelNav sections={ADMIN_ACCOUNT_SECTIONS} />
        <Col lg='9'>{children}</Col>
      </Row>
    </Container>
  </section>
);

export default AccountLayout;
