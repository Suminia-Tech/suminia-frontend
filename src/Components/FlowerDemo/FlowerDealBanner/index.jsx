import { Col, Container, Row } from 'reactstrap';
import DealContain from './DealContain';

const FlowerDealBanner = ({ bannerData, elemclass }) => {
  return (
    <section className={`deal-section ${elemclass}`}>
      <Container>
        <Row>
          <Col md='12'>
            <DealContain bannerData={bannerData} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FlowerDealBanner;
