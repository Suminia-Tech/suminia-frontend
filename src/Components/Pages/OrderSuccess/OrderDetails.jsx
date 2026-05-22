import Img from '@/Components/Element/Images';
import { OrderDetail } from '@/Constant';
import { Col, Container, Row, Table } from 'reactstrap';
import OrderSummary from './OrderSummary';

const OrderDetails = () => {
  return (
    <section className='section-b-space cart-section order-details-table'>
      <Container>
        <div className='title title1 title-effect mb-1 title-left'>
          <h2 className='mb-3'>{OrderDetail}</h2>
        </div>
        <Row className='g-4'>
          <Col md='6'>
            <Col sm='12' className='table-responsive'>
              <Table className='cart-table table-borderless'>
                <tbody>
                  <tr className='table-order'>
                    <td>
                      <a href='#javascript'>
                        <Img src='/assets/images/fashion/instagram/1.jpg' className='img-fluid' alt='instagram' />
                      </a>
                    </td>
                    <td>
                      <p>Product Name</p>
                      <h5>Outwear & Coats</h5>
                    </td>
                    <td>
                      <p>Quantity</p>
                      <h5>1</h5>
                    </td>
                    <td>
                      <p>Price</p>
                      <h5>$63.54</h5>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className='table-order'>
                    <td colSpan='3'>
                      <h5 className='font-light'>Subtotal :</h5>
                    </td>
                    <td>
                      <h4>$55.00</h4>
                    </td>
                  </tr>

                  <tr className='table-order'>
                    <td colSpan='3'>
                      <h5 className='font-light'>Shipping :</h5>
                    </td>
                    <td>
                      <h4>$12.00</h4>
                    </td>
                  </tr>

                  <tr className='table-order'>
                    <td colSpan='3'>
                      <h5 className='font-light'>Tax(GST) :</h5>
                    </td>
                    <td>
                      <h4>$10.00</h4>
                    </td>
                  </tr>

                  <tr className='table-order'>
                    <td colSpan='3'>
                      <h4 className='theme-color fw-bold'>Total Price :</h4>
                    </td>
                    <td>
                      <h4 className='theme-color fw-bold'>$6935.00</h4>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Col>
          <OrderSummary />
        </Row>
      </Container>
    </section>
  );
};

export default OrderDetails;
