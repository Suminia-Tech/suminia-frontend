import React from 'react';
import { Col } from 'reactstrap';
import { Collection2 } from '@/Constant';
import ElectronicTopBanner from '../../../ElectronicDemo/ElectronicTopBanner';
import ElementHeader from '../../../Element/ElementHeader';

const Banner2 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader customeclass={'title title1 text-center'} title={Collection2} />
        <div className='contain-image-box'>
          <ElectronicTopBanner bannerData={bannerData} elemclass={'pt-3'} />
        </div>
      </div>
    </Col>
  );
};

export default Banner2;
