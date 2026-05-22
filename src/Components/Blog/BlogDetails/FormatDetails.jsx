import React from 'react';
import { Blogtitle, date } from '@/Constant';

const FormatDetails = ({ elem }) => {
  return (
    <div className='blog-detail-contain'>
      <span className='font-light'>{date}</span>
      <h2 className='card-title'>{Blogtitle}</h2>
      <p className='font-light firt-latter'>{elem.topText}</p>

      <p className='font-light'>{elem.middleText}</p>

      <p className='font-light'>{elem.bottomText}</p>
    </div>
  );
};

export default FormatDetails;
