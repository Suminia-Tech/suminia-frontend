import { Col, Container, Row } from 'reactstrap';
import { OurCategory, OurCollection } from '@/Constant';
import SectionHeader from '@/Layout/Element/SectionHeader';
import RowCategory from './RowCategory';
const FashionCategory = ({ categoryBanner }) => {
  return (
    <section className='category-section ratio_40'>
      <Container fluid={true}>
        <Row>
          <Col lg='12'>
            <SectionHeader title={OurCategory} subTitle={OurCollection} />
          </Col>
        </Row>
        <RowCategory categoryBanner={categoryBanner} />
      </Container>
    </section>
  );
};
export default FashionCategory;
