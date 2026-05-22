import React from 'react';
import { Col, Row } from 'reactstrap';
import AutoFadeSliderStatic from '../Common/AutoFadeSliderStatic';
import ProductDetailStatic from '../Product4ImageContain/ProductDetailStatic';
import ProductFilterButton from './ProductFilterButton';

const RightsideContain = ({ VideoPlay }) => {
  return (
    <Col lg='9' xs='12'>
      <ProductFilterButton />
      <div className='details-items'>
        <Row className='g-4'>
          <Col lg='5' md='6'>
            <AutoFadeSliderStatic VideoPlay={VideoPlay} />
          </Col>

          <Col lg='7' md='6'>
            <ProductDetailStatic />
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default RightsideContain;
