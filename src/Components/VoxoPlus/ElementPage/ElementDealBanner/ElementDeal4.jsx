import React from 'react';
import { Deal4 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FlowerDealBanner from '../../../FlowerDemo/FlowerDealBanner';

const ElementDeal4 = ({ bannerData }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Deal4} />
      <div className='contain-image-box'>
        <FlowerDealBanner bannerData={bannerData} elemclass={'pt-3'} />
      </div>
    </div>
  );
};

export default ElementDeal4;
