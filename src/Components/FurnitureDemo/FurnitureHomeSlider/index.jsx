import { useEffect, useRef, useState } from 'react';
import LeftContain from './LeftContain';
import NavSlider from './NavSlider';
import PosterSlider from './PosterSlider';

const FurnitureHomeSlider = ({ mainSlider }) => {
  const PosterFilter = mainSlider.filter((el) => el.type === 'furniture');
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
    <section className='pt-0 home-section home-section-4'>
      <PosterSlider nav2={nav2} slider1={slider1} PosterFilter={PosterFilter} />
      <NavSlider nav1={nav1} slider2={slider2} PosterFilter={PosterFilter} />
      <LeftContain PosterFilter={PosterFilter} />
    </section>
  );
};

export default FurnitureHomeSlider;
