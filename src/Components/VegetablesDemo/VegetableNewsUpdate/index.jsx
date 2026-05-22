import { Col, Container, Row } from 'reactstrap';
import { OurBlog, OurNewsUpdate } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import BlogCards from './BlogCards';
const VegetableNewsUpdate = ({ bannerData }) => {
  const BottomBannerFilter = bannerData.filter((el) => el.subtype === 'vegetablesourblog');
  return (
    <section className='section-b-space'>
      <Container>
        <Row>
          <Col xs='12'>
            <SectionHeader title={OurNewsUpdate} subTitle={OurBlog} />
          </Col>
          <BlogCards BottomBannerFilter={BottomBannerFilter} />
        </Row>
      </Container>
    </section>
  );
};
export default VegetableNewsUpdate;
