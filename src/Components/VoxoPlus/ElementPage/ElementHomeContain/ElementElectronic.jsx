import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ElectronicHomeSlider from '../../../ElectronicDemo/ElectronicHomeSlider';
const ElementElectronic = ({ mainSlider }) => {
  return (
    <section>
      <Container fluid={true}>
        <Row className='g-4'>
          <Col xs='12' className='px-0'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>Home Style 2</h2>
              </div>
              <ElectronicHomeSlider mainSlider={mainSlider} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElementElectronic;
