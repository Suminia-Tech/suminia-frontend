import React from 'react';
import { Col, Container } from 'reactstrap';
import { Category3 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import CategoryCard from '../../../ShoesDemo/ShoesCategory/CategoryCard';

const ElemCategory3 = ({ ShoesFilter }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0'>
        <ElementHeader customeclass={'title title1 text-center'} title={Category3} />
        <div className='contain-image-box section-b-space'>
          <section className='category-section pt-3'>
            <Container fluid={true}>
              <CategoryCard ShoesFilter={ShoesFilter} />
            </Container>
          </section>
        </div>
      </div>
    </Col>
  );
};

export default ElemCategory3;
