import { Add1, Add2, Add3, OrderDate, OrderID, OrderTotal, PayonDelivery, expecteddate, fulldate, paymentmethod, shippingaddress, summery, trackorder } from '@/Constant';
import Link from 'next/link';
import { Col, Row } from 'reactstrap';

const OrderSummary = () => {
  return (
    <Col md='6'>
      <div className='order-success'>
        <Row className='g-4'>
          <Col sm='6'>
            <h4>{summery}</h4>
            <ul className='order-details'>
              <li>{OrderID}</li>
              <li>{OrderDate}</li>
              <li>{OrderTotal}</li>
            </ul>
          </Col>

          <Col sm='6'>
            <h4>{shippingaddress}</h4>
            <ul className='order-details'>
              <li>{Add1}</li>
              <li>{Add2}</li>
              <li>{Add3}</li>
            </ul>
          </Col>

          <Col xs='12'>
            <div className='payment-mode'>
              <h4>{paymentmethod}</h4>
              <p>{PayonDelivery}</p>
            </div>
          </Col>

          <Col md='12'>
            <div className='delivery-sec'>
              <h3>
                {expecteddate} <span>{fulldate}</span>
              </h3>
              <Link href={`/page/order_tracking`}>{trackorder}</Link>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default OrderSummary;
