import { Col, Container, Row } from 'reactstrap';
import AutoFadeSliderStatic from '../Common/AutoFadeSliderStatic';
import DetainTabSection from '../Common/DetailTabsection';
import ProductDetailStatic from '../Product4ImageContain/ProductDetailStatic';

const ProductBundleContain = () => {
  const bundles = true;
  return (
    <section>
      <Container>
        <Row className='gx-4 gy-5'>
          <Col lg='12' xs='12'>
            <div className='details-items'>
              <Row className='g-4'>
                <Col md='6'>
                  <AutoFadeSliderStatic />
                </Col>
                <Col md='6'>
                  <ProductDetailStatic bundles={bundles} />
                </Col>
              </Row>
            </div>
          </Col>
          <DetainTabSection />
        </Row>
      </Container>
    </section>
  );
};

export default ProductBundleContain;
