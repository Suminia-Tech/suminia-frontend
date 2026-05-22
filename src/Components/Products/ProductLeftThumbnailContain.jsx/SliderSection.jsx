import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { Col, Row } from 'reactstrap';
import { AutoFadeSliderImageData } from '../../../Data/ProductDetailsData';
import { ThumbNavSlider, ThumbPosterSlider } from '../../../Data/SliderSettingsData';

const SliderSection = () => {
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
  return (
    <Col md='6'>
      <Row>
        <Col lg='10' className='order-lg-2'>
          <div className='details-image-1 ratio_asos'>
            <Slider {...ThumbPosterSlider} asNavFor={nav1} ref={(slider) => (slider2.current = slider)}>
              {AutoFadeSliderImageData.map((elem, i) => {
                return (
                  <div key={i}>
                    <Img src={`${CommonPath}${elem.image}`} className='img-fluid w-100 image_zoom_cls-0' alt='product' />
                  </div>
                );
              })}
            </Slider>
          </div>
        </Col>
        <Col lg='2'>
          <div className='details-image-vertical black-slide rounded overflow-hidden'>
            <Slider {...ThumbNavSlider} asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
              {AutoFadeSliderImageData.map((elem, i) => {
                return (
                  <div key={i}>
                    <Img src={`${CommonPath}${elem.image}`} className='img-fluid' alt='fashion' />
                  </div>
                );
              })}
            </Slider>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default SliderSection;
