import React from 'react';
import { Deal3 } from '@/Constant';
import ElementHeader from '../../../Element/ElementHeader';
import FurnitureDeal from '../../../FurnitureDemo/FurnitureDeal';

const ElementDeal3 = ({ bannerData }) => {
  return (
    <div className='header-image-contain mb-0 section-b-space'>
      <ElementHeader customeclass={'title title1 text-center'} title={Deal3} />
      <div className='contain-image-box'>
        <FurnitureDeal bannerData={bannerData} elemclass={'pt-3'} />
      </div>
    </div>
  );
};

export default ElementDeal3;
