import Img from '@/_template/Components/Element/Images';
import { CommonPath } from '@/_template/Constant';
import Slider from 'react-slick';
import { HomeMainSlider } from '../../../Data/SliderSettingsData';

const HomePoster = ({ HomeSliderData, nav2, slider1 }) => {
  return (
    <div className='poster-image slider-for custome-arrow classic-arrow-1'>
      <Slider asNavFor={nav2} {...HomeMainSlider} ref={(slider) => (slider1.current = slider)}>
        {HomeSliderData.map((el) => {
          return el.backgroundimages.map((elem, i) => {
            return (
              <div key={i}>
                <Img src={`${CommonPath}/${elem.image}`} className='img-fluid' alt='slider' />
              </div>
            );
          });
        })}
      </Slider>
    </div>
  );
};

export default HomePoster;
