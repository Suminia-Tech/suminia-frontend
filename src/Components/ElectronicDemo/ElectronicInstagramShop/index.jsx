import { InstagramShop, NewCollection } from '@/Constant';
import { Col, Container, Row } from 'reactstrap';
import SectionHeader from '../../Element/SectionHeader';
import ElectronicInstaCard from './ElectronicInstaCard';
const ElectronicInstagramShop = ({ bannerData }) => {
  const InstaFilter = bannerData.filter((el) => el.subtype === 'electronicinstashop');
  return (
    <section className='ratio_square'>
      <Container fluid={true}>
        <Row>
          <Col>
            <SectionHeader title={InstagramShop} subTitle={NewCollection} />
            <ElectronicInstaCard InstaFilter={InstaFilter} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicInstagramShop;
