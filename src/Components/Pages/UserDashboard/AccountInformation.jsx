import React from 'react';
import { Col, Row } from 'reactstrap';

const AccountInformation = ({ elem }) => {
  return (
    <div className='box-account box-info'>
      <div className='box-head'>
        <h3>{elem.mainhead}</h3>
      </div>
      <Row>
        <Col sm='6'>
          <div className='box'>
            <div className='box-title'>
              <h4>{elem.head1}</h4>
              <a href='#javascript'>{elem.btn}</a>
            </div>
            <div className='box-content'>
              <h6 className='font-light'>{elem.name}</h6>
              <h6 className='font-light'>{elem.email}</h6>
              <a href='#javascript'>{elem.password}</a>
            </div>
          </div>
        </Col>
        <Col sm='6'>
          <div className='box'>
            <div className='box-title'>
              <h4>{elem.head2}</h4>
              <a href='#javascript'>{elem.btn}</a>
            </div>
            <div className='box-content'>
              <h6 className='font-light'>{elem.info}</h6>
            </div>
          </div>
        </Col>
      </Row>
      <div>
        <div className='box address-box'>
          <div className='box-title'>
            <h4>{elem.head3}</h4>
            <a href='#javascript'>{elem.subhead}</a>
          </div>
          <div className='box-content'>
            <Row className='row g-4'>
              <Col sm='6'>
                <h6 className='font-light'>{elem.billing}</h6>
                <h6 className='font-light'>{elem.billinginfo}</h6>
                <a href='#javascript'>{elem.btn2}</a>
              </Col>
              <Col sm='6'>
                <h6 className='font-light'>{elem.shipping}</h6>
                <h6 className='font-light'>{elem.shippinginfo}</h6>
                <a href='#javascript'>{elem.btn2}</a>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
