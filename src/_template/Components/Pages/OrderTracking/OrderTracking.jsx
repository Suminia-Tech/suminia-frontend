import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import OrderTrackingData from './OrderTrackingData';
import ProductDetail from './ProductDetail';
import Img from '../../Element/Images';

const OrderTracking = () => {
  return (
    <section className='section-b-space'>
      <Container>
        <Row>
          <Col xs='12' className='overflow-hidden'>
            <div className='order-left-image ratio_asos'>
              <div className='tracking-product-image'>
                <Img src='/assets/images/fashion/banner/3.jpg' className='img-fluid bg-img' alt='banner' />
              </div>
              <ProductDetail />
            </div>
          </Col>
          <OrderTrackingData />
        </Row>
      </Container>
    </section>
  );
};

export default OrderTracking;
