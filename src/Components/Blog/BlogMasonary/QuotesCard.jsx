import Link from 'next/link';
import React from 'react';
import { CardBody } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '@/Components/Element/Images';

const QuotesCard = ({ elem }) => {
  return (
    <CardBody className='quote-body'>
      <Img src={`${CommonPath}/${elem.image}`} className='quote-image' alt='' />
      <Link href={'/blog/blog_details'}>
        <h2 className='card-title quote-head'>{elem.title}</h2>
      </Link>

      <div className='blog-profile box-center'>
        <div className='image-profile'>
          <Img src={`${CommonPath}/${elem.profileImage}`} className='img-fluid' alt='blog_details' />
        </div>

        <div className='image-name'>
          <h3>{elem.author}</h3>
          <h6>{elem.date}</h6>
        </div>
      </div>
    </CardBody>
  );
};

export default QuotesCard;
