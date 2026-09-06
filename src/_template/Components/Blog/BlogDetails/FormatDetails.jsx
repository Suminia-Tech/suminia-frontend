import React from 'react';

const FormatDetails = ({ elem }) => {
  return (
    <div className='blog-detail-contain'>
      <span className='font-light'>{elem.date}</span>
      <h2 className='card-title'>{elem.title}</h2>
      <p className='font-light firt-latter'>{elem.topText}</p>
      <p className='font-light'>{elem.middleText}</p>
      <p className='font-light'>{elem.bottomText}</p>
    </div>
  );
};

export default FormatDetails;
