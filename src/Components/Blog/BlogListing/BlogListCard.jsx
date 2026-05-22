import Link from 'next/link';
import React, { Fragment } from 'react';
import { CardBody, Col } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '../../Element/Images';

const BlogListCard = ({ currentData }) => {
  return (
    <Fragment>
      {currentData &&
        currentData.map((elem) => {
          return (
            <Col xs='12' key={elem.id}>
              <div className='masonary-blog box-shadow'>
                <Link href={'/blog/blog_details'}>
                  <Img src={`${CommonPath}/${elem.imagePath}`} alt='BlogImage' className='card-img-top bg-img image-fit' />
                </Link>
                <CardBody className='card-body-width'>
                  <h6 className='masonary-name'>{elem.title}</h6>
                  <Link href={'/blog/blog_details'}>
                    <h2 className='card-title'>{elem.heading}</h2>
                  </Link>
                  <p className='font-light'>{elem.description}</p>
                  <div className='blog-profile'>
                    <div className='image-profile'>
                      <Img src={`${CommonPath}/${elem.profileImage}`} className='img-fluid' alt='blog-thumbnail' />
                    </div>

                    <div className='image-name'>
                      <h3>
                        {elem.name}
                        <span> {elem.date}</span>
                      </h3>
                    </div>
                  </div>
                </CardBody>
              </div>
            </Col>
          );
        })}
    </Fragment>
  );
};

export default BlogListCard;
