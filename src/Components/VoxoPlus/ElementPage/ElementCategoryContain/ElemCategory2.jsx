import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Category2 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FruitsSliderCard from '../../../VegetablesDemo/FreshFruit/FruitsSliderCard';

const ElemCategory2 = ({ FreshFilter }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0'>
        <ElementHeader customeclass={'title title1 text-center'} title={Category2} />
        <div className='contain-image-box section-b-space'>
          <section className='ratio_asos pt-3 category-style-3'>
            <Container>
              <Row>
                <FruitsSliderCard FreshFilter={FreshFilter} />
              </Row>
            </Container>
          </section>
        </div>
      </div>
    </Col>
  );
};

export default ElemCategory2;
