import Img from '@/Components/Element/Images';
import { useEffect, useRef, useState } from 'react';
import VegeLeftContain from './VegeLeftContain';
import HomeNav from './HomeNav';
import HomePoster from './HomePoster';
const HomeSlider = ({ mainSlider }) => {
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
  const HomeSliderData = mainSlider.filter((el) => el.type === 'vegetables');
  return (
    <section className='pt-0 home-section home-section-6'>
      <HomePoster HomeSliderData={HomeSliderData} nav2={nav2} slider1={slider1} />
      <div className='background-circle'>
        <Img src='/assets/images/vegetable/poster/circle.png' className='img-fluid' alt='producto' />
      </div>
      <HomeNav HomeSliderData={HomeSliderData} nav1={nav1} slider2={slider2} />

      <VegeLeftContain HomeSliderData={HomeSliderData} />
    </section>
  );
};
export default HomeSlider;
