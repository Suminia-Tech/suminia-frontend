import Link from 'next/link';
import React, { Fragment } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '@/Components/Element/Images';

const ProductCard = ({ InfiniteFilter, num }) => {
  return (
    <Fragment>
      {InfiniteFilter.map((el) => {
        return el.blogs.slice(0, num).map((elem) => {
          return (
            <Col lg='4' md='6' className={`col-grid-box d-block`} key={elem.id}>
              <Card className='blog-categority'>
                <Link href={'/blog/blog_details'} className='blog-img'>
                  <Img src={`${CommonPath}/${elem.imagePath}`} alt='blog-thumbnail' className='card-img-top bg-img' />
                </Link>
                <CardBody>
                  <h5>{elem.title}</h5>
                  <Link href={'/blog/blog_details'}>
                    <h2 className='card-title'>{elem.heading}</h2>
                  </Link>
                  <div className='blog-profile'>
                    <div className='image-name'>
                      <h3>{elem.name}</h3>
                      <h6>{elem.date}</h6>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        });
      })}
    </Fragment>
  );
};

export default ProductCard;
