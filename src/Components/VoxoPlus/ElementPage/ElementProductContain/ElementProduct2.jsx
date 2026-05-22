import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Product2 } from '@/Constant';
import VRSliders from '../../../ElectronicDemo/ElectronicVR/VRSlider';
import ElementHeader from '../../../Element/ElementHeader';
const ElementProduct2 = ({ FilterVrProduct }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product2} />
      <div className='contain-image-box'>
        <section className='ratio_asos pt-0'>
          <Container fluid={true}>
            <Row>
              <Col>
                <div className='product-wrapper slide-7 product-style-1'>
                  <VRSliders FilterVrProduct={FilterVrProduct} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct2;
