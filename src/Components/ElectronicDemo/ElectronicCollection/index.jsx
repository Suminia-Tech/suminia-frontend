import { Col, Container, Row } from 'reactstrap';
import { JustForYou, OurCollection } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import ProductCard from './ProductCard';
const ElectronicCollection = ({ productData }) => {
  const ProductFilter = productData?.filter((el) => el.type === 'electronic');
  return (
    <section className='ratio_asos'>
      <Container fluid={true} className='p-0'>
        <Row className='m-0'>
          <Col sm='12' className='p-0'>
            <SectionHeader subTitle={JustForYou} title={OurCollection} />
            <ProductCard ProductFilter={ProductFilter} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicCollection;
