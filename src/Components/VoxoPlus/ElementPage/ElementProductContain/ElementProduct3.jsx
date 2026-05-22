import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Product3 } from '@/Constant';
import FreshSlider from '../../../VegetablesDemo/VegetableFresh/FreshSlider';
import ElementHeader from '../../../Element/ElementHeader';
const ElementProduct3 = ({ FreshFilter }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product3} />
      <div className='contain-image-box'>
        <section className='ratio_asos pt-3'>
          <Container fluid={true} className='p-sm-0'>
            <Row className='m-0'>
              <Col sm='12' className='p-0'>
                <div className='product-wrapper slide-6'>
                  <FreshSlider FreshFilter={FreshFilter} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct3;
