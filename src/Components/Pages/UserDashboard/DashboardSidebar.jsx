import React, { Fragment } from 'react';
import { Container, Row } from 'reactstrap';
import UserNav from './UserNav';

const DashboardSidebar = () => {
  return (
    <Fragment>
      <section className='section-b-space'>
        <Container>
          <Row>
            <UserNav />
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default DashboardSidebar;
