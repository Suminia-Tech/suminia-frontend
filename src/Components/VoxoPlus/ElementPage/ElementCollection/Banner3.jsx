import React from 'react';
import { Col } from 'reactstrap';
import { Collection3 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FurnitureTopBanner from '../../../FurnitureDemo/FurnitureTopBanner';

const Banner3 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader customeclass={'title title1 text-center'} title={Collection3} />
        <div className='contain-image-box'>
          <FurnitureTopBanner bannerData={bannerData} />
        </div>
      </div>
    </Col>
  );
};

export default Banner3;
