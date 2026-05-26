import React from 'react';
import { CommonPath } from '@/Constant';
import Img from '@/Components/Element/Images';

const CenterImage = ({ elem }) => {
  return (
    <div className='blog-image-box' style={{ height: '460px', overflow: 'hidden', borderRadius: '8px' }}>
      <Img src={`${CommonPath}/${elem.image}`} alt='blogs' className='card-img-top' style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      <div className='blog-title'>
        <div>
          <div className='social-media media-center'>
            {elem.social.map((item) => {
              return (
                <a href={item.link} target='new' key={item.id}>
                  <div className='social-icon-box social-color'>
                    <i className={item.class}></i>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterImage;
