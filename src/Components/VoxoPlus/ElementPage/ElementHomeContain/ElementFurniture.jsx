import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import FurnitureHomeSlider from '../../../FurnitureDemo/FurnitureHomeSlider';

const ElementFurniture = ({ mainSlider }) => {
  return (
    <section>
      <Container fluid={true}>
        <Row className='g-4'>
          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>Home Style 4</h2>
              </div>

              <div className='contain-image-box'>
                <FurnitureHomeSlider mainSlider={mainSlider} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ElementFurniture;
