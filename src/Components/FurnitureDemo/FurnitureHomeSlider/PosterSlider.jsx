/* eslint-disable @next/next/no-img-element */
import { CommonPath, Next, Prev } from '@/Constant';
import Slider from 'react-slick';

const PosterSlider = ({ nav2, slider1, PosterFilter }) => {
  const PosterSlider = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <Slider {...PosterSlider} asNavFor={nav2} ref={(slider) => (slider1.current = slider)} className='poster-image slider-for custome-arrow classic-arrow'>
      {PosterFilter.map((el) => {
        return el.horizontalimage.map((elem, i) => {
          return (
            <div key={i}>
              <img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='arrow' />
            </div>
          );
        });
      })}
    </Slider>
  );
};

export default PosterSlider;

export const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className='custom-arrow next' onClick={onClick}>
      <span>{Next}</span>
      <i className='fas fa-chevron-right ms-3'></i>
    </div>
  );
};

export const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className='custom-arrow prev' onClick={onClick}>
      <i className='fas fa-chevron-left me-3'></i>
      <span>{Prev}</span>
    </div>
  );
};
