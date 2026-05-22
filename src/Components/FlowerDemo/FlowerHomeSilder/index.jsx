import React, { useEffect, useRef, useState } from 'react';
import BackgroundImage from './BackgroungImage';
import LeftContain from './LeftContain';
import NavSlider from './NavSlider';
import PosterSlider from './PosterSlider';

const FlowerHomeSlider = ({ mainSlider }) => {
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
    <section className='pt-0 home-section home-section-5'>
      <PosterSlider nav2={nav2} slider1={slider1} FlowerHomeSlider={FlowerHomeSlider} />
      <BackgroundImage FlowerHomeSlider={FlowerHomeSlider} />
      <NavSlider nav1={nav1} slider2={slider2} FlowerHomeSlider={FlowerHomeSlider} />
      <LeftContain FlowerHomeSlider={FlowerHomeSlider} />
    </section>
  );
};
export default FlowerHomeSlider;
