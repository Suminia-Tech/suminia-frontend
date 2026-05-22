import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Product1 } from '@/Constant';
import ProductCard from '../../../ElectronicDemo/ElectronicCollection/ProductCard';
import ElementHeader from '../../../Element/ElementHeader';
const ElementProduct1 = ({ ProductFilter }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product1} />
      <div className='contain-image-box overflow-hidden'>
        <section className='ratio_asos pt-3'>
          <Container fluid={true} className='p-0'>
            <Row className='m-0'>
              <Col sm='12' className='p-0'>
                <div className='product-wrapper slide-6'>
                  <ProductCard ProductFilter={ProductFilter} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct1;
