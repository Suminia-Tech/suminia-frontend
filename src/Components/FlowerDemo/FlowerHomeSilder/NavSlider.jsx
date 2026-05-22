/* eslint-disable @next/next/no-img-element */
import Slider from "react-slick";
const NavSlider = ({ nav1, slider2 }) => {
  return (
    <div className="slider-nav image-show slider-thumbnail" style={{ height: 290, overflow: "hidden" }}>
      <Slider asNavFor={nav1} ref={(slider) => (slider2.current = slider)} slidesToShow={2} slidesToScroll={1} focusOnSelect={true} infinite={true} arrows={true}>
        <div>
          <div className="poster-img">
            <img src="/assets/images/flower/poster/t1.jpg" alt="poster" />
            <div className="overlay-color">
              <p className="theme-color">1</p>
            </div>
          </div>
        </div>
        <div>
          <div className="poster-img">
            <img src="/assets/images/flower/poster/t2.jpg" alt="poster" />
            <div className="overlay-color">
              <p className="theme-color">2</p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default NavSlider;
