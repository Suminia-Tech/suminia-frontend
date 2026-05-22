import React, { Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { CommonPath, ShopNow } from '@/Constant';
import { Btn } from '../../AbstractElements';
import Img from '../../Element/Images';
import { useRouter } from 'next/navigation';
const RightSideImage = ({ bannerData }) => {
  const router = useRouter();
  const RightSidebar = bannerData.filter((el) => el.subtype === 'flowernewoffer');
  return (
    <Col lg='6'>
      <Row className='gy-4'>
        {RightSidebar.map((elem, i) => {
          return (
            <Fragment key={i}>
              <Col lg='12' className='ratio_40'>
                <div className='collection-banner p-left banner-title'>
                  <a className='banner-img bg-size'>
                    <Img src={`${CommonPath}/${elem.righttopbanner.image}`} className='bg-img' alt='flower' />
                  </a>
                  <div className='banner-text'>
                    <div className='banner-content t-top'>
                      <h3>
                        {elem.righttopbanner.title}
                        <span className='theme-color'>{elem.righttopbanner.price}</span>
                      </h3>
                      <Btn
                        attrBtn={{
                          className: 'btn-solid-default',
                          onClick: () => router.push('/shop/shop_left_sidebar'),
                        }}>
                        {ShopNow}
                      </Btn>
                    </div>
                  </div>
                </div>
              </Col>
              {elem?.righttopbanner?.rightbottom.map((item, i) => {
                return (
                  <Col sm='6' className='ratio2_3' key={i}>
                    <div className='collection-banner p-center text-center'>
                      <a className='banner-img bg-size'>
                        <Img src={`${CommonPath}/${item.image}`} className='bg-img' alt='flower' />
                      </a>
                      <a className='contain-banner'>
                        <div className='banner-content with-bg with-white'>
                          <h3 className='mb-1'>{item.heading}</h3>
                          <span>{item.discount}</span>
                        </div>
                      </a>
                    </div>
                  </Col>
                );
              })}
            </Fragment>
          );
        })}
      </Row>
    </Col>
  );
};

export default RightSideImage;
