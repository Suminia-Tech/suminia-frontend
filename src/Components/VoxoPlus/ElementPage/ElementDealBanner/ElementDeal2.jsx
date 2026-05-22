import React from 'react';
import { Deal2 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import VegetableDeal from '../../../VegetablesDemo/VegetableDeal';

const ElementDeal2 = ({ bannerData }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space pb-0'>
      <ElementHeader customeclass={'title title1 text-center'} title={Deal2} />
      <div className='contain-image-box'>
        <VegetableDeal bannerData={bannerData} elemclass={'pt-3'} />
      </div>
    </div>
  );
};

export default ElementDeal2;
