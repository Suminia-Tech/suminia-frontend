import React from 'react';
import { Col, Row } from 'reactstrap';
import { UserDashboardData } from '../../../Data/UserDashboardData';
import { CommonPath } from '@/Constant';
import AccountInformation from './AccountInformation';
import Img from '@/Components/Element/Images';

const DashBoardContain = () => {
  const DashboardFilter = UserDashboardData.filter((el) => el.type === 'Dashboard');
  return (
    <div className='dashboard-right'>
      {DashboardFilter.map((el) => {
        return el.tabs.map((elem, i) => {
          return (
            <div className='dashboard' key={i}>
              <div className='page-title title title1 title-effect'>
                <h2>{elem.title}</h2>
              </div>
              <div className='welcome-msg'>
                <h6 className='font-light'>
                  {elem.greet}
                  <span>{elem.name}</span>
                </h6>
                <p className='font-light'>{elem.description}</p>
              </div>

              <div className='order-box-contain my-4'>
                <Row className='g-4'>
                  {elem.orders.map((item, i) => {
                    return (
                      <Col lg='4' sm='6' key={i}>
                        <div className='order-box'>
                          <div className='order-box-image'>
                            <Img src={`${CommonPath}/${item.image1}`} className='img-fluid' alt='order' />
                          </div>
                          <div className='order-box-contain'>
                            <Img src={`${CommonPath}/${item.image2}`} className='img-fluid' alt='box' />
                            <div>
                              <h5 className='font-light'>{item.title}</h5>
                              <h3>{item.num}</h3>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
              <AccountInformation elem={elem} />
            </div>
          );
        });
      })}
    </div>
  );
};

export default DashBoardContain;
