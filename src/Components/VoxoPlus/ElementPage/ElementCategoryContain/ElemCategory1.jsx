import { Category1 } from '@/Constant';
import { Col, Container } from 'reactstrap';
import ElementHeader from '../../../Element/ElementHeader';
import RowCategory from '../../../FashionDemo/FashionCategory/RowCategory';

const ElemCategory1 = ({ categoryBanner }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0'>
        <ElementHeader customeclass={'title title1 text-center'} title={Category1} />
        <div className='contain-image-box overflow-hidden'>
          <section className='category-section pt-3 section-b-space ratio_40'>
            <Container fluid={true}>
              <RowCategory categoryBanner={categoryBanner} />
            </Container>
          </section>
        </div>
      </div>
    </Col>
  );
};

export default ElemCategory1;
