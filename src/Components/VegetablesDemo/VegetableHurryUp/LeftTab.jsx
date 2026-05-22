import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import Link from 'next/link';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';
import DynamicRating from '../../Element/DynamicRating';

const LeftTab = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <Fragment>
      {elem.childtype === 'leftbanners' && (
        <Col lg='4' md='6'>
          <div className='product-list'>
            {elem?.children?.map((elem, i) => {
              return (
                <div className='product-box product-box-4' key={i}>
                  <div className='img-wrapper bg-trans'>
                    <Link href={'/product/product_left_sidebar/25'} className='text-center'>
                      <Img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='product' />
                    </Link>
                  </div>
                  <div className='product-details'>
                    <h3 className='theme-color'>
                      {symbol}
                      {(elem.price * currencyValue).toFixed(2)}
                      <span className='font-light'>
                        {symbol}
                        {(elem.mrp * currencyValue).toFixed(2)}
                      </span>
                    </h3>
                    <a className='font-default'>
                      <h5>{elem.title}</h5>
                    </a>
                    <DynamicRating data={elem.ratingStars} customeclass={'mt-1'} />
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      )}
    </Fragment>
  );
};

export default LeftTab;
