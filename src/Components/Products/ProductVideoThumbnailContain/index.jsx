import React from 'react';
import { Container, Row } from 'reactstrap';
import DetainTabSection from '../Common/DetailTabsection';
import LeftsideContain from './LeftsideContain';
import RightsideContain from './RightsideContain';

const ProductVideoThumbnailContain = ({ VideoPlay, productData }) => {
  return (
    <section>
      <Container>
        <Row className='gx-4 gy-5'>
          <LeftsideContain productData={productData} />
          <RightsideContain VideoPlay={VideoPlay} />
          <DetainTabSection />
        </Row>
      </Container>
    </section>
  );
};

export default ProductVideoThumbnailContain;
