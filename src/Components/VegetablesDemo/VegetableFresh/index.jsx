import { Col, Container, Row } from 'reactstrap';
import { FreshFruits, JustForYou } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import FreshSlider from './FreshSlider';
const VegetableFresh = ({ productData }) => {
  const FreshFilter = productData.filter((el) => el.type === 'vegetables');
  return (
    <section className='ratio_asos'>
      <Container fluid={true} className='p-sm-0'>
        <Row className='m-0'>
          <Col sm='12' className='p-0'>
            <SectionHeader title={JustForYou} subTitle={FreshFruits} />
            <FreshSlider FreshFilter={FreshFilter} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default VegetableFresh;
