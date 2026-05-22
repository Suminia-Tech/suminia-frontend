import { Col, Container, Row } from 'reactstrap';
import { OurCollection, OurProduct } from '@/Constant';
import SectionHeader from '../../Element/SectionHeader';
import ProductSlider from './ProductSlider';
const FurnitureProduct = ({ productData }) => {
  return (
    <section className='ratio_asos overflow-hidden'>
      <Container fluid={true} className='px-0 p-sm-0'>
        <Row className='m-0'>
          <Col xs='12' className='p-0'>
            <SectionHeader title={OurProduct} subTitle={OurCollection} />
          </Col>
          <div className='our-product'>
            <ProductSlider productData={productData} />
          </div>
        </Row>
      </Container>
    </section>
  );
};
export default FurnitureProduct;
