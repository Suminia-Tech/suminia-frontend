import { Billingaddress } from '@/Constant';
import { Col, Container, Row } from 'reactstrap';
import CheckoutForm from './CheckoutForm';
import SideBarCartBox from './SideBarCartBox';

const SectionCheckout = () => {
  return (
    <section className='section-b-space'>
      <Container>
        <Row className='g-4'>
          <Col lg='8'>
            <h3 className='mb-3'>{Billingaddress}</h3>
            <CheckoutForm />
          </Col>
          <SideBarCartBox />
        </Row>
      </Container>
    </section>
  );
};

export default SectionCheckout;
