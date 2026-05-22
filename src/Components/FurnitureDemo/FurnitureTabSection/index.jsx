import { Col, Container, Row } from 'reactstrap';
import { HurryUp, SpecialOffer } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import NavTabHead from './NavTabHead';
const FurnitureTabSection = ({ tabSection }) => {
  const TabFilter = tabSection?.filter((el) => el.type === 'furniture');
  return (
    <section className='tab-section'>
      <Container>
        <Row>
          <Col>
            <SectionHeader title={HurryUp} subTitle={SpecialOffer} />
            <div className='tab-wrap'>
              <NavTabHead TabFilter={TabFilter} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default FurnitureTabSection;
