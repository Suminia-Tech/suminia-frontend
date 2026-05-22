import React from 'react';
import { Col } from 'reactstrap';
import { Collection4 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FlowerBannerTop from '../../../FlowerDemo/FlowerBannerTop';

const Banner4 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader customeclass={'title title1 text-center'} title={Collection4} />
        <div className='contain-image-box'>
          <FlowerBannerTop bannerData={bannerData} elemclass={'pt-3'} />
        </div>
      </div>
    </Col>
  );
};

export default Banner4;
