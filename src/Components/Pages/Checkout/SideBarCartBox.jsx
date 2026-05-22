import { CommonPath, EXAMPLECODE, Promocode, Redeem, Yourcart } from '@/Constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Form, Input, InputGroup } from 'reactstrap';
import { getAPIData } from '../../../Utils';
import { Btn } from '../../AbstractElements';
import TotalPrice from './TotalPrice';
import Img from '@/Components/Element/Images';

const SideBarCartBox = () => {
  const [cartData, setCartData] = useState([]);
  const { product, quantity } = useSelector((state) => state.AddToCartReducer);
  useEffect(() => {
    getAPIData(`/api/getcart`)
      .then((res) => {
        setCartData(res.data);
      })
      .catch((error) => {return error});
  }, [product]);

  return (
    <Col lg='4'>
      <div className='your-cart-box'>
        <h3 className='mb-3 d-flex text-capitalize'>
          {Yourcart}
          <span className='badge bg-theme new-badge rounded-pill ms-auto bg-dark'>{cartData?.length}</span>
        </h3>
        <ul className='list-group mb-3'>
          {cartData?.length > 0 ? (
            cartData.map((elem) => {
              return (
                <li className='list-group-item list-group-item-1 lh-condensed' key={elem.id}>
                  <div className='checkout-image'>
                    <Img src={`${CommonPath}/${elem.images[0].src}`} className='img-fluid' />
                  </div>
                  <div>
                    <h6 className='my-0'>{elem.name}</h6>
                    <small>{elem.type}</small>
                  </div>
                  <span>${quantity[elem.id]?.qty && quantity[elem.id]?.qty > 1 ? quantity[elem.id]?.qty * quantity[elem.id]?.price : elem.price}</span>
                </li>
              );
            })
          ) : (
            <li>
              <p>No Data Found</p>
            </li>
          )}
          <li className='list-group-item d-flex justify-content-between lh-condensed active'>
            <div className='text-dark'>
              <h6 className='my-0'>{Promocode}</h6>
              <small>{EXAMPLECODE}</small>
            </div>
            <span>-$5</span>
          </li>
          <TotalPrice cartData={cartData} />
        </ul>

        <Form className='card custom-card border-0'>
          <InputGroup className='custome-input-group'>
            <Input type='text' placeholder='Promo code' />
            <div className='input-group-append'>
              <Btn attrBtn={{ className: 'btn-solid-default rounded-0' }}>{Redeem}</Btn>
            </div>
          </InputGroup>
        </Form>
      </div>
    </Col>
  );
};

export default SideBarCartBox;
