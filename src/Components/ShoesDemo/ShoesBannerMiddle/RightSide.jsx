import { CommonPath, Discount, ShopNow } from '@/Constant';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import Img from '../../Element/Images';

const RightSide = ({ elem }) => {
  const router = useRouter();
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <Col lg='6'>
      <Row className='gy-4'>
        <Col lg='12' className='ratio_40'>
          <div className='collection-banner p-left banner-title'>
            <a className='banner-img bg-size'>
              <Img src={`${CommonPath}/${elem.rightbanners.image}`} alt='banner' className='bg-img' />
            </a>
            <div className='banner-text'>
              <div className='banner-content'>
                <h3 className='mb-md-2 mb-0 spacing-text'>
                  {elem.rightbanners.heading}{' '}
                  <span className='theme-color'>
                    {symbol}
                    {(elem.rightbanners.price * currencyValue).toFixed(2)}
                  </span>
                </h3>
                <Btn attrBtn={{ className: 'default-light default-light-theme mt-md-2 mt-1 rounded', onClick: () => router.push('/shop/shop_left_sidebar') }}>{ShopNow}</Btn>
              </div>
            </div>
          </div>
        </Col>
        {elem.rightbanners.bottombanners.map((item, i) => {
          return (
            <Col md='6' className='ratio2_3' key={i}>
              <div className='collection-banner p-center text-center'>
                <a className='banner-img bg-size'>
                  <Img src={`${CommonPath}/${item.image}`} alt='banner' className='bg-img' />
                </a>
                {item.discount > 0 && (
                  <a className='contain-banner'>
                    <div className='banner-content spacing-banner with-bg'>
                      <h3 className='mb-1'>{item.heading}</h3>
                      <span>
                        {Discount} {item.discount}%
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </Col>
  );
};

export default RightSide;
