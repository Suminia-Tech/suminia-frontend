import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';
import { CommonPath } from '@/Constant';
import DynamicRating from '../../Element/DynamicRating';
import Img from '@/Components/Element/Images';

const MiddleTab = ({ elem, TabMiddleColor, LeftRightTab }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <>
      {elem.childtype === 'middlebanner' && (
        <Col lg='4' className='order-lg-0 order-1'>
          <div className='product-banner product-banner-circle'>
            <div className={`${LeftRightTab ? LeftRightTab : 'product-box product-box1'}`}>
              <div className='img-wrapper bg-transparent'>
                <div className='label-block'>
                  <span className='label label-black'>{elem.lefttag}</span>
                  <span className='label label-theme'>{elem.righttag}</span>
                </div>
                <Link href={'/product/product_left_sidebar/21'}>
                  <Img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='furniture' />
                </Link>
                <div className={`${TabMiddleColor ? TabMiddleColor : 'offer-end offer-end-demo4'}`}>
                  <h3>{elem.heading}</h3>
                  <h6>{elem.subheading}</h6>
                </div>
              </div>
              <div className='product-details text-center'>
                <h3 className='theme-color'>
                  {symbol}
                  {(elem.price * currencyValue).toFixed(2)}
                  <span className='font-light ms-2'>
                    {symbol}
                    {(elem.mrp * currencyValue).toFixed(2)}
                  </span>
                </h3>
                <a href='#javascript' className='font-default' tabIndex='-1'>
                  <h5 className='main-title'>{elem.title}</h5>
                </a>
                <DynamicRating data={elem.ratingstars} customeclass={'rating-2'} />
              </div>
            </div>
          </div>
        </Col>
      )}
    </>
  );
};

export default MiddleTab;
