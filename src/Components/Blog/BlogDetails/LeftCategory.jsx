import Link from 'next/link';
import React from 'react';
import { CategoryPopular } from '../../../Data/BlogData';
import { Category } from '@/Constant';

const LeftCategory = () => {
  return (
    <div className='category-section popular-post mt-4'>
      <div className='popular-title'>
        <h3>{Category}</h3>
      </div>
      <ul>
        {CategoryPopular.map((elem, i) => {
          return (
            <li className='category-box' key={i}>
              <Link href={`/blog/blog_left_sidebar`}>
                <div className='category-product'>
                  <div className='cate-shape'>
                    <i className={elem.class}></i>
                  </div>

                  <div className='cate-contain'>
                    <h5 className='text-color'>{elem.title}</h5>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftCategory;
