import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import DetainTabSection from '../Common/DetailTabsection';
import ProductDetailStatic from '../Product4ImageContain/ProductDetailStatic';
import AutoFadeSliderStatic from '../Common/AutoFadeSliderStatic';

const ProductNoSideBarContain = () => {
  return (
    <section>
      <Container>
        <Row className='gx-4 gy-5'>
          <Col lg='12' xs='12'>
            <div className='details-items'>
              <Row className='g-4'>
                <Col md='6'>
                  <AutoFadeSliderStatic />
                </Col>

                <Col md='6'>
                  <ProductDetailStatic />
                </Col>
              </Row>
            </div>
          </Col>
          <DetainTabSection />
        </Row>
      </Container>
    </section>
  );
};

export default ProductNoSideBarContain;
