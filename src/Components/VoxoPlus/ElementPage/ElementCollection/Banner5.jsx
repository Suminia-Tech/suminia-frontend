import React from 'react';
import { Col } from 'reactstrap';
import { Collection5 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FashionBannerMiddle from '../../../FashionDemo/FashionBannerMiddle';

const Banner5 = ({ bannerData }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0 section-b-space'>
        <ElementHeader title={Collection5} customeclass={'title title1 text-center'} />
        <section className='home-section pt-3'>
          <FashionBannerMiddle bannerData={bannerData} nohead={false} elemclass={'pt-3'} />
        </section>
      </div>
    </Col>
  );
};

export default Banner5;
