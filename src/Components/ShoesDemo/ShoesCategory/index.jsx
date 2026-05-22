import { Col, Container, Row } from 'reactstrap';
import { OurCategory, OurCollection } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import CategoryCard from './CategoryCard';
const ShoesCategory = ({ categoryBanner }) => {
  const ShoesFilter = categoryBanner.filter((el) => el.type === 'shoes');
  return (
    <section className='category-section'>
      <Container fluid={true}>
        <Row>
          <Col lg='12'>
            <SectionHeader title={OurCategory} subTitle={OurCollection} />
          </Col>
        </Row>
        <CategoryCard ShoesFilter={ShoesFilter} />
      </Container>
    </section>
  );
};
export default ShoesCategory;
