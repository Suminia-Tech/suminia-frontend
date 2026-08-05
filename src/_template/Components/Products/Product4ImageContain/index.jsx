import { Col, Container, Row } from 'reactstrap';
import DetainTabSection from '../Common/DetailTabsection';
import ImageDatas from './ImageDatas';
import ProductDetailStatic from './ProductDetailStatic';

const Product4ImageContain = () => {
  return (
    <>
      <section>
        <Container>
          <Row className='gx-4 gy-5'>
            <Col xs='12' lg='12'>
              <div className='details-items'>
                <Row className='g-4'>
                  <ImageDatas />
                  <Col md='6'>
                    <ProductDetailStatic />
                  </Col>
                </Row>
              </div>
            </Col>
            <DetainTabSection />
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Product4ImageContain;
