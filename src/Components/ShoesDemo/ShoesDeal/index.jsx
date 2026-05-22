import { Col, Container, Row } from 'reactstrap';
import DealCard from './DealCard';
const ShoesDeal = ({ bannerData, elemclass }) => {
  const ShoesDealFilter = bannerData.filter((el) => el.subtype === 'shoesdeal');
  return (
    <section className={`deal-section section-b-space ${elemclass}`}>
      <Container>
        <Row>
          <Col md='12'>
            <DealCard ShoesDealFilter={ShoesDealFilter} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ShoesDeal;
