import React from 'react';
import { Deal1 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import ShoesDeal from '../../../ShoesDemo/ShoesDeal';

const ElementDeal1 = ({ bannerData }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space pb-0'>
      <ElementHeader customeclass={'title title1 text-center'} title={Deal1} />
      <div className='contain-image-box'>
        <ShoesDeal bannerData={bannerData} elemclass={'pt-3'} />
      </div>
    </div>
  );
};

export default ElementDeal1;
