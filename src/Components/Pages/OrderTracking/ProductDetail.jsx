import React from 'react';
import { ProductDetails } from '../../../Data/OrderTrackingData';
import { Brand, date, OrderNumber, OrderPlaced, productDescription, ProductNameee, UserName, W765EWR8568871 } from '@/Constant';

const ProductDetail = () => {
  return (
    <div className='order-image-contain'>
      <h4>{ProductNameee}</h4>

      <div className='tracker-number'>
        <p className='font-light'>
          {OrderNumber} : <span>{W765EWR8568871}</span>
        </p>
        <p className='font-light'>
          {Brand} : <span>{UserName}</span>
        </p>
        <p className='font-light mb-0'>
          {OrderPlaced} : <span>{date}</span>
        </p>
      </div>
      <ol className='progtrckr'>
        {ProductDetails &&
          ProductDetails.map((elem) => (
            <li className={elem.classs} key={elem.id}>
              <h5>{elem.title}</h5>
              <h6>{elem.duration}</h6>
            </li>
          ))}
      </ol>

      <h5 className='font-light'>{productDescription}</h5>
    </div>
  );
};

export default ProductDetail;
