import React from 'react';
import { BestSeller, infashion, ProductName } from '@/Constant';

const ProductPrice = () => {
  return (
    <>
      <div className='details-image-concept'>
        <h2>{ProductName}</h2>
      </div>

      <div className='label-section'>
        <span className='badge badge-grey-color'>{BestSeller}</span>
        <span className='label-text'>{infashion}</span>
      </div>

      <h3 className='price-detail'>
        $32.96 <del>$459.00</del>
        <span>55% off</span>
      </h3>
    </>
  );
};

export default ProductPrice;
