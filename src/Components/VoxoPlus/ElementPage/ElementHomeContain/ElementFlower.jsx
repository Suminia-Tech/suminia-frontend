import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import BackgroundImage from '../../../FlowerDemo/FlowerHomeSilder/BackgroungImage';
import LeftContain from '../../../FlowerDemo/FlowerHomeSilder/LeftContain';
import NavSlider from '../../../FlowerDemo/FlowerHomeSilder/NavSlider';
import PosterSlider from '../../../FlowerDemo/FlowerHomeSilder/PosterSlider';

const ElementFlower = ({ mainSlider }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();
  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);
  const { nav1, nav2 } = state;
  const FlowerHomeSlider = mainSlider.filter((el) => el.type === 'flower');
  return (
    <section>
      <Container fluid={true}>
        <Row className='g-4'>
          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>Home Style 1</h2>
              </div>
              <div className='contain-image-box'>
                <div className='pt-0 home-section-5'>
                  <PosterSlider nav2={nav2} slider1={slider1} FlowerHomeSlider={FlowerHomeSlider} />
                  <BackgroundImage FlowerHomeSlider={FlowerHomeSlider} />
                  <NavSlider nav1={nav1} slider2={slider2} FlowerHomeSlider={FlowerHomeSlider} />
                  <LeftContain FlowerHomeSlider={FlowerHomeSlider} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElementFlower;
