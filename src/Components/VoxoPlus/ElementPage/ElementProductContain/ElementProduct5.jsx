import React from 'react';
import { Container, Row } from 'reactstrap';
import ProductSlider from '../../../FurnitureDemo/FurnitureProducts/ProductSlider';
import ElementHeader from '../../../Element/ElementHeader';
import { Product5 } from '@/Constant';
const ElementProduct5 = () => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product5} />
      <div className='contain-image-box'>
        <section className='ratio_asos pt-3'>
          <Container fluid={true} className='px-0 p-sm-0'>
            <Row className='m-0'>
              <div className='our-product'>
                <ProductSlider productData={productData} />
              </div>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct5;
