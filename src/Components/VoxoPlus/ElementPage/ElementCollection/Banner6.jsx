import React from 'react';
import { Col } from 'reactstrap';
import { Collection6 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';

const Banner6 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader title={Collection6} customeclass={'title title1 text-center'} />
        <div className='contain-image-box'>
</div>
      </div>
    </Col>
  );
};

export default Banner6;
