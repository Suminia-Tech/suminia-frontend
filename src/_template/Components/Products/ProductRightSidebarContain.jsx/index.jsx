import React from 'react';
import { Container, Row } from 'reactstrap';
import DetainTabSection from '../Common/DetailTabsection';
import LeftsideContain from '../ProductLeftSidebarContain/LeftsideContain';
import RightsideContain from '../ProductLeftSidebarContain/RightsideContain';

const ProductRightSidebarContain = ({ productData }) => {
  return (
    <section>
      <Container>
        <Row className='gx-4 gy-5'>
          <RightsideContain />
          <LeftsideContain productData={productData} />
          <DetainTabSection />
        </Row>
      </Container>
    </section>
  );
};

export default ProductRightSidebarContain;
