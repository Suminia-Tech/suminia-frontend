import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import { Col, Container, Row } from 'reactstrap';
import { AutoFadeSliderImageData } from '../../../Data/ProductDetailsData';
import DetainTabSection from '../Common/DetailTabsection';
import ProductDetailStatic from '../Product4ImageContain/ProductDetailStatic';

const ProductStickyContain = () => {
  return (
    <section>
      <Container>
        <Row className='gx-4 gy-5'>
          <Col lg='12' xs='12'>
            <div className='details-items'>
              <Row className='g-4'>
                <Col md='6'>
                  <Row className='g-4 ratio_asos'>
                    {AutoFadeSliderImageData.slice(0, 3).map((elem) => {
                      return (
                        <Col xs='12' key={elem.id}>
                          <Img src={`${CommonPath}${elem.image}`} className='img-fluid w-100' alt='fluid' />
                        </Col>
                      );
                    })}
                  </Row>
                </Col>

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
  );
};

export default ProductStickyContain;
