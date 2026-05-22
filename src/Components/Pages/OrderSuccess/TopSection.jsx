import { OrderSuccess, PaymentDescription, TransactionID } from '@/Constant';
import { Col, Container, Row } from 'reactstrap';
import { OrderSuccessSvg } from '../../../Data/SVG';

const TopSection = () => {
  return (
    <section className='pt-0'>
      <Container fluid={true}>
        <Row>
          <Col xs='12' className='p-0'>
            <div className='success-icon'>
              <div className='main-container'>
                <div className='check-container'>
                  <div className='check-background'>
                    <OrderSuccessSvg />
                  </div>
                  <div className='check-shadow'></div>
                </div>
              </div>

              <div className='success-contain'>
                <h4>{OrderSuccess}</h4>
                <h5 className='font-light'>{PaymentDescription}</h5>
                <h6 className='font-light'>{TransactionID}</h6>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TopSection;
