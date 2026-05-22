import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Col, Row } from 'reactstrap';
import { CommonPath, ShopNow } from '@/Constant';
import Img from '@/Components/Element/Images';
import { Btn } from '@/Components/AbstractElements';

const LeftSideOffer = ({ MiddleBanner }) => {
  const router = useRouter();
  return (
    <Col lg='6'>
      {MiddleBanner &&
        MiddleBanner.map((el, i) => {
          return (
            <Row className='gy-4' key={i}>
              <Col lg='12' className='ratio_40'>
                <div className='collection-banner p-left banner-title'>
                  <Link href='/shop/shop_left_sidebar' className='banner-img'>
                    <Img src={`${CommonPath}/${el.righttopbanner.image}`} className='bg-img' alt='collection' />
                  </Link>
                  <div className='banner-text'>
                    <div className='banner-content'>
                      <h3 className='h-bottom'>
                        {el.righttopbanner.title}
                        <span className='theme-color'>${el.righttopbanner.price}</span>
                      </h3>
                      <Btn attrBtn={{ className: 'btn-solid-default', onClick: () => router.push('/shop/shop_left_sidebar') }}>{ShopNow}</Btn>
                    </div>
                  </div>
                </div>
              </Col>
              {el.righttopbanner.rightbottom.map((elem, i) => {
                return (
                  <Col sm='6' className='ratio2_3' key={i}>
                    <div className='collection-banner p-center text-center'>
                      <Link href='/shop/shop_left_sidebar' className='banner-img'>
                        <Img src={`${CommonPath}/${elem.image}`} className='bg-img bg-danger' alt='collection' />
                      </Link>
                      <Link href='/shop/shop_left_sidebar' className='contain-banner'>
                        <div className='banner-content with-bg'>
                          <h3 className='mb-1'>{elem.heading}</h3>
                          <span>{elem.discount}</span>
                        </div>
                      </Link>
                    </div>
                  </Col>
                );
              })}
            </Row>
          );
        })}
    </Col>
  );
};
export default LeftSideOffer;
