import React from 'react';
import { Col } from 'reactstrap';
import { Collection1 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FashionBannerTop from '../../../FashionDemo/FashionBannerTop';

const Banner1 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader customeclass={'title title1 text-center'} title={Collection1} />
        <div className='contain-image-box'>
          <FashionBannerTop bannerData={bannerData} elemclass={'pt-3'} />
        </div>
      </div>
    </Col>
  );
};

export default Banner1;
