import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import HomeSlider from '../../../FashionDemo/FashionHomeSlider/HomeSlider';
const ElementFashion = ({ mainSlider }) => {
  return (
    <section>
      <Container fluid={true}>
        <Row className='g-4'>
          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>Home Style 3</h2>
              </div>
              <div className='home-section-2 home-section'>
                <HomeSlider mainSlider={mainSlider} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElementFashion;
