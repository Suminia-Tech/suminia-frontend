import { Col, Container, Row } from 'reactstrap';
import { FreshFruits, JustForYou } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import FruitsSliderCard from './FruitsSliderCard';
const FreshFruit = ({ bannerData }) => {
  const FreshFilter = bannerData.filter((el) => el.subtype === 'vegetablesfreshfruits');
  return (
    <section className='ratio_asos category-style-3'>
      <Container>
        <Row>
          <Col sm='12' className='p-0'>
            <SectionHeader title={JustForYou} subTitle={FreshFruits} />
          </Col>
          <FruitsSliderCard FreshFilter={FreshFilter} />
        </Row>
      </Container>
    </section>
  );
};
export default FreshFruit;
