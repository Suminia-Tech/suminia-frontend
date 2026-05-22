import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ShoesHomeSlider from '../../../ShoesDemo/ShoesHomeSlider';

const ElementShoes = ({ mainSlider }) => {
  return (
    <section>
      <Container fluid={true}>
        <Row className='g-4'>
          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>Home Style 5</h2>
              </div>

              <div className='contain-image-box'>
                <ShoesHomeSlider mainSlider={mainSlider} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ElementShoes;
