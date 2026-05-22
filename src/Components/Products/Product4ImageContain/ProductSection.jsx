import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { CustomersAlsoBoughtThese } from '@/Constant';
import ArrivalCards from '../../FashionDemo/FashionNewArrival/ArrivalCards';

const ProductSection = ({ productData }) => {
  return (
    <section className='ratio_asos section-b-space overflow-hidden'>
      <Container>
        <Row>
          <Col xs='12'>
            <h2 className='mb-lg-4 mb-3'>{CustomersAlsoBoughtThese}</h2>
            <ArrivalCards productData={productData} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;
