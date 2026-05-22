import React from 'react';
import { Col, Row } from 'reactstrap';
import { CommonPath } from '@/Constant';
import Img from '@/Components/Element/Images';

const CardDetails = ({ item, openPaymentModal }) => {
  return (
    <div className='card-details-section'>
      <Row className='g-4'>
        {item.tabs.map((elem, i) => {
          return (
            <Col lg='4' sm='6' key={i}>
              <div className='payment-card-detail'>
                <div className={`card-details ${elem?.class}`}>
                  <div className='card-number'>
                    <h4>{elem.cardno}</h4>
                  </div>
                  <div className='valid-detail'>
                    <div className='title'>
                      <span>{elem.valid}</span>
                      <span>{elem.thrr}</span>
                    </div>
                    <div className='date'>
                      <h3>{elem.date}</h3>
                    </div>
                    <div className='primary'>
                      <span className='badge bg-pill badge-light'>{elem.sub}</span>
                    </div>
                  </div>
                  <div className='name-detail'>
                    <div className='name'>
                      <h5>{elem.name}</h5>
                    </div>
                    <div className='card-img'>
                      <Img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='card' />
                    </div>
                  </div>
                </div>
                <div className='edit-card'>
                  <a href='#javascript'>
                    <i className='far fa-edit'></i> {elem.btn1}
                  </a>
                  <a href='#javascript'>
                    <i className='far fa-minus-square me-1'></i>
                    {elem.btn2}
                  </a>
                </div>
              </div>
              <div className='edit-card-mobile'>
                <a href='#javascript'>
                  <i className='far fa-edit'></i> {elem.btn1}
                </a>
                <a href='#javascript'>
                  <i className='far fa-minus-square me-1'></i>
                  {elem.btn2}
                </a>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CardDetails;
