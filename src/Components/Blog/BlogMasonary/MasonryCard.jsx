import Link from 'next/link';
import React from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardBody } from 'reactstrap';
import { CommonPath } from '@/Constant';
import QuotesCard from './QuotesCard';
import Img from '@/Components/Element/Images';

const MasonryCard = ({ BlogDataFilter }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    767: 2,
    575: 1,
  };
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className='row g-4 filter-gallery mt-3 grid' columnClassName='grid-item col-lg-3 col-md-4 col-sm-6'>
      {BlogDataFilter &&
        BlogDataFilter.map((el) => {
          return el.blogs.map((elem) => {
            return (
              <Card className='masonary-blog' key={elem.id}>
                {elem.type === 'quote' ? (
                  <QuotesCard elem={elem} />
                ) : (
                  <>
                    <Link href={'/blog/blog_details'}>
                      <Img src={`${CommonPath}/${elem.image}`} alt='blog_details' className='card-img-top' />
                    </Link>
                    <CardBody>
                      <Link href={'/blog/blog_details'}>
                        <h2 className='card-title'>{elem.title}</h2>
                      </Link>
                      <p className='font-light'>{elem.description}</p>
                      <div className='blog-profile'>
                        <div className='image-profile'>
                          <Img src={`${CommonPath}/${elem.profileImage}`} className='img-fluid' alt='blog_details' />
                        </div>

                        <div className='image-name'>
                          <h3>{elem.author}</h3>
                          <h6>{elem.date}</h6>
                        </div>
                      </div>
                    </CardBody>
                  </>
                )}
              </Card>
            );
          });
        })}
    </Masonry>
  );
};

export default MasonryCard;
