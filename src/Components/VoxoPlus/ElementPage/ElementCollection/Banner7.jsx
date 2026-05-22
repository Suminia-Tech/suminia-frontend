import React from 'react';
import { Col } from 'reactstrap';
import { Collection7 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import ShoesBannerMiddle from '../../../ShoesDemo/ShoesBannerMiddle';

const Banner7 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0'>
        <ElementHeader customeclass={'title title1 text-center'} title={Collection7} />
        <div className='contain-image-box'>
          <ShoesBannerMiddle bannerData={bannerData} elemclass={'pt-3'} />
        </div>
      </div>
    </Col>
  );
};

export default Banner7;
