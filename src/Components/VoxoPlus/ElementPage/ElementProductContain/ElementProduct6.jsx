import React from 'react';
import ArrivalCards from '../../../FashionDemo/FashionNewArrival/ArrivalCards';
import ElementHeader from '../../../Element/ElementHeader';
import { Col, Container, Row } from 'reactstrap';
import { Product6 } from '@/Constant';
const ElementProduct6 = ({ productData }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product6} />
      <div className='contain-image-box'>
        <section className='ratio_asos pt-3'>
          <Container>
            <Row className='m-0'>
              <Col sm='12' className='p-0'>
                <div className='product-wrapper product-style-2 slide-4 p-0 light-arrow bottom-space'>
                  <ArrivalCards productData={productData} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct6;
