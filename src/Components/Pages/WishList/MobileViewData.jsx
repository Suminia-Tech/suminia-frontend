import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'reactstrap';

const MobileViewData = ({ elem }) => {
  const { symbol, currencyValue } = useSelector((state) => state.CurrencyReducer);
  return (
    <td>
      <Link href={`/product/product_left_sidebar/${elem.id}`} className='font-light'>
        {elem.name}
      </Link>
      <Row className='mobile-cart-content'>
        <div className='col'>
          <p>{elem.inStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        </div>
        <div className='col'>
          <p className='fw-bold'>{`${symbol}${(elem.price * currencyValue).toFixed(2)}`}</p>
        </div>
        <div className='col'>
          <h2 className='td-color'>
            <a className='icon'>
              <i className='fas fa-times'></i>
            </a>
          </h2>
          <h2 className='td-color'>
            <Link href={`/page/cart`} className='icon'>
              <i className='fas fa-shopping-cart'></i>
            </Link>
          </h2>
        </div>
      </Row>
    </td>
  );
};

export default MobileViewData;
