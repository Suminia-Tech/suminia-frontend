import React from 'react';
import { Container, Row } from 'reactstrap';
import { Product4 } from '@/Constant';
import OfferCard from '../../../VegetablesDemo/VegetableOffers/OfferCard';
import ElementHeader from '../../../Element/ElementHeader';
const ElementProduct4 = ({ OfferFilter }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Product4} />
      <div className='contain-image-box'>
        <section className='ratio_90 pt-3'>
          <Container>
            <Row>
              <div className='product-wrapper slide-6'>
                <OfferCard OfferFilter={OfferFilter} />
              </div>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default ElementProduct4;
