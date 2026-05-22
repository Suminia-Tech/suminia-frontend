import { ApplyCoupon, CartTotals, ConvenienceFee, CouponDiscount, ProcessCheckout, TotalMRP } from '@/Constant';
import Link from 'next/link';
import { Col, Form, Input, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const BottomContain = ({ cartData, totalMrp }) => {
  const getTotalPrice = () => {
    var addPrice = 0;
    const filterPrice =
      cartData &&
      cartData.map((el) => {
        return el.price;
      });
    filterPrice?.map((elem) => (addPrice += elem));
    return addPrice;
  };

  return (
    <div className='cart-checkout-section'>
      <Row className='g-4'>
        <Col lg='4' sm='6'>
          <div className='promo-section'>
            <Form className='row g-3'>
              <Col xs='7'>
                <Input type='text' className='form-control' id='number' placeholder='Coupon Code' />
              </Col>
              <Col xs='5'>
                <Btn attrBtn={{ className: 'btn btn-solid-default rounded btn' }}>{ApplyCoupon}</Btn>
              </Col>
            </Form>
          </div>
        </Col>
        <Col lg='4' className='ms-auto'>
          <div className='cart-box'>
            <div className='cart-box-details'>
              <div className='total-details'>
                <div className='top-details'>
                  <h3>{CartTotals}</h3>
                  <h6>
                    {CouponDiscount} <span>-$25.00</span>
                  </h6>
                  <h6>
                    {ConvenienceFee}
                    <span>
                      <del>$25.00</del>
                    </span>
                  </h6>
                  <h6 className='fw-bold'>
                    {TotalMRP} <span>${(totalMrp ? totalMrp - 25 : getTotalPrice() - 25) < 1 ? 0 : (totalMrp || getTotalPrice()) - 25}</span>
                  </h6>
                </div>
                <div className='bottom-details'>
                  <Link href={'/page/checkout'}>{ProcessCheckout}</Link>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BottomContain;
