import { Mostpopularss } from '@/Constant';
import Slider from 'react-slick';
import { Row } from 'reactstrap';
import SliderProductData from './SliderProductData';

const ShopLeftSlider = () => {
  const setting = { dots: false, infinite: true, arrows: true, slidesToShow: 1, slidesToScroll: 1 };
  return (
    <div className='most-popular'>
      <div className='title title-2 text-lg-start'>
        <h3>{Mostpopularss}</h3>
      </div>

      <div className='product-slider round-arrow1'>
        <Slider {...setting}>
          <div>
            <Row className='g-3'>
              <SliderProductData val={0} val1={3} />
            </Row>
          </div>
          <div>
            <Row className='g-3'>
              <SliderProductData val={3} val1={6} />
            </Row>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default ShopLeftSlider;
