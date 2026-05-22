import Link from 'next/link';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '../../Element/Images';

const RigthSidebarCard = ({ BlogDataFilter }) => {
  return (
    <Row className='g-4'>
      {BlogDataFilter &&
        BlogDataFilter.map((el) => {
          return el.blogs.map((elem) => {
            return (
              <Col lg='4' md='6' key={elem.id}>
                <Card className='blog-categority'>
                  <Link href={'/blog/blog_details'} className='blog-img'>
                    <Img src={`${CommonPath}/${elem.imagePath}`} alt='blog_category' className='card-img-top bg-img' />
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
    </Row>
  );
};

export default RigthSidebarCard;
