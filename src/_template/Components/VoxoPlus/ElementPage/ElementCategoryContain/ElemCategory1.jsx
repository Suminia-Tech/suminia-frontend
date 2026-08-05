import { Category1 } from '@/_template/Constant';
import { Col, Container } from 'reactstrap';
import ElementHeader from '../../../Element/ElementHeader';

const ElemCategory1 = ({ categoryBanner }) => {
  return (
    <Col xs='12'>
      <div className='header-image-contain mb-0'>
        <ElementHeader customeclass={'title title1 text-center'} title={Category1} />
        <div className='contain-image-box overflow-hidden'>
          <section className='category-section pt-3 section-b-space ratio_40'>
            <Container fluid={true}>
</Container>
          </section>
        </div>
      </div>
    </Col>
  );
};

export default ElemCategory1;
