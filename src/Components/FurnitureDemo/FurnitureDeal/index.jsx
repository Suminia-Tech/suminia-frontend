import { Container, Row } from 'reactstrap';
import DealCard from './DealCard';

const FurnitureDeal = ({ bannerData, elemclass }) => {
  return (
    <section className={`deal-section ${elemclass}`}>
      <Container>
        <Row>
          <DealCard bannerData={bannerData} />
        </Row>
      </Container>
    </section>
  );
};

export default FurnitureDeal;
