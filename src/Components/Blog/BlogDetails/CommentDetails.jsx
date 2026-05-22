import React, { Fragment } from 'react';
import { Col, Input, Label, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import { Comments, CommonPath, date, EmailAddress, FirstName, Johnwike, LastName, LeaveComments, Submit } from '@/Constant';
import Img from '@/Components/Element/Images';

const CommentDetails = ({ elem }) => {
  return (
    <Fragment>
      <div className='blog-profile box-center mb-lg-5 mb-4'>
        <div className='image-profile'>
          <Img src={`${CommonPath}/inner-page/review-image/2.jpg`} className='img-fluid' alt='blogs' />
        </div>

        <div className='image-name text-weight'>
          <h3>{Johnwike}</h3>
          <h6>{date}</h6>
        </div>
      </div>

      <Row className='g-2'>
        <Col xs='12'>
          <div className='minus-spacing mb-2'>
            <h3>{LeaveComments}</h3>
          </div>
        </Col>
        <Col lg='4' md='12' sm='6'>
          <Label htmlFor='fname'>{FirstName}</Label>
          <Input type='text' id='fname' placeholder='Enter First Name' required />
        </Col>
        <Col lg='4' md='12' sm='6'>
          <Label htmlFor='lname'>{LastName}</Label>
          <Input type='text' id='lname' placeholder='Enter Last Name' required />
        </Col>

        <Col lg='4'>
          <Label htmlFor='email'>{EmailAddress}</Label>
          <Input type='email' id='email' placeholder='example@example.com' required />
        </Col>

        <Col xs='12'>
          <Label htmlFor='textarea'>{Comments}</Label>
          <Input rows='3' type='textarea' placeholder='Leave a comment here' required></Input>
        </Col>

        <Col xs='12'>
          <Btn attrBtn={{ className: 'btn btn-solid-default btn-spacing mt-2' }}>{Submit}</Btn>
        </Col>
      </Row>
    </Fragment>
  );
};

export default CommentDetails;
