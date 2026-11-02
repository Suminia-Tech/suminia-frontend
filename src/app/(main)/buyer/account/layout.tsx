'use client';

import type { ReactNode } from 'react';
import { Col, Row } from 'reactstrap';

import PanelNav from '../../_shell/PanelNav';
import { BUYER_ACCOUNT_GROUPS } from '../_nav';

const AccountLayout = ({ children }: { children: ReactNode }) => (
  <section className='section-b-space'>
    <div className='container-fluid-lg'>
      <Row>
        <PanelNav groups={BUYER_ACCOUNT_GROUPS} />
        <Col lg='9'>{children}</Col>
      </Row>
    </div>
  </section>
);

export default AccountLayout;
