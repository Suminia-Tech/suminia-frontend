import React from 'react';
import { Clock, Eye } from 'react-feather';
import { PopularPost } from '../../../Data/BlogData';
import { PopularPosts } from '@/Constant';

const LeftPopularCard = () => {
  return (
    <div className='popular-post mt-4'>
      <div className='popular-title'>
        <h3>{PopularPosts}</h3>
      </div>
      {PopularPost.map((elem, i) => {
        return (
          <div className='popular-image' key={i}>
            <div className='popular-number'>
              <h4 className='theme-color'>{elem.no}</h4>
            </div>
            <div className='popular-contain'>
              <h3>{elem.description}</h3>
              <p className='font-light mb-1'>
                <span>{elem.title}</span> {elem.in} <span>{elem.title1}</span>
              </p>
              <div className='review-box'>
                <span className='font-light clock-time'>
                  <Clock />
                  {elem.time}
                </span>
                <span className='font-light eye-icon'>
                  <Eye />
                  {elem.views}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeftPopularCard;
